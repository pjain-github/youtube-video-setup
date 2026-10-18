"""Generate high-CTR clickbait YouTube thumbnails for the documentary video.

Features:
- Option 1 (Cyberpunk/Neon): Ultra-high contrast magenta/cyan overlord robot with bold split text ("I CODED A MUSIC VIDEO" / "IN 5 MINUTES?").
- Option 2 (Browser Tab/AI Satire): Golden key robot + Claude Code prompt comparison badge + "+660K VIEWS" proof sticker.
- Option 3 (Minimalist Bold Tech): Clean dark UI, large split before/after prompt vs rendered film, bold vibrant badges.
"""

from __future__ import annotations

import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

IMPACT_FONT = "/System/Library/Fonts/Supplemental/Impact.ttf"
ARIAL_BLACK_FONT = "/System/Library/Fonts/Supplemental/Arial Black.ttf"
ARIAL_BOLD_FONT = "/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf"

OUT_DIR = Path("video assets/videos/thumbnails")
OUT_DIR.mkdir(parents=True, exist_ok=True)


def draw_text_with_outline_and_shadow(
    draw: ImageDraw.ImageDraw,
    text: str,
    font: ImageFont.FreeTypeFont,
    xy: tuple[int, int],
    text_color: tuple[int, int, int],
    outline_color: tuple[int, int, int] = (0, 0, 0),
    outline_width: int = 8,
    shadow_offset: tuple[int, int] = (8, 10),
    shadow_color: tuple[int, int, int, int] = (0, 0, 0, 220),
) -> None:
    x, y = xy
    # Drop shadow
    sx, sy = x + shadow_offset[0], y + shadow_offset[1]
    for ox in range(-outline_width, outline_width + 1):
        for oy in range(-outline_width, outline_width + 1):
            if ox * ox + oy * oy <= outline_width * outline_width:
                draw.text((sx + ox, sy + oy), text, font=font, fill=(0, 0, 0, 180))

    # Thick stroke outline
    for ox in range(-outline_width, outline_width + 1):
        for oy in range(-outline_width, outline_width + 1):
            if ox * ox + oy * oy <= outline_width * outline_width:
                draw.text((x + ox, y + oy), text, font=font, fill=outline_color)

    # Core text fill
    draw.text((x, y), text, font=font, fill=text_color)


def create_badge(
    text: str,
    font: ImageFont.FreeTypeFont,
    bg_color: tuple[int, int, int],
    text_color: tuple[int, int, int] = (255, 255, 255),
    padding: tuple[int, int] = (28, 16),
    border_color: tuple[int, int, int] = (255, 255, 255),
    border_width: int = 4,
    rotation: float = 0,
) -> Image.Image:
    # Measure text
    dummy_img = Image.new("RGBA", (10, 10))
    d = ImageDraw.Draw(dummy_img)
    bbox = d.textbbox((0, 0), text, font=font)
    w = (bbox[2] - bbox[0]) + padding[0] * 2
    h = (bbox[3] - bbox[1]) + padding[1] * 2

    badge = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    bdraw = ImageDraw.Draw(badge)
    radius = 18
    bdraw.rounded_rectangle([0, 0, w - 1, h - 1], radius=radius, fill=bg_color, outline=border_color, width=border_width)
    tx = padding[0] - bbox[0]
    ty = padding[1] - bbox[1]
    bdraw.text((tx, ty), text, font=font, fill=text_color)

    if rotation != 0:
        badge = badge.rotate(rotation, expand=True, resample=Image.Resampling.BICUBIC)

    return badge


