"""
HAC Worker — executavel standalone.
Na primeira execucao verifica/instala Python e cria .env em
AppData\Local\HACWorker\
"""
import os
import sys
import shutil
import time
import logging
import threading
import subprocess
import tempfile
import urllib.request

import httpx
from dotenv import load_dotenv

# ── LOGGING ──
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
log = logging.getLogger("hac.worker")

# ── CAMINHOS ──
_APPDATA = os.environ.get("LOCALAPPDATA") or os.path.join(os.path.expanduser("~"), "AppData", "Local")
_CONFIG_DIR = os.path.join(_APPDATA, "HACWorker")
os.makedirs(_CONFIG_DIR, exist_ok=True)
ENV_FILE = os.path.join(_CONFIG_DIR, ".env")

HEARTBEAT_INTERVAL = 30
POLL_INTERVAL = 5
PYTHON_INSTALLER_URL = "https://www.python.org/ftp/python/3.12.9/python-3.12.9-amd64.exe"


# ── PYTHON ──

def _find_python():
    """Procura Python instalado no sistema."""
    for cmd in ("python", "python3", "py"):
        path = shutil.which(cmd)
        if path:
            try:
                r = subprocess.run([path, "--version"], capture_output=True, text=True, timeout=5)
                if r.returncode == 0:
                    return path
            except Exception:
                pass

    # Procura em AppData\Local\Programs\Python (instalacao de usuario)
    local = os.path.join(os.environ.get("LOCALAPPDATA", ""), "Programs", "Python")
    if os.path.isdir(local):
        for sub in sorted(os.listdir(local), reverse=True):
            candidate = os.path.join(local, sub, "python.exe")
            if os.path.isfile(candidate):
                return candidate

    return None


def _install_python():
    """Baixa e instala Python 3.12 silenciosamente."""
    print()
    print("Python nao encontrado no sistema.")
    print(f"Baixando Python 3.12 (pode demorar alguns minutos)...")

    installer = os.path.join(tempfile.gettempdir(), "python_installer.exe")

    def _progresso(count, block, total):
        pct = min(int(count * block * 100 / total), 100)
        print(f"\r  Baixando... {pct}%", end="", flush=True)

    try:
        urllib.request.urlretrieve(PYTHON_INSTALLER_URL, installer, _progresso)
    except Exception as e:
        print(f"\nErro ao baixar Python: {e}")
        return False

    print("\nInstalando Python (aguarde)...")
    result = subprocess.run([
        installer, "/quiet",
        "InstallAllUsers=0",
        "PrependPath=1",
        "Include_pip=1",
        "Include_launcher=1",
    ], timeout=300)

    try:
        os.unlink(installer)
    except Exception:
        pass

    if result.returncode != 0:
        print(f"Falha na instalacao do Python (codigo {result.returncode}).")
        return False

    print("Python instalado com sucesso!")
    return True


def _ensure_python() -> str:
    """Garante que Python esta disponivel e retorna o caminho."""
    python = _find_python()
    if python:
        log.info(f"Python: {python}")
        return python

    ok = _install_python()
    if not ok:
        print()
        print("Nao foi possivel instalar o Python automaticamente.")
        print("Instale manualmente em https://www.python.org e reinicie o HAC Worker.")
        input("Pressione Enter para sair...")
        sys.exit(1)

    python = _find_python()
    if not python:
        print()
        print("Python foi instalado mas nao foi encontrado no PATH.")
        print("Feche este terminal, abra um novo e reinicie o HAC Worker.")
        input("Pressione Enter para sair...")
        sys.exit(1)

    return python


# ── CONFIGURACAO ──

def _load_or_create_env():
    """Carrega .env existente ou cria um novo perguntando ao usuario."""
    if os.path.exists(ENV_FILE):
        load_dotenv(ENV_FILE)
        log.info(f"Configuracao: {ENV_FILE}")
        return

    print()
    print("=" * 55)
    print("   HAC Worker — Configuracao inicial")
    print("=" * 55)
    print()
    print("Acesse o painel HAC, va em Agentes e copie o ID")
    print("do agente antes de continuar.")
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

    load_dotenv(ENV_FILE)

    print()
    print("Configuracao salva em:")
    print(f"  {ENV_FILE}")
    print()
    print("Para reconfigurar, delete o arquivo acima e reinicie.")
    print()


# ── EXECUTOR ──

def _run_script(python: str, script: str, params: dict, timeout: int):
    """Executa script Python usando o Python do sistema."""
    env = os.environ.copy()
    for k, v in params.items():
        env[f"HAC_PARAM_{k.upper()}"] = str(v)

    with tempfile.NamedTemporaryFile(suffix=".py", mode="w", delete=False, encoding="utf-8") as f:
        f.write(script)
        tmp = f.name

    try:
        result = subprocess.run(
            [python, tmp],
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
    python = _ensure_python()
    _load_or_create_env()

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
                    python, job["script"], job.get("params", {}), job.get("timeout_seconds", 300)
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
