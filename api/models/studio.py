from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum


class TriggerType(str, Enum):
    manual = "manual"
    cron = "cron"
    webhook = "webhook"


class StepType(str, Enum):
    # Controle de Fluxo
    condition = "condition"
    loop_count = "loop_count"
    wait = "wait"
    comment = "comment"
    # Variáveis
    set_variable = "set_variable"
    calculate = "calculate"
    # Arquivos
    read_file = "read_file"
    write_file = "write_file"
    list_files = "list_files"
    delete_file = "delete_file"
    # HTTP & Internet
    http_request = "http_request"
    parse_json = "parse_json"
    # Email
    send_email = "send_email"
    # Sistema
    run_command = "run_command"
    run_python = "run_python"
    # IA
    call_ai_agent = "call_ai_agent"
    call_pipeline = "call_pipeline"
    # Dados
    text_transform = "text_transform"
    # Navegador
    browser = "browser"


class BrowserAction(BaseModel):
    type: str = ""
    target: str = ""
    value: str = ""
    variable: str = ""


class StepConfig(BaseModel):
    # condition
    operator: str = "contains"
    condition_value: str = ""
    else_step_id: str = ""
    # loop_count
    count: int = 3
    index_variable: str = "loop_index"
    # wait
    seconds: float = 1.0
    # comment
    text: str = ""
    # set_variable / calculate
    variable_name: str = ""
    value: str = ""
    expression: str = ""
    # files
    file_path: str = ""
    content: str = "{output}"
    append: bool = False
    directory: str = ""
    pattern: str = "*"
    # http_request
    method: str = "GET"
    url: str = ""
    headers: Dict[str, str] = Field(default_factory=dict)
    body: str = ""
    # parse_json
    json_input: str = "{output}"
    key_path: str = ""
    # send_email
    to: str = ""
    subject: str = ""
    email_body: str = ""
    is_html: bool = False
    # run_command / run_python
    command: str = ""
    code: str = ""
    # call_ai_agent
    agent_id: str = ""
    input_template: str = "{output}"
    # call_pipeline
    pipeline_id: str = ""
    # text_transform
    text_input: str = "{output}"
    operation: str = "upper"
    search: str = ""
    replace_with: str = ""
    # browser
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
