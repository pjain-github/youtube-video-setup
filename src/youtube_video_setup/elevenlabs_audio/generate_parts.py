"""Split a script into API-sized sections and generate one audio file per part."""

from __future__ import annotations

from pathlib import Path

from .elevenlabs_client import ElevenLabsClient


def split_text(text: str, max_characters: int = 4_000) -> list[str]:
    """Split text on paragraph/word boundaries without losing content."""
    if max_characters < 1:
        raise ValueError("max_characters must be positive")
    paragraphs = [paragraph.strip() for paragraph in text.split("\n\n") if paragraph.strip()]
    parts: list[str] = []
    current = ""
    for paragraph in paragraphs:
        split_paragraph = len(paragraph) > max_characters
        units = paragraph.split() if split_paragraph else [paragraph]
        for unit in units:
            separator = " " if split_paragraph else "\n\n"
            candidate = f"{current}{separator}{unit}" if current else unit
            if len(candidate) <= max_characters:
                current = candidate
            else:
                if current:
                    parts.append(current)
                if len(unit) > max_characters:
                    parts.extend(
                        unit[index : index + max_characters]
                        for index in range(0, len(unit), max_characters)
                    )
                    current = ""
                else:
                    current = unit
    if current:
        parts.append(current)
    return parts


def generate_parts(
    text: str,
    voice_id: str,
    output_directory: str | Path,
    *,
    client: ElevenLabsClient | None = None,
    max_characters: int = 4_000,
    model_id: str = "eleven_multilingual_v2",
) -> list[Path]:
    """Generate numbered MP3 files for every section of ``text``."""
    sections = split_text(text, max_characters)
    if not sections:
        raise ValueError("text cannot be empty")
    destination = Path(output_directory)
    destination.mkdir(parents=True, exist_ok=True)
    api = client or ElevenLabsClient()
    return [
        api.text_to_speech(
            section,
            voice_id,
            destination / f"part_{index:03d}.mp3",
            model_id=model_id,
        )
        for index, section in enumerate(sections, start=1)
    ]
