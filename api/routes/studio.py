import json
import secrets
import time
from datetime import datetime
from typing import List

import httpx
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel

from ..auth import get_current_user
from ..database import pipelines_col, ai_agents_col, studio_automations_col, studio_runs_col
from ..models.studio import (
    AutomationCreate, AutomationUpdate, AutomationOut, AutomationRunOut,
    StepResult, TriggerType,
)
from .ai_agents import call_ai

router = APIRouter(prefix="/studio", tags=["studio"])


def _doc_to_out(doc: dict, base_url: str = "") -> AutomationOut:
    trigger = doc.get("trigger", {})
    webhook_url = ""
    if trigger.get("type") == "webhook" and trigger.get("webhook_token"):
        webhook_url = f"{base_url}/studio/webhook/{trigger['webhook_token']}"
    created = doc.get("created_at", "")
    return AutomationOut(
        id=doc["_id"],
        name=doc["name"],
        description=doc.get("description", ""),
        trigger=trigger,
        steps=doc.get("steps", []),
        active=doc.get("active", True),
        created_at=created.isoformat() if isinstance(created, datetime) else str(created),
        webhook_url=webhook_url,
    )


def _run_doc_to_out(doc: dict) -> AutomationRunOut:
    started = doc.get("started_at", "")
    finished = doc.get("finished_at")
    return AutomationRunOut(
        id=doc["_id"],
        automation_id=doc["automation_id"],
        automation_name=doc.get("automation_name", ""),
        status=doc["status"],
        trigger_type=doc.get("trigger_type", "manual"),
        input=doc.get("input", ""),
        steps_result=[StepResult(**s) for s in doc.get("steps_result", [])],
        output=doc.get("output", ""),
        started_at=started.isoformat() if isinstance(started, datetime) else str(started),
        finished_at=finished.isoformat() if isinstance(finished, datetime) else (str(finished) if finished else None),
        duration_ms=doc.get("duration_ms", 0),
    )


def _evaluate_condition(output: str, operator: str, value: str) -> bool:
    out_l, val_l = output.lower(), value.lower()
    if operator == "contains":
        return val_l in out_l
    elif operator == "not_contains":
        return val_l not in out_l
    elif operator == "equals":
        return output.strip() == value.strip()
    elif operator == "not_equals":
        return output.strip() != value.strip()
    elif operator == "starts_with":
        return out_l.startswith(val_l)
    elif operator == "ends_with":
        return out_l.endswith(val_l)
    elif operator == "is_empty":
        return output.strip() == ""
    elif operator == "not_empty":
        return output.strip() != ""
    return False


