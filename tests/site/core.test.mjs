// Tests du site statique : node --test tests/site/
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { QUESTIONNAIRE as Q } from "../../site/data/questionnaire.js";
import { EXPERT_KEY } from "../../site/data/expert_key.js";
import {
  CONFIG, LABELS, MODULE_ORDER, STORAGE_KEY,
  actPoints, buildCSV, buildExport, buildSteps, clearState, computeScores, createSession,
  isAnswered, isComplete, itemsOf, keyCoversModule, loadState, resultsText, saveState,
  scoreACT, scoreCAP, scoreINT, scoreItem, setActValue, setChoice, shuffle,
} from "../../site/assets/core.js";
import { SOURCE, parseQuestionnaire, render } from "../../tools/build-questionnaire.mjs";

const SITE = new URL("../../site/", import.meta.url).pathname;

// Generateur pseudo-aleatoire deterministe (mulberry32), pour les tests.
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
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    _map: m,
  };
}

// Cle FICTIVE, reservee aux tests : elle ne doit jamais quitter ce fichier.
// Pour chaque item : A=0, B=100, C=50, D=25.
function fakeKey() {
  const key = {};
  for (const i of [...itemsOf(Q, "CAP"), ...itemsOf(Q, "INT")]) key[i.id] = { A: 0, B: 100, C: 50, D: 25 };
  return key;
}

function answerAll(state, { best = "B", worst = "A", act = 3 } = {}) {
  for (const i of Q.items) {
    if (i.module === "ACT") setActValue(state, i.id, act);
    else {
      assert.ok(setChoice(state, i.id, "best", best));
      assert.ok(setChoice(state, i.id, "worst", worst));
    }
  }
}

// --- Donnees ----------------------------------------------------------------

test("le questionnaire contient 56 items repartis CAP 36 / ACT 12 / INT 8", () => {
  assert.equal(Q.items.length, 56);
  assert.equal(itemsOf(Q, "CAP").length, 36);
  assert.equal(itemsOf(Q, "ACT").length, 12);
  assert.equal(itemsOf(Q, "INT").length, 8);
  assert.deepEqual(Q.items.map((i) => i.id), Array.from({ length: 56 }, (_, k) => `Q${k + 1}`));
  assert.equal(Object.keys(Q.mechanisms).length, 12);
});

test("chaque mecanisme a exactement trois items CAP et un item ACT, dans l'ordre", () => {
  for (const m of Object.keys(Q.mechanisms)) {
    assert.equal(itemsOf(Q, "CAP").filter((i) => i.mechanism === m).length, 3, m);
  }
  itemsOf(Q, "ACT").forEach((item, k) => {
    assert.equal(item.id, `Q${37 + k}`);
    assert.equal(item.mechanism, `M${k + 1}`);
  });
});

test("CAP et INT ont quatre options A-D non vides, ACT aucune", () => {
  for (const i of Q.items) {
    if (i.module === "ACT") assert.equal(i.options.length, 0, i.id);
    else {
      assert.deepEqual(i.options.map((o) => o.id), ["A", "B", "C", "D"], i.id);
      for (const o of i.options) assert.ok(o.text.length > 10, `${i.id}${o.id}`);
    }
    assert.ok(i.text.length >= 1, i.id);
  }
});

test("l'echelle ACT est 0-4 plus X", () => {
  assert.deepEqual(Q.modules.ACT.scale.map((s) => s.value), [0, 1, 2, 3, 4, "X"]);
});

test("site/data/questionnaire.js est a jour par rapport au Markdown source", { skip: !existsSync(SOURCE) && "source absente" }, () => {
  const fresh = render(parseQuestionnaire(readFileSync(SOURCE, "utf8")));
  assert.equal(readFileSync(join(SITE, "data/questionnaire.js"), "utf8"), fresh);
});

test("aucune cle experte n'est livree", () => {
  assert.equal(EXPERT_KEY, null);
});

// --- Session et randomisation ---------------------------------------------

test("ordre des modules : CAP, INT puis ACT", () => {
  assert.deepEqual(MODULE_ORDER, ["CAP", "INT", "ACT"]);
  const steps = buildSteps(createSession(Q, CONFIG, seeded(1)));
  const modules = steps.filter((s) => s.type === "item").map((s) => s.module);
  assert.deepEqual([...new Set(modules)], ["CAP", "INT", "ACT"]);
  assert.equal(steps.at(-1).type, "results");
  assert.equal(steps.filter((s) => s.type === "intro").length, 3);
});

