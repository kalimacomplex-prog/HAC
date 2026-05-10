"""
Worker HAC — executa jobs localmente, comunicando com a API central.
Configuração via .env: HAC_API_URL, HAC_EMAIL, HAC_PASSWORD, HAC_AGENT_ID (opcional)
"""
import os
import time
import logging
import threading

import httpx
from dotenv import load_dotenv

load_dotenv()

from .executor import run_script

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("hac.worker")

API_URL = os.environ["HAC_API_URL"].rstrip("/")
EMAIL = os.environ["HAC_EMAIL"]
PASSWORD = os.environ["HAC_PASSWORD"]
AGENT_ID = os.getenv("HAC_AGENT_ID", "")
POLL_INTERVAL = int(os.getenv("WORKER_POLL_SECONDS", "5"))
HEARTBEAT_INTERVAL = 30


def login() -> str:
    resp = httpx.post(f"{API_URL}/auth/login", json={"email": EMAIL, "password": PASSWORD}, timeout=30)
    resp.raise_for_status()
    return resp.json()["access_token"]


def _headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def claim_job(token: str) -> dict | None:
    resp = httpx.post(f"{API_URL}/worker/claim", headers=_headers(token), timeout=30)
    if resp.status_code == 401:
        raise PermissionError("token_expired")
    resp.raise_for_status()
    return resp.json()


def finish_job(token: str, job_id: str, status: str, output: str, error: str):
    httpx.post(
        f"{API_URL}/worker/jobs/{job_id}/finish",
        json={"status": status, "output": output or None, "error": error or None},
        headers=_headers(token),
        timeout=30,
    ).raise_for_status()


def _heartbeat_loop(token_ref: list):
    while True:
        time.sleep(HEARTBEAT_INTERVAL)
        if not AGENT_ID:
            continue
        try:
            resp = httpx.post(
                f"{API_URL}/agents/{AGENT_ID}/heartbeat",
                headers=_headers(token_ref[0]),
                timeout=10,
            )
            if resp.status_code == 401:
                token_ref[0] = login()
        except Exception:
            pass


def main():
    log.info(f"HAC Worker iniciado. Conectando a {API_URL}...")
    token = login()
    log.info("Autenticado. Aguardando jobs...")

    token_ref = [token]

    if AGENT_ID:
        t = threading.Thread(target=_heartbeat_loop, args=(token_ref,), daemon=True)
        t.start()
        log.info(f"Heartbeat ativo para agente {AGENT_ID}")
    else:
        log.info("HAC_AGENT_ID não configurado — status de conexão desativado")

    while True:
        try:
            token = token_ref[0]
            job = claim_job(token)
            if job:
                log.info(f"Executando job {job['job_id']} | processo: {job['process_name']}")
                output, error = run_script(job["script"], job.get("params", {}), job.get("timeout_seconds", 300))
                status = "failed" if error else "done"
                finish_job(token, job["job_id"], status, output, error)
                log.info(f"Job {job['job_id']} finalizado: {status}")
            else:
                time.sleep(POLL_INTERVAL)
        except PermissionError:
            log.info("Token expirado, renovando...")
            token_ref[0] = login()
        except Exception as e:
            log.error(f"Erro: {e}", exc_info=True)
            time.sleep(POLL_INTERVAL)


if __name__ == "__main__":
    main()
