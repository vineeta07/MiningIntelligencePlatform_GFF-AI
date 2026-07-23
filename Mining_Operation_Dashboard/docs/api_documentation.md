# API Documentation
## Mining Intelligence Platform — REST API Reference

**Base URL:** `http://localhost:8000/api/v1`  
**Interactive Docs:** `http://localhost:8000/docs` (Swagger UI) | `http://localhost:8000/redoc` (ReDoc)

---

## Rock Classification Endpoints

### POST `/classify/`
Upload a rock image for AI classification.

**Content-Type:** `multipart/form-data`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| file | File (JPEG/PNG) | ✅ | Rock image file |
| mine_name | string | ❌ | Name of the mine |
| region | string | ❌ | Geographic region |
| gps_latitude | float | ❌ | GPS latitude |
| gps_longitude | float | ❌ | GPS longitude |
| operator_name | string | ❌ | Operator name |
| device_id | string | ❌ | Device identifier |
| notes | string | ❌ | Field observations |

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "predicted_class": "Granite",
    "confidence": 0.9234,
    "all_probabilities": {
      "Basalt": 0.0123,
      "Coal": 0.0045,
      "Granite": 0.9234,
      "Limestone": 0.0234,
      "Marble": 0.0156,
      "Quartzite": 0.0108,
      "Sandstone": 0.0100
    },
    "original_image_url": "/api/v1/images/originals/...",
    "gradcam_image_url": "/api/v1/images/gradcam/...",
    "mine_name": "Rajmahal Mine",
    "region": "Jharkhand",
    "classified_at": "2025-07-19T12:00:00"
  }
}
```

---

### GET `/classify/results`
Retrieve paginated classification history.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | int | 1 | Page number |
| limit | int | 20 | Results per page |
| mine_name | string | — | Filter by mine name |
| region | string | — | Filter by region |
| predicted_class | string | — | Filter by class |

---

### GET `/classify/results/{result_id}`
Retrieve a specific classification result by UUID.

---

### GET `/classify/stats`
Get aggregate classification statistics.

**Response:**
```json
{
  "status": "success",
  "data": {
    "total_classifications": 156,
    "class_distribution": [
      { "class_name": "Granite", "count": 34, "avg_confidence": 0.8912 }
    ]
  }
}
```

---

## Dashboard Endpoints

### GET `/dashboard/overview`
Real-time production overview.

### GET `/dashboard/kpis`
Comprehensive KPI matrix including production, machine utilization, fuel, downtime, and safety data.

### GET `/dashboard/machines`
Equipment monitoring data for all tracked machines.

### GET `/dashboard/trends?days=30`
Historical trend data for dashboard charts.

### GET `/dashboard/insights`
AI-generated predictive insights and alerts with severity levels (CRITICAL, WARNING, INFO).

---

## Utility Endpoints

### GET `/model/info`
AI model metadata: architecture, parameters, accuracy, class names.

### GET `/api/v1/images/{image_key}`
Serve images stored in MinIO object storage.

### GET `/health`
System health check.

---

## Error Responses

| Code | Description |
|------|-------------|
| 400 | Invalid file type or malformed request |
| 404 | Resource not found |
| 500 | Internal server error |
