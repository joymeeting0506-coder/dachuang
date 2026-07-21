"""ComfyUI API client — submit workflows, poll results, download images."""

from __future__ import annotations

import asyncio
from typing import Optional

import httpx

from config import get_settings

settings = get_settings()


async def submit_workflow(workflow: dict) -> str:
    """POST a workflow to ComfyUI /prompt and return the prompt_id."""
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"{settings.comfyui_base_url}/prompt",
            json={"prompt": workflow},
        )
        resp.raise_for_status()
        data = resp.json()
        # ComfyUI returns {"prompt_id": "...", "number": ..., "node_errors": {}}
        if "node_errors" in data and data["node_errors"]:
            raise RuntimeError(f"ComfyUI node errors: {data['node_errors']}")
        return data["prompt_id"]


async def get_history(prompt_id: str) -> Optional[dict]:
    """GET ComfyUI /history/{prompt_id} — returns None if not yet complete."""
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(
            f"{settings.comfyui_base_url}/history/{prompt_id}",
        )
        resp.raise_for_status()
        data = resp.json()
        # ComfyUI returns {} for prompt_id if not in history yet
        return data.get(prompt_id)


async def wait_for_completion(
    prompt_id: str,
    poll_interval: float = 1.0,
    max_wait: float = 300.0,
) -> dict:
    """Poll ComfyUI history until the prompt completes or times out.

    Returns the history entry dict (with "outputs" key).
    Raises TimeoutError if max_wait is exceeded.
    """
    elapsed = 0.0
    while elapsed < max_wait:
        history_entry = await get_history(prompt_id)
        if history_entry is not None:
            return history_entry
        await asyncio.sleep(poll_interval)
        elapsed += poll_interval
    raise TimeoutError(
        f"ComfyUI prompt {prompt_id} did not complete within {max_wait}s"
    )


async def download_image(
    filename: str,
    subfolder: str = "",
    folder_type: str = "output",
) -> bytes:
    """Download a generated image from ComfyUI /view."""
    params = {"filename": filename, "type": folder_type}
    if subfolder:
        params["subfolder"] = subfolder
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.get(
            f"{settings.comfyui_base_url}/view",
            params=params,
        )
        resp.raise_for_status()
        return resp.content


async def check_health() -> dict:
    """Quick connectivity check via ComfyUI /system_stats."""
    async with httpx.AsyncClient(timeout=3) as client:
        try:
            resp = await client.get(f"{settings.comfyui_base_url}/system_stats")
            if resp.status_code == 200:
                return {"connected": True, "endpoint": settings.comfyui_base_url}
        except Exception:
            pass
        # Try HTTP-level fallback (not raw socket that blocks event loop)
        try:
            resp = await client.get(f"{settings.comfyui_base_url}/")
            return {"connected": True, "endpoint": settings.comfyui_base_url, "note": f"responded on / (HTTP {resp.status_code})"}
        except Exception as e:
            return {"connected": False, "endpoint": settings.comfyui_base_url, "error": str(e)}
