"""
Wrapper fino sobre a API de Actions do GitHub pra disparar uma execution
efêmera por job de agente cloud, via `workflow_dispatch`. Cada chamada
sobe um runner GitHub-hosted do zero, que roda até terminar e some
sozinho — inerentemente one-shot, sem precisar de nenhum "auto_destroy"
(GitHub já destrói o runner ao fim do job).

Só `job_id`/`job_token` viajam no disparo (workflow_dispatch tem limite de
tamanho de input) — o runner busca o resto (script/params/timeout) na API
via GET /worker/jobs/{id}/payload, autenticado com o mesmo job-token (ver
rpa_executor/main.py e .github/workflows/rpa-executor.yml).
"""
import httpx

from .config import settings

GITHUB_API = "https://api.github.com"


class GithubDispatchError(Exception):
    pass


async def dispatch_workflow_run(job_id: str, job_token: str) -> None:
    if not (settings.github_token and settings.github_owner and settings.github_repo):
        raise GithubDispatchError(
            "GitHub Actions não configurado (GITHUB_TOKEN/GITHUB_OWNER/GITHUB_REPO)"
        )

    url = (
        f"{GITHUB_API}/repos/{settings.github_owner}/{settings.github_repo}"
        f"/actions/workflows/{settings.github_workflow_file}/dispatches"
    )
    payload = {
        "ref": settings.github_ref,
        "inputs": {"job_id": job_id, "job_token": job_token},
    }

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            url,
            json=payload,
            headers={
                "Authorization": f"Bearer {settings.github_token}",
                "Accept": "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
            timeout=30,
        )
    # workflow_dispatch responde 204 sem corpo em sucesso — não dá pra
    # saber o run_id direto daqui (limitação da API do GitHub); o próprio
    # job muda de status via /finish quando a execution terminar, então
    # não precisamos rastrear o run_id pra nada.
    if resp.status_code >= 300:
        raise GithubDispatchError(f"GitHub Actions API {resp.status_code}: {resp.text[:500]}")
