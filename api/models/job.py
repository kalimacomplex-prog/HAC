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
    status: str  # pending | running | done | failed | cancelled
    params: Dict[str, Any]
    output: Optional[str] = None
    error: Optional[str] = None
    created_at: datetime
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None


def job_doc_to_out(doc: dict) -> JobOut:
    return JobOut(
        id=str(doc["_id"]),
        user_id=str(doc["user_id"]),
        process_id=str(doc["process_id"]),
        process_name=doc.get("process_name", ""),
        status=doc["status"],
        params=doc.get("params", {}),
        output=doc.get("output"),
        error=doc.get("error"),
        created_at=doc["created_at"],
        started_at=doc.get("started_at"),
        finished_at=doc.get("finished_at"),
    )
