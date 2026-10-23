#!/usr/bin/env node
// Agrege les fichiers de notation des experts (exportes par site/experts/)
// selon specs/IAM_V2_2/PROTOCOLE_CLE_EXPERTE.md.
//
//   node tools/expert-key.mjs --out <dossier> notes/*.json
//
// Ecrit dans <dossier> :
// - rapport-tour<N>.md : accord par item, items exclus et pourquoi ;
// - tour 1 : retour-tour1.json, a charger par les experts au tour 2
//   (medianes, intervalles interquartiles, commentaires anonymises) ;
// - tour 2 : expert_key.candidate.js, cle candidate au format de
//   site/data/expert_key.js. Elle n'est jamais copiee dans le site par ce
//   script : c'est une decision humaine, apres lecture du rapport.
//
// Les notes brutes ne doivent pas etre versionnees dans ce depot public.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { QUESTIONNAIRE as Q } from "../site/data/questionnaire.js";

const OPTION_IDS = ["A", "B", "C", "D"];

// Criteres du protocole.
export const CRITERIA = {
  minExperts: 8,
  minIcc: 0.7,
  maxSdExtremes: 20,
  minGap: 30,
};

const round1 = (x) => Math.round(x * 10) / 10;
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

// Quantile par interpolation lineaire (type 7, celui de R et de NumPy).
export function quantile(xs, p) {
  const s = xs.slice().sort((a, b) => a - b);
  const pos = (s.length - 1) * p;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return s[lo] + (s[hi] - s[lo]) * (pos - lo);
}

export const median = (xs) => quantile(xs, 0.5);

export function sd(xs) {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1));
}

// ICC(2,k) de Shrout et Fleiss (1979) : effets aleatoires a deux facteurs,
// accord absolu, moyenne des k juges. matrix[cible][juge] ; ici, une cible
// est une option de l'item.
export function icc2k(matrix) {
  const n = matrix.length;
  const k = matrix[0].length;
  const grand = mean(matrix.flat());
  const rowMeans = matrix.map(mean);
  const colMeans = Array.from({ length: k }, (_, j) => mean(matrix.map((r) => r[j])));
  const ssr = k * rowMeans.reduce((a, m) => a + (m - grand) ** 2, 0);
  const ssc = n * colMeans.reduce((a, m) => a + (m - grand) ** 2, 0);
  const sst = matrix.flat().reduce((a, x) => a + (x - grand) ** 2, 0);
  const sse = sst - ssr - ssc;
  const msr = ssr / (n - 1);
  const msc = ssc / (k - 1);
  const mse = sse / ((n - 1) * (k - 1));
  const denom = msr + (msc - mse) / n;
  // Denominateur nul ou negatif (options notees en moyenne pareil, experts
  // opposes) : l'ICC n'a pas de sens, l'item ne peut pas etre retenu.
  return denom <= 0 ? null : (msr - mse) / denom;
}

// Verifie les fichiers d'un meme tour et renvoie les experts retenus.
export function checkFiles(q, files) {
  const errors = [];
  // Le tour se lit sur les seuls fichiers de notation : un retour ou un autre
  // JSON glisse dans le dossier est signale plus bas, sans tout bloquer.
  const rounds = new Set(files.filter((f) => f.kind === "expert-ratings").map((f) => f.round));
  if (rounds.size !== 1) errors.push(`fichiers de tours differents : ${[...rounds].join(", ")}`);
  const seen = new Set();
  const kept = [];
  for (const f of files) {
    const who = f.expert ?? "?";
    if (f.kind !== "expert-ratings" || f.instrument !== q.instrument) errors.push(`${who} : ce n'est pas un fichier de notation IAM`);
    else if (f.version !== q.version) errors.push(`${who} : version ${f.version}, attendu ${q.version}`);
    else if (seen.has(who)) errors.push(`${who} : code expert en double`);
    else if (!f.complete) errors.push(`${who} : notation incomplete, fichier ignore`);
    else {
      seen.add(who);
      kept.push(f);
    }
  }
  return { round: [...rounds][0], kept, errors };
}

