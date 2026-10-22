// Logique du questionnaire IAM, sans DOM : sessions, reponses, scoring,
// sauvegarde et export. app.js s'occupe de l'affichage ; tout ce qui decide
// d'un score ou d'une donnee exportee est ici, et teste par tests/site/.
//
// Regles de SCORING_SPEC.md appliquees ici :
// - ACT : 0..4 -> 0/25/50/75/100, X = manquant (jamais 0) ;
// - CAP / INT : null tant qu'une cle experte complete n'est pas fournie ;
// - CAP et ACT ne sont jamais fusionnes, aucun percentile n'est calcule.

export const CONFIG = {
  randomizeQuestionsWithinModule: true,
  randomizeOptions: true,
};

// Ordre de passation impose : ACT en dernier, pour ne pas reveler trop tot
// les dimensions du modele. Il differe volontairement de la numerotation.
export const MODULE_ORDER = ["CAP", "INT", "ACT"];

export const STORAGE_KEY = "iam-v1.0-session";

export const ACT_POINTS = { 0: 0, 1: 25, 2: 50, 3: 75, 4: 100 };

export const LABELS = {
  ACT: "Activation déclarée — score descriptif",
  CAP_NONE: "CAP non scoré — clé experte requise",
  INT_NONE: "INT non scoré — clé experte requise",
  EXPERIMENTAL: "score expérimental — non étalonné",
};

const round1 = (x) => (x === null ? null : Math.round(x * 10) / 10);
const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

export function itemsOf(q, module) {
  return q.items.filter((i) => i.module === module);
}

