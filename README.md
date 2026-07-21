# Mining Intelligence Platform — Command Centre

Enterprise-grade AI-powered mining operations dashboard integrating rock classification, predictive analytics, and real-time operational monitoring.

## 🚀 Features

- **Real-Time Operational Monitoring**: Live dashboard for tracking Daily Tonnage, Mine Utilization, Ore Grade, Equipment Health, Energy Draw, and Carbon Footprint.
- **Predictive Analytics & AI Insights**: An AI insights engine to monitor and predict equipment failures, safety risks, and operational inefficiencies.
- **Equipment Monitoring**: Real-time telemetry data including utilization, fuel rates, temperature, and status for heavy machinery.
- **Safety Monitor**: Track active incidents, zone-specific risk indices, and worker distribution across different mining zones.
- **AI Rock Classification Module**: Machine learning models to classify rock types and assess ore grade qualities.

## 🏗️ Architecture & Infrastructure

The platform is built using a modern, scalable tech stack:

### Services and Databases
- **PostgreSQL**: Relational database for structured operational data.
- **MongoDB**: NoSQL database for unstructured telemetry and logs.
- **MinIO**: S3-compatible object storage for storing images and large assets.
- **Redis**: In-memory data store acting as a message broker for asynchronous Celery tasks.

### Core Modules
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
- **MinIO API**: `localhost:9000` (Console: `localhost:9001`)
- **Redis**: `localhost:6379`

### Development

To run the frontend dashboard:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be accessible at [http://localhost:3000](http://localhost:3000).

## 📄 License

© 2025 Mining Intelligence Platform. All rights reserved.
