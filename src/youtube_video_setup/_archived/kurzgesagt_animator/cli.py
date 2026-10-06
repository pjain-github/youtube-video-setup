"""Command-line interface for Kurzgesagt 2D Animator."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Optional

from .animator import KurzgesagtAnimator


def main() -> None:
    parser = argparse.ArgumentParser(description="Render Kurzgesagt 2D animation clips from images")
    parser.add_argument("--image", help="Path to input keyframe PNG image")
    parser.add_argument("-o", "--output", help="Path to output MP4 video")
    parser.add_argument("--scene-id", type=int, default=1, help="Scene ID preset (1 to 5)")
    parser.add_argument("--duration", type=float, default=5.0, help="Duration in seconds (default: 5.0)")
    parser.add_argument("--fps", type=int, default=30, help="Frames per second (default: 30)")
    parser.add_argument("--scenes-json", help="Batch render scenes from scenes.json")
    parser.add_argument("--output-dir", default="video_output_upscaled", help="Output directory for batch")
    parser.add_argument("--limit", type=int, default=0, help="Limit number of scenes to render in batch (0 = all)")
    args = parser.parse_args()

    animator = KurzgesagtAnimator(width=1920, height=1080, fps=args.fps)

    # Batch mode
    if args.scenes_json:
        scenes_path = Path(args.scenes_json)
        if not scenes_path.exists():
            raise FileNotFoundError(f"Scenes JSON not found: {scenes_path}")

        with open(scenes_path, "r", encoding="utf-8") as f:
            scenes = json.load(f)

        if args.limit > 0:
            scenes = scenes[:args.limit]

        out_dir = Path(args.output_dir)
        out_dir.mkdir(parents=True, exist_ok=True)

        print(f"==> Batch rendering {len(scenes)} scenes...")
        for scene in scenes:
            scene_id = scene.get("id", 1)
            # Find local image
            local_img = scene.get("local_image") or f"image_output/image_{scene_id:03d}.png"
            if not Path(local_img).exists():
                print(f"Warning: Image {local_img} missing. Skipping scene {scene_id}.")
                continue

            out_file = out_dir / f"scene_{scene_id:03d}_kurzgesagt_1080p.mp4"
            animator.render_scene(
                image_path=local_img,
                output_path=out_file,
                scene_id=scene_id,
                duration=args.duration,
            )
        print("==> Batch rendering complete!")
        return

    # Single scene mode
    if not args.image or not args.output:
        parser.error("Single scene mode requires both --image and --output arguments (or use --scenes-json).")

    animator.render_scene(
        image_path=args.image,
        output_path=args.output,
        scene_id=args.scene_id,
        duration=args.duration,
    )


if __name__ == "__main__":
    main()