// Statistiques et decision par item, sur les experts qui ont note les quatre
// options.
export function aggregate(q, files) {
  const items = q.items.filter((i) => i.module === "CAP" || i.module === "INT");
  const out = {};
  for (const item of items) {
    const raters = files.filter((f) => OPTION_IDS.every((o) => Number.isInteger(f.ratings?.[item.id]?.[o])));
    const stats = {};
    for (const o of OPTION_IDS) {
      const xs = raters.map((f) => f.ratings[item.id][o]);
      stats[o] = xs.length
        ? { median: round1(median(xs)), q1: round1(quantile(xs, 0.25)), q3: round1(quantile(xs, 0.75)), sd: round1(sd(xs)) }
        : null;
    }
    const reasons = [];
    let icc = null;
    let gap = null;
    if (raters.length < 2) reasons.push("moins de deux experts");
    else {
      icc = icc2k(OPTION_IDS.map((o) => raters.map((f) => f.ratings[item.id][o])));
      const byMedian = OPTION_IDS.slice().sort((a, b) => stats[b].median - stats[a].median);
      const [top, bottom] = [byMedian[0], byMedian.at(-1)];
      gap = round1(stats[top].median - stats[bottom].median);
      if (icc === null || icc < CRITERIA.minIcc) reasons.push(`ICC ${icc === null ? "indefini" : icc.toFixed(2)} < ${CRITERIA.minIcc}`);
      for (const o of [top, bottom]) {
        if (stats[o].sd > CRITERIA.maxSdExtremes) reasons.push(`ecart-type ${stats[o].sd} > ${CRITERIA.maxSdExtremes} sur ${o}`);
      }
      if (gap < CRITERIA.minGap) reasons.push(`ecart de medianes ${gap} < ${CRITERIA.minGap}`);
    }
    const comments = files.map((f) => f.comments?.[item.id]).filter((c) => typeof c === "string" && c.trim());
    out[item.id] = {
      module: item.module,
      mechanism: item.mechanisms ? item.mechanisms.join("+") : item.mechanism,
      raters: raters.length,
      icc: icc === null ? null : Math.round(icc * 100) / 100,
      gap,
      stats,
      comments,
      excluded: reasons.length > 0,
      reasons,
    };
  }
  return out;
}

export function buildFeedback(q, agg) {
  const items = {};
  for (const [id, a] of Object.entries(agg)) {
    if (!a.stats.A) continue;
    items[id] = Object.fromEntries(OPTION_IDS.map((o) => [o, { median: a.stats[o].median, q1: a.stats[o].q1, q3: a.stats[o].q3 }]));
    // Commentaires anonymises : melanges, sans code expert.
    items[id].comments = a.comments.slice().sort();
  }
  return { instrument: q.instrument, version: q.version, kind: "expert-feedback", round: 1, items };
}

export function buildKey(q, agg) {
  const items = {};
  const excluded = [];
  for (const [id, a] of Object.entries(agg)) {
    if (a.excluded) excluded.push(id);
    else items[id] = Object.fromEntries(OPTION_IDS.map((o) => [o, a.stats[o].median]));
  }
  return { version: q.version, excluded, items };
}

