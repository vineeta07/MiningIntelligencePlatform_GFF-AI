# Software Requirement Specification (SRS)
## Mining Intelligence Platform v1.0

### 1. Introduction

#### 1.1 Purpose
This document specifies the software requirements for the Mining Intelligence Platform (MIP), an enterprise-grade system integrating AI-powered rock classification, predictive analytics, and real-time operational monitoring for mining operations.

#### 1.2 Scope
The MIP system encompasses:
- **AI Rock Image Classification Module** (Vineeta — Module 1): Automated geological classification of rock samples using deep learning with explainability analysis.
- **Mining Operations Dashboard** (Vineeta — Module 2): Centralized executive command centre aggregating operational KPIs, safety metrics, equipment monitoring, and AI-generated insights.

#### 1.3 Definitions
| Term | Definition |
|------|-----------|
| MIP | Mining Intelligence Platform |
| Grad-CAM | Gradient-weighted Class Activation Mapping |
| KPI | Key Performance Indicator |
| ResNet50 | Residual Network with 50 layers |

---

### 2. Functional Requirements

#### 2.1 Rock Image Classification (FR-RC)
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-RC-01 | System shall accept JPEG/PNG rock images via drag-and-drop or file browser | HIGH |
| FR-RC-02 | System shall classify images into 7 rock types: Basalt, Coal, Granite, Limestone, Marble, Quartzite, Sandstone | HIGH |
| FR-RC-03 | System shall return confidence scores for all 7 classes | HIGH |
| FR-RC-04 | System shall generate Grad-CAM heatmaps for AI explainability | HIGH |
| FR-RC-05 | System shall accept geological metadata: GPS coordinates, mine name, region, operator name, device ID | MEDIUM |
| FR-RC-06 | System shall store classification results in PostgreSQL | HIGH |
| FR-RC-07 | System shall store original images and Grad-CAM overlays in MinIO object storage | HIGH |
| FR-RC-08 | System shall provide paginated classification history with search/filter | MEDIUM |
| FR-RC-09 | System shall provide aggregate classification statistics | MEDIUM |

#### 2.2 Mining Operations Dashboard (FR-DB)
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-DB-01 | Dashboard shall display real-time production KPIs: daily tonnage, mine utilization, ore grade, equipment health, energy consumption, carbon footprint | HIGH |
| FR-DB-02 | Dashboard shall display machine utilization matrix with per-equipment metrics | HIGH |
| FR-DB-03 | Dashboard shall display safety monitoring: active incidents, risk index, zone status | HIGH |
| FR-DB-04 | Dashboard shall display 30-day production trend visualization | MEDIUM |
| FR-DB-05 | Dashboard shall display AI-generated predictive insights with severity levels | HIGH |
| FR-DB-06 | Dashboard shall auto-refresh KPIs every 15 seconds | MEDIUM |
| FR-DB-07 | Dashboard shall display equipment monitoring table with utilization, fuel rate, temperature, and operational status | HIGH |

---

### 3. Non-Functional Requirements

#### 3.1 Performance
| ID | Requirement |
|----|-------------|
| NFR-P-01 | Image classification inference shall complete within 5 seconds on CPU |
| NFR-P-02 | Dashboard page shall achieve First Contentful Paint under 2 seconds |
| NFR-P-03 | API response time for dashboard KPIs shall be under 200ms |

#### 3.2 Security
| ID | Requirement |
|----|-------------|
| NFR-S-01 | CORS shall be configured to allow only authorized frontend origins |
| NFR-S-02 | File uploads shall be validated for type and size constraints |
| NFR-S-03 | Database credentials shall be stored in environment variables |

#### 3.3 Scalability
| ID | Requirement |
|----|-------------|
| NFR-SC-01 | Backend shall support asynchronous processing via Celery workers |
| NFR-SC-02 | System shall be containerized via Docker for horizontal scaling |
| NFR-SC-03 | MinIO object storage shall handle concurrent image uploads |

#### 3.4 Usability
| ID | Requirement |
|----|-------------|
| NFR-U-01 | Interface shall use pastel industrial color palette for workplace visibility |
| NFR-U-02 | All interactive elements shall have fluid spring-physics animations |
| NFR-U-03 | Interface shall be responsive across desktop and tablet viewports |

---

### 4. System Constraints
- AI model architecture: ResNet50 (pre-trained, 7 classes)
- Input image size: 224 × 224 pixels (auto-resized)
- Model test accuracy: 71.84%
- Supported rock types: Basalt, Coal, Granite, Limestone, Marble, Quartzite, Sandstone
- Docker required for database and storage services
