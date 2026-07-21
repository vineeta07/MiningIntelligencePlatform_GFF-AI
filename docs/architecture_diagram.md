# System Architecture Diagram
## Mining Intelligence Platform

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (Browser)                           │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                    Next.js 14 (App Router)                         │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────┐ ┌─────────────┐  │  │
│  │  │  Dashboard    │ │    Rock      │ │Analytics │ │Documentation│  │  │
│  │  │  (Module 2)   │ │Classification│ │  Page    │ │    Page     │  │  │
│  │  │              │ │  (Module 1)  │ │          │ │             │  │  │
│  │  └──────────────┘ └──────────────┘ └──────────┘ └─────────────┘  │  │
│  │                                                                    │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │  Shared Components: Navbar | KPI Cards | InsightCards |     │  │  │
│  │  │  DataTable | UploadDropzone | ConfidenceBar                │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  │                                                                    │  │
│  │  Tech: TypeScript, Tailwind CSS v4, Framer Motion, GSAP, Lenis   │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┬───────────────┘
                                                           │
                                            REST API (HTTP/JSON)
                                            CORS Protected
                                                           │
┌──────────────────────────────────────────────────────────▼───────────────┐
│                        API GATEWAY LAYER                                 │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                    FastAPI (Async Python)                           │  │
│  │                                                                    │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────┐ ┌─────────────┐  │  │
│  │  │POST /classify│ │GET /results  │ │GET /kpis │ │GET /insights│  │  │
│  │  │              │ │GET /stats    │ │GET /trend│ │GET /machines│  │  │
│  │  └──────┬───────┘ └──────┬───────┘ └────┬─────┘ └──────┬──────┘  │  │
│  │         │                │              │               │         │  │
│  │  ┌──────▼────────────────▼──────────────▼───────────────▼──────┐  │  │
│  │  │              Service Layer                                  │  │  │
│  │  │  RockClassifier (Singleton) | Grad-CAM Engine              │  │  │
│  │  │  Dashboard Data Aggregator | Image Storage Service          │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  │                                                                    │  │
│  │  Auto-generated docs: /docs (Swagger UI) | /redoc (ReDoc)        │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└─────────────────┬──────────────┬─────────────────┬──────────────────────┘
                  │              │                 │
┌─────────────────▼──┐ ┌────────▼───────┐ ┌──────▼──────────┐
│    PostgreSQL 16   │ │   MongoDB 7    │ │    MinIO (S3)   │
│                    │ │                │ │                 │
│ classification_    │ │ telemetry_logs │ │ rock-images/    │
│   results          │ │ classification_│ │  ├── originals/ │
│ production_metrics │ │   history      │ │  └── gradcam/   │
│                    │ │                │ │                 │
│ Relational Data    │ │ Unstructured   │ │ Object Storage  │
│ & Metadata         │ │ Telemetry      │ │ (Images)        │
└────────────────────┘ └────────────────┘ └─────────────────┘

┌────────────────────┐
│     Redis 7        │
│                    │
│ Celery Broker      │
│ Task Results       │
│ Session Cache      │
└────────────────────┘
```

### Data Flow — Rock Classification

```
User uploads image ──► Next.js Frontend
                            │
                            ▼
                    POST /api/v1/classify/
                    (multipart/form-data)
                            │
                            ▼
                    FastAPI Endpoint
                    ┌───────────────────┐
                    │ 1. Validate file   │
                    │ 2. Load image      │
                    │ 3. Run inference   │──► ResNet50 Model
                    │ 4. Generate        │      │
                    │    Grad-CAM        │◄─────┘
                    │ 5. Upload to MinIO │──► MinIO (S3)
                    │ 6. Save to DB      │──► PostgreSQL
                    │ 7. Log telemetry   │──► MongoDB
                    └───────────────────┘
                            │
                            ▼
                    JSON Response:
                    {
                      predicted_class,
                      confidence,
                      all_probabilities,
                      gradcam_url,
                      metadata
                    }
```

### Technology Stack Matrix

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14, TypeScript | Server-side rendering, App Router |
| Styling | Tailwind CSS v4 | Utility-first CSS framework |
| Animation | Framer Motion, GSAP | Fluid UI transitions |
| Backend | FastAPI (Python) | Async REST API |
| AI Engine | PyTorch, torchvision | ResNet50 inference |
| Explainability | Grad-CAM (custom) | Heatmap generation |
| Image Processing | OpenCV, Pillow | Pre/post-processing |
| RDBMS | PostgreSQL 16 | Structured data |
| NoSQL | MongoDB 7 | Telemetry & logs |
| Object Storage | MinIO | S3-compatible images |
| Message Queue | Redis 7 + Celery | Async task processing |
| Containerization | Docker, Docker Compose | Service orchestration |
