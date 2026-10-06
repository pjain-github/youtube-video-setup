#!/usr/bin/env python3
"""Batch render the first 5 Kurzgesagt animated clips (0:00 to 0:25).

Produces Full HD 1080p clips with zero vector distortion:
- Scene 1: Pristine dome dolly push-in + pulsing ruby red alarm strobe.
- Scene 2: Glass dome breach push-in + floating cyan/orange energy droplets escaping.
- Scene 3: Exploit keycard snap zoom + expanding concentric circular shockwaves.
- Scene 4: Conduit tracking pan + surging electric cyan data packets.
- Scene 5: Global hub planetary drift + concentric broadcast signal rings.
"""

from __future__ import annotations

import time
from pathlib import Path
from youtube_video_setup._archived.kurzgesagt_animator import KurzgesagtAnimator

def main() -> None:
    animator = KurzgesagtAnimator(width=1920, height=1080, fps=30)
    out_dir = Path("videos")
    out_dir.mkdir(parents=True, exist_ok=True)
    
    scenes = [
        (1, "images/image_001.png", "scene_001_kurzgesagt_1080p.mp4"),
        (2, "images/image_002.png", "scene_002_kurzgesagt_1080p.mp4"),
        (3, "images/image_003.png", "scene_003_kurzgesagt_1080p.mp4"),
        (4, "images/image_004.png", "scene_004_kurzgesagt_1080p.mp4"),
        (5, "images/image_005.png", "scene_005_kurzgesagt_1080p.mp4"),
    ]
    
    t_start = time.time()
    print("==============================================================================")
    print("==> STARTING BATCH RENDERING FOR FIRST 5 KURZGESAGT ANIMATED SCENES (1080P)...")
    print("==============================================================================")
    
    rendered = []
    for scene_id, img_path, out_name in scenes:
        out_path = out_dir / out_name
        res = animator.render_scene(
            image_path=img_path,
            output_path=out_path,
            scene_id=scene_id,
            duration=5.0,
        )
        rendered.append(res)
        
    total_time = time.time() - t_start
    print("==============================================================================")
    print(f"==> ALL 5 SCENES RENDERED IN {total_time:.1f}s ({total_time / 5:.1f}s per 1080p clip)!")
    print("==============================================================================")
    for p in rendered:
        print(f" - {p.name}: {p.stat().st_size:,} bytes")

if __name__ == "__main__":
    main()
