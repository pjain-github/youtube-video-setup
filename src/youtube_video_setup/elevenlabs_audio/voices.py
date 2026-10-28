"""Named ElevenLabs voices so scripts and CLIs can say `--voice-id narrator`."""

from __future__ import annotations

VOICES: dict[str, str] = {
    "narrator": "D9Thk1W7FRMgiOhy3zVI",
    "energetic": "TX3LPaxmHKxFdv7VOQHJ",  # Liam
}


def resolve_voice(name_or_id: str) -> str:
    """Return the voice ID for a registered name, or the input unchanged if it is a raw ID."""
    return VOICES.get(name_or_id.strip().lower(), name_or_id)
