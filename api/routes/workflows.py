import re
from datetime import datetime
from typing import Any, Dict, List

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

from ..auth import get_current_user
from ..database import db, jobs_col, processes_col
from ..models.workflow import (
    WorkflowCreate, WorkflowOut, WorkflowRunOut, WorkflowRunRequest, wf_doc_to_out
)

workflows_col = db.workflows
workflow_runs_col = db.workflow_runs

router = APIRouter(prefix="/workflows", tags=["workflows"])


@router.get("", response_model=List[WorkflowOut])
async def list_workflows(user: dict = Depends(get_current_user)):
    cursor = workflows_col.find({"user_id": user["_id"]}).sort("created_at", -1)
    return [wf_doc_to_out(doc) async for doc in cursor]


@router.post("", response_model=WorkflowOut, status_code=201)
async def create_workflow(body: WorkflowCreate, user: dict = Depends(get_current_user)):
    doc = {
        "_id": str(ObjectId()),
        "user_id": user["_id"],
        "name": body.name,
        "agent_id": body.agent_id or None,
        "variables": [v.model_dump() for v in body.variables],
        "nodes": [n.model_dump() for n in body.nodes],
        "edges": [e.model_dump() for e in body.edges],
        "created_at": datetime.utcnow(),
        "updated_at": None,
    }
    await workflows_col.insert_one(doc)
    return wf_doc_to_out(doc)


@router.get("/{wf_id}", response_model=WorkflowOut)
async def get_workflow(wf_id: str, user: dict = Depends(get_current_user)):
    doc = await workflows_col.find_one({"_id": wf_id, "user_id": user["_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Workflow não encontrado")
    return wf_doc_to_out(doc)


@router.put("/{wf_id}", response_model=WorkflowOut)
async def update_workflow(wf_id: str, body: WorkflowCreate, user: dict = Depends(get_current_user)):
    doc = await workflows_col.find_one({"_id": wf_id, "user_id": user["_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Workflow não encontrado")
    variables = [v.model_dump() for v in body.variables]
    nodes = [n.model_dump() for n in body.nodes]
    edges = [e.model_dump() for e in body.edges]
    await workflows_col.update_one(
        {"_id": wf_id},
        {"$set": {
            "name": body.name,
            "agent_id": body.agent_id or None,
            "variables": variables,
            "nodes": nodes,
            "edges": edges,
            "updated_at": datetime.utcnow(),
        }},
    )
    return wf_doc_to_out({**doc, "name": body.name, "agent_id": body.agent_id or None, "variables": variables, "nodes": nodes, "edges": edges})


@router.delete("/{wf_id}", status_code=204)
async def delete_workflow(wf_id: str, user: dict = Depends(get_current_user)):
    doc = await workflows_col.find_one({"_id": wf_id, "user_id": user["_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Workflow não encontrado")
    await workflows_col.delete_one({"_id": wf_id})


@router.post("/{wf_id}/run", response_model=WorkflowRunOut)
async def run_workflow(
    wf_id: str,
    body: WorkflowRunRequest,
    user: dict = Depends(get_current_user),
):
    doc = await workflows_col.find_one({"_id": wf_id, "user_id": user["_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Workflow não encontrado")

    nodes = doc.get("nodes") or []
    edges = doc.get("edges") or []
    variables: Dict[str, str] = body.variables or {}

    task_ids = _traverse_workflow(nodes, edges)
    if not task_ids:
        raise HTTPException(status_code=400, detail="Workflow não contém tarefas com processo configurado")

    job_ids = []
    for node_id in task_ids:
        node = next((n for n in nodes if n["id"] == node_id), None)
        if not node or not node.get("process_id"):
            continue
        process = await processes_col.find_one({"_id": node["process_id"], "user_id": user["_id"]})
        if not process:
            continue
        resolved_params = _resolve_params(node.get("params") or {}, variables)
        job_doc = {
            "_id": str(ObjectId()),
            "user_id": user["_id"],
            "process_id": process["_id"],
            "process_name": process["name"],
            "agent_id": doc.get("agent_id") or process.get("agent_id"),
            "status": "pending",
            "priority": 0,
            "params": resolved_params,
            "output": None,
            "error": None,
            "workflow_id": wf_id,
            "workflow_name": doc["name"],
            "output_var": node.get("output_var"),
            "created_at": datetime.utcnow(),
            "started_at": None,
            "finished_at": None,
        }
        await jobs_col.insert_one(job_doc)
        job_ids.append(job_doc["_id"])

    run_doc = {
        "_id": str(ObjectId()),
        "user_id": user["_id"],
        "workflow_id": wf_id,
        "workflow_name": doc["name"],
        "status": "running",
        "variables": variables,
        "job_ids": job_ids,
        "jobs_created": len(job_ids),
        "created_at": datetime.utcnow(),
    }
    await workflow_runs_col.insert_one(run_doc)

    return WorkflowRunOut(
        id=run_doc["_id"],
        workflow_id=wf_id,
        workflow_name=doc["name"],
        status="running",
        jobs_created=len(job_ids),
        created_at=run_doc["created_at"],
    )


def _resolve_params(params: Dict[str, Any], variables: Dict[str, str]) -> Dict[str, Any]:
    """Replace {variable} placeholders in string param values."""
    result: Dict[str, Any] = {}
    for key, value in params.items():
        if isinstance(value, str):
            result[key] = re.sub(
                r'\{(\w+)\}',
                lambda m: variables.get(m.group(1), m.group(0)),
                value,
            )
        else:
            result[key] = value
    return result


def _traverse_workflow(nodes: list, edges: list) -> list:
    """BFS from Start node, return task node IDs in visit order."""
    node_map = {n["id"]: n for n in nodes}
    start = next((n for n in nodes if n["type"] == "start"), None)
    if not start:
        return [n["id"] for n in nodes if n["type"] == "task"]

    adj: dict = {}
    for e in edges:
        adj.setdefault(e["source"], []).append(e["target"])

    visited: set = set()
    queue = [start["id"]]
    task_order = []

    while queue:
        node_id = queue.pop(0)
        if node_id in visited:
            continue
        visited.add(node_id)
        node = node_map.get(node_id)
        if node and node["type"] == "task":
            task_order.append(node_id)
        for nxt in adj.get(node_id, []):
            if nxt not in visited:
                queue.append(nxt)

    return task_order
