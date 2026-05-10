from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ProcessCreate(BaseModel):
    name: str
    description: str = ""
    script: str
    timeout_seconds: int = 300


class ProcessUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    script: Optional[str] = None
    timeout_seconds: Optional[int] = None


class ProcessOut(BaseModel):
    id: str
    user_id: str
    name: str
    description: str
    script: str
    timeout_seconds: int
    created_at: datetime
    updated_at: datetime


def process_doc_to_out(doc: dict) -> ProcessOut:
    return ProcessOut(
        id=str(doc["_id"]),
        user_id=str(doc["user_id"]),
        name=doc["name"],
        description=doc.get("description", ""),
        script=doc["script"],
        timeout_seconds=doc.get("timeout_seconds", 300),
        created_at=doc["created_at"],
        updated_at=doc["updated_at"],
    )
