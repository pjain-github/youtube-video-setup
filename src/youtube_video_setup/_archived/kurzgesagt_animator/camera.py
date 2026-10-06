"""Camera trajectory and easing engine for 2D Kurzgesagt animation."""

from __future__ import annotations

import math
from dataclasses import dataclass
from typing import Tuple


def smoothstep(t: float) -> float:
    """Standard smoothstep easing: 3t^2 - 2t^3."""
    t = max(0.0, min(1.0, t))
    return t * t * (3.0 - 2.0 * t)


def ease_in_out_cubic(t: float) -> float:
    """Cubic ease-in-out curve for smooth documentary camera movement."""
    t = max(0.0, min(1.0, t))
    if t < 0.5:
        return 4.0 * t * t * t
    return 1.0 - math.pow(-2.0 * t + 2.0, 3) / 2.0


def ease_out_back(t: float, overshoot: float = 1.3) -> float:
    """Ease-out with subtle punch/overshoot for snap-zooms."""
    t = max(0.0, min(1.0, t)) - 1.0
    return t * t * ((overshoot + 1.0) * t + overshoot) + 1.0


@dataclass
class CameraFrame:
    """Camera state for a single frame."""
    scale: float
    center_x: float
    center_y: float


class CameraPath:
    """Computes frame-by-frame crop windows for 1920x1080 canvas."""

    def __init__(
        self,
        mode: str = "dolly_in",
        width: int = 1920,
        height: int = 1080,
        start_scale: float = 1.0,
        end_scale: float = 1.25,
        start_center: Tuple[float, float] = (960.0, 540.0),
        end_center: Tuple[float, float] = (960.0, 540.0),
    ) -> None:
        self.mode = mode.lower()
        self.width = width
        self.height = height
        self.start_scale = start_scale
        self.end_scale = end_scale
        self.start_center = start_center
        self.end_center = end_center

    def get_frame(self, t: float) -> CameraFrame:
        """Calculate camera parameters at normalized progress t (0.0 to 1.0)."""
        t = max(0.0, min(1.0, t))

        if self.mode == "snap_zoom":
            # Quick acceleration punch in first 35%, then gentle settle
            if t < 0.35:
                progress = ease_out_back(t / 0.35, overshoot=0.8)
            else:
                progress = 1.0 + 0.05 * math.sin((t - 0.35) * math.pi)
            scale = self.start_scale + (self.end_scale - self.start_scale) * min(1.05, progress)
            cx = self.start_center[0] + (self.end_center[0] - self.start_center[0]) * min(1.0, progress)
            cy = self.start_center[1] + (self.end_center[1] - self.start_center[1]) * min(1.0, progress)
            return CameraFrame(scale=scale, center_x=cx, center_y=cy)

        elif self.mode == "orbit_drift":
            # Gentle breathing drift
            ease_t = smoothstep(t)
            scale = self.start_scale + (self.end_scale - self.start_scale) * ease_t
            drift_x = 25.0 * math.sin(t * 2.0 * math.pi)
            drift_y = 15.0 * math.cos(t * 2.0 * math.pi)
            cx = self.start_center[0] + (self.end_center[0] - self.start_center[0]) * ease_t + drift_x
            cy = self.start_center[1] + (self.end_center[1] - self.start_center[1]) * ease_t + drift_y
            return CameraFrame(scale=scale, center_x=cx, center_y=cy)

        elif self.mode in ("pan", "pan_track"):
            # Directional tracking
            ease_t = ease_in_out_cubic(t)
            scale = self.start_scale + (self.end_scale - self.start_scale) * ease_t
            cx = self.start_center[0] + (self.end_center[0] - self.start_center[0]) * ease_t
            cy = self.start_center[1] + (self.end_center[1] - self.start_center[1]) * ease_t
            return CameraFrame(scale=scale, center_x=cx, center_y=cy)

        else:
            # Default dolly_in / dolly_out
            ease_t = smoothstep(t)
            scale = self.start_scale + (self.end_scale - self.start_scale) * ease_t
            cx = self.start_center[0] + (self.end_center[0] - self.start_center[0]) * ease_t
            cy = self.start_center[1] + (self.end_center[1] - self.start_center[1]) * ease_t
            return CameraFrame(scale=scale, center_x=cx, center_y=cy)
