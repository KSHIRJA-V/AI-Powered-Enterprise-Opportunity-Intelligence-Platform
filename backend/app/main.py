from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.core.database import init_db
from app.api.routes_companies import router as companies_router
from app.api.routes_analysis import router as analysis_router
from app.api.routes_evidence import router as evidence_router
from app.api.routes_roadmap import router as roadmap_router
from app.api.routes_contradictions import router as contradictions_router
from app.api.routes_evaluations import router as evaluations_router
from app.api.routes_reports import router as reports_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database tables
    await init_db()
    yield
    # Shutdown

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Powered Enterprise Transformation Intelligence and Strategic Decision Support Platform",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(companies_router, prefix=settings.API_PREFIX)
app.include_router(analysis_router, prefix=settings.API_PREFIX)
app.include_router(evidence_router, prefix=settings.API_PREFIX)
app.include_router(roadmap_router, prefix=settings.API_PREFIX)
app.include_router(contradictions_router, prefix=settings.API_PREFIX)
app.include_router(evaluations_router, prefix=settings.API_PREFIX)
app.include_router(reports_router, prefix=settings.API_PREFIX)

@app.get("/")
async def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "OPERATIONAL",
        "docs": "/docs"
    }
