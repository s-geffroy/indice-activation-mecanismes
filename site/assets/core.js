// Logique du questionnaire IAM, sans DOM : sessions, reponses, scoring,
// sauvegarde et export. app.js s'occupe de l'affichage ; tout ce qui decide
// d'un score ou d'une donnee exportee est ici, et teste par tests/site/.
//
// Regles de SCORING_SPEC_V2_2.md appliquees ici :
// - deux formes, courte et complete ; la courte est un sous-ensemble ;
// - ACT : 0..4 -> 0/25/50/75/100, items inverses retournes, X = manquant
//   (jamais 0), score non calculable sous un seuil de reponses ;
// - contrôles d'attention : exportes, jamais scores ;
// - CAP / INT : null tant qu'une cle experte complete n'est pas fournie ;
// - CAP, INT et ACT ne sont jamais fusionnes, aucun percentile n'est calcule.

export const CONFIG = {
  randomizeQuestionsWithinModule: true,
  randomizeOptions: true,
};

// Ordre de passation impose : ACT d'abord, pour que les comportements soient
// declares avant d'avoir juge les situations. Il differe de la numerotation.
export const MODULE_ORDER = ["ACT", "CAP", "INT"];

export const FORMS = ["court", "complet"];

export const STORAGE_KEY = "iam-v2.2-session";

export const ACT_POINTS = { 0: 0, 1: 25, 2: 50, 3: 75, 4: 100 };

// Part minimale de reponses ACT non X pour calculer un score global, et
// nombre minimal par mecanisme (forme complete : trois items par mecanisme).
export const ACT_MIN_SHARE = 2 / 3;
export const ACT_MIN_PER_MECHANISM = 2;

export const LABELS = {
  ACT: "Activation déclarée — score descriptif",
  ACT_TOO_FEW: "non calculable — trop peu de situations rencontrées",
  CAP_NONE: "CAP non scoré — clé experte requise",
  INT_NONE: "INT non scoré — clé experte requise",
  EXPERIMENTAL: "score expérimental — non étalonné",
};

const round1 = (x) => (x === null ? null : Math.round(x * 10) / 10);
const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

// Items d'un module, restreints a une forme si elle est donnee.
export function itemsOf(q, module, form) {
  const ids = form ? new Set(q.forms[form]) : null;
  return q.items.filter((i) => i.module === module && (!ids || ids.has(i.id)));
}

export function formItems(q, form) {
  const ids = new Set(q.forms[form]);
  return q.items.filter((i) => ids.has(i.id));
}

export function itemById(q, id) {
  return q.items.find((i) => i.id === id);
}

const isCheck = (item) => item.check !== undefined;

