"""Build phrase/word-level caption JSON for the Remotion Subtitled composition.

Uses per-scene narration + start/end from inputs/audio_scene_timestamps.json and
distributes word timings proportionally to word length (with pauses on punctuation).
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "inputs" / "audio_scene_timestamps.json"
OUT = ROOT / "src/youtube_video_setup/remotion/src/data/captions.json"
MAX_WORDS = 6


def weight(word: str) -> float:
    w = len(re.sub(r"\W", "", word)) + 2
    if word.endswith((".", "?", "!")):
        w += 5
    elif word.endswith((",", ";", ":", "—", "…")):
        w += 2.5
    return w


def split_phrases(words):
    phrases, cur = [], []
    for w in words:
        cur.append(w)
        end = w.endswith((".", "?", "!", ",", ";", ":", "—"))
        if len(cur) >= MAX_WORDS or (end and len(cur) >= 4):
            phrases.append(cur)
            cur = []
    if cur:
        if phrases and len(cur) < 3:
            phrases[-1].extend(cur)
        else:
            phrases.append(cur)
    return phrases


scenes = json.loads(SRC.read_text())
out_scenes, phrases_out = [], []
for s in scenes:
    section = re.sub(r"\s*\(\d+:\d+.*?\)\s*$", "", s["section"])
    out_scenes.append({"start": s["start_sec"], "end": s["end_sec"], "section": section})
    text = re.sub(r"[*_`]", "", s["narration"]).strip()
    words = text.split()
    if not words:
        continue
    total = sum(weight(w) for w in words)
    t, span = s["start_sec"], s["end_sec"] - s["start_sec"]
    timed = []
    for w in words:
        d = span * weight(w) / total
        timed.append({"text": w, "start": round(t, 3), "end": round(t + d, 3)})
        t += d
    i = 0
    for p in split_phrases(words):
        ws = timed[i : i + len(p)]
        i += len(p)
        phrases_out.append({"start": ws[0]["start"], "end": ws[-1]["end"], "words": ws})

OUT.write_text(json.dumps({"scenes": out_scenes, "phrases": phrases_out}))
print(len(phrases_out), "phrases ->", OUT)
