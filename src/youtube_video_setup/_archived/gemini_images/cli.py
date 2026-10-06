"""Command line interface for generating images with Gemini."""

from __future__ import annotations

import argparse
import sys
from datetime import datetime
from pathlib import Path

from youtube_video_setup._archived.gemini_images.generator import (
    DEFAULT_MODEL,
    FALLBACK_MODEL,
    generate_image,
)


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate Full HD 2D vector images using Gemini")
    parser.add_argument("prompt", help="Text prompt describing the scene to generate")
    parser.add_argument(
        "--output",
        "-o",
        default=None,
        help="Target output image file path (default: image_output/gemini_<timestamp>.png)",
    )
    parser.add_argument(
        "--model",
        "-m",
        default=DEFAULT_MODEL,
        choices=[DEFAULT_MODEL, FALLBACK_MODEL],
        help=f"Gemini image model to use (default: {DEFAULT_MODEL})",
    )
    parser.add_argument(
        "--native-res",
        action="store_true",
        help="Do not upscale to Full HD (1920x1080), keep native model resolution",
    )
    args = parser.parse_args()

    if not args.output:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        args.output = f"image_output/gemini_{timestamp}.png"

    try:
        saved_path = generate_image(
            prompt=args.prompt,
            output_path=args.output,
            model=args.model,
            ensure_full_hd=not args.native_res,
        )
        print(f"Done! Image generated at: {saved_path}")
    except Exception as e:
        print(f"Error generating image: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
