#!/usr/bin/env python3
"""
Worker IAM : une boucle, un battement de coeur, un arret propre.

Son travail, dans cycle() : appliquer la duree de conservation des passations
collectees (specs/IAM_V2_2/COLLECTE_RGPD.md). Trois ans apres le dernier jour
de collecte (COLLECTE_FIN), toutes les passations sont supprimees de la base
partagee avec le service de collecte.
"""
import os
import signal
import sqlite3
import time
from datetime import date
from pathlib import Path

INTERVAL = int(os.environ.get("WORKER_INTERVAL", "30"))
HEARTBEAT = Path(os.environ.get("WORKER_HEARTBEAT", "/tmp/heartbeat"))
STATE = Path(os.environ.get("WORKER_STATE", "/state"))
DB_PATH = Path(os.environ.get("COLLECT_DB", "/data/collecte.sqlite3"))
END_DATE = os.environ.get("COLLECTE_FIN", "")
RETENTION_YEARS = 3

stopping = False


def log(msg):
    # flush : sans lui, la sortie est bufferisee des qu'elle n'est pas un
    # terminal, et `appctl logs` ne montre rien pendant des minutes.
    print(f"{time.strftime('%Y-%m-%dT%H:%M:%S%z')} {msg}", flush=True)


def on_stop(signum, _frame):
    global stopping
    stopping = True
    log(f"signal {signum} recu : arret a la fin du cycle en cours")


def purge_date(end):
    """Fin de collecte + RETENTION_YEARS ans (un 29 fevrier devient le 28)."""
    try:
        return end.replace(year=end.year + RETENTION_YEARS)
    except ValueError:
        return end.replace(year=end.year + RETENTION_YEARS, day=28)


def retention(today=None):
    """Supprime les passations dont la duree de conservation est echue.

    Renvoie un court bilan pour le journal. La suppression tient en une seule
    instruction : un arret en plein cycle laisse la base entiere ou purgee,
    jamais a moitie.
    """
    if not END_DATE:
        return "conservation : COLLECTE_FIN absente, rien a purger"
    if not DB_PATH.exists():
        return "conservation : aucune base de collecte"
    limit = purge_date(date.fromisoformat(END_DATE))
    db = sqlite3.connect(DB_PATH, timeout=10, isolation_level=None)
    try:
        db.execute("PRAGMA busy_timeout=10000")
        if not db.execute("SELECT name FROM sqlite_master WHERE name = 'passations'").fetchone():
            return "conservation : base vide"
        if (today or date.today()) > limit:
            n = db.execute("DELETE FROM passations").rowcount
            if n:
                db.execute("VACUUM")
                return f"conservation : {n} passations supprimees (echeance {limit})"
        total = db.execute("SELECT COUNT(*) FROM passations").fetchone()[0]
        return f"conservation : {total} passations, suppression le {limit}"
    finally:
        db.close()


def cycle():
    """Le travail : compter le cycle, puis appliquer la conservation."""
    counter = STATE / "cycles"
    n = int(counter.read_text()) + 1 if counter.exists() else 1
    counter.write_text(str(n))
    log(f"cycle {n} -- {retention()}")


def main():
    signal.signal(signal.SIGTERM, on_stop)
    signal.signal(signal.SIGINT, on_stop)
    STATE.mkdir(parents=True, exist_ok=True)
    log(f"demarrage (intervalle {INTERVAL} s, etat dans {STATE})")

    while not stopping:
        try:
            cycle()
        except Exception as exc:
            # Un cycle qui echoue ne tue pas le worker : il rate son tour et
            # reessaie au suivant. Ce qui ne doit jamais etre avale, c'est le
            # message d'erreur.
            log(f"echec du cycle : {exc!r}")
        HEARTBEAT.touch()

        # Sommeil fractionne : un SIGTERM ne doit pas attendre l'intervalle
        # entier pour etre pris en compte.
        for _ in range(INTERVAL):
            if stopping:
                break
            time.sleep(1)

    log("arrete")


if __name__ == "__main__":
    main()
