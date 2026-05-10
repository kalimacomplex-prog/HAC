from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from pymongo import ReturnDocument

from ..auth import get_current_user
from ..database import processes_col, jobs_col, agents_col
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
    query = {"user_id": user["_id"], "status": "pending"}
    if body.agent_id:
        query["agent_id"] = body.agent_id

    job = await jobs_col.find_one_and_update(
        query,
        {"$set": {"status": "running", "started_at": datetime.utcnow()}},
        sort=[("created_at", 1)],
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


@router.post("/jobs/{job_id}/finish", status_code=204)
async def finish_job(job_id: str, body: JobFinish, user: dict = Depends(get_current_user)):
    if body.status not in ("done", "failed"):
        raise HTTPException(status_code=400, detail="status deve ser 'done' ou 'failed'")

    job = await jobs_col.find_one({"_id": job_id, "user_id": user["_id"], "status": "running"})
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
    send_job_notification(user["email"], user["name"], updated)
