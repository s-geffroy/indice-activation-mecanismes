"""Tests du service de collecte et de la purge : python3 -m unittest discover -s tests/collect"""
import importlib.util
import json
import os
import sqlite3
import sys
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from datetime import date, timedelta
from http.server import ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ORIGIN = "https://s-geffroy.github.io"
TMP = tempfile.mkdtemp(prefix="iam-collect-")
os.environ.update({
    "COLLECTE_FIN": (date.today() + timedelta(days=30)).isoformat(),
    "COLLECT_ORIGIN": ORIGIN,
    "CONSENT_VERSION": "1",
    "COLLECT_DB": os.path.join(TMP, "collecte.sqlite3"),
    "WORKER_STATE": os.path.join(TMP, "state"),
})


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[name] = mod
    spec.loader.exec_module(mod)
    return mod


server = load("iam_collect_server", ROOT / "src/collect/server.py")
worker = load("iam_worker", ROOT / "src/worker.py")
Q = server.QUESTIONNAIRE


def submission(form="court"):
    """Passation complete et valide, au format de buildExport (site)."""
    ids = set(Q["forms"][form])
    items = [i for i in Q["items"] if i["id"] in ids]
    responses = {}
    for i in items:
        responses[i["id"]] = {"value": 3} if i["module"] == "ACT" else {"best": "B", "worst": "A"}
    return {
        "instrument": "IAM", "version": Q["version"], "form": form,
        "status": "instrument expérimental pré-validation",
        "startedAt": "2026-10-23T09:00:12.345Z", "completedAt": "2026-10-23T09:14:59.000Z",
        "moduleOrder": ["ACT", "CAP", "INT"],
        "questionOrder": {m: [i["id"] for i in items if i["module"] == m] for m in ("ACT", "CAP", "INT")},
        "responses": responses,
        "presentation": {i["id"]: ["D", "C", "B", "A"] for i in items if i["options"]},
        "scores": {"ACT": {"global": 75}},
        "attention": {"V1": True},
    }


def body(form="court", **consent):
    return {"consent": {"version": "1", "accepted": True, **consent}, "submission": submission(form)}


class Validation(unittest.TestCase):
    def test_passation_valide_filtree(self):
        clean = server.validate(body())
        self.assertEqual(clean["form"], "court")
        self.assertEqual(len(clean["responses"]), 28)
        # Minimisation : ni scores, ni statut, ni secondes.
        self.assertNotIn("scores", clean)
        self.assertNotIn("status", clean)
        self.assertEqual(clean["startedAt"], "2026-10-23T09:00:00+00:00")
        self.assertEqual(clean["durationMinutes"], 15)

    def test_forme_complete(self):
        self.assertEqual(len(server.validate(body("complet"))["responses"]), 108)

    def test_consentement_exige(self):
        for bad in ({"version": "0", "accepted": True}, {"version": "1", "accepted": False}, None):
            b = body()
            b["consent"] = bad
            with self.assertRaises(server.Invalid):
                server.validate(b)

    def test_passations_invalides(self):
        cases = []
        b = body(); del b["submission"]["responses"]["C01"]; cases.append(b)
        b = body(); b["submission"]["responses"]["C02"] = {"best": "A", "worst": "B"}; cases.append(b)
        b = body(); b["submission"]["responses"]["C01"] = {"best": "A", "worst": "A"}; cases.append(b)
        b = body(); b["submission"]["responses"]["A01"] = {"value": 5}; cases.append(b)
        b = body(); b["submission"]["responses"]["A01"] = {"value": True}; cases.append(b)
        b = body(); b["submission"]["version"] = "2.1"; cases.append(b)
        b = body(); b["submission"]["form"] = "moyen"; cases.append(b)
        b = body(); b["submission"]["presentation"]["C01"] = ["A", "A", "B", "C"]; cases.append(b)
        b = body(); b["submission"]["completedAt"] = "2026-10-22T09:00:00Z"; cases.append(b)
        b = body(); b["submission"]["startedAt"] = "hier"; cases.append(b)
        for b in cases:
            with self.assertRaises(server.Invalid):
                server.validate(b)

    def test_limite_de_debit(self):
        rl = server.RateLimiter(per_addr=2, global_=3, window=10)
        self.assertTrue(rl.allow("a", 0))
        self.assertTrue(rl.allow("a", 1))
        self.assertFalse(rl.allow("a", 2))
        self.assertTrue(rl.allow("b", 2))
        self.assertFalse(rl.allow("c", 3))  # plafond global
        self.assertTrue(rl.allow("a", 12))  # fenetre ecoulee
        self.assertNotIn("b", rl.hits)  # adresse inactive oubliee

    def test_fin_de_collecte(self):
        end = date.fromisoformat(os.environ["COLLECTE_FIN"])
        self.assertTrue(server.collecting(end))
        self.assertFalse(server.collecting(end + timedelta(days=1)))