def generate_thumbnail_variant_1() -> Path:
    """Variant 1: High CTR Neon Cyberpunk 'I CODED AN ENTIRE MUSIC VIDEO (IN 5 MINS)'"""
    bg = Image.open("video assets/scratch/frame_music_455.png").convert("RGBA")
    w, h = bg.size  # 1920x1080

    # Boost contrast and vibrance slightly for YouTube feed punch
    enhancer = ImageEnhance.Color(bg)
    bg = enhancer.enhance(1.25)
    enhancer2 = ImageEnhance.Contrast(bg)
    bg = enhancer2.enhance(1.15)

    # Create an overlay layer with darkened gradient along top and left for maximum text pop
    gradient = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(gradient)
    
    # Left vignette for text
    for x in range(1100):
        alpha = int(220 * (1.0 - (x / 1100.0) ** 1.3))
        gdraw.line([(x, 0), (x, h)], fill=(7, 11, 25, alpha))

    # Top banner gradient
    for y in range(400):
        alpha = int(180 * (1.0 - (y / 400.0)))
        gdraw.line([(0, y), (w, y)], fill=(7, 11, 25, alpha))

    composite = Image.alpha_composite(bg, gradient)
    draw = ImageDraw.Draw(composite)

    # Fonts
    font_hero = ImageFont.truetype(IMPACT_FONT, 136)
    font_sub = ImageFont.truetype(IMPACT_FONT, 120)
    font_badge = ImageFont.truetype(ARIAL_BLACK_FONT, 44)
    font_sticker = ImageFont.truetype(ARIAL_BLACK_FONT, 38)

    # Top Left Tag: "100% AI & CODE"
    badge_ai = create_badge("100% CODE · NO EDITING", font_badge, bg_color=(255, 46, 136), text_color=(255, 255, 255), padding=(24, 12), border_color=(255, 255, 255), border_width=4, rotation=-2)
    composite.paste(badge_ai, (80, 75), badge_ai)

    # Main Clickbait Headlines
    # Row 1: "I CODED A" (White with black stroke)
    draw_text_with_outline_and_shadow(
        draw, "I CODED A", font_hero, (80, 195),
        text_color=(255, 255, 255), outline_color=(0, 0, 0), outline_width=12
    )

    # Row 2: "MUSIC VIDEO" (Bright Cyan #00F5FF with glowing shadow)
    draw_text_with_outline_and_shadow(
        draw, "MUSIC VIDEO", font_hero, (80, 345),
        text_color=(0, 245, 255), outline_color=(0, 0, 0), outline_width=12
    )

    # Row 3: "IN 5 MINUTES?!" (Vibrant Yellow #FFE600 with red stroke)
    draw_text_with_outline_and_shadow(
        draw, "IN 5 MINUTES?!", font_sub, (80, 495),
        text_color=(255, 230, 0), outline_color=(0, 0, 0), outline_width=12
    )

    # Bottom Left Sub-Badge: "CLAUDE CODE + REMOTION"
    badge_tools = create_badge("CLAUDE CODE + REMOTION", font_sticker, bg_color=(17, 26, 51), text_color=(0, 245, 255), padding=(22, 14), border_color=(0, 245, 255), border_width=3, rotation=0)
    composite.paste(badge_tools, (85, 930), badge_tools)

    # Viral Counter Sticker top-right
    badge_views = create_badge("🔥 660K+ VIEWS STYLE", font_sticker, bg_color=(43, 227, 139), text_color=(7, 11, 25), padding=(24, 14), border_color=(255, 255, 255), border_width=4, rotation=3)
    composite.paste(badge_views, (1360, 75), badge_views)

    # Outro border frame (3px cyan rim for mobile visibility)
    draw.rectangle([(0, 0), (w - 1, h - 1)], outline=(0, 245, 255), width=8)

    out_path = OUT_DIR / "thumbnail_neon_clickbait.png"
    composite.convert("RGB").save(out_path, quality=95)
    print(f"Generated Thumbnail Variant 1: {out_path}")
    return out_path


