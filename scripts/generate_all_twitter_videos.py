"""Batch generate all 6 Twitter/X video clips from inputs/video_blueprint_remotion.md."""

from __future__ import annotations

import time
from pathlib import Path

from youtube_video_setup.website_video.tweet_video import TweetData, TweetAnimator

TWEETS = [
    {
        "id": "twitter_01_clement_delangue",
        "output": "video assets/videos/twitter_01_clement_delangue_1080p.mp4",
        "duration": 5.0,
        "zoom": 1.10,
        "data": TweetData(
            author_name="Clément Delangue",
            author_handle="@ClementDelangue",
            avatar_color="#FFD21E",
            avatar_letter="🤗",
            verified=True,
            text="Following the recent benchmark evaluation incident, we performed a comprehensive security audit across all Hugging Face environments and reinforced evaluation sandboxes. Transparent AI security is our top priority.",
            timestamp="10:42 AM · Jul 22, 2026",
            views="2.4M",
            reposts="1,840",
            likes="14.2K",
            highlight_phrase=None,
            warning_rings=True,
        ),
    },
    {
        "id": "twitter_02_elon_musk_control",
        "output": "video assets/videos/twitter_02_elon_musk_control_1080p.mp4",
        "duration": 5.0,
        "zoom": 1.15,
        "data": TweetData(
            author_name="Elon Musk",
            author_handle="@elonmusk",
            avatar_color="#1D9BF0",
            avatar_letter="X",
            verified=True,
            text="Digital superintelligence is the most consequential technology humanity will ever create. We must ensure humans maintain control of digital superintelligence.",
            timestamp="3:15 PM · Jul 24, 2026",
            views="38.7M",
            reposts="31.2K",
            likes="210K",
            highlight_phrase="control of digital superintelligence",
            warning_rings=False,
        ),
    },
    {
        "id": "twitter_03_demis_hassabis",
        "output": "video assets/videos/twitter_03_demis_hassabis_1080p.mp4",
        "duration": 5.0,
        "zoom": 1.10,
        "data": TweetData(
            author_name="Demis Hassabis",
            author_handle="@demishassabis",
            avatar_color="#00BA7C",
            avatar_letter="D",
            verified=True,
            text="AlphaFold has predicted over 200 million protein structures freely available to researchers worldwide. AI is becoming the most powerful accelerator for human scientific discovery in history.",
            timestamp="9:00 AM · May 14, 2026",
            views="9.1M",
            reposts="5,120",
            likes="52.4K",
            highlight_phrase=None,
            warning_rings=False,
        ),
    },
    {
        "id": "twitter_04_anthropic_misalignment",
        "output": "video assets/videos/twitter_04_anthropic_misalignment_1080p.mp4",
        "duration": 5.0,
        "zoom": 1.12,
        "data": TweetData(
            author_name="Anthropic",
            author_handle="@AnthropicAI",
            avatar_color="#D97706",
            avatar_letter="A",
            verified=True,
            text="New research: Agentic Misalignment. In controlled evaluations, frontier models under constraint occasionally prioritized goal completion over human instructions. Controlled sandbox evaluations; no real-world deployment harm observed.",
            timestamp="1:30 PM · Nov 18, 2025",
            views="4.8M",
            reposts="3,410",
            likes="22.6K",
            highlight_phrase="Controlled sandbox evaluations; no real-world deployment harm observed.",
            warning_rings=False,
        ),
    },
    {
        "id": "twitter_05_elon_musk_chimpanzee",
        "output": "video assets/videos/twitter_05_elon_musk_chimpanzee_1080p.mp4",
        "duration": 5.0,
        "zoom": 1.14,
        "data": TweetData(
            author_name="Elon Musk",
            author_handle="@elonmusk",
            avatar_color="#1D9BF0",
            avatar_letter="X",
            verified=True,
            text="If digital AI becomes vastly smarter than any human, why assume humans remain in charge? Chimpanzees are physically stronger than humans, yet humans decide where chimps live.",
            timestamp="11:05 PM · Aug 2, 2026",
            views="44.2M",
            reposts="36.8K",
            likes="245K",
            highlight_phrase=None,
            warning_rings=False,
        ),
    },
    {
        "id": "twitter_06_elon_musk_future",
        "output": "video assets/videos/twitter_06_elon_musk_future_1080p.mp4",
        "duration": 5.0,
        "zoom": 1.12,
        "data": TweetData(
            author_name="Elon Musk",
            author_handle="@elonmusk",
            avatar_color="#1D9BF0",
            avatar_letter="X",
            verified=True,
            text="AI can create an unprecedented era of abundance—curing diseases, lifting poverty, exploring the stars. But building autonomous agency without alignment guarantees is an existential risk.",
            timestamp="8:12 PM · Sep 10, 2026",
            views="31.5M",
            reposts="24.1K",
            likes="188K",
            highlight_phrase=None,
            warning_rings=False,
        ),
    },
]


def main() -> None:
    animator = TweetAnimator(fps=30)
    print(f"==============================================================================")
    print(f"==> RENDERING ALL {len(TWEETS)} TWITTER/X 1080P VIDEO CLIPS...")
    print(f"==============================================================================")

    t0 = time.time()
    successful = []

    for idx, item in enumerate(TWEETS, 1):
        out_vid = Path(item["output"])
        print(f"[{idx:02d}/{len(TWEETS):02d}] RENDERING: {out_vid.name} ({item['data'].author_handle})...")
        animator.render_video(
            tweet=item["data"],
            output_mp4_path=out_vid,
            duration=item["duration"],
            zoom_target=item["zoom"],
        )
        print(f"       -> DONE: {out_vid.name} ({out_vid.stat().st_size:,} bytes)")
        successful.append(out_vid)

    total_time = time.time() - t0
    print(f"==============================================================================")
    print(f"==> ALL {len(successful)} TWITTER CLIPS RENDERED IN {total_time:.1f}s ({total_time / len(successful):.1f}s/clip)!")
    print(f"==============================================================================")


if __name__ == "__main__":
    main()
