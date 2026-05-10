from datetime import datetime
from typing import List

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query

from ..auth import get_current_user
from ..database import processes_col, jobs_col
from ..models.job import JobCreate, JobOut, job_doc_to_out

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.post("", response_model=JobOut, status_code=201)
async def create_job(body: JobCreate, user: dict = Depends(get_current_user)):
    process = await processes_col.find_one({"_id": body.process_id, "user_id": user["_id"]})
    if not process:
        raise HTTPException(status_code=404, detail="Processo não encontrado")

    doc = {
        "_id": str(ObjectId()),
        "user_id": user["_id"],
        "process_id": body.process_id,
        "process_name": process["name"],
        "agent_id": process.get("agent_id"),
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


@router.delete("/{job_id}", status_code=204)
async def cancel_job(job_id: str, user: dict = Depends(get_current_user)):
    doc = await jobs_col.find_one({"_id": job_id, "user_id": user["_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Job não encontrado")
    if doc["status"] not in ("pending",):
        raise HTTPException(status_code=400, detail="Só é possível cancelar jobs com status 'pending'")
    await jobs_col.update_one({"_id": job_id}, {"$set": {"status": "cancelled"}})