async def _execute_automation(automation: dict, initial_input: str, trigger_type: str = "manual") -> dict:
    run_id = str(ObjectId())
    started_at = datetime.utcnow()

    run_doc = {
        "_id": run_id,
        "automation_id": automation["_id"],
        "automation_name": automation["name"],
        "user_id": automation["user_id"],
        "trigger_type": trigger_type,
        "input": initial_input,
        "steps_result": [],
        "output": "",
        "status": "running",
        "started_at": started_at,
        "finished_at": None,
        "duration_ms": 0,
    }
    await studio_runs_col.insert_one(run_doc)

    steps = automation.get("steps", [])
    current_output = initial_input
    steps_results = []
    final_status = "success"

    i = 0
    while i < len(steps):
        step = steps[i]
        step_start = time.time()
        step_type = step["type"]
        cfg = step.get("config", {})

        result = {
            "step_id": step["id"],
            "step_name": step.get("name", f"Passo {i + 1}"),
            "step_type": step_type,
            "status": "success",
            "output": "",
            "error": "",
            "duration_ms": 0,
            "condition_result": None,
        }

        try:
            if step_type == "pipeline":
                pipeline = await pipelines_col.find_one({"_id": cfg.get("pipeline_id", "")})
                if not pipeline:
                    raise Exception(f"Pipeline não encontrada: {cfg.get('pipeline_id')}")

                template = cfg.get("input_template") or "{output}"
                step_input = template.replace("{input}", initial_input).replace("{output}", current_output)

                pipe_output = step_input
                for p_step in pipeline.get("steps", []):
                    agent = await ai_agents_col.find_one({"_id": p_step["ai_agent_id"]})
                    if not agent:
                        raise Exception(f"Agente IA '{p_step['ai_agent_id']}' não encontrado")
                    p_tmpl = p_step.get("input_template") or "{output}"
                    p_in = p_tmpl.replace("{input}", step_input).replace("{output}", pipe_output)
                    pipe_output, _ = await call_ai(agent, p_in)

                current_output = pipe_output
                result["output"] = current_output

            elif step_type == "http_request":
                method = cfg.get("method", "GET").upper()
                url = cfg.get("url", "").replace("{input}", initial_input).replace("{output}", current_output)
                headers = cfg.get("headers") or {}
                body = (cfg.get("body") or "").replace("{input}", initial_input).replace("{output}", current_output)

                async with httpx.AsyncClient(timeout=30) as client:
                    if method == "GET":
                        resp = await client.get(url, headers=headers)
                    elif method == "POST":
                        ct = headers.get("Content-Type", "application/json")
                        if "json" in ct:
                            try:
                                resp = await client.post(url, json=json.loads(body) if body else {}, headers=headers)
                            except json.JSONDecodeError:
                                resp = await client.post(url, content=body, headers=headers)
                        else:
                            resp = await client.post(url, content=body, headers=headers)
                    elif method == "PUT":
                        resp = await client.put(url, content=body, headers=headers)
                    elif method == "DELETE":
                        resp = await client.delete(url, headers=headers)
                    else:
                        resp = await client.request(method, url, content=body, headers=headers)

                current_output = resp.text
                result["output"] = f"[{resp.status_code}] {resp.text[:3000]}"

            elif step_type == "condition":
                operator = cfg.get("operator", "contains")
                cond_value = cfg.get("condition_value", "")
                cond_result = _evaluate_condition(current_output, operator, cond_value)
                result["condition_result"] = cond_result
                result["output"] = f"Condição: {'VERDADEIRO ✓' if cond_result else 'FALSO ✗'} ({operator} '{cond_value}')"

                if not cond_result:
                    else_step_id = cfg.get("else_step_id", "")
                    result["duration_ms"] = int((time.time() - step_start) * 1000)
                    steps_results.append(result)
                    if not else_step_id:
                        i = len(steps)
                    else:
                        target = next((idx for idx, s in enumerate(steps) if s["id"] == else_step_id), len(steps))
                        i = target
                    continue

            elif step_type == "browser":
                actions = cfg.get("browser_actions") or []
                result["output"] = f"[Browser] {len(actions)} ação(ões) configurada(s). Execução requer worker com Playwright (em breve)."
                result["status"] = "skipped"
                current_output = result["output"]

        except Exception as e:
            result["status"] = "failed"
            result["error"] = str(e)
            final_status = "failed"
            result["duration_ms"] = int((time.time() - step_start) * 1000)
            steps_results.append(result)
            break

        result["duration_ms"] = int((time.time() - step_start) * 1000)
        steps_results.append(result)
        i += 1

    finished_at = datetime.utcnow()
    duration_ms = int((finished_at - started_at).total_seconds() * 1000)

    await studio_runs_col.update_one({"_id": run_id}, {"$set": {
        "steps_result": steps_results,
        "output": current_output,
        "status": final_status,
        "finished_at": finished_at,
        "duration_ms": duration_ms,
    }})

    return {**run_doc, "steps_result": steps_results, "output": current_output,
            "status": final_status, "finished_at": finished_at, "duration_ms": duration_ms}


# ─── CRUD ────────────────────────────────────────────────────────

