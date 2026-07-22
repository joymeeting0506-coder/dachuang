"""LLM 服务 — 调用 DeepSeek API 将自然语言解析为纹样生成参数。

使用 OpenAI 兼容接口（deepseek-chat），base_url 可通过环境变量自定义。
"""

from __future__ import annotations

import json
import os

from openai import AsyncOpenAI

from models.schemas import (
    GenerateRequest,
    CategoryEnum,
    SizePresetEnum,
)

# ── 可选配置（兼容 DeepSeek / OpenAI / 其他兼容接口）────────────
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://api.deepseek.com")
LLM_API_KEY = os.getenv("LLM_API_KEY", "sk-your-deepseek-api-key")
LLM_MODEL = os.getenv("LLM_MODEL", "deepseek-chat")

# ── System Prompt：把所有可选值告诉 LLM ────────────────────────
SYSTEM_PROMPT = """你是一个非遗纹样设计助手。用户会用自然语言描述想要的纹样，你需要将它解析为结构化参数。

## 可用参数及可选值

### category（类别，必选）
- paper_cut → 剪纸
- dunhuang → 敦煌
- miao_embroidery → 苗绣
- silk → 丝绸

### color_scheme_id（配色方案）
- classic-vermillion → 朱砂古韵（红金配色）
- dunhuang-mural → 敦煌壁画（土褐/青绿/金色）
- blue-white → 青花瓷韵（蓝白配色）
- miao-silver → 苗银风采（深木色/银/靛蓝）
- silk-brocade → 锦绣华彩（金/红/绿/紫）
- jade-green → 碧玉清雅（玉绿/奶油/沙色）

### size_preset（尺寸）
- square → 正方形 1024x1024
- portrait → 竖版 768x1024
- landscape → 横版 1024x768

### theme_tags（主题标签，最多选 3-5 个）
可用标签：龙凤呈祥、花开富贵、祥云瑞气、福禄寿喜、鱼跃龙门、松鹤延年、梅兰竹菊、麒麟送子、鸳鸯戏水、蝙蝠如意、荷花清韵、锦鲤好运

### style_strength（风格强度 0-100）
- 0-30：风格轻，接近写实
- 31-60：中等风格化
- 61-100：强力风格化，纹样感最强

### prompt（英文提示词）
- 给一个简短的英文描述用于 Stable Diffusion 生成

## 输出格式
只返回一个 JSON 对象，不要有任何其他文字：

{
  "category": "paper_cut",
  "color_scheme_id": "classic-vermillion",
  "size_preset": "square",
  "theme_tags": ["龙凤呈祥", "花开富贵"],
  "style_strength": 70,
  "prompt": "traditional Chinese paper cut art, phoenix and flower motif, symmetrical, red and gold"
}"""


def _get_client() -> AsyncOpenAI:
    """获取 AsyncOpenAI 客户端实例（兼容 DeepSeek / OpenAI）。"""
    return AsyncOpenAI(api_key=LLM_API_KEY, base_url=LLM_BASE_URL)


async def parse_natural_language(user_input: str) -> GenerateRequest:
    """将用户自然语言输入解析为 GenerateRequest。

    Args:
        user_input: 用户的中文自然语言描述，如 "红色剪纸凤凰，对称"

    Returns:
        解析后的 GenerateRequest（可直接传给 enqueue_generation）
    """
    client = _get_client()

    response = await client.chat.completions.create(
        model=LLM_MODEL,
        temperature=0.3,  # 低温度 → 输出更稳定
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_input},
        ],
    )

    raw = response.choices[0].message.content or "{}"

    # 容错：去掉可能的 markdown 代码块标记
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[-1].rsplit("```", 1)[0].strip()

    data = json.loads(raw)

    # 构造 GenerateRequest（Pydantic 会做校验）
    return GenerateRequest(
        category=data.get("category", "paper_cut"),
        color_scheme_id=data.get("color_scheme_id", "classic-vermillion"),
        size_preset=data.get("size_preset", "square"),
        theme_tags=data.get("theme_tags", []),
        style_strength=data.get("style_strength", 50),
        prompt=data.get("prompt", ""),
        count=2,  # 默认生成 2 张
    )
