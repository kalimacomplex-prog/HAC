import asyncio
import logging
from datetime import datetime, timezone, timedelta

from bson import ObjectId
from croniter import croniter

from .database import processes_col, jobs_col

log = logging.getLogger("hac.scheduler")


async def _tick():
    now = datetime.now(timezone.utc)
    window_start = now - timedelta(seconds=70)

    cursor = processes_col.find({"schedule": {"$exists": True, "$ne": None}})
    async for process in cursor:
        schedule = process.get("schedule")
        try:
            cron = croniter(schedule, now - timedelta(minutes=1))
            next_time = cron.get_next(datetime)
            if next_time > now:
                continue
        except Exception:
            continue

        # Evita duplicata: checa se já existe job criado nessa janela
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
        log.info(f"Scheduler: job criado para processo '{process['name']}' (schedule: {schedule})")


async def scheduler_loop():
    log.info("Scheduler iniciado.")
    while True:
        try:
            await _tick()
        except Exception as e:
            log.error(f"Scheduler erro: {e}", exc_info=True)
        await asyncio.sleep(60)
