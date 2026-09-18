from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    mongo_url: str
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 10080  # 7 dias

    brevo_api_key: str = ""
    brevo_sender_email: str = ""
    brevo_sender_name: str = "HAC Platform"

    # GitHub Actions (workflow_dispatch) — dispara uma execution efêmera
    # por job de agente `type=="cloud"` (ver api/github_actions.py e
    # api/routes/jobs.py). Vazio por padrão de propósito: sem essas três,
    # o dispatch falha e o job cai em fallback `pending` (ver create_job)
    # em vez de quebrar. `github_token` é um PAT com escopo `repo`/`workflow`.
    github_token: str = ""
    github_owner: str = ""
    github_repo: str = ""
    github_workflow_file: str = "rpa-executor.yml"
    github_ref: str = "main"
    # URL pública desta própria API — é o que a execution efêmera usa pra
    # buscar o payload do job e chamar /worker/jobs/{id}/finish de volta.
    hac_api_url: str = ""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
