"""Render Inspect Explainer compositions using Remotion."""

from __future__ import annotations

import argparse
import subprocess
import time
from pathlib import Path

REMOTION_DIR = Path("src/youtube_video_setup/remotion")
VIDEOS_DIR = Path("videos")

ALL_RENDERS = [
    ("FramedGithubSetupInspect", "Framed-GithubSetup.mp4"),
    ("FramedRemotionSetupInspect", "Framed-RemotionSetupPaced.mp4"),
    ("FramedUploadAudioInspect", "Framed-UploadAudio.mp4"),
    ("FramedGeneratingVideoInspect", "Framed-GeneratingVideo.mp4"),
    ("FramedRenderingVideoInspect", "Framed-RenderingVideo.mp4"),
    ("FramedDownloadVideoInspect", "Framed-DownloadVideo.mp4"),
]


def render_composition(comp_id: str, output_filename: str) -> None:
    output_path = VIDEOS_DIR / output_filename
    print(f"\n==========================================")
    print(f"Rendering {comp_id} -> {output_path}")
    print(f"==========================================")
    t0 = time.time()

    cmd = [
        "npx",
        "remotion",
        "render",
        comp_id,
        f"../../../{output_path}",
        "--concurrency=4",
        "--gl=angle",
    ]

    subprocess.run(cmd, cwd=REMOTION_DIR, check=True)
    dur = time.time() - t0
    print(f"Finished {comp_id} in {dur:.1f}s")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--comps", nargs="*", default=None, help="Specific composition IDs to render")
    args = parser.parse_args()

    VIDEOS_DIR.mkdir(parents=True, exist_ok=True)
    t_start = time.time()

    to_render = [
        (c, out) for (c, out) in ALL_RENDERS
        if args.comps is None or c in args.comps
    ]

    for comp_id, out_name in to_render:
        render_composition(comp_id, out_name)

    total_time = time.time() - t_start
    print(f"\nRendered {len(to_render)} compositions successfully in {total_time:.1f}s!")


if __name__ == "__main__":
    main()
