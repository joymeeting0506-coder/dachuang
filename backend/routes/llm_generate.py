"""自然语言生成路由 — 接收用户自然语言描述，经 LLM 解析后走 ComfyUI 生成管线。"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from models.schemas import (
    NaturalLanguageRequest,
    NaturalLanguageResponse,
)
from services.llm_service import parse_natural_language
from services.pattern_service import enqueue_generation

router = APIRouter(prefix="/api", tags=["llm-generation"])


@router.post("/generate/natural", response_model=NaturalLanguageResponse)
async def generate_from_natural_language(req: NaturalLanguageRequest):
    """用自然语言描述生成非遗纹样。

    工作流程：
    1. 将用户自然语言送给 DeepSeek LLM 解析为 GenerateRequest
    2. 复用现有 enqueue_generation → ComfyUI 管线
    3. 返回 task_id + 解析出的参数（前端可展示给用户确认）
    """
    # 1. LLM 解析自然语言
    try:
        gen_req = await parse_natural_language(req.prompt)
        # 如果用户指定了 count，覆盖 LLM 的默认值
        gen_req.count = req.count
    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"LLM 参数解析失败：{e}。请尝试更具体地描述你的需求。",
        )

    # 2. 走现有生成管线
    response = await enqueue_generation(gen_req)

    # 3. 返回 task_id + 解析参数
    return NaturalLanguageResponse(
        task_id=response.task_id,
        status=response.status,
        estimated_time=response.estimated_time,
        parsed_params=gen_req,
    )
