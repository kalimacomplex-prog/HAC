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
    # Navegador (legado — composto)
    browser = "browser"
    # Navegador (sessão persistente — ações individuais)
    browser_open = "browser_open"
    browser_click = "browser_click"
    browser_type = "browser_type"
    browser_extract = "browser_extract"
    browser_wait = "browser_wait"
    browser_screenshot = "browser_screenshot"
    browser_close = "browser_close"
    # Arquivos (Fase 1)
    copy_file = "copy_file"
    move_file = "move_file"
    file_hash = "file_hash"
    file_info = "file_info"
    search_in_files = "search_in_files"
    convert_encoding = "convert_encoding"
    delete_folder = "delete_folder"
    ensure_dir = "ensure_dir"
    # Compactação (Fase 1)
    zip_files = "zip_files"
    unzip_file = "unzip_file"
    backup_folder = "backup_folder"
    # Data & Hora (Fase 1)
    date_diff = "date_diff"
    date_add = "date_add"
    timezone_convert = "timezone_convert"
    is_business_day = "is_business_day"
    format_date = "format_date"
    # Controle de Fluxo avançado (Fase 1)
    foreach = "foreach"
    try_catch = "try_catch"
    parallel = "parallel"
    while_condition = "while_condition"
    break_loop = "break_loop"
    call_automation = "call_automation"
    random_wait = "random_wait"
    # Planilhas & Excel (Fase 2)
    read_excel = "read_excel"
    write_excel = "write_excel"
    read_csv = "read_csv"
    write_csv = "write_csv"
    filter_data = "filter_data"
    merge_data = "merge_data"
    dedupe_data = "dedupe_data"
    sort_group_data = "sort_group_data"
    # PDF (Fase 2)
    pdf_extract_text = "pdf_extract_text"
    pdf_extract_tables = "pdf_extract_tables"
    pdf_merge = "pdf_merge"
    pdf_split = "pdf_split"
    pdf_generate = "pdf_generate"
    pdf_fill_form = "pdf_fill_form"
    # Dados & ETL (Fase 2)
    validate_json_schema = "validate_json_schema"
    convert_data_format = "convert_data_format"
    html_extract = "html_extract"
    sql_on_data = "sql_on_data"
    generate_fake_data = "generate_fake_data"
    # Validação BR (Fase 3)
    validate_cpf_cnpj = "validate_cpf_cnpj"
    validate_email = "validate_email"
    validate_phone = "validate_phone"
    lookup_cep = "lookup_cep"
    format_currency = "format_currency"
    # Segurança & Criptografia (Fase 3)
    encrypt_text = "encrypt_text"
    decrypt_text = "decrypt_text"
    generate_jwt = "generate_jwt"
    verify_jwt = "verify_jwt"
    hash_password = "hash_password"
    verify_password = "verify_password"
    generate_otp = "generate_otp"
    verify_otp = "verify_otp"
    generate_secure_password = "generate_secure_password"
    check_ssl_cert = "check_ssl_cert"
    hmac_sign = "hmac_sign"
    # Comunicação (Fase 4)
    send_telegram = "send_telegram"
    send_slack = "send_slack"
    send_discord = "send_discord"
    send_whatsapp = "send_whatsapp"
    send_sms = "send_sms"
    read_email_imap = "read_email_imap"
    # Notificações (Fase 4)
    send_push_notification = "send_push_notification"
    create_incident = "create_incident"
    # Pagamentos & Financeiro (Fase 4)
    asaas_create_charge = "asaas_create_charge"
    asaas_check_payment = "asaas_check_payment"
    generate_pix_qr = "generate_pix_qr"
    get_currency_rate = "get_currency_rate"
    get_crypto_price = "get_crypto_price"
    # APIs Externas Úteis (Fase 5)
    get_weather = "get_weather"
    geocode_address = "geocode_address"
    calculate_distance = "calculate_distance"
    shorten_url = "shorten_url"
    lookup_cnpj = "lookup_cnpj"
    translate_text = "translate_text"
    get_holidays = "get_holidays"
    # Web & Scraping avançado (Fase 5)
    download_file = "download_file"
    upload_file = "upload_file"
    scrape_html_table = "scrape_html_table"
    read_rss_feed = "read_rss_feed"
    http_request_retry = "http_request_retry"
    # Texto & NLP (Fase 5)
    detect_language = "detect_language"
    count_tokens = "count_tokens"
    # IA & ML extra (Fase 6)
    generate_embedding = "generate_embedding"
    semantic_search = "semantic_search"
    moderate_content = "moderate_content"
    compare_texts = "compare_texts"
    # Sistema & DevOps (Fase 6)
    system_stats = "system_stats"
    list_processes = "list_processes"
    check_port_open = "check_port_open"
    dns_lookup = "dns_lookup"
    whois_lookup = "whois_lookup"
    ssh_execute = "ssh_execute"
    read_env_var = "read_env_var"
    check_url_uptime = "check_url_uptime"
    # Banco de Dados & Fila (Fase 6)
    redis_get = "redis_get"
    redis_set = "redis_set"
    queue_push = "queue_push"
    queue_pop = "queue_pop"
    sql_query_external = "sql_query_external"
    # Templates & Documentos (Fase 6)
    render_template = "render_template"
    generate_word_doc = "generate_word_doc"
    generate_pptx = "generate_pptx"
    # Imagens (Fase 7)
    resize_image = "resize_image"
    convert_image_format = "convert_image_format"
    add_watermark = "add_watermark"
    generate_thumbnail = "generate_thumbnail"
    generate_qrcode = "generate_qrcode"
    read_qrcode = "read_qrcode"
    compare_images = "compare_images"
    generate_ai_image = "generate_ai_image"
    # Áudio & Vídeo — requer ffmpeg no host do agente (Fase 7)
    transcode_media = "transcode_media"
    extract_audio = "extract_audio"
    trim_media = "trim_media"
    extract_video_frame = "extract_video_frame"
    transcribe_audio = "transcribe_audio"
    text_to_speech = "text_to_speech"
    # OCR & Visão — requer tesseract/poppler no host do agente (Fase 7)
    ocr_image = "ocr_image"
    ocr_pdf_scanned = "ocr_pdf_scanned"
    detect_face_object = "detect_face_object"


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
    # browser (legado — composto)
    browser_actions: List[BrowserAction] = Field(default_factory=list)
    browser_engine: str = "playwright"
    browser_headless: bool = True
    # browser (sessão persistente)
    session_name: str = ""
    target: str = ""
    # arquivos / compactação (Fase 1)
    source_path: str = ""
    dest_path: str = ""
    hash_algo: str = "sha256"
    encoding_from: str = "utf-8"
    encoding_to: str = "utf-8"
    # data & hora (Fase 1)
    date_value: str = ""
    date_value2: str = ""
    date_unit: str = "days"
    date_amount: int = 0
    date_format_in: str = "%Y-%m-%d"
    date_format_out: str = "%d/%m/%Y"
    timezone_from: str = "UTC"
    timezone_to: str = "America/Sao_Paulo"
    # controle de fluxo avançado (Fase 1)
    list_source: str = "{output}"
    item_variable: str = "item"
    max_iterations: int = 100
    automation_id: str = ""
    seconds_max: float = 3.0
    # planilhas / dados (Fase 2)
    sheet_name: str = "Sheet1"
    delimiter: str = ","
    data_input: str = "{output}"
    data_input2: str = ""
    merge_key: str = ""
    sort_key: str = ""
    sort_desc: bool = False
    schema_input: str = ""
    format_from: str = "json"
    format_to: str = "csv"
    css_selector: str = ""
    sql_query: str = "SELECT * FROM data"
    fake_type: str = "name"
    fake_count: int = 5
    # segurança / validação BR (Fase 3)
    secret_key: str = ""
    password_length: int = 16
    region: str = "BR"
    # comunicação / pagamentos (Fase 4)
    api_key: str = ""
    api_secret: str = ""
    from_number: str = ""
    pix_key: str = ""
    pix_merchant_name: str = ""
    pix_merchant_city: str = ""
    # APIs externas / scraping (Fase 5)
    coord_from: str = ""
    coord_to: str = ""
    # imagens / mídia (Fase 7)
    width: int = 0
    height: int = 0
    # onde executar: "server" (padrão) ou "agent" (roda no agente/worker selecionado)
    run_on: str = "server"


class AutomationStep(BaseModel):
    id: str
    type: StepType
    name: str
    enabled: bool = True
    config: StepConfig = Field(default_factory=StepConfig)
    children: List["AutomationStep"] = Field(default_factory=list)
    children_true: List["AutomationStep"] = Field(default_factory=list)
    children_false: List["AutomationStep"] = Field(default_factory=list)


AutomationStep.model_rebuild()


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
    agent_id: str = ""


class AutomationUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    trigger: Optional[Trigger] = None
    steps: Optional[List[AutomationStep]] = None
    active: Optional[bool] = None
    agent_id: Optional[str] = None


class AutomationOut(BaseModel):
    id: str
    name: str
    description: str
    trigger: Trigger
    steps: List[AutomationStep]
    active: bool
    created_at: str
    webhook_url: str = ""
    agent_id: str = ""


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