export function itemById(q, id) {
  return q.items.find((i) => i.id === id);
}

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
export function createSession(q, config = CONFIG, rng = Math.random, now = new Date()) {
  const questionOrder = {};
  const presentation = {};
  for (const mod of MODULE_ORDER) {
    const ids = itemsOf(q, mod).map((i) => i.id);
    questionOrder[mod] = config.randomizeQuestionsWithinModule ? shuffle(ids, rng) : ids;
  }
  for (const item of q.items) {
    if (!item.options.length) continue;
    const ids = item.options.map((o) => o.id);
    presentation[item.id] = config.randomizeOptions ? shuffle(ids, rng) : ids;
  }
  return {
    instrument: q.instrument,
    version: q.version,
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
  return q.items.filter((i) => isAnswered(i, state.responses[i.id])).length;
}

export function isComplete(q, state) {
  return answeredCount(q, state) === q.items.length;
}

// --- Scoring --------------------------------------------------------------

export function actPoints(value) {
  if (value === "X" || value === undefined || value === null) return null;
  return value in ACT_POINTS ? ACT_POINTS[value] : null;
}

export function scoreACT(q, responses) {
  const byMechanism = {};
  const available = [];
  for (const item of itemsOf(q, "ACT")) {
    const p = actPoints(responses[item.id]?.value);
    byMechanism[item.mechanism] = p;
    if (p !== null) available.push(p);
  }
  return {
    label: LABELS.ACT,
    global: round1(mean(available)),
    available: available.length,
    total: itemsOf(q, "ACT").length,
    byMechanism,
  };
}

// Une cle experte est utilisable pour un module seulement si chacun de ses
// items a une valeur numerique 0-100 pour A, B, C et D, et des valeurs non
// toutes egales (sinon la normalisation divise par zero).
export function keyCoversModule(q, key, module) {
  if (!key || typeof key !== "object") return false;
  return itemsOf(q, module).every((item) => {
    const k = key[item.id];
    if (!k) return false;
    const vals = OPTION_IDS.map((o) => k[o]);
    if (!vals.every((v) => typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 100)) return false;
    return Math.max(...vals) > Math.min(...vals);
  });
}

// S_item = (K'_best + (100 - K'_worst)) / 2, K' normalise sur l'item.
export function scoreItem(keyItem, best, worst) {
  const vals = OPTION_IDS.map((o) => keyItem[o]);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const norm = (o) => (100 * (keyItem[o] - min)) / (max - min);
  return (norm(best) + (100 - norm(worst))) / 2;
}

function itemScores(q, module, responses, key) {
  const out = {};
  for (const item of itemsOf(q, module)) {
    const r = responses[item.id];
    out[item.id] = isAnswered(item, r) ? scoreItem(key[item.id], r.best, r.worst) : null;
  }
  return out;
}

export function scoreCAP(q, responses, key) {
  if (!keyCoversModule(q, key, "CAP")) return null;
  const scores = itemScores(q, "CAP", responses, key);
  if (Object.values(scores).includes(null)) return null;
  const byMechanism = {};
  for (const m of Object.keys(q.mechanisms)) {
    byMechanism[m] = mean(itemsOf(q, "CAP").filter((i) => i.mechanism === m).map((i) => scores[i.id]));
  }
  return {
    label: LABELS.EXPERIMENTAL,
    global: round1(mean(Object.values(byMechanism))),
    byMechanism: Object.fromEntries(Object.entries(byMechanism).map(([m, v]) => [m, round1(v)])),
  };
}

export function scoreINT(q, responses, key) {
  if (!keyCoversModule(q, key, "INT")) return null;
  const scores = itemScores(q, "INT", responses, key);
  if (Object.values(scores).includes(null)) return null;
  return {
    label: LABELS.EXPERIMENTAL,
    global: round1(mean(Object.values(scores))),
    byItem: Object.fromEntries(Object.entries(scores).map(([id, v]) => [id, round1(v)])),
  };
}

export function computeScores(q, state, key) {
  return {
    ACT: scoreACT(q, state.responses),
    CAP: scoreCAP(q, state.responses, key),
    INT: scoreINT(q, state.responses, key),
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
// meme version, memes items dans chaque module, memes options. Sinon on la
// jette plutot que d'afficher des reponses rattachees au mauvais item.
function isValidState(q, s) {
  if (!s || s.instrument !== q.instrument || s.version !== q.version) return false;
  if (!s.questionOrder || !s.presentation || !s.responses || typeof s.responses !== "object") return false;
  for (const mod of MODULE_ORDER) {
    const expected = itemsOf(q, mod).map((i) => i.id).sort();
    const got = Array.isArray(s.questionOrder[mod]) ? s.questionOrder[mod].slice().sort() : [];
    if (JSON.stringify(expected) !== JSON.stringify(got)) return false;
  }
  for (const item of q.items) {
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
  for (const item of q.items) {
    const r = state.responses[item.id];
    if (!isAnswered(item, r)) continue;
    responses[item.id] = item.module === "ACT" ? { value: r.value } : { best: r.best, worst: r.worst };
  }
  return {
    instrument: q.instrument,
    title: q.title,
    version: q.version,
    status: "instrument expérimental pré-validation",
    startedAt: state.startedAt,
    completedAt: state.completedAt,
    moduleOrder: MODULE_ORDER,
    questionOrder: state.questionOrder,
    responses,
    presentation: state.presentation,
    scores: computeScores(q, state, key),
  };
}

function csvCell(v) {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Une ligne par item, dans l'ordre de passation. Identifiants canoniques
// A/B/C/D ; l'ordre reellement presente est dans presented_order.
export function buildCSV(q, state) {
  const header = [
    "instrument", "version", "module", "item", "mechanism", "position",
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
      rows.push([
        q.instrument, q.version, mod, id, item.mechanism ?? "", position,
        isAct ? "" : r.best ?? "", isAct ? "" : r.worst ?? "",
        isAct ? r.value ?? "" : "", isAct ? actPoints(r.value) ?? "" : "",
        (state.presentation[id] || []).join(""),
      ]);
    }
  }
  return rows.map((row) => row.map(csvCell).join(",")).join("\n") + "\n";
}

const fmt = (x) => (x === null ? "manquant" : `${String(x).replace(".", ",")} / 100`);

export function resultsText(q, scores) {
  const lines = [
    `IAM V${q.version} — ${q.title}`,
    "Instrument expérimental pré-validation.",
    "Scores non étalonnés : ce ne sont pas des percentiles.",
    "",
    `${scores.ACT.label}`,
    `ACT global : ${fmt(scores.ACT.global)} (${scores.ACT.available}/${scores.ACT.total} réponses disponibles, X = manquant)`,
  ];
  for (const [m, v] of Object.entries(scores.ACT.byMechanism)) lines.push(`  ${m} ${q.mechanisms[m]} : ${fmt(v)}`);
  lines.push("");
  if (scores.CAP) {
    lines.push(`CAP global : ${fmt(scores.CAP.global)} (${scores.CAP.label})`);
    for (const [m, v] of Object.entries(scores.CAP.byMechanism)) lines.push(`  ${m} ${q.mechanisms[m]} : ${fmt(v)}`);
  } else {
    lines.push(LABELS.CAP_NONE);
  }
  lines.push("");
  lines.push(scores.INT ? `INT : ${fmt(scores.INT.global)} (${scores.INT.label})` : LABELS.INT_NONE);
  return lines.join("\n") + "\n";
}
