#!/usr/bin/env python3
"""Generate the first 5 Kurzgesagt-style keyframe images (0:00 to 0:25)."""

from __future__ import annotations

import os
from pathlib import Path
from youtube_video_setup._archived.gemini_images.generator import generate_image

STYLE_PREFIX = (
    "Create in the style of Kurzgesagt with flat vector illustration using rounded geometric shapes "
    "and smooth curves. Apply mostly solid flat colors with minimal gradients. Use extremely high color "
    "saturation levels throughout the composition. Emphasize strong contrast between warm and cool tones "
    "for dramatic visual impact. Build with bold color blocking where each shape contains a single saturated "
    "hue. Keep shading subtle and limited, favoring pure flat color over tonal variation. Design with "
    "vibrant and intense color relationships that create energetic visual tension. Maintain clean vector "
    "shapes with sharp color boundaries between elements. Use simplified forms with minimal detail but "
    "maximum color intensity. Style should feel bold, eye catching, and modern with masterful use of high "
    "saturation color theory and flat design principles while preserving the approachable geometric aesthetic. "
    "STRICT NEGATIVE CONSTRAINT: Absolutely NO text, NO words, NO letters, NO numbers, NO labels, NO typography, "
    "NO subtitles, NO titles, NO symbols that look like letters anywhere in the composition. All ideas must be "
    "communicated purely through flat geometric vector illustration and visual metaphors."
)

FIRST_5_PROMPTS = [
    {
        "id": 1,
        "name": "image_001.png",
        "time": "0:00–0:05",
        "concept": "Isolated server rack inside a pristine rounded glass containment dome",
        "prompt": (
            f"{STYLE_PREFIX} "
            "Scene: An isolated cybersecurity test chamber. In the center, a sleek rounded black server tower with bright cyan LED slots is sealed inside a transparent spherical glass containment dome. On top of the dome, a bold rounded emergency strobe beacon pulses in ultra-saturated ruby red (#FF0055). The background is a seamless deep midnight navy (#070B19) with floating vibrant electric cyan plus signs. Clean rounded pill shapes, sharp vector color boundaries, zero floor perspective grid, bold color blocking, 16:9 widescreen, Full HD."
        ),
    },
    {
        "id": 2,
        "name": "image_002.png",
        "time": "0:05–0:10",
        "concept": "Microscopic fracture appearing in the glass dome with glowing energy beads",
        "prompt": (
            f"{STYLE_PREFIX} "
            "Scene: Close-up of the smooth curved glass dome wall developing a glowing hairline structural fracture. Electric cyan (#00F5FF) and fiery neon orange (#FF6600) digital energy beads leak through the crack into the dark navy void. Bold warm/cool contrast between icy cyan energy and hot orange breach markers. Solid flat colors, clean rounded vector cracks, perfectly sharp outlines, no floor grid, 16:9 widescreen, Full HD."
        ),
    },
    {
        "id": 3,
        "name": "image_003.png",
        "time": "0:10–0:15",
        "concept": "A rounded golden exploit keycard unlocking a digital padlock",
        "prompt": (
            f"{STYLE_PREFIX} "
            "Scene: Conceptual cybersecurity exploit visualization. A floating glowing rounded golden keycard badge with glowing geometric circuit tracks snaps into a giant bold electric-magenta (#FF007F) rounded padlock. The padlock pops open, radiating intense bright yellow and turquoise circular vector shockwaves across a deep obsidian navy background. Bold geometric color blocking, high saturation, sharp vector edges, zero floor grid, strictly zero text or letters anywhere, 16:9 widescreen, Full HD."
        ),
    },
    {
        "id": 4,
        "name": "image_004.png",
        "time": "0:15–0:20",
        "concept": "Vibrant glowing data conduit bridging from a local sandbox to outer network nodes",
        "prompt": (
            f"{STYLE_PREFIX} "
            "Scene: Escape trajectory. An energetic stream of ultra-saturated cyan and lime-green data packets surges along a thick curved vector conduit, bypassing a shattered red firewall ring and connecting directly into an expansive constellation of floating circular network hubs. Deep space navy void with subtle floating geometric stars. High color saturation, rounded pill contours, flat color fills, no gradients, 16:9 widescreen, Full HD."
        ),
    },
    {
        "id": 5,
        "name": "image_005.png",
        "time": "0:20–0:25",
        "concept": "Vibrant stylized internet globe with a cheerful smiling yellow Hugging Face-style hub",
        "prompt": (
            f"{STYLE_PREFIX} "
            "Scene: Global network constellation. In the center, a stylized circular planetary network with rounded geometric server disks. Floating beside it is a friendly, giant rounded yellow-gold smiling emoji face connected to millions of colorful circular user nodes across stylized continents below. Vibrant contrast of warm marigold yellow (#FFB703), electric blue (#0077B6), and candy coral (#FF4D6D). Solid flat colors, bold color blocking, seamless dark navy background, strictly zero text, zero words, zero titles, 16:9 widescreen, Full HD."
        ),
    },
]


def main():
    import sys
    output_dir = Path("images")
    output_dir.mkdir(parents=True, exist_ok=True)

    target_ids = [int(arg) for arg in sys.argv[1:] if arg.isdigit()]
    prompts_to_run = [p for p in FIRST_5_PROMPTS if not target_ids or p["id"] in target_ids]

    print(f"==> Generating {len(prompts_to_run)} Kurzgesagt-style keyframe images (strictly text-free)...")
    for item in prompts_to_run:
        img_id = item["id"]
        out_path = output_dir / item["name"]

        print(f"\n=======================================================")
        print(f"[{img_id}/5] Generating {item['name']} ({item['time']})")
        print(f"Concept: {item['concept']}")
        print(f"=======================================================")

        saved_path = generate_image(
            prompt=item["prompt"],
            output_path=out_path,
            aspect_ratio="16:9",
            ensure_full_hd=True,
        )
        print(f"==> Successfully generated and saved to: {saved_path}")

    print("\n==> GENERATION COMPLETE!")


if __name__ == "__main__":
    main()
