from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

import asyncio
from .database import create_indexes
from .scheduler import scheduler_loop
from .routes import auth, agents, processes, jobs, worker, ai_agents, pipelines, studio

app = FastAPI(title="HAC Platform", version="1.0.0")

frontend_dir = os.path.join(os.path.dirname(__file__), "..", "frontend")
app.mount("/static", StaticFiles(directory=frontend_dir), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(agents.router)
app.include_router(processes.router)
app.include_router(jobs.router)
app.include_router(worker.router)
app.include_router(ai_agents.router)
app.include_router(pipelines.router)
app.include_router(studio.router)


@app.on_event("startup")
async def startup():
    await create_indexes()
    asyncio.create_task(scheduler_loop())


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/")
async def frontend():
    path = os.path.join(os.path.dirname(__file__), "..", "frontend", "index.html")
    return FileResponse(path)
