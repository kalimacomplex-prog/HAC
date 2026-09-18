"""
Lógica compartilhada de disparo de job pra agente cloud — usada tanto na
criação do job (api/routes/jobs.py::create_job) quanto ao avançar a fila
quando um job termina (api/routes/worker.py::finish_job).

Concorrência limitada a 1 execution cloud por tenant de propósito: o
GitHub Actions Free só permite 20 jobs simultâneos NA CONTA INTEIRA
(compartilhado entre todos os tenants, não por tenant) — sem esse limite,
um único tenant disparando muitas execuções de uma vez podia sozinho
esgotar a cota de todo mundo. Jobs além do primeiro ficam `status="queued"`
(não "pending" — "pending" continua sendo o que o cloudagent compartilhado
antigo reivindica como fallback, e um job em fila de tenant não deve ser
pego por ele antes da vez).
"""
import logging
from datetime import datetime

from .auth import create_job_token
from .database import agents_col, jobs_col, processes_col
from .github_actions import dispatch_workflow_run, GithubDispatchError

log = logging.getLogger("hac.job_dispatch")

JOB_TOKEN_TTL_BUFFER_SECONDS = 60


async def get_cloud_agent_ids(user_id: str) -> list:
    return [a["_id"] async for a in agents_col.find({"user_id": user_id, "type": "cloud"}, {"_id": 1})]


async def has_running_cloud_job(user_id: str, cloud_agent_ids: list) -> bool:
    if not cloud_agent_ids:
        return False
    running = await jobs_col.find_one(
        {"user_id": user_id, "status": "running", "agent_id": {"$in": cloud_agent_ids}}
    )
    return running is not None


async def dispatch_cloud_job(job: dict, process: dict) -> bool:
    """Tenta disparar `job` (já sabido type=='cloud') no GitHub Actions.
    Não mexe no status do job — quem chama decide o que fazer com o
    resultado (reverter pra pending, deixar queued esperando, etc.)."""
    timeout_seconds = process.get("timeout_seconds", 300)
    job_token = create_job_token(
        job["_id"], job["user_id"], timeout_seconds + JOB_TOKEN_TTL_BUFFER_SECONDS
    )
    try:
        await dispatch_workflow_run(job["_id"], job_token)
    except GithubDispatchError as e:
        log.warning(f"GitHub Actions dispatch falhou pro job {job['_id']}: {e}")
        return False
    return True


async def dispatch_next_queued_job(user_id: str) -> None:
    """Chamado depois que um job cloud termina (done/failed) — libera a
    vaga desse tenant e, se houver algo esperando na fila, dispara."""
    cloud_agent_ids = await get_cloud_agent_ids(user_id)
    if not cloud_agent_ids:
        return
    if await has_running_cloud_job(user_id, cloud_agent_ids):
        return

    next_job = await jobs_col.find_one_and_update(
        {"user_id": user_id, "status": "queued", "agent_id": {"$in": cloud_agent_ids}},
        {"$set": {"status": "running", "started_at": datetime.utcnow()}},
        sort=[("priority", -1), ("created_at", 1)],
    )
    if not next_job:
        return

    process = await processes_col.find_one({"_id": next_job["process_id"]})
    if not process:
        await jobs_col.update_one(
            {"_id": next_job["_id"]},
            {"$set": {"status": "failed", "error": "Processo removido", "finished_at": datetime.utcnow()}},
        )
        return

    ok = await dispatch_cloud_job(next_job, process)
    if not ok:
        # Reverte pra "pending" (não "queued" de novo) — sem isso ficaria
        # preso esperando um /finish que nunca vai chegar, já que nada
        # está de fato rodando. "pending" ainda dá o fallback do
        # cloudagent compartilhado antigo como rede de segurança.
        await jobs_col.update_one(
            {"_id": next_job["_id"]},
            {"$set": {"status": "pending", "started_at": None}},
        )
