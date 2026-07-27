

from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from sqlalchemy.orm import Session

from . import models
from . import schemas
from .database import get_db, get_mongo_db
from .worker_ai import WorkerAIService

router = APIRouter(prefix="/api/v1/workers", tags=["Worker Safety"])



@router.post("", response_model=schemas.WorkerOut, status_code=status.HTTP_201_CREATED)
def create_worker(payload: schemas.WorkerCreate, db: Session = Depends(get_db)):
    existing = (
        db.query(models.Worker)
        .filter(models.Worker.employee_code == payload.employee_code)
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="Employee code already exists")

    worker = models.Worker(**payload.model_dump())
    db.add(worker)
    db.commit()
    db.refresh(worker)
    return worker


@router.get("", response_model=List[schemas.WorkerOut])
def list_workers(
    db: Session = Depends(get_db),
    status_filter: Optional[models.WorkerStatus] = Query(default=None, alias="status"),
    site_location: Optional[str] = None,
    role: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
):
    query = db.query(models.Worker).filter(models.Worker.is_active == True)  # noqa: E712

    if status_filter:
        query = query.filter(models.Worker.status == status_filter)
    if site_location:
        query = query.filter(models.Worker.site_location.ilike(f"%{site_location}%"))
    if role:
        query = query.filter(models.Worker.role.ilike(f"%{role}%"))

    return query.offset(skip).limit(limit).all()


@router.get("/stats/summary")
def worker_safety_summary(db: Session = Depends(get_db)):
    total = db.query(models.Worker).filter(models.Worker.is_active == True).count()  # noqa: E712
    by_status = {}
    for s in models.WorkerStatus:
        count = (
            db.query(models.Worker)
            .filter(models.Worker.is_active == True, models.Worker.status == s)  # noqa: E712
            .count()
        )
        by_status[s.value] = count

    open_incidents = (
        db.query(models.SafetyIncident).filter(models.SafetyIncident.resolved == False).count()  # noqa: E712
    )
    critical_incidents = (
        db.query(models.SafetyIncident)
        .filter(
            models.SafetyIncident.resolved == False,  # noqa: E712
            models.SafetyIncident.severity == models.SafetyIncidentSeverity.CRITICAL,
        )
        .count()
    )

    return {
        "total_workers": total,
        "by_status": by_status,
        "open_incidents": open_incidents,
        "critical_incidents": critical_incidents,
    }


@router.post(
    "/incidents", response_model=schemas.SafetyIncidentOut, status_code=status.HTTP_201_CREATED
)
def create_incident(payload: schemas.SafetyIncidentCreate, db: Session = Depends(get_db)):
    worker = db.query(models.Worker).filter(models.Worker.id == payload.worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    incident = models.SafetyIncident(**payload.model_dump())
    db.add(incident)

    if payload.severity in (
        models.SafetyIncidentSeverity.HIGH,
        models.SafetyIncidentSeverity.CRITICAL,
    ):
        worker.status = models.WorkerStatus.EMERGENCY

    db.commit()
    db.refresh(incident)
    return incident


@router.get("/incidents", response_model=List[schemas.SafetyIncidentOut])
def list_incidents(
    db: Session = Depends(get_db),
    severity: Optional[models.SafetyIncidentSeverity] = None,
    resolved: Optional[bool] = None,
    worker_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
):
    query = db.query(models.SafetyIncident)

    if severity:
        query = query.filter(models.SafetyIncident.severity == severity)
    if resolved is not None:
        query = query.filter(models.SafetyIncident.resolved == resolved)
    if worker_id:
        query = query.filter(models.SafetyIncident.worker_id == worker_id)

    return (
        query.order_by(models.SafetyIncident.reported_at.desc()).offset(skip).limit(limit).all()
    )


@router.get("/incidents/{incident_id}", response_model=schemas.SafetyIncidentOut)
def get_incident(incident_id: str, db: Session = Depends(get_db)):
    incident = (
        db.query(models.SafetyIncident).filter(models.SafetyIncident.id == incident_id).first()
    )
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident


@router.put("/incidents/{incident_id}", response_model=schemas.SafetyIncidentOut)
def update_incident(
    incident_id: str, payload: schemas.SafetyIncidentUpdate, db: Session = Depends(get_db)
):
    incident = (
        db.query(models.SafetyIncident).filter(models.SafetyIncident.id == incident_id).first()
    )
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(incident, field, value)

    if update_data.get("resolved") is True and incident.resolved_at is None:
        incident.resolved_at = datetime.utcnow()

    db.commit()
    db.refresh(incident)
    return incident


@router.delete("/incidents/{incident_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_incident(incident_id: str, db: Session = Depends(get_db)):
    incident = (
        db.query(models.SafetyIncident).filter(models.SafetyIncident.id == incident_id).first()
    )
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    db.delete(incident)
    db.commit()
    return None


@router.get("/{worker_id}", response_model=schemas.WorkerOut)
def get_worker(worker_id: str, db: Session = Depends(get_db)):
    worker = db.query(models.Worker).filter(models.Worker.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    return worker


@router.put("/{worker_id}", response_model=schemas.WorkerOut)
def update_worker(worker_id: str, payload: schemas.WorkerUpdate, db: Session = Depends(get_db)):
    worker = db.query(models.Worker).filter(models.Worker.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(worker, field, value)
    worker.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(worker)
    return worker


@router.delete("/{worker_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_worker(worker_id: str, db: Session = Depends(get_db)):
    worker = db.query(models.Worker).filter(models.Worker.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    worker.is_active = False
    db.commit()
    return None



@router.get("/{worker_id}/assessment")
def get_worker_assessment(worker_id: str, db: Session = Depends(get_db)):
    worker = db.query(models.Worker).filter(models.Worker.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    return WorkerAIService.full_assessment(worker)


@router.post("/safety-events", status_code=status.HTTP_201_CREATED)
async def ingest_safety_event(
    payload: schemas.SafetyEventLogIn,
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    doc = payload.model_dump()
    result = await mongo_db["safety_incident_logs"].insert_one(doc)
    return {"inserted_id": str(result.inserted_id)}


@router.get("/{worker_id}/safety-events")
async def get_safety_events(
    worker_id: str,
    limit: int = 50,
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    cursor = (
        mongo_db["safety_incident_logs"]
        .find({"worker_id": worker_id}, {"_id": 0})
        .sort("recorded_at", -1)
        .limit(limit)
    )
    records = await cursor.to_list(length=limit)
    return {"worker_id": worker_id, "count": len(records), "events": records}