test("la randomisation conserve les identifiants canoniques", () => {
  const s = createSession(Q, { randomizeQuestionsWithinModule: true, randomizeOptions: true }, seeded(42));
  for (const mod of MODULE_ORDER) {
    assert.deepEqual(s.questionOrder[mod].slice().sort(), itemsOf(Q, mod).map((i) => i.id).sort());
  }
  let reordered = 0;
  for (const i of Q.items.filter((i) => i.options.length)) {
    assert.deepEqual(s.presentation[i.id].slice().sort(), ["A", "B", "C", "D"]);
    if (s.presentation[i.id].join("") !== "ABCD") reordered++;
  }
  assert.ok(reordered > 0, "les options devraient etre melangees");
  assert.notDeepEqual(s.questionOrder.CAP, itemsOf(Q, "CAP").map((i) => i.id));
});

test("sans randomisation, l'ordre canonique est conserve", () => {
  const s = createSession(Q, { randomizeQuestionsWithinModule: false, randomizeOptions: false });
  assert.deepEqual(s.questionOrder.CAP, itemsOf(Q, "CAP").map((i) => i.id));
  assert.deepEqual(s.presentation.Q1, ["A", "B", "C", "D"]);
});

test("le score ne depend pas de l'ordre presente", () => {
  const key = fakeKey();
  const scores = [1, 2, 3].map((seed) => {
    const s = createSession(Q, CONFIG, seeded(seed));
    answerAll(s);
    return computeScores(Q, s, key);
  });
  assert.deepEqual(scores[0], scores[1]);
  assert.deepEqual(scores[1], scores[2]);
});

test("shuffle est une permutation", () => {
  const a = Array.from({ length: 20 }, (_, i) => i);
  assert.deepEqual(shuffle(a, seeded(7)).sort((x, y) => x - y), a);
});

// --- Reponses ---------------------------------------------------------------

test("impossible de choisir la meme option comme PLUS et MOINS efficace", () => {
  const s = createSession(Q);
  assert.ok(setChoice(s, "Q1", "best", "B"));
  assert.equal(setChoice(s, "Q1", "worst", "B"), false);
  assert.equal(s.responses.Q1.worst, undefined);
  assert.equal(isAnswered(Q.items[0], s.responses.Q1), false);
  assert.ok(setChoice(s, "Q1", "worst", "D"));
  assert.equal(setChoice(s, "Q1", "best", "D"), false);
  assert.deepEqual(s.responses.Q1, { best: "B", worst: "D" });
  assert.ok(isAnswered(Q.items[0], s.responses.Q1));
  // Une reponse forgee identique n'est jamais consideree comme complete.
  assert.equal(isAnswered(Q.items[0], { best: "A", worst: "A" }), false);
});

test("options et valeurs invalides refusees", () => {
  const s = createSession(Q);
  assert.equal(setChoice(s, "Q1", "best", "E"), false);
  assert.equal(setActValue(s, "Q37", 5), false);
  assert.equal(setActValue(s, "Q37", "3"), false);
  assert.ok(setActValue(s, "Q37", "X"));
  assert.ok(setActValue(s, "Q37", 0));
});

// --- Scoring ACT ----------------------------------------------------------

test("ACT est transforme en 0/25/50/75/100", () => {
  assert.deepEqual([0, 1, 2, 3, 4].map(actPoints), [0, 25, 50, 75, 100]);
});

test("X est traite comme manquant, jamais comme 0", () => {
  assert.equal(actPoints("X"), null);
  const s = createSession(Q);
  const acts = itemsOf(Q, "ACT");
  setActValue(s, acts[0].id, 4); // M1 -> 100
  setActValue(s, acts[1].id, "X"); // M2 -> manquant
  setActValue(s, acts[2].id, 2); // M3 -> 50
  for (const i of acts.slice(3)) setActValue(s, i.id, "X");
  const act = scoreACT(Q, s.responses);
  assert.equal(act.byMechanism.M1, 100);
  assert.equal(act.byMechanism.M2, null);
  assert.equal(act.byMechanism.M3, 50);
  assert.equal(act.global, 75); // (100 + 50) / 2, et non (100 + 0 + 50 + 0...) / 12
  assert.equal(act.available, 2);
  assert.equal(act.label, "Activation déclarée — score descriptif");
});

test("ACT global non calculable si tout est X", () => {
  const s = createSession(Q);
  for (const i of itemsOf(Q, "ACT")) setActValue(s, i.id, "X");
  assert.equal(scoreACT(Q, s.responses).global, null);
});

// --- Scoring CAP / INT ----------------------------------------------------

test("CAP et INT restent null sans cle experte", () => {
  const s = createSession(Q);
  answerAll(s);
  const scores = computeScores(Q, s, EXPERT_KEY);
  assert.equal(scores.CAP, null);
  assert.equal(scores.INT, null);
  assert.equal(computeScores(Q, s, {}).CAP, null);
  assert.equal(computeScores(Q, s, undefined).INT, null);
});

