"""Kurzgesagt 2D Animation Engine.

Provides distortion-free, cinematic 2D vector animation for YouTube documentaries:
- Eased camera movements (dolly in/out, pan, tracking, snap zoom, orbit drift)
- Procedural vector accents (pulsing strobe beacons, drifting energy beads, expanding shockwaves, data conduit surges)
- Native 1080p Full HD rendering via FFmpeg at 30/60 fps.
"""

from __future__ import annotations

from .animator import KurzgesagtAnimator

__all__ = ["KurzgesagtAnimator"]
