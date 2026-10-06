#!/usr/bin/env python3
"""Export all 119 scenes from image_generation_plan.md into inputs/scenes.json."""

from __future__ import annotations

import json
import re
from pathlib import Path

def main() -> None:
    plan_path = Path("inputs/image_generation_plan.md")
    if not plan_path.exists():
        raise FileNotFoundError(f"{plan_path} does not exist.")

    plan_text = plan_path.read_text()
    table_pattern = re.compile(
        r"\|\s*\*\*(\d+)\*\*\s*\|\s*`([^`]+)`\s*\|\s*([^|]+)\s*\|\s*\*\*([^|]+)\*\*\s*\|\s*([^|]+)\s*\|"
    )
    matches = table_pattern.findall(plan_text)
    print(f"==> Parsed {len(matches)} scenes from table.")

    scenes = []
    for m in matches:
        scene_id = int(m[0])
        time_str = m[1].strip()
        section = m[2].strip()
        concept = m[3].strip()
        motion = m[4].strip()
        scenes.append({
            "id": scene_id,
            "image": f"/workspace/youtube-video/inputs/image_{scene_id:03d}.png",
            "local_image": f"images/image_{scene_id:03d}.png",
            "output_name": f"scene_{scene_id:03d}",
            "time": time_str,
            "section": section,
            "concept": concept,
            "prompt": f"2D vector animation in Kurzgesagt style, {motion}, flat solid colors, rounded geometric shapes, strictly no text, smooth camera movement, seamless navy void",
        })

    out_file = Path("inputs/scenes.json")
    out_file.write_text(json.dumps(scenes, indent=2))
    print(f"==> Successfully exported {len(scenes)} scenes to {out_file}!")

if __name__ == "__main__":
    main()
