"""
Mining Intelligence Platform — Rock Classification API Endpoints
"""
import uuid
import io
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func
from PIL import Image
from typing import Optional

from app.core.database import get_db, minio_client, classification_history_collection
from app.core.config import get_settings
from app.models.db_models import ClassificationResult
from app.services.classifier import RockClassifier

settings = get_settings()
router = APIRouter(prefix="/classify", tags=["Rock Classification"])


@router.post("/", summary="Classify a rock image")
async def classify_rock(
    file: UploadFile = File(..., description="Rock image file (JPEG/PNG)"),
    mine_name: Optional[str] = Form(None),
    region: Optional[str] = Form(None),
    gps_latitude: Optional[float] = Form(None),
    gps_longitude: Optional[float] = Form(None),
    operator_name: Optional[str] = Form(None),
    device_id: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db),
):
    """
    Upload a rock image for AI classification.
    Returns predicted class, confidence scores, and Grad-CAM heatmap.
    """
    # Validate file type
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        raise HTTPException(status_code=400, detail="Only JPEG/PNG images are supported.")
    
    # Read image
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    # Get classifier instance
    classifier = RockClassifier.get_instance()
    
    # Run classification
    result = classifier.classify(image)
    
    # Generate Grad-CAM heatmap
    gradcam_bytes = classifier.generate_gradcam(image, result["predicted_class"])
    
    # Generate unique keys for MinIO storage
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    unique_id = str(uuid.uuid4())[:8]
    original_key = f"originals/{timestamp}_{unique_id}_{file.filename}"
    gradcam_key = f"gradcam/{timestamp}_{unique_id}_gradcam.png"
    
    # Upload to MinIO
    try:
        minio_client.put_object(
            settings.MINIO_BUCKET,
            original_key,
            io.BytesIO(contents),
            length=len(contents),
            content_type=file.content_type,
        )
        minio_client.put_object(
            settings.MINIO_BUCKET,
            gradcam_key,
            io.BytesIO(gradcam_bytes),
            length=len(gradcam_bytes),
            content_type="image/png",
        )
    except Exception as e:
        # If MinIO is not available, continue without storage
        original_key = f"local_{unique_id}"
        gradcam_key = f"local_gradcam_{unique_id}"
        print(f"[Warning] MinIO storage failed: {e}")
    
    # Save to PostgreSQL
    db_result = ClassificationResult(
        predicted_class=result["predicted_class"],
        confidence=result["confidence"],
        all_probabilities=result["all_probabilities"],
        original_image_key=original_key,
        gradcam_image_key=gradcam_key,
        gps_latitude=gps_latitude,
        gps_longitude=gps_longitude,
        mine_name=mine_name,
        region=region,
        operator_name=operator_name,
        device_id=device_id,
        notes=notes,
    )
    
    try:
        db.add(db_result)
        await db.commit()
        await db.refresh(db_result)
    except Exception as e:
        # If DB is not available, create a temporary response
        print(f"[Warning] Database save failed: {e}")
        return {
            "status": "success",
            "data": {
                "id": unique_id,
                **result,
                "metadata": {
                    "mine_name": mine_name,
                    "region": region,
                    "gps_latitude": gps_latitude,
                    "gps_longitude": gps_longitude,
                    "operator_name": operator_name,
                    "device_id": device_id,
                },
                "gradcam_available": True,
            }
        }
    
    # Log to MongoDB telemetry
    try:
        await classification_history_collection.insert_one({
            "result_id": str(db_result.id),
            "predicted_class": result["predicted_class"],
            "confidence": result["confidence"],
            "mine_name": mine_name,
            "region": region,
            "timestamp": datetime.utcnow(),
        })
    except Exception:
        pass  # Non-critical telemetry logging
    
    return {
        "status": "success",
        "data": db_result.to_dict(),
    }


@router.get("/results", summary="Get classification history")
async def get_results(
    page: int = 1,
    limit: int = 20,
    mine_name: Optional[str] = None,
    region: Optional[str] = None,
    predicted_class: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """Retrieve paginated classification results with optional filters."""
    query = select(ClassificationResult).order_by(desc(ClassificationResult.classified_at))
    
    if mine_name:
        query = query.where(ClassificationResult.mine_name.ilike(f"%{mine_name}%"))
    if region:
        query = query.where(ClassificationResult.region.ilike(f"%{region}%"))
    if predicted_class:
        query = query.where(ClassificationResult.predicted_class == predicted_class)
    
    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Paginate
    offset = (page - 1) * limit
    query = query.offset(offset).limit(limit)
    result = await db.execute(query)
    records = result.scalars().all()
    
    return {
        "status": "success",
        "data": [r.to_dict() for r in records],
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "pages": (total + limit - 1) // limit if total else 0,
        }
    }


@router.get("/results/{result_id}", summary="Get a specific classification result")
async def get_result(result_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve a specific classification result by ID."""
    query = select(ClassificationResult).where(ClassificationResult.id == result_id)
    result = await db.execute(query)
    record = result.scalar_one_or_none()
    
    if not record:
        raise HTTPException(status_code=404, detail="Classification result not found.")
    
    return {"status": "success", "data": record.to_dict()}


@router.get("/stats", summary="Get classification statistics")
async def get_stats(db: AsyncSession = Depends(get_db)):
    """Get aggregate statistics for the dashboard."""
    try:
        # Total classifications
        total_query = select(func.count()).select_from(ClassificationResult)
        total_result = await db.execute(total_query)
        total = total_result.scalar() or 0
        
        # Class distribution
        class_query = (
            select(
                ClassificationResult.predicted_class,
                func.count().label("count"),
                func.avg(ClassificationResult.confidence).label("avg_confidence"),
            )
            .group_by(ClassificationResult.predicted_class)
            .order_by(desc("count"))
        )
        class_result = await db.execute(class_query)
        distribution = [
            {
                "class_name": row.predicted_class,
                "count": row.count,
                "avg_confidence": round(float(row.avg_confidence), 4),
            }
            for row in class_result.all()
        ]
        
        return {
            "status": "success",
            "data": {
                "total_classifications": total,
                "class_distribution": distribution,
            }
        }
    except Exception:
        return {
            "status": "success",
            "data": {
                "total_classifications": 0,
                "class_distribution": [],
            }
        }
