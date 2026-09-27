"""Small, dependency-light client for the ElevenLabs audio API."""

from __future__ import annotations

import json
import os
import uuid
from collections.abc import Mapping
from email.message import Message
from pathlib import Path
from typing import Any, Protocol
from urllib.error import HTTPError
from urllib.request import Request, urlopen


class Response(Protocol):
    content: bytes
    text: str

    def raise_for_status(self) -> None: ...

    def json(self) -> Any: ...


class _UrlResponse:
    def __init__(self, content: bytes, status: int) -> None:
        self.content = content
        self.status = status
        self.text = content.decode("utf-8", errors="replace")

    def raise_for_status(self) -> None:
        if self.status >= 400:
            raise HTTPError("", self.status, self.text, Message(), None)

    def json(self) -> Any:
        return json.loads(self.text)


class _UrlSession:
    """Minimal requests-like transport, implemented with the standard library."""

    def post(self, url: str, **kwargs: Any) -> _UrlResponse:
        headers = kwargs.get("headers", {})
        if "json" in kwargs:
            body = json.dumps(kwargs["json"]).encode()
        else:
            boundary = uuid.uuid4().hex
            headers = {**headers, "content-type": f"multipart/form-data; boundary={boundary}"}
            chunks: list[bytes] = []
            for name, value in kwargs.get("data", {}).items():
                disposition = (
                    f"--{boundary}\r\nContent-Disposition: form-data; "
                    f'name="{name}"\r\n\r\n{value}\r\n'
                )
                chunks.append(
                    disposition.encode()
                )
            for name, (filename, stream, content_type) in kwargs.get("files", {}).items():
                disposition = (
                    f"--{boundary}\r\nContent-Disposition: form-data; "
                    f'name="{name}"; filename="{filename}"\r\n'
                    f"Content-Type: {content_type}\r\n\r\n"
                )
                chunks.append(
                    disposition.encode()
                    + stream.read()
                    + b"\r\n"
                )
            chunks.append(f"--{boundary}--\r\n".encode())
            body = b"".join(chunks)
        request = Request(url, data=body, headers=headers, method="POST")
        try:
            with urlopen(request, timeout=kwargs.get("timeout")) as response:
                return _UrlResponse(response.read(), response.status)
        except HTTPError as exc:
            return _UrlResponse(exc.read(), exc.code)


class ElevenLabsError(RuntimeError):
    """Raised when ElevenLabs rejects a request."""


class ElevenLabsClient:
    """Create audio with ElevenLabs using an API key from the environment."""

    def __init__(
        self,
        api_key: str | None = None,
        *,
        base_url: str = "https://api.elevenlabs.io/v1",
        timeout: float = 120,
        session: Any | None = None,
    ) -> None:
        resolved_api_key = api_key or os.getenv("ELEVENLABS_API_KEY", "")
        if not resolved_api_key:
            raise ValueError("Set ELEVENLABS_API_KEY or pass api_key explicitly")
        self.api_key = resolved_api_key
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.session = session or _UrlSession()

    @property
    def headers(self) -> dict[str, str]:
        return {"xi-api-key": self.api_key, "accept": "audio/mpeg"}

    def _save_response(self, response: Response, output: str | Path) -> Path:
        try:
            response.raise_for_status()
        except HTTPError as exc:
            try:
                detail = response.json().get("detail", response.text)
            except (ValueError, AttributeError):
                detail = response.text
            raise ElevenLabsError(f"ElevenLabs request failed: {detail}") from exc

        destination = Path(output)
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(response.content)
        return destination

    def text_to_speech(
        self,
        text: str,
        voice_id: str,
        output: str | Path,
        *,
        model_id: str = "eleven_multilingual_v2",
        voice_settings: Mapping[str, Any] | None = None,
    ) -> Path:
        """Synthesize ``text`` and save the returned MP3."""
        if not text.strip():
            raise ValueError("text cannot be empty")
        payload: dict[str, Any] = {"text": text, "model_id": model_id}
        if voice_settings:
            payload["voice_settings"] = dict(voice_settings)
        response = self.session.post(
            f"{self.base_url}/text-to-speech/{voice_id}",
            headers={**self.headers, "content-type": "application/json"},
            json=payload,
            timeout=self.timeout,
        )
        return self._save_response(response, output)

    def speech_to_speech(
        self,
        audio: str | Path,
        voice_id: str,
        output: str | Path,
        *,
        model_id: str = "eleven_english_sts_v2",
    ) -> Path:
        """Transform a recording into ``voice_id`` and save the returned MP3."""
        source = Path(audio)
        if not source.is_file():
            raise FileNotFoundError(source)
        with source.open("rb") as audio_file:
            response = self.session.post(
                f"{self.base_url}/speech-to-speech/{voice_id}",
                headers=self.headers,
                data={"model_id": model_id},
                files={"audio": (source.name, audio_file, "application/octet-stream")},
                timeout=self.timeout,
            )
        return self._save_response(response, output)
