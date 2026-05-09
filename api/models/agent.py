from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AgentCreate(BaseModel):
    name: str
    description: str = ""
    script: str
    timeout_seconds: int = 300
    # Formato cron opcional: "0 9 * * 1-5" (seg-sex às 9h)
    schedule: Optional[str] = None


class AgentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    script: Optional[str] = None
    timeout_seconds: Optional[int] = None
    schedule: Optional[str] = None


class AgentOut(BaseModel):
    id: str
    user_id: str
    name: str
    description: str
    timeout_seconds: int
    schedule: Optional[str]
    created_at: datetime
    updated_at: datetime


def agent_doc_to_out(doc: dict) -> AgentOut:
    return AgentOut(
        id=str(doc["_id"]),
        user_id=str(doc["user_id"]),
        name=doc["name"],
        description=doc.get("description", ""),
        timeout_seconds=doc.get("timeout_seconds", 300),
        schedule=doc.get("schedule"),
        created_at=doc["created_at"],
        updated_at=doc["updated_at"],
    )
