"""Build ComfyUI workflow JSON from user generation parameters.

The generated workflow is a standard SDXL txt2img pipeline:
  CheckpointLoader → CLIPTextEncode × 2 → LoRALoader (optional) →
  EmptyLatentImage → KSampler → VAEDecode → SaveImage

All node IDs are kept stable so parameters can be injected predictably.
"""

from __future__ import annotations

import random

from models.schemas import GenerateRequest

# ── Stable node IDs ──────────────────────────────────────────────
NODE_CHECKPOINT = 1
NODE_CLIP_POS = 2
NODE_CLIP_NEG = 3
NODE_LORA = 4
NODE_LATENT = 5
NODE_SAMPLER = 6
NODE_VAE_DECODE = 7
NODE_SAVE = 8

# ── Category → visual keywords (English, for SD prompt) ──────────
CATEGORY_KEYWORDS: dict[str, str] = {
    "paper_cut": (
        "traditional Chinese paper cut art style, red paper cutting pattern, "
        "symmetrical folk art design, intricate cutout negative space, "
        "flat vector aesthetic, jianzhi papercut"
    ),
    "dunhuang": (
        "Dunhuang Mogao Caves mural art style, flying apsaras celestial motifs, "
        "ancient Silk Road Buddhist fresco, weathered mineral pigment texture, "
        "flowing ribbon patterns, lotus mandala, golden ochre teal palette"
    ),
    "miao_embroidery": (
        "Miao ethnic minority embroidery textile pattern, cross-stitch needlework texture, "
        "geometric diamond and spiral motifs, indigo-dyed fabric base, "
        "silver ornament-inspired borders, Guizhou folk costume embroidery"
    ),
    "silk": (
        "Chinese imperial silk brocade tapestry, Song dynasty kesi weave texture, "
        "gold and silver metallic thread luster, cloud-and-dragon brocade motif, "
        "Nanjing yunjin cloud brocade style, luxurious damask repeating pattern"
    ),
}

# ── Color scheme → English color descriptors ─────────────────────
COLOR_DESCRIPTORS: dict[str, str] = {
    "classic-vermillion": (
        "vermilion red C43B3B, warm gold D4A76A, dark charcoal 2C2C2C, "
        "cream white FFF8F0, deep burgundy 8C2424"
    ),
    "dunhuang-mural": (
        "terracotta brown B5633A, teal green 2E8B8B, golden yellow DAA520, "
        "wheat beige F5DEB3, dark walnut 483C32"
    ),
    "blue-white": (
        "classic blue-and-white porcelain palette, cobalt blue 1E3A5F, "
        "pure white FFFFFF, cerulean 4A7FB5, ice blue C4D8E8, navy 0F2440"
    ),
    "miao-silver": (
        "dark wood 2C1810, antique silver C0C0C0, crimson 8B0000, "
        "indigo navy 1B3C5A, warm off-white E8E0D5"
    ),
    "silk-brocade": (
        "dark goldenrod B8860B, crimson 8B0000, forest green 006400, "
        "bright gold FFD700, deep purple 4A0E4E"
    ),
    "jade-green": (
        "jade green 2E5E3E, cream F5F0E1, sage green 8FBC8F, "
        "warm sand C9A96E, dark forest 1A3A2A"
    ),
}

# ── Size preset → pixel dimensions ───────────────────────────────
SIZE_PRESET_DIMS: dict[str, tuple[int, int]] = {
    "square": (1024, 1024),
    "portrait": (768, 1024),
    "landscape": (1024, 768),
}

# ── Default negative prompt (shared across categories) ────────────
DEFAULT_NEGATIVE = (
    "low quality, blurry, distorted, deformed, ugly, bad anatomy, "
    "watermark, text, signature, photograph, 3D render, realistic, "
    "messy composition, asymmetrical, broken patterns"
)


