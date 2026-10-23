// Notation des experts, sans DOM : session, notes, controles, sauvegarde et
// export. experts.js s'occupe de l'affichage. Protocole :
// specs/IAM_V2_2/PROTOCOLE_CLE_EXPERTE.md.
//
// Chaque expert note l'efficacite K (0-100) de chaque option des items CAP
// et INT, presentes dans un ordre aleatoire, sans code de mecanisme. Au tour
// 2, il voit la mediane et l'intervalle interquartile du groupe ; tout ecart
// de plus de DEVIATION points a la mediane doit etre justifie.
import { shuffle } from "./core.js?v=2.2";

export const EXPERT_STORAGE_KEY = "iam-v2.2-experts";
export const ROUNDS = [1, 2];
export const DEVIATION = 25;
const OPTION_IDS = ["A", "B", "C", "D"];

export function ratedItems(q) {
  return q.items.filter((i) => i.module === "CAP" || i.module === "INT");
}

// Code anonyme : lettres, chiffres, tiret ; jamais un nom ni une adresse.
export function isValidExpertCode(code) {
  return typeof code === "string" && /^[A-Za-z0-9-]{1,12}$/.test(code);
}

export function createExpertSession(q, { expert, round }, rng = Math.random, now = new Date()) {
  if (!isValidExpertCode(expert)) throw new Error("code expert invalide");
  if (!ROUNDS.includes(round)) throw new Error(`tour inconnu : ${round}`);
  const presentation = {};
  for (const item of ratedItems(q)) presentation[item.id] = shuffle(item.options.map((o) => o.id), rng);
  return {
    instrument: q.instrument,
    version: q.version,
    kind: "expert-session",
    expert,
    round,
    startedAt: now.toISOString(),
    completedAt: null,
    order: shuffle(ratedItems(q).map((i) => i.id), rng),
    presentation,
    ratings: {},
    comments: {},
    feedback: null,
    cursor: 0,
  };
}

export function setRating(session, id, option, value) {
  if (!OPTION_IDS.includes(option)) return false;
  if (!Number.isInteger(value) || value < 0 || value > 100) return false;
  session.ratings[id] = { ...(session.ratings[id] || {}), [option]: value };
  return true;
}

export function setComment(session, id, text) {
  const t = String(text ?? "").slice(0, 2000);
  if (t.trim()) session.comments[id] = t;
  else delete session.comments[id];
}

export function isItemRated(session, id) {
  const r = session.ratings[id];
  return Boolean(r) && OPTION_IDS.every((o) => Number.isInteger(r[o]));
}

// Options dont la note s'ecarte de plus de DEVIATION points de la mediane du
// groupe (tour 2 seulement).
export function deviations(session, id) {
  const fb = session.round === 2 && session.feedback?.items?.[id];
  const r = session.ratings[id];
  if (!fb || !r) return [];
  return OPTION_IDS.filter((o) => Number.isInteger(r[o]) && Math.abs(r[o] - fb[o].median) > DEVIATION);
}

export function isItemDone(session, id) {
  return isItemRated(session, id) && (deviations(session, id).length === 0 || Boolean(session.comments[id]));
}

export function doneCount(session) {
  return session.order.filter((id) => isItemDone(session, id)).length;
}

export function isSessionComplete(session) {
  return doneCount(session) === session.order.length;
}

// Retour du tour 1, produit par tools/expert-key.mjs. Il doit porter la
// version du questionnaire et couvrir chaque item note.
export function isValidFeedback(q, fb) {
  if (!fb || fb.kind !== "expert-feedback" || fb.version !== q.version || fb.round !== 1) return false;
  if (!fb.items || typeof fb.items !== "object") return false;
  return ratedItems(q).every((item) => {
    const it = fb.items[item.id];
    return it && OPTION_IDS.every((o) => it[o] && ["median", "q1", "q3"].every((k) => Number.isFinite(it[o][k])));
  });
}

export function attachFeedback(q, session, fb) {
  if (session.round !== 2 || !isValidFeedback(q, fb)) return false;
  session.feedback = fb;
  return true;
}

// --- Sauvegarde locale ----------------------------------------------------

export function saveExpertSession(storage, session) {
  try {
    storage.setItem(EXPERT_STORAGE_KEY, JSON.stringify(session));
    return true;
  } catch {
    return false;
  }
}

export function loadExpertSession(storage, q) {
  let s;
  try {
    const raw = storage.getItem(EXPERT_STORAGE_KEY);
    if (!raw) return null;
    s = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!s || s.kind !== "expert-session" || s.instrument !== q.instrument || s.version !== q.version) return null;
  if (!isValidExpertCode(s.expert) || !ROUNDS.includes(s.round)) return null;
  const ids = ratedItems(q).map((i) => i.id).sort();
  if (!Array.isArray(s.order) || JSON.stringify(s.order.slice().sort()) !== JSON.stringify(ids)) return null;
  if (!s.ratings || !s.comments || !s.presentation) return null;
  if (s.round === 2 && s.feedback && !isValidFeedback(q, s.feedback)) s.feedback = null;
  if (!Number.isInteger(s.cursor) || s.cursor < 0 || s.cursor > s.order.length) s.cursor = 0;
  return s;
}

export function clearExpertSession(storage) {
  try {
    storage.removeItem(EXPERT_STORAGE_KEY);
  } catch {
    /* rien a effacer */
  }
}

// --- Export ---------------------------------------------------------------

// Le fichier remis par l'expert, lu par tools/expert-key.mjs. Identifiants
// d'options canoniques (A-D du questionnaire), jamais l'ordre affiche.
export function buildExpertExport(q, session) {
  const ratings = {};
  for (const id of session.order) if (isItemRated(session, id)) ratings[id] = { ...session.ratings[id] };
  return {
    instrument: q.instrument,
    version: q.version,
    kind: "expert-ratings",
    expert: session.expert,
    round: session.round,
    startedAt: session.startedAt,
    completedAt: session.completedAt,
    complete: isSessionComplete(session),
    order: session.order,
    presentation: session.presentation,
    ratings,
    comments: { ...session.comments },
  };
}
