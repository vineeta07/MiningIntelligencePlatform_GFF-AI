

from motor.motor_asyncio import AsyncIOMotorClient
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from .config import settings


engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



mongo_client = AsyncIOMotorClient(settings.MONGO_URI)
mongo_db = mongo_client[settings.MONGO_DB_NAME]


equipment_telemetry_collection = mongo_db["equipment_telemetry"]
safety_incident_logs_collection = mongo_db["safety_incident_logs"]


def get_mongo_db():
    """FastAPI dependency that yields the Mongo database handle."""
    return mongo_db
