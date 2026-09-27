"""Speech-to-speech convenience function and command-line entry point."""

from __future__ import annotations

import argparse
from pathlib import Path

from .elevenlabs_client import ElevenLabsClient


def audio_to_audio(
    audio: str | Path,
    voice_id: str,
    output: str | Path,
    *,
    client: ElevenLabsClient | None = None,
    model_id: str = "eleven_english_sts_v2",
) -> Path:
    return (client or ElevenLabsClient()).speech_to_speech(
        audio, voice_id, output, model_id=model_id
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Transform a recording's voice")
    parser.add_argument("audio", type=Path)
    parser.add_argument("voice_id")
    parser.add_argument("output", type=Path)
    parser.add_argument("--model", default="eleven_english_sts_v2")
    args = parser.parse_args()
    path = audio_to_audio(args.audio, args.voice_id, args.output, model_id=args.model)
    print(path)


if __name__ == "__main__":
    main()

