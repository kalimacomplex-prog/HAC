from datetime import datetime
from typing import List

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query

from ..auth import get_current_user
from ..database import agents_col, jobs_col
from ..models.job import JobCreate, JobOut, job_doc_to_out

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.post("", response_model=JobOut, status_code=201)
async def create_job(body: JobCreate, user: dict = Depends(get_current_user)):
    agent = await agents_col.find_one({"_id": body.agent_id, "user_id": user["_id"]})
    if not agent:
        raise HTTPException(status_code=404, detail="Agente não encontrado")

    doc = {
        "_id": str(ObjectId()),
        "user_id": user["_id"],
        "agent_id": body.agent_id,
        "agent_name": agent["name"],
        "status": "pending",
        "params": body.params,
        "output": None,
        "error": None,
        "created_at": datetime.utcnow(),
        "started_at": None,
        "finished_at": None,
    }
    await jobs_col.insert_one(doc)
    return job_doc_to_out(doc)


@router.get("", response_model=List[JobOut])
async def list_jobs(
    status: str = Query(None),
    agent_id: str = Query(None),
    limit: int = Query(50, le=200),
    user: dict = Depends(get_current_user),
):
    query = {"user_id": user["_id"]}
    if status:
        query["status"] = status
    if agent_id:
        query["agent_id"] = agent_id

    cursor = jobs_col.find(query).sort("created_at", -1).limit(limit)
    return [job_doc_to_out(doc) async for doc in cursor]


@router.get("/{job_id}", response_model=JobOut)
async def get_job(job_id: str, user: dict = Depends(get_current_user)):
    doc = await jobs_col.find_one({"_id": job_id, "user_id": user["_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Job não encontrado")
    return job_doc_to_out(doc)


@router.delete("/{job_id}", status_code=204)
async def cancel_job(job_id: str, user: dict = Depends(get_current_user)):
    doc = await jobs_col.find_one({"_id": job_id, "user_id": user["_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Job não encontrado")
    if doc["status"] not in ("pending",):
        raise HTTPException(status_code=400, detail="Só é possível cancelar jobs com status 'pending'")
    await jobs_col.update_one({"_id": job_id}, {"$set": {"status": "cancelled"}})
