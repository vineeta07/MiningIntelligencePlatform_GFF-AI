"""
Mining Intelligence Platform — Dashboard API Endpoints
Provides real-time KPIs and mocked telemetry data for the operations dashboard.
"""
import random
import math
import json
from datetime import datetime, timedelta
from fastapi import APIRouter
from groq import AsyncGroq
from app.core.config import get_settings

settings = get_settings()
groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY) if settings.GROQ_API_KEY else None

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


def _generate_production_data():
    """Generate realistic mock production data for the dashboard."""
    now = datetime.utcnow()
    base_tonnage = 12500
    
    return {
        "daily_tonnage": round(base_tonnage + random.uniform(-800, 1200), 1),
        "mine_utilization": round(random.uniform(72, 94), 1),
        "ore_grade": round(random.uniform(58, 78), 1),
        "equipment_health": round(random.uniform(82, 97), 1),
        "energy_consumption_kwh": round(random.uniform(45000, 68000), 0),
        "carbon_footprint_tons": round(random.uniform(12, 28), 1),
        "timestamp": now.isoformat(),
    }


def _generate_machine_metrics():
    """Generate realistic machine utilization metrics."""
    machines = [
        {"id": "EXC-001", "name": "CAT 390F Excavator", "type": "Excavator"},
        {"id": "DMP-003", "name": "Komatsu HD785-7 Dump Truck", "type": "Haul Truck"},
        {"id": "DRL-002", "name": "Atlas Copco D65 Drill", "type": "Drill Rig"},
        {"id": "LDR-001", "name": "CAT 994K Wheel Loader", "type": "Loader"},
        {"id": "CRN-002", "name": "Liebherr LTM 1300 Crane", "type": "Crane"},
        {"id": "BLD-001", "name": "CAT D11T Bulldozer", "type": "Bulldozer"},
    ]
    
    for machine in machines:
        machine["utilization"] = round(random.uniform(55, 98), 1)
        machine["fuel_rate"] = round(random.uniform(30, 120), 1)
        machine["hours_today"] = round(random.uniform(4, 12), 1)
        machine["status"] = random.choice(["OPERATIONAL", "OPERATIONAL", "OPERATIONAL", "MAINTENANCE", "IDLE"])
        machine["temperature_c"] = round(random.uniform(65, 105), 1)
    
    return machines


def _generate_safety_data():
    """Generate safety monitoring data."""
    return {
        "active_incidents": random.randint(0, 3),
        "total_incidents_month": random.randint(2, 8),
        "days_without_incident": random.randint(5, 45),
        "risk_index": round(random.uniform(0.1, 0.4), 2),
        "workers_on_site": random.randint(120, 280),
        "zones": [
            {"name": "Zone A — Open Pit", "risk": "LOW", "workers": random.randint(30, 60)},
            {"name": "Zone B — Processing", "risk": "MEDIUM", "workers": random.randint(40, 80)},
            {"name": "Zone C — Underground", "risk": random.choice(["MEDIUM", "HIGH"]), "workers": random.randint(20, 50)},
            {"name": "Zone D — Storage", "risk": "LOW", "workers": random.randint(10, 30)},
        ]
    }


def _generate_trend_data(days: int = 30):
    """Generate historical trend data for charts."""
    now = datetime.utcnow()
    data = []
    
    for i in range(days):
        date = now - timedelta(days=days - i - 1)
        data.append({
            "date": date.strftime("%Y-%m-%d"),
            "tonnage": round(12500 + random.uniform(-2000, 2000) + math.sin(i / 7) * 500, 1),
            "ore_grade": round(65 + random.uniform(-8, 8) + math.cos(i / 5) * 3, 1),
            "utilization": round(82 + random.uniform(-10, 10), 1),
            "energy": round(55000 + random.uniform(-8000, 8000), 0),
            "safety_incidents": random.randint(0, 2),
        })
    
    return data


@router.get("/overview", summary="Get production overview")
async def get_overview():
    """Real-time production overview for the main dashboard."""
    return {
        "status": "success",
        "data": _generate_production_data(),
    }


