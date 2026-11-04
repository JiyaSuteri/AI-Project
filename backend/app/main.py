import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from app.config import settings
from app.database.session import engine, Base, SessionLocal
from app.utils.seed_data import seed_database
from app.routes import (
    health_router,
    dashboard_router,
    tables_router,
    customers_router,
    waiters_router,
    reservations_router,
    allocations_router,
    policies_router,
    simulation_router,
    analytics_router,
    ai_router,
    system_router,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create DB tables
    Base.metadata.create_all(bind=engine)
    # Seed sample database
    db = SessionLocal()
    try:
        seed_database(db, force_reset=False)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="A multi-agent restaurant service planner and table allocation simulator using AI search algorithms (Rule-Based, Greedy, BFS, DFS, A*) and a grounded RAG assistant.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow development servers on any local port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health_router, prefix=settings.API_V1_STR)
app.include_router(dashboard_router, prefix=settings.API_V1_STR)
app.include_router(tables_router, prefix=settings.API_V1_STR)
app.include_router(customers_router, prefix=settings.API_V1_STR)
app.include_router(waiters_router, prefix=settings.API_V1_STR)
app.include_router(reservations_router, prefix=settings.API_V1_STR)
app.include_router(allocations_router, prefix=settings.API_V1_STR)
app.include_router(policies_router, prefix=settings.API_V1_STR)
app.include_router(simulation_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)
app.include_router(ai_router, prefix=settings.API_V1_STR)
app.include_router(system_router, prefix=settings.API_V1_STR)

# Locate frontend dist for unified full-stack serving
current_dir = os.path.dirname(os.path.abspath(__file__)) # app/
backend_dir = os.path.dirname(current_dir) # backend/
root_dir = os.path.dirname(backend_dir) # restaurant-ai-planner/
frontend_dist = os.path.join(root_dir, "frontend", "dist")

if os.path.exists(os.path.join(frontend_dist, "assets")):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="static-assets")

@app.get("/")
def root(request: Request):
    accept = request.headers.get("accept", "")
    # Serve React website if requested by browser
    if ("text/html" in accept or "*/*" in accept) and os.path.exists(os.path.join(frontend_dist, "index.html")):
        return FileResponse(os.path.join(frontend_dist, "index.html"))
    return {
        "message": "Welcome to AI-Based Restaurant Table Allocation and Service Planner API",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health"
    }

@app.get("/{full_path:path}")
async def serve_spa(full_path: str, request: Request):
    # Pass through API, docs and Swagger
    if full_path.startswith("api") or full_path in ["docs", "redoc", "openapi.json"]:
        return JSONResponse({"detail": "Not Found"}, status_code=404)

    file_path = os.path.join(frontend_dist, full_path)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)

    index_path = os.path.join(frontend_dist, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)

    return JSONResponse({"detail": "Not Found"}, status_code=404)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
