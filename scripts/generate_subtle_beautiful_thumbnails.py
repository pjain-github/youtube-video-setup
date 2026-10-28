"""Generate subtle, beautiful, and high-CTR YouTube thumbnails for Claude Duet.

Aesthetic: Apple Keynote / Christopher Nolan cinematic aesthetic.
Refined typography, frosted glass live activity cards, volumetric terracotta glow,
and compelling psychological curiosity hooks.
"""

from __future__ import annotations

import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

HELVETICA_FONT = "/System/Library/Fonts/Helvetica.ttc"
GEORGIA_FONT = "/System/Library/Fonts/Supplemental/Georgia.ttf"
ARIAL_BLACK_FONT = "/System/Library/Fonts/Supplemental/Arial Black.ttf"
ARIAL_BOLD_FONT = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"

CLAUDE_LOGO_PATH = Path("video assets/images/claude_logo_1024.png")
OUT_DIR = Path("video assets/images/thumbnails")
OUT_DIR.mkdir(parents=True, exist_ok=True)


def draw_cinematic_text(
    draw: ImageDraw.ImageDraw,
    text: str,
    font: ImageFont.FreeTypeFont,
    xy: tuple[int, int],
    text_color: tuple[int, int, int],
    shadow_offset: tuple[int, int] = (6, 8),
    shadow_color: tuple[int, int, int, int] = (0, 0, 0, 200),
    soft_glow: bool = True,
) -> None:
    x, y = xy
    sx, sy = x + shadow_offset[0], y + shadow_offset[1]

    # Soft ambient drop shadow for cinematic elegance (no harsh comic outlines)
    for ox in range(-4, 5):
        for oy in range(-4, 5):
            draw.text((sx + ox, sy + oy), text, font=font, fill=(0, 0, 0, 140))

    if soft_glow:
        # Subtle ambient luminance
        for ox in range(-2, 3):
            for oy in range(-2, 3):
                draw.text((x + ox, y + oy), text, font=font, fill=(text_color[0], text_color[1], text_color[2], 60))

    # Core text
    draw.text((x, y), text, font=font, fill=text_color)


def create_frosted_glass_card(
    width: int,
    height: int,
    radius: int = 24,
    bg_rgba: tuple[int, int, int, int] = (18, 22, 32, 195),
    border_rgba: tuple[int, int, int, int] = (255, 255, 255, 55),
    border_width: int = 2,
) -> Image.Image:
    """Create an iOS / macOS style frosted glassmorphism card."""
    card = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    cdraw = ImageDraw.Draw(card)

    # Base frosted fill
    cdraw.rounded_rectangle(
        [0, 0, width - 1, height - 1],
        radius=radius,
        fill=bg_rgba,
        outline=border_rgba,
        width=border_width,
    )

    # Subtle top highlight reflection line
    highlight = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    hdraw = ImageDraw.Draw(highlight)
    hdraw.line([(radius, 1), (width - radius, 1)], fill=(255, 255, 255, 90), width=1)
    card = Image.alpha_composite(card, highlight)

    return card


def create_subtle_pill(
    text: str,
    font: ImageFont.FreeTypeFont,
    bg_color: tuple[int, int, int, int] = (224, 106, 38, 230),  # Terracotta
    text_color: tuple[int, int, int] = (255, 255, 255),
    dot_color: tuple[int, int, int] | None = (52, 211, 153),  # Green live dot
    padding: tuple[int, int] = (26, 12),
    border_rgba: tuple[int, int, int, int] = (255, 255, 255, 60),
) -> Image.Image:
    dummy_img = Image.new("RGBA", (10, 10))
    d = ImageDraw.Draw(dummy_img)
    bbox = d.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]

    dot_space = 28 if dot_color else 0
    w = tw + padding[0] * 2 + dot_space
    h = th + padding[1] * 2

    pill = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    pdraw = ImageDraw.Draw(pill)
    radius = h // 2

    pdraw.rounded_rectangle(
        [0, 0, w - 1, h - 1],
        radius=radius,
        fill=bg_color,
        outline=border_rgba,
        width=2,
    )

    cx = padding[0]
    if dot_color:
        dr = 6
        cy = h // 2
        pdraw.ellipse([cx, cy - dr, cx + dr * 2, cy + dr], fill=dot_color)
        cx += dot_space

    tx = cx - bbox[0]
    ty = padding[1] - bbox[1]
    pdraw.text((tx, ty), text, font=font, fill=text_color)

    return pill