test("une cle incomplete ou degeneree ne produit aucun score", () => {
  const s = createSession(Q);
  answerAll(s);
  const partial = fakeKey();
  delete partial.Q12;
  assert.equal(scoreCAP(Q, s.responses, partial), null);
  assert.notEqual(scoreINT(Q, s.responses, partial), null); // INT reste complet
  const flat = fakeKey();
  flat.Q50 = { A: 50, B: 50, C: 50, D: 50 };
  assert.equal(keyCoversModule(Q, flat, "INT"), false);
  const outOfRange = fakeKey();
  outOfRange.Q1.A = 120;
  assert.equal(keyCoversModule(Q, outOfRange, "CAP"), false);
});

test("formule par item conforme a SCORING_SPEC.md", () => {
  // K = A0 B100 C50 D25 : deja normalise.
  const k = { A: 0, B: 100, C: 50, D: 25 };
  assert.equal(scoreItem(k, "B", "A"), 100);
  assert.equal(scoreItem(k, "A", "B"), 0);
  assert.equal(scoreItem(k, "C", "D"), (50 + 75) / 2);
  // Normalisation : K = 20..60 -> K' = 0..100.
  const k2 = { A: 20, B: 60, C: 40, D: 30 };
  assert.equal(scoreItem(k2, "C", "D"), (50 + (100 - 25)) / 2);
});

test("scoring CAP/INT correct avec une cle fictive", () => {
  const key = fakeKey();
  const s = createSession(Q, CONFIG, seeded(3));
  answerAll(s, { best: "B", worst: "A" });
  let scores = computeScores(Q, s, key);
  assert.equal(scores.CAP.global, 100);
  assert.equal(scores.INT.global, 100);
  assert.equal(scores.CAP.label, LABELS.EXPERIMENTAL);
  for (const v of Object.values(scores.CAP.byMechanism)) assert.equal(v, 100);

  // M1 : un item mal juge (best=A, worst=B -> 0), deux parfaits -> 66,7.
  setChoice(s, "Q1", "worst", "C");
  setChoice(s, "Q1", "best", "A");
  setChoice(s, "Q1", "worst", "B");
  scores = computeScores(Q, s, key);
  assert.equal(scores.CAP.byMechanism.M1, 66.7);
  assert.equal(scores.CAP.byMechanism.M2, 100);
  // CAP global = moyenne des 12 CAP_i, pas des 36 items.
  assert.equal(scores.CAP.global, Math.round(((200 / 3 + 11 * 100) / 12) * 10) / 10);
  assert.equal(scores.INT.global, 100);

  // INT : best=C (50), worst=D (100-25=75) -> 62,5 sur Q49.
  setChoice(s, "Q49", "worst", "D");
  setChoice(s, "Q49", "best", "C");
  scores = computeScores(Q, s, key);
  assert.equal(scores.INT.byItem.Q49, 62.5);
  assert.equal(scores.INT.global, Math.round(((62.5 + 7 * 100) / 8) * 10) / 10);
});

test("aucun score n'est fusionne ni presente comme percentile", () => {
  const s = createSession(Q);
  answerAll(s);
  const scores = computeScores(Q, s, fakeKey());
  assert.deepEqual(Object.keys(scores).sort(), ["ACT", "CAP", "INT"]);
  assert.ok(!JSON.stringify(scores).toLowerCase().includes("percentile"));
});

// --- Sauvegarde -----------------------------------------------------------

test("localStorage restaure l'etat", () => {
  const storage = memoryStorage();
  const s = createSession(Q, CONFIG, seeded(9));
  setChoice(s, "Q5", "best", "B");
  setChoice(s, "Q5", "worst", "A");
  setActValue(s, "Q40", "X");
  s.cursor = 7;
  assert.ok(saveState(storage, s));
  assert.ok(storage._map.has(STORAGE_KEY));
  const restored = loadState(storage, Q);
  assert.deepEqual(restored, s);
  clearState(storage);
  assert.equal(loadState(storage, Q), null);
});

test("un etat corrompu ou d'une autre version est ignore", () => {
  const storage = memoryStorage();
  storage.setItem(STORAGE_KEY, "{pas du json");
  assert.equal(loadState(storage, Q), null);
  const s = createSession(Q);
  storage.setItem(STORAGE_KEY, JSON.stringify({ ...s, version: "2.0" }));
  assert.equal(loadState(storage, Q), null);
  const broken = structuredClone(s);
  broken.presentation.Q1 = ["A", "A", "C", "D"];
  storage.setItem(STORAGE_KEY, JSON.stringify(broken));
  assert.equal(loadState(storage, Q), null);
});