// Fisher-Yates. rng renvoie un reel dans [0, 1[ ; injecte pour les tests.
export function shuffle(arr, rng = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// L'ordre presente (items et options) est tire une seule fois, a la creation
// de la session, puis sauvegarde : un rafraichissement ne le rebat pas.
export function createSession(q, config = CONFIG, rng = Math.random, now = new Date(), form = "complet") {
  if (!FORMS.includes(form)) throw new Error(`forme inconnue : ${form}`);
  const questionOrder = {};
  const presentation = {};
  for (const mod of MODULE_ORDER) {
    const ids = itemsOf(q, mod, form).map((i) => i.id);
    questionOrder[mod] = config.randomizeQuestionsWithinModule ? shuffle(ids, rng) : ids;
  }
  for (const item of formItems(q, form)) {
    if (!item.options.length) continue;
    const ids = item.options.map((o) => o.id);
    presentation[item.id] = config.randomizeOptions ? shuffle(ids, rng) : ids;
  }
  return {
    instrument: q.instrument,
    version: q.version,
    form,
    startedAt: now.toISOString(),
    completedAt: null,
    config: { ...config },
    questionOrder,
    presentation,
    responses: {},
    cursor: 0,
  };
}

// Sequence des ecrans apres l'accueil : consigne de module, items, resultats.
export function buildSteps(state) {
  const steps = [];
  for (const mod of MODULE_ORDER) {
    steps.push({ type: "intro", module: mod });
    for (const id of state.questionOrder[mod]) steps.push({ type: "item", id, module: mod });
  }
  steps.push({ type: "results" });
  return steps;
}

// --- Reponses -------------------------------------------------------------

const OPTION_IDS = ["A", "B", "C", "D"];

// BEST et WORST doivent rester distincts : la meme option ne peut pas etre a
// la fois la plus et la moins efficace. Renvoie false si le choix est refuse.
export function setChoice(state, id, which, option) {
  if (which !== "best" && which !== "worst") throw new Error(`choix inconnu : ${which}`);
  if (!OPTION_IDS.includes(option)) return false;
  const r = { ...(state.responses[id] || {}) };
  const other = which === "best" ? "worst" : "best";
  if (r[other] === option) return false;
  r[which] = option;
  state.responses[id] = r;
  return true;
}

export function setActValue(state, id, value) {
  if (!(value === "X" || (Number.isInteger(value) && value >= 0 && value <= 4))) return false;
  state.responses[id] = { value };
  return true;
}

export function isAnswered(item, response) {
  if (!response) return false;
  if (item.module === "ACT") return response.value === "X" || Number.isInteger(response.value);
  return OPTION_IDS.includes(response.best) && OPTION_IDS.includes(response.worst) && response.best !== response.worst;
}

export function answeredCount(q, state) {
  return formItems(q, state.form).filter((i) => isAnswered(i, state.responses[i.id])).length;
}

export function isComplete(q, state) {
  return answeredCount(q, state) === q.forms[state.form].length;
}

// --- Scoring --------------------------------------------------------------

// Points d'une reponse ACT ; un item inverse est retourne (Jamais = 100).
export function actPoints(value, reversed = false) {
  if (value === "X" || value === undefined || value === null) return null;
  if (!(value in ACT_POINTS)) return null;
  return reversed ? 100 - ACT_POINTS[value] : ACT_POINTS[value];
}

export function scoreACT(q, responses, form = "complet") {
  const items = itemsOf(q, "ACT", form).filter((i) => !isCheck(i));
  const points = Object.fromEntries(items.map((i) => [i.id, actPoints(responses[i.id]?.value, i.reversed)]));
  const available = Object.values(points).filter((p) => p !== null);
  const minimum = Math.ceil(items.length * ACT_MIN_SHARE);
  let byMechanism = null;
  // Un seul item par mecanisme en forme courte : pas de sous-score.
  if (form === "complet") {
    byMechanism = {};
    for (const m of Object.keys(q.mechanisms)) {
      const ps = items.filter((i) => i.mechanism === m).map((i) => points[i.id]).filter((p) => p !== null);
      byMechanism[m] = ps.length >= ACT_MIN_PER_MECHANISM ? round1(mean(ps)) : null;
    }
  }
  return {
    label: LABELS.ACT,
    global: available.length >= minimum ? round1(mean(available)) : null,
    available: available.length,
    minimum,
    total: items.length,
    byMechanism,
  };
}

// Contrôles d'attention : true / false par contrôle, null si non repondu.
export function attentionChecks(q, responses, form = "complet") {
  return Object.fromEntries(
    itemsOf(q, "ACT", form).filter(isCheck).map((i) => {
      const v = responses[i.id]?.value;
      return [i.id, v === undefined ? null : v === i.check];
    }),
  );
}

// Cle experte : { version, excluded: [ids], items: { id: {A, B, C, D} } }.
// Elle est utilisable pour un module seulement si elle porte la version du
// questionnaire et si chaque item non exclu de la forme a une valeur 0-100
// pour A, B, C et D, non toutes egales.
function keptItems(q, key, module, form) {
  const excluded = new Set(Array.isArray(key.excluded) ? key.excluded : []);
  return itemsOf(q, module, form).filter((i) => !excluded.has(i.id));
}

export function keyCoversModule(q, key, module, form = "complet") {
  if (!key || typeof key !== "object" || key.version !== q.version) return false;
  if (!key.items || typeof key.items !== "object") return false;
  const kept = keptItems(q, key, module, form);
  return kept.length > 0 && kept.every((item) => {
    const k = key.items[item.id];
    if (!k) return false;
    const vals = OPTION_IDS.map((o) => k[o]);
    if (!vals.every((v) => typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 100)) return false;
    return Math.max(...vals) > Math.min(...vals);
  });
}

// S_item = (K_best + (100 - K_worst)) / 2, sur les valeurs K brutes : un item
// ou les experts voient peu d'ecart entre options pese moins qu'un item tranche.
export function scoreItem(keyItem, best, worst) {
  return (keyItem[best] + (100 - keyItem[worst])) / 2;
}

function itemScores(q, module, responses, key, form) {
  const out = {};
  for (const item of keptItems(q, key, module, form)) {
    const r = responses[item.id];
    out[item.id] = isAnswered(item, r) ? scoreItem(key.items[item.id], r.best, r.worst) : null;
  }
  return out;
}

export function scoreCAP(q, responses, key, form = "complet") {
  if (!keyCoversModule(q, key, "CAP", form)) return null;
  const scores = itemScores(q, "CAP", responses, key, form);
  if (Object.values(scores).includes(null)) return null;
  const byMechanism = {};
  for (const m of Object.keys(q.mechanisms)) {
    const ids = Object.keys(scores).filter((id) => itemById(q, id).mechanism === m);
    byMechanism[m] = ids.length ? mean(ids.map((id) => scores[id])) : null;
  }
  const kept = Object.values(byMechanism).filter((v) => v !== null);
  return {
    label: LABELS.EXPERIMENTAL,
    global: round1(mean(kept)),
    // Un seul item par mecanisme en forme courte : pas de sous-score.
    byMechanism: form === "complet"
      ? Object.fromEntries(Object.entries(byMechanism).map(([m, v]) => [m, round1(v)]))
      : null,
  };
}

export function scoreINT(q, responses, key, form = "complet") {
  if (!keyCoversModule(q, key, "INT", form)) return null;
  const scores = itemScores(q, "INT", responses, key, form);
  if (Object.values(scores).includes(null)) return null;
  return {
    label: LABELS.EXPERIMENTAL,
    global: round1(mean(Object.values(scores))),
    byItem: Object.fromEntries(Object.entries(scores).map(([id, v]) => [id, round1(v)])),
  };
}

export function computeScores(q, state, key) {
  return {
    ACT: scoreACT(q, state.responses, state.form),
    CAP: scoreCAP(q, state.responses, key, state.form),
    INT: scoreINT(q, state.responses, key, state.form),
  };
}

// --- Sauvegarde locale ----------------------------------------------------

// storage : localStorage, ou un objet equivalent dans les tests. Toute erreur
// (navigation privee, stockage plein ou bloque) est absorbee : le
// questionnaire reste utilisable, il ne survivra simplement pas a un
// rafraichissement.
export function saveState(storage, state) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function loadState(storage, q) {
  let state;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    state = JSON.parse(raw);
  } catch {
    return null;
  }
  return isValidState(q, state) ? state : null;
}

