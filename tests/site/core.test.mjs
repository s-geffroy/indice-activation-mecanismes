// Tests du site statique : node --test tests/site/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { QUESTIONNAIRE as Q } from "../../site/data/questionnaire.js";
import { EXPERT_KEY } from "../../site/data/expert_key.js";
import {
  ACT_MIN_PER_MECHANISM, CONFIG, FORMS, LABELS, MODULE_ORDER, STORAGE_KEY,
  actPoints, answeredCount, attentionChecks, buildCSV, buildExport, buildSteps, clearState, computeScores,
  createSession, formItems, isAnswered, isComplete, itemById, itemsOf, keyCoversModule, loadState,
  resultsText, saveState, scoreACT, scoreCAP, scoreINT, scoreItem, setActValue, setChoice, shuffle,
} from "../../site/assets/core.js";
import { SOURCE, parseQuestionnaire, render, wordCount } from "../../tools/build-questionnaire.mjs";

const SITE = new URL("../../site/", import.meta.url).pathname;
const ROOT = new URL("../../", import.meta.url).pathname;
const NOW = new Date("2026-10-23T09:00:00.000Z");

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

const session = (form = "complet", seed = 1) => createSession(Q, CONFIG, seeded(seed), NOW, form);

// Cle FICTIVE, reservee aux tests : elle ne doit jamais quitter ce fichier.
// Pour chaque item : A=0, B=100, C=50, D=25.
function fakeKey() {
  const items = {};
  for (const i of [...itemsOf(Q, "CAP"), ...itemsOf(Q, "INT")]) items[i.id] = { A: 0, B: 100, C: 50, D: 25 };
  return { version: Q.version, excluded: [], items };
}

// Repond a tous les items de la forme. Les contrôles d'attention recoivent
// la reponse attendue, sauf si checks est fourni.
function answerAll(state, { best = "B", worst = "A", act = 3, checks } = {}) {
  for (const i of formItems(Q, state.form)) {
    if (i.module === "ACT") setActValue(state, i.id, i.check === undefined ? act : checks ?? i.check);
    else {
      assert.ok(setChoice(state, i.id, "best", best));
      assert.ok(setChoice(state, i.id, "worst", worst));
    }
  }
}

const actScored = (form) => itemsOf(Q, "ACT", form).filter((i) => i.check === undefined);

// --- Donnees ----------------------------------------------------------------

test("forme complete : 108 items, CAP 60 / INT 10 / ACT 36 + 2 controles", () => {
  assert.equal(Q.items.length, 108);
  assert.equal(itemsOf(Q, "CAP").length, 60);
  assert.equal(itemsOf(Q, "INT").length, 10);
  assert.equal(itemsOf(Q, "ACT").length, 38);
  assert.equal(actScored().length, 36);
  assert.deepEqual(Q.forms.complet, Q.items.map((i) => i.id));
  assert.equal(new Set(Q.items.map((i) => i.id)).size, Q.items.length);
  assert.equal(Object.keys(Q.mechanisms).length, 12);
});

test("forme courte : 28 items, sous-ensemble de la complete", () => {
  const ids = new Set(Q.forms.complet);
  assert.ok(Q.forms.court.every((id) => ids.has(id)));
  assert.equal(itemsOf(Q, "CAP", "court").length, 12);
  assert.equal(itemsOf(Q, "INT", "court").length, 3);
  assert.equal(actScored("court").length, 12);
  assert.equal(itemsOf(Q, "ACT", "court").filter((i) => i.check !== undefined).length, 1);
  assert.equal(actScored("court").filter((i) => i.reversed).length, 4);
  assert.equal(Q.forms.court.length, 28);
});

test("chaque mecanisme : 5 CAP et 3 ACT (dont au moins un inverse) ; 1 et 1 en forme courte", () => {
  for (const m of Object.keys(Q.mechanisms)) {
    assert.equal(itemsOf(Q, "CAP").filter((i) => i.mechanism === m).length, 5, m);
    const acts = actScored().filter((i) => i.mechanism === m);
    assert.equal(acts.length, 3, m);
    assert.ok(acts.some((i) => i.reversed), `${m} sans item inverse`);
    assert.equal(itemsOf(Q, "CAP", "court").filter((i) => i.mechanism === m).length, 1, m);
    assert.equal(actScored("court").filter((i) => i.mechanism === m).length, 1, m);
  }
});

