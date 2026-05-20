from datetime import datetime
from typing import List

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from ..auth import get_current_user
from ..database import ai_agents_col
from ..models.ai_agent import AIAgentCreate, AIAgentUpdate, AIAgentOut, ai_agent_doc_to_out
router = APIRouter(prefix="/ai-agents", tags=["ai-agents"])


async def call_ai(agent: dict, user_input: str) -> str:
    provider = agent["provider"]
    model = agent["model"]
    api_key = agent.get("api_key", "")
    system_prompt = agent.get("system_prompt", "")
    temperature = agent.get("temperature", 0.7)
    max_tokens = agent.get("max_tokens", 1000)

    if not api_key:
        raise ValueError("Chave de API não configurada neste agente")

    if provider == "anthropic":
        from anthropic import AsyncAnthropic
        client = AsyncAnthropic(api_key=api_key)
        kwargs = {
            "model": model,
            "max_tokens": max_tokens,
            "messages": [{"role": "user", "content": user_input}],
        }
        if system_prompt:
            kwargs["system"] = system_prompt
        response = await client.messages.create(**kwargs)
        return response.content[0].text

    elif provider in ("openai", "groq"):
        from openai import AsyncOpenAI
        kwargs = {"api_key": api_key}
        if provider == "groq":
            kwargs["base_url"] = "https://api.groq.com/openai/v1"
        client = AsyncOpenAI(**kwargs)
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": user_input})
        response = await client.chat.completions.create(
            model=model,
            max_tokens=max_tokens,
            temperature=temperature,
            messages=messages,
        )
        return response.choices[0].message.content

    else:
        raise ValueError(f"Provider desconhecido: {provider}")


@router.post("", response_model=AIAgentOut, status_code=201)
async def create_ai_agent(body: AIAgentCreate, user: dict = Depends(get_current_user)):
    now = datetime.utcnow()
    doc = {
        "_id": str(ObjectId()),
        "user_id": user["_id"],
        "name": body.name,
        "description": body.description,
        "provider": body.provider,
        "model": body.model,
        "api_key": body.api_key,
        "system_prompt": body.system_prompt,
        "temperature": body.temperature,
        "max_tokens": body.max_tokens,
        "created_at": now,
        "updated_at": now,
    }
    await ai_agents_col.insert_one(doc)
    return ai_agent_doc_to_out(doc)


@router.get("", response_model=List[AIAgentOut])
async def list_ai_agents(user: dict = Depends(get_current_user)):
    cursor = ai_agents_col.find({"user_id": user["_id"]}).sort("created_at", -1)
    return [ai_agent_doc_to_out(doc) async for doc in cursor]


@router.get("/{ai_agent_id}", response_model=AIAgentOut)
async def get_ai_agent(ai_agent_id: str, user: dict = Depends(get_current_user)):
    doc = await ai_agents_col.find_one({"_id": ai_agent_id, "user_id": user["_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Agente IA não encontrado")
    return ai_agent_doc_to_out(doc)


@router.patch("/{ai_agent_id}", response_model=AIAgentOut)
async def update_ai_agent(ai_agent_id: str, body: AIAgentUpdate, user: dict = Depends(get_current_user)):
    doc = await ai_agents_col.find_one({"_id": ai_agent_id, "user_id": user["_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Agente IA não encontrado")
    updates = {k: v for k, v in body.model_dump(exclude_unset=True).items() if v is not None}
    updates["updated_at"] = datetime.utcnow()
    await ai_agents_col.update_one({"_id": ai_agent_id}, {"$set": updates})
    return ai_agent_doc_to_out({**doc, **updates})


@router.delete("/{ai_agent_id}", status_code=204)
async def delete_ai_agent(ai_agent_id: str, user: dict = Depends(get_current_user)):
    result = await ai_agents_col.delete_one({"_id": ai_agent_id, "user_id": user["_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Agente IA não encontrado")


class RunRequest(BaseModel):
    input: str


class RunResponse(BaseModel):
    output: str


@router.post("/{ai_agent_id}/run", response_model=RunResponse)
async def run_ai_agent_endpoint(ai_agent_id: str, body: RunRequest, user: dict = Depends(get_current_user)):
    doc = await ai_agents_col.find_one({"_id": ai_agent_id, "user_id": user["_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Agente IA não encontrado")
    try:
        output = await call_ai(doc, body.input)
        return {"output": output}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
