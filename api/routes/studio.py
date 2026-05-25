import asyncio
import glob as glob_module
import io
import json
import os
import re
import secrets
import subprocess
import sys
import time
from datetime import datetime
from typing import List

import httpx
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel

from ..auth import get_current_user
from ..config import settings
from ..database import pipelines_col, ai_agents_col, studio_automations_col, studio_runs_col, processes_col
from ..models.studio import (
    AutomationCreate, AutomationUpdate, AutomationOut, AutomationRunOut,
    StepResult, TriggerType,
)
from .ai_agents import call_ai

router = APIRouter(prefix="/studio", tags=["studio"])


# ─── Helpers ──────────────────────────────────────────────────────

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
        agent_id=doc.get("agent_id", ""),
    )


async def _upsert_linked_process(automation_id: str, user_id: str, name: str, description: str, agent_id: str, schedule: str):
    """Cria ou atualiza o Process vinculado a esta automação Studio."""
    now = datetime.utcnow()
    stub_script = f"# HAC Studio Automation\n# ID: {automation_id}\n# Gerenciado pelo HAC Studio Builder"
    existing = await processes_col.find_one({"studio_automation_id": automation_id, "user_id": user_id})
    if existing:
        await processes_col.update_one(
            {"_id": existing["_id"]},
            {"$set": {
                "name": name,
                "description": description,
                "agent_id": agent_id or None,
                "schedule": schedule or None,
                "updated_at": now,
            }}
        )
    else:
        doc = {
            "_id": str(ObjectId()),
            "user_id": user_id,
            "name": name,
            "description": description,
            "script": stub_script,
            "timeout_seconds": 300,
            "agent_id": agent_id or None,
            "schedule": schedule or None,
            "studio_automation_id": automation_id,
            "created_at": now,
            "updated_at": now,
        }
        await processes_col.insert_one(doc)


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


def _sub(text: str, ctx: dict) -> str:
    """Substitui {input}, {output} e {varname} no texto."""
    text = str(text)
    text = text.replace("{input}", str(ctx.get("input", "")))
    text = text.replace("{output}", str(ctx.get("output", "")))
    for k, v in ctx.get("vars", {}).items():
        text = text.replace(f"{{{k}}}", str(v))
    return text


def _store(result: str, variable_name: str, ctx: dict):
    """Salva resultado no contexto. Se variable_name, salva em vars; sempre atualiza output."""
    ctx["output"] = result
    if variable_name:
        ctx["vars"][variable_name] = result


def _eval_condition(output: str, operator: str, value: str) -> bool:
    out_l, val_l = output.lower(), value.lower()
    if operator == "contains":       return val_l in out_l
    if operator == "not_contains":   return val_l not in out_l
    if operator == "equals":         return output.strip() == value.strip()
    if operator == "not_equals":     return output.strip() != value.strip()
    if operator == "starts_with":    return out_l.startswith(val_l)
    if operator == "ends_with":      return out_l.endswith(val_l)
    if operator == "is_empty":       return output.strip() == ""
    if operator == "not_empty":      return output.strip() != ""
    if operator == "greater_than":
        try: return float(output.strip()) > float(value.strip())
        except: return False
    if operator == "less_than":
        try: return float(output.strip()) < float(value.strip())
        except: return False
    return False


