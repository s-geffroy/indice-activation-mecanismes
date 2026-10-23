#!/usr/bin/env python3
"""
Service de collecte des passations IAM (pilote de validation).

Recoit, avec le consentement de la personne, l'export d'une passation complete
envoye par le site statique, le valide contre le questionnaire, et le stocke
dans SQLite. Regles : specs/IAM_V2_2/COLLECTE_RGPD.md.

Minimisation : aucune adresse IP, aucun en-tete navigateur, aucun nom n'est
stocke ni journalise. La personne recoit un code de participation, dont seule
l'empreinte SHA-256 est conservee : il lui permet de consulter ou d'effacer
ses reponses (droits d'acces, d'effacement, retrait du consentement).

Bibliotheque standard seulement : rien a installer, rien a mettre a jour.
"""
import hashlib
import json
import os
import secrets
import signal
import sqlite3
import threading
import time
from datetime import date, datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

HERE = Path(__file__).resolve().parent
PORT = int(os.environ.get("COLLECT_PORT", "8080"))
DB_PATH = Path(os.environ.get("COLLECT_DB", "/data/collecte.sqlite3"))
# Seule origine autorisee a appeler le service depuis un navigateur.
ORIGIN = os.environ.get("COLLECT_ORIGIN", "https://s-geffroy.github.io")
# Dernier jour de collecte (AAAA-MM-JJ) ; aucune passation acceptee apres.
END_DATE = os.environ.get("COLLECTE_FIN", "")
# Version de la notice et du formulaire de consentement acceptes.
CONSENT_VERSION = os.environ.get("CONSENT_VERSION", "1")
QUESTIONNAIRE = json.loads((HERE / "questionnaire.json").read_text(encoding="utf-8"))

MAX_BODY = 256 * 1024
# Limite de debit en memoire, jamais ecrite : par adresse (perdue au
# redemarrage) et globale.
RATE_PER_ADDR = 10  # requetes d'ecriture par heure et par adresse
RATE_GLOBAL = 600  # requetes d'ecriture par heure, toutes adresses

OPTION_IDS = ("A", "B", "C", "D")
ACT_VALUES = (0, 1, 2, 3, 4, "X")
CODE_HEADER = "X-Code-Participation"


def log(msg):
    # Une ligne par evenement, horodatee, sans IP ni donnee de reponse.
    print(f"{time.strftime('%Y-%m-%dT%H:%M:%S%z')} {msg}", flush=True)


# --- Stockage ----------------------------------------------------------------

SCHEMA = """
CREATE TABLE IF NOT EXISTS passations (
  id INTEGER PRIMARY KEY,
  code_hash TEXT NOT NULL UNIQUE,
  received_on TEXT NOT NULL,          -- date seule (AAAA-MM-JJ)
  version TEXT NOT NULL,
  form TEXT NOT NULL,
  consent_version TEXT NOT NULL,
  payload TEXT NOT NULL               -- JSON valide et filtre
);
"""


def connect(path=None):
    db = sqlite3.connect(path or DB_PATH, timeout=10, isolation_level=None)
    db.execute("PRAGMA journal_mode=WAL")
    db.execute("PRAGMA busy_timeout=10000")
    db.executescript(SCHEMA)
    return db


def code_hash(code):
    return hashlib.sha256(code.encode("utf-8")).hexdigest()


# --- Validation --------------------------------------------------------------


class Invalid(Exception):
    pass


def _items(form):
    ids = set(QUESTIONNAIRE["forms"][form])
    return [i for i in QUESTIONNAIRE["items"] if i["id"] in ids]


def _instant(ts):
    try:
        dt = datetime.fromisoformat(str(ts).replace("Z", "+00:00"))
    except ValueError as exc:
        raise Invalid("horodatage illisible") from exc
    if dt.tzinfo is None:
        raise Invalid("horodatage sans fuseau")
    return dt.astimezone(timezone.utc)


