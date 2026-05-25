from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ProcessCreate(BaseModel):
    name: str
    description: str = ""
    script: str
    timeout_seconds: int = 300
    agent_id: Optional[str] = None
    schedule: Optional[str] = None


class ProcessUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    script: Optional[str] = None
    timeout_seconds: Optional[int] = None
    agent_id: Optional[str] = None
    schedule: Optional[str] = None


class ProcessOut(BaseModel):
    id: str
    user_id: str
    name: str
    description: str
    script: str
    timeout_seconds: int
    agent_id: Optional[str]
    schedule: Optional[str]
    created_at: datetime
    updated_at: datetime
    studio_automation_id: Optional[str] = None


def process_doc_to_out(doc: dict) -> ProcessOut:
    return ProcessOut(
        id=str(doc["_id"]),
        user_id=str(doc["user_id"]),
        name=doc["name"],
        description=doc.get("description", ""),
        script=doc["script"],
        timeout_seconds=doc.get("timeout_seconds", 300),
        agent_id=doc.get("agent_id"),
        schedule=doc.get("schedule"),
        created_at=doc["created_at"],
        updated_at=doc["updated_at"],
        studio_automation_id=doc.get("studio_automation_id"),
    )