async def _exec_step(step: dict, ctx: dict) -> str:
    """Executa um step e retorna o output. Atualiza ctx em tempo real."""
    t = step["type"]
    cfg = step.get("config", {})
    var = cfg.get("variable_name", "")

    # ── Controle de Fluxo ──────────────────────────────────

    if t == "wait":
        secs = float(cfg.get("seconds", 1))
        await asyncio.sleep(min(secs, 60))
        return f"Aguardou {secs}s"

    if t == "comment":
        return f"# {cfg.get('text', '')}"

    # condition é tratado no loop principal (precisa controlar índice)
    # loop_count idem — retornamos placeholder aqui
    if t in ("condition", "loop_count"):
        return ""

    # ── Variáveis ──────────────────────────────────────────

    if t == "set_variable":
        result = _sub(cfg.get("value", ""), ctx)
        _store(result, var, ctx)
        return result

    if t == "calculate":
        expr = _sub(cfg.get("expression", "0"), ctx)
        try:
            import math
            safe = {"__builtins__": {}, "math": math, "abs": abs, "round": round,
                    "len": len, "str": str, "int": int, "float": float, "min": min, "max": max}
            safe.update(ctx.get("vars", {}))
            result = str(eval(expr, safe))
        except Exception as e:
            raise Exception(f"Erro ao calcular '{expr}': {e}")
        _store(result, var, ctx)
        return result

    # ── Arquivos ───────────────────────────────────────────

    if t == "read_file":
        path = _sub(cfg.get("file_path", ""), ctx)
        with open(path, "r", encoding="utf-8") as f:
            result = f.read()
        _store(result, var, ctx)
        return result

    if t == "write_file":
        path = _sub(cfg.get("file_path", ""), ctx)
        content = _sub(cfg.get("content", "{output}"), ctx)
        mode = "a" if cfg.get("append") else "w"
        os.makedirs(os.path.dirname(path), exist_ok=True) if os.path.dirname(path) else None
        with open(path, mode, encoding="utf-8") as f:
            f.write(content)
        result = f"Arquivo {'adicionado' if cfg.get('append') else 'escrito'}: {path}"
        _store(result, var, ctx)
        return result

    if t == "list_files":
        directory = _sub(cfg.get("directory", "."), ctx)
        pattern = cfg.get("pattern", "*")
        files = glob_module.glob(os.path.join(directory, pattern))
        result = json.dumps(files, ensure_ascii=False)
        _store(result, var, ctx)
        return result

    if t == "delete_file":
        path = _sub(cfg.get("file_path", ""), ctx)
        os.remove(path)
        result = f"Arquivo deletado: {path}"
        _store(result, var, ctx)
        return result

    # ── HTTP & Internet ────────────────────────────────────

    if t == "http_request":
        method = cfg.get("method", "GET").upper()
        url = _sub(cfg.get("url", ""), ctx)
        headers = cfg.get("headers") or {}
        body = _sub(cfg.get("body", ""), ctx)

        async with httpx.AsyncClient(timeout=30) as client:
            if method == "GET":
                resp = await client.get(url, headers=headers)
            elif method in ("POST", "PUT", "PATCH"):
                ct = headers.get("Content-Type", "application/json")
                if "json" in ct:
                    try:
                        resp = await client.request(method, url, json=json.loads(body) if body else {}, headers=headers)
                    except json.JSONDecodeError:
                        resp = await client.request(method, url, content=body, headers=headers)
                else:
                    resp = await client.request(method, url, content=body, headers=headers)
            elif method == "DELETE":
                resp = await client.delete(url, headers=headers)
            else:
                resp = await client.request(method, url, content=body, headers=headers)

        result = resp.text
        _store(result[:5000], var, ctx)
        return f"[{resp.status_code}] {result[:3000]}"

    if t == "parse_json":
        raw = _sub(cfg.get("json_input", "{output}"), ctx)
        try:
            data = json.loads(raw)
        except Exception as e:
            raise Exception(f"JSON inválido: {e}")
        key_path = cfg.get("key_path", "")
        if key_path:
            for key in key_path.split("."):
                if isinstance(data, list):
                    try: data = data[int(key)]
                    except: raise Exception(f"Índice inválido '{key}'")
                elif isinstance(data, dict):
                    data = data.get(key)
                    if data is None:
                        raise Exception(f"Chave '{key}' não encontrada")
        result = json.dumps(data, ensure_ascii=False) if isinstance(data, (dict, list)) else str(data)
        _store(result, var, ctx)
        return result

    # ── Email ──────────────────────────────────────────────

    if t == "send_email":
        to_addr = _sub(cfg.get("to", ""), ctx)
        subject = _sub(cfg.get("subject", ""), ctx)
        body_content = _sub(cfg.get("email_body", ""), ctx)
        is_html = cfg.get("is_html", False)

        if not to_addr:
            raise Exception("Destinatário (to) não definido")

        payload = {
            "sender": {
                "name": getattr(settings, "brevo_sender_name", "HAC Studio"),
                "email": getattr(settings, "brevo_sender_email", None) or "no-reply@hacplatform.com",
            },
            "to": [{"email": to_addr}],
            "subject": subject,
        }
        if is_html:
            payload["htmlContent"] = body_content
        else:
            payload["textContent"] = body_content

        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(
                "https://api.brevo.com/v3/smtp/email",
                headers={"api-key": settings.brevo_api_key, "Content-Type": "application/json"},
                json=payload,
            )
        if resp.status_code not in (200, 201):
            raise Exception(f"Brevo retornou {resp.status_code}: {resp.text}")
        result = f"Email enviado para {to_addr}"
        _store(result, var, ctx)
        return result

    # ── Sistema ────────────────────────────────────────────

    if t == "run_command":
        command = _sub(cfg.get("command", ""), ctx)
        proc = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=30)
        result = proc.stdout + proc.stderr
        _store(result, var, ctx)
        return result

    if t == "run_python":
        code = _sub(cfg.get("code", ""), ctx)
        old_stdout = sys.stdout
        sys.stdout = buffer = io.StringIO()
        exec_globals = dict(__builtins__=__builtins__)
        exec_globals.update(ctx.get("vars", {}))
        exec_globals["input_data"] = ctx.get("input", "")
        exec_globals["output"] = ctx.get("output", "")
        try:
            exec(code, exec_globals)  # noqa: S102
        finally:
            sys.stdout = old_stdout
        captured = buffer.getvalue()
        # If variable_name specified, try to read that variable from exec_globals
        if var and var in exec_globals:
            result = str(exec_globals[var])
        else:
            result = captured
        _store(result, var, ctx)
        return result

    # ── Inteligência Artificial ────────────────────────────

    if t == "call_ai_agent":
        agent = await ai_agents_col.find_one({"_id": cfg.get("agent_id", "")})
        if not agent:
            raise Exception(f"Agente IA '{cfg.get('agent_id')}' não encontrado")
        template = cfg.get("input_template", "{output}") or "{output}"
        step_input = _sub(template, ctx)
        output_text, _ = await call_ai(agent, step_input)
        _store(output_text, var, ctx)
        return output_text

    if t == "call_pipeline":
        pipeline = await pipelines_col.find_one({"_id": cfg.get("pipeline_id", "")})
        if not pipeline:
            raise Exception(f"Pipeline '{cfg.get('pipeline_id')}' não encontrada")
        template = cfg.get("input_template", "{output}") or "{output}"
        step_input = _sub(template, ctx)
        pipe_output = step_input
        for p_step in pipeline.get("steps", []):
            agent = await ai_agents_col.find_one({"_id": p_step["ai_agent_id"]})
            if not agent:
                raise Exception(f"Agente IA '{p_step['ai_agent_id']}' não encontrado")
            p_tmpl = p_step.get("input_template") or "{output}"
            p_in = p_tmpl.replace("{input}", step_input).replace("{output}", pipe_output)
            pipe_output, _ = await call_ai(agent, p_in)
        _store(pipe_output, var, ctx)
        return pipe_output

    # ── Dados ──────────────────────────────────────────────

    if t == "text_transform":
        text = _sub(cfg.get("text_input", "{output}"), ctx)
        operation = cfg.get("operation", "upper")
        if operation == "upper":      result = text.upper()
        elif operation == "lower":    result = text.lower()
        elif operation == "strip":    result = text.strip()
        elif operation == "replace":
            result = text.replace(cfg.get("search", ""), cfg.get("replace_with", ""))
        elif operation == "count_chars":  result = str(len(text))
        elif operation == "count_words":  result = str(len(text.split()))
        elif operation == "split":
            delim = cfg.get("search", "\n")
            result = json.dumps(text.split(delim), ensure_ascii=False)
        elif operation == "regex":
            pattern = cfg.get("search", "")
            matches = re.findall(pattern, text)
            result = json.dumps(matches, ensure_ascii=False)
        elif operation == "base64_encode":
            import base64
            result = base64.b64encode(text.encode()).decode()
        elif operation == "base64_decode":
            import base64
            result = base64.b64decode(text.encode()).decode()
        else:
            result = text
        _store(result, var, ctx)
        return result

    # ── Navegador ──────────────────────────────────────────

    if t == "browser":
        actions = cfg.get("browser_actions") or []
        engine = cfg.get("browser_engine", "playwright").capitalize()
        result = f"[Browser/{engine}] {len(actions)} ação(ões). Requer worker com {engine}."
        _store(result, var, ctx)
        return result

    return f"[{t}] step executado"


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
    ctx = {"input": initial_input, "output": initial_input, "vars": {}}
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
            if step_type == "condition":
                cond_result = _eval_condition(ctx["output"], cfg.get("operator", "contains"), cfg.get("condition_value", ""))
                result["condition_result"] = cond_result
                result["output"] = f"Condição: {'VERDADEIRO ✓' if cond_result else 'FALSO ✗'} ({cfg.get('operator')} '{cfg.get('condition_value')}')"
                result["duration_ms"] = int((time.time() - step_start) * 1000)
                steps_results.append(result)
                if not cond_result:
                    else_id = cfg.get("else_step_id", "")
                    if not else_id:
                        i = len(steps)
                    else:
                        i = next((idx for idx, s in enumerate(steps) if s["id"] == else_id), len(steps))
                else:
                    i += 1
                continue

            elif step_type == "loop_count":
                count = int(cfg.get("count", 3))
                idx_var = cfg.get("index_variable", "loop_index")
                result["output"] = f"Loop: {count} iterações (variável de índice: {idx_var})"
                result["status"] = "skipped"
                result["error"] = "Loop requer suporte a blocos aninhados (em desenvolvimento)"
                result["duration_ms"] = int((time.time() - step_start) * 1000)
                steps_results.append(result)
                i += 1
                continue

            else:
                output = await _exec_step(step, ctx)
                result["output"] = str(output)[:3000]

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
        "output": ctx["output"],
        "status": final_status,
        "finished_at": finished_at,
        "duration_ms": duration_ms,
    }})

    return {**run_doc, "steps_result": steps_results, "output": ctx["output"],
            "status": final_status, "finished_at": finished_at, "duration_ms": duration_ms}


