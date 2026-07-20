#!/bin/bash
# ============================================================
#  HAC Worker — Instalador para Linux
#  Execute com:  chmod +x instalar-agente.sh && ./instalar-agente.sh
# ============================================================

set -e

INSTALL_DIR="$HOME/.hac-worker"
LAUNCHER="$HOME/.local/bin/hac-worker"
DESKTOP="$HOME/.local/share/applications/hac-worker.desktop"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}   HAC Worker — Instalador${NC}"
echo -e "${BLUE}============================================================${NC}"
echo ""

# ── 1. Verificar / instalar Python ──────────────────────────
echo -e "${YELLOW}[1/5] Verificando Python...${NC}"
if command -v python3 &>/dev/null; then
    PY=$(command -v python3)
    echo -e "${GREEN}✔ Python encontrado: $($PY --version)${NC}"
else
    echo "Python3 não encontrado. Instalando..."
    if command -v apt-get &>/dev/null; then
        sudo apt-get update -q && sudo apt-get install -y python3 python3-pip python3-venv
    elif command -v dnf &>/dev/null; then
        sudo dnf install -y python3 python3-pip
    elif command -v yum &>/dev/null; then
        sudo yum install -y python3 python3-pip
    elif command -v pacman &>/dev/null; then
        sudo pacman -Sy --noconfirm python python-pip
    else
        echo -e "${RED}Não foi possível instalar Python automaticamente.${NC}"
        echo "Instale Python 3.9+ manualmente e execute este script novamente."
        exit 1
    fi
    PY=$(command -v python3)
fi

# ── 2. Criar diretório de instalação ────────────────────────
echo -e "${YELLOW}[2/5] Criando ambiente em $INSTALL_DIR...${NC}"
mkdir -p "$INSTALL_DIR"
mkdir -p "$HOME/.local/bin"
mkdir -p "$HOME/.local/share/applications"

# ── 3. Escrever arquivos Python do worker ───────────────────
echo -e "${YELLOW}[3/5] Instalando arquivos do worker...${NC}"

cat > "$INSTALL_DIR/executor.py" << 'PYEOF'
import os, subprocess, sys, tempfile

def run_script(script, params, timeout):
    env = os.environ.copy()
    for k, v in params.items():
        env[f"HAC_PARAM_{k.upper()}"] = str(v)
    env["PYTHONIOENCODING"] = "utf-8"
    with tempfile.NamedTemporaryFile(suffix=".py", mode="w", delete=False, encoding="utf-8") as f:
        f.write(script)
        tmp = f.name
    try:
        r = subprocess.run([sys.executable, tmp], capture_output=True, text=True,
                            encoding="utf-8", errors="replace", timeout=timeout, env=env)
        return r.stdout, r.stderr, r.returncode
    except subprocess.TimeoutExpired:
        return "", f"Timeout: execução ultrapassou {timeout}s", 1
    except Exception as e:
        return "", str(e), 1
    finally:
        os.unlink(tmp)
PYEOF

cat > "$INSTALL_DIR/worker.py" << 'PYEOF'
import os, sys, time, logging, threading, configparser
import httpx
from executor import run_script

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("hac.worker")

CONFIG_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "hac_config.ini")
POLL_INTERVAL = 5
HEARTBEAT_INTERVAL = 30
_creds = ()

def _load_or_create_config():
    config = configparser.ConfigParser()
    if os.path.exists(CONFIG_FILE):
        config.read(CONFIG_FILE)
        log.info(f"Configuração carregada de {CONFIG_FILE}")
        return config

    print()
    print("=" * 55)
    print("   HAC Worker — Configuração inicial")
    print("=" * 55)
    print()
    print("Acesse o painel em https://hac-api-ojt8.onrender.com")
    print("para criar um Agente e copiar o ID antes de continuar.")
    print()

    api_url  = input("URL da API [https://hac-api-ojt8.onrender.com]: ").strip() or "https://hac-api-ojt8.onrender.com"
    email    = input("Seu e-mail: ").strip()
    password = input("Sua senha: ").strip()
    agent_id = input("ID do agente (Enter para pular): ").strip()

    config["worker"] = {"api_url": api_url.rstrip("/"), "email": email, "password": password, "agent_id": agent_id}
    with open(CONFIG_FILE, "w") as f:
        config.write(f)

    print(f"\nConfiguração salva em: {CONFIG_FILE}")
    print("Para reconfigurar delete esse arquivo e reinicie.\n")
    return config

def _headers(token): return {"Authorization": f"Bearer {token}"}

