from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from pymongo import ReturnDocument

from ..auth import get_current_user, oauth2_scheme, decode_job_token
from ..database import processes_col, jobs_col, agents_col, users_col
from ..notifier import send_job_notification

router = APIRouter(prefix="/worker", tags=["worker"])


class ClaimRequest(BaseModel):
    agent_id: Optional[str] = None


class JobFinish(BaseModel):
    status: str
    output: Optional[str] = None
    error: Optional[str] = None


@router.post("/claim")
async def claim_job(body: ClaimRequest, user: dict = Depends(get_current_user)):
    # Conta de serviço (role="admin") faz claim de jobs de QUALQUER
    # tenant — é o que permite um único agente central (cloudagent na
    # Discloud) intermediar a fila de todo mundo. Uma conta normal
    # (role="user") continua só vendo os próprios jobs, caso algum
    # tenant rode um agente local autoatendendo.
    query = {"status": "pending"}
    if user.get("role") != "admin":
        query["user_id"] = user["_id"]
    if body.agent_id:
        query["agent_id"] = body.agent_id

    job = await jobs_col.find_one_and_update(
        query,
        {"$set": {"status": "running", "started_at": datetime.utcnow()}},
        sort=[("priority", -1), ("created_at", 1)],
        return_document=ReturnDocument.AFTER,
    )
    if not job:
        return None

    process = await processes_col.find_one({"_id": job["process_id"]})
    if not process:
        await jobs_col.update_one(
            {"_id": job["_id"]},
            {"$set": {"status": "failed", "error": "Processo removido", "finished_at": datetime.utcnow()}},
        )
        return None

    return {
        "job_id": job["_id"],
        "process_name": process["name"],
        "script": process["script"],
        "params": job.get("params", {}),
        "timeout_seconds": process.get("timeout_seconds", 300),
    }


@router.post("/claim-installs")
async def claim_installs(body: ClaimRequest, user: dict = Depends(get_current_user)):
    if not body.agent_id:
        return []
    agent = await agents_col.find_one_and_update(
        {"_id": body.agent_id, "user_id": user["_id"]},
        {"$set": {"install_queue": []}},
        return_document=ReturnDocument.BEFORE,
    )
    if not agent:
        return []
    return agent.get("install_queue") or []


@router.get("/jobs/{job_id}/payload")
async def get_job_payload(job_id: str, token: str = Depends(oauth2_scheme)):
    # Só job-token (nunca sessão de usuário) — este endpoint existe
    # exclusivamente pro runner efêmero (GitHub Actions) buscar o que
    # precisa pra executar, depois de ser disparado só com job_id/job_token
    # (workflow_dispatch tem limite de tamanho de input, então o script
    # não viaja no disparo — o runner busca aqui).
    job_claims = decode_job_token(token)
    if not job_claims or job_claims.get("job_id") != job_id:
        raise HTTPException(status_code=401, detail="Token inválido")

    job = await jobs_col.find_one({"_id": job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Job não encontrado")
    process = await processes_col.find_one({"_id": job["process_id"]})
    if not process:
        raise HTTPException(status_code=404, detail="Processo não encontrado")

    return {
        "script": process["script"],
        "params": job.get("params", {}),
        "timeout_seconds": process.get("timeout_seconds", 300),
    }


@router.post("/jobs/{job_id}/finish", status_code=204)
async def finish_job(job_id: str, body: JobFinish, token: str = Depends(oauth2_scheme)):
    if body.status not in ("done", "failed"):
        raise HTTPException(status_code=400, detail="status deve ser 'done' ou 'failed'")

    # Machines efêmeras (agente cloud por tenant) chamam finish com um
    # job-token de escopo único, não uma sessão de usuário — tenta esse
    # caminho primeiro. `job_id` no claim já prova que é dono deste job
    # específico, então não precisa checar user_id/role.
    job_claims = decode_job_token(token)
    if job_claims and job_claims.get("job_id") == job_id:
        query = {"_id": job_id, "status": "running"}
    else:
        user = await get_current_user(token)
        query = {"_id": job_id, "status": "running"}
        if user.get("role") != "admin":
            query["user_id"] = user["_id"]

    job = await jobs_col.find_one(query)
    if not job:
        raise HTTPException(status_code=404, detail="Job não encontrado ou não está em execução")

    await jobs_col.update_one(
        {"_id": job_id},
        {"$set": {
            "status": body.status,
            "output": body.output[:50_000] if body.output else None,
            "error": body.error[:10_000] if body.error else None,
            "finished_at": datetime.utcnow(),
        }},
    )

    updated = await jobs_col.find_one({"_id": job_id})
    # Notifica sempre o DONO do job, nunca quem chamou finish — com a
    # conta de serviço fazendo isso por qualquer tenant, `user` aqui é o
    # admin, não o dono. Antes disso não fazia diferença (quem chamava
    # era sempre o próprio dono).
    owner = await users_col.find_one({"_id": updated["user_id"]})
    if owner:
        send_job_notification(owner["email"], owner["name"], updated)
