"""Website video recording and cinematic highlight animation engine.

Provides automated 4K/high-DPI website snapshotting via Playwright and
cinematic camera zoom/animated text highlighting.
"""

from __future__ import annotations

from .capture import WebCapture, CaptureResult
from .animator import WebsiteAnimator
from .tweet_video import TweetData, TweetAnimator

__all__ = ["WebCapture", "CaptureResult", "WebsiteAnimator", "TweetData", "TweetAnimator"]
