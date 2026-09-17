"""
Executor de scripts com Playwright — roda na conta B do Render.
Recebe scripts do cloudagent (Discloud) via HTTP, roda num subprocess
isolado (mesmo mecanismo do worker/cloudagent) e devolve o resultado.

Só existe porque o Chromium consome RAM demais pra ficar sempre de pé
no agente 24h (Discloud, RAM curta) — aqui ele sobe sob demanda.
"""
import os
import subprocess
import sys
import tempfile
from typing import Any, Dict, Optional

from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel

app = FastAPI(title="HAC Playwright Executor")

API_KEY = os.environ["EXECUTOR_API_KEY"]


class RunTaskRequest(BaseModel):
    script: str
    params: Dict[str, Any] = {}
    timeout_seconds: int = 300


def run_script(script: str, params: Dict[str, Any], timeout: int):
    # Ambiente mínimo e explícito — NUNCA os.environ.copy(). Este é o
    # ponto onde o script arbitrário de qualquer tenant roda; copiar o
    # ambiente do processo vazaria EXECUTOR_API_KEY (e qualquer outra
    # credencial deste serviço) pro script de quem quer que tenha
    # mandado o job. As únicas variáveis herdadas do processo são as que
    # a imagem oficial do Playwright cozinha (não são segredo, são só
    # caminho de instalação): PATH e PLAYWRIGHT_BROWSERS_PATH (browsers
    # em /ms-playwright, ver Dockerfile), e HOME (fontconfig/Chromium
    # dependem de um HOME válido pra profile dir e cache).
    env = {
        "PATH": os.environ.get("PATH", ""),
        "PLAYWRIGHT_BROWSERS_PATH": os.environ.get("PLAYWRIGHT_BROWSERS_PATH", "/ms-playwright"),
        "HOME": os.environ.get("HOME", "/root"),
        "PYTHONIOENCODING": "utf-8",
    }
    for key, value in params.items():
        env[f"HAC_PARAM_{key.upper()}"] = str(value)

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


def _check_auth(authorization: Optional[str]):
    if not authorization or authorization.removeprefix("Bearer ").strip() != API_KEY:
        raise HTTPException(status_code=401, detail="Chave de API inválida")


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/run-task")
async def run_task(body: RunTaskRequest, authorization: Optional[str] = Header(None)):
    _check_auth(authorization)
    stdout, stderr, returncode = run_script(body.script, body.params, body.timeout_seconds)
    return {"stdout": stdout, "stderr": stderr, "returncode": returncode}