def generate_subtle_variant_1() -> Path:
    """Option 1: The 'Apple Keynote / Midnight Reveal'
    - Closed laptop with glowing Claude logo hovering
    - 'Claude Duet is here.' / 'And AI will never be the same.'
    - Ambient, elegant, mysterious.
    """
    raw = Image.open("video assets/images/thumbnail_cinematic_subtle_1.jpg").convert("RGBA")
    bg = raw.resize((1920, 1080), Image.Resampling.LANCZOS)

    # Contrast and saturation adjustment for rich obsidian shadows
    bg = ImageEnhance.Contrast(bg).enhance(1.18)
    bg = ImageEnhance.Color(bg).enhance(1.12)

    # Soft cinematic vignette on the left half to let typography breathe gracefully
    vignette = Image.new("RGBA", (1920, 1080), (0, 0, 0, 0))
    vdraw = ImageDraw.Draw(vignette)
    for x in range(1200):
        alpha = int(210 * (1.0 - (x / 1200.0) ** 1.4))
        vdraw.line([(x, 0), (x, 1080)], fill=(7, 9, 14, alpha))
    bg = Image.alpha_composite(bg, vignette)

    draw = ImageDraw.Draw(bg)

    # Fonts
    font_brand = ImageFont.truetype(HELVETICA_FONT, 34, index=1) if Path(HELVETICA_FONT).exists() else ImageFont.truetype(ARIAL_BOLD_FONT, 34)
    font_hero1 = ImageFont.truetype(ARIAL_BLACK_FONT, 120)
    font_hero2 = ImageFont.truetype(ARIAL_BLACK_FONT, 100)
    font_serif = ImageFont.truetype(GEORGIA_FONT, 78)

    # Top Brand Pill: ANTHROPIC · CLAUDE DUET
    pill = create_subtle_pill(
        text="ANTHROPIC  //  CLAUDE DUET",
        font=font_brand,
        bg_color=(25, 30, 42, 210),
        text_color=(240, 243, 246),
        dot_color=(224, 106, 38),  # Terracotta dot
        padding=(28, 14),
    )
    bg.paste(pill, (110, 120), pill)

    # Line 1: Claude Duet is here. (Pure stark white)
    draw_cinematic_text(
        draw=draw,
        text="Claude Duet is here.",
        font=font_hero1,
        xy=(105, 260),
        text_color=(255, 255, 255),
        shadow_offset=(8, 12),
    )

    # Line 2: It will change how you use AI. (Warm Terracotta / Soft Gold)
    draw_cinematic_text(
        draw=draw,
        text="It will change",
        font=font_hero2,
        xy=(110, 420),
        text_color=(235, 125, 65),  # Refined warm terracotta
        shadow_offset=(8, 10),
    )

    draw_cinematic_text(
        draw=draw,
        text="how you use AI.",
        font=font_hero2,
        xy=(110, 550),
        text_color=(255, 235, 180),  # Soft champagne gold
        shadow_offset=(8, 10),
    )

    # Sleek Apple-style Frosted Glass Live Notification
    card_w, card_h = 700, 180
    cx, cy = 110, 780

    card = create_frosted_glass_card(card_w, card_h, radius=20)
    # Paste card
    bg.paste(card, (cx, cy), card)

    cdraw = ImageDraw.Draw(bg)

    # Small official Claude icon inside the card
    logo_raw = Image.open(CLAUDE_LOGO_PATH).convert("RGBA").resize((68, 68), Image.Resampling.LANCZOS)
    bg.paste(logo_raw, (cx + 30, cy + 30), logo_raw)

    # Text inside card
    font_card_head = ImageFont.truetype(ARIAL_BLACK_FONT, 28)
    font_card_sub = ImageFont.truetype(ARIAL_BOLD_FONT, 24)

    cdraw.text((cx + 120, cy + 32), "CLAUDE DUET  •  02:00 AM", font=font_card_head, fill=(255, 255, 255))
    cdraw.text((cx + 120, cy + 70), "Laptop closed. Autonomous cloud VM active.", font=font_card_sub, fill=(160, 175, 195))
    cdraw.text((cx + 120, cy + 105), "3 tasks completed  ·  1 action awaiting approval", font=font_card_sub, fill=(52, 211, 153))

    out_path = OUT_DIR / "thumbnail_subtle_beautiful_v1.png"
    bg.convert("RGB").save(out_path, quality=95)
    print(f"Generated: {out_path}")
    return out_path