def validate(body):
    """Renvoie la passation filtree (champs connus seulement) ou leve Invalid."""
    if not isinstance(body, dict):
        raise Invalid("corps JSON attendu")
    consent = body.get("consent")
    if not isinstance(consent, dict) or consent.get("version") != CONSENT_VERSION or consent.get("accepted") is not True:
        raise Invalid("consentement absent ou d'une autre version")
    sub = body.get("submission")
    if not isinstance(sub, dict):
        raise Invalid("passation absente")
    if sub.get("instrument") != QUESTIONNAIRE["instrument"] or sub.get("version") != QUESTIONNAIRE["version"]:
        raise Invalid("questionnaire ou version inattendus")
    form = sub.get("form")
    if form not in QUESTIONNAIRE["forms"]:
        raise Invalid("forme inconnue")
    items = _items(form)
    responses = sub.get("responses")
    if not isinstance(responses, dict) or set(responses) != {i["id"] for i in items}:
        raise Invalid("passation incomplete ou items inattendus")
    clean = {}
    for item in items:
        r = responses[item["id"]]
        if not isinstance(r, dict):
            raise Invalid(f"{item['id']} : reponse illisible")
        if item["module"] == "ACT":
            v = r.get("value")
            if isinstance(v, bool) or v not in ACT_VALUES:
                raise Invalid(f"{item['id']} : valeur hors echelle")
            clean[item["id"]] = {"value": v}
        else:
            best, worst = r.get("best"), r.get("worst")
            if best not in OPTION_IDS or worst not in OPTION_IDS or best == worst:
                raise Invalid(f"{item['id']} : choix invalide")
            clean[item["id"]] = {"best": best, "worst": worst}
    presentation = sub.get("presentation") or {}
    order = sub.get("questionOrder") or {}
    for item in items:
        if item["options"]:
            p = presentation.get(item["id"])
            if not isinstance(p, list) or sorted(p) != list(OPTION_IDS):
                raise Invalid(f"{item['id']} : ordre presente illisible")
    for module, ids in order.items():
        if not isinstance(ids, list) or sorted(ids) != sorted(i["id"] for i in items if i["module"] == module):
            raise Invalid(f"ordre des items illisible ({module})")
    started, completed = _instant(sub.get("startedAt")), _instant(sub.get("completedAt"))
    duration = (completed - started).total_seconds()
    if duration < 0:
        raise Invalid("fin anterieure au debut")
    return {
        "instrument": QUESTIONNAIRE["instrument"],
        "version": QUESTIONNAIRE["version"],
        "form": form,
        # Debut a la minute pres, duree en minutes : assez pour l'analyse.
        "startedAt": started.replace(second=0, microsecond=0).isoformat(),
        "durationMinutes": round(duration / 60),
        "responses": clean,
        "presentation": {i["id"]: presentation[i["id"]] for i in items if i["options"]},
        "questionOrder": {m: list(ids) for m, ids in order.items()},
    }


# --- Limite de debit -----------------------------------------------------------


class RateLimiter:
    def __init__(self, per_addr=RATE_PER_ADDR, global_=RATE_GLOBAL, window=3600):
        self.per_addr, self.global_, self.window = per_addr, global_, window
        self.hits = {}
        self.all = []
        self.lock = threading.Lock()

    def allow(self, addr, now=None):
        now = time.monotonic() if now is None else now
        with self.lock:
            cutoff = now - self.window
            self.all = [t for t in self.all if t > cutoff]
            mine = [t for t in self.hits.get(addr, []) if t > cutoff]
            if len(mine) >= self.per_addr or len(self.all) >= self.global_:
                self.hits[addr] = mine
                return False
            mine.append(now)
            self.hits[addr] = mine
            self.all.append(now)
            # Les adresses inactives sont oubliees : rien ne s'accumule.
            for a in [a for a, ts in self.hits.items() if not ts or ts[-1] <= cutoff]:
                del self.hits[a]
            return True


# --- HTTP ----------------------------------------------------------------------


def collecting(today=None):
    if not END_DATE:
        return False
    return (today or date.today()) <= date.fromisoformat(END_DATE)


