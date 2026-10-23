// Transmission des passations au service de collecte du pilote. C'est le SEUL
// fichier du site qui parle au reseau, et seulement si COLLECT
// (site/data/collect.js) est configure, que la personne a consenti, et
// qu'elle clique elle-meme sur « Transmettre ». Regles :
// specs/IAM_V2_2/COLLECTE_RGPD.md.
import { buildExport } from "./core.js?v=2.2";

export const RETENTION_YEARS = 3;
const CODE_HEADER = "X-Code-Participation";

// Collecte ouverte : configuree, et le dernier jour n'est pas depasse
// (jour entier, heure locale).
export function collectOpen(cfg, now = new Date()) {
  if (!cfg || !cfg.url || !/^\d{4}-\d{2}-\d{2}$/.test(cfg.endDate || "")) return false;
  const [y, m, d] = cfg.endDate.split("-").map(Number);
  return now <= new Date(y, m - 1, d, 23, 59, 59, 999);
}

// Date de suppression annoncee : fin de collecte + 3 ans, comme le worker.
export function retentionEnd(cfg) {
  const [y, m, d] = cfg.endDate.split("-").map(Number);
  const leap = m === 2 && d === 29;
  return `${y + RETENTION_YEARS}-${String(m).padStart(2, "0")}-${String(leap ? 28 : d).padStart(2, "0")}`;
}

export function consentRecord(cfg, now = new Date()) {
  return { version: cfg.consentVersion, accepted: true, acceptedAt: now.toISOString() };
}

// Ce qui part sur le reseau : le consentement et l'export de la passation.
// Le service ne garde que les champs utiles (voir src/collect/server.py).
export function buildSubmission(q, state) {
  if (!state.consent?.accepted) throw new Error("aucun consentement");
  return {
    consent: { version: state.consent.version, accepted: true },
    submission: buildExport(q, state, null),
  };
}

async function call(fetchImpl, url, init) {
  let res;
  try {
    res = await fetchImpl(url, { credentials: "omit", referrerPolicy: "no-referrer", cache: "no-store", ...init });
  } catch {
    return { ok: false, status: 0, error: "Le service de collecte est injoignable. Vérifiez votre connexion et réessayez." };
  }
  let data = null;
  try {
    data = res.status === 204 ? null : await res.json();
  } catch {
    data = null;
  }
  return res.ok
    ? { ok: true, status: res.status, data }
    : { ok: false, status: res.status, error: data?.erreur || `Erreur ${res.status}.` };
}

export function submitPassation(cfg, payload, fetchImpl = globalThis.fetch) {
  return call(fetchImpl, `${cfg.url}/v1/passations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function fetchMine(cfg, code, fetchImpl = globalThis.fetch) {
  return call(fetchImpl, `${cfg.url}/v1/passations/moi`, { method: "GET", headers: { [CODE_HEADER]: code } });
}

export function deleteMine(cfg, code, fetchImpl = globalThis.fetch) {
  return call(fetchImpl, `${cfg.url}/v1/passations/moi`, { method: "DELETE", headers: { [CODE_HEADER]: code } });
}
