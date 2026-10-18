"""Cinematic camera zoom and animated highlighter engine for website footage."""

from __future__ import annotations

import math
import subprocess
from pathlib import Path
from typing import Optional

from PIL import Image, ImageDraw, ImageFilter

from .capture import BoundingBox


def _smoothstep(edge0: float, edge1: float, x: float) -> float:
    t = max(0.0, min(1.0, (x - edge0) / (edge1 - edge0)))
    return t * t * (3.0 - 2.0 * t)


def _ease_out_cubic(x: float) -> float:
    return 1.0 - math.pow(1.0 - max(0.0, min(1.0, x)), 3.0)


class WebsiteAnimator:
    """Renders 1080p cinematic camera push-ins with animated highlighter boxes and browser mockups."""

    def __init__(
        self,
        output_width: int = 1920,
        output_height: int = 1080,
        fps: int = 30,
    ) -> None:
        self.width = output_width
        self.height = output_height
        self.fps = fps

    def render(
        self,
        image_path: str | Path,
        output_video_path: str | Path,
        duration: float = 6.0,
        highlight_box: Optional[BoundingBox | dict] = None,
        url_label: str = "openai.com",
        zoom_target: float = 1.65,
        draw_highlight: bool = False,
        highlight_color: tuple[int, int, int] = (255, 214, 0),  # Radiant amber yellow
    ) -> Path:
        """Renders 1080p MP4 with camera easing, optional marker sweep, and browser styling."""
        in_img_path = Path(image_path).resolve()
        out_vid_path = Path(output_video_path).resolve()
        out_vid_path.parent.mkdir(parents=True, exist_ok=True)

        # Load web capture (High-DPI 3840x2160 or similar)
        web_img = Image.open(in_img_path).convert("RGBA")
        src_w, src_h = web_img.size

        # Convert highlight box if dict
        target_box: Optional[BoundingBox] = None
        if isinstance(highlight_box, dict):
            target_box = BoundingBox(
                x=float(highlight_box.get("x", 0)),
                y=float(highlight_box.get("y", 0)),
                width=float(highlight_box.get("width", 0)),
                height=float(highlight_box.get("height", 0)),
            )
        elif isinstance(highlight_box, BoundingBox):
            target_box = highlight_box

        # If no target box, zoom to upper-middle center of the page
        if target_box is None:
            target_box = BoundingBox(
                x=src_w * 0.25,
                y=src_h * 0.35,
                width=src_w * 0.5,
                height=src_h * 0.1,
            )

        box_center_x = target_box.x + target_box.width / 2.0
        box_center_y = target_box.y + target_box.height / 2.0

        total_frames = int(duration * self.fps)

        ffmpeg_cmd = [
            "ffmpeg",
            "-y",
            "-f",
            "rawvideo",
            "-vcodec",
            "rawvideo",
            "-s",
            f"{self.width}x{self.height}",
            "-pix_fmt",
            "rgba",
            "-r",
            str(self.fps),
            "-i",
            "-",
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-preset",
            "medium",
            "-crf",
            "17",
            str(out_vid_path),
        ]

        proc = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE)
        assert proc.stdin is not None

        # Render frame by frame
        for i in range(total_frames):
            progress = i / max(1, total_frames - 1)

            # Camera zoom easing (smoothstep over first 65% of clip, then holds steady)
            cam_t = _smoothstep(0.0, 0.65, progress)
            scale = 1.0 + (zoom_target - 1.0) * cam_t

            # Camera center coordinates: interpolate from screen center to box center
            start_cx = src_w / 2.0
            start_cy = src_h / 2.0
            cur_cx = start_cx + (box_center_x - start_cx) * cam_t
            cur_cy = start_cy + (box_center_y - start_cy) * cam_t

            # Calculate crop rect from high-res image
            crop_w = int(src_w / scale)
            crop_h = int(src_h / scale)

            left = int(max(0, min(src_w - crop_w, cur_cx - crop_w / 2.0)))
            top = int(max(0, min(src_h - crop_h, cur_cy - crop_h / 2.0)))
            right = left + crop_w
            bottom = top + crop_h

            cropped = web_img.crop((left, top, right, bottom))
            frame_img = cropped.resize((self.width, self.height), Image.Resampling.BILINEAR)

            # Animated highlighter sweep (occurs between progress 0.30 and 0.70)
            highlight_progress = _ease_out_cubic(_smoothstep(0.30, 0.70, progress))

            if draw_highlight and highlight_progress > 0.001:
                # Transform target box into current frame viewport coordinates
                scale_x = self.width / crop_w
                scale_y = self.height / crop_h

                fx_x = (target_box.x - left) * scale_x
                fx_y = (target_box.y - top) * scale_y
                fx_w = target_box.width * scale_x
                fx_h = target_box.height * scale_y

                # Add a little padding to the marker box
                pad_x = 8
                pad_y = 6
                h_x0 = fx_x - pad_x
                h_y0 = fx_y - pad_y
                current_w = (fx_w + pad_x * 2) * highlight_progress
                h_x1 = h_x0 + current_w
                h_y1 = fx_y + fx_h + pad_y

                # Draw semi-transparent marker overlay
                overlay = Image.new("RGBA", (self.width, self.height), (0, 0, 0, 0))
                draw = ImageDraw.Draw(overlay)

                # Radiant highlighter fill
                r, g, b = highlight_color
                fill_color = (r, g, b, 70)  # ~27% opacity for clean readability
                border_color = (r, g, b, 190)

                draw.rounded_rectangle(
                    [h_x0, h_y0, h_x1, h_y1],
                    radius=6,
                    fill=fill_color,
                    outline=border_color,
                    width=2,
                )

                # Glowing leading edge of the marker
                if highlight_progress < 0.99:
                    leading_x = h_x1
                    draw.line([leading_x, h_y0 - 2, leading_x, h_y1 + 2], fill=(255, 255, 255, 240), width=3)

                frame_img = Image.alpha_composite(frame_img, overlay)

            # Add modern browser header pill & dark vignette overlay
            vignette = Image.new("RGBA", (self.width, self.height), (0, 0, 0, 0))
            v_draw = ImageDraw.Draw(vignette)

            # Top browser bar
            bar_height = 44
            v_draw.rectangle([0, 0, self.width, bar_height], fill=(13, 17, 28, 230))
            # Traffic light buttons
            v_draw.ellipse([20, 16, 32, 28], fill=(255, 95, 87, 240))
            v_draw.ellipse([38, 16, 50, 28], fill=(254, 188, 46, 240))
            v_draw.ellipse([56, 16, 68, 28], fill=(40, 201, 64, 240))
            # Address bar pill
            pill_w = 420
            pill_x0 = (self.width - pill_w) // 2
            v_draw.rounded_rectangle(
                [pill_x0, 8, pill_x0 + pill_w, 36],
                radius=14,
                fill=(26, 34, 52, 220),
                outline=(50, 65, 95, 180),
                width=1,
            )
            # URL text (rendered in clean sans)
            v_draw.text((pill_x0 + 20, 14), f"🔒 {url_label}", fill=(160, 175, 205, 220))

            # Subtle outer vignette
            v_draw.rectangle([0, 0, self.width, self.height], outline=(0, 0, 0, 90), width=6)

            frame_img = Image.alpha_composite(frame_img, vignette)

            proc.stdin.write(frame_img.tobytes())

        proc.stdin.close()
        proc.wait()

        return out_vid_path
