"""Gemini image generation module using google-genai SDK."""

from __future__ import annotations

import io
import os
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image

# Load environment variables from .env if present
load_dotenv()

DEFAULT_MODEL = "gemini-2.5-flash-image"
FALLBACK_MODEL = "gemini-3.1-flash-image"
FULL_HD_SIZE = (1920, 1080)


def get_client(api_key: Optional[str] = None) -> genai.Client:
    """Initialize and return a Gemini API client."""
    key = api_key or os.environ.get("GEMINI_API_KEY")
    if not key:
        raise ValueError(
            "GEMINI_API_KEY is not set. Please add it to your .env file or environment variables."
        )
    return genai.Client(api_key=key)


def generate_image(
    prompt: str,
    output_path: str | Path,
    model: str = DEFAULT_MODEL,
    aspect_ratio: str = "16:9",
    ensure_full_hd: bool = True,
    client: Optional[genai.Client] = None,
) -> Path:
    """Generate an image using Gemini (flash 2.5 or 3.1) and save to output_path.

    Args:
        prompt: Detailed image generation prompt.
        output_path: Target file path to save the generated image (PNG format recommended).
        model: Gemini image model to use (default: gemini-2.5-flash-image).
        aspect_ratio: Desired aspect ratio (e.g. "16:9", "1:1", "4:3").
        ensure_full_hd: Whether to ensure the output image is saved in Full HD (1920x1080).
        client: Optional pre-configured genai.Client.

    Returns:
        Path to the saved image file.
    """
    ai_client = client or get_client()
    output_file = Path(output_path).resolve()
    output_file.parent.mkdir(parents=True, exist_ok=True)

    config = types.GenerateContentConfig(
        image_config=types.ImageConfig(aspect_ratio=aspect_ratio)
    )

    print(f"==> Requesting image from model: {model} (aspect_ratio={aspect_ratio})...")
    try:
        response = ai_client.models.generate_content(
            model=model,
            contents=prompt,
            config=config,
        )
    except Exception as e:
        # If default 2.5 fails, try fallback 3.1 or re-raise
        if model != FALLBACK_MODEL:
            print(f"Warning: Model {model} failed ({e}). Retrying with {FALLBACK_MODEL}...")
            response = ai_client.models.generate_content(
                model=FALLBACK_MODEL,
                contents=prompt,
                config=config,
            )
        else:
            raise

    # Locate image bytes in response parts
    image_bytes = None
    if response.candidates and response.candidates[0].content:
        for part in response.candidates[0].content.parts:
            if hasattr(part, "inline_data") and part.inline_data:
                image_bytes = part.inline_data.data
                break

    if not image_bytes:
        raise RuntimeError("No image data returned from Gemini API.")

    # Process and save image with PIL
    img = Image.open(io.BytesIO(image_bytes))

    if ensure_full_hd:
        # Scale and fit to Full HD (1920x1080) with high-quality Lanczos resampling
        if img.size != FULL_HD_SIZE:
            img = img.resize(FULL_HD_SIZE, Image.Resampling.LANCZOS)

    img.save(output_file, format="PNG")
    print(f"==> Image saved successfully: {output_file} (resolution: {img.size[0]}x{img.size[1]})")
    return output_file