def generate_thumbnail_variant_2() -> Path:
    """Variant 2: Gold Key Mascot + 'NO VIDEO EDITOR NEEDED' + 'JUST 3 PROMPTS'"""
    bg = Image.open("video assets/scratch/frame_music_504.png").convert("RGBA")
    w, h = bg.size

    enhancer = ImageEnhance.Color(bg)
    bg = enhancer.enhance(1.2)
    enhancer2 = ImageEnhance.Contrast(bg)
    bg = enhancer2.enhance(1.1)

    # Dark gradient on left & top
    gradient = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(gradient)
    for x in range(1200):
        alpha = int(225 * (1.0 - (x / 1200.0) ** 1.2))
        gdraw.line([(x, 0), (x, h)], fill=(10, 18, 48, alpha))
    for y in range(350):
        alpha = int(170 * (1.0 - (y / 350.0)))
        gdraw.line([(0, y), (w, y)], fill=(10, 18, 48, alpha))

    composite = Image.alpha_composite(bg, gradient)
    draw = ImageDraw.Draw(composite)

    font_huge = ImageFont.truetype(IMPACT_FONT, 148)
    font_mid = ImageFont.truetype(IMPACT_FONT, 112)
    font_badge = ImageFont.truetype(ARIAL_BLACK_FONT, 44)
    font_sticker = ImageFont.truetype(ARIAL_BLACK_FONT, 40)

    # Top pill
    badge_top = create_badge("ZERO EDITING SKILLS", font_badge, bg_color=(255, 51, 102), text_color=(255, 255, 255), padding=(24, 12), border_color=(255, 255, 255), border_width=4, rotation=-2)
    composite.paste(badge_top, (80, 75), badge_top)

    # Headline
    draw_text_with_outline_and_shadow(
        draw, "BUILT IN", font_huge, (80, 190),
        text_color=(255, 255, 255), outline_color=(0, 0, 0), outline_width=12
    )

    draw_text_with_outline_and_shadow(
        draw, "ONE BROWSER", font_huge, (80, 350),
        text_color=(255, 215, 0), outline_color=(0, 0, 0), outline_width=12
    )

    draw_text_with_outline_and_shadow(
        draw, "TAB?!", font_huge, (80, 510),
        text_color=(0, 240, 255), outline_color=(0, 0, 0), outline_width=12
    )

    # Bottom Pill
    badge_bottom = create_badge("⚡ 3 PROMPTS · FULL RENDER", font_sticker, bg_color=(43, 227, 139), text_color=(10, 18, 48), padding=(26, 14), border_color=(255, 255, 255), border_width=4, rotation=1)
    composite.paste(badge_bottom, (80, 920), badge_bottom)

    # Right Sticker: "WATCH IT REACT"
    badge_react = create_badge("REACTIVE AUDIO 🎧", font_sticker, bg_color=(17, 26, 51), text_color=(255, 215, 0), padding=(22, 14), border_color=(255, 215, 0), border_width=3, rotation=3)
    composite.paste(badge_react, (1400, 75), badge_react)

    draw.rectangle([(0, 0), (w - 1, h - 1)], outline=(255, 215, 0), width=8)

    out_path = OUT_DIR / "thumbnail_gold_browser_tab.png"
    composite.convert("RGB").save(out_path, quality=95)
    print(f"Generated Thumbnail Variant 2: {out_path}")
    return out_path


def generate_thumbnail_variant_3() -> Path:
    """Variant 3: Pastel Mascot + 'CODE > KEYFRAMES' + 'HOW TO MAKE THIS'"""
    bg = Image.open("video assets/scratch/frame_teaser_008.png").convert("RGBA")
    w, h = bg.size

    enhancer = ImageEnhance.Color(bg)
    bg = enhancer.enhance(1.2)

    # Dark gradient over left side
    gradient = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(gradient)
    for x in range(1150):
        alpha = int(220 * (1.0 - (x / 1150.0) ** 1.3))
        gdraw.line([(x, 0), (x, h)], fill=(17, 26, 51, alpha))

    composite = Image.alpha_composite(bg, gradient)
    draw = ImageDraw.Draw(composite)

    font_hero = ImageFont.truetype(IMPACT_FONT, 140)
    font_badge = ImageFont.truetype(ARIAL_BLACK_FONT, 44)
    font_sticker = ImageFont.truetype(ARIAL_BLACK_FONT, 38)

    # Top Tag
    badge_top = create_badge("CLAUDE CODE + REMOTION", font_badge, bg_color=(0, 240, 255), text_color=(7, 11, 25), padding=(24, 12), border_color=(255, 255, 255), border_width=4, rotation=-1)
    composite.paste(badge_top, (80, 80), badge_top)

    # Headlines
    draw_text_with_outline_and_shadow(
        draw, "HOW TO MAKE", font_hero, (80, 200),
        text_color=(255, 255, 255), outline_color=(0, 0, 0), outline_width=12
    )

    draw_text_with_outline_and_shadow(
        draw, "VIRAL AI", font_hero, (80, 360),
        text_color=(255, 51, 102), outline_color=(0, 0, 0), outline_width=12
    )

    draw_text_with_outline_and_shadow(
        draw, "ANIMATIONS", font_hero, (80, 520),
        text_color=(255, 230, 0), outline_color=(0, 0, 0), outline_width=12
    )

    # Bottom Tag
    badge_bottom = create_badge("💻 MADE WITH CODE, NOT KEYFRAMES", font_sticker, bg_color=(43, 227, 139), text_color=(17, 26, 51), padding=(24, 14), border_color=(255, 255, 255), border_width=4)
    composite.paste(badge_bottom, (80, 920), badge_bottom)

    draw.rectangle([(0, 0), (w - 1, h - 1)], outline=(255, 51, 102), width=8)

    out_path = OUT_DIR / "thumbnail_viral_explainer.png"
    composite.convert("RGB").save(out_path, quality=95)
    print(f"Generated Thumbnail Variant 3: {out_path}")
    return out_path


def main() -> None:
    t1 = generate_thumbnail_variant_1()
    t2 = generate_thumbnail_variant_2()
    t3 = generate_thumbnail_variant_3()
    print("Done generating all thumbnails.")


if __name__ == "__main__":
    main()