class Handler(BaseHTTPRequestHandler):
    server_version = "iam-collecte"
    sys_version = ""
    limiter = RateLimiter()
    db_path = None

    # Le journal par defaut de http.server ecrit l'adresse IP : on le coupe.
    def log_message(self, *args):
        pass

    def _client(self):
        # Traefik est le seul a joindre ce conteneur : X-Real-Ip est la sienne.
        # Utilisee en memoire pour la limite de debit, jamais ecrite.
        return self.headers.get("X-Real-Ip") or self.client_address[0]

    def _cors(self):
        if self.headers.get("Origin") == ORIGIN:
            self.send_header("Access-Control-Allow-Origin", ORIGIN)
            self.send_header("Vary", "Origin")

    def _send(self, status, payload=None):
        body = b"" if payload is None else json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self._cors()
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        if payload is not None:
            self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if body:
            self.wfile.write(body)

    def _code(self):
        code = self.headers.get(CODE_HEADER, "")
        return code if 16 <= len(code) <= 64 else None

    def _foreign_origin(self):
        # Un navigateur envoie toujours Origin sur ces requetes : une autre
        # origine que le site est refusee.
        origin = self.headers.get("Origin")
        return origin is not None and origin != ORIGIN

    def do_OPTIONS(self):
        if self.headers.get("Origin") != ORIGIN:
            return self._send(403)
        self.send_response(204)
        self._cors()
        self.send_header("Access-Control-Allow-Methods", "POST, GET, DELETE")
        self.send_header("Access-Control-Allow-Headers", f"Content-Type, {CODE_HEADER}")
        self.send_header("Access-Control-Max-Age", "600")
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self):
        if self.path == "/healthz":
            return self._send(200, {"ok": True, "collecte": collecting()})
        if self.path != "/v1/passations/moi":
            return self._send(404, {"erreur": "introuvable"})
        if self._foreign_origin():
            return self._send(403, {"erreur": "origine refusee"})
        if not self.limiter.allow(self._client()):
            return self._send(429, {"erreur": "trop de demandes, reessayez plus tard"})
        code = self._code()
        if not code:
            return self._send(400, {"erreur": "code de participation manquant"})
        db = connect(self.db_path)
        try:
            row = db.execute(
                "SELECT received_on, consent_version, payload FROM passations WHERE code_hash = ?", (code_hash(code),)
            ).fetchone()
        finally:
            db.close()
        if not row:
            return self._send(404, {"erreur": "aucune passation pour ce code"})
        log("droit d'acces exerce")
        return self._send(200, {"receivedOn": row[0], "consentVersion": row[1], "passation": json.loads(row[2])})

    def do_DELETE(self):
        if self.path != "/v1/passations/moi":
            return self._send(404, {"erreur": "introuvable"})
        if self._foreign_origin():
            return self._send(403, {"erreur": "origine refusee"})
        if not self.limiter.allow(self._client()):
            return self._send(429, {"erreur": "trop de demandes, reessayez plus tard"})
        code = self._code()
        if not code:
            return self._send(400, {"erreur": "code de participation manquant"})
        db = connect(self.db_path)
        try:
            n = db.execute("DELETE FROM passations WHERE code_hash = ?", (code_hash(code),)).rowcount
        finally:
            db.close()
        if not n:
            return self._send(404, {"erreur": "aucune passation pour ce code"})
        log("passation effacee a la demande de la personne")
        return self._send(204)

    def do_POST(self):
        if self.path != "/v1/passations":
            return self._send(404, {"erreur": "introuvable"})
        if self._foreign_origin():
            return self._send(403, {"erreur": "origine refusee"})
        if not collecting():
            return self._send(410, {"erreur": "la collecte est close"})
        if not self.limiter.allow(self._client()):
            return self._send(429, {"erreur": "trop de demandes, reessayez plus tard"})
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = -1
        if length <= 0 or length > MAX_BODY:
            return self._send(413, {"erreur": "taille de requete invalide"})
        if not self.headers.get("Content-Type", "").startswith("application/json"):
            return self._send(415, {"erreur": "JSON attendu"})
        try:
            body = json.loads(self.rfile.read(length).decode("utf-8"))
            clean = validate(body)
        except (UnicodeDecodeError, json.JSONDecodeError):
            return self._send(400, {"erreur": "JSON illisible"})
        except Invalid as exc:
            log(f"passation refusee : {exc}")
            return self._send(422, {"erreur": str(exc)})
        code = secrets.token_urlsafe(16)
        db = connect(self.db_path)
        try:
            db.execute(
                "INSERT INTO passations (code_hash, received_on, version, form, consent_version, payload) VALUES (?, ?, ?, ?, ?, ?)",
                (code_hash(code), date.today().isoformat(), clean["version"], clean["form"], CONSENT_VERSION,
                 json.dumps(clean, ensure_ascii=False, separators=(",", ":"))),
            )
        finally:
            db.close()
        log(f"passation recue (forme {clean['form']})")
        return self._send(201, {"code": code})


def main():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    connect().close()
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)

    def stop(signum, _frame):
        log(f"signal {signum} recu : arret")
        threading.Thread(target=server.shutdown, daemon=True).start()

    signal.signal(signal.SIGTERM, stop)
    signal.signal(signal.SIGINT, stop)
    state = f"ouverte jusqu'au {END_DATE}" if collecting() else "fermee (COLLECTE_FIN absente ou depassee)"
    log(f"demarrage sur le port {PORT}, origine {ORIGIN}, consentement v{CONSENT_VERSION}, collecte {state}")
    server.serve_forever()
    log("arrete")


if __name__ == "__main__":
    main()
