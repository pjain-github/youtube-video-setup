"""Core Animation Engine for Kurzgesagt 2D Scenes."""

from __future__ import annotations

import os
import subprocess
import time
from pathlib import Path
from typing import Any, Dict, Optional
from PIL import Image

from .camera import CameraPath
from .fx import (
    ConduitSurgeEffect,
    FractureBeadsEffect,
    NetworkBroadcastEffect,
    ShockwaveBurstEffect,
    StrobeBeaconEffect,
)


# Default presets matching the scenes in the documentary
SCENE_PRESETS: Dict[int, Dict[str, Any]] = {
    1: {
        "camera_mode": "dolly_in",
        "start_scale": 1.0,
        "end_scale": 1.25,
        "start_center": (960.0, 540.0),
        "end_center": (960.0, 480.0),
        "effect_type": "strobe_beacon",
        "effect_target": (954.0, 263.0),
    },
    2: {
        "camera_mode": "dolly_in",
        "start_scale": 1.0,
        "end_scale": 1.30,
        "start_center": (960.0, 540.0),
        "end_center": (720.0, 460.0),
        "effect_type": "fracture_beads",
        "effect_target": (720.0, 460.0),
    },
    3: {
        "camera_mode": "snap_zoom",
        "start_scale": 1.0,
        "end_scale": 1.28,
        "start_center": (960.0, 540.0),
        "end_center": (880.0, 550.0),
        "effect_type": "shockwave_burst",
        "effect_target": (880.0, 550.0),
    },
    4: {
        "camera_mode": "pan_track",
        "start_scale": 1.10,
        "end_scale": 1.18,
        "start_center": (750.0, 600.0),
        "end_center": (1150.0, 500.0),
        "effect_type": "conduit_surge",
        "effect_target": (960.0, 540.0),
    },
    5: {
        "camera_mode": "orbit_drift",
        "start_scale": 1.0,
        "end_scale": 1.15,
        "start_center": (960.0, 540.0),
        "end_center": (1200.0, 500.0),
        "effect_type": "network_broadcast",
        "effect_target": (1380.0, 480.0),
    },
}


class KurzgesagtAnimator:
    """Renders 1080p distortion-free 2D vector animation clips from scene keyframes."""

    def __init__(self, width: int = 1920, height: int = 1080, fps: int = 30) -> None:
        self.width = width
        self.height = height
        self.fps = fps

    def render_scene(
        self,
        image_path: str | Path,
        output_path: str | Path,
        scene_id: int = 1,
        duration: float = 5.0,
        config_override: Optional[Dict[str, Any]] = None,
    ) -> Path:
        """Render a single scene clip with camera motion and vector FX."""
        img_file = Path(image_path).resolve()
        if not img_file.exists():
            raise FileNotFoundError(f"Input keyframe not found: {img_file}")

        out_file = Path(output_path).resolve()
        out_file.parent.mkdir(parents=True, exist_ok=True)

        config = SCENE_PRESETS.get(scene_id, {
            "camera_mode": "dolly_in",
            "start_scale": 1.0,
            "end_scale": 1.20,
            "start_center": (960.0, 540.0),
            "end_center": (960.0, 540.0),
            "effect_type": None,
        })
        if config_override:
            config.update(config_override)

        t_start = time.time()
        print(f"==> Rendering Scene {scene_id:03d}: {out_file.name} ({duration}s @ {self.fps}fps)...")

        base_img = Image.open(img_file).convert("RGBA").resize(
            (self.width, self.height), Image.Resampling.LANCZOS
        )

        camera = CameraPath(
            mode=config["camera_mode"],
            width=self.width,
            height=self.height,
            start_scale=config["start_scale"],
            end_scale=config["end_scale"],
            start_center=config["start_center"],
            end_center=config["end_center"],
        )

        fx_handler = None
        fx_type = config.get("effect_type")
        target_x, target_y = config.get("effect_target", (960.0, 540.0))

        if fx_type == "strobe_beacon":
            fx_handler = StrobeBeaconEffect(base_x=target_x, base_y=target_y)
        elif fx_type == "fracture_beads":
            fx_handler = FractureBeadsEffect(origin_x=target_x, origin_y=target_y)
        elif fx_type == "shockwave_burst":
            fx_handler = ShockwaveBurstEffect(center_x=target_x, center_y=target_y)
        elif fx_type == "conduit_surge":
            fx_handler = ConduitSurgeEffect()
        elif fx_type == "network_broadcast":
            fx_handler = NetworkBroadcastEffect(hub_x=target_x, hub_y=target_y)

        total_frames = int(duration * self.fps)

        ffmpeg_cmd = [
            "ffmpeg", "-y",
            "-f", "rawvideo",
            "-vcodec", "rawvideo",
            "-s", f"{self.width}x{self.height}",
            "-pix_fmt", "rgba",
            "-r", str(self.fps),
            "-i", "-",
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-preset", "medium",
            "-crf", "18",
            str(out_file),
        ]

        proc = subprocess.Popen(
            ffmpeg_cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE
        )

        for i in range(total_frames):
            norm_t = i / max(1, total_frames - 1)
            time_sec = i / self.fps
            cam = camera.get_frame(norm_t)

            crop_w = int(self.width / cam.scale)
            crop_h = int(self.height / cam.scale)

            x1 = max(0, min(self.width - crop_w, int(cam.center_x - crop_w / 2)))
            y1 = max(0, min(self.height - crop_h, int(cam.center_y - crop_h / 2)))

            frame = base_img.crop((x1, y1, x1 + crop_w, y1 + crop_h)).resize(
                (self.width, self.height), Image.Resampling.LANCZOS
            )

            # Apply procedural vector FX layer
            if fx_handler is not None:
                fx_layer = Image.new("RGBA", (self.width, self.height), (0, 0, 0, 0))
                # Map target world coordinate to current screen coordinate
                screen_tx = (target_x - x1) * (self.width / crop_w)
                screen_ty = (target_y - y1) * (self.height / crop_h)

                if fx_type == "conduit_surge":
                    fx_handler.draw(fx_layer, self.width, self.height, time_sec)
                else:
                    fx_handler.draw(fx_layer, screen_tx, screen_ty, time_sec)

                frame = Image.alpha_composite(frame, fx_layer)

            proc.stdin.write(frame.tobytes())

        proc.stdin.close()
        stderr_output = proc.stderr.read().decode("utf-8", errors="ignore")
        proc.wait()

        if proc.returncode != 0:
            raise RuntimeError(f"FFmpeg failed with exit code {proc.returncode}:\n{stderr_output}")

        elapsed = time.time() - t_start
        print(f"==> Scene {scene_id:03d} completed in {elapsed:.1f}s -> {out_file} ({os.path.getsize(out_file):,} bytes)")
        return out_file