def generate_subtle_variant_2() -> Path:
    """Option 2: The '2:00 AM Curiosity Hook'
    - 'YOUR LAPTOP IS CLOSED.' / 'Claude is still working.'
    - High visual intrigue, poetic tech photography, irresistible clickbait.
    """
    raw = Image.open("video assets/images/thumbnail_cinematic_subtle_2.jpg").convert("RGBA")
    bg = raw.resize((1920, 1080), Image.Resampling.LANCZOS)
    bg = ImageEnhance.Contrast(bg).enhance(1.2)
    bg = ImageEnhance.Color(bg).enhance(1.15)

    # Ambient vignette
    vignette = Image.new("RGBA", (1920, 1080), (0, 0, 0, 0))
    vdraw = ImageDraw.Draw(vignette)
    for x in range(1250):
        alpha = int(220 * (1.0 - (x / 1250.0) ** 1.35))
        vdraw.line([(x, 0), (x, 1080)], fill=(6, 8, 12, alpha))
    bg = Image.alpha_composite(bg, vignette)

    draw = ImageDraw.Draw(bg)

    font_pill = ImageFont.truetype(ARIAL_BOLD_FONT, 32)
    font_title1 = ImageFont.truetype(ARIAL_BLACK_FONT, 115)
    font_serif_italic = ImageFont.truetype(GEORGIA_FONT, 82)
    font_tag = ImageFont.truetype(ARIAL_BOLD_FONT, 28)

    # Top Status Pill: 2:00 AM • DEDICATED CLOUD VM
    pill = create_subtle_pill(
        text="2:00 AM  •  DEDICATED CLOUD VM",
        font=font_pill,
        bg_color=(20, 24, 34, 220),
        text_color=(255, 255, 255),
        dot_color=(56, 189, 248),  # Cyan active dot
        padding=(28, 14),
    )
    bg.paste(pill, (110, 130), pill)

    # Headline Line 1: YOUR LAPTOP IS CLOSED.
    draw_cinematic_text(
        draw=draw,
        text="Your laptop is closed.",
        font=font_title1,
        xy=(105, 250),
        text_color=(255, 255, 255),
        shadow_offset=(8, 12),
    )

    # Headline Line 2: Claude is still working. (In elegant warm terracotta italic)
    draw_cinematic_text(
        draw=draw,
        text="Claude is still working.",
        font=font_serif_italic,
        xy=(110, 400),
        text_color=(235, 125, 65),  # Warm Terracotta
        shadow_offset=(6, 8),
    )

    # Subtitle: The new autonomous agent that never powers down.
    draw.text(
        (110, 520),
        "Claude Duet runs on its own computer in the cloud.",
        font=font_tag,
        fill=(160, 175, 195),
    )
    draw.text(
        (110, 565),
        "It will change how you use AI forever.",
        font=font_tag,
        fill=(220, 225, 235),
    )

    # Sleek Floating Approval Card (direct reference to the video's $640 permit approval)
    card_w, card_h = 680, 190
    cx, cy = 110, 760
    card = create_frosted_glass_card(card_w, card_h, radius=22, bg_rgba=(15, 19, 28, 215))
    bg.paste(card, (cx, cy), card)

    cdraw = ImageDraw.Draw(bg)
    # Icon
    logo_raw = Image.open(CLAUDE_LOGO_PATH).convert("RGBA").resize((64, 64), Image.Resampling.LANCZOS)
    bg.paste(logo_raw, (cx + 32, cy + 32), logo_raw)

    cdraw.text((cx + 120, cy + 30), "ACTION PENDING APPROVAL", font=ImageFont.truetype(ARIAL_BLACK_FONT, 24), fill=(235, 125, 65))
    cdraw.text((cx + 120, cy + 65), "Pay Health Permit: $640.00", font=ImageFont.truetype(ARIAL_BLACK_FONT, 30), fill=(255, 255, 255))
    cdraw.text((cx + 120, cy + 110), "Prepared in background while you were asleep", font=ImageFont.truetype(ARIAL_BOLD_FONT, 22), fill=(150, 165, 185))

    # Approve pill button inside card
    btn = create_subtle_pill(
        text="✓  APPROVE",
        font=ImageFont.truetype(ARIAL_BLACK_FONT, 22),
        bg_color=(22, 163, 74, 240),  # Emerald green
        text_color=(255, 255, 255),
        dot_color=None,
        padding=(22, 10),
    )
    bg.paste(btn, (cx + card_w - 200, cy + 105), btn)

    out_path = OUT_DIR / "thumbnail_subtle_beautiful_v2.png"
    bg.convert("RGB").save(out_path, quality=95)
    print(f"Generated: {out_path}")
    return out_path


