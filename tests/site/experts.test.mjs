// Tests de la notation experte : node --test tests/site/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

import { QUESTIONNAIRE as Q } from "../../site/data/questionnaire.js";
import {
  DEVIATION, EXPERT_STORAGE_KEY, attachFeedback, buildExpertExport, clearExpertSession, createExpertSession,
  deviations, doneCount, isItemDone, isItemRated, isSessionComplete, isValidExpertCode, isValidFeedback,
  loadExpertSession, ratedItems, saveExpertSession, setComment, setRating,
} from "../../site/assets/experts-core.js";
import {
  CRITERIA, aggregate, buildFeedback, buildKey, checkFiles, icc2k, median, quantile, report, sd,
} from "../../tools/expert-key.mjs";

const ROOT = new URL("../../", import.meta.url).pathname;
const NOW = new Date("2026-10-23T09:00:00.000Z");
const OPTS = ["A", "B", "C", "D"];

function seeded(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function memoryStorage() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
}

// Notes FICTIVES, reservees aux tests : base A=80 B=20 C=55 D=40, decalee de
// `shift` points pour simuler des experts qui ne notent pas tous pareil.
function rateAll(session, shift = 0) {
  const base = { A: 80, B: 20, C: 55, D: 40 };
  for (const id of session.order) for (const o of OPTS) setRating(session, id, o, Math.max(0, Math.min(100, base[o] + shift)));
}

function expertFile(code, shift, round = 1) {
  const s = createExpertSession(Q, { expert: code, round }, seeded(code.length + shift + 10), NOW);
  if (round === 2) s.feedback = { items: {} };
  rateAll(s, shift);
  s.completedAt = NOW.toISOString();
  return buildExpertExport(Q, s);
}

// --- Session --------------------------------------------------------------

test("la notation porte sur les 70 items CAP et INT, dans un ordre aleatoire", () => {
  assert.equal(ratedItems(Q).length, 70);
  const s = createExpertSession(Q, { expert: "E01", round: 1 }, seeded(1), NOW);
  assert.deepEqual(s.order.slice().sort(), ratedItems(Q).map((i) => i.id).sort());
  assert.notDeepEqual(s.order, ratedItems(Q).map((i) => i.id));
  for (const id of s.order) assert.deepEqual(s.presentation[id].slice().sort(), OPTS);
  assert.ok(!JSON.stringify(s).includes('"M1"'), "aucun code de mecanisme dans la session");
});

test("code expert anonyme et tour valides seulement", () => {
  assert.ok(isValidExpertCode("E01"));
  for (const bad of ["", "prenom.nom@exemple.fr", "un code beaucoup trop long", "E 01"]) assert.equal(isValidExpertCode(bad), false, bad);
  assert.throws(() => createExpertSession(Q, { expert: "E01", round: 3 }));
  assert.throws(() => createExpertSession(Q, { expert: "a b", round: 1 }));
});

test("notes entieres de 0 a 100 seulement ; un item est note quand ses quatre options le sont", () => {
  const s = createExpertSession(Q, { expert: "E01", round: 1 }, seeded(2), NOW);
  assert.equal(setRating(s, "C01", "A", 101), false);
  assert.equal(setRating(s, "C01", "A", 12.5), false);
  assert.equal(setRating(s, "C01", "E", 50), false);
  for (const o of ["A", "B", "C"]) assert.ok(setRating(s, "C01", o, 50));
  assert.equal(isItemRated(s, "C01"), false);
  assert.ok(setRating(s, "C01", "D", 0));
  assert.ok(isItemDone(s, "C01"));
  assert.equal(doneCount(s), 1);
  assert.equal(isSessionComplete(s), false);
});

test("tour 2 : un ecart de plus de 25 points a la mediane doit etre justifie", () => {
  const fb = buildFeedback(Q, aggregate(Q, [expertFile("E01", 0), expertFile("E02", 0)]));
  assert.ok(isValidFeedback(Q, fb));
  const s = createExpertSession(Q, { expert: "E01", round: 2 }, seeded(3), NOW);
  assert.ok(attachFeedback(Q, s, fb));
  // Mediane du groupe : A=80. Une note de 50 s'ecarte de 30 > 25.
  setRating(s, "C01", "A", 80 - DEVIATION - 5);
  for (const o of ["B", "C", "D"]) setRating(s, "C01", o, fb.items.C01[o].median);
  assert.deepEqual(deviations(s, "C01"), ["A"]);
  assert.equal(isItemDone(s, "C01"), false);
  setComment(s, "C01", "L'option A suppose un accord que la situation ne donne pas.");
  assert.ok(isItemDone(s, "C01"));
  setComment(s, "C01", "   ");
  assert.equal(isItemDone(s, "C01"), false);
  // Exactement 25 points d'ecart : pas de justification exigee.
  setRating(s, "C01", "A", 80 - DEVIATION);
  assert.deepEqual(deviations(s, "C01"), []);
});

