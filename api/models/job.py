from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class JobCreate(BaseModel):
    process_id: str
    params: Dict[str, Any] = {}


class JobOut(BaseModel):
    id: str
    user_id: str
    process_id: str
    process_name: str
    agent_id: Optional[str] = None
    status: str  # pending | running | done | failed | cancelled
    priority: int = 0
    params: Dict[str, Any]
    output: Optional[str] = None
    error: Optional[str] = None
    created_at: datetime
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None


def job_doc_to_out(doc: dict) -> JobOut:
    return JobOut(
        id=str(doc["_id"]),
        user_id=str(doc.get("user_id", "")),
        process_id=str(doc.get("process_id", "")),
        process_name=doc.get("process_name") or "",
        agent_id=doc.get("agent_id") or None,
        status=doc.get("status", "pending"),
        priority=doc.get("priority", 0),
        params=doc.get("params") or {},
        output=doc.get("output") or None,
        error=doc.get("error") or None,
        created_at=doc["created_at"],
        started_at=doc.get("started_at"),
        finished_at=doc.get("finished_at"),
    )
