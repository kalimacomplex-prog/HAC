from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from enum import Enum


class TriggerType(str, Enum):
    manual = "manual"
    cron = "cron"
    webhook = "webhook"


class StepType(str, Enum):
    pipeline = "pipeline"
    http_request = "http_request"
    condition = "condition"
    browser = "browser"


class BrowserAction(BaseModel):
    type: str = ""
    target: str = ""
    value: str = ""
    variable: str = ""


class StepConfig(BaseModel):
    pipeline_id: str = ""
    input_template: str = "{output}"
    method: str = "GET"
    url: str = ""
    headers: Dict[str, str] = Field(default_factory=dict)
    body: str = ""
    operator: str = "contains"
    condition_value: str = ""
    else_step_id: str = ""
    browser_actions: List[BrowserAction] = Field(default_factory=list)


class AutomationStep(BaseModel):
    id: str
    type: StepType
    name: str
    config: StepConfig = Field(default_factory=StepConfig)


class Trigger(BaseModel):
    type: TriggerType = TriggerType.manual
    schedule: str = ""
    webhook_token: str = ""
    schedule_input: str = ""


class AutomationCreate(BaseModel):
    name: str
    description: str = ""
    trigger: Trigger = Field(default_factory=Trigger)
    steps: List[AutomationStep] = Field(default_factory=list)
    active: bool = True


class AutomationUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    trigger: Optional[Trigger] = None
    steps: Optional[List[AutomationStep]] = None
    active: Optional[bool] = None


class AutomationOut(BaseModel):
    id: str
    name: str
    description: str
    trigger: Trigger
    steps: List[AutomationStep]
    active: bool
    created_at: str
    webhook_url: str = ""


class StepResult(BaseModel):
    step_id: str
    step_name: str
    step_type: str
    status: str
    output: str = ""
    error: str = ""
    duration_ms: int = 0
    condition_result: Optional[bool] = None


class AutomationRunOut(BaseModel):
    id: str
    automation_id: str
    automation_name: str
    status: str
    trigger_type: str
    input: str
    steps_result: List[StepResult]
    output: str
    started_at: str
    finished_at: Optional[str] = None
    duration_ms: int = 0