export function report(q, round, files, errors, agg) {
  const rows = Object.entries(agg);
  const excl = rows.filter(([, a]) => a.excluded);
  const lines = [
    `# Cle experte IAM V${q.version} — rapport du tour ${round}`,
    "",
    `- Experts retenus : ${files.length} (minimum ${CRITERIA.minExperts}) : ${files.map((f) => f.expert).join(", ") || "aucun"}`,
    `- Items notes : ${rows.length} ; exclus : ${excl.length}`,
    `- Criteres : ICC(2,k) >= ${CRITERIA.minIcc} ; ecart-type des options extremes <= ${CRITERIA.maxSdExtremes} ; ecart de medianes >= ${CRITERIA.minGap}`,
    "",
  ];
  if (errors.length) lines.push("## Fichiers ecartes ou anomalies", "", ...errors.map((e) => `- ${e}`), "");
  lines.push("## Garde-fous du protocole", "");
  for (const m of Object.keys(q.mechanisms)) {
    const ids = rows.filter(([, a]) => a.module === "CAP" && a.mechanism === m);
    const n = ids.filter(([, a]) => a.excluded).length;
    if (n / ids.length > 0.2) lines.push(`- ${m} ${q.mechanisms[m]} : ${n}/${ids.length} items CAP exclus (> 20 %) — score par mecanisme fragile`);
  }
  const intExcl = rows.filter(([, a]) => a.module === "INT" && a.excluded).length;
  if (intExcl > 2) lines.push(`- INT : ${intExcl} items exclus sur 10 (> 2) — INT ne doit pas etre publie`);
  if (lines.at(-1) === "") lines.push("- aucun depassement");
  lines.push("", "## Detail par item", "", "| item | mecanisme | experts | ICC | ecart | A | B | C | D | decision |", "|---|---|---|---|---|---|---|---|---|---|");
  for (const [id, a] of rows) {
    const cell = (o) => (a.stats[o] ? `${a.stats[o].median} (${a.stats[o].q1}-${a.stats[o].q3})` : "—");
    lines.push(`| ${id} | ${a.mechanism} | ${a.raters} | ${a.icc ?? "—"} | ${a.gap ?? "—"} | ${cell("A")} | ${cell("B")} | ${cell("C")} | ${cell("D")} | ${a.excluded ? `exclu : ${a.reasons.join(" ; ")}` : "retenu"} |`);
  }
  const commented = rows.filter(([, a]) => a.comments.length);
  if (commented.length) {
    lines.push("", "## Commentaires (anonymises)", "");
    for (const [id, a] of commented) lines.push(`- **${id}** : ${a.comments.map((c) => c.replace(/\s+/g, " ")).join(" / ")}`);
  }
  return lines.join("\n") + "\n";
}

function main(argv) {
  const outIdx = argv.indexOf("--out");
  if (outIdx < 0 || !argv[outIdx + 1]) {
    console.error("usage : node tools/expert-key.mjs --out <dossier> notes/*.json");
    process.exit(2);
  }
  const outDir = argv[outIdx + 1];
  const paths = argv.filter((a, i) => i !== outIdx && i !== outIdx + 1);
  if (!paths.length) {
    console.error("aucun fichier de notation fourni");
    process.exit(2);
  }
  const parsed = paths.map((p) => {
    try {
      return JSON.parse(readFileSync(p, "utf8"));
    } catch (e) {
      console.error(`${p} : illisible (${e.message})`);
      process.exit(1);
    }
  });
  const { round, kept, errors } = checkFiles(Q, parsed);
  if (errors.some((e) => e.startsWith("fichiers de tours"))) {
    console.error(errors.join("\n"));
    process.exit(1);
  }
  const agg = aggregate(Q, kept);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, `rapport-tour${round}.md`), report(Q, round, kept, errors, agg));
  console.log(`ecrit ${join(outDir, `rapport-tour${round}.md`)}`);
  if (kept.length < CRITERIA.minExperts) {
    console.warn(`attention : ${kept.length} experts retenus, le protocole en exige ${CRITERIA.minExperts}`);
  }
  if (round === 1) {
    writeFileSync(join(outDir, "retour-tour1.json"), JSON.stringify(buildFeedback(Q, agg), null, 2) + "\n");
    console.log(`ecrit ${join(outDir, "retour-tour1.json")} (a remettre aux experts pour le tour 2)`);
  } else if (kept.length >= CRITERIA.minExperts) {
    const key = buildKey(Q, agg);
    writeFileSync(
      join(outDir, "expert_key.candidate.js"),
      "// Cle CANDIDATE produite par tools/expert-key.mjs (tour 2). A relire avec le\n" +
        "// rapport avant toute copie dans site/data/expert_key.js.\n" +
        `export const EXPERT_KEY = ${JSON.stringify(key, null, 2)};\n`,
    );
    console.log(`ecrit ${join(outDir, "expert_key.candidate.js")} (${Object.keys(key.items).length} items retenus, ${key.excluded.length} exclus)`);
  } else {
    console.warn("pas de cle candidate : nombre d'experts insuffisant");
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
