"""Pattern generation service — enqueue / poll / process via ComfyUI."""

from __future__ import annotations

import asyncio
import os
import uuid
from typing import Dict

from models.schemas import (
    GenerateRequest,
    GenerateResponse,
    TaskStatusResponse,
    GeneratedImageItem,
)
from services.comfyui_service import (
    submit_workflow,
    wait_for_completion,
    download_image,
)
from services.workflow_builder import build_workflow
from config import get_settings

settings = get_settings()

# In-memory task store (use Redis in production)
tasks: Dict[str, dict] = {}


async def enqueue_generation(req: GenerateRequest) -> GenerateResponse:
    """Enqueue a pattern generation task via ComfyUI."""
    task_id = f"task_{uuid.uuid4().hex[:12]}"
    estimated_time = 5 + (req.count * 8)  # ~5s base + ~8s per image

    tasks[task_id] = {
        "status": "queued",
        "progress": 0,
        "estimated_time": estimated_time,
        "images": None,
        "error": None,
        "request": req,
    }

    # Start async generation (fire-and-forget background task)
    asyncio.create_task(_process_generation(task_id, req))

    return GenerateResponse(
        task_id=task_id,
        status="queued",
        estimated_time=estimated_time,
    )


async def get_task_status(task_id: str) -> TaskStatusResponse | None:
    """Get the current status of a generation task."""
    task = tasks.get(task_id)
    if not task:
        return None

    return TaskStatusResponse(
        task_id=task_id,
        status=task["status"],
        progress=task["progress"],
        estimated_time=task["estimated_time"],
        images=task["images"],
        error=task["error"],
    )


async def _process_generation(task_id: str, req: GenerateRequest):
    """Background task: generate images via ComfyUI.

    For each requested image, builds a workflow with a unique seed,
    submits to ComfyUI, polls until done, downloads the result,
    and saves it to the local output directory.
    """
    task = tasks[task_id]
    task["status"] = "processing"

    # Ensure output directory exists
    os.makedirs(settings.output_dir, exist_ok=True)

    count = req.count
    cat = req.category.value if hasattr(req.category, "value") else req.category
    images: list[GeneratedImageItem] = []

    try:
        import random

        for i in range(count):
            # Update estimated time for remaining images
            task["estimated_time"] = max(2, (count - i) * 10)

            # Build workflow with a unique seed per image
            seed = random.randint(0, 2**31 - 1)
            workflow = build_workflow(req, seed=seed)

            # Submit to ComfyUI
            try:
                prompt_id = await submit_workflow(workflow)
            except Exception as e:
                raise RuntimeError(
                    f"Failed to submit to ComfyUI — is it running at {settings.comfyui_base_url}? ({e})"
                )

            # Poll for completion
            try:
                history_entry = await wait_for_completion(
                    prompt_id, poll_interval=1.5, max_wait=120.0
                )
            except TimeoutError:
                raise TimeoutError(
                    f"ComfyUI generation timed out for prompt {prompt_id} (120s)"
                )

            # Extract output image info from history
            outputs = history_entry.get("outputs", {})
            output_files = _extract_output_files(outputs)

            if not output_files:
                raise RuntimeError(
                    f"ComfyUI prompt {prompt_id} completed but produced no output images"
                )

            # Download the first output image
            img_info = output_files[0]
            img_bytes = await download_image(
                filename=img_info["filename"],
                subfolder=img_info.get("subfolder", ""),
                folder_type=img_info.get("type", "output"),
            )

            # Save to local output dir
            local_filename = f"{task_id}_{i}.png"
            local_path = os.path.join(settings.output_dir, local_filename)
            with open(local_path, "wb") as f:
                f.write(img_bytes)

            images.append(
                GeneratedImageItem(
                    id=f"img_{task_id}_{i}",
                    url=f"/api/output/{local_filename}",
                    category=cat,
                    style_strength=req.style_strength,
                )
            )

            # Update progress
            task["progress"] = int(((i + 1) / count) * 100)

        task["status"] = "done"
        task["progress"] = 100
        task["estimated_time"] = 0
        task["images"] = images

    except Exception as e:
        task["status"] = "failed"
        task["error"] = str(e)
        # Keep any partially generated images
        if images:
            task["images"] = images


def _extract_output_files(
    outputs: dict,
) -> list[dict[str, str]]:
    """Walk ComfyUI history outputs and collect {filename, subfolder, type} dicts."""
    files: list[dict[str, str]] = []
    for node_id, node_output in outputs.items():
        if "images" in node_output:
            for img in node_output["images"]:
                files.append(
                    {
                        "filename": img["filename"],
                        "subfolder": img.get("subfolder", ""),
                        "type": img.get("type", "output"),
                    }
                )
    return files