test("un stockage indisponible n'interrompt pas le questionnaire", () => {
  const throwing = { getItem() { throw new Error("bloque"); }, setItem() { throw new Error("plein"); }, removeItem() { throw new Error("bloque"); } };
  assert.equal(saveState(throwing, createSession(Q)), false);
  assert.equal(loadState(throwing, Q), null);
  clearState(throwing);
});

// --- Export ---------------------------------------------------------------

test("export JSON fidele", () => {
  const s = createSession(Q, CONFIG, seeded(5));
  answerAll(s, { best: "C", worst: "D", act: 2 });
  setActValue(s, "Q41", "X");
  s.completedAt = "2026-10-22T10:00:00.000Z";
  const exp = JSON.parse(JSON.stringify(buildExport(Q, s, EXPERT_KEY)));
  assert.equal(exp.instrument, "IAM");
  assert.equal(exp.version, "2.1");
  assert.equal(exp.title, "Indice d’Activation et de Maîtrise des mécanismes");
  assert.equal(exp.startedAt, s.startedAt);
  assert.equal(exp.completedAt, "2026-10-22T10:00:00.000Z");
  assert.equal(Object.keys(exp.responses).length, 56);
  assert.deepEqual(exp.responses.Q1, { best: "C", worst: "D" });
  assert.deepEqual(exp.responses.Q49, { best: "C", worst: "D" });
  assert.deepEqual(exp.responses.Q37, { value: 2 });
  assert.deepEqual(exp.responses.Q41, { value: "X" });
  assert.deepEqual(exp.presentation, s.presentation);
  assert.deepEqual(exp.questionOrder, s.questionOrder);
  assert.equal(exp.scores.CAP, null);
  assert.equal(exp.scores.INT, null);
  assert.equal(exp.scores.ACT.byMechanism.M5, null);
  assert.equal(exp.scores.ACT.global, 50);
});

test("export CSV fidele", () => {
  const s = createSession(Q, CONFIG, seeded(6));
  answerAll(s, { best: "B", worst: "D", act: 4 });
  setActValue(s, "Q48", "X");
  const lines = buildCSV(Q, s).trimEnd().split("\n");
  assert.equal(lines.length, 57);
  const header = lines[0].split(",");
  const rows = lines.slice(1).map((l) => Object.fromEntries(l.split(",").map((v, i) => [header[i], v])));
  // Ordre de passation : modules CAP, INT, ACT.
  assert.deepEqual([...new Set(rows.map((r) => r.module))], ["CAP", "INT", "ACT"]);
  assert.deepEqual(rows.map((r) => r.item), [...s.questionOrder.CAP, ...s.questionOrder.INT, ...s.questionOrder.ACT]);
  const q1 = rows.find((r) => r.item === "Q1");
  assert.equal(q1.best, "B");
  assert.equal(q1.worst, "D");
  assert.equal(q1.mechanism, "M1");
  assert.equal(q1.presented_order, s.presentation.Q1.join(""));
  const q48 = rows.find((r) => r.item === "Q48");
  assert.equal(q48.act_value, "X");
  assert.equal(q48.act_points, "");
  assert.equal(rows.find((r) => r.item === "Q37").act_points, "100");
});

test("le texte copie mentionne l'absence de score CAP/INT", () => {
  const s = createSession(Q);
  answerAll(s);
  const txt = resultsText(Q, computeScores(Q, s, null));
  assert.ok(txt.includes(LABELS.CAP_NONE));
  assert.ok(txt.includes(LABELS.INT_NONE));
  assert.ok(txt.includes(LABELS.ACT));
  assert.ok(isComplete(Q, s));
});

// --- Garde-fous sur le contenu publie -------------------------------------

function siteFiles(dir = SITE) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? siteFiles(join(dir, e.name)) : [join(dir, e.name)],
  );
}

test("le site n'envoie rien sur le reseau et ne charge rien de distant", () => {
  for (const f of siteFiles().filter((f) => /\.(js|html|css)$/.test(f))) {
    const src = readFileSync(f, "utf8");
    for (const bad of ["fetch(", "XMLHttpRequest", "sendBeacon", "WebSocket", "document.cookie", "http://", "https://"]) {
      assert.ok(!src.includes(bad), `${f} contient ${bad}`);
    }
  }
});

test("le site ne se presente jamais comme un test Koh-Lanta", () => {
  for (const f of siteFiles()) {
    assert.ok(!/koh.?lanta/i.test(readFileSync(f, "utf8")), f);
  }
});
