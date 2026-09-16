import os
import subprocess
import sys
import tempfile
from typing import Dict, Any, Tuple

import httpx

# Sinais de que o script precisa de um browser (Playwright) que não existe
# neste agente — nesse caso ele é reenviado pro executor no Render.
_PLAYWRIGHT_MISSING_MARKERS = (
    "no module named 'playwright'",
    "executable doesn't exist",
    "playwright install",
)


def needs_playwright_fallback(stderr: str) -> bool:
    lowered = stderr.lower()
    return any(marker in lowered for marker in _PLAYWRIGHT_MISSING_MARKERS)


def run_script_remote(script: str, params: Dict[str, Any], timeout: int) -> Tuple[str, str, int]:
    """
    Repassa o script pro executor Playwright (Render conta B) via HTTP,
    quando a execução local falhou por falta de browser.
    """
    executor_url = os.environ["HAC_EXECUTOR_URL"].rstrip("/")
    api_key = os.environ["HAC_EXECUTOR_API_KEY"]
    resp = httpx.post(
        f"{executor_url}/run-task",
        json={"script": script, "params": params, "timeout_seconds": timeout},
        headers={"Authorization": f"Bearer {api_key}"},
        timeout=timeout + 30,
    )
    resp.raise_for_status()
    data = resp.json()
    return data["stdout"], data["stderr"], data["returncode"]


def run_script(script: str, params: Dict[str, Any], timeout: int) -> Tuple[str, str, int]:
    """
    Executa um script Python em subprocess isolado.
    Parâmetros são passados como variáveis de ambiente HAC_PARAM_<KEY>=<VALUE>.
    Retorna (stdout, stderr, returncode).
    """
    env = os.environ.copy()
    for key, value in params.items():
        env[f"HAC_PARAM_{key.upper()}"] = str(value)
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
        )
        return result.stdout, result.stderr, result.returncode
    except subprocess.TimeoutExpired:
        return "", f"Timeout: execução ultrapassou {timeout}s", 1
    except Exception as e:
        return "", str(e), 1
    finally:
        os.unlink(tmp_path)
