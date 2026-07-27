

from dataclasses import dataclass, field
from typing import List

from .models import Worker, WorkerStatus

HEART_RATE_NORMAL_MIN = 60
HEART_RATE_NORMAL_MAX = 100
HEART_RATE_ELEVATED_MAX = 120
HEART_RATE_CRITICAL = 140

BODY_TEMP_NORMAL_MAX = 37.5
BODY_TEMP_ELEVATED_MAX = 38.5
BODY_TEMP_CRITICAL = 39.5

GAS_EXPOSURE_SAFE_MAX = 25.0    
GAS_EXPOSURE_ELEVATED_MAX = 50.0  
GAS_EXPOSURE_CRITICAL = 100.0    


@dataclass
class RiskAssessment:
    risk_score: float 
    risk_level: str  
    contributing_factors: List[str] = field(default_factory=list)


@dataclass
class SafetyRecommendation:
    priority: str  
    actions: List[str] = field(default_factory=list)
    escalate: bool = False


class WorkerAIService:
   

    @staticmethod
    def calculate_risk_score(worker: Worker) -> RiskAssessment:
        score = 0.0
        factors: List[str] = []

        
        hr = worker.heart_rate_bpm
        if hr is not None:
            if hr >= HEART_RATE_CRITICAL:
                score += 35
                factors.append(f"Critical heart rate ({hr} bpm)")
            elif hr >= HEART_RATE_ELEVATED_MAX:
                score += 20
                factors.append(f"Elevated heart rate ({hr} bpm)")
            elif hr > HEART_RATE_NORMAL_MAX or hr < HEART_RATE_NORMAL_MIN:
                score += 8
                factors.append(f"Heart rate outside normal range ({hr} bpm)")

      
        temp = worker.body_temperature_c
        if temp is not None:
            if temp >= BODY_TEMP_CRITICAL:
                score += 30
                factors.append(f"Critical body temperature ({temp}°C)")
            elif temp >= BODY_TEMP_ELEVATED_MAX:
                score += 18
                factors.append(f"Elevated body temperature ({temp}°C)")
            elif temp > BODY_TEMP_NORMAL_MAX:
                score += 8
                factors.append(f"Mild fever detected ({temp}°C)")

       
        gas = worker.gas_exposure_ppm
        if gas is not None:
            if gas >= GAS_EXPOSURE_CRITICAL:
                score += 35
                factors.append(f"Critical gas exposure level ({gas} ppm)")
            elif gas >= GAS_EXPOSURE_ELEVATED_MAX:
                score += 20
                factors.append(f"Elevated gas exposure level ({gas} ppm)")
            elif gas > GAS_EXPOSURE_SAFE_MAX:
                score += 8
                factors.append(f"Gas exposure above safe threshold ({gas} ppm)")

       
        if worker.status == WorkerStatus.EMERGENCY:
            score += 25
            factors.append("Worker flagged in emergency status")
        elif worker.status == WorkerStatus.EVACUATED:
            score += 10
            factors.append("Worker under evacuation status")

        score = max(0.0, min(100.0, round(score, 2)))
        risk_level = WorkerAIService._risk_level_from_score(score)

        return RiskAssessment(
            risk_score=score,
            risk_level=risk_level,
            contributing_factors=factors or ["All vitals and environmental readings within safe limits"],
        )

    @staticmethod
    def _risk_level_from_score(score: float) -> str:
        if score <= 0:
            return "safe"
        if score <= 15:
            return "low"
        if score <= 40:
            return "moderate"
        if score <= 70:
            return "high"
        return "critical"

  
    @staticmethod
    def recommend_actions(worker: Worker) -> SafetyRecommendation:
        assessment = WorkerAIService.calculate_risk_score(worker)
        actions: List[str] = []
        escalate = False

        if assessment.risk_level == "critical":
            priority = "immediate"
            escalate = True
            actions.append("Dispatch emergency response team to worker's current zone immediately")
            actions.append("Initiate evacuation protocol if gas exposure is the trigger")
            actions.append("Establish direct communication with the worker")
        elif assessment.risk_level == "high":
            priority = "high"
            escalate = True
            actions.append("Alert site supervisor and nearest safety officer")
            actions.append("Instruct worker to move to a designated safe zone")
            actions.append("Increase monitoring frequency for this worker")
        elif assessment.risk_level == "moderate":
            priority = "medium"
            actions.append("Notify shift supervisor for awareness")
            actions.append("Recommend a short rest break and hydration check")
        elif assessment.risk_level == "low":
            priority = "low"
            actions.append("Continue routine monitoring")
        else:
            priority = "none"
            actions.append("No action required; conditions normal")

        
        if worker.gas_exposure_ppm is not None and worker.gas_exposure_ppm >= GAS_EXPOSURE_ELEVATED_MAX:
            actions.append("Verify ventilation systems and gas detection equipment in the zone")

        
        if worker.body_temperature_c is not None and worker.body_temperature_c >= BODY_TEMP_ELEVATED_MAX:
            actions.append("Check for signs of heat stress and provide cooling measures")

        
        if worker.heart_rate_bpm is not None and worker.heart_rate_bpm >= HEART_RATE_ELEVATED_MAX:
            actions.append("Assess for physical exertion or cardiac distress")

        return SafetyRecommendation(priority=priority, actions=actions, escalate=escalate)

  
    @staticmethod
    def full_assessment(worker: Worker) -> dict:
        risk = WorkerAIService.calculate_risk_score(worker)
        recommendation = WorkerAIService.recommend_actions(worker)

        return {
            "worker_id": worker.id,
            "risk": {
                "score": risk.risk_score,
                "level": risk.risk_level,
                "factors": risk.contributing_factors,
            },
            "recommendation": {
                "priority": recommendation.priority,
                "actions": recommendation.actions,
                "escalate": recommendation.escalate,
            },
        }
