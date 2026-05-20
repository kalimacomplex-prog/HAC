from datetime import datetime
from typing import List

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from ..auth import get_current_user
from ..database import ai_agents_col, pipelines_col, pipeline_runs_col
from ..models.pipeline import (
    PipelineCreate, PipelineUpdate, PipelineOut, PipelineRunOut,
    pipeline_doc_to_out, run_doc_to_out, StepResult,
)
from .ai_agents import call_ai

router = APIRouter(prefix="/pipelines", tags=["pipelines"])


@router.post("", response_model=PipelineOut, status_code=201)
async def create_pipeline(body: PipelineCreate, user: dict = Depends(get_current_user)):
    now = datetime.utcnow()
    doc = {
        "_id": str(ObjectId()),
        "user_id": user["_id"],
        "name": body.name,
        "description": body.description,
        "steps": [s.model_dump() for s in body.steps],
        "created_at": now,
        "updated_at": now,
    }
    await pipelines_col.insert_one(doc)
    return pipeline_doc_to_out(doc)


@router.get("", response_model=List[PipelineOut])
async def list_pipelines(user: dict = Depends(get_current_user)):
    cursor = pipelines_col.find({"user_id": user["_id"]}).sort("created_at", -1)
    return [pipeline_doc_to_out(doc) async for doc in cursor]


@router.get("/{pipeline_id}", response_model=PipelineOut)
async def get_pipeline(pipeline_id: str, user: dict = Depends(get_current_user)):
    doc = await pipelines_col.find_one({"_id": pipeline_id, "user_id": user["_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Pipeline não encontrada")
    return pipeline_doc_to_out(doc)


@router.patch("/{pipeline_id}", response_model=PipelineOut)
async def update_pipeline(pipeline_id: str, body: PipelineUpdate, user: dict = Depends(get_current_user)):
    doc = await pipelines_col.find_one({"_id": pipeline_id, "user_id": user["_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Pipeline não encontrada")
    data = body.model_dump(exclude_unset=True)
    updates = {k: v for k, v in data.items() if v is not None}
    updates["updated_at"] = datetime.utcnow()
    await pipelines_col.update_one({"_id": pipeline_id}, {"$set": updates})
    return pipeline_doc_to_out({**doc, **updates})


@router.delete("/{pipeline_id}", status_code=204)
async def delete_pipeline(pipeline_id: str, user: dict = Depends(get_current_user)):
    result = await pipelines_col.delete_one({"_id": pipeline_id, "user_id": user["_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Pipeline não encontrada")


class PipelineRunRequest(BaseModel):
    input: str


@router.post("/{pipeline_id}/run", response_model=PipelineRunOut)
async def run_pipeline(pipeline_id: str, body: PipelineRunRequest, user: dict = Depends(get_current_user)):
    pipeline = await pipelines_col.find_one({"_id": pipeline_id, "user_id": user["_id"]})
    if not pipeline:
        raise HTTPException(status_code=404, detail="Pipeline não encontrada")

    now = datetime.utcnow()
    run_id = str(ObjectId())
    run_doc = {
        "_id": run_id,
        "pipeline_id": pipeline_id,
        "pipeline_name": pipeline["name"],
        "user_id": user["_id"],
        "initial_input": body.input,
        "steps": [],
        "final_output": "",
        "status": "running",
        "created_at": now,
        "finished_at": None,
    }
    await pipeline_runs_col.insert_one(run_doc)

    current_output = body.input
    steps_results = []
    final_status = "done"

    for step in pipeline.get("steps", []):
        agent = await ai_agents_col.find_one({"_id": step["ai_agent_id"]})
        if not agent:
            steps_results.append({
                "ai_agent_id": step["ai_agent_id"],
                "name": step.get("name", ""),
                "input": current_output,
                "output": "",
                "status": "failed",
                "error": "Agente IA não encontrado",
            })
            final_status = "failed"
            break

        template = step.get("input_template", "{output}")
        step_input = template.replace("{input}", body.input).replace("{output}", current_output)

        try:
            output = await call_ai(agent, step_input)
            steps_results.append({
                "ai_agent_id": step["ai_agent_id"],
                "name": step.get("name") or agent["name"],
                "input": step_input,
                "output": output,
                "status": "done",
                "error": "",
            })
            current_output = output
        except Exception as e:
            steps_results.append({
                "ai_agent_id": step["ai_agent_id"],
                "name": step.get("name") or agent["name"],
                "input": step_input,
                "output": "",
                "status": "failed",
                "error": str(e),
            })
            final_status = "failed"
            break

    finished_at = datetime.utcnow()
    await pipeline_runs_col.update_one(
        {"_id": run_id},
        {"$set": {
            "steps": steps_results,
            "final_output": current_output if final_status == "done" else "",
            "status": final_status,
            "finished_at": finished_at,
        }},
    )

    return PipelineRunOut(
        id=run_id,
        pipeline_id=pipeline_id,
        pipeline_name=pipeline["name"],
        initial_input=body.input,
        steps=[StepResult(**s) for s in steps_results],
        final_output=current_output if final_status == "done" else "",
        status=final_status,
        created_at=now,
        finished_at=finished_at,
    )


@router.get("/{pipeline_id}/runs", response_model=List[PipelineRunOut])
async def list_pipeline_runs(pipeline_id: str, user: dict = Depends(get_current_user)):
    pipeline = await pipelines_col.find_one({"_id": pipeline_id, "user_id": user["_id"]})
    if not pipeline:
        raise HTTPException(status_code=404, detail="Pipeline não encontrada")
    cursor = pipeline_runs_col.find({"pipeline_id": pipeline_id}).sort("created_at", -1).limit(20)
    return [run_doc_to_out(doc) async for doc in cursor]
