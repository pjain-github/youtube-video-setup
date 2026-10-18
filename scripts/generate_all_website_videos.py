"""Re-render all website video clips using existing local snapshots with selective highlighting."""

from __future__ import annotations

import json
import time
from pathlib import Path
from urllib.parse import urlparse

from youtube_video_setup.website_video.animator import WebsiteAnimator

SCENES = [
    {
        "id": "scene_01_openai_hf",
        "image": "video assets/images/captured_openai_hf_highlight_1080p.png",
        "url_label": "openai.com/index/security-incident",
        "output": "video assets/videos/openai_hf_highlight_1080p.mp4",
        "draw_highlight": True,
        "zoom": 1.55,
        "duration": 5.0,
    },
    {
        "id": "scene_02_reuters",
        "image": "video assets/images/captured_scene_02_reuters.png",
        "url_label": "reuters.com/technology",
        "output": "video assets/videos/scene_02_reuters_highlight_1080p.mp4",
        "draw_highlight": False,
        "zoom": 1.70,
        "duration": 5.0,
    },
    {
        "id": "scene_03_stanford_hai",
        "image": "video assets/images/captured_scene_03_stanford_hai.png",
        "url_label": "hai.stanford.edu/ai-index",
        "output": "video assets/videos/scene_03_stanford_hai_highlight_1080p.mp4",
        "draw_highlight": False,
        "zoom": 1.75,
        "duration": 5.0,
    },
    {
        "id": "scene_04_deepmind_alphafold",
        "image": "video assets/images/captured_scene_04_deepmind_alphafold.png",
        "url_label": "deepmind.google/technologies/alphafold",
        "output": "video assets/videos/scene_04_deepmind_alphafold_highlight_1080p.mp4",
        "draw_highlight": False,
        "zoom": 1.70,
        "duration": 5.0,
    },
    {
        "id": "scene_05_safe_ai",
        "image": "video assets/images/captured_scene_05_safe_ai.png",
        "url_label": "safe.ai/statement-on-ai-risk",
        "output": "video assets/videos/scene_05_safe_ai_highlight_1080p.mp4",
        "draw_highlight": False,
        "zoom": 1.70,
        "duration": 5.0,
    },
    {
        "id": "scene_06_huggingface",
        "image": "video assets/images/captured_scene_06_huggingface.png",
        "url_label": "huggingface.co/spaces",
        "output": "video assets/videos/scene_06_huggingface_highlight_1080p.mp4",
        "draw_highlight": False,
        "zoom": 1.65,
        "duration": 5.0,
    },
    {
        "id": "scene_07_anthropic",
        "image": "video assets/images/captured_scene_07_anthropic.png",
        "url_label": "anthropic.com/research",
        "output": "video assets/videos/scene_07_anthropic_highlight_1080p.mp4",
        "draw_highlight": False,
        "zoom": 1.75,
        "duration": 5.0,
    },
    {
        "id": "scene_08_arxiv",
        "image": "video assets/images/captured_scene_08_arxiv.png",
        "url_label": "arxiv.org/abs/2412.14093",
        "output": "video assets/videos/scene_08_arxiv_highlight_1080p.mp4",
        "draw_highlight": False,
        "zoom": 1.70,
        "duration": 5.0,
    },
    {
        "id": "scene_09_palisade",
        "image": "video assets/images/captured_scene_09_palisade.png",
        "url_label": "palisaderesearch.org",
        "output": "video assets/videos/scene_09_palisade_highlight_1080p.mp4",
        "draw_highlight": False,
        "zoom": 1.75,
        "duration": 5.0,
    },
    {
        "id": "scene_10_yoshua_bengio",
        "image": "video assets/images/captured_scene_10_yoshua_bengio.png",
        "url_label": "yoshuabengio.org",
        "output": "video assets/videos/scene_10_yoshua_bengio_highlight_1080p.mp4",
        "draw_highlight": False,
        "zoom": 1.70,
        "duration": 5.0,
    },
    {
        "id": "scene_11_geoffrey_hinton",
        "image": "video assets/images/captured_scene_11_geoffrey_hinton.png",
        "url_label": "nobelprize.org/physics/2024/hinton",
        "output": "video assets/videos/scene_11_geoffrey_hinton_highlight_1080p.mp4",
        "draw_highlight": False,
        "zoom": 1.75,
        "duration": 5.0,
    },
    {
        "id": "scene_12_intl_ai_safety_report",
        "image": "video assets/images/captured_scene_12_intl_ai_safety_report.png",
        "url_label": "gov.uk/international-scientific-report-ai",
        "output": "video assets/videos/scene_12_intl_ai_safety_report_highlight_1080p.mp4",
        "draw_highlight": False,
        "zoom": 1.65,
        "duration": 5.0,
    },
    {
        "id": "scene_13_instrumental_convergence",
        "image": "video assets/images/captured_scene_13_instrumental_convergence.png",
        "url_label": "lesswrong.com/tag/instrumental-convergence",
        "output": "video assets/videos/scene_13_instrumental_convergence_highlight_1080p.mp4",
        "draw_highlight": False,
        "zoom": 1.75,
        "duration": 5.0,
    },
    {
        "id": "scene_14_tech_automation",
        "image": "video assets/images/captured_scene_14_tech_automation.png",
        "url_label": "techcrunch.com/category/artificial-intelligence",
        "output": "video assets/videos/scene_14_tech_automation_highlight_1080p.mp4",
        "draw_highlight": False,
        "zoom": 1.65,
        "duration": 5.0,
    },
    {
        "id": "scene_15_apollo_research",
        "image": "video assets/images/captured_scene_15_apollo_research.png",
        "url_label": "apolloresearch.ai",
        "output": "video assets/videos/scene_15_apollo_research_highlight_1080p.mp4",
        "draw_highlight": False,
        "zoom": 1.70,
        "duration": 5.0,
    },
    {
        "id": "scene_16_uk_aisi",
        "image": "video assets/images/captured_scene_16_uk_aisi.png",
        "url_label": "aisi.gov.uk",
        "output": "video assets/videos/scene_16_uk_aisi_highlight_1080p.mp4",
        "draw_highlight": False,
        "zoom": 1.70,
        "duration": 5.0,
    },
    {
        "id": "scene_17_ai_incident_db",
        "image": "video assets/images/captured_scene_17_ai_incident_db.png",
        "url_label": "incidentdatabase.ai",
        "output": "video assets/videos/scene_17_ai_incident_db_highlight_1080p.mp4",
        "draw_highlight": False,
        "zoom": 1.70,
        "duration": 5.0,
    },
    {
        "id": "scene_18_github_advisories",
        "image": "video assets/images/captured_scene_18_github_advisories.png",
        "url_label": "github.com/advisories",
        "output": "video assets/videos/scene_18_github_advisories_highlight_1080p.mp4",
        "draw_highlight": False,
        "zoom": 1.75,
        "duration": 5.0,
    },
]


