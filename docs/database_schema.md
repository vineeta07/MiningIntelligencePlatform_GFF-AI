# Database Schema (ER Diagram)
## Mining Intelligence Platform

### PostgreSQL — Relational Data

#### Table: `classification_results`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid4() | Unique classification ID |
| predicted_class | VARCHAR(100) | NOT NULL, INDEX | Predicted rock type |
| confidence | FLOAT | NOT NULL | Confidence score (0-1) |
| all_probabilities | JSON | NOT NULL | Probabilities for all 7 classes |
| original_image_key | VARCHAR(500) | NOT NULL | MinIO key for original image |
| gradcam_image_key | VARCHAR(500) | NULLABLE | MinIO key for Grad-CAM overlay |
| gps_latitude | FLOAT | NULLABLE | GPS latitude coordinate |
| gps_longitude | FLOAT | NULLABLE | GPS longitude coordinate |
| mine_name | VARCHAR(200) | NULLABLE, INDEX | Name of the mine |
| region | VARCHAR(200) | NULLABLE, INDEX | Geographic region |
| operator_name | VARCHAR(200) | NULLABLE | Name of the operator |
| device_id | VARCHAR(100) | NULLABLE | Device identifier |
| notes | TEXT | NULLABLE | Operator notes |
| classified_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Classification timestamp |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |

#### Table: `production_metrics`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid4() | Unique metric ID |
| metric_date | TIMESTAMP | NOT NULL, INDEX | Date of measurement |
| daily_tonnage | FLOAT | DEFAULT 0 | Daily output in tonnes |
| mine_utilization | FLOAT | DEFAULT 0 | Utilization percentage |
| ore_grade | FLOAT | DEFAULT 0 | Ore purity percentage |
| equipment_health | FLOAT | DEFAULT 0 | Equipment health percentage |
| energy_consumption_kwh | FLOAT | DEFAULT 0 | Energy consumed in kWh |
| carbon_footprint_tons | FLOAT | DEFAULT 0 | Carbon emissions in tonnes |
| machine_utilization | FLOAT | DEFAULT 0 | Machine utilization percentage |
| fuel_consumption_liters | FLOAT | DEFAULT 0 | Fuel consumed in litres |
| downtime_hours | FLOAT | DEFAULT 0 | Total downtime in hours |
| ore_recovery_yield | FLOAT | DEFAULT 0 | Recovery yield percentage |
| active_safety_incidents | FLOAT | DEFAULT 0 | Active incident count |
| risk_index | FLOAT | DEFAULT 0 | Calculated risk index |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |

---

### MongoDB — Unstructured Telemetry Data

#### Collection: `telemetry_logs`
```json
{
  "_id": "ObjectId",
  "source": "string (module name)",
  "event_type": "string",
  "payload": {}, 
  "timestamp": "ISODate",
  "device_id": "string"
}
```

#### Collection: `classification_history`
```json
{
  "_id": "ObjectId",
  "result_id": "string (UUID reference to PostgreSQL)",
  "predicted_class": "string",
  "confidence": "number",
  "mine_name": "string",
  "region": "string",
  "timestamp": "ISODate"
}
```

---

### MinIO — Object Storage Structure
```
rock-images/
├── originals/
│   └── {YYYYMMDD}_{HHMMSS}_{uuid}_{filename}.{ext}
└── gradcam/
    └── {YYYYMMDD}_{HHMMSS}_{uuid}_gradcam.png
```

---

### ER Diagram (Textual)
```
┌──────────────────────────┐
│  classification_results  │
├──────────────────────────┤
│ PK  id (UUID)            │
│     predicted_class      │──────┐
│     confidence           │      │
│     all_probabilities    │      │
│     original_image_key   │──► MinIO (originals/)
│     gradcam_image_key    │──► MinIO (gradcam/)
│     gps_latitude         │
│     gps_longitude        │      │
│     mine_name            │      │
│     region               │      │
│     operator_name        │      ▼
│     classified_at        │  ┌──────────────────────┐
└──────────────────────────┘  │ classification_history│
                               │     (MongoDB)         │
                               ├──────────────────────┤
                               │ result_id ──► PG.id   │
                               │ predicted_class       │
                               │ confidence            │
                               │ mine_name             │
                               │ timestamp             │
                               └──────────────────────┘
```