class Http(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        server.Handler.limiter = server.RateLimiter(per_addr=1000, global_=1000)
        cls.httpd = ThreadingHTTPServer(("127.0.0.1", 0), server.Handler)
        cls.url = f"http://127.0.0.1:{cls.httpd.server_address[1]}"
        threading.Thread(target=cls.httpd.serve_forever, daemon=True).start()

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()

    def call(self, method, path, payload=None, headers=None):
        data = None if payload is None else json.dumps(payload).encode()
        h = {"Origin": ORIGIN, **({"Content-Type": "application/json"} if data else {}), **(headers or {})}
        req = urllib.request.Request(self.url + path, data=data, method=method, headers=h)
        try:
            with urllib.request.urlopen(req) as r:
                raw = r.read()
                return r.status, dict(r.headers), json.loads(raw) if raw else None
        except urllib.error.HTTPError as e:
            raw = e.read()
            return e.code, dict(e.headers), json.loads(raw) if raw else None

    def test_cycle_complet_depot_acces_effacement(self):
        status, headers, res = self.call("POST", "/v1/passations", body())
        self.assertEqual(status, 201)
        self.assertEqual(headers["Access-Control-Allow-Origin"], ORIGIN)
        code = res["code"]
        self.assertGreaterEqual(len(code), 16)
        # Seule l'empreinte du code est stockee, aucune IP.
        db = sqlite3.connect(os.environ["COLLECT_DB"])
        row = db.execute("SELECT code_hash, received_on, payload FROM passations ORDER BY id DESC").fetchone()
        db.close()
        self.assertEqual(row[0], server.code_hash(code))
        self.assertEqual(row[1], date.today().isoformat())
        self.assertNotIn("127.0.0.1", row[2])
        status, _, res = self.call("GET", "/v1/passations/moi", headers={"X-Code-Participation": code})
        self.assertEqual(status, 200)
        self.assertEqual(res["passation"]["form"], "court")
        status, _, _ = self.call("DELETE", "/v1/passations/moi", headers={"X-Code-Participation": code})
        self.assertEqual(status, 204)
        status, _, _ = self.call("GET", "/v1/passations/moi", headers={"X-Code-Participation": code})
        self.assertEqual(status, 404)

    def test_origine_etrangere_refusee(self):
        status, headers, _ = self.call("POST", "/v1/passations", body(), headers={"Origin": "https://exemple.org"})
        self.assertEqual(status, 403)
        self.assertNotIn("Access-Control-Allow-Origin", headers)
        status, _, _ = self.call("OPTIONS", "/v1/passations", headers={"Origin": "https://exemple.org"})
        self.assertEqual(status, 403)

    def test_preflight(self):
        status, headers, _ = self.call("OPTIONS", "/v1/passations")
        self.assertEqual(status, 204)
        self.assertIn("X-Code-Participation", headers["Access-Control-Allow-Headers"])

    def test_passation_invalide_rejetee(self):
        b = body()
        b["consent"]["accepted"] = False
        status, _, res = self.call("POST", "/v1/passations", b)
        self.assertEqual(status, 422)
        self.assertIn("consentement", res["erreur"])

    def test_code_inconnu_ou_absent(self):
        self.assertEqual(self.call("GET", "/v1/passations/moi", headers={"X-Code-Participation": "x" * 22})[0], 404)
        self.assertEqual(self.call("DELETE", "/v1/passations/moi")[0], 400)

    def test_sante(self):
        status, _, res = self.call("GET", "/healthz")
        self.assertEqual(status, 200)
        self.assertTrue(res["collecte"])


class Retention(unittest.TestCase):
    def setUp(self):
        self.db_path = Path(TMP) / "retention.sqlite3"
        self.db_path.unlink(missing_ok=True)
        db = server.connect(self.db_path)
        for k in range(3):
            db.execute(
                "INSERT INTO passations (code_hash, received_on, version, form, consent_version, payload) VALUES (?, '2026-11-01', '2.2', 'court', '1', '{}')",
                (f"h{k}",),
            )
        db.close()
        worker.DB_PATH = self.db_path
        worker.END_DATE = "2027-06-30"

    def count(self):
        db = sqlite3.connect(self.db_path)
        n = db.execute("SELECT COUNT(*) FROM passations").fetchone()[0]
        db.close()
        return n

    def test_conservation_trois_ans_puis_suppression(self):
        self.assertEqual(worker.purge_date(date(2027, 6, 30)), date(2030, 6, 30))
        self.assertEqual(worker.purge_date(date(2028, 2, 29)), date(2031, 2, 28))
        self.assertIn("3 passations, suppression le 2030-06-30", worker.retention(date(2030, 6, 30)))
        self.assertEqual(self.count(), 3)
        self.assertIn("3 passations supprimees", worker.retention(date(2030, 7, 1)))
        self.assertEqual(self.count(), 0)

    def test_sans_date_de_fin_rien_n_est_purge(self):
        worker.END_DATE = ""
        self.assertIn("COLLECTE_FIN absente", worker.retention(date(2099, 1, 1)))
        self.assertEqual(self.count(), 3)


if __name__ == "__main__":
    unittest.main()
