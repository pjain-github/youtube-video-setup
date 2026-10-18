"""Command-line interface for capturing and animating website videos."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from .capture import WebCapture
from .animator import WebsiteAnimator


def main() -> None:
    parser = argparse.ArgumentParser(description="Website Recording & Cinematic Animation CLI")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # Command: capture
    cap_parser = subparsers.add_parser("capture", help="Capture high-DPI webpage snapshot")
    cap_parser.add_argument("--url", required=True, help="Target URL to snapshot")
    cap_parser.add_argument("--output", required=True, help="Output image file path (PNG)")
    cap_parser.add_argument("--highlight-text", help="Text to locate and calculate bounding box for")
    cap_parser.add_argument("--scale", type=float, default=2.0, help="Device scale factor (default: 2.0)")

    # Command: animate
    anim_parser = subparsers.add_parser("animate", help="Render camera push-in and highlight animation from image")
    anim_parser.add_argument("--image", required=True, help="Path to high-DPI image")
    anim_parser.add_argument("--output", required=True, help="Output MP4 file path")
    anim_parser.add_argument("--meta", help="Optional path to metadata JSON containing highlight_box")
    anim_parser.add_argument("--duration", type=float, default=6.0, help="Video duration in seconds")
    anim_parser.add_argument("--fps", type=int, default=30, help="Video framerate (default: 30)")
    anim_parser.add_argument("--url-label", default="verified-source.com", help="Label displayed in browser bar")
    anim_parser.add_argument("--zoom", type=float, default=1.45, help="Zoom scale factor (default: 1.45)")

    # Command: create (all-in-one)
    create_parser = subparsers.add_parser("create", help="All-in-one capture and cinematic animation")
    create_parser.add_argument("--url", required=True, help="Target URL")
    create_parser.add_argument("--output", required=True, help="Output MP4 file path")
    create_parser.add_argument("--highlight-text", help="Text to locate, zoom into, and highlight")
    create_parser.add_argument("--image-output", help="Optional path to save intermediate PNG snapshot")
    create_parser.add_argument("--duration", type=float, default=6.0, help="Video duration in seconds")
    create_parser.add_argument("--fps", type=int, default=30, help="Video framerate (default: 30)")
    create_parser.add_argument("--zoom", type=float, default=1.45, help="Zoom scale factor (default: 1.45)")

    args = parser.parse_args()

    if args.command == "capture":
        capturer = WebCapture(device_scale_factor=args.scale)
        res = capturer.capture(
            url=args.url,
            output_image_path=args.output,
            highlight_text=args.highlight_text,
        )
        print(f"Captured {res.url} -> {res.image_path}")
        if res.highlight_box:
            print(f"Highlight box located: {res.highlight_box}")

    elif args.command == "animate":
        img_path = Path(args.image)
        box = None
        # Try finding meta json if not specified
        meta_file = Path(args.meta) if args.meta else img_path.with_suffix(".json")
        if meta_file.exists():
            with open(meta_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                box = data.get("highlight_box")

        animator = WebsiteAnimator(fps=args.fps)
        out = animator.render(
            image_path=img_path,
            output_video_path=args.output,
            duration=args.duration,
            highlight_box=box,
            url_label=args.url_label,
            zoom_target=args.zoom,
        )
        print(f"Rendered cinematic video -> {out}")

    elif args.command == "create":
        img_out = args.image_output or f"video assets/images/captured_{Path(args.output).stem}.png"
        capturer = WebCapture(device_scale_factor=2.0)
        print(f"==> Step 1: Capturing {args.url} in 4K...")
        res = capturer.capture(
            url=args.url,
            output_image_path=img_out,
            highlight_text=args.highlight_text,
        )
        print(f"Snapshot saved: {res.image_path}")

        from urllib.parse import urlparse
        domain = urlparse(args.url).netloc or args.url

        print(f"==> Step 2: Animating cinematic push-in and highlighter ({args.duration}s)...")
        animator = WebsiteAnimator(fps=args.fps)
        out = animator.render(
            image_path=res.image_path,
            output_video_path=args.output,
            duration=args.duration,
            highlight_box=res.highlight_box,
            url_label=domain,
            zoom_target=args.zoom,
        )
        print(f"==> SUCCESS: Created {out}")


if __name__ == "__main__":
    main()
