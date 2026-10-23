// Tests de la collecte cote site : node --test tests/site/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { QUESTIONNAIRE as Q } from "../../site/data/questionnaire.js";
import { COLLECT } from "../../site/data/collect.js";
import { CONFIG, createSession, formItems, setActValue, setChoice } from "../../site/assets/core.js";
import {
  RETENTION_YEARS, buildSubmission, collectOpen, consentRecord, deleteMine, fetchMine, retentionEnd, submitPassation,
} from "../../site/assets/collect.js";

const ROOT = new URL("../../", import.meta.url).pathname;
const CFG = { url: "https://collecte.exemple.fr", endDate: "2027-06-30", consentVersion: "1" };

function completed(form = "court") {
  const s = createSession(Q, CONFIG, Math.random, new Date("2026-10-23T09:00:00Z"), form);
  for (const i of formItems(Q, form)) {
    if (i.module === "ACT") setActValue(s, i.id, 2);
    else { setChoice(s, i.id, "best", "B"); setChoice(s, i.id, "worst", "A"); }
  }
  s.completedAt = "2026-10-23T09:14:00Z";
  return s;
}

// Faux fetch : enregistre l'appel et renvoie la reponse donnee.
function fakeFetch(status, data) {
  const calls = [];
  const impl = async (url, init) => {
    calls.push({ url, init });
    return { ok: status >= 200 && status < 300, status, json: async () => data };
  };
  return { impl, calls };
}

test("aucune collecte n'est livree par defaut, et la CSP l'interdit", () => {
  assert.equal(COLLECT, null);
  for (const page of ["index.html", "confidentialite/index.html"]) {
    const html = readFileSync(join(ROOT, "site", page), "utf8");
    assert.match(html, /connect-src 'none'/, page);
  }
});

test("une collecte configuree doit etre autorisee par la CSP, et elle seule", { skip: COLLECT === null && "collecte non configuree" }, () => {
  const origin = new URL(COLLECT.url).origin;
  assert.equal(COLLECT.url, origin, "url = origine, sans chemin ni barre finale");
  for (const page of ["index.html", "confidentialite/index.html"]) {
    const html = readFileSync(join(ROOT, "site", page), "utf8");
    assert.ok(html.includes(`connect-src ${origin};`), `${page} : connect-src ${origin} attendu`);
  }
  for (const k of ["endDate", "consentVersion", "controller", "contact", "host", "logsRetention"]) assert.ok(COLLECT[k], k);
});

test("collecte ouverte jusqu'au dernier jour inclus, fermee sans configuration", () => {
  assert.equal(collectOpen(null), false);
  assert.equal(collectOpen({ ...CFG, endDate: "" }), false);
  assert.ok(collectOpen(CFG, new Date(2027, 5, 30, 23, 59)));
  assert.equal(collectOpen(CFG, new Date(2027, 6, 1, 0, 0)), false);
});

test("conservation annoncee : trois ans apres la fin, comme le worker", () => {
  assert.equal(RETENTION_YEARS, 3);
  assert.match(readFileSync(join(ROOT, "src/worker.py"), "utf8"), /RETENTION_YEARS = 3\b/);
  assert.equal(retentionEnd(CFG), "2030-06-30");
  assert.equal(retentionEnd({ ...CFG, endDate: "2028-02-29" }), "2031-02-28");
});

test("rien n'est transmis sans consentement", () => {
  const s = completed();
  assert.throws(() => buildSubmission(Q, s));
  s.consent = { declined: true };
  assert.throws(() => buildSubmission(Q, s));
});

test("la transmission contient le consentement et l'export de la passation", () => {
  const s = completed();
  s.consent = consentRecord(CFG, new Date("2026-10-23T08:59:00Z"));
  const payload = buildSubmission(Q, s);
  assert.deepEqual(payload.consent, { version: "1", accepted: true });
  assert.equal(payload.submission.form, "court");
  assert.equal(Object.keys(payload.submission.responses).length, 28);
});

test("appel du service : URL, methode, aucun cookie ni referent", async () => {
  const { impl, calls } = fakeFetch(201, { code: "abcdefghijklmnopqrstuv" });
  const res = await submitPassation(CFG, { a: 1 }, impl);
  assert.deepEqual(res, { ok: true, status: 201, data: { code: "abcdefghijklmnopqrstuv" } });
  assert.equal(calls[0].url, "https://collecte.exemple.fr/v1/passations");
  assert.equal(calls[0].init.method, "POST");
  assert.equal(calls[0].init.credentials, "omit");
  assert.equal(calls[0].init.referrerPolicy, "no-referrer");
  assert.equal(calls[0].init.body, '{"a":1}');
});

test("droits : le code part dans un en-tete, jamais dans l'URL", async () => {
  const { impl, calls } = fakeFetch(204, null);
  assert.ok((await deleteMine(CFG, "code-secret-1234567", impl)).ok);
  await fetchMine(CFG, "code-secret-1234567", impl);
  for (const c of calls) {
    assert.equal(c.url, "https://collecte.exemple.fr/v1/passations/moi");
    assert.equal(c.init.headers["X-Code-Participation"], "code-secret-1234567");
  }
  assert.deepEqual(calls.map((c) => c.init.method), ["DELETE", "GET"]);
});

test("erreurs du service et coupure reseau rendues lisibles", async () => {
  const refused = await submitPassation(CFG, {}, fakeFetch(410, { erreur: "la collecte est close" }).impl);
  assert.deepEqual(refused, { ok: false, status: 410, error: "la collecte est close" });
  const down = await submitPassation(CFG, {}, async () => { throw new TypeError("Failed to fetch"); });
  assert.equal(down.ok, false);
  assert.equal(down.status, 0);
  assert.match(down.error, /injoignable/);
});
