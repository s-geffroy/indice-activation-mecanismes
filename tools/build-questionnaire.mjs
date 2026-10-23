#!/usr/bin/env node
// Convertit le Markdown du questionnaire en module ES consomme par le site.
//
//   node tools/build-questionnaire.mjs            ecrit site/data/questionnaire.js
//   node tools/build-questionnaire.mjs --check    echoue si le fichier n'est plus a jour
//
// Le texte des items n'est jamais recopie a la main : on le relit depuis la
// source, pour qu'une correction du questionnaire ne diverge pas du site.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
export const SOURCE = join(root, "specs/IAM_V2_2/QUESTIONNAIRE_IAM_V2_2.md");
export const TARGET = join(root, "site/data/questionnaire.js");
// Copie JSON pour le service de collecte, qui valide les passations recues
// contre le meme questionnaire que le site (son contexte de build est
// src/collect, il ne voit pas site/).
export const COLLECT_TARGET = join(root, "src/collect/questionnaire.json");

// Identite publiee de l'instrument. La version suit celle du questionnaire
// source ; c'est ici, et non dans les specs, qu'elles sont fixees.
export const IDENTITY = {
  version: "2.2",
  title: "Indice d’Activation et de Maîtrise des mécanismes",
  source: "QUESTIONNAIRE_IAM_V2_2.md",
};

// Duree estimee : lecture a 200 mots/min, plus 8 s par choix (deux pour une
// situation PLUS/MOINS efficace, un pour une ligne ACT).
export const WORDS_PER_MINUTE = 200;
export const SECONDS_PER_CHOICE = 8;

// En-tete d'item : "### C07 — M3 [court]", "### I03 — M5+M8+M12",
// "### A14 — M5 (inversé)", "### V1 — contrôle [court] = 3".
const ITEM_HEADER = /^### ([CIAV]\d+) — (M\d+(?:\+M\d+)*|contrôle)( \(inversé\))?( \[court\])?(?: = ([0-4]))?$/;

export function parseQuestionnaire(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n").map((l) => l.replace(/\s+$/, ""));
  const q = { instrument: "IAM", version: "", title: "", subtitle: "", mechanisms: {}, modules: {}, items: [] };
  let module = null;
  let section = null; // "dimensions" | "consigne" | "item" | "scoring"
  let item = null;

  const flushItem = () => {
    if (!item) return;
    item.text = joinParagraphs(item.text);
    q.items.push(item);
    item = null;
  };

  for (const line of lines) {
    let m;
    if ((m = line.match(/^# IAM V(\S+)$/))) { q.version = m[1]; continue; }
    if ((m = line.match(/^## (Indice .+)$/)) && !q.title) {
      [q.title, q.subtitle] = m[1].split(/\s+—\s+/);
      section = null;
      continue;
    }
    if (line === "## Dimensions") { section = "dimensions"; continue; }
    if ((m = line.match(/^# Module (CAP|ACT|INT)\b/))) {
      flushItem();
      module = m[1];
      q.modules[module] = { consigne: [], scale: [] };
      section = null;
      continue;
    }
    if (line.startsWith("# Note de scoring")) { flushItem(); module = null; section = "scoring"; continue; }
    if (line === "## Consigne") { section = "consigne"; continue; }
    if (line.startsWith("### ")) {
      flushItem();
      if (!(m = line.match(ITEM_HEADER))) throw new Error(`en-tete d'item illisible : ${line}`);
      const [, id, tag, reversed, short, expected] = m;
      const mechs = tag === "contrôle" ? [] : tag.split("+");
      item = {
        id, module,
        mechanism: module === "INT" || !mechs.length ? null : mechs[0],
        ...(module === "INT" ? { mechanisms: mechs } : {}),
        ...(module === "ACT" ? { reversed: Boolean(reversed) } : {}),
        ...(tag === "contrôle" ? { check: Number(expected) } : {}),
        short: Boolean(short),
        text: [], options: [],
      };
      section = "item";
      continue;
    }
    if (line === "---") continue;

    if (section === "dimensions" && (m = line.match(/^\| (M\d+) \| (.+) \|$/))) {
      q.mechanisms[m[1]] = m[2];
    } else if (section === "consigne") {
      if ((m = line.match(/^([0-4X]) — (.+)$/))) {
        q.modules[module].scale.push({ value: m[1] === "X" ? "X" : Number(m[1]), label: m[2] });
      } else {
        q.modules[module].consigne.push(line);
      }
    } else if (section === "item") {
      if ((m = line.match(/^([A-D])\. (.+)$/))) item.options.push({ id: m[1], text: m[2] });
      else item.text.push(line);
    }
  }
  flushItem();
  for (const mod of Object.values(q.modules)) mod.consigne = joinParagraphs(mod.consigne);
  q.forms = {
    court: q.items.filter((i) => i.short).map((i) => i.id),
    complet: q.items.map((i) => i.id),
  };
  q.estimatedMinutes = Object.fromEntries(
    Object.entries(q.forms).map(([form, ids]) => [form, estimateMinutes(q.items.filter((i) => ids.includes(i.id)))]),
  );
  return { ...q, ...IDENTITY };
}

export function wordCount(s) {
  return s.split(/\s+/).filter((w) => /\p{L}|\d/u.test(w)).length;
}

export function estimateMinutes(items) {
  const seconds = items.reduce((total, i) => {
    const words = wordCount([...i.text, ...i.options.map((o) => o.text)].join(" "));
    return total + (60 * words) / WORDS_PER_MINUTE + SECONDS_PER_CHOICE * (i.options.length ? 2 : 1);
  }, 0);
  return Math.ceil(seconds / 60);
}

// Lignes -> paragraphes (une ligne vide separe deux paragraphes ; les listes
// "1. ..." restent une ligne chacune).
function joinParagraphs(lines) {
  const out = [];
  let cur = [];
  const push = () => { if (cur.length) out.push(cur.join(" ")); cur = []; };
  for (const l of lines) {
    if (l === "") push();
    else if (/^\d+\. /.test(l)) { push(); out.push(l); }
    else cur.push(l.trim());
  }
  push();
  return out;
}

export function render(q) {
  return (
    "// GENERE par tools/build-questionnaire.mjs depuis\n" +
    `// ${IDENTITY.source} (voir specs/) -- ne pas editer a la main.\n` +
    `export const QUESTIONNAIRE = ${JSON.stringify(q, null, 2)};\n`
  );
}

export function renderJSON(q) {
  return JSON.stringify(q, null, 2) + "\n";
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const q = parseQuestionnaire(readFileSync(SOURCE, "utf8"));
  const out = render(q);
  const json = renderJSON(q);
  if (process.argv.includes("--check")) {
    const stale = [[TARGET, out], [COLLECT_TARGET, json]].filter(([path, content]) => {
      try {
        return readFileSync(path, "utf8") !== content;
      } catch {
        return true;
      }
    });
    if (stale.length) {
      console.error(`${stale.map(([p]) => p).join(", ")} : plus a jour, relancer tools/build-questionnaire.mjs`);
      process.exit(1);
    }
    console.log("site/data/questionnaire.js et src/collect/questionnaire.json a jour");
  } else {
    writeFileSync(TARGET, out);
    writeFileSync(COLLECT_TARGET, json);
    console.log(`ecrit ${TARGET} (${q.forms.complet.length} items ; ${q.forms.court.length} en forme courte)`);
    console.log(`duree estimee : courte ${q.estimatedMinutes.court} min, complete ${q.estimatedMinutes.complet} min`);
  }
}