@router.post("", response_model=AutomationOut, status_code=201)
async def create_automation(body: AutomationCreate, request: Request, user: dict = Depends(get_current_user)):
    trigger = body.trigger.model_dump()
    if trigger.get("type") == "webhook" and not trigger.get("webhook_token"):
        trigger["webhook_token"] = secrets.token_urlsafe(20)

    now = datetime.utcnow()
    doc = {
        "_id": str(ObjectId()),
        "user_id": user["_id"],
        "name": body.name,
        "description": body.description,
        "trigger": trigger,
        "steps": [s.model_dump() for s in body.steps],
        "active": body.active,
        "created_at": now,
        "updated_at": now,
    }
    await studio_automations_col.insert_one(doc)
    return _doc_to_out(doc, str(request.base_url).rstrip("/"))


@router.get("", response_model=List[AutomationOut])
async def list_automations(request: Request, user: dict = Depends(get_current_user)):
    base_url = str(request.base_url).rstrip("/")
    cursor = studio_automations_col.find({"user_id": user["_id"]}).sort("created_at", -1)
    return [_doc_to_out(doc, base_url) async for doc in cursor]


@router.get("/{automation_id}", response_model=AutomationOut)
async def get_automation(automation_id: str, request: Request, user: dict = Depends(get_current_user)):
    doc = await studio_automations_col.find_one({"_id": automation_id, "user_id": user["_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Automação não encontrada")
    return _doc_to_out(doc, str(request.base_url).rstrip("/"))


@router.patch("/{automation_id}", response_model=AutomationOut)
async def update_automation(automation_id: str, body: AutomationUpdate, request: Request, user: dict = Depends(get_current_user)):
    doc = await studio_automations_col.find_one({"_id": automation_id, "user_id": user["_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Automação não encontrada")

    data = body.model_dump(exclude_unset=True)
    if "trigger" in data and data["trigger"]:
        t = data["trigger"]
        if t.get("type") == "webhook" and not t.get("webhook_token"):
            t["webhook_token"] = doc.get("trigger", {}).get("webhook_token") or secrets.token_urlsafe(20)
    if "steps" in data and data["steps"] is not None:
        data["steps"] = [s if isinstance(s, dict) else s.model_dump() for s in data["steps"]]
    data["updated_at"] = datetime.utcnow()

    await studio_automations_col.update_one({"_id": automation_id}, {"$set": data})
    return _doc_to_out({**doc, **data}, str(request.base_url).rstrip("/"))


@router.delete("/{automation_id}", status_code=204)
async def delete_automation(automation_id: str, user: dict = Depends(get_current_user)):
    result = await studio_automations_col.delete_one({"_id": automation_id, "user_id": user["_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Automação não encontrada")


class RunRequest(BaseModel):
    input: str = ""


@router.post("/{automation_id}/run", response_model=AutomationRunOut)
async def run_automation(automation_id: str, body: RunRequest, user: dict = Depends(get_current_user)):
    doc = await studio_automations_col.find_one({"_id": automation_id, "user_id": user["_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Automação não encontrada")
    run = await _execute_automation(doc, body.input, trigger_type="manual")
    return _run_doc_to_out(run)


@router.get("/{automation_id}/runs", response_model=List[AutomationRunOut])
async def list_runs(automation_id: str, user: dict = Depends(get_current_user)):
    doc = await studio_automations_col.find_one({"_id": automation_id, "user_id": user["_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Automação não encontrada")
    cursor = studio_runs_col.find({"automation_id": automation_id}).sort("started_at", -1).limit(20)
    return [_run_doc_to_out(d) async for d in cursor]


# ─── WEBHOOK (público, sem auth) ─────────────────────────────────

@router.post("/webhook/{token}")
async def webhook_trigger(token: str, request: Request):
    doc = await studio_automations_col.find_one({"trigger.webhook_token": token, "active": True})
    if not doc:
        raise HTTPException(status_code=404, detail="Webhook não encontrado")
    try:
        body = await request.json()
        input_text = json.dumps(body)
    except Exception:
        raw = await request.body()
        input_text = raw.decode("utf-8", errors="replace")
    run = await _execute_automation(doc, input_text, trigger_type="webhook")
    return {"run_id": run["_id"], "status": run["status"], "output": run["output"]}
