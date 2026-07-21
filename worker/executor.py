import os
import subprocess
import sys
import tempfile
from typing import Dict, Any, Tuple

# Suprime a janela de console que o Windows abre por padrão pra qualquer
# subprocess.run que lance um .exe de console (python.exe) — sem isso, toda
# execução de script pisca um terminal preto na tela.
_NO_WINDOW_KW = {"creationflags": subprocess.CREATE_NO_WINDOW} if sys.platform == "win32" else {}


def run_script(script: str, params: Dict[str, Any], timeout: int) -> Tuple[str, str, int]:
    """
    Executa um script Python em subprocess isolado.
    Parâmetros são passados como variáveis de ambiente HAC_PARAM_<KEY>=<VALUE>.
    O script pode acessá-los com os.environ.get('HAC_PARAM_NOME').
    Retorna (stdout, stderr, returncode).
    """
    env = os.environ.copy()
    for key, value in params.items():
        env[f"HAC_PARAM_{key.upper()}"] = str(value)
    # Força o processo filho a escrever (e nós a ler) em UTF-8 — sem isso, no Windows
    # o stdout/stderr do script usa a codepage ANSI (ex: cp1252) e qualquer acento
    # sai errado.
    env["PYTHONIOENCODING"] = "utf-8"

    with tempfile.NamedTemporaryFile(suffix=".py", mode="w", delete=False, encoding="utf-8") as f:
        f.write(script)
        tmp_path = f.name

    try:
        result = subprocess.run(
            [sys.executable, tmp_path],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=timeout,
            env=env,
            **_NO_WINDOW_KW,
        )
        return result.stdout, result.stderr, result.returncode
    except subprocess.TimeoutExpired:
        return "", f"Timeout: execução ultrapassou {timeout}s", 1
    except Exception as e:
        return "", str(e), 1
    finally:
        os.unlink(tmp_path)
