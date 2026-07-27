

from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from sqlalchemy.orm import Session

from . import models
from . import schemas
from .database import get_db, get_mongo_db
from .equipment_ai import EquipmentAIService

router = APIRouter(prefix="/api/v1/equipment", tags=["Equipment Monitoring"])



@router.post("", response_model=schemas.EquipmentOut, status_code=status.HTTP_201_CREATED)
def create_equipment(payload: schemas.EquipmentCreate, db: Session = Depends(get_db)):
    if payload.serial_number:
        existing = (
            db.query(models.Equipment)
            .filter(models.Equipment.serial_number == payload.serial_number)
            .first()
        )
        if existing:
            raise HTTPException(status_code=400, detail="Serial number already exists")

    equipment = models.Equipment(**payload.model_dump())
    db.add(equipment)
    db.commit()
    db.refresh(equipment)
    return equipment


@router.get("", response_model=List[schemas.EquipmentOut])
def list_equipment(
    db: Session = Depends(get_db),
    status_filter: Optional[models.EquipmentStatus] = Query(default=None, alias="status"),
    equipment_type: Optional[models.EquipmentType] = None,
    site_location: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
):
    query = db.query(models.Equipment).filter(models.Equipment.is_active == True)  # noqa: E712

    if status_filter:
        query = query.filter(models.Equipment.status == status_filter)
    if equipment_type:
        query = query.filter(models.Equipment.equipment_type == equipment_type)
    if site_location:
        query = query.filter(models.Equipment.site_location.ilike(f"%{site_location}%"))

    return query.offset(skip).limit(limit).all()



@router.get("/stats/summary")
def equipment_summary(db: Session = Depends(get_db)):
    total = db.query(models.Equipment).filter(models.Equipment.is_active == True).count()  # noqa: E712
    by_status = {}
    for s in models.EquipmentStatus:
        count = (
            db.query(models.Equipment)
            .filter(models.Equipment.is_active == True, models.Equipment.status == s)  # noqa: E712
            .count()
        )
        by_status[s.value] = count

    avg_health = (
        db.query(models.Equipment)
        .filter(models.Equipment.is_active == True)  # noqa: E712
        .with_entities(models.Equipment.health_score)
        .all()
    )
    avg_health_score = (
        sum(h[0] for h in avg_health) / len(avg_health) if avg_health else 0.0
    )

    return {
        "total_equipment": total,
        "by_status": by_status,
        "average_health_score": round(avg_health_score, 2),
    }


@router.get("/{equipment_id}", response_model=schemas.EquipmentOut)
def get_equipment(equipment_id: str, db: Session = Depends(get_db)):
    equipment = db.query(models.Equipment).filter(models.Equipment.id == equipment_id).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return equipment


@router.put("/{equipment_id}", response_model=schemas.EquipmentOut)
def update_equipment(
    equipment_id: str, payload: schemas.EquipmentUpdate, db: Session = Depends(get_db)
):
    equipment = db.query(models.Equipment).filter(models.Equipment.id == equipment_id).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(equipment, field, value)
    equipment.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(equipment)
    return equipment


@router.delete("/{equipment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_equipment(equipment_id: str, db: Session = Depends(get_db)):
    equipment = db.query(models.Equipment).filter(models.Equipment.id == equipment_id).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")

    equipment.is_active = False
    db.commit()
    return None



@router.get("/{equipment_id}/assessment")
def get_equipment_assessment(equipment_id: str, db: Session = Depends(get_db)):
    equipment = db.query(models.Equipment).filter(models.Equipment.id == equipment_id).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")

    return EquipmentAIService.full_assessment(equipment)


@router.post(
    "/{equipment_id}/maintenance-logs",
    response_model=schemas.MaintenanceLogOut,
    status_code=status.HTTP_201_CREATED,
)
def add_maintenance_log(
    equipment_id: str, payload: schemas.MaintenanceLogCreate, db: Session = Depends(get_db)
):
    equipment = db.query(models.Equipment).filter(models.Equipment.id == equipment_id).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")

    log = models.MaintenanceLog(equipment_id=equipment_id, **payload.model_dump())
    db.add(log)

    equipment.last_maintenance_date = log.performed_at
    equipment.status = models.EquipmentStatus.OPERATIONAL

    db.commit()
    db.refresh(log)
    return log


@router.get("/{equipment_id}/maintenance-logs", response_model=List[schemas.MaintenanceLogOut])
def list_maintenance_logs(equipment_id: str, db: Session = Depends(get_db)):
    equipment = db.query(models.Equipment).filter(models.Equipment.id == equipment_id).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")

    return (
        db.query(models.MaintenanceLog)
        .filter(models.MaintenanceLog.equipment_id == equipment_id)
        .order_by(models.MaintenanceLog.performed_at.desc())
        .all()
    )



@router.post("/telemetry", status_code=status.HTTP_201_CREATED)
async def ingest_telemetry(
    payload: schemas.EquipmentTelemetryIn,
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    doc = payload.model_dump()
    result = await mongo_db["equipment_telemetry"].insert_one(doc)
    return {"inserted_id": str(result.inserted_id)}


@router.get("/{equipment_id}/telemetry")
async def get_telemetry(
    equipment_id: str,
    limit: int = 50,
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    cursor = (
        mongo_db["equipment_telemetry"]
        .find({"equipment_id": equipment_id}, {"_id": 0})
        .sort("recorded_at", -1)
        .limit(limit)
    )
    records = await cursor.to_list(length=limit)
    return {"equipment_id": equipment_id, "count": len(records), "telemetry": records}
