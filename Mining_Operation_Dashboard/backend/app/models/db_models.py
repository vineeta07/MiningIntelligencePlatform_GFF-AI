"""
Mining Intelligence Platform — PostgreSQL Data Models
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, JSON, Text
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base


class ClassificationResult(Base):
    """Stores individual rock classification results with geological metadata."""
    __tablename__ = "classification_results"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Classification Output
    predicted_class = Column(String(100), nullable=False, index=True)
    confidence = Column(Float, nullable=False)
    all_probabilities = Column(JSON, nullable=False)  # {class_name: probability}
    
    # Image References (MinIO)
    original_image_key = Column(String(500), nullable=False)
    gradcam_image_key = Column(String(500), nullable=True)
    
    # Geological Metadata
    gps_latitude = Column(Float, nullable=True)
    gps_longitude = Column(Float, nullable=True)
    mine_name = Column(String(200), nullable=True, index=True)
    region = Column(String(200), nullable=True, index=True)
    operator_name = Column(String(200), nullable=True)
    device_id = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    
    # Timestamps
    classified_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "predicted_class": self.predicted_class,
            "confidence": self.confidence,
            "all_probabilities": self.all_probabilities,
            "original_image_url": f"/api/v1/images/{self.original_image_key}",
            "gradcam_image_url": f"/api/v1/images/{self.gradcam_image_key}" if self.gradcam_image_key else None,
            "gps_latitude": self.gps_latitude,
            "gps_longitude": self.gps_longitude,
            "mine_name": self.mine_name,
            "region": self.region,
            "operator_name": self.operator_name,
            "device_id": self.device_id,
            "notes": self.notes,
            "classified_at": self.classified_at.isoformat() if self.classified_at else None,
        }


class ProductionMetric(Base):
    """Stores daily production metrics for the operations dashboard."""
    __tablename__ = "production_metrics"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    metric_date = Column(DateTime, nullable=False, index=True)
    
    # Production KPIs
    daily_tonnage = Column(Float, default=0.0)
    mine_utilization = Column(Float, default=0.0)       # percentage
    ore_grade = Column(Float, default=0.0)               # percentage purity
    equipment_health = Column(Float, default=0.0)        # percentage operational
    energy_consumption_kwh = Column(Float, default=0.0)
    carbon_footprint_tons = Column(Float, default=0.0)
    
    # Machine metrics
    machine_utilization = Column(Float, default=0.0)
    fuel_consumption_liters = Column(Float, default=0.0)
    downtime_hours = Column(Float, default=0.0)
    ore_recovery_yield = Column(Float, default=0.0)
    
    # Safety
    active_safety_incidents = Column(Float, default=0.0)
    risk_index = Column(Float, default=0.0)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
