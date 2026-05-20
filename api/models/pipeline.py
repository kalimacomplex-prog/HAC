from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class PipelineStep(BaseModel):
    ai_agent_id: str
    name: str = ""
    input_template: str = "{output}"


class PipelineCreate(BaseModel):
    name: str
    description: str = ""
    steps: List[PipelineStep] = []


class PipelineUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    steps: Optional[List[PipelineStep]] = None


class PipelineOut(BaseModel):
    id: str
    user_id: str
    name: str
    description: str
    steps: List[PipelineStep]
    created_at: datetime
    updated_at: datetime


class StepResult(BaseModel):
    ai_agent_id: str
    name: str
    input: str
    output: str
    status: str
    error: str = ""


class PipelineRunOut(BaseModel):
    id: str
    pipeline_id: str
    pipeline_name: str
    initial_input: str
    steps: List[StepResult]
    final_output: str
    status: str
    created_at: datetime
    finished_at: Optional[datetime]


def pipeline_doc_to_out(doc: dict) -> PipelineOut:
    return PipelineOut(
        id=str(doc["_id"]),
        user_id=str(doc["user_id"]),
        name=doc["name"],
        description=doc.get("description", ""),
        steps=[PipelineStep(**s) for s in doc.get("steps", [])],
        created_at=doc["created_at"],
        updated_at=doc["updated_at"],
    )


def run_doc_to_out(doc: dict) -> PipelineRunOut:
    return PipelineRunOut(
        id=str(doc["_id"]),
        pipeline_id=str(doc["pipeline_id"]),
        pipeline_name=doc.get("pipeline_name", ""),
        initial_input=doc["initial_input"],
        steps=[StepResult(**s) for s in doc.get("steps", [])],
        final_output=doc.get("final_output", ""),
        status=doc["status"],
        created_at=doc["created_at"],
        finished_at=doc.get("finished_at"),
    )
