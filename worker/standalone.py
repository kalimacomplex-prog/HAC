"""
HAC Worker — executavel standalone.
Na primeira execucao faz o setup e salva hac_config.ini ao lado do .exe.
"""
import os
import sys
import configparser
import time
import logging
import threading
import subprocess
import tempfile

import httpx

# ── LOGGING ──
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
log = logging.getLogger("hac.worker")

# Config fica em AppData\Local\HACWorker\ (independente de onde o .exe está)
_APPDATA = os.environ.get("LOCALAPPDATA") or os.path.join(os.path.expanduser("~"), "AppData", "Local")
_CONFIG_DIR = os.path.join(_APPDATA, "HACWorker")
os.makedirs(_CONFIG_DIR, exist_ok=True)
CONFIG_FILE = os.path.join(_CONFIG_DIR, "hac_config.ini")

HEARTBEAT_INTERVAL = 30
POLL_INTERVAL = 5


# ── SETUP ──
def _load_or_create_config() -> configparser.ConfigParser:
    config = configparser.ConfigParser()

    if os.path.exists(CONFIG_FILE):
        config.read(CONFIG_FILE)
        log.info(f"Configuracao carregada de {CONFIG_FILE}")
        return config

    print()
    print("=" * 55)
    print("   HAC Worker — Configuracao inicial")
    print("=" * 55)
    print()
    print("Acesse o painel em https://hac-api-ojt8.onrender.com")
    print("para criar um Agente e copiar o ID antes de continuar.")
    print()

    api_url = input("URL da API [https://hac-api-ojt8.onrender.com]: ").strip()
    if not api_url:
        api_url = "https://hac-api-ojt8.onrender.com"

    email = input("Seu e-mail: ").strip()
    password = input("Sua senha: ").strip()
    agent_id = input("ID do agente (Enter para pular): ").strip()

    config["worker"] = {
        "api_url": api_url.rstrip("/"),
        "email": email,
        "password": password,
        "agent_id": agent_id,
    }

    with open(CONFIG_FILE, "w") as f:
        config.write(f)

    print()
    print(f"Configuracao salva em:")
    print(f"  {CONFIG_FILE}")
    print()
    print("Para reconfigurar, delete o arquivo acima e reinicie.")
    print()
    return config


# ── EXECUTOR ──
def _run_script(script: str, params: dict, timeout: int):
    env = os.environ.copy()
    for k, v in params.items():
        env[f"HAC_PARAM_{k.upper()}"] = str(v)

    with tempfile.NamedTemporaryFile(suffix=".py", mode="w", delete=False, encoding="utf-8") as f:
        f.write(script)
        tmp = f.name

    try:
        result = subprocess.run(
            [sys.executable, tmp],
            capture_output=True, text=True, timeout=timeout, env=env,
        )
        return result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return "", f"Timeout: execucao ultrapassou {timeout}s"
    except Exception as e:
        return "", str(e)
    finally:
        os.unlink(tmp)


# ── API ──
def _headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def _login(api_url: str, email: str, password: str) -> str:
    resp = httpx.post(f"{api_url}/auth/login", json={"email": email, "password": password}, timeout=30)
    resp.raise_for_status()
    return resp.json()["access_token"]


def _claim(api_url: str, token: str, agent_id: str):
    resp = httpx.post(
        f"{api_url}/worker/claim",
        json={"agent_id": agent_id or None},
        headers=_headers(token),
        timeout=30,
    )
    if resp.status_code == 401:
        raise PermissionError("token_expired")
    resp.raise_for_status()
    return resp.json()


def _finish(api_url: str, token: str, job_id: str, status: str, output: str, error: str):
    httpx.post(
        f"{api_url}/worker/jobs/{job_id}/finish",
        json={"status": status, "output": output or None, "error": error or None},
        headers=_headers(token),
        timeout=30,
    ).raise_for_status()


def _heartbeat_loop(api_url: str, agent_id: str, token_ref: list):
    while True:
        time.sleep(HEARTBEAT_INTERVAL)
        if not agent_id:
            continue
        try:
            resp = httpx.post(
                f"{api_url}/agents/{agent_id}/heartbeat",
                headers=_headers(token_ref[0]),
                timeout=10,
            )
            if resp.status_code == 401:
                token_ref[0] = _login(api_url, *_creds)
        except Exception:
            pass


# ── MAIN ──
_creds = ()


def main():
    global _creds

    config = _load_or_create_config()
    w = config["worker"]

    api_url  = w.get("api_url", "").rstrip("/")
    email    = w.get("email", "")
    password = w.get("password", "")
    agent_id = w.get("agent_id", "")

    if not api_url or not email or not password:
        print(f"Configuracao incompleta. Delete o arquivo abaixo e reinicie:")
        print(f"  {CONFIG_FILE}")
        input("Pressione Enter para sair...")
        sys.exit(1)

    _creds = (email, password)

    log.info(f"HAC Worker iniciado. Conectando a {api_url}...")
    token = _login(api_url, email, password)
    log.info("Autenticado. Aguardando jobs...")

    token_ref = [token]

    if agent_id:
        t = threading.Thread(target=_heartbeat_loop, args=(api_url, agent_id, token_ref), daemon=True)
        t.start()
        log.info(f"Heartbeat ativo para agente {agent_id}")
    else:
        log.info("Sem HAC_AGENT_ID — heartbeat desativado")

    while True:
        try:
            token = token_ref[0]
            job = _claim(api_url, token, agent_id)
            if job:
                log.info(f"Executando job {job['job_id']} | processo: {job['process_name']}")
                output, error = _run_script(job["script"], job.get("params", {}), job.get("timeout_seconds", 300))
                status = "failed" if error else "done"
                _finish(api_url, token, job["job_id"], status, output, error)
                log.info(f"Job {job['job_id']} finalizado: {status}")
            else:
                time.sleep(POLL_INTERVAL)
        except PermissionError:
            log.info("Token expirado, renovando...")
            token_ref[0] = _login(api_url, email, password)
        except Exception as e:
            log.error(f"Erro: {e}", exc_info=True)
            time.sleep(POLL_INTERVAL)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nWorker encerrado.")
    except Exception as e:
        print(f"\nErro fatal: {e}")
        input("Pressione Enter para sair...")
