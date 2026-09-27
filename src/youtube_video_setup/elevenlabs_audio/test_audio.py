"""Unit tests that do not make calls to the ElevenLabs service."""

from email.message import Message
from pathlib import Path
from unittest.mock import Mock
from urllib.error import HTTPError

import pytest

from .elevenlabs_client import ElevenLabsClient, ElevenLabsError
from .generate_parts import generate_parts, split_text


def test_split_text_obeys_limit_and_keeps_words() -> None:
    parts = split_text("one two three four", max_characters=9)

    assert parts == ["one two", "three", "four"]
    assert all(len(part) <= 9 for part in parts)


def test_text_to_speech_writes_response(tmp_path: Path) -> None:
    response = Mock(content=b"audio")
    response.raise_for_status.return_value = None
    session = Mock()
    session.post.return_value = response
    client = ElevenLabsClient("secret", session=session)

    result = client.text_to_speech("Hello", "voice-1", tmp_path / "speech.mp3")

    assert result.read_bytes() == b"audio"
    session.post.assert_called_once()
    assert session.post.call_args.kwargs["json"]["text"] == "Hello"
    assert session.post.call_args.kwargs["headers"]["xi-api-key"] == "secret"


def test_generate_parts_numbers_outputs(tmp_path: Path) -> None:
    client = Mock()
    client.text_to_speech.side_effect = lambda text, voice, output, **kwargs: output

    paths = generate_parts(
        "first paragraph\n\nsecond paragraph",
        "voice-1",
        tmp_path,
        client=client,
        max_characters=16,
    )

    assert paths == [tmp_path / "part_001.mp3", tmp_path / "part_002.mp3"]
    assert client.text_to_speech.call_count == 2


def test_api_error_is_wrapped(tmp_path: Path) -> None:
    response = Mock(text="not authorized")
    response.raise_for_status.side_effect = HTTPError(
        "", 401, "unauthorized", Message(), None
    )
    response.json.return_value = {"detail": "invalid key"}
    session = Mock()
    session.post.return_value = response
    client = ElevenLabsClient("bad-key", session=session)

    with pytest.raises(ElevenLabsError, match="invalid key"):
        client.text_to_speech("Hello", "voice-1", tmp_path / "speech.mp3")
