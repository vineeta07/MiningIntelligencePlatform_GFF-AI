# Mining Operations Dashboard

**Module Owner:** Vineeta

The **Mining Operations Dashboard** serves as the executive control centre for the entire Mining Intelligence Platform. It provides a unified, real-time view of operations by aggregating data from all integrated modules via secure REST APIs.

## 🌟 Core Features

- **Executive Command Centre:** A single, centralized interface for monitoring the health and performance of the entire mining operation.
- **Real-Time Metrics Tracking:** Live visualization of critical operational metrics, including:
  - Daily Tonnage and Production Rates
  - Mine Utilization and Efficiency
  - Equipment Health and Status
  - Energy Draw and Carbon Footprint
- **AI Rock Image Classification Integration:** Direct integration with the rock classification machine learning models to monitor rock types and assess ore grade qualities in real-time.
- **Platform-Wide Interoperability:** Consumes data from the Blast Safety, Blast Design, Equipment Monitoring, and Worker Safety modules to provide a holistic operational picture.

## 🏗️ Architecture

This module is structured into the following key components:

- **`/frontend`**: The user interface for the executive dashboard, built with modern web technologies:
  - **Framework**: Next.js 16 & React 19
  - **Styling**: Tailwind CSS v4
  - **Data Visualization**: Recharts
  - **Icons**: Lucide React
- **`/backend`**: The API gateway and core services responsible for aggregating data from other platform modules and serving it to the frontend.
- **`/model`**: Houses the machine learning models and inference scripts for the AI Rock Image Classification feature.
- **`/docs`**: Additional documentation specific to the dashboard and its architecture.

## 🚀 Getting Started

### Running the Dashboard (Frontend)

To run the Next.js frontend locally:

```bash
cd frontend
npm install
npm run dev
```

The application will start on [http://localhost:3000](http://localhost:3000).

### Running the API (Backend)

The backend is built with FastAPI. To run it locally:

```bash
cd backend
python -m venv venv
# On Windows use: venv\Scripts\activate
# On macOS/Linux use: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API will be available at [http://localhost:8000](http://localhost:8000) and documentation at [http://localhost:8000/docs](http://localhost:8000/docs).

### API Integration

*Note: Ensure the core platform infrastructure (Databases, Message Queues) and other required modules are running to see populated data on the dashboard.*

## 🔒 Security & Authentication

As the central hub, the Mining Operations Dashboard enforces the platform's shared authentication strategy and secures all incoming/outgoing REST API communications to ensure operational data integrity.
