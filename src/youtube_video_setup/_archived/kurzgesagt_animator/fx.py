"""Procedural 2D Vector Effects for Kurzgesagt Animation.

Implements vibrant, clean vector visual accents:
- StrobeBeaconEffect: Pulsing emergency alarm beacons with expanding neon glow rings.
- FractureBeadsEffect: Floating, bubbling cyan & orange energy particles emerging from cracks.
- ShockwaveBurstEffect: Expanding circular radar shockwaves and particle bursts.
- ConduitSurgeEffect: Rapidly pulsing data packets rushing along fiber/network conduits.
- NetworkBroadcastEffect: Concentric signal rings radiating outward from network hubs.
"""

from __future__ import annotations

import math
import random
from typing import List, Tuple
from PIL import Image, ImageDraw


class StrobeBeaconEffect:
    """Animated emergency strobe light with expanding neon glow rings."""

    def __init__(
        self,
        base_x: float = 954.0,
        base_y: float = 263.0,
        frequency_hz: float = 1.8,
        color_rgb: Tuple[int, int, int] = (255, 0, 85),
    ) -> None:
        self.base_x = base_x
        self.base_y = base_y
        self.freq = frequency_hz
        self.color = color_rgb

    def draw(self, layer: Image.Image, screen_x: float, screen_y: float, time_sec: float) -> None:
        phase = time_sec * 2.0 * math.pi * self.freq
        pulse = (math.sin(phase) + 1.0) / 2.0  # 0.0 to 1.0

        if pulse < 0.12:
            return

        draw = ImageDraw.Draw(layer)
        max_r = int(70 + 140 * pulse)
        alpha_base = int(120 * pulse)

        for r in range(max_r, 10, -8):
            ring_alpha = int(alpha_base * (1.0 - (r / max_r) ** 0.8))
            draw.ellipse(
                (screen_x - r, screen_y - r, screen_x + r, screen_y + r),
                fill=(*self.color, ring_alpha),
            )

        core_r = int(22 + 10 * pulse)
        draw.ellipse(
            (screen_x - core_r, screen_y - core_r, screen_x + core_r, screen_y + core_r),
            fill=(255, 120, 180, int(180 * pulse)),
        )


class FractureBeadsEffect:
    """Floating, playful cyan and orange energy droplets escaping from a breach."""

    def __init__(self, origin_x: float = 720.0, origin_y: float = 460.0) -> None:
        self.ox = origin_x
        self.oy = origin_y
        # Seed deterministic particles
        rnd = random.Random(42)
        self.particles = []
        for _ in range(28):
            angle = rnd.uniform(-0.6, 0.4) * math.pi  # Escape toward upper-right into space
            speed = rnd.uniform(60.0, 180.0)
            radius = rnd.uniform(5.0, 16.0)
            color = (0, 245, 255) if rnd.random() > 0.35 else (255, 102, 0)
            offset = rnd.uniform(0.0, 4.0)
            self.particles.append((angle, speed, radius, color, offset))

    def draw(self, layer: Image.Image, screen_ox: float, screen_oy: float, time_sec: float) -> None:
        draw = ImageDraw.Draw(layer)
        for angle, speed, r, color, offset in self.particles:
            lifetime = 2.5
            age = (time_sec + offset) % lifetime
            dist = speed * age
            alpha = int(240 * (1.0 - (age / lifetime) ** 1.2))

            px = screen_ox + dist * math.cos(angle)
            py = screen_oy + dist * math.sin(angle) - 15.0 * age  # Slight upward float

            # Outer soft glow
            glow_r = int(r * 1.8)
            draw.ellipse(
                (px - glow_r, py - glow_r, px + glow_r, py + glow_r),
                fill=(*color, alpha // 3),
            )
            # Solid vector core
            draw.ellipse(
                (px - r, py - r, px + r, py + r),
                fill=(*color, alpha),
            )


class ShockwaveBurstEffect:
    """Concentric expanding radar shockwave rings radiating from an unlocked lock."""

    def __init__(self, center_x: float = 880.0, center_y: float = 550.0) -> None:
        self.cx = center_x
        self.cy = center_y

    def draw(self, layer: Image.Image, screen_cx: float, screen_cy: float, time_sec: float) -> None:
        draw = ImageDraw.Draw(layer)
        # 3 waves expanding cyclically
        for wave_idx in range(3):
            wave_time = (time_sec + wave_idx * 0.8) % 2.4
            progress = wave_time / 2.4
            r = int(50 + 650 * progress)
            alpha = int(180 * (1.0 - progress))
            thickness = max(2, int(8 * (1.0 - progress)))

            color = (0, 245, 255) if wave_idx % 2 == 0 else (255, 215, 0)

            # Draw smooth circle stroke
            draw.ellipse(
                (screen_cx - r, screen_cy - r, screen_cx + r, screen_cy + r),
                outline=(*color, alpha),
                width=thickness,
            )


class ConduitSurgeEffect:
    """Surging electric cyan and lime data packets racing along data conduit lines."""

    def __init__(self) -> None:
        rnd = random.Random(99)
        self.packets = []
        for _ in range(24):
            speed = rnd.uniform(0.35, 0.65)
            offset = rnd.uniform(0.0, 1.0)
            size = rnd.uniform(8.0, 18.0)
            color = (0, 245, 255) if rnd.random() > 0.3 else (140, 255, 50)
            self.packets.append((speed, offset, size, color))

    def draw(self, layer: Image.Image, screen_w: int, screen_h: int, time_sec: float) -> None:
        draw = ImageDraw.Draw(layer)
        for speed, offset, size, color in self.packets:
            t = (time_sec * speed + offset) % 1.0
            # Curve path: from bottom-left (300, 950) curving to (1050, 520) then into (1550, 520)
            if t < 0.6:
                norm_t = t / 0.6
                px = 250 + (1050 - 250) * norm_t
                # Arc curve
                py = 950 - 430 * math.sin(norm_t * math.pi / 2.0)
            else:
                norm_t = (t - 0.6) / 0.4
                px = 1050 + (1550 - 1050) * norm_t
                py = 520 + 120 * math.sin(norm_t * math.pi * 1.5)

            draw.rounded_rectangle(
                (px - size * 1.5, py - size / 2, px + size * 1.5, py + size / 2),
                radius=int(size / 2),
                fill=(*color, 200),
            )


class NetworkBroadcastEffect:
    """Concentric signal broadcast rings expanding from the yellow Hub across the map."""

    def __init__(self, hub_x: float = 1380.0, hub_y: float = 480.0) -> None:
        self.hx = hub_x
        self.hy = hub_y

    def draw(self, layer: Image.Image, screen_hx: float, screen_hy: float, time_sec: float) -> None:
        draw = ImageDraw.Draw(layer)
        # Pulse rings outward
        for ring_idx in range(4):
            ring_time = (time_sec + ring_idx * 0.7) % 2.8
            progress = ring_time / 2.8
            r = int(120 + 550 * progress)
            alpha = int(160 * (1.0 - progress))
            color = (255, 215, 0) if ring_idx % 2 == 0 else (0, 245, 255)

            draw.ellipse(
                (screen_hx - r, screen_hy - r, screen_hx + r, screen_hy + r),
                outline=(*color, alpha),
                width=max(2, int(6 * (1.0 - progress))),
            )
