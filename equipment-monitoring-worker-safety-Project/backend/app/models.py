

import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from .database import Base


def gen_uuid() -> str:
    return str(uuid.uuid4())


class EquipmentStatus(str, enum.Enum):
    OPERATIONAL = "operational"
    IDLE = "idle"
    MAINTENANCE = "maintenance"
    BREAKDOWN = "breakdown"
    OFFLINE = "offline"


class EquipmentType(str, enum.Enum):
    EXCAVATOR = "excavator"
    DRILL_RIG = "drill_rig"
    HAUL_TRUCK = "haul_truck"
    LOADER = "loader"
    CONVEYOR = "conveyor"
    CRUSHER = "crusher"
    BULLDOZER = "bulldozer"


class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String(120), nullable=False)
    equipment_type = Column(Enum(EquipmentType), nullable=False)
    status = Column(Enum(EquipmentStatus), nullable=False, default=EquipmentStatus.OPERATIONAL)
    site_location = Column(String(150), nullable=False)
    manufacturer = Column(String(100), nullable=True)
    model_number = Column(String(100), nullable=True)
    serial_number = Column(String(100), unique=True, nullable=True)
    health_score = Column(Float, default=100.0)          # 0-100
    operating_hours = Column(Float, default=0.0)
    fuel_level_pct = Column(Float, default=100.0)
    temperature_celsius = Column(Float, default=25.0)
    last_maintenance_date = Column(DateTime, nullable=True)
    next_maintenance_due = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    maintenance_logs = relationship(
        "MaintenanceLog", back_populates="equipment", cascade="all, delete-orphan"
    )


class MaintenanceLog(Base):
    __tablename__ = "maintenance_logs"

    id = Column(String, primary_key=True, default=gen_uuid)
    equipment_id = Column(String, ForeignKey("equipment.id"), nullable=False)
    description = Column(Text, nullable=False)
    performed_by = Column(String(120), nullable=True)
    cost = Column(Float, default=0.0)
    performed_at = Column(DateTime, default=datetime.utcnow)

    equipment = relationship("Equipment", back_populates="maintenance_logs")


class WorkerStatus(str, enum.Enum):
    ON_DUTY = "on_duty"
    OFF_DUTY = "off_duty"
    ON_BREAK = "on_break"
    EMERGENCY = "emergency"
    EVACUATED = "evacuated"


class SafetyIncidentSeverity(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class Worker(Base):
    __tablename__ = "workers"

    id = Column(String, primary_key=True, default=gen_uuid)
    employee_code = Column(String(50), unique=True, nullable=False)
    full_name = Column(String(150), nullable=False)
    role = Column(String(100), nullable=False)
    site_location = Column(String(150), nullable=False)
    status = Column(Enum(WorkerStatus), nullable=False, default=WorkerStatus.OFF_DUTY)
    contact_number = Column(String(30), nullable=True)
    helmet_sensor_id = Column(String(80), nullable=True)
    heart_rate_bpm = Column(Integer, nullable=True)
    body_temperature_c = Column(Float, nullable=True)
    gas_exposure_ppm = Column(Float, nullable=True)
    current_zone = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    incidents = relationship(
        "SafetyIncident", back_populates="worker", cascade="all, delete-orphan"
    )


class SafetyIncident(Base):
    __tablename__ = "safety_incidents"

    id = Column(String, primary_key=True, default=gen_uuid)
    worker_id = Column(String, ForeignKey("workers.id"), nullable=False)
    incident_type = Column(String(100), nullable=False)
    severity = Column(Enum(SafetyIncidentSeverity), nullable=False, default=SafetyIncidentSeverity.LOW)
    description = Column(Text, nullable=True)
    location = Column(String(150), nullable=True)
    resolved = Column(Boolean, default=False)
    reported_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    worker = relationship("Worker", back_populates="incidents")
