import logging
from datetime import datetime
from typing import List

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from ..auth import get_current_user, create_job_token
from ..database import processes_col, jobs_col, agents_col
from ..github_actions import dispatch_workflow_run, GithubDispatchError
from ..models.job import JobCreate, JobOut, job_doc_to_out

router = APIRouter(prefix="/jobs", tags=["jobs"])

log = logging.getLogger("hac.jobs")

# Margem sobre o timeout do processo pro job-token continuar válido até o
# runner efêmero buscar o payload, rodar e reportar o resultado (deve
# sobrar tempo de sobra pra ele subir e terminar depois do timeout estourar).
JOB_TOKEN_TTL_BUFFER_SECONDS = 60


@router.post("", response_model=JobOut, status_code=201)
async def create_job(body: JobCreate, user: dict = Depends(get_current_user)):
    process = await processes_col.find_one({"_id": body.process_id, "user_id": user["_id"]})
    if not process:
        raise HTTPException(status_code=404, detail="Processo não encontrado")

    agent_id = process.get("agent_id")
    agent = await agents_col.find_one({"_id": agent_id}) if agent_id else None
    is_cloud = bool(agent and agent.get("type") == "cloud")

    now = datetime.utcnow()
    doc = {
        "_id": str(ObjectId()),
        "user_id": user["_id"],
        "process_id": body.process_id,
        "process_name": process["name"],
        "agent_id": agent_id,
        # Agente cloud: nasce direto como `running` (nunca passa por
        # `pending`) — o cloudagent compartilhado (Discloud) reivindica
        # QUALQUER job `pending` de QUALQUER tenant a cada ~1s; se esse
        # job existisse como pending por qualquer instante, ele podia
        # vencer a corrida e terminar o job antes do runner do GitHub
        # Actions, que aí falharia ao chamar /finish (job já não estaria
        # mais `running`). Nascer `running` fecha essa corrida de vez.
        "status": "running" if is_cloud else "pending",
        "priority": 0,
        "params": body.params,
        "output": None,
        "error": None,
        "created_at": now,
        "started_at": now if is_cloud else None,
        "finished_at": None,
    }
    await jobs_col.insert_one(doc)

    if is_cloud:
        # Agente cloud: dispara o workflow do GitHub Actions já sabendo
        # qual job rodar (push — só job_id/job_token viajam no disparo, o
        # runner busca o resto via /payload). Isolamento por tenant vem
        # daqui — cada agent_id é de um `user_id`, então cada execution
        # só carrega o job de UM tenant.
        timeout_seconds = process.get("timeout_seconds", 300)
        job_token = create_job_token(
            doc["_id"], user["_id"], timeout_seconds + JOB_TOKEN_TTL_BUFFER_SECONDS
        )
        try:
            await dispatch_workflow_run(doc["_id"], job_token)
        except GithubDispatchError as e:
            # Não propaga erro pro usuário: reverte pra pending, e o
            # cloudagent compartilhado ainda de pé como fallback durante a
            # migração pode reivindicá-lo.
            doc["status"] = "pending"
            doc["started_at"] = None
            await jobs_col.update_one(
                {"_id": doc["_id"]},
                {"$set": {"status": "pending", "started_at": None}},
            )
            log.warning(f"GitHub Actions dispatch falhou pro job {doc['_id']}, revertendo pra pending: {e}")

    return job_doc_to_out(doc)


@router.get("", response_model=List[JobOut])
async def list_jobs(
    status: str = Query(None),
    process_id: str = Query(None),
    limit: int = Query(50, le=200),
    user: dict = Depends(get_current_user),
):
    query = {"user_id": user["_id"]}
    if status:
        query["status"] = status
    if process_id:
        query["process_id"] = process_id

    try:
        cursor = jobs_col.find(query).sort("created_at", -1).limit(limit)
        return [job_doc_to_out(doc) async for doc in cursor]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao listar jobs: {str(e)}")


@router.get("/{job_id}", response_model=JobOut)
async def get_job(job_id: str, user: dict = Depends(get_current_user)):
    doc = await jobs_col.find_one({"_id": job_id, "user_id": user["_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Job não encontrado")
    return job_doc_to_out(doc)


class PriorityUpdate(BaseModel):
    priority: int


@router.patch("/{job_id}/priority", response_model=JobOut)
async def set_job_priority(job_id: str, body: PriorityUpdate, user: dict = Depends(get_current_user)):
    doc = await jobs_col.find_one({"_id": job_id, "user_id": user["_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Job não encontrado")
    if doc["status"] != "pending":
        raise HTTPException(status_code=400, detail="Só é possível alterar prioridade de jobs pendentes")
    priority = max(-100, min(100, body.priority))
    await jobs_col.update_one({"_id": job_id}, {"$set": {"priority": priority}})
    return job_doc_to_out({**doc, "priority": priority})


@router.delete("/{job_id}", status_code=204)
async def cancel_job(job_id: str, user: dict = Depends(get_current_user)):
    doc = await jobs_col.find_one({"_id": job_id, "user_id": user["_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Job não encontrado")
    if doc["status"] not in ("pending",):
        raise HTTPException(status_code=400, detail="Só é possível cancelar jobs com status 'pending'")
    await jobs_col.update_one({"_id": job_id}, {"$set": {"status": "cancelled"}})
