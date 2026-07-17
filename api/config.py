from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    mongo_url: str
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 10080  # 7 dias

    brevo_api_key: str = ""
    brevo_sender_email: str = ""
    brevo_sender_name: str = "HAC Platform"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