def _login(url, email, password):
    r = httpx.post(f"{url}/auth/login", json={"email": email, "password": password}, timeout=30)
    r.raise_for_status()
    return r.json()["access_token"]

def _claim(url, token, agent_id):
    r = httpx.post(f"{url}/worker/claim", json={"agent_id": agent_id or None}, headers=_headers(token), timeout=30)
    if r.status_code == 401: raise PermissionError("token_expired")
    r.raise_for_status()
    return r.json()

def _finish(url, token, job_id, status, output, error):
    httpx.post(f"{url}/worker/jobs/{job_id}/finish",
        json={"status": status, "output": output or None, "error": error or None},
        headers=_headers(token), timeout=30).raise_for_status()

def _heartbeat_loop(url, agent_id, token_ref, email, password):
    while True:
        time.sleep(HEARTBEAT_INTERVAL)
        if not agent_id: continue
        try:
            r = httpx.post(f"{url}/agents/{agent_id}/heartbeat", headers=_headers(token_ref[0]), timeout=10)
            if r.status_code == 401: token_ref[0] = _login(url, email, password)
        except: pass

def main():
    config = _load_or_create_config()
    w = config["worker"]
    url, email, password, agent_id = w.get("api_url","").rstrip("/"), w.get("email",""), w.get("password",""), w.get("agent_id","")

    if not url or not email or not password:
        print("Configuração incompleta. Delete hac_config.ini e reinicie.")
        sys.exit(1)

    log.info(f"HAC Worker iniciado. Conectando a {url}...")
    token = _login(url, email, password)
    log.info("Autenticado. Aguardando jobs...")
    token_ref = [token]

    if agent_id:
        t = threading.Thread(target=_heartbeat_loop, args=(url, agent_id, token_ref, email, password), daemon=True)
        t.start()
        log.info(f"Heartbeat ativo para agente {agent_id}")

    while True:
        try:
            token = token_ref[0]
            job = _claim(url, token, agent_id)
            if job:
                log.info(f"Executando job {job['job_id']} | processo: {job['process_name']}")
                output, error, returncode = run_script(job["script"], job.get("params", {}), job.get("timeout_seconds", 300))
                status = "failed" if returncode != 0 else "done"
                _finish(url, token, job["job_id"], status, output, error if status == "failed" else None)
                log.info(f"Job {job['job_id']} finalizado: {status}")
            else:
                time.sleep(POLL_INTERVAL)
        except PermissionError:
            log.info("Token expirado, renovando...")
            token_ref[0] = _login(url, email, password)
        except Exception as e:
            log.error(f"Erro: {e}", exc_info=True)
            time.sleep(POLL_INTERVAL)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nWorker encerrado.")
PYEOF

# ── 4. Criar ambiente virtual e instalar dependências ───────
echo -e "${YELLOW}[4/5] Instalando dependências...${NC}"
$PY -m venv "$INSTALL_DIR/venv"
"$INSTALL_DIR/venv/bin/pip" install -q --upgrade pip
"$INSTALL_DIR/venv/bin/pip" install -q httpx python-dotenv

# ── 5. Criar launcher e atalho .desktop ─────────────────────
echo -e "${YELLOW}[5/5] Criando launcher e atalho...${NC}"

cat > "$LAUNCHER" << SHEOF
#!/bin/bash
cd "$INSTALL_DIR"
exec "$INSTALL_DIR/venv/bin/python" worker.py
SHEOF
chmod +x "$LAUNCHER"

cat > "$DESKTOP" << DEOF
[Desktop Entry]
Version=1.0
Type=Application
Name=HAC Worker
Comment=Agente de execução HAC Platform
Exec=bash -c 'cd $INSTALL_DIR && $INSTALL_DIR/venv/bin/python worker.py; read -p "Pressione Enter para fechar..."'
Icon=utilities-terminal
Terminal=true
Categories=Utility;
StartupNotify=false
DEOF
chmod +x "$DESKTOP"

echo ""
echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}   Instalação concluída!${NC}"
echo -e "${GREEN}============================================================${NC}"
echo ""
echo -e "Para iniciar o worker, use uma das opções:"
echo -e "  ${BLUE}hac-worker${NC}                    (terminal)"
echo -e "  ${BLUE}Iniciar-Agente.sh${NC}             (nesta pasta)"
echo -e "  ${BLUE}HAC Worker${NC} no menu de apps    (ambientes gráficos)"
echo ""

# Executa o worker imediatamente após instalação
"$INSTALL_DIR/venv/bin/python" "$INSTALL_DIR/worker.py"
