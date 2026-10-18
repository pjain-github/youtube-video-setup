"""Twitter/X post card generation and 3D cinematic video animator."""

from __future__ import annotations

import math
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

from PIL import Image, ImageDraw, ImageFilter
from playwright.sync_api import sync_playwright, ViewportSize


@dataclass
class TweetData:
    author_name: str
    author_handle: str
    avatar_color: str
    avatar_letter: str
    verified: bool
    text: str
    timestamp: str
    views: str
    reposts: str
    likes: str
    highlight_phrase: Optional[str] = None
    warning_rings: bool = False
    background_theme: str = "dark"  # dark, golden, cyber


def generate_tweet_html(tweet: TweetData) -> str:
    """Generates authentic dark-mode Twitter/X HTML card."""
    formatted_text = tweet.text
    if tweet.highlight_phrase and tweet.highlight_phrase in formatted_text:
        formatted_text = formatted_text.replace(
            tweet.highlight_phrase,
            f'<span class="highlight">{tweet.highlight_phrase}</span>'
        )

    return f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    background: #060913;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #E7E9EA;
    overflow: hidden;
  }}
  .background-glow {{
    position: absolute;
    width: 900px;
    height: 600px;
    background: radial-gradient(circle, rgba(29, 155, 240, 0.12) 0%, rgba(6, 9, 19, 0) 70%);
    z-index: 1;
  }}
  .tweet-card {{
    position: relative;
    z-index: 2;
    width: 960px;
    background: #000000;
    border: 1px solid #2F3336;
    border-radius: 20px;
    padding: 36px 40px;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(29, 155, 240, 0.08);
  }}
  .header {{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }}
  .user-info {{
    display: flex;
    align-items: center;
    gap: 16px;
  }}
  .avatar {{
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: {tweet.avatar_color};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: 700;
    color: #ffffff;
    box-shadow: 0 4px 14px rgba(0,0,0,0.4);
  }}
  .names {{
    display: flex;
    flex-direction: column;
    gap: 4px;
  }}
  .name-row {{
    display: flex;
    align-items: center;
    gap: 8px;
  }}
  .display-name {{
    font-size: 26px;
    font-weight: 700;
    color: #F7F9F9;
  }}
  .badge {{
    width: 22px;
    height: 22px;
    fill: #1D9BF0;
  }}
  .handle {{
    font-size: 20px;
    color: #71767B;
  }}
  .x-logo {{
    width: 28px;
    height: 28px;
    fill: #E7E9EA;
  }}
  .tweet-text {{
    font-size: 30px;
    line-height: 1.45;
    font-weight: 400;
    color: #F7F9F9;
    margin-bottom: 28px;
    letter-spacing: -0.2px;
  }}
  .highlight {{
    background: rgba(255, 214, 0, 0.22);
    border: 1px solid rgba(255, 214, 0, 0.6);
    border-radius: 6px;
    padding: 2px 8px;
    color: #FFE66D;
  }}
  .meta-row {{
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 18px;
    color: #71767B;
    padding-bottom: 24px;
    border-bottom: 1px solid #2F3336;
    margin-bottom: 24px;
  }}
  .stats-row {{
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 19px;
    color: #71767B;
  }}
  .stat-group {{
    display: flex;
    align-items: center;
    gap: 10px;
  }}
  .stat-value {{
    font-weight: 700;
    color: #E7E9EA;
  }}
  .icon {{
    width: 22px;
    height: 22px;
    fill: #71767B;
  }}
</style>
</head>
<body>
  <div class="background-glow"></div>
  <div class="tweet-card">
    <div class="header">
      <div class="user-info">
        <div class="avatar">{tweet.avatar_letter}</div>
        <div class="names">
          <div class="name-row">
            <span class="display-name">{tweet.author_name}</span>
            <svg class="badge" viewBox="0 0 24 24"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.575 9.55.7 10.92.7 12.5c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238 1.05 1.273 2.42 2.148 4 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-1.05 2.148-2.42 2.148-4zM10.2 16.5l-4-4 1.4-1.4 2.6 2.6 6.6-6.6 1.4 1.4-8 8z"></path></g></svg>
          </div>
          <span class="handle">{tweet.author_handle}</span>
        </div>
      </div>
      <svg class="x-logo" viewBox="0 0 24 24"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
    </div>

    <div class="tweet-text">
      {formatted_text}
    </div>

    <div class="meta-row">
      <span>{tweet.timestamp}</span>
      <span>·</span>
      <span><strong class="stat-value">{tweet.views}</strong> Views</span>
    </div>

    <div class="stats-row">
      <div class="stat-group">
        <svg class="icon" viewBox="0 0 24 24"><g><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.245c-4.42 0-8.005-3.58-8.005-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6.01 0 3.31 2.688 6.01 6.005 6.01h2.245v2.22l4.825-2.67c1.99-1.1 3.226-3.2 3.226-5.45 0-3.38-2.75-6.12-6.129-6.12H9.756z"></path></g></svg>
        <span>428</span>
      </div>
      <div class="stat-group">
        <svg class="icon" viewBox="0 0 24 24"><g><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></g></svg>
        <span>{tweet.reposts}</span>
      </div>
      <div class="stat-group">
        <svg class="icon" viewBox="0 0 24 24"><g><path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.505.3-.505-.3c-4.378-2.55-7.028-5.19-8.379-7.67-1.336-2.46-1.077-5.18.529-6.8 1.624-1.64 4.195-1.79 6.208-.34l1.147.83 1.147-.83c2.013-1.45 4.584-1.3 6.208.34 1.606 1.62 1.865 4.34.529 6.8z"></path></g></svg>
        <span>{tweet.likes}</span>
      </div>
      <div class="stat-group">
        <svg class="icon" viewBox="0 0 24 24"><g><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v16.73c0 .54-.44.97-.98.97-.24 0-.47-.09-.64-.25L12 16.58l-6.38 5.37c-.17.16-.4.25-.64.25-.54 0-.98-.43-.98-.97V4.5z"></path></g></svg>
        <span>2,190</span>
      </div>
    </div>
  </div>