def main() -> None:
    animator = WebsiteAnimator(fps=30)
    
    print(f"==============================================================================")
    print(f"==> RENDERING {len(SCENES)} WEBSITE CLIPS FROM LOCAL IMAGES (ZERO DOWNLOADS)...")
    print(f"==============================================================================")

    t0 = time.time()
    successful = []

    for idx, sc in enumerate(SCENES, 1):
        img_path = Path(sc["image"])
        out_vid = Path(sc["output"])
        
        if not img_path.exists():
            print(f"[{idx:02d}/{len(SCENES):02d}] WARNING: Missing image {img_path}")
            continue

        # Load box metadata if present
        meta_file = img_path.with_suffix(".json")
        box = None
        if meta_file.exists():
            try:
                with open(meta_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    box = data.get("highlight_box")
            except Exception:
                pass

        hl_label = "YES" if sc["draw_highlight"] else "NO (DEEP ZOOM ONLY)"
        print(f"[{idx:02d}/{len(SCENES):02d}] RENDERING: {out_vid.name} (zoom: {sc['zoom']}x, highlight: {hl_label})...")
        
        animator.render(
            image_path=img_path,
            output_video_path=out_vid,
            duration=sc["duration"],
            highlight_box=box,
            url_label=sc["url_label"],
            zoom_target=sc["zoom"],
            draw_highlight=sc["draw_highlight"],
        )
        print(f"       -> DONE: {out_vid.name} ({out_vid.stat().st_size:,} bytes)")
        successful.append(out_vid)

    total_time = time.time() - t0
    print(f"==============================================================================")
    print(f"==> ALL {len(successful)} CLIPS RENDERED IN {total_time:.1f}s ({total_time / len(successful):.1f}s/clip)!")
    print(f"==============================================================================")


if __name__ == "__main__":
    main()