test("un retour d'une autre version, ou attache a un tour 1, est refuse", () => {
  const fb = buildFeedback(Q, aggregate(Q, [expertFile("E01", 0), expertFile("E02", 0)]));
  assert.equal(isValidFeedback(Q, { ...fb, version: "2.1" }), false);
  const partial = structuredClone(fb);
  delete partial.items.I10;
  assert.equal(isValidFeedback(Q, partial), false);
  const s1 = createExpertSession(Q, { expert: "E01", round: 1 }, seeded(4), NOW);
  assert.equal(attachFeedback(Q, s1, fb), false);
});

test("sauvegarde locale : restauration fidele, etat etranger ignore", () => {
  const storage = memoryStorage();
  const s = createExpertSession(Q, { expert: "E07", round: 1 }, seeded(5), NOW);
  setRating(s, "C10", "B", 70);
  setComment(s, "C10", "ambigu");
  s.cursor = 4;
  assert.ok(saveExpertSession(storage, s));
  assert.deepEqual(loadExpertSession(storage, Q), s);
  storage.setItem(EXPERT_STORAGE_KEY, JSON.stringify({ ...s, version: "2.1" }));
  assert.equal(loadExpertSession(storage, Q), null);
  storage.setItem(EXPERT_STORAGE_KEY, "{casse");
  assert.equal(loadExpertSession(storage, Q), null);
  clearExpertSession(storage);
  assert.equal(loadExpertSession(storage, Q), null);
});

test("l'export ne contient que le code, les notes et les commentaires", () => {
  const s = createExpertSession(Q, { expert: "E03", round: 1 }, seeded(6), NOW);
  rateAll(s);
  setComment(s, "I02", "ok");
  const exp = buildExpertExport(Q, s);
  assert.equal(exp.kind, "expert-ratings");
  assert.equal(exp.version, "2.2");
  assert.equal(exp.complete, true);
  assert.equal(Object.keys(exp.ratings).length, 70);
  assert.deepEqual(exp.ratings.C01, { A: 80, B: 20, C: 55, D: 40 });
  assert.deepEqual(exp.comments, { I02: "ok" });
  assert.deepEqual(Object.keys(exp).sort(), [
    "comments", "complete", "completedAt", "expert", "instrument", "kind", "order", "presentation", "ratings", "round", "startedAt", "version",
  ]);
});

// --- Statistiques -----------------------------------------------------------

test("quantiles par interpolation lineaire et ecart-type d'echantillon", () => {
  assert.equal(median([1, 3, 2]), 2);
  assert.equal(median([1, 2, 3, 4]), 2.5);
  assert.equal(quantile([10, 20, 30, 40, 50], 0.25), 20);
  assert.equal(quantile([1, 2, 3, 4], 0.75), 3.25);
  assert.equal(Math.round(sd([2, 4, 4, 4, 5, 5, 7, 9]) * 1000) / 1000, 2.138);
});

test("ICC(2,k) conforme a l'exemple de Shrout et Fleiss (1979)", () => {
  // Six cibles, quatre juges : ICC(2,1) = 0,29 et ICC(2,4) = 0,62.
  const m = [[9, 2, 5, 8], [6, 1, 3, 2], [8, 4, 6, 8], [7, 1, 2, 6], [10, 5, 6, 9], [6, 2, 4, 7]];
  assert.equal(Math.round(icc2k(m) * 100) / 100, 0.62);
});

// --- Agregation -----------------------------------------------------------

test("des experts concordants donnent une cle complete, aux medianes", () => {
  const files = [-4, -2, 0, 0, 1, 2, 3, 4].map((shift, k) => expertFile(`E0${k + 1}`, shift));
  const { kept, errors } = checkFiles(Q, files);
  assert.deepEqual(errors, []);
  const agg = aggregate(Q, kept);
  assert.equal(agg.C01.raters, 8);
  assert.equal(agg.C01.excluded, false);
  assert.ok(agg.C01.icc >= CRITERIA.minIcc);
  const key = buildKey(Q, agg);
  assert.equal(key.version, Q.version);
  assert.deepEqual(key.excluded, []);
  assert.equal(Object.keys(key.items).length, 70);
  assert.deepEqual(key.items.C01, { A: 80.5, B: 20.5, C: 55.5, D: 40.5 });
});

