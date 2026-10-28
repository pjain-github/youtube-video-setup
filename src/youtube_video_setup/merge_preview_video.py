"""Merge multiple scene videos into a full continuous documentary video."""

from __future__ import annotations

import argparse
import subprocess
import tempfile
from pathlib import Path
from typing import List, Optional


def merge_videos(
    video_paths: List[str | Path],
    output_path: str | Path,
    audio_path: Optional[str | Path] = None,
) -> Path:
    """Concatenate video clips into a single video, optionally adding voiceover audio."""
    out_file = Path(output_path).resolve()
    out_file.parent.mkdir(parents=True, exist_ok=True)

    with tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False) as f:
        concat_file = f.name
        for p in video_paths:
            resolved_p = Path(p).resolve()
            f.write(f"file '{resolved_p}'\n")

    try:
        cmd = ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", concat_file]
        if audio_path and Path(audio_path).exists():
            cmd.extend(["-i", str(Path(audio_path).resolve()), "-c:v", "copy", "-c:a", "aac", "-shortest"])
        else:
            cmd.extend(["-c", "copy"])
        cmd.append(str(out_file))

        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if res.returncode != 0:
            raise RuntimeError(f"FFmpeg concat failed:\n{res.stderr}")
    finally:
        if Path(concat_file).exists():
            Path(concat_file).unlink()

    return out_file


def main() -> None:
    parser = argparse.ArgumentParser(description="Merge video clips into a single video")
    parser.add_argument("videos", nargs="+", help="Input video paths")
    parser.add_argument("-o", "--output", required=True, help="Output merged video path")
    parser.add_argument("-a", "--audio", help="Optional audio track to mix")
    args = parser.parse_args()

    out = merge_videos(args.videos, args.output, audio_path=args.audio)
    print(f"Merged video saved to: {out}")


if __name__ == "__main__":
    main()
