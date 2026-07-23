"""
Mining Intelligence Platform — Main FastAPI Application
Enterprise-grade backend for AI rock classification and operational analytics.
"""
import io
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from PIL import Image

from app.core.config import get_settings
from app.core.database import init_postgres
from app.api.classification import router as classification_router
from app.api.dashboard import router as dashboard_router
from app.services.classifier import RockClassifier

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle manager — startup and shutdown events."""
    # ── Startup ──
    print(f"[MIP] Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    
    # Initialize database tables
    try:
        await init_postgres()
        print("[MIP] PostgreSQL tables initialized")
    except Exception as e:
        print(f"[MIP] PostgreSQL init skipped: {e}")
    
    # Cloudinary is initialized automatically using the environment variable
    
    # Pre-load AI model
    # (Disabled to prevent Uvicorn from hanging during startup on CPU)
    # try:
    #     classifier = RockClassifier.get_instance()
    #     classifier.load_model()
    #     print("[MIP] AI model loaded successfully")
    # except Exception as e:
    #     print(f"[MIP] AI model pre-load failed (will load on first request): {e}")
    
    yield
    
    # ── Shutdown ──
    print(f"[MIP] Shutting down {settings.APP_NAME}")


# ── Create Application ──
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Enterprise-grade Mining Intelligence Platform integrating AI rock classification, "
        "predictive analytics, and real-time operational monitoring."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── CORS Middleware ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register Routers ──
app.include_router(classification_router, prefix=settings.API_PREFIX)
app.include_router(dashboard_router, prefix=settings.API_PREFIX)


# ── Root Endpoints ──
@app.get("/", tags=["Health"])
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "operational",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "version": settings.APP_VERSION}


# ── Image Serving Endpoint ──
# (Cloudinary images are served directly from Cloudinary URLs, so this local proxy is no longer needed)


# ── Model Info Endpoint ──
@app.get(f"{settings.API_PREFIX}/model/info", tags=["AI Model"])
async def model_info():
    """Get AI model metadata and performance metrics."""
    try:
        classifier = RockClassifier.get_instance()
        return {"status": "success", "data": classifier.get_model_info()}
    except Exception as e:
        return {"status": "error", "message": str(e)}


# ── Quick Classify (No DB / No Storage — for demo) ──
@app.post(f"{settings.API_PREFIX}/classify-quick", tags=["Rock Classification"])
async def classify_quick(file: bytes = None):
    """
    Quick classification without database storage.
    Useful for demo and testing when Docker services aren't running.
    """
    from fastapi import UploadFile, File as FastAPIFile
    # This endpoint is registered via the main classify endpoint
    pass
