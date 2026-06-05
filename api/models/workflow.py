from typing import Any, Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel


class WfVariable(BaseModel):
    name: str
    default_value: str = ''
    description: str = ''


class WfNode(BaseModel):
    id: str
    type: str
    x: float
    y: float
    label: str
    process_id: Optional[str] = None
    params: Optional[Dict[str, Any]] = None
    output_var: Optional[str] = None
    config: Optional[Dict[str, Any]] = None  # type-specific configuration


class WfEdge(BaseModel):
    id: str
    source: str
    source_port: int = 0
    target: str
    label: Optional[str] = None


class WorkflowCreate(BaseModel):
    name: str
    variables: List[WfVariable] = []
    nodes: List[WfNode] = []
    edges: List[WfEdge] = []


class WorkflowRunRequest(BaseModel):
    variables: Dict[str, str] = {}


class WorkflowOut(BaseModel):
    id: str
    name: str
    variables: List[WfVariable]
    nodes: List[WfNode]
    edges: List[WfEdge]
    node_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None


class WorkflowRunOut(BaseModel):
    id: str
    workflow_id: str
    workflow_name: str
    status: str
    jobs_created: int
    created_at: datetime


def wf_doc_to_out(doc: dict) -> WorkflowOut:
    nodes = [WfNode(**n) for n in (doc.get("nodes") or [])]
    edges = [WfEdge(**e) for e in (doc.get("edges") or [])]
    variables = [WfVariable(**v) for v in (doc.get("variables") or [])]
    return WorkflowOut(
        id=doc["_id"],
        name=doc["name"],
        variables=variables,
        nodes=nodes,
        edges=edges,
        node_count=len(nodes),
        created_at=doc["created_at"],
        updated_at=doc.get("updated_at"),
    )
