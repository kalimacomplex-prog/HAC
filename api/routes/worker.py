from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from pymongo import ReturnDocument

from ..auth import get_current_user
from ..database import agents_col, jobs_col
from ..notifier import send_job_notification

router = APIRouter(prefix="/worker", tags=["worker"])


class JobFinish(BaseModel):
    status: str
    output: Optional[str] = None
    error: Optional[str] = None


@router.post("/claim")
async def claim_job(user: dict = Depends(get_current_user)):
    job = await jobs_col.find_one_and_update(
        {"user_id": user["_id"], "status": "pending"},
        {"$set": {"status": "running", "started_at": datetime.utcnow()}},
        sort=[("created_at", 1)],
        return_document=ReturnDocument.AFTER,
    )
    if not job:
        return None

    agent = await agents_col.find_one({"_id": job["agent_id"]})
    if not agent:
        await jobs_col.update_one(
            {"_id": job["_id"]},
            {"$set": {"status": "failed", "error": "Agente removido", "finished_at": datetime.utcnow()}},
        )
        return None

    return {
        "job_id": job["_id"],
        "agent_name": agent["name"],
        "script": agent["script"],
        "params": job.get("params", {}),
        "timeout_seconds": agent.get("timeout_seconds", 300),
    }


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
