from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class CategoryEnum(str, Enum):
    paper_cut = "paper_cut"
    dunhuang = "dunhuang"
    miao_embroidery = "miao_embroidery"
    silk = "silk"


class SizePresetEnum(str, Enum):
    square = "square"
    portrait = "portrait"
    landscape = "landscape"


class GenerateRequest(BaseModel):
    category: CategoryEnum = Field(..., description="非遗类别")
    style_strength: int = Field(default=50, ge=0, le=100, description="风格强度 0-100")
    prompt: str = Field(default="", description="自定义提示词")
    theme_tags: List[str] = Field(default_factory=list, description="主题标签")
    color_scheme_id: str = Field(default="classic-vermillion", description="颜色方案 ID")
    size_preset: SizePresetEnum = Field(default=SizePresetEnum.square, description="尺寸预设")
    custom_width: Optional[int] = Field(default=None, ge=64, le=2048)
    custom_height: Optional[int] = Field(default=None, ge=64, le=2048)
    count: int = Field(default=2, ge=1, le=4, description="生成数量 1-4")
    seed: Optional[int] = Field(default=None, description="随机种子，null 表示随机")


class GeneratedImageItem(BaseModel):
    id: str
    url: str
    category: str
    style_strength: int


class GenerateResponse(BaseModel):
    task_id: str
    status: str  # "queued" | "processing" | "done" | "failed"
    estimated_time: int  # seconds


class TaskStatusResponse(BaseModel):
    task_id: str
    status: str
    progress: int = 0  # 0-100
    estimated_time: int = 0
    images: Optional[List[GeneratedImageItem]] = None
    error: Optional[str] = None


class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "1.0.0"
    service: str = "非遗纹样 AI 生成平台 API"


# ── 自然语言生成相关 ────────────────────────────────────────

class NaturalLanguageRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=500, description="用户自然语言描述")
    count: int = Field(default=2, ge=1, le=4, description="生成数量")


class NaturalLanguageResponse(BaseModel):
    task_id: str
    status: str
    estimated_time: int
    parsed_params: GenerateRequest  # LLM 解析出的参数，前端可展示给用户
