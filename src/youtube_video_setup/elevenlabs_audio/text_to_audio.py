"""Text-to-speech convenience function and command-line entry point."""

from __future__ import annotations

import argparse
from pathlib import Path

from .elevenlabs_client import ElevenLabsClient


def text_to_audio(
    text: str,
    voice_id: str,
    output: str | Path,
    *,
    client: ElevenLabsClient | None = None,
    model_id: str = "eleven_multilingual_v2",
) -> Path:
    return (client or ElevenLabsClient()).text_to_speech(
        text, voice_id, output, model_id=model_id
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate an MP3 from text")
    parser.add_argument("text")
    parser.add_argument("voice_id")
    parser.add_argument("output", type=Path)
    parser.add_argument("--model", default="eleven_multilingual_v2")
    args = parser.parse_args()
    path = text_to_audio(args.text, args.voice_id, args.output, model_id=args.model)
    print(path)


if __name__ == "__main__":
    main()

