"""FastAPI application entry point."""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from config import get_settings, Settings
from models.schemas import HealthResponse
from routes.generate import router as generate_router
from routes.llm_generate import router as llm_router
from services.comfyui_service import check_health as check_comfyui_health

settings = get_settings()

# Ensure output directory exists
os.makedirs(settings.output_dir, exist_ok=True)

app = FastAPI(
    title="非遗纹样 AI 生成平台 API",
    description="Intangible Cultural Heritage Pattern AI Generation API (ComfyUI backend)",
    version="1.1.0",
)

# CORS — allow frontend (dev, Vercel, and tunnel origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:7860",
        # Vercel production deploys — explicit regex handles wildcard
    ],
    allow_origin_regex=r"https://(feiyi-ai(-[a-zA-Z0-9-]+)?|.*-feiyi-ai)\.vercel\.app|https://.*\.trycloudflare\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving — generated images available at /api/output/{filename}
app.mount(
    "/api/output",
    StaticFiles(directory=settings.output_dir),
    name="output",
)

# Routes
app.include_router(generate_router)
app.include_router(llm_router)


@app.get("/", response_model=HealthResponse)
async def root():
    return HealthResponse(version="1.1.0")


@app.get("/api/health", response_model=HealthResponse)
async def health():
    return HealthResponse(version="1.1.0")


@app.get("/api/comfyui/health")
async def comfyui_health():
    """Check ComfyUI connectivity."""
    result = await check_comfyui_health()
    return result


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=7860, reload=True)
