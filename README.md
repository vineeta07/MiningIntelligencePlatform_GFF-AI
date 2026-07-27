# Mining Intelligence Platform

The collective objective is to deliver an enterprise-grade, scalable, and extensible **Mining Intelligence Platform**. Real-time operational visibility, AI-driven insights, predictive analytics, safety monitoring, and blast intelligence must all be accessible from a single dashboard.

## 🎯 Final Integration Goal

At project completion, all six modules must interoperate through **secure REST APIs and shared authentication**, feeding into the Mining Operations Dashboard — the executive control centre of the entire platform.

## 🧩 Modules & Ownership

### Vineeta
- **AI Rock Image Classification Module**: Machine learning models to classify rock types and assess ore grade qualities.
- **Mining Operations Dashboard**: The executive control centre and live dashboard for tracking operational metrics.

### Alok
- **Blast Safety Checklist Module**
- **Blast Design Optimisation Module**

### Aryaman
- **Equipment Monitoring Module**: Real-time telemetry data including utilization, fuel rates, temperature, and status for heavy machinery.
- **Worker Safety Module**: Track active incidents, zone-specific risk indices, and worker distribution across different mining zones.

## 🏗️ Architecture & Infrastructure

The platform is built using a modern, scalable tech stack:

### Services and Databases
- **PostgreSQL**: Relational database for structured operational data.
- **MongoDB**: NoSQL database for unstructured telemetry and logs.

### Core Structure
- `frontend/`: Next.js web application providing the executive command centre UI with Tailwind CSS.
- `backend/`: Core API services handling business logic, telemetry ingestion, and communication with the databases.
- `model/`: AI/ML models responsible for rock classification and predictive insights.
- `docs/`: Additional project documentation.

## 🛠️ Getting Started

### Prerequisites

Ensure you have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed on your machine.

### Infrastructure Setup

Start the core infrastructure (PostgreSQL, MongoDB, MinIO, Redis) using Docker Compose:

```bash
docker-compose up -d
```

### Services Available on Localhost:
- **PostgreSQL**: `localhost:5432`
- **MongoDB**: `localhost:27017`

### Development

To run the frontend dashboard:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be accessible at [http://localhost:3000](http://localhost:3000).

## 📄 License

© 2026 Mining Intelligence Platform. All rights reserved.