export function clearState(storage) {
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    /* rien a effacer */
  }
}

// Une session restauree doit correspondre exactement a ce questionnaire :
// meme version, meme forme, memes items dans chaque module, memes options.
// Sinon on la jette plutot que d'afficher des reponses rattachees au mauvais
// item.
function isValidState(q, s) {
  if (!s || s.instrument !== q.instrument || s.version !== q.version || !FORMS.includes(s.form)) return false;
  if (!s.questionOrder || !s.presentation || !s.responses || typeof s.responses !== "object") return false;
  for (const mod of MODULE_ORDER) {
    const expected = itemsOf(q, mod, s.form).map((i) => i.id).sort();
    const got = Array.isArray(s.questionOrder[mod]) ? s.questionOrder[mod].slice().sort() : [];
    if (JSON.stringify(expected) !== JSON.stringify(got)) return false;
  }
  for (const item of formItems(q, s.form)) {
    if (!item.options.length) continue;
    const got = Array.isArray(s.presentation[item.id]) ? s.presentation[item.id].slice().sort() : [];
    if (JSON.stringify(got) !== JSON.stringify(item.options.map((o) => o.id).sort())) return false;
  }
  if (!Number.isInteger(s.cursor) || s.cursor < 0 || s.cursor >= buildSteps(s).length) s.cursor = 0;
  return true;
}

