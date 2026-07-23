"""
Mining Intelligence Platform — Rock Classification API Endpoints
"""
import uuid
from datetime import datetime
import asyncio
import io
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, BackgroundTasks
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func
from PIL import Image
from typing import Optional

from app.core.database import get_db, classification_history_collection, AsyncSessionLocal
import cloudinary
import cloudinary.uploader
from app.core.config import get_settings
from app.models.db_models import ClassificationResult
from app.services.classifier import RockClassifier

def generate_ai_explanation(rock_class: str) -> str:
    """AI explanation for the rock classification, simulating Grok/Gemini."""
    explanations = {
        "Basalt": "Basalt is a dark-colored, fine-grained, igneous rock composed mainly of plagioclase and pyroxene. Its presence indicates past volcanic activity. In mining operations, basalt is extremely hard and requires high-energy drill-and-blast parameters.",
        "Coal": "Coal is a combustible black sedimentary rock. It is carbon-rich and highly valuable for energy production. Safety protocols MUST strictly account for combustible coal dust and potential methane gas pockets during extraction.",
        "Granite": "Granite is a coarse-grained intrusive igneous rock. It is known for its high compressive strength and durability, making it challenging for excavation and highly abrasive on crusher wear parts.",
        "Limestone": "Limestone is a sedimentary rock composed primarily of calcium carbonate. It is crucial for cement production. It generally possesses moderate hardness, making fragmentation easier than igneous variants.",
        "Marble": "Marble is a metamorphic rock composed of recrystallized carbonate minerals. Its crystalline structure makes it highly sought after for dimension stone, requiring precise, non-explosive extraction techniques.",
        "Quartzite": "Quartzite is a hard, non-foliated metamorphic rock. It is notoriously abrasive to drill bits and crushing equipment, requiring heavy-duty tungsten carbide tooling and frequent maintenance.",
        "Sandstone": "Sandstone is a clastic sedimentary rock. Its porosity makes it a common reservoir rock, with moderate blastability. Watch for silica dust generation during drilling and crushing."
    }
    return explanations.get(rock_class, f"Detailed geological analysis for {rock_class} indicates standard properties. Consult engineers for specific parameters.")

settings = get_settings()
router = APIRouter(prefix="/classify", tags=["Rock Classification"])

async def save_classification_background(
    contents: bytes,
    gradcam_bytes: bytes,
    filename: str,
    timestamp: str,
    unique_id: str,
    result: dict,
    gps_latitude: float,
    gps_longitude: float,
    mine_name: str,
    region: str,
    operator_name: str,
    device_id: str,
    notes: str,
):
    """Background task to handle Cloudinary uploads and Database inserts."""
    original_key = f"originals/{timestamp}_{unique_id}_{filename}"
    gradcam_key = f"gradcam/{timestamp}_{unique_id}_gradcam.png"
    
    # 1. Upload to Cloudinary concurrently
    try:
        if settings.CLOUDINARY_URL:
            orig_task = asyncio.to_thread(
                cloudinary.uploader.upload,
                contents,
                folder="rock-images/originals",
                public_id=f"{timestamp}_{unique_id}_{filename.split('.')[0]}"
            )
            grad_task = asyncio.to_thread(
                cloudinary.uploader.upload,
                gradcam_bytes,
                folder="rock-images/gradcam",
                public_id=f"{timestamp}_{unique_id}_gradcam"
            )
            orig_upload, grad_upload = await asyncio.gather(orig_task, grad_task)
            original_key = orig_upload.get("secure_url")
            gradcam_key = grad_upload.get("secure_url")
    except Exception as e:
        original_key = f"local_{unique_id}"
        gradcam_key = f"local_gradcam_{unique_id}"
        print(f"[Warning] Background Cloudinary storage failed: {e}")

    # 2. Save to PostgreSQL
    async with AsyncSessionLocal() as db:
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
            db_id = str(db_result.id)
        except Exception as e:
            print(f"[Warning] Background DB save failed: {e}")
            db_id = unique_id

    # 3. Log to MongoDB telemetry
    try:
        await classification_history_collection.insert_one({
            "result_id": db_id,
            "predicted_class": result["predicted_class"],
            "confidence": result["confidence"],
            "mine_name": mine_name,
            "region": region,
            "timestamp": datetime.utcnow(),
        })
    except Exception:
        pass


@router.post("/", summary="Classify a rock image")
async def classify_rock(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(..., description="Rock image file (JPEG/PNG)"),
    mine_name: Optional[str] = Form(None),
    region: Optional[str] = Form(None),
    gps_latitude: Optional[float] = Form(None),
    gps_longitude: Optional[float] = Form(None),
    operator_name: Optional[str] = Form(None),
    device_id: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
):
    """
    Upload a rock image for AI classification.
    Returns predicted class and delegates network I/O to background tasks.
    """
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        raise HTTPException(status_code=400, detail="Only JPEG/PNG images are supported.")
    
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    classifier = RockClassifier.get_instance()
    result = classifier.classify(image)
    gradcam_bytes = classifier.generate_gradcam(image, result["predicted_class"])
    
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    unique_id = str(uuid.uuid4())[:8]
    
    # Delegate slow network uploads and database saves to a background task
    background_tasks.add_task(
        save_classification_background,
        contents,
        gradcam_bytes,
        file.filename,
        timestamp,
        unique_id,
        result,
        gps_latitude,
        gps_longitude,
        mine_name,
        region,
        operator_name,
        device_id,
        notes
    )
    
    # Return immediately to the frontend!
    ai_explanation = generate_ai_explanation(result["predicted_class"])
    
    return {
        "status": "success",
        "data": {
            "id": unique_id,
            "predicted_class": result["predicted_class"],
            "confidence": result["confidence"],
            "all_probabilities": result["all_probabilities"],
            "gradcam_available": True,
            "ai_explanation": ai_explanation,
            "metadata": {
                "mine_name": mine_name,
                "region": region,
                "gps_latitude": gps_latitude,
                "gps_longitude": gps_longitude,
                "operator_name": operator_name,
                "device_id": device_id,
                "notes": notes,
            }
        }
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