test("chaque item INT declare deux ou trois mecanismes connus", () => {
  for (const i of itemsOf(Q, "INT")) {
    assert.ok(i.mechanisms.length >= 2 && i.mechanisms.length <= 3, i.id);
    for (const m of i.mechanisms) assert.ok(m in Q.mechanisms, `${i.id} ${m}`);
    assert.equal(new Set(i.mechanisms).size, i.mechanisms.length, i.id);
  }
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

test("l'echelle ACT est 0-4 plus X ; les controles attendent une valeur 0-4", () => {
  assert.deepEqual(Q.modules.ACT.scale.map((s) => s.value), [0, 1, 2, 3, 4, "X"]);
  for (const i of itemsOf(Q, "ACT").filter((i) => i.check !== undefined)) {
    assert.ok(Number.isInteger(i.check) && i.check >= 0 && i.check <= 4, i.id);
    assert.equal(i.mechanism, null);
  }
});

test("site/data/questionnaire.js est a jour par rapport au Markdown source", { skip: !existsSync(SOURCE) && "source absente" }, () => {
  const fresh = render(parseQuestionnaire(readFileSync(SOURCE, "utf8")));
  assert.equal(readFileSync(join(SITE, "data/questionnaire.js"), "utf8"), fresh);
});

test("duree estimee : forme courte 16 min au plus, complete 60 min au plus", () => {
  assert.ok(Q.estimatedMinutes.court <= 16, `courte : ${Q.estimatedMinutes.court} min`);
  assert.ok(Q.estimatedMinutes.complet <= 60, `complete : ${Q.estimatedMinutes.complet} min`);
});

test("aucune cle experte n'est livree", () => {
  assert.equal(EXPERT_KEY, null);
});

// --- Regles de redaction (CADRE_IAM_V2_2.md, §Regles) ------------------------

const tokens = (s) => s.toLowerCase().split(/[^\p{L}·]+/u).filter(Boolean);
const FORBIDDEN_IN_OPTIONS = [
  "puisque", "car", "immédiatement", "objectivement", "exactement", "intégralement", "totalement", "complètement",
];
const META_VERB = /^(Évaluer|Comparer|Déterminer|Analyser|Réfléchir|Considérer)\b/u;
// Formes au masculin seul qui designent des personnes en general : on attend
// une tournure epicene ou le point median (fatigué·e, l'ensemble du personnel).
const GENDERED = [
  "fatigué", "fatigués", "épuisé", "épuisés", "convaincu", "dominant", "compétent", "performant",
  "candidat", "candidats", "transparent", "déçu", "irrité", "sollicité", "insistant", "indécis",
  "salariés", "clients", "utilisateurs", "collaborateurs", "employés", "experts",
  "partisans", "élus",
];
const situations = Q.items.filter((i) => i.options.length);

test("redaction : les options sont des actions, sans mot-indice", () => {
  for (const i of situations) {
    for (const o of i.options) {
      const where = `${i.id}${o.id}`;
      const t = tokens(o.text);
      for (const w of FORBIDDEN_IN_OPTIONS) assert.ok(!t.includes(w), `${where} contient « ${w} »`);
      assert.ok(!/\btout en\b/i.test(o.text), `${where} contient « tout en »`);
      assert.ok(!META_VERB.test(o.text), `${where} n'est pas une action : ${o.text}`);
    }
  }
});

test("redaction : options de longueur comparable (rapport 1,6 au plus)", () => {
  for (const i of situations) {
    const n = i.options.map((o) => wordCount(o.text));
    assert.ok(Math.max(...n) <= 1.6 * Math.min(...n), `${i.id} : ${n.join("/")} mots`);
  }
});

test("redaction : enonce de 90 mots au plus, termine par l'objectif", () => {
  for (const i of situations) {
    assert.ok(wordCount(i.text.join(" ")) <= 90, `${i.id} : ${wordCount(i.text.join(" "))} mots`);
    assert.match(i.text.at(-1), /^Votre objectif : \S/, i.id);
  }
});

test("redaction : ACT decrit un seul comportement, sans justification", () => {
  for (const i of actScored()) {
    const t = tokens(i.text.join(" "));
    assert.ok(!t.includes("ou"), `${i.id} : deux comportements ?`);
    assert.ok(!/plutôt qu/i.test(i.text.join(" ")), `${i.id} : « plutôt que » oriente la reponse`);
  }
});

test("redaction : ecriture inclusive, pas de masculin generique connu", () => {
  const texts = [
    ...Q.items.flatMap((i) => [i.id, [...i.text, ...i.options.map((o) => o.text)]]),
    ...Object.entries(Q.modules).flatMap(([m, mod]) => [m, mod.consigne]),
  ];
  for (let k = 0; k < texts.length; k += 2) {
    const t = tokens(texts[k + 1].join(" "));
    for (const w of GENDERED) assert.ok(!t.includes(w), `${texts[k]} contient « ${w} »`);
  }
});

// --- Session et randomisation ---------------------------------------------

test("ordre des modules : ACT, CAP puis INT", () => {
  assert.deepEqual(MODULE_ORDER, ["ACT", "CAP", "INT"]);
  for (const form of FORMS) {
    const steps = buildSteps(session(form));
    const modules = steps.filter((s) => s.type === "item").map((s) => s.module);
    assert.deepEqual([...new Set(modules)], ["ACT", "CAP", "INT"]);
    assert.equal(steps.at(-1).type, "results");
    assert.equal(steps.filter((s) => s.type === "intro").length, 3);
    assert.equal(modules.length, Q.forms[form].length);
  }
});

test("la session porte sa forme et ne contient que ses items", () => {
  const s = session("court");
  assert.equal(s.form, "court");
  const ids = Object.values(s.questionOrder).flat().sort();
  assert.deepEqual(ids, Q.forms.court.slice().sort());
  assert.deepEqual(Object.keys(s.presentation).sort(), formItems(Q, "court").filter((i) => i.options.length).map((i) => i.id).sort());
  assert.throws(() => createSession(Q, CONFIG, Math.random, NOW, "moyen"));
  assert.equal(createSession(Q).form, "complet");
});

test("la randomisation conserve les identifiants canoniques", () => {
  const s = session("complet", 42);
  for (const mod of MODULE_ORDER) {
    assert.deepEqual(s.questionOrder[mod].slice().sort(), itemsOf(Q, mod).map((i) => i.id).sort());
  }
  let reordered = 0;
  for (const i of situations) {
    assert.deepEqual(s.presentation[i.id].slice().sort(), ["A", "B", "C", "D"]);
    if (s.presentation[i.id].join("") !== "ABCD") reordered++;
  }
  assert.ok(reordered > 0, "les options devraient etre melangees");
  assert.notDeepEqual(s.questionOrder.CAP, itemsOf(Q, "CAP").map((i) => i.id));
});

test("sans randomisation, l'ordre canonique est conserve", () => {
  const s = createSession(Q, { randomizeQuestionsWithinModule: false, randomizeOptions: false });
  assert.deepEqual(s.questionOrder.CAP, itemsOf(Q, "CAP").map((i) => i.id));
  assert.deepEqual(s.presentation.C01, ["A", "B", "C", "D"]);
});

test("le score ne depend pas de l'ordre presente", () => {
  const key = fakeKey();
  const scores = [1, 2, 3].map((seed) => {
    const s = session("complet", seed);
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
  const s = session();
  const c01 = itemById(Q, "C01");
  assert.ok(setChoice(s, "C01", "best", "B"));
  assert.equal(setChoice(s, "C01", "worst", "B"), false);
  assert.equal(s.responses.C01.worst, undefined);
  assert.equal(isAnswered(c01, s.responses.C01), false);
  assert.ok(setChoice(s, "C01", "worst", "D"));
  assert.equal(setChoice(s, "C01", "best", "D"), false);
  assert.deepEqual(s.responses.C01, { best: "B", worst: "D" });
  assert.ok(isAnswered(c01, s.responses.C01));
  // Une reponse forgee identique n'est jamais consideree comme complete.
  assert.equal(isAnswered(c01, { best: "A", worst: "A" }), false);
});

test("options et valeurs invalides refusees", () => {
  const s = session();
  assert.equal(setChoice(s, "C01", "best", "E"), false);
  assert.equal(setActValue(s, "A01", 5), false);
  assert.equal(setActValue(s, "A01", "3"), false);
  assert.ok(setActValue(s, "A01", "X"));
  assert.ok(setActValue(s, "A01", 0));
});

test("la completude se mesure sur la forme choisie", () => {
  const s = session("court");
  answerAll(s);
  assert.equal(answeredCount(Q, s), 28);
  assert.ok(isComplete(Q, s));
  const full = session("complet");
  answerAll(s);
  assert.equal(isComplete(Q, full), false);
});

// --- Scoring ACT ----------------------------------------------------------

test("ACT est transforme en 0/25/50/75/100, et retourne pour un item inverse", () => {
  assert.deepEqual([0, 1, 2, 3, 4].map((v) => actPoints(v)), [0, 25, 50, 75, 100]);
  assert.deepEqual([0, 1, 2, 3, 4].map((v) => actPoints(v, true)), [100, 75, 50, 25, 0]);
  assert.equal(actPoints("X", true), null);
});

test("les items inverses sont retournes dans le score", () => {
  const s = session();
  for (const i of actScored()) setActValue(s, i.id, 4);
  const act = scoreACT(Q, s.responses, "complet");
  // Par mecanisme : deux items a 100, un inverse a 0 (ou un a 100, deux a 0).
  const expected = (m) => {
    const items = actScored().filter((i) => i.mechanism === m);
    return Math.round((items.filter((i) => !i.reversed).length * 100 / items.length) * 10) / 10;
  };
  for (const m of Object.keys(Q.mechanisms)) assert.equal(act.byMechanism[m], expected(m), m);
});

test("X est traite comme manquant, jamais comme 0", () => {
  assert.equal(actPoints("X"), null);
  const s = session();
  const items = actScored();
  // 24 reponses sur 36 (le minimum), les 12 autres en X.
  items.forEach((i, k) => setActValue(s, i.id, k < 24 ? (i.reversed ? 0 : 4) : "X"));
  const act = scoreACT(Q, s.responses, "complet");
  assert.equal(act.available, 24);
  assert.equal(act.minimum, 24);
  assert.equal(act.global, 100); // et non 24 * 100 / 36
  assert.equal(act.label, "Activation déclarée — score descriptif");
});

test("ACT global non calculable sous le seuil de reponses", () => {
  for (const form of FORMS) {
    const s = session(form);
    const items = actScored(form);
    const minimum = Math.ceil((items.length * 2) / 3);
    items.forEach((i, k) => setActValue(s, i.id, k < minimum - 1 ? 3 : "X"));
    const act = scoreACT(Q, s.responses, form);
    assert.equal(act.minimum, minimum, form);
    assert.equal(act.global, null, form);
    setActValue(s, items[minimum - 1].id, 3);
    assert.notEqual(scoreACT(Q, s.responses, form).global, null, form);
  }
  // Onze X et un seul « 4 » ne donnent plus 100.
  const s = session("court");
  actScored("court").forEach((i, k) => setActValue(s, i.id, k === 0 ? 4 : "X"));
  assert.equal(scoreACT(Q, s.responses, "court").global, null);
});

test("ACT par mecanisme : deux reponses sur trois au minimum", () => {
  const s = session();
  answerAll(s, { act: 2 });
  const [first, ...rest] = actScored().filter((i) => i.mechanism === "M1");
  setActValue(s, first.id, "X");
  assert.equal(ACT_MIN_PER_MECHANISM, 2);
  assert.equal(scoreACT(Q, s.responses, "complet").byMechanism.M1, 50);
  setActValue(s, rest[0].id, "X");
  assert.equal(scoreACT(Q, s.responses, "complet").byMechanism.M1, null);
});

test("forme courte : pas de score ACT par mecanisme", () => {
  const s = session("court");
  answerAll(s);
  assert.equal(scoreACT(Q, s.responses, "court").byMechanism, null);
  assert.equal(scoreACT(Q, s.responses, "court").total, 12);
});

test("les controles d'attention ne comptent jamais dans le score", () => {
  const s = session();
  answerAll(s, { act: 2, checks: 4 });
  const act = scoreACT(Q, s.responses, "complet");
  assert.equal(act.total, 36);
  assert.equal(act.global, 50);
  assert.deepEqual(attentionChecks(Q, s.responses, "complet"), { V1: false, V2: false });
  setActValue(s, "V1", 3);
  setActValue(s, "V2", 1);
  assert.deepEqual(attentionChecks(Q, s.responses, "complet"), { V1: true, V2: true });
  assert.deepEqual(attentionChecks(Q, {}, "court"), { V1: null });
});

// --- Scoring CAP / INT ----------------------------------------------------

test("CAP et INT restent null sans cle experte", () => {
  const s = session();
  answerAll(s);
  const scores = computeScores(Q, s, EXPERT_KEY);
  assert.equal(scores.CAP, null);
  assert.equal(scores.INT, null);
  assert.equal(computeScores(Q, s, {}).CAP, null);
  assert.equal(computeScores(Q, s, undefined).INT, null);
});

test("une cle incomplete, degeneree ou d'une autre version ne produit aucun score", () => {
  const s = session();
  answerAll(s);
  const partial = fakeKey();
  delete partial.items.C12;
  assert.equal(scoreCAP(Q, s.responses, partial), null);
  assert.notEqual(scoreINT(Q, s.responses, partial), null); // INT reste complet
  const flat = fakeKey();
  flat.items.I05 = { A: 50, B: 50, C: 50, D: 50 };
  assert.equal(keyCoversModule(Q, flat, "INT"), false);
  const outOfRange = fakeKey();
  outOfRange.items.C01.A = 120;
  assert.equal(keyCoversModule(Q, outOfRange, "CAP"), false);
  assert.equal(keyCoversModule(Q, { ...fakeKey(), version: "2.1" }, "CAP"), false);
});

test("un item exclu de la cle n'est pas score et n'empeche pas le score", () => {
  const s = session();
  answerAll(s);
  const key = fakeKey();
  delete key.items.C12;
  key.excluded = ["C12"];
  // C12 mal repondu : sans effet puisqu'il est exclu.
  setChoice(s, "C12", "worst", "C");
  setChoice(s, "C12", "best", "A");
  setChoice(s, "C12", "worst", "B");
  const cap = scoreCAP(Q, s.responses, key);
  assert.equal(cap.global, 100);
  assert.equal(cap.byMechanism.M3, 100);
});

test("formule par item conforme a SCORING_SPEC_V2_2.md (valeurs K brutes)", () => {
  const k = { A: 0, B: 100, C: 50, D: 25 };
  assert.equal(scoreItem(k, "B", "A"), 100);
  assert.equal(scoreItem(k, "A", "B"), 0);
  assert.equal(scoreItem(k, "C", "D"), (50 + 75) / 2);
  // Sans normalisation : un item peu tranche reste proche de 50.
  const k2 = { A: 45, B: 55, C: 50, D: 48 };
  assert.equal(scoreItem(k2, "B", "A"), (55 + (100 - 45)) / 2);
});

test("scoring CAP/INT correct avec une cle fictive", () => {
  const key = fakeKey();
  const s = session("complet", 3);
  answerAll(s, { best: "B", worst: "A" });
  let scores = computeScores(Q, s, key);
  assert.equal(scores.CAP.global, 100);
  assert.equal(scores.INT.global, 100);
  assert.equal(scores.CAP.label, LABELS.EXPERIMENTAL);
  for (const v of Object.values(scores.CAP.byMechanism)) assert.equal(v, 100);

  // M1 : un item mal juge (best=A, worst=B -> 0), quatre parfaits -> 80.
  setChoice(s, "C01", "worst", "C");
  setChoice(s, "C01", "best", "A");
  setChoice(s, "C01", "worst", "B");
  scores = computeScores(Q, s, key);
  assert.equal(scores.CAP.byMechanism.M1, 80);
  assert.equal(scores.CAP.byMechanism.M2, 100);
  // CAP global = moyenne des 12 mecanismes, pas des 60 items.
  assert.equal(scores.CAP.global, Math.round(((80 + 11 * 100) / 12) * 10) / 10);

  // INT : best=C (50), worst=D (100-25=75) -> 62,5 sur I01.
  setChoice(s, "I01", "worst", "D");
  setChoice(s, "I01", "best", "C");
  scores = computeScores(Q, s, key);
  assert.equal(scores.INT.byItem.I01, 62.5);
  assert.equal(scores.INT.global, Math.round(((62.5 + 9 * 100) / 10) * 10) / 10);
});

test("forme courte : CAP et INT globaux seulement, sur ses propres items", () => {
  const key = fakeKey();
  const s = session("court");
  answerAll(s);
  // Un item de la forme complete absent de la courte n'intervient pas.
  assert.ok(!Q.forms.court.includes("C02"));
  const scores = computeScores(Q, s, key);
  assert.equal(scores.CAP.global, 100);
  assert.equal(scores.CAP.byMechanism, null);
  assert.equal(Object.keys(scores.INT.byItem).length, 3);
});

test("aucun score n'est fusionne ni presente comme percentile", () => {
  const s = session();
  answerAll(s);
  const scores = computeScores(Q, s, fakeKey());
  assert.deepEqual(Object.keys(scores).sort(), ["ACT", "CAP", "INT"]);
  assert.ok(!JSON.stringify(scores).toLowerCase().includes("percentile"));
});

// --- Sauvegarde -----------------------------------------------------------

test("localStorage restaure l'etat, forme comprise", () => {
  const storage = memoryStorage();
  const s = session("court", 9);
  setChoice(s, "C01", "best", "B");
  setChoice(s, "C01", "worst", "A");
  setActValue(s, "A01", "X");
  s.cursor = 7;
  assert.ok(saveState(storage, s));
  assert.ok(storage._map.has(STORAGE_KEY));
  assert.equal(STORAGE_KEY, "iam-v2.2-session");
  const restored = loadState(storage, Q);
  assert.deepEqual(restored, s);
  assert.equal(restored.form, "court");
  clearState(storage);
  assert.equal(loadState(storage, Q), null);
});

test("un etat corrompu, d'une autre version ou d'une forme inconnue est ignore", () => {
  const storage = memoryStorage();
  storage.setItem(STORAGE_KEY, "{pas du json");
  assert.equal(loadState(storage, Q), null);
  const s = session();
  storage.setItem(STORAGE_KEY, JSON.stringify({ ...s, version: "2.1" }));
  assert.equal(loadState(storage, Q), null);
  storage.setItem(STORAGE_KEY, JSON.stringify({ ...s, form: "moyen" }));
  assert.equal(loadState(storage, Q), null);
  // Une session complete relue comme courte ne correspond plus a ses items.
  storage.setItem(STORAGE_KEY, JSON.stringify({ ...s, form: "court" }));
  assert.equal(loadState(storage, Q), null);
  const broken = structuredClone(s);
  broken.presentation.C01 = ["A", "A", "C", "D"];
  storage.setItem(STORAGE_KEY, JSON.stringify(broken));
  assert.equal(loadState(storage, Q), null);
});

test("un stockage indisponible n'interrompt pas le questionnaire", () => {
  const throwing = { getItem() { throw new Error("bloque"); }, setItem() { throw new Error("plein"); }, removeItem() { throw new Error("bloque"); } };
  assert.equal(saveState(throwing, session()), false);
  assert.equal(loadState(throwing, Q), null);
  clearState(throwing);
});

// --- Export ---------------------------------------------------------------

test("export JSON fidele", () => {
  const s = session("complet", 5);
  answerAll(s, { best: "C", worst: "D", act: 2 });
  setActValue(s, "A13", "X");
  setActValue(s, "V2", 4);
  s.completedAt = "2026-10-22T10:00:00.000Z";
  const exp = JSON.parse(JSON.stringify(buildExport(Q, s, EXPERT_KEY)));
  assert.equal(exp.instrument, "IAM");
  assert.equal(exp.version, "2.2");
  assert.equal(exp.form, "complet");
  assert.equal(exp.title, "Indice d’Activation et de Maîtrise des mécanismes");
  assert.equal(exp.startedAt, s.startedAt);
  assert.equal(exp.completedAt, "2026-10-22T10:00:00.000Z");
  assert.equal(Object.keys(exp.responses).length, 108);
  assert.deepEqual(exp.responses.C01, { best: "C", worst: "D" });
  assert.deepEqual(exp.responses.I01, { best: "C", worst: "D" });
  assert.deepEqual(exp.responses.A01, { value: 2 });
  assert.deepEqual(exp.responses.A13, { value: "X" });
  assert.deepEqual(exp.reversed, actScored().filter((i) => i.reversed).map((i) => i.id));
  assert.deepEqual(exp.attention, { V1: true, V2: false });
  assert.deepEqual(exp.presentation, s.presentation);
  assert.deepEqual(exp.questionOrder, s.questionOrder);
  assert.equal(exp.scores.CAP, null);
  assert.equal(exp.scores.INT, null);
  assert.equal(exp.scores.ACT.global, 50);
});

test("export JSON de la forme courte : ses seuls items", () => {
  const s = session("court");
  answerAll(s);
  const exp = buildExport(Q, s, null);
  assert.equal(exp.form, "court");
  assert.deepEqual(Object.keys(exp.responses).sort(), Q.forms.court.slice().sort());
  assert.deepEqual(Object.keys(exp.attention), ["V1"]);
});

test("export CSV fidele", () => {
  const s = session("complet", 6);
  answerAll(s, { best: "B", worst: "D", act: 4 });
  setActValue(s, "A36", "X");
  const lines = buildCSV(Q, s).trimEnd().split("\n");
  assert.equal(lines.length, 109);
  const header = lines[0].split(",");
  const rows = lines.slice(1).map((l) => Object.fromEntries(l.split(",").map((v, i) => [header[i], v])));
  // Ordre de passation : modules ACT, CAP, INT.
  assert.deepEqual([...new Set(rows.map((r) => r.module))], ["ACT", "CAP", "INT"]);
  assert.deepEqual(rows.map((r) => r.item), [...s.questionOrder.ACT, ...s.questionOrder.CAP, ...s.questionOrder.INT]);
  assert.ok(rows.every((r) => r.form === "complet"));
  const c01 = rows.find((r) => r.item === "C01");
  assert.equal(c01.best, "B");
  assert.equal(c01.worst, "D");
  assert.equal(c01.mechanism, "M1");
  assert.equal(c01.presented_order, s.presentation.C01.join(""));
  assert.equal(rows.find((r) => r.item === "I01").mechanism, "M5+M3+M12");
  const a36 = rows.find((r) => r.item === "A36");
  assert.equal(a36.act_value, "X");
  assert.equal(a36.act_points, "");
  assert.equal(rows.find((r) => r.item === "A01").act_points, "100");
  // A03 est inverse : « Presque toujours » vaut 0.
  assert.equal(rows.find((r) => r.item === "A03").reversed, "1");
  assert.equal(rows.find((r) => r.item === "A03").act_points, "0");
  const v1 = rows.find((r) => r.item === "V1");
  assert.equal(v1.check, "3");
  assert.equal(v1.act_points, "");
});

test("le texte copie mentionne la forme et l'absence de score CAP/INT", () => {
  for (const form of FORMS) {
    const s = session(form);
    answerAll(s);
    const txt = resultsText(Q, s, computeScores(Q, s, null));
    assert.ok(txt.split("\n")[0].endsWith("instrument expérimental pré-validation"));
    assert.ok(txt.split("\n")[0].includes(form === "court" ? "forme courte" : "forme complète"));
    assert.ok(txt.includes(LABELS.CAP_NONE));
    assert.ok(txt.includes(LABELS.INT_NONE));
    assert.ok(txt.includes(LABELS.ACT));
    assert.equal(txt.includes("M1 Lecture"), form === "complet");
  }
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

// Le questionnaire est strictement professionnel : aucune reference a
// l'emission qui a inspire son premier cadrage, ni dans le site ni dans le
// depot (ce fichier excepte, qui la cherche).
test("aucune reference a Koh-Lanta dans les fichiers versionnes", () => {
  const self = "tests/site/core.test.mjs";
  let files;
  try {
    files = execFileSync("git", ["ls-files"], { cwd: ROOT, encoding: "utf8" }).split("\n").filter(Boolean);
  } catch {
    files = siteFiles().map((f) => f.slice(ROOT.length));
  }
  for (const f of files.filter((f) => f !== self && !/\.(woff2|zip|png|ico)$/.test(f))) {
    const path = join(ROOT, f);
    if (!existsSync(path)) continue;
    assert.ok(!/koh.?lanta/i.test(f), f);
    assert.ok(!/koh.?lanta/i.test(readFileSync(path, "utf8")), f);
  }
});
