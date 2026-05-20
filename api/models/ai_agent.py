from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AIAgentCreate(BaseModel):
    name: str
    description: str = ""
    provider: str
    model: str
    api_key: str = ""
    system_prompt: str = ""
    guardrail_prompt: str = ""
    temperature: float = 0.7
    max_tokens: int = 1000
    schedule: Optional[str] = None
    schedule_input: str = ""


class AIAgentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    provider: Optional[str] = None
    model: Optional[str] = None
    api_key: Optional[str] = None
    system_prompt: Optional[str] = None
    guardrail_prompt: Optional[str] = None
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None
    schedule: Optional[str] = None
    schedule_input: Optional[str] = None


class AIAgentOut(BaseModel):
    id: str
    user_id: str
    name: str
    description: str
    provider: str
    model: str
    api_key_set: bool
    system_prompt: str
    guardrail_prompt: str
    temperature: float
    max_tokens: int
    tokens_used_last: Optional[int] = None
    tokens_remaining: Optional[int] = None
    schedule: Optional[str] = None
    schedule_input: str = ""
    created_at: datetime
    updated_at: datetime


def ai_agent_doc_to_out(doc: dict) -> AIAgentOut:
    return AIAgentOut(
        id=str(doc["_id"]),
        user_id=str(doc["user_id"]),
        name=doc["name"],
        description=doc.get("description", ""),
        provider=doc["provider"],
        model=doc["model"],
        api_key_set=bool(doc.get("api_key", "")),
        system_prompt=doc.get("system_prompt", ""),
        guardrail_prompt=doc.get("guardrail_prompt", ""),
        temperature=doc.get("temperature", 0.7),
        max_tokens=doc.get("max_tokens", 1000),
        tokens_used_last=doc.get("tokens_used_last"),
        tokens_remaining=doc.get("tokens_remaining"),
        schedule=doc.get("schedule"),
        schedule_input=doc.get("schedule_input", ""),
        created_at=doc["created_at"],
        updated_at=doc["updated_at"],
    )
