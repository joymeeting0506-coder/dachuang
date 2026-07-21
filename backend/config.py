"""Application config — loaded from environment / .env file."""

import os
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()


class Settings:
    comfyui_base_url: str = os.getenv("COMFYUI_BASE_URL", "http://127.0.0.1:8188").rstrip("/")
    output_dir: str = os.getenv("OUTPUT_DIR", "./output")
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"


@lru_cache()
def get_settings() -> Settings:
    """Return a cached Settings singleton."""
    return Settings()
