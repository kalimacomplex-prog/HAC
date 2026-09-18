"""
HAC RPA Executor — roda dentro de um runner efêmero do GitHub Actions
(workflow_dispatch), um por job.

Sobe, busca o payload do job (script/params/timeout) na API do HAC,
executa e reporta o resultado via /worker/jobs/{JOB_ID}/finish, depois
termina. Nunca fica de pé esperando outro job — isolamento por tenant vem
de cada execution ser disparada sob demanda só pra um job específico (ver
api/github_actions.py, que dispara o workflow via workflow_dispatch —
modelo push: a API já sabe qual job rodar no momento do disparo).

O script/params não viajam no disparo do workflow (workflow_dispatch tem
limite de tamanho de input) — só `job_id`/`job_token`, e o payload
completo é buscado aqui via GET, autenticado com o mesmo job-token.

Env vars (injetadas pelo workflow, a partir dos inputs do
workflow_dispatch — ver .github/workflows/rpa-executor.yml):
  JOB_ID
  JOB_TOKEN         -> token de escopo único (autoriza buscar o payload
                        e terminar ESTE job, nada além disso)
  HAC_API_URL       -> URL pública da API do HAC (repository variable)
"""
import os
import shutil
import subprocess
import sys
import tempfile

import httpx

JOB_ID = os.environ["JOB_ID"]
JOB_TOKEN = os.environ["JOB_TOKEN"]
API_URL = os.environ["HAC_API_URL"].rstrip("/")


def fetch_payload() -> dict:
    resp = httpx.get(
        f"{API_URL}/worker/jobs/{JOB_ID}/payload",
        headers={"Authorization": f"Bearer {JOB_TOKEN}"},
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()


def run_script(script: str, params: dict, timeout: int):
    # Mesmo isolamento do playwright_executor/main.py::run_script: workdir
    # temporário próprio como cwd/TMPDIR, ambiente mínimo explícito (nunca
    # os.environ.copy(), senão JOB_TOKEN vazaria pro script do tenant),
    # apagado no final.
    workdir = tempfile.mkdtemp(prefix="hac_job_")

    env = {
        "PATH": os.environ.get("PATH", ""),
        "PLAYWRIGHT_BROWSERS_PATH": os.environ.get("PLAYWRIGHT_BROWSERS_PATH", "/ms-playwright"),
        "HOME": os.environ.get("HOME", "/root"),
        "PYTHONIOENCODING": "utf-8",
        "TMPDIR": workdir,
        "TEMP": workdir,
        "TMP": workdir,
    }
    for key, value in params.items():
        env[f"HAC_PARAM_{key.upper()}"] = str(value)

    script_path = os.path.join(workdir, "script.py")
    with open(script_path, "w", encoding="utf-8") as f:
        f.write(script)

    try:
        result = subprocess.run(
            [sys.executable, script_path],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=timeout,
            env=env,
            cwd=workdir,
        )
        return result.stdout, result.stderr, result.returncode
    except subprocess.TimeoutExpired:
        return "", f"Timeout: execução ultrapassou {timeout}s", 1
    except Exception as e:
        return "", str(e), 1
    finally:
        shutil.rmtree(workdir, ignore_errors=True)


def report_finish(status: str, output: str, error: str):
    httpx.post(
        f"{API_URL}/worker/jobs/{JOB_ID}/finish",
        json={"status": status, "output": output or None, "error": error or None},
        headers={"Authorization": f"Bearer {JOB_TOKEN}"},
        timeout=30,
    ).raise_for_status()


def main():
    payload = fetch_payload()
    stdout, stderr, returncode = run_script(
        payload["script"], payload.get("params", {}), payload.get("timeout_seconds", 300)
    )
    status = "failed" if returncode != 0 else "done"
    report_finish(status, stdout, stderr if status == "failed" else None)
    sys.exit(returncode)


if __name__ == "__main__":
    main()
