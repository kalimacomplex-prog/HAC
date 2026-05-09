"""
Worker HAC — processa jobs da fila MongoDB.
Inicia como processo separado: python -m worker.main
"""
import os
import time
import logging
from datetime import datetime

from dotenv import load_dotenv

load_dotenv()

from pymongo import MongoClient, ReturnDocument

from .executor import run_script
from .notifier import send_job_notification

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("hac.worker")

MONGO_URL = os.environ["MONGO_URL"]
POLL_INTERVAL = int(os.getenv("WORKER_POLL_SECONDS", "5"))

client = MongoClient(MONGO_URL)
db = client.hac
jobs_col = db.jobs
agents_col = db.agents
users_col = db.users


def pick_job() -> dict | None:
    """Pega atomicamente o próximo job pendente e marca como 'running'."""
    return jobs_col.find_one_and_update(
        {"status": "pending"},
        {"$set": {"status": "running", "started_at": datetime.utcnow()}},
        sort=[("created_at", 1)],
        return_document=ReturnDocument.AFTER,
    )


def process_job(job: dict):
    job_id = job["_id"]
    agent = agents_col.find_one({"_id": job["agent_id"]})
    if not agent:
        jobs_col.update_one(
            {"_id": job_id},
            {"$set": {"status": "failed", "error": "Agente removido", "finished_at": datetime.utcnow()}},
        )
        return

    log.info(f"Executando job {job_id} | agente: {agent['name']}")
    output, error = run_script(agent["script"], job.get("params", {}), agent.get("timeout_seconds", 300))

    status = "failed" if error else "done"
    jobs_col.update_one(
        {"_id": job_id},
        {"$set": {
            "status": status,
            "output": output[:50_000] if output else None,
            "error": error[:10_000] if error else None,
            "finished_at": datetime.utcnow(),
        }},
    )
    log.info(f"Job {job_id} finalizado com status: {status}")

    user = users_col.find_one({"_id": job["user_id"]})
    if user:
        updated_job = jobs_col.find_one({"_id": job_id})
        send_job_notification(user["email"], user["name"], updated_job)


def main():
    log.info("HAC Worker iniciado. Aguardando jobs...")
    while True:
        try:
            job = pick_job()
            if job:
                process_job(job)
            else:
                time.sleep(POLL_INTERVAL)
        except Exception as e:
            log.error(f"Erro inesperado: {e}", exc_info=True)
            time.sleep(POLL_INTERVAL)


if __name__ == "__main__":
    main()
