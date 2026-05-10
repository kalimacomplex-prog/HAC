from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING, IndexModel
from .config import settings

client = AsyncIOMotorClient(settings.mongo_url)
db = client.hac

users_col = db.users
agents_col = db.agents
processes_col = db.processes
jobs_col = db.jobs


async def create_indexes():
    await users_col.create_index("email", unique=True)
    await agents_col.create_indexes([
        IndexModel([("user_id", ASCENDING)]),
    ])
    await processes_col.create_indexes([
        IndexModel([("user_id", ASCENDING)]),
    ])
    await jobs_col.create_indexes([
        IndexModel([("user_id", ASCENDING)]),
        IndexModel([("status", ASCENDING)]),
        IndexModel([("process_id", ASCENDING)]),
    ])
