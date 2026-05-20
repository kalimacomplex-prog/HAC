from datetime import datetime
from typing import List

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from ..auth import get_current_user
from ..database import ai_agents_col
from ..models.ai_agent import AIAgentCreate, AIAgentUpdate, AIAgentOut, ai_agent_doc_to_out
router = APIRouter(prefix="/ai-agents", tags=["ai-agents"])


async def call_ai(agent: dict, user_input: str) -> tuple[str, dict]:
    provider = agent["provider"]
    model = agent["model"]
    api_key = agent.get("api_key", "")
    system_prompt = agent.get("system_prompt", "")
    guardrail = agent.get("guardrail_prompt", "")
    if guardrail:
        system_prompt = f"{system_prompt}\n\nRESTRIÇÕES OBRIGATÓRIAS (guardrail):\n{guardrail}"
    temperature = agent.get("temperature", 0.7)
    max_tokens = agent.get("max_tokens", 1000)
    meta = {"tokens_used": None, "tokens_remaining": None}

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
        if response.usage:
            meta["tokens_used"] = response.usage.input_tokens + response.usage.output_tokens
        return response.content[0].text, meta

    elif provider in ("openai", "groq"):
        from openai import AsyncOpenAI
        init_kwargs = {"api_key": api_key}
        if provider == "groq":
            init_kwargs["base_url"] = "https://api.groq.com/openai/v1"
        client = AsyncOpenAI(**init_kwargs)
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": user_input})
        raw = await client.chat.completions.with_raw_response.create(
            model=model,
            max_tokens=max_tokens,
            temperature=temperature,
            messages=messages,
        )
        completion = raw.parse()
        if completion.usage:
            meta["tokens_used"] = completion.usage.total_tokens
        remaining = raw.headers.get("x-ratelimit-remaining-tokens")
        if remaining:
            meta["tokens_remaining"] = int(remaining)
        return completion.choices[0].message.content, meta

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
        "guardrail_prompt": body.guardrail_prompt,
        "schedule": body.schedule,
        "schedule_input": body.schedule_input,
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
    data = body.model_dump(exclude_unset=True)
    updates = {k: v for k, v in data.items() if v is not None or k in ("schedule", "schedule_input", "guardrail_prompt")}
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
        output, meta = await call_ai(doc, body.input)
        usage_update = {}
        if meta["tokens_used"] is not None:
            usage_update["tokens_used_last"] = meta["tokens_used"]
        if meta["tokens_remaining"] is not None:
            usage_update["tokens_remaining"] = meta["tokens_remaining"]
        if usage_update:
            await ai_agents_col.update_one({"_id": ai_agent_id}, {"$set": usage_update})
        return {"output": output}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