def generate_subtle_variant_3() -> Path:
    """Option 3: The 'Pure Minimalist Masterpiece'
    - 'CLAUDE DUET' / 'The AI that never sleeps.'
    - Ultra-clean, premium typography, breathless simplicity with massive CTR.
    """
    raw = Image.open("video assets/images/thumbnail_cinematic_subtle_1.jpg").convert("RGBA")
    bg = raw.resize((1920, 1080), Image.Resampling.LANCZOS)
    bg = ImageEnhance.Contrast(bg).enhance(1.22)
    bg = ImageEnhance.Color(bg).enhance(1.18)

    vignette = Image.new("RGBA", (1920, 1080), (0, 0, 0, 0))
    vdraw = ImageDraw.Draw(vignette)
    for x in range(1300):
        alpha = int(230 * (1.0 - (x / 1300.0) ** 1.3))
        vdraw.line([(x, 0), (x, 1080)], fill=(6, 8, 12, alpha))
    bg = Image.alpha_composite(bg, vignette)

    draw = ImageDraw.Draw(bg)

    font_eyebrow = ImageFont.truetype(ARIAL_BOLD_FONT, 36)
    font_hero = ImageFont.truetype(ARIAL_BLACK_FONT, 140)
    font_sub = ImageFont.truetype(GEORGIA_FONT, 85)

    # Eyebrow tag
    pill = create_subtle_pill(
        text="ANTHROPIC'S NEW PARADIGM",
        font=font_eyebrow,
        bg_color=(224, 106, 38, 230),  # Terracotta
        text_color=(255, 255, 255),
        dot_color=None,
        padding=(28, 14),
    )
    bg.paste(pill, (110, 160), pill)

    # Hero: CLAUDE DUET
    draw_cinematic_text(
        draw=draw,
        text="Claude Duet.",
        font=font_hero,
        xy=(105, 280),
        text_color=(255, 255, 255),
        shadow_offset=(8, 12),
    )

    # Sub: It never sleeps.
    draw_cinematic_text(
        draw=draw,
        text="It works while you sleep.",
        font=font_sub,
        xy=(110, 460),
        text_color=(235, 125, 65),  # Terracotta
        shadow_offset=(6, 8),
    )

    # Bottom statement in clean champagne
    font_statement = ImageFont.truetype(ARIAL_BOLD_FONT, 42)
    draw_cinematic_text(
        draw=draw,
        text="The way you use AI just changed.",
        font=font_statement,
        xy=(110, 600),
        text_color=(255, 240, 210),  # Soft champagne
        shadow_offset=(4, 6),
    )

    # Minimalist status pill at bottom
    bot_pill = create_subtle_pill(
        text="●  24/7 DEDICATED CLOUD COMPUTER  •  NO LAPTOP NEEDED",
        font=ImageFont.truetype(ARIAL_BOLD_FONT, 28),
        bg_color=(15, 20, 30, 220),
        text_color=(148, 163, 184),
        dot_color=(52, 211, 153),
        padding=(28, 14),
    )
    bg.paste(bot_pill, (110, 850), bot_pill)

    out_path = OUT_DIR / "thumbnail_subtle_beautiful_v3.png"
    bg.convert("RGB").save(out_path, quality=95)
    print(f"Generated: {out_path}")
    return out_path


def main():
    print("Generating subtle, beautiful, high-CTR YouTube thumbnails...")
    generate_subtle_variant_1()
    generate_subtle_variant_2()
    generate_subtle_variant_3()
    print("All subtle thumbnails successfully generated in:", OUT_DIR)


if __name__ == "__main__":
    main()

