import os
from typing import Dict, Any, Tuple

import httpx


def run_script_remote(client: httpx.Client, script: str, params: Dict[str, Any], timeout: int) -> Tuple[str, str, int]:
    """
    Repassa o script pro executor Playwright (Render conta B) via HTTP.
    O cloudagent (Discloud) nunca executa o script do tenant — só
    intermedia: recebe o job da API, repassa pro executor, devolve o
    resultado. Nenhuma credencial do cloudagent (HAC_EMAIL/HAC_PASSWORD)
    é enviada nesse repasse; só o script, os params e um timeout.

    Recebe `client` (um httpx.Client já aberto, reusado por todo o
    processo) em vez de criar um novo a cada chamada — ver comentário em
    main.py sobre por que isso importa pra RAM no plano free da Discloud.
    """
    executor_url = os.environ["HAC_EXECUTOR_URL"].rstrip("/")
    api_key = os.environ["HAC_EXECUTOR_API_KEY"]
    resp = client.post(
        f"{executor_url}/run-task",
        json={"script": script, "params": params, "timeout_seconds": timeout},
        headers={"Authorization": f"Bearer {api_key}"},
        timeout=timeout + 30,
    )
    resp.raise_for_status()
    data = resp.json()
    return data["stdout"], data["stderr"], data["returncode"]
