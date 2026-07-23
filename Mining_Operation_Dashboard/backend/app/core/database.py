"""
Mining Intelligence Platform — Database Connection Management
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import get_settings

settings = get_settings()

# ─── PostgreSQL (Async) ──────────────────────────────────────────────
async_engine = create_async_engine(settings.postgres_url, echo=settings.DEBUG)
AsyncSessionLocal = async_sessionmaker(async_engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    """SQLAlchemy declarative base for all PostgreSQL models."""
    pass


async def get_db() -> AsyncSession:
    """Dependency injector for async PostgreSQL sessions."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_postgres():
    """Create all PostgreSQL tables on startup."""
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# ─── MongoDB (Async) ─────────────────────────────────────────────────
mongo_client = AsyncIOMotorClient(settings.mongo_url)
mongo_db = mongo_client[settings.MONGO_DB]

# Collections
telemetry_collection = mongo_db["telemetry_logs"]
classification_history_collection = mongo_db["classification_history"]


# Cloudinary will be configured globally if credentials are provided
