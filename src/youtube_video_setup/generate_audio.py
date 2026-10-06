"""Generate one ElevenLabs MP3 file from a text script."""

from __future__ import annotations

import argparse
from pathlib import Path

from .elevenlabs_audio.elevenlabs_client import ElevenLabsClient


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("script", type=Path, help="UTF-8 text file containing the narration")
    parser.add_argument("voice_id", help="ElevenLabs voice identifier")
    parser.add_argument("output", type=Path, help="Output MP3 path")
    parser.add_argument("--model", default="eleven_multilingual_v2")
    args = parser.parse_args()

    text = args.script.read_text(encoding="utf-8")
    output = ElevenLabsClient().text_to_speech(
        text,
        args.voice_id,
        args.output,
        model_id=args.model,
    )
    print(f"Generated {output}")


if __name__ == "__main__":
    main()
