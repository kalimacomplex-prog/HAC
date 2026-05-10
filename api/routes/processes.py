from datetime import datetime
from typing import List

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

from ..auth import get_current_user
from ..database import processes_col
from ..models.process import ProcessCreate, ProcessUpdate, ProcessOut, process_doc_to_out

router = APIRouter(prefix="/processes", tags=["processes"])


@router.post("", response_model=ProcessOut, status_code=201)
async def create_process(body: ProcessCreate, user: dict = Depends(get_current_user)):
    now = datetime.utcnow()
    doc = {
        "_id": str(ObjectId()),
        "user_id": user["_id"],
        "name": body.name,
        "description": body.description,
        "script": body.script,
        "timeout_seconds": body.timeout_seconds,
        "created_at": now,
        "updated_at": now,
    }
    await processes_col.insert_one(doc)
    return process_doc_to_out(doc)


@router.get("", response_model=List[ProcessOut])
async def list_processes(user: dict = Depends(get_current_user)):
    cursor = processes_col.find({"user_id": user["_id"]}).sort("created_at", -1)
    return [process_doc_to_out(doc) async for doc in cursor]


@router.get("/{process_id}", response_model=ProcessOut)
async def get_process(process_id: str, user: dict = Depends(get_current_user)):
    doc = await processes_col.find_one({"_id": process_id, "user_id": user["_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Processo não encontrado")
    return process_doc_to_out(doc)


@router.patch("/{process_id}", response_model=ProcessOut)
async def update_process(process_id: str, body: ProcessUpdate, user: dict = Depends(get_current_user)):
    doc = await processes_col.find_one({"_id": process_id, "user_id": user["_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Processo não encontrado")

    updates = body.model_dump(exclude_unset=True)
    updates["updated_at"] = datetime.utcnow()
    await processes_col.update_one({"_id": process_id}, {"$set": updates})
    return process_doc_to_out({**doc, **updates})


@router.delete("/{process_id}", status_code=204)
async def delete_process(process_id: str, user: dict = Depends(get_current_user)):
    result = await processes_col.delete_one({"_id": process_id, "user_id": user["_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Processo não encontrado")