# ─── CRUD ─────────────────────────────────────────────────────────

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
        "agent_id": body.agent_id,
        "created_at": now,
        "updated_at": now,
    }
    await studio_automations_col.insert_one(doc)
    schedule = trigger.get("schedule", "") if trigger.get("type") == "cron" else ""
    await _upsert_linked_process(doc["_id"], user["_id"], body.name, body.description, body.agent_id, schedule)
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
    merged = {**doc, **data}
    trigger_merged = merged.get("trigger", {})
    schedule = trigger_merged.get("schedule", "") if trigger_merged.get("type") == "cron" else ""
    await _upsert_linked_process(
        automation_id, user["_id"],
        merged.get("name", doc["name"]),
        merged.get("description", doc.get("description", "")),
        merged.get("agent_id", doc.get("agent_id", "")),
        schedule,
    )
    return _doc_to_out(merged, str(request.base_url).rstrip("/"))


@router.delete("/{automation_id}", status_code=204)
async def delete_automation(automation_id: str, user: dict = Depends(get_current_user)):
    result = await studio_automations_col.delete_one({"_id": automation_id, "user_id": user["_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Automação não encontrada")
    await processes_col.delete_one({"studio_automation_id": automation_id, "user_id": user["_id"]})


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


# ─── WEBHOOK ──────────────────────────────────────────────────────

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
