from fastapi import APIRouter, HTTPException
from models.schemas import GenerateRequest, GenerateResponse, TaskStatusResponse
from services.pattern_service import enqueue_generation, get_task_status

router = APIRouter(prefix="/api", tags=["generation"])


@router.post("/generate", response_model=GenerateResponse)
async def generate_pattern(req: GenerateRequest):
    """Submit a pattern generation request."""
    return await enqueue_generation(req)


@router.get("/generate/{task_id}", response_model=TaskStatusResponse)
async def get_generation_status(task_id: str):
    """Poll the status of a generation task."""
    result = await get_task_status(task_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return result
