

from datetime import datetime, timedelta

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import equipment_routes
from . import models
from . import worker_routes

from .config import settings
from .database import Base, SessionLocal, engine


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for Equipment Monitoring and Worker Safety modules.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(equipment_routes.router)
app.include_router(worker_routes.router)


@app.get("/", tags=["Health"])
def root():
    return {
        "service": settings.APP_NAME,
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}


def seed_dummy_data():
    db = SessionLocal()
    try:
        if db.query(models.Equipment).count() == 0:
            equipment_items = [
                models.Equipment(
                    name="Excavator EX-101",
                    equipment_type=models.EquipmentType.EXCAVATOR,
                    status=models.EquipmentStatus.OPERATIONAL,
                    site_location="Pit A - North Zone",
                    manufacturer="Caterpillar",
                    model_number="CAT 336",
                    serial_number="SN-EX101",
                    health_score=92.5,
                    operating_hours=1450.5,
                    fuel_level_pct=78.0,
                    temperature_celsius=64.2,
                    last_maintenance_date=datetime.utcnow() - timedelta(days=20),
                    next_maintenance_due=datetime.utcnow() + timedelta(days=40),
                ),
                models.Equipment(
                    name="Drill Rig DR-205",
                    equipment_type=models.EquipmentType.DRILL_RIG,
                    status=models.EquipmentStatus.MAINTENANCE,
                    site_location="Pit B - South Zone",
                    manufacturer="Atlas Copco",
                    model_number="Pit Viper 235",
                    serial_number="SN-DR205",
                    health_score=61.0,
                    operating_hours=3210.0,
                    fuel_level_pct=45.0,
                    temperature_celsius=71.8,
                    last_maintenance_date=datetime.utcnow() - timedelta(days=2),
                    next_maintenance_due=datetime.utcnow() + timedelta(days=1),
                ),
                models.Equipment(
                    name="Haul Truck HT-330",
                    equipment_type=models.EquipmentType.HAUL_TRUCK,
                    status=models.EquipmentStatus.OPERATIONAL,
                    site_location="Pit A - North Zone",
                    manufacturer="Komatsu",
                    model_number="930E",
                    serial_number="SN-HT330",
                    health_score=88.0,
                    operating_hours=2100.75,
                    fuel_level_pct=63.5,
                    temperature_celsius=58.0,
                    last_maintenance_date=datetime.utcnow() - timedelta(days=15),
                    next_maintenance_due=datetime.utcnow() + timedelta(days=45),
                ),
                models.Equipment(
                    name="Loader LD-410",
                    equipment_type=models.EquipmentType.LOADER,
                    status=models.EquipmentStatus.BREAKDOWN,
                    site_location="Processing Plant",
                    manufacturer="Volvo",
                    model_number="L350H",
                    serial_number="SN-LD410",
                    health_score=32.0,
                    operating_hours=4890.0,
                    fuel_level_pct=12.0,
                    temperature_celsius=89.5,
                    last_maintenance_date=datetime.utcnow() - timedelta(days=60),
                    next_maintenance_due=datetime.utcnow() - timedelta(days=5),
                ),
                models.Equipment(
                    name="Conveyor CV-050",
                    equipment_type=models.EquipmentType.CONVEYOR,
                    status=models.EquipmentStatus.IDLE,
                    site_location="Processing Plant",
                    manufacturer="Metso",
                    model_number="MX-3000",
                    serial_number="SN-CV050",
                    health_score=95.0,
                    operating_hours=980.0,
                    fuel_level_pct=100.0,
                    temperature_celsius=30.1,
                    last_maintenance_date=datetime.utcnow() - timedelta(days=5),
                    next_maintenance_due=datetime.utcnow() + timedelta(days=85),
                ),
            ]
            db.add_all(equipment_items)
            db.commit()

        if db.query(models.Worker).count() == 0:
            workers = [
                models.Worker(
                    employee_code="EMP-1001",
                    full_name="Ravi Kumar",
                    role="Excavator Operator",
                    site_location="Pit A - North Zone",
                    status=models.WorkerStatus.ON_DUTY,
                    contact_number="+91-9000000001",
                    helmet_sensor_id="HLM-001",
                    heart_rate_bpm=78,
                    body_temperature_c=36.8,
                    gas_exposure_ppm=12.0,
                    current_zone="Zone A-1",
                ),
                models.Worker(
                    employee_code="EMP-1002",
                    full_name="Anita Sharma",
                    role="Site Supervisor",
                    site_location="Pit B - South Zone",
                    status=models.WorkerStatus.ON_DUTY,
                    contact_number="+91-9000000002",
                    helmet_sensor_id="HLM-002",
                    heart_rate_bpm=85,
                    body_temperature_c=37.1,
                    gas_exposure_ppm=18.5,
                    current_zone="Zone B-2",
                ),
                models.Worker(
                    employee_code="EMP-1003",
                    full_name="Mohammed Iqbal",
                    role="Drill Technician",
                    site_location="Pit B - South Zone",
                    status=models.WorkerStatus.EMERGENCY,
                    contact_number="+91-9000000003",
                    helmet_sensor_id="HLM-003",
                    heart_rate_bpm=142,
                    body_temperature_c=38.9,
                    gas_exposure_ppm=95.0,
                    current_zone="Zone B-3",
                ),
                models.Worker(
                    employee_code="EMP-1004",
                    full_name="Sunita Devi",
                    role="Haul Truck Driver",
                    site_location="Pit A - North Zone",
                    status=models.WorkerStatus.ON_BREAK,
                    contact_number="+91-9000000004",
                    helmet_sensor_id="HLM-004",
                    heart_rate_bpm=72,
                    body_temperature_c=36.6,
                    gas_exposure_ppm=8.0,
                    current_zone="Rest Area",
                ),
                models.Worker(
                    employee_code="EMP-1005",
                    full_name="Vikram Singh",
                    role="Maintenance Engineer",
                    site_location="Processing Plant",
                    status=models.WorkerStatus.OFF_DUTY,
                    contact_number="+91-9000000005",
                    helmet_sensor_id="HLM-005",
                    heart_rate_bpm=None,
                    body_temperature_c=None,
                    gas_exposure_ppm=None,
                    current_zone=None,
                ),
            ]
            db.add_all(workers)
            db.commit()

            # Sample incident tied to the emergency worker
            emergency_worker = (
                db.query(models.Worker)
                .filter(models.Worker.employee_code == "EMP-1003")
                .first()
            )
            if emergency_worker:
                incident = models.SafetyIncident(
                    worker_id=emergency_worker.id,
                    incident_type="Gas Exposure",
                    severity=models.SafetyIncidentSeverity.CRITICAL,
                    description="Elevated gas exposure and heart rate detected via helmet sensor.",
                    location="Zone B-3",
                    resolved=False,
                )
                db.add(incident)
                db.commit()
    finally:
        db.close()


@app.on_event("startup")
def on_startup():
    seed_dummy_data()
