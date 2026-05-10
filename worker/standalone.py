# HAC Worker — executavel standalone.
# Na primeira execucao configura ambiente em AppData/Local/HACWorker/:
#   .env  — credenciais
#   env/  — virtualenv para bibliotecas dos scripts
import os
import sys
import shutil
import venv
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

# ── CAMINHOS ──
_APPDATA     = os.environ.get("LOCALAPPDATA") or os.path.join(os.path.expanduser("~"), "AppData", "Local")
_CONFIG_DIR  = os.path.join(_APPDATA, "HACWorker")
ENV_FILE     = os.path.join(_CONFIG_DIR, ".env")
VENV_DIR     = os.path.join(_CONFIG_DIR, "env")
VENV_PYTHON  = os.path.join(VENV_DIR, "Scripts", "python.exe")
VENV_PIP     = os.path.join(VENV_DIR, "Scripts", "pip.exe")

os.makedirs(_CONFIG_DIR, exist_ok=True)

HEARTBEAT_INTERVAL = 30
POLL_INTERVAL      = 5


# ── PYTHON ──

def _find_system_python():
    for cmd in ("python", "python3", "py"):
        path = shutil.which(cmd)
        if path:
            try:
                r = subprocess.run([path, "--version"], capture_output=True, text=True, timeout=5)
                if r.returncode == 0:
                    return path
            except Exception:
                pass
    local = os.path.join(os.environ.get("LOCALAPPDATA", ""), "Programs", "Python")
    if os.path.isdir(local):
        for sub in sorted(os.listdir(local), reverse=True):
            candidate = os.path.join(local, sub, "python.exe")
            if os.path.isfile(candidate):
                return candidate
    return None


def _ensure_venv():
    # Garante que o virtualenv existe em AppData/Local/HACWorker/env/
    if os.path.isfile(VENV_PYTHON):
        log.info(f"Ambiente Python: {VENV_DIR}")
        return

    python = _find_system_python()
    if not python:
        print()
        print("Python nao encontrado. Instale em https://www.python.org e reinicie.")
        input("Pressione Enter para sair...")
        sys.exit(1)

    print()
    print(f"Criando ambiente Python em:")
    print(f"  {VENV_DIR}")
    print("Aguarde...")

    venv.create(VENV_DIR, with_pip=True, clear=False)

    print("Ambiente criado com sucesso!")
    print()
    print("Para instalar bibliotecas para seus scripts use:")
    print(f'  "{VENV_PIP}" install nome-da-biblioteca')
    print()


# ── ENV ──

def _load_env():
    """Le o .env e popula os.environ."""
    if not os.path.exists(ENV_FILE):
        return
    with open(ENV_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, value = line.partition("=")
                os.environ.setdefault(key.strip(), value.strip())


def _create_env():
    """Pergunta credenciais e cria o .env."""
    print()
    print("=" * 55)
    print("   HAC Worker — Configuracao inicial")
    print("=" * 55)
    print()
    print("Acesse o painel HAC, va em Agentes e copie o ID")
    print("do agente cadastrado para esta maquina.")
    print()

    api_url  = input("URL da API [https://hac-api-ojt8.onrender.com]: ").strip()
    if not api_url:
        api_url = "https://hac-api-ojt8.onrender.com"

    email    = input("Seu e-mail: ").strip()
    password = input("Sua senha: ").strip()
    agent_id = input("ID do agente (Enter para pular): ").strip()

    with open(ENV_FILE, "w", encoding="utf-8") as f:
        f.write(f"HAC_API_URL={api_url}\n")
        f.write(f"HAC_EMAIL={email}\n")
        f.write(f"HAC_PASSWORD={password}\n")
        f.write(f"HAC_AGENT_ID={agent_id}\n")

    _load_env()

    print()
    print("Configuracao salva em:")
    print(f"  {ENV_FILE}")
    print()
    print("Para instalar bibliotecas para seus scripts use:")
    print(f'  "{VENV_PIP}" install nome-da-biblioteca')
    print()
    print("Para reconfigurar, delete o arquivo .env acima e reinicie.")
    print()


def _ensure_env():
    if os.path.exists(ENV_FILE):
        _load_env()
        log.info(f"Configuracao: {ENV_FILE}")
    else:
        _create_env()


# ── EXECUTOR ──

def _run_script(script: str, params: dict, timeout: int):
    # Executa script no virtualenv do HACWorker
    env = os.environ.copy()
    for k, v in params.items():
        env[f"HAC_PARAM_{k.upper()}"] = str(v)

    with tempfile.NamedTemporaryFile(suffix=".py", mode="w", delete=False, encoding="utf-8") as f:
        f.write(script)
        tmp = f.name

    try:
        result = subprocess.run(
            [VENV_PYTHON, tmp],
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


def _heartbeat_loop(api_url: str, agent_id: str, token_ref: list, email: str, password: str):
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
                token_ref[0] = _login(api_url, email, password)
        except Exception:
            pass


# ── MAIN ──

def main():
    _ensure_venv()
    _ensure_env()

    api_url  = os.environ.get("HAC_API_URL", "").rstrip("/")
    email    = os.environ.get("HAC_EMAIL", "")
    password = os.environ.get("HAC_PASSWORD", "")
    agent_id = os.environ.get("HAC_AGENT_ID", "")

    if not api_url or not email or not password:
        print()
        print("Configuracao incompleta. Delete o arquivo abaixo e reinicie:")
        print(f"  {ENV_FILE}")
        input("Pressione Enter para sair...")
        sys.exit(1)

    log.info(f"HAC Worker iniciado. Conectando a {api_url}...")
    token = _login(api_url, email, password)
    log.info("Autenticado. Aguardando jobs...")

    token_ref = [token]

    if agent_id:
        t = threading.Thread(
            target=_heartbeat_loop,
            args=(api_url, agent_id, token_ref, email, password),
            daemon=True,
        )
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
                output, error = _run_script(
                    job["script"], job.get("params", {}), job.get("timeout_seconds", 300)
                )
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
