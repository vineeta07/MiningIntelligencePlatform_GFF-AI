

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from .models import (
    EquipmentStatus,
    EquipmentType,
    SafetyIncidentSeverity,
    WorkerStatus,
)



class EquipmentBase(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    name: str = Field(..., max_length=120)
    equipment_type: EquipmentType
    status: EquipmentStatus = EquipmentStatus.OPERATIONAL
    site_location: str = Field(..., max_length=150)
    manufacturer: Optional[str] = None
    model_number: Optional[str] = None
    serial_number: Optional[str] = None
    health_score: float = Field(default=100.0, ge=0, le=100)
    operating_hours: float = Field(default=0.0, ge=0)
    fuel_level_pct: float = Field(default=100.0, ge=0, le=100)
    temperature_celsius: float = 25.0
    last_maintenance_date: Optional[datetime] = None
    next_maintenance_due: Optional[datetime] = None


class EquipmentCreate(EquipmentBase):
    pass


class EquipmentUpdate(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    name: Optional[str] = None
    equipment_type: Optional[EquipmentType] = None
    status: Optional[EquipmentStatus] = None
    site_location: Optional[str] = None
    manufacturer: Optional[str] = None
    model_number: Optional[str] = None
    serial_number: Optional[str] = None
    health_score: Optional[float] = Field(default=None, ge=0, le=100)
    operating_hours: Optional[float] = None
    fuel_level_pct: Optional[float] = Field(default=None, ge=0, le=100)
    temperature_celsius: Optional[float] = None
    last_maintenance_date: Optional[datetime] = None
    next_maintenance_due: Optional[datetime] = None
    is_active: Optional[bool] = None


class EquipmentOut(EquipmentBase):
    model_config = ConfigDict(from_attributes=True, protected_namespaces=())

    id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime


class MaintenanceLogBase(BaseModel):
    description: str
    performed_by: Optional[str] = None
    cost: float = 0.0


class MaintenanceLogCreate(MaintenanceLogBase):
    pass


class MaintenanceLogOut(MaintenanceLogBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    equipment_id: str
    performed_at: datetime


class EquipmentTelemetryIn(BaseModel):
    """Payload written to MongoDB for high-frequency sensor data."""

    equipment_id: str
    temperature_celsius: Optional[float] = None
    vibration_level: Optional[float] = None
    fuel_level_pct: Optional[float] = None
    rpm: Optional[float] = None
    gps_lat: Optional[float] = None
    gps_lng: Optional[float] = None
    recorded_at: datetime = Field(default_factory=datetime.utcnow)


# ---------------------------------------------------------------------------
# Worker Safety
# ---------------------------------------------------------------------------
class WorkerBase(BaseModel):
    employee_code: str = Field(..., max_length=50)
    full_name: str = Field(..., max_length=150)
    role: str = Field(..., max_length=100)
    site_location: str = Field(..., max_length=150)
    status: WorkerStatus = WorkerStatus.OFF_DUTY
    contact_number: Optional[str] = None
    helmet_sensor_id: Optional[str] = None
    heart_rate_bpm: Optional[int] = None
    body_temperature_c: Optional[float] = None
    gas_exposure_ppm: Optional[float] = None
    current_zone: Optional[str] = None


class WorkerCreate(WorkerBase):
    pass


class WorkerUpdate(BaseModel):
    employee_code: Optional[str] = None
    full_name: Optional[str] = None
    role: Optional[str] = None
    site_location: Optional[str] = None
    status: Optional[WorkerStatus] = None
    contact_number: Optional[str] = None
    helmet_sensor_id: Optional[str] = None
    heart_rate_bpm: Optional[int] = None
    body_temperature_c: Optional[float] = None
    gas_exposure_ppm: Optional[float] = None
    current_zone: Optional[str] = None
    is_active: Optional[bool] = None


class WorkerOut(WorkerBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime


class SafetyIncidentBase(BaseModel):
    incident_type: str = Field(..., max_length=100)
    severity: SafetyIncidentSeverity = SafetyIncidentSeverity.LOW
    description: Optional[str] = None
    location: Optional[str] = None


class SafetyIncidentCreate(SafetyIncidentBase):
    worker_id: str


class SafetyIncidentUpdate(BaseModel):
    incident_type: Optional[str] = None
    severity: Optional[SafetyIncidentSeverity] = None
    description: Optional[str] = None
    location: Optional[str] = None
    resolved: Optional[bool] = None


class SafetyIncidentOut(SafetyIncidentBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    worker_id: str
    resolved: bool
    reported_at: datetime
    resolved_at: Optional[datetime] = None


class SafetyEventLogIn(BaseModel):
  

    worker_id: str
    event_type: str
    heart_rate_bpm: Optional[int] = None
    gas_exposure_ppm: Optional[float] = None
    body_temperature_c: Optional[float] = None
    zone: Optional[str] = None
    recorded_at: datetime = Field(default_factory=datetime.utcnow)
