"""Generate audio parts from a plain-text YouTube script."""

from __future__ import annotations

import argparse
from pathlib import Path

from .generate_parts import generate_parts


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("script", type=Path, help="UTF-8 text script")
    parser.add_argument("voice_id", help="ElevenLabs voice identifier")
    parser.add_argument("--output", type=Path, default=Path("parts"))
    parser.add_argument("--max-characters", type=int, default=4_000)
    parser.add_argument("--model", default="eleven_multilingual_v2")
    args = parser.parse_args()
    paths = generate_parts(
        args.script.read_text(encoding="utf-8"),
        args.voice_id,
        args.output,
        max_characters=args.max_characters,
        model_id=args.model,
    )
    print(f"Generated {len(paths)} audio part(s) in {args.output}")


if __name__ == "__main__":
    main()

