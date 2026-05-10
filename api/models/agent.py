from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone


HEARTBEAT_TIMEOUT_SECONDS = 60


class AgentCreate(BaseModel):
    name: str
    description: str = ""


class AgentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class AgentOut(BaseModel):
    id: str
    user_id: str
    name: str
    description: str
    last_seen: Optional[datetime]
    connected: bool
    created_at: datetime
    updated_at: datetime


def agent_doc_to_out(doc: dict) -> AgentOut:
    last_seen = doc.get("last_seen")
    if last_seen:
        now = datetime.now(timezone.utc)
        last_seen_utc = last_seen.replace(tzinfo=timezone.utc) if last_seen.tzinfo is None else last_seen
        connected = (now - last_seen_utc).total_seconds() < HEARTBEAT_TIMEOUT_SECONDS
    else:
        connected = False

    return AgentOut(
        id=str(doc["_id"]),
        user_id=str(doc["user_id"]),
        name=doc["name"],
        description=doc.get("description", ""),
        last_seen=last_seen,
        connected=connected,
        created_at=doc["created_at"],
        updated_at=doc["updated_at"],
    )