@router.get("/kpis", summary="Get real-time KPIs")
async def get_kpis():
    """Comprehensive KPI matrix for the operations dashboard."""
    production = _generate_production_data()
    safety = _generate_safety_data()
    
    return {
        "status": "success",
        "data": {
            "production": production,
            "machine_utilization": round(random.uniform(75, 95), 1),
            "fuel_consumption_liters": round(random.uniform(8000, 15000), 0),
            "downtime_hours": round(random.uniform(2, 18), 1),
            "ore_recovery_yield": round(random.uniform(85, 96), 1),
            "safety": safety,
        }
    }


@router.get("/machines", summary="Get machine metrics")
async def get_machines():
    """Equipment monitoring data for all tracked machines."""
    return {
        "status": "success",
        "data": _generate_machine_metrics(),
    }


@router.get("/trends", summary="Get historical trends")
async def get_trends(days: int = 30):
    """Historical trend data for dashboard charts."""
    return {
        "status": "success",
        "data": _generate_trend_data(days),
    }


@router.get("/insights", summary="Get AI insights")
async def get_insights():
    """AI-generated predictive insights and alerts."""
    fallback_insights = [
        {
            "id": "INS-001",
            "severity": "WARNING",
            "title": "Excavator EXC-001 — Predictive Maintenance Alert",
            "description": "Hydraulic pressure trending 12% below baseline. Predicted failure window: 48-72 hours. Schedule maintenance to avoid unplanned downtime.",
            "category": "EQUIPMENT",
            "timestamp": datetime.utcnow().isoformat(),
            "confidence": 0.87,
        },
        {
            "id": "INS-002",
            "severity": "INFO",
            "title": "Ore Grade Improvement — Zone A",
            "description": "Classification data indicates 8% increase in high-grade ore samples from Zone A over the past 7 days. Consider allocating additional processing capacity.",
            "category": "PRODUCTION",
            "timestamp": datetime.utcnow().isoformat(),
            "confidence": 0.92,
        },
        {
            "id": "INS-003",
            "severity": "CRITICAL",
            "title": "Safety Zone C — Elevated Risk Index",
            "description": "Underground Zone C risk index has exceeded threshold (0.35). Recommend reducing active worker count and initiating safety protocol review.",
            "category": "SAFETY",
            "timestamp": datetime.utcnow().isoformat(),
            "confidence": 0.94,
        },
        {
            "id": "INS-004",
            "severity": "INFO",
            "title": "Energy Optimization Opportunity",
            "description": "Night shift energy consumption is 23% higher than optimal. Adjusting crusher scheduling could save ~4,200 kWh/day.",
            "category": "ENERGY",
            "timestamp": datetime.utcnow().isoformat(),
            "confidence": 0.78,
        },
    ]

    if not groq_client:
        return {"status": "success", "data": fallback_insights}
        
    try:
        production = _generate_production_data()
        safety = _generate_safety_data()
        
        prompt = f"""
You are an AI mining intelligence engine. Based on the following real-time telemetry data, generate 4 actionable insights.
Production Data: {json.dumps(production)}
Safety Data: {json.dumps(safety)}

Return a JSON object containing a single key "insights" which is an array of 4 insight objects.
Each insight object MUST have these exact keys:
- "id" (string, e.g. "INS-001")
- "severity" (string, exactly one of "INFO", "WARNING", "CRITICAL")
- "title" (string, concise title)
- "description" (string, detailed actionable description based on the telemetry data provided)
- "category" (string, e.g. "PRODUCTION", "SAFETY", "EQUIPMENT", "ENERGY")
- "confidence" (float, e.g. 0.92)

Output ONLY valid JSON.
"""

        completion = await groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a specialized mining AI system. You always respond in valid JSON format."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.4,
            response_format={"type": "json_object"}
        )
        
        content = completion.choices[0].message.content
        insights_data = json.loads(content).get("insights", [])
        
        # Add timestamp to each
        for item in insights_data:
            item["timestamp"] = datetime.utcnow().isoformat()
            
        return {"status": "success", "data": insights_data}
        
    except Exception as e:
        print(f"[Warning] Groq AI generation failed: {e}")
        return {"status": "success", "data": fallback_insights}
