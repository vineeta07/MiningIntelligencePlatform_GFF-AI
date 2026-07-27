

from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional

from .models import Equipment, EquipmentStatus


IDEAL_OPERATING_TEMP_C = 60.0
MAX_SAFE_TEMP_C = 95.0
CRITICAL_TEMP_C = 110.0

LOW_FUEL_THRESHOLD_PCT = 15.0
CRITICAL_FUEL_THRESHOLD_PCT = 5.0

HIGH_HOURS_THRESHOLD = 4000.0
CRITICAL_HOURS_THRESHOLD = 6000.0

MAINTENANCE_OVERDUE_HEALTH_PENALTY = 15.0

EXPECTED_LIFETIME_HOURS = 8000.0  


@dataclass
class HealthAssessment:
    health_score: float
    risk_level: str
    contributing_factors: List[str] = field(default_factory=list)


@dataclass
class MaintenancePrediction:
    maintenance_required: bool
    urgency: str  
    recommended_action: str
    reasons: List[str] = field(default_factory=list)
    predicted_days_until_required: Optional[int] = None


@dataclass
class RULEstimate:
    remaining_useful_life_hours: float
    remaining_useful_life_days: float
    confidence: str 
    basis: str


class EquipmentAIService:
    """Stateless rule-based inference engine for equipment intelligence."""

   
    @staticmethod
    def calculate_health_score(equipment: Equipment) -> HealthAssessment:
        score = 100.0
        factors: List[str] = []

       
        temp = equipment.temperature_celsius or IDEAL_OPERATING_TEMP_C
        if temp >= CRITICAL_TEMP_C:
            score -= 35
            factors.append(f"Critical operating temperature ({temp}°C)")
        elif temp >= MAX_SAFE_TEMP_C:
            score -= 20
            factors.append(f"Elevated operating temperature ({temp}°C)")
        elif temp > IDEAL_OPERATING_TEMP_C:
            excess = temp - IDEAL_OPERATING_TEMP_C
            score -= min(10, excess * 0.3)
            factors.append(f"Above-ideal temperature ({temp}°C)")

        
        fuel = equipment.fuel_level_pct if equipment.fuel_level_pct is not None else 100.0
        if fuel <= CRITICAL_FUEL_THRESHOLD_PCT:
            score -= 10
            factors.append(f"Critically low fuel ({fuel}%)")
        elif fuel <= LOW_FUEL_THRESHOLD_PCT:
            score -= 5
            factors.append(f"Low fuel level ({fuel}%)")

        
        hours = equipment.operating_hours or 0.0
        if hours >= CRITICAL_HOURS_THRESHOLD:
            score -= 20
            factors.append(f"Very high accumulated operating hours ({hours:.0f}h)")
        elif hours >= HIGH_HOURS_THRESHOLD:
            score -= 10
            factors.append(f"High accumulated operating hours ({hours:.0f}h)")

        
        if equipment.next_maintenance_due and equipment.next_maintenance_due < datetime.utcnow():
            score -= MAINTENANCE_OVERDUE_HEALTH_PENALTY
            days_overdue = (datetime.utcnow() - equipment.next_maintenance_due).days
            factors.append(f"Maintenance overdue by {days_overdue} day(s)")

        
        if equipment.status == EquipmentStatus.BREAKDOWN:
            score -= 30
            factors.append("Equipment currently in breakdown state")
        elif equipment.status == EquipmentStatus.MAINTENANCE:
            score -= 10
            factors.append("Equipment currently under maintenance")
        elif equipment.status == EquipmentStatus.OFFLINE:
            score -= 15
            factors.append("Equipment offline")

        score = max(0.0, min(100.0, round(score, 2)))
        risk_level = EquipmentAIService._risk_level_from_score(score)

        return HealthAssessment(
            health_score=score,
            risk_level=risk_level,
            contributing_factors=factors or ["No significant risk factors detected"],
        )

    @staticmethod
    def _risk_level_from_score(score: float) -> str:
        if score >= 85:
            return "low"
        if score >= 65:
            return "moderate"
        if score >= 40:
            return "high"
        return "critical"

   
    @staticmethod
    def predict_maintenance(equipment: Equipment) -> MaintenancePrediction:
        reasons: List[str] = []
        urgency = "none"
        maintenance_required = False
        predicted_days: Optional[int] = None

        health = EquipmentAIService.calculate_health_score(equipment)

       
        if equipment.next_maintenance_due:
            delta_days = (equipment.next_maintenance_due - datetime.utcnow()).days
            if delta_days < 0:
                urgency = "critical"
                maintenance_required = True
                predicted_days = 0
                reasons.append(f"Scheduled maintenance overdue by {abs(delta_days)} day(s)")
            elif delta_days <= 3:
                urgency = "high"
                maintenance_required = True
                predicted_days = delta_days
                reasons.append(f"Scheduled maintenance due in {delta_days} day(s)")
            elif delta_days <= 14:
                urgency = "medium"
                maintenance_required = True
                predicted_days = delta_days
                reasons.append(f"Scheduled maintenance approaching in {delta_days} day(s)")

        
        if health.risk_level == "critical":
            urgency = "critical"
            maintenance_required = True
            predicted_days = 0 if predicted_days is None else min(predicted_days, 0)
            reasons.append("Health score indicates critical equipment condition")
        elif health.risk_level == "high" and urgency not in ("critical",):
            urgency = "high"
            maintenance_required = True
            predicted_days = predicted_days if predicted_days is not None else 2
            reasons.append("Health score indicates high risk of failure")
        elif health.risk_level == "moderate" and urgency in ("none",):
            urgency = "low"
            reasons.append("Health score shows early signs of degradation")

        
        if equipment.status == EquipmentStatus.BREAKDOWN:
            urgency = "critical"
            maintenance_required = True
            predicted_days = 0
            reasons.append("Equipment is currently in breakdown state")

        if not reasons:
            reasons.append("No maintenance triggers detected; equipment operating within normal parameters")

        action_map = {
            "none": "Continue routine monitoring",
            "low": "Schedule a diagnostic inspection within the next maintenance cycle",
            "medium": "Plan maintenance within the next 1-2 weeks",
            "high": "Schedule maintenance within the next 48-72 hours",
            "critical": "Immediate maintenance intervention required; consider taking equipment offline",
        }

        return MaintenancePrediction(
            maintenance_required=maintenance_required,
            urgency=urgency,
            recommended_action=action_map[urgency],
            reasons=reasons,
            predicted_days_until_required=predicted_days,
        )

    
    @staticmethod
    def estimate_remaining_useful_life(equipment: Equipment) -> RULEstimate:
        hours_used = equipment.operating_hours or 0.0
        health = EquipmentAIService.calculate_health_score(equipment)

       
        baseline_remaining_hours = max(0.0, EXPECTED_LIFETIME_HOURS - hours_used)

      
        health_factor = health.health_score / 100.0
        adjusted_remaining_hours = baseline_remaining_hours * max(0.1, health_factor)

       
        temp = equipment.temperature_celsius or IDEAL_OPERATING_TEMP_C
        if temp >= MAX_SAFE_TEMP_C:
            adjusted_remaining_hours *= 0.75
        elif temp > IDEAL_OPERATING_TEMP_C:
            adjusted_remaining_hours *= 0.9

       
        remaining_days = adjusted_remaining_hours / 8.0

        if health.risk_level in ("low",) and hours_used < HIGH_HOURS_THRESHOLD:
            confidence = "high"
        elif health.risk_level in ("moderate", "high"):
            confidence = "medium"
        else:
            confidence = "low"

        basis = (
            f"Baseline design life {EXPECTED_LIFETIME_HOURS:.0f}h, "
            f"{hours_used:.0f}h consumed, health factor {health_factor:.2f}, "
            f"temperature {temp}°C"
        )

        return RULEstimate(
            remaining_useful_life_hours=round(adjusted_remaining_hours, 2),
            remaining_useful_life_days=round(remaining_days, 1),
            confidence=confidence,
            basis=basis,
        )

   
    @staticmethod
    def full_assessment(equipment: Equipment) -> dict:
        health = EquipmentAIService.calculate_health_score(equipment)
        maintenance = EquipmentAIService.predict_maintenance(equipment)
        rul = EquipmentAIService.estimate_remaining_useful_life(equipment)

        return {
            "equipment_id": equipment.id,
            "health": {
                "score": health.health_score,
                "risk_level": health.risk_level,
                "factors": health.contributing_factors,
            },
            "predictive_maintenance": {
                "maintenance_required": maintenance.maintenance_required,
                "urgency": maintenance.urgency,
                "recommended_action": maintenance.recommended_action,
                "reasons": maintenance.reasons,
                "predicted_days_until_required": maintenance.predicted_days_until_required,
            },
            "remaining_useful_life": {
                "hours": rul.remaining_useful_life_hours,
                "days": rul.remaining_useful_life_days,
                "confidence": rul.confidence,
                "basis": rul.basis,
            },
        }
