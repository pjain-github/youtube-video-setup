"""Generate ElevenLabs narration audio for the Bytesplained Music Video production script."""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import urllib.error
import urllib.request
from pathlib import Path

from youtube_video_setup.elevenlabs_audio.elevenlabs_client import ElevenLabsClient
from youtube_video_setup.elevenlabs_audio.voices import VOICES, resolve_voice

VOICE_ID_DEFAULT = "C1npRmjB19a6yNkEucvx"
SCRIPT_DEFAULT = Path("inputs/Bytesplained Music Video with Claude Code on the Web + Remotion (Production Script).md")
OUTPUT_DIR_DEFAULT = Path("video assets/audio/bytesplained_music_video")


def load_env(env_path: Path = Path(".env")) -> None:
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        k, v = k.strip(), v.strip().strip("\"'")
        if k and k not in os.environ:
            os.environ[k] = v


def extract_narrations(script_file: Path) -> list[dict[str, str]]:
    content = script_file.read_text(encoding="utf-8")
    lines = content.splitlines()

    narrations: list[dict[str, str]] = []
    curr_section_num = 0
    curr_section_title = ""

    for i, line in enumerate(lines):
        sec_match = re.match(r"^##\s+(\d+)\.\s+(.*)$", line.strip())
        if sec_match:
            curr_section_num = int(sec_match.group(1))
            curr_section_title = sec_match.group(2).strip()

        if line.strip().startswith("**Narration"):
            narration_lines: list[str] = []
            j = i + 1
            while j < len(lines) and not lines[j].strip():
                j += 1
            while j < len(lines):
                l = lines[j]
                if l.strip().startswith("## ") or l.strip().startswith("**End screen"):
                    break
                if l.strip() == "":
                    k = j + 1
                    while k < len(lines) and not lines[k].strip():
                        k += 1
                    if k < len(lines) and (lines[k].strip().startswith("**") or lines[k].strip().startswith("##")):
                        break
                narration_lines.append(l)
                j += 1

            raw_text = "\n".join(narration_lines).strip()
            if (raw_text.startswith("\"") and raw_text.endswith("\"")) or (
                raw_text.startswith("“") and raw_text.endswith("”")
            ):
                raw_text = raw_text[1:-1].strip()

            clean_slug = re.sub(r"[^a-z0-9]+", "_", curr_section_title.lower()).strip("_")
            narrations.append(
                {
                    "section_index": curr_section_num,
                    "section_title": curr_section_title,
                    "slug": clean_slug,
                    "text": raw_text,
                }
            )

    return narrations


def concatenate_audio_files(file_list: list[Path], output_path: Path) -> None:
    concat_list_file = output_path.parent / "concat_list.txt"
    with concat_list_file.open("w", encoding="utf-8") as f:
        for file in file_list:
            f.write(f"file '{file.resolve()}'\n")

    cmd = [
        "ffmpeg",
        "-y",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        str(concat_list_file),
        "-c",
        "copy",
        str(output_path),
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    concat_list_file.unlink(missing_ok=True)


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate ElevenLabs narration audio for production script.")
    parser.add_argument("--script", type=Path, default=SCRIPT_DEFAULT, help="Path to production script markdown")
    parser.add_argument("--voice-id", default=VOICE_ID_DEFAULT, help=f"ElevenLabs Voice ID or name ({', '.join(VOICES)})")
    parser.add_argument("--output-dir", type=Path, default=OUTPUT_DIR_DEFAULT, help="Directory to save audio files")
    parser.add_argument("--model", default="eleven_v4", help="ElevenLabs model ID")
    parser.add_argument("--dry-run", action="store_true", help="Print narrations without calling API")
    args = parser.parse_args()
    args.voice_id = resolve_voice(args.voice_id)

    load_env()
    api_key = os.getenv("ELEVENLABS_API_KEY", "")

    narrations = extract_narrations(args.script)
    print(f"Extracted {len(narrations)} narration sections from {args.script}")
    print(f"Voice ID: {args.voice_id}")
    print(f"Model ID: {args.model}")
    print(f"Output directory: {args.output_dir}\n")

    total_chars = sum(len(item["text"]) for item in narrations)
    print(f"Total characters to generate: {total_chars}\n")

    if args.dry_run:
        for item in narrations:
            print(f"--- Part {item['section_index']:02d}: {item['section_title']} ({len(item['text'])} chars) ---")
            print(f"{item['text']}\n")
        return

    if not api_key:
        raise ValueError("ELEVENLABS_API_KEY not found in environment or .env file.")

    args.output_dir.mkdir(parents=True, exist_ok=True)

    client = ElevenLabsClient(api_key=api_key)
    part_files: list[Path] = []
    manifest: list[dict] = []

    for item in narrations:
        idx = item["section_index"]
        slug = item["slug"]
        part_filename = f"part_{idx:02d}_{slug}.mp3"
        part_path = args.output_dir / part_filename

        print(f"Generating Part {idx:02d}/{len(narrations):02d}: {part_filename} ({len(item['text'])} chars)...")
        client.text_to_speech(item["text"], args.voice_id, part_path, model_id=args.model)
        part_files.append(part_path)

        manifest.append(
            {
                "part": idx,
                "section": item["section_title"],
                "file": part_filename,
                "characters": len(item["text"]),
                "text": item["text"],
            }
        )

    # Save manifest
    manifest_path = args.output_dir / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"\nSaved manifest to {manifest_path}")

    # Concatenate all parts to a combined audio file
    full_audio_path = args.output_dir / "full_narration.mp3"
    print(f"Concatenating all parts into {full_audio_path}...")
    concatenate_audio_files(part_files, full_audio_path)
    print(f"Full narration generated successfully at: {full_audio_path}")


if __name__ == "__main__":
    main()
