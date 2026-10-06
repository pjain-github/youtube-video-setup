"""Master Command-Line Interface for YouTube Video Pipeline.

Orchestrates the 3 core pillars:
1. ElevenLabs Audio Generation
2. Gemini 1080p Kurzgesagt Image Generation
3. Kurzgesagt 2D Video Animation Engine
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path


def run_audio(script_path: str, output_dir: str = "audio", voice_id: str | None = None) -> None:
    """Generate voiceover audio parts using ElevenLabs."""
    print("==============================================================================")
    print("==> [PILLAR 1/3] ELEVENLABS AUDIO GENERATION...")
    print("==============================================================================")
    from .elevenlabs_audio.main import main as generate_audio_main
    sys.argv = ["generate-elevenlabs-parts", script_path, "--output-dir", output_dir]
    if voice_id:
        sys.argv.extend(["--voice-id", voice_id])
    generate_audio_main()


def run_images(scenes_json: str, output_dir: str = "images", limit: int = 0) -> None:
    """Generate Kurzgesagt 1080p keyframes using Google Gemini Imagen."""
    print("==============================================================================")
    print("==> [PILLAR 2/3] GEMINI 1080P IMAGE GENERATION...")
    print("==============================================================================")
    import json
    from ._archived.gemini_images.generator import generate_image

    with open(scenes_json, "r", encoding="utf-8") as f:
        scenes = json.load(f)

    if limit > 0:
        scenes = scenes[:limit]

    out_path = Path(output_dir)
    out_path.mkdir(parents=True, exist_ok=True)

    print(f"Generating {len(scenes)} keyframe images...")
    for scene in scenes:
        scene_id = scene.get("id", 1)
        prompt = scene.get("prompt", "")
        img_dest = out_path / f"image_{scene_id:03d}.png"
        if img_dest.exists():
            print(f" - Scene {scene_id:03d} image already exists. Skipping.")
            continue
        print(f" - Generating keyframe for Scene {scene_id:03d}...")
        generate_image(prompt=prompt, output_path=img_dest)
    print("==> Image generation complete!")


def run_video(
    scenes_json: str,
    output_dir: str = "videos",
    limit: int = 0,
    fps: int = 30,
    duration: float = 5.0,
) -> None:
    """Render distortion-free Kurzgesagt 2D animations using the KurzgesagtAnimator."""
    print("==============================================================================")
    print("==> [PILLAR 3/3] KURZGESAGT 2D VIDEO ANIMATION ENGINE...")
    print("==============================================================================")
    import json
    from ._archived.kurzgesagt_animator import KurzgesagtAnimator

    animator = KurzgesagtAnimator(width=1920, height=1080, fps=fps)
    with open(scenes_json, "r", encoding="utf-8") as f:
        scenes = json.load(f)

    if limit > 0:
        scenes = scenes[:limit]

    out_path = Path(output_dir)
    out_path.mkdir(parents=True, exist_ok=True)

    print(f"Rendering {len(scenes)} video clips...")
    for scene in scenes:
        scene_id = scene.get("id", 1)
        local_img = scene.get("local_image") or f"images/image_{scene_id:03d}.png"
        if not Path(local_img).exists():
            print(f"Warning: Keyframe {local_img} missing. Skipping scene {scene_id:03d}.")
            continue

        clip_out = out_path / f"scene_{scene_id:03d}_kurzgesagt_1080p.mp4"
        animator.render_scene(
            image_path=local_img,
            output_path=clip_out,
            scene_id=scene_id,
            duration=duration,
        )
    print("==> Video rendering complete!")


def run_merge(videos_dir: str = "videos", output_file: str = "final_video_1080p.mp4", audio_file: str | None = None) -> None:
    """Concatenate rendered video clips into the final video."""
    print("==============================================================================")
    print("==> MERGING VIDEO CLIPS...")
    print("==============================================================================")
    from .merge_preview_video import merge_videos

    video_files = sorted(Path(videos_dir).glob("scene_*_kurzgesagt_1080p.mp4"))
    if not video_files:
        raise FileNotFoundError(f"No rendered clips found in {videos_dir}")

    out = merge_videos(video_files, output_file, audio_path=audio_file)
    print(f"==> Final documentary video saved to: {out}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Master YouTube Video Production Pipeline")
    subparsers = parser.add_subparsers(dest="command", help="Pipeline step to execute")

    # Audio command
    p_audio = subparsers.add_parser("audio", help="Generate ElevenLabs audio voiceover")
    p_audio.add_argument("--script", default="inputs/AI_Models_Going_Rogue_YouTube_Script.md", help="Path to narration script")
    p_audio.add_argument("--output-dir", default="audio", help="Output audio directory")
    p_audio.add_argument("--voice-id", help="Optional ElevenLabs voice ID")

    # Images command
    p_images = subparsers.add_parser("images", help="Generate Gemini 1080p keyframe images")
    p_images.add_argument("--scenes", default="inputs/scenes.json", help="Path to scenes JSON")
    p_images.add_argument("--output-dir", default="images", help="Output images directory")
    p_images.add_argument("--limit", type=int, default=0, help="Limit number of images (0 = all)")

    # Video command
    p_video = subparsers.add_parser("video", help="Render Kurzgesagt 2D animation clips")
    p_video.add_argument("--scenes", default="inputs/scenes.json", help="Path to scenes JSON")
    p_video.add_argument("--output-dir", default="videos", help="Output videos directory")
    p_video.add_argument("--limit", type=int, default=0, help="Limit number of scenes (0 = all)")
    p_video.add_argument("--fps", type=int, default=30, help="Frames per second (default: 30)")
    p_video.add_argument("--duration", type=float, default=5.0, help="Duration per scene in seconds")

    # Merge command
    p_merge = subparsers.add_parser("merge", help="Merge scene clips into final full video")
    p_merge.add_argument("--videos-dir", default="videos", help="Directory of scene clips")
    p_merge.add_argument("-o", "--output", default="final_video_1080p.mp4", help="Output video path")
    p_merge.add_argument("-a", "--audio", help="Optional voiceover audio track")

    # All command
    p_all = subparsers.add_parser("all", help="Run full end-to-end pipeline")
    p_all.add_argument("--scenes", default="inputs/scenes.json")
    p_all.add_argument("--script", default="inputs/AI_Models_Going_Rogue_YouTube_Script.md")
    p_all.add_argument("--limit", type=int, default=5, help="Limit scenes for test run (default: 5, 0 = all)")

    args = parser.parse_args()

    if args.command == "audio":
        run_audio(args.script, args.output_dir, args.voice_id)
    elif args.command == "images":
        run_images(args.scenes, args.output_dir, args.limit)
    elif args.command == "video":
        run_video(args.scenes, args.output_dir, args.limit, args.fps, args.duration)
    elif args.command == "merge":
        run_merge(args.videos_dir, args.output, args.audio)
    elif args.command == "all":
        run_images(args.scenes, limit=args.limit)
        run_video(args.scenes, limit=args.limit)
        run_merge()
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