test("un item sans accord ou peu discriminant est exclu, avec ses raisons", () => {
  const files = [0, 0, 0, 0, 0, 0, 0, 0].map((shift, k) => expertFile(`E0${k + 1}`, shift));
  // C05 : les experts s'opposent sur l'option la meilleure.
  files.forEach((f, k) => { f.ratings.C05 = k % 2 ? { A: 90, B: 10, C: 50, D: 50 } : { A: 10, B: 90, C: 50, D: 50 }; });
  // C06 : tout le monde d'accord, mais les options se valent presque.
  files.forEach((f) => { f.ratings.C06 = { A: 55, B: 45, C: 50, D: 52 }; });
  const agg = aggregate(Q, files);
  assert.ok(agg.C05.excluded);
  assert.ok(agg.C05.reasons.some((r) => r.startsWith("ICC")));
  assert.ok(agg.C06.excluded);
  assert.ok(agg.C06.reasons.some((r) => r.startsWith("ecart de medianes")));
  const key = buildKey(Q, agg);
  assert.deepEqual(key.excluded.sort(), ["C05", "C06"]);
  assert.equal(key.items.C05, undefined);
});

test("fichiers incomplets, en double, d'une autre version ou d'un autre tour signales", () => {
  const ok = expertFile("E01", 0);
  const partial = { ...expertFile("E02", 0), complete: false };
  const dup = expertFile("E01", 1);
  const old = { ...expertFile("E03", 0), version: "2.1" };
  const { kept, errors } = checkFiles(Q, [ok, partial, dup, old]);
  assert.deepEqual(kept.map((f) => f.expert), ["E01"]);
  assert.equal(errors.length, 3);
  const mixed = checkFiles(Q, [ok, expertFile("E04", 0, 2)]);
  assert.ok(mixed.errors.some((e) => e.startsWith("fichiers de tours differents")));
});

test("le retour du tour 1 ne contient ni code expert ni note individuelle", () => {
  const files = [expertFile("E01", 0), expertFile("E02", 2)];
  files[0].comments = { C01: "option B floue" };
  const fb = buildFeedback(Q, aggregate(Q, files));
  const txt = JSON.stringify(fb);
  assert.ok(!txt.includes("E01") && !txt.includes("E02"));
  assert.deepEqual(fb.items.C01.comments, ["option B floue"]);
  assert.deepEqual(Object.keys(fb.items.C01.A).sort(), ["median", "q1", "q3"]);
});

test("le rapport signale les garde-fous du protocole", () => {
  const files = [0, 0, 0, 0, 0, 0, 0, 0].map((shift, k) => expertFile(`E0${k + 1}`, shift));
  for (const id of ["C01", "C02"]) files.forEach((f) => { f.ratings[id] = { A: 50, B: 50, C: 51, D: 49 }; });
  for (const id of ["I01", "I02", "I03"]) files.forEach((f) => { f.ratings[id] = { A: 50, B: 50, C: 51, D: 49 }; });
  const txt = report(Q, 2, files, [], aggregate(Q, files));
  assert.ok(txt.includes("M1 Lecture du système social : 2/5 items CAP exclus"));
  assert.ok(txt.includes("INT ne doit pas etre publie"));
});

test("le script ecrit le rapport et le retour du tour 1, jamais la cle du site", () => {
  const dir = mkdtempSync(join(tmpdir(), "iam-experts-"));
  try {
    const paths = [0, 1, 2].map((shift, k) => {
      const p = join(dir, `E0${k + 1}.json`);
      writeFileSync(p, JSON.stringify(expertFile(`E0${k + 1}`, shift)));
      return p;
    });
    const out = join(dir, "sortie");
    execFileSync("node", [join(ROOT, "tools/expert-key.mjs"), "--out", out, ...paths], { encoding: "utf8", stdio: "pipe" });
    assert.ok(readFileSync(join(out, "rapport-tour1.md"), "utf8").includes("Experts retenus : 3"));
    assert.equal(JSON.parse(readFileSync(join(out, "retour-tour1.json"), "utf8")).kind, "expert-feedback");
    assert.ok(readFileSync(join(ROOT, "site/data/expert_key.js"), "utf8").includes("export const EXPERT_KEY = null;"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("ICC indefini quand les experts s'opposent et que les options se compensent", () => {
  // Deux experts aux notes inversees : chaque option vaut 50 en moyenne.
  assert.equal(icc2k([[90, 10], [10, 90], [50, 50], [50, 50]]), null);
});

test("un fichier de retour glisse parmi les notes est signale sans bloquer", () => {
  const files = [expertFile("E01", 0), expertFile("E02", 1)];
  const fb = buildFeedback(Q, aggregate(Q, files));
  const { round, kept, errors } = checkFiles(Q, [...files, fb]);
  assert.equal(round, 1);
  assert.equal(kept.length, 2);
  assert.equal(errors.length, 1);
});