// --- Export ---------------------------------------------------------------

export function buildExport(q, state, key) {
  const responses = {};
  for (const item of formItems(q, state.form)) {
    const r = state.responses[item.id];
    if (!isAnswered(item, r)) continue;
    responses[item.id] = item.module === "ACT" ? { value: r.value } : { best: r.best, worst: r.worst };
  }
  return {
    instrument: q.instrument,
    title: q.title,
    version: q.version,
    form: state.form,
    status: "instrument expérimental pré-validation",
    startedAt: state.startedAt,
    completedAt: state.completedAt,
    moduleOrder: MODULE_ORDER,
    questionOrder: state.questionOrder,
    responses,
    reversed: itemsOf(q, "ACT", state.form).filter((i) => i.reversed).map((i) => i.id),
    attention: attentionChecks(q, state.responses, state.form),
    presentation: state.presentation,
    scores: computeScores(q, state, key),
  };
}

function csvCell(v) {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Une ligne par item, dans l'ordre de passation. Identifiants canoniques
// A/B/C/D ; l'ordre reellement presente est dans presented_order. act_points
// est le score apres retournement des items inverses, vide pour un contrôle.
export function buildCSV(q, state) {
  const header = [
    "instrument", "version", "form", "module", "item", "mechanism", "reversed", "check", "position",
    "best", "worst", "act_value", "act_points", "presented_order",
  ];
  const rows = [header];
  let position = 0;
  for (const mod of MODULE_ORDER) {
    for (const id of state.questionOrder[mod]) {
      position++;
      const item = itemById(q, id);
      const r = state.responses[id] || {};
      const isAct = mod === "ACT";
      const mechanism = item.mechanisms ? item.mechanisms.join("+") : item.mechanism ?? "";
      rows.push([
        q.instrument, q.version, state.form, mod, id, mechanism,
        isAct ? Number(Boolean(item.reversed)) : "", isCheck(item) ? item.check : "", position,
        isAct ? "" : r.best ?? "", isAct ? "" : r.worst ?? "",
        isAct ? r.value ?? "" : "", isAct && !isCheck(item) ? actPoints(r.value, item.reversed) ?? "" : "",
        (state.presentation[id] || []).join(""),
      ]);
    }
  }
  return rows.map((row) => row.map(csvCell).join(",")).join("\n") + "\n";
}

const fmt = (x) => (x === null ? "manquant" : `${String(x).replace(".", ",")} / 100`);

export function resultsText(q, state, scores) {
  const formLabel = state.form === "court" ? "forme courte" : "forme complète";
  const lines = [
    `IAM V${q.version} — ${q.title} (${formLabel}) — instrument expérimental pré-validation`,
    "Scores non étalonnés : ce ne sont pas des percentiles.",
    "",
    `${scores.ACT.label}`,
    `ACT global : ${scores.ACT.global === null ? LABELS.ACT_TOO_FEW : fmt(scores.ACT.global)} (${scores.ACT.available}/${scores.ACT.total} réponses disponibles, minimum ${scores.ACT.minimum}, X = manquant)`,
  ];
  if (scores.ACT.byMechanism) {
    for (const [m, v] of Object.entries(scores.ACT.byMechanism)) lines.push(`  ${m} ${q.mechanisms[m]} : ${fmt(v)}`);
  }
  lines.push("");
  if (scores.CAP) {
    lines.push(`CAP global : ${fmt(scores.CAP.global)} (${scores.CAP.label})`);
    if (scores.CAP.byMechanism) {
      for (const [m, v] of Object.entries(scores.CAP.byMechanism)) lines.push(`  ${m} ${q.mechanisms[m]} : ${fmt(v)}`);
    }
  } else {
    lines.push(LABELS.CAP_NONE);
  }
  lines.push("");
  lines.push(scores.INT ? `INT : ${fmt(scores.INT.global)} (${scores.INT.label})` : LABELS.INT_NONE);
  return lines.join("\n") + "\n";
}