def build_prompt(req: GenerateRequest) -> str:
    """Compose the CLIP positive prompt from all user inputs."""
    parts: list[str] = []

    # Quality / style anchor
    parts.append(
        "traditional Chinese intangible cultural heritage pattern, "
        "seamless repeating pattern tile, exquisite craftsmanship, "
        "museum quality, highly detailed ornament"
    )

    # Category-specific visual keywords
    cat = req.category.value if hasattr(req.category, "value") else req.category
    cat_kw = CATEGORY_KEYWORDS.get(cat, "")
    if cat_kw:
        parts.append(cat_kw)

    # Color scheme
    color = COLOR_DESCRIPTORS.get(req.color_scheme_id, "")
    if color:
        parts.append(f"color palette: {color}")

    # Theme tags (user-selected Chinese tags)
    if req.theme_tags:
        parts.append(", ".join(req.theme_tags))

    # Custom user prompt (free text)
    if req.prompt and req.prompt.strip():
        parts.append(req.prompt.strip())

    return ", ".join(parts)


def build_workflow(req: GenerateRequest, seed: int | None = None) -> dict:
    """Build a ComfyUI API workflow JSON from a GenerateRequest.

    Args:
        req: The validated generation request.
        seed: Override seed (None → random). Used when generating
              multiple images to ensure each has a unique seed.

    Returns:
        A dict suitable for POST to ComfyUI /prompt (the "prompt" key).
    """
    cat = req.category.value if hasattr(req.category, "value") else req.category

    # Resolve dimensions
    dims = SIZE_PRESET_DIMS.get(
        req.size_preset.value if hasattr(req.size_preset, "value") else req.size_preset,
        (1024, 1024),
    )
    width = req.custom_width if req.custom_width else dims[0]
    height = req.custom_height if req.custom_height else dims[1]

    # Seed
    actual_seed = seed if seed is not None else random.randint(0, 2**31 - 1)

    # Style strength → CFG and LoRA strength
    # style_strength 0-100 maps to CFG 4-12 and LoRA model strength 0.2-1.0
    strength = req.style_strength / 100.0
    cfg = round(4.0 + strength * 8.0, 1)  # 4.0 → 12.0
    lora_model_strength = round(0.2 + strength * 0.8, 2)  # 0.2 → 1.0

    pos_prompt = build_prompt(req)

    workflow = {
        str(NODE_CHECKPOINT): {
            "inputs": {
                "ckpt_name": "sd_xl_base_1.0.safetensors",
            },
            "class_type": "CheckpointLoaderSimple",
        },
        str(NODE_CLIP_POS): {
            "inputs": {
                "text": pos_prompt,
                "clip": [str(NODE_LORA), 0],  # takes CLIP from LoRA output
            },
            "class_type": "CLIPTextEncode",
        },
        str(NODE_CLIP_NEG): {
            "inputs": {
                "text": DEFAULT_NEGATIVE,
                "clip": [str(NODE_LORA), 0],  # takes CLIP from LoRA output
            },
            "class_type": "CLIPTextEncode",
        },
        str(NODE_LORA): {
            "inputs": {
                "lora_name": f"{cat}_style.safetensors",
                "strength_model": lora_model_strength,
                "strength_clip": lora_model_strength,
                "model": [str(NODE_CHECKPOINT), 0],
                "clip": [str(NODE_CHECKPOINT), 1],
            },
            "class_type": "LoraLoader",
        },
        str(NODE_LATENT): {
            "inputs": {
                "width": width,
                "height": height,
                "batch_size": 1,
            },
            "class_type": "EmptyLatentImage",
        },
        str(NODE_SAMPLER): {
            "inputs": {
                "seed": actual_seed,
                "steps": 25,
                "cfg": cfg,
                "sampler_name": "euler_ancestral",
                "scheduler": "normal",
                "denoise": 1.0,
                "model": [str(NODE_LORA), 0],
                "positive": [str(NODE_CLIP_POS), 0],
                "negative": [str(NODE_CLIP_NEG), 0],
                "latent_image": [str(NODE_LATENT), 0],
            },
            "class_type": "KSampler",
        },
        str(NODE_VAE_DECODE): {
            "inputs": {
                "samples": [str(NODE_SAMPLER), 0],
                "vae": [str(NODE_CHECKPOINT), 2],
            },
            "class_type": "VAEDecode",
        },
        str(NODE_SAVE): {
            "inputs": {
                "filename_prefix": f"feiyi_{cat}_{actual_seed}",
                "images": [str(NODE_VAE_DECODE), 0],
            },
            "class_type": "SaveImage",
        },
    }

    return workflow