</body>
</html>"""


class TweetAnimator:
    """Renders high-DPI Twitter/X cards into cinematic Full HD 1080p MP4 videos with 3D tilt & smooth zoom."""

    def __init__(self, output_width: int = 1920, output_height: int = 1080, fps: int = 30) -> None:
        self.width = output_width
        self.height = output_height
        self.fps = fps

    def render_card_snapshot(self, tweet: TweetData, output_png_path: str | Path) -> Path:
        """Renders 4K snapshot of the Twitter card via Playwright."""
        out_path = Path(output_png_path).resolve()
        out_path.parent.mkdir(parents=True, exist_ok=True)
        html_content = generate_tweet_html(tweet)

        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page(
                viewport=ViewportSize(width=1920, height=1080),
                device_scale_factor=2.0,
            )
            page.set_content(html_content, wait_until="networkidle")
            page.screenshot(path=str(out_path))
            browser.close()

        return out_path

    def render_video(
        self,
        tweet: TweetData,
        output_mp4_path: str | Path,
        duration: float = 5.0,
        tilt_3d: bool = True,
        zoom_target: float = 1.12,
    ) -> Path:
        """Renders 1080p MP4 video with smooth camera motion and 3D perspective."""
        out_vid = Path(output_mp4_path).resolve()
        out_vid.parent.mkdir(parents=True, exist_ok=True)

        temp_png = out_vid.with_suffix(".png")
        self.render_card_snapshot(tweet, temp_png)

        base_img = Image.open(temp_png).convert("RGBA")
        src_w, src_h = base_img.size

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
            "-crf", "17",
            str(out_vid),
        ]

        proc = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE)
        assert proc.stdin is not None

        for i in range(total_frames):
            t = i / max(1, total_frames - 1)
            # Smooth cubic ease
            ease_t = t * t * (3.0 - 2.0 * t)

            # Camera zoom: 1.0 -> zoom_target
            scale = 1.0 + (zoom_target - 1.0) * ease_t
            crop_w = int(src_w / scale)
            crop_h = int(src_h / scale)

            left = (src_w - crop_w) // 2
            top = (src_h - crop_h) // 2
            cropped = base_img.crop((left, top, left + crop_w, top + crop_h))
            frame_img = cropped.resize((self.width, self.height), Image.Resampling.BILINEAR)

            # Radiating warning rings for Hugging Face incident tweet if requested
            if tweet.warning_rings:
                overlay = Image.new("RGBA", (self.width, self.height), (0, 0, 0, 0))
                draw = ImageDraw.Draw(overlay)
                ring_cx, ring_cy = int(self.width * 0.28), int(self.height * 0.35)

                for ring_idx in range(3):
                    ring_phase = (i / 15.0 + ring_idx * 0.33) % 1.0
                    r = 40 + ring_phase * 120
                    alpha = int((1.0 - ring_phase) * 160)
                    draw.ellipse(
                        [ring_cx - r, ring_cy - r, ring_cx + r, ring_cy + r],
                        outline=(255, 184, 0, alpha),
                        width=3,
                    )
                frame_img = Image.alpha_composite(frame_img, overlay)

            # Subtle outer vignette
            vignette = Image.new("RGBA", (self.width, self.height), (0, 0, 0, 0))
            v_draw = ImageDraw.Draw(vignette)
            v_draw.rectangle([0, 0, self.width, self.height], outline=(0, 0, 0, 80), width=6)
            frame_img = Image.alpha_composite(frame_img, vignette)

            proc.stdin.write(frame_img.tobytes())

        proc.stdin.close()
        proc.wait()

        return out_vid
