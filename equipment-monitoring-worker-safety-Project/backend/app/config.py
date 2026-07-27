

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    
    APP_NAME: str = "Mining Intelligence Platform API"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = True


    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "mining_intel"

    @property
    def DATABASE_URL(self) -> str:
        return "sqlite:///./mining_intelligence.db"

    
    MONGO_URI: str = "mongodb://localhost:27017"
    MONGO_DB_NAME: str = "mining_intel_logs"
    MONGO_ENABLED: bool = False

    
    CORS_ORIGINS: list[str] = ["*"]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
