from datetime import datetime
from typing import List

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

from ..auth import get_current_user
from ..database import agents_col
from ..models.agent import AgentCreate, AgentUpdate, AgentOut, agent_doc_to_out

router = APIRouter(prefix="/agents", tags=["agents"])


@router.post("", response_model=AgentOut, status_code=201)
async def create_agent(body: AgentCreate, user: dict = Depends(get_current_user)):
    now = datetime.utcnow()
    doc = {
        "_id": str(ObjectId()),
        "user_id": user["_id"],
        "name": body.name,
        "description": body.description,
        "created_at": now,
        "updated_at": now,
    }
    await agents_col.insert_one(doc)
    return agent_doc_to_out(doc)


@router.get("", response_model=List[AgentOut])
async def list_agents(user: dict = Depends(get_current_user)):
    cursor = agents_col.find({"user_id": user["_id"]}).sort("created_at", -1)
    return [agent_doc_to_out(doc) async for doc in cursor]


@router.get("/{agent_id}", response_model=AgentOut)
async def get_agent(agent_id: str, user: dict = Depends(get_current_user)):
    doc = await agents_col.find_one({"_id": agent_id, "user_id": user["_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Agente não encontrado")
    return agent_doc_to_out(doc)


@router.patch("/{agent_id}", response_model=AgentOut)
async def update_agent(agent_id: str, body: AgentUpdate, user: dict = Depends(get_current_user)):
    doc = await agents_col.find_one({"_id": agent_id, "user_id": user["_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Agente não encontrado")

    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    updates["updated_at"] = datetime.utcnow()
    await agents_col.update_one({"_id": agent_id}, {"$set": updates})
    return agent_doc_to_out({**doc, **updates})


@router.delete("/{agent_id}", status_code=204)
async def delete_agent(agent_id: str, user: dict = Depends(get_current_user)):
    result = await agents_col.delete_one({"_id": agent_id, "user_id": user["_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Agente não encontrado")


@router.post("/{agent_id}/heartbeat", status_code=204)
async def heartbeat(agent_id: str, user: dict = Depends(get_current_user)):
    result = await agents_col.update_one(
        {"_id": agent_id, "user_id": user["_id"]},
        {"$set": {"last_seen": datetime.utcnow()}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Agente não encontrado")
