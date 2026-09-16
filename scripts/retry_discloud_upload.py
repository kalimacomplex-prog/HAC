"""
Tenta subir o cloudagent no Discloud de 30 em 30 minutos, ate conseguir.
Roda 100% local (so chama o CLI do discloud) -- nao usa nenhuma API de IA,
entao nao gasta tokens.

Uso:
    python scripts/retry_discloud_upload.py
"""
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path

CLOUDAGENT_DIR = Path(__file__).resolve().parent.parent / "cloudagent"
INTERVAL_SECONDS = 30 * 60


def log(msg: str):
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {msg}", flush=True)


def tentar_upload() -> bool:
    result = subprocess.run(
        ["discloud", "app", "upload"],
        cwd=CLOUDAGENT_DIR,
        capture_output=True,
        text=True,
        shell=True,
    )
    saida = (result.stdout or "") + (result.stderr or "")
    log(saida.strip())

    if result.returncode == 0 and "error" not in saida.lower():
        return True
    return False


def main():
    log(f"Monitorando upload do Discloud (pasta: {CLOUDAGENT_DIR})")
    log(f"Tentando a cada {INTERVAL_SECONDS // 60} minutos. Ctrl+C para parar.")

    tentativa = 0
    while True:
        tentativa += 1
        log(f"Tentativa {tentativa}...")
        if tentar_upload():
            log("Upload feito com sucesso! Encerrando.")
            sys.exit(0)

        log(f"Falhou. Proxima tentativa em {INTERVAL_SECONDS // 60} minutos.")
        time.sleep(INTERVAL_SECONDS)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        log("Interrompido pelo usuario.")
