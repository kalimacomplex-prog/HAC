import asyncio
import logging
from datetime import datetime, timezone, timedelta

from bson import ObjectId
from croniter import croniter

from .database import processes_col, jobs_col, ai_agents_col, ai_agent_runs_col, pipelines_col, pipeline_runs_col

log = logging.getLogger("hac.scheduler")


def _is_due(schedule: str, now: datetime, window_start: datetime) -> bool:
    try:
        cron = croniter(schedule, now - timedelta(minutes=1))
        next_time = cron.get_next(datetime)
        return next_time <= now
    except Exception:
        return False


async def _tick_processes():
    now = datetime.now(timezone.utc)
    window_start = now - timedelta(seconds=70)

    cursor = processes_col.find({"schedule": {"$exists": True, "$ne": None}})
    async for process in cursor:
        schedule = process.get("schedule")
        if not _is_due(schedule, now, window_start):
            continue
        existing = await jobs_col.find_one({
            "process_id": process["_id"],
            "created_at": {"$gte": window_start.replace(tzinfo=None)},
            "status": {"$in": ["pending", "running"]},
        })
        if existing:
            continue
        doc = {
            "_id": str(ObjectId()),
            "user_id": process["user_id"],
            "process_id": process["_id"],
            "process_name": process["name"],
            "agent_id": process.get("agent_id"),
            "status": "pending",
            "params": {},
            "output": None,
            "error": None,
            "created_at": datetime.utcnow(),
            "started_at": None,
            "finished_at": None,
        }
        await jobs_col.insert_one(doc)
        log.info(f"Scheduler: job criado para processo '{process['name']}' ({schedule})")


async def _tick_ai_agents():
    now = datetime.now(timezone.utc)
    window_start = now - timedelta(seconds=70)

    cursor = ai_agents_col.find({"schedule": {"$exists": True, "$ne": None, "$ne": ""}})
    async for agent in cursor:
        schedule = agent.get("schedule")
        if not schedule or not _is_due(schedule, now, window_start):
            continue

        existing = await ai_agent_runs_col.find_one({
            "agent_id": agent["_id"],
            "created_at": {"$gte": window_start.replace(tzinfo=None)},
            "scheduled": True,
            "status": {"$in": ["running"]},
        })
        if existing:
            continue

        run_id = str(ObjectId())
        run_doc = {
            "_id": run_id,
            "agent_id": agent["_id"],
            "agent_name": agent["name"],
            "user_id": agent["user_id"],
            "input": agent.get("schedule_input", ""),
            "output": "",
            "status": "running",
            "error": "",
            "tokens_used": None,
            "scheduled": True,
            "created_at": datetime.utcnow(),
            "finished_at": None,
        }
        await ai_agent_runs_col.insert_one(run_doc)

        try:
            from .routes.ai_agents import call_ai
            output, meta = await call_ai(agent, agent.get("schedule_input", ""))
            await ai_agent_runs_col.update_one({"_id": run_id}, {"$set": {
                "output": output,
                "status": "done",
                "tokens_used": meta.get("tokens_used"),
                "finished_at": datetime.utcnow(),
            }})
            log.info(f"Scheduler: agente IA '{agent['name']}' executado com sucesso")
        except Exception as e:
            await ai_agent_runs_col.update_one({"_id": run_id}, {"$set": {
                "status": "failed",
                "error": str(e),
                "finished_at": datetime.utcnow(),
            }})
            log.error(f"Scheduler: agente IA '{agent['name']}' falhou: {e}")


async def _tick_pipelines():
    now = datetime.now(timezone.utc)
    window_start = now - timedelta(seconds=70)

    cursor = pipelines_col.find({"schedule": {"$exists": True, "$ne": None, "$ne": ""}})
    async for pipeline in cursor:
        schedule = pipeline.get("schedule")
        if not schedule or not _is_due(schedule, now, window_start):
            continue

        existing = await pipeline_runs_col.find_one({
            "pipeline_id": pipeline["_id"],
            "created_at": {"$gte": window_start.replace(tzinfo=None)},
            "scheduled": True,
            "status": "running",
        })
        if existing:
            continue

        run_id = str(ObjectId())
        initial_input = pipeline.get("schedule_input", "")
        run_doc = {
            "_id": run_id,
            "pipeline_id": pipeline["_id"],
            "pipeline_name": pipeline["name"],
            "user_id": pipeline["user_id"],
            "initial_input": initial_input,
            "steps": [],
            "final_output": "",
            "status": "running",
            "scheduled": True,
            "created_at": datetime.utcnow(),
            "finished_at": None,
        }
        await pipeline_runs_col.insert_one(run_doc)

        try:
            from .routes.ai_agents import call_ai
            current_output = initial_input
            steps_results = []
            final_status = "done"

            for step in pipeline.get("steps", []):
                agent = await ai_agents_col.find_one({"_id": step["ai_agent_id"]})
                if not agent:
                    steps_results.append({"ai_agent_id": step["ai_agent_id"], "name": step.get("name", ""), "input": current_output, "output": "", "status": "failed", "error": "Agente não encontrado"})
                    final_status = "failed"
                    break
                template = step.get("input_template", "{output}")
                step_input = template.replace("{input}", initial_input).replace("{output}", current_output)
                try:
                    output, _ = await call_ai(agent, step_input)
                    steps_results.append({"ai_agent_id": step["ai_agent_id"], "name": step.get("name") or agent["name"], "input": step_input, "output": output, "status": "done", "error": ""})
                    current_output = output
                except Exception as e:
                    steps_results.append({"ai_agent_id": step["ai_agent_id"], "name": step.get("name") or agent["name"], "input": step_input, "output": "", "status": "failed", "error": str(e)})
                    final_status = "failed"
                    break

            await pipeline_runs_col.update_one({"_id": run_id}, {"$set": {
                "steps": steps_results,
                "final_output": current_output if final_status == "done" else "",
                "status": final_status,
                "finished_at": datetime.utcnow(),
            }})
            log.info(f"Scheduler: pipeline '{pipeline['name']}' executada — status: {final_status}")
        except Exception as e:
            await pipeline_runs_col.update_one({"_id": run_id}, {"$set": {"status": "failed", "error": str(e), "finished_at": datetime.utcnow()}})
            log.error(f"Scheduler: pipeline '{pipeline['name']}' falhou: {e}")


async def scheduler_loop():
    log.info("Scheduler iniciado.")
    while True:
        try:
            await _tick_processes()
            await _tick_ai_agents()
            await _tick_pipelines()
        except Exception as e:
            log.error(f"Scheduler erro: {e}", exc_info=True)
        await asyncio.sleep(60)
