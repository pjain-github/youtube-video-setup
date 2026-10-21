import base64
import json

from youtube_video_setup.elevenlabs_audio.elevenlabs_client import (
    ElevenLabsClient,
    alignment_to_words,
)

ALIGNMENT = {
    "characters": list("Hi you\n\nGo"),
    "character_start_times_seconds": [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
    "character_end_times_seconds": [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
}


class FakeResponse:
    def __init__(self, payload: dict) -> None:
        self.content = json.dumps(payload).encode()
        self.text = self.content.decode()
        self._payload = payload

    def raise_for_status(self) -> None: ...

    def json(self) -> dict:
        return self._payload


class FakeSession:
    def __init__(self) -> None:
        self.calls: list[tuple[str, dict]] = []

    def post(self, url: str, **kwargs):
        self.calls.append((url, kwargs))
        audio = base64.b64encode(b"mp3-bytes").decode()
        return FakeResponse({"audio_base64": audio, "alignment": ALIGNMENT})


def test_alignment_to_words_groups_characters() -> None:
    assert alignment_to_words(ALIGNMENT) == [
        {"text": "Hi", "start": 0.0, "end": 0.2},
        {"text": "you", "start": 0.3, "end": 0.6},
        {"text": "Go", "start": 0.8, "end": 1.0},
    ]


def test_text_to_speech_with_timestamps_saves_audio_and_returns_words(tmp_path) -> None:
    session = FakeSession()
    client = ElevenLabsClient("key", session=session)
    out = tmp_path / "part.mp3"

    words = client.text_to_speech_with_timestamps("Hi you\n\nGo", "voice", out)

    assert out.read_bytes() == b"mp3-bytes"
    assert [w["text"] for w in words] == ["Hi", "you", "Go"]
    url, kwargs = session.calls[0]
    assert url.endswith("/text-to-speech/voice/with-timestamps")
    assert kwargs["headers"]["accept"] == "application/json"
