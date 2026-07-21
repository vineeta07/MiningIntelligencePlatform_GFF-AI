# Deployment Guide
## Mining Intelligence Platform

### Prerequisites

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 18+ | Frontend runtime |
| Python | 3.10+ | Backend runtime |
| Docker Desktop | Latest | Database services |
| Git | Latest | Version control |

---

### 1. Quick Start (Development)

#### Step 1: Clone & Navigate
```bash
cd MiningIntelligentPlatform
```

#### Step 2: Start Infrastructure Services
```bash
docker-compose up -d
```
This starts PostgreSQL, MongoDB, MinIO, and Redis.

#### Step 3: Start Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### Step 4: Start Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Step 5: Access the Platform
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Swagger Docs:** http://localhost:8000/docs
- **MinIO Console:** http://localhost:9001

---

### 2. Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Application
APP_NAME=Mining Intelligence Platform
DEBUG=true

# PostgreSQL
POSTGRES_USER=mip_admin
POSTGRES_PASSWORD=mip_secure_2025
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=mining_intelligence

# MongoDB
MONGO_USER=mip_admin
MONGO_PASSWORD=mip_secure_2025
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=mining_telemetry

# MinIO
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=mip_minio_admin
MINIO_SECRET_KEY=mip_minio_secure_2025
MINIO_BUCKET=rock-images

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

### 3. Production Build

#### Frontend
```bash
cd frontend
npm run build
npm start
```

#### Backend
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

### 4. Docker Deployment (Full Stack)

```bash
# Build and run all services
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down
```

---

### 5. Verification Checklist

| Step | Command / Action | Expected |
|------|-----------------|----------|
| 1 | `docker-compose ps` | All 4 services running |
| 2 | Open http://localhost:3000 | Dashboard loads |
| 3 | Navigate to Rock Classification | Upload area visible |
| 4 | Upload a rock image | Classification result appears |
| 5 | Open http://localhost:8000/docs | Swagger UI loads |
| 6 | Open http://localhost:9001 | MinIO console loads |

---

### 6. Troubleshooting

| Issue | Solution |
|-------|----------|
| Docker services won't start | Ensure Docker Desktop is running |
| Port 3000 in use | Stop other dev servers or change port in package.json |
| Port 8000 in use | Use `--port 8001` flag for uvicorn |
| Model file not found | Ensure `best_model.pth` is in `model/` directory |
| npm install fails | Delete `node_modules` and run `npm install` again |
| pip install fails | Use `pip install --no-cache-dir -r requirements.txt` |
