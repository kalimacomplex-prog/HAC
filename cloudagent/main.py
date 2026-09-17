"""
HAC Cloud Agent — roda 24h no Discloud. Função única: intermediar a
execução de jobs de qualquer tenant entre a API do HAC (Render) e o
executor Playwright (Render, conta B) — claim -> repassa pro executor ->
devolve o resultado -> finish, com heartbeat pra aparecer como
"conectado" no painel.

Esse agente NUNCA executa o script do tenant localmente: ele só
transporta script/params/resultado entre a API e o executor. Isso
mantém a Discloud fora do caminho de execução (ela não tem como rodar
containers efêmeros — ver decisão de arquitetura) e evita que qualquer
credencial deste processo (HAC_EMAIL/HAC_PASSWORD, usadas só pra login
na API) chegue perto do script do tenant.

Pasta autocontida (não depende de api/ nem worker/) pra poder ser
zipada e enviada ao Discloud isoladamente.

Configuração via variáveis de ambiente (Discloud) ou .env local:
  HAC_API_URL          -> URL da API do HAC no Render
  HAC_EMAIL            -> login do usuário HAC
  HAC_PASSWORD         -> senha do usuário HAC
  HAC_AGENT_ID         -> id do agente (criado via POST /agents na API)
  HAC_EXECUTOR_URL      -> URL do executor Playwright (Render conta B)
  HAC_EXECUTOR_API_KEY  -> chave usada pra autenticar no executor
"""
import os
import time
import logging
import threading

import httpx
from dotenv import load_dotenv

load_dotenv()

from executor import run_script_remote

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("hac.cloudagent")

API_URL = os.environ["HAC_API_URL"].rstrip("/")
EMAIL = os.environ["HAC_EMAIL"]
PASSWORD = os.environ["HAC_PASSWORD"]
AGENT_ID = os.environ["HAC_AGENT_ID"]
# Antes eram opcionais (só usados como fallback quando a execução local
# falhava por falta de Playwright). Agora são obrigatórias: todo job
# passa pelo executor, sempre — o cloudagent não executa mais nada
# localmente (ver docstring acima).
EXECUTOR_URL = os.environ["HAC_EXECUTOR_URL"].rstrip("/")
_ = os.environ["HAC_EXECUTOR_API_KEY"]  # só pra falhar cedo (no boot) se faltar
POLL_INTERVAL = float(os.getenv("WORKER_POLL_SECONDS", "1"))
HEARTBEAT_INTERVAL = 30
# Plano free do Render derruba (sleep) um serviço depois de ~15min sem
# tráfego, e o primeiro request depois disso sofre cold start de
# dezenas de segundos. Como o cloudagent já fica 24h de pé na Discloud,
# ele também mantém o executor Playwright acordado com um GET /health
# periódico — bem abaixo dos 15min, com margem de sobra.
EXECUTOR_KEEPALIVE_INTERVAL = float(os.getenv("EXECUTOR_KEEPALIVE_SECONDS", "600"))

# Um único cliente HTTP pro processo inteiro (compartilhado entre o loop
# principal e as threads de heartbeat/keep-alive — httpx.Client é
# thread-safe pra isso). Antes, cada chamada usava httpx.post/get
# direto, que cria e derruba um Client novo (pool de conexão + contexto
# TLS) a cada request — com claim a cada 1s, 24h/dia, isso mantinha o
# alocador de memória do processo sempre picando pra cima, empurrando o
# uso de RAM perto do teto de 100MB do plano free da Discloud. Reusar um
# só Client (conexões keep-alive) corta essa churn sem mudar nenhum
# comportamento.
client = httpx.Client()


def login() -> str:
    resp = client.post(f"{API_URL}/auth/login", json={"email": EMAIL, "password": PASSWORD}, timeout=30)
    resp.raise_for_status()
    return resp.json()["access_token"]


def _headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def claim_job(token: str) -> dict | None:
    resp = client.post(
        f"{API_URL}/worker/claim",
        json={"agent_id": AGENT_ID},
        headers=_headers(token),
        timeout=30,
    )
    if resp.status_code == 401:
        raise PermissionError("token_expired")
    resp.raise_for_status()
    return resp.json()


def finish_job(token: str, job_id: str, status: str, output: str, error: str):
    client.post(
        f"{API_URL}/worker/jobs/{job_id}/finish",
        json={"status": status, "output": output or None, "error": error or None},
        headers=_headers(token),
        timeout=30,
    ).raise_for_status()


def _heartbeat_loop(token_ref: list):
    while True:
        time.sleep(HEARTBEAT_INTERVAL)
        try:
            resp = client.post(
                f"{API_URL}/agents/{AGENT_ID}/heartbeat",
                headers=_headers(token_ref[0]),
                timeout=10,
            )
            if resp.status_code == 401:
                token_ref[0] = login()
        except Exception:
            pass


def _executor_keepalive_loop():
    while True:
        try:
            resp = client.get(f"{EXECUTOR_URL}/health", timeout=30)
            log.info(f"Executor keep-alive: {resp.status_code}")
        except Exception as e:
            log.warning(f"Executor keep-alive falhou: {e}")
        time.sleep(EXECUTOR_KEEPALIVE_INTERVAL)


def main():
    log.info(f"HAC Cloud Agent iniciado. Conectando a {API_URL}...")
    token = login()
    log.info("Autenticado. Aguardando jobs...")

    token_ref = [token]

    t = threading.Thread(target=_heartbeat_loop, args=(token_ref,), daemon=True)
    t.start()
    log.info(f"Heartbeat ativo para agente {AGENT_ID}")

    t2 = threading.Thread(target=_executor_keepalive_loop, daemon=True)
    t2.start()
    log.info(f"Keep-alive do executor ativo ({EXECUTOR_URL}, a cada {EXECUTOR_KEEPALIVE_INTERVAL:.0f}s)")

    while True:
        try:
            token = token_ref[0]
            job = claim_job(token)
            if job:
                log.info(f"Repassando job {job['job_id']} | processo: {job['process_name']}")
                params = job.get("params", {})
                timeout = job.get("timeout_seconds", 300)
                output, error, returncode = run_script_remote(client, job["script"], params, timeout)
                status = "failed" if returncode != 0 else "done"
                finish_job(token, job["job_id"], status, output, error if status == "failed" else None)
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
