#!/usr/bin/env python3
"""Convert word-by-word SRT to broadcast-quality, natural YouTube closed captions.

Features:
- Sentence-first boundary detection (respects full stops, question marks, colons)
- Natural clause grouping (commas, dashes, conjunctions)
- Balanced two-line wrapping (max ~38 chars per line, standard YouTube CC aesthetic)
- Reading-rate smoothing (prevents micro-flickers, ensures comfortable reading time)
"""

from __future__ import annotations

import re
from pathlib import Path


def parse_time(ts: str) -> float:
    h, m, s = ts.strip().split(":")
    s, ms = s.split(",")
    return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000.0


def format_time(sec: float) -> str:
    h = int(sec // 3600)
    m = int((sec % 3600) // 60)
    s = int(sec % 60)
    ms = int(round((sec - int(sec)) * 1000))
    if ms >= 1000:
        s += 1
        ms -= 1000
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def balance_two_lines(text: str, max_single_line: int = 36) -> str:
    words = text.split()
    if len(text) <= max_single_line or len(words) <= 4:
        return text

    mid = len(text) // 2
    best_split = None
    min_dist = 9999

    char_count = 0
    for idx, w in enumerate(words[:-1]):
        char_count += len(w) + 1
        dist = abs(char_count - mid)
        if dist < min_dist:
            min_dist = dist
            best_split = idx

    line1 = " ".join(words[: best_split + 1])
    line2 = " ".join(words[best_split + 1 :])
    return f"{line1}\n{line2}"


def build_youtube_srt(src_path: Path, dst_path: Path) -> list[dict]:
    content = src_path.read_text(encoding="utf-8").strip()
    blocks = re.split(r"\n\s*\n", content)

    words = []
    for b in blocks:
        lines = [l.strip() for l in b.splitlines() if l.strip()]
        if len(lines) >= 3:
            t_match = re.match(r"(\d+:\d+:\d+,\d+)\s*-->\s*(\d+:\d+:\d+,\d+)", lines[1])
            if t_match:
                start = parse_time(t_match.group(1))
                end = parse_time(t_match.group(2))
                w = " ".join(lines[2:])
                words.append({"start": start, "end": end, "word": w})

    # Group into primary thought units (sentences, colons, dashes)
    thought_units = []
    cur_unit = []
    for i, w in enumerate(words):
        cur_unit.append(w)
        text = w["word"]
        is_end = False
        if text.endswith((".", "!", "?")) and text not in ["vs.", "e.g.", "i.e.", "Dr.", "Mr."]:
            is_end = True
        elif text.endswith((":", ";", "—")) and len(cur_unit) >= 4:
            is_end = True
        elif i == len(words) - 1:
            is_end = True

        if is_end:
            thought_units.append(cur_unit)
            cur_unit = []

    def split_unit(unit: list[dict]) -> list[list[dict]]:
        n_words = len(unit)
        total_dur = unit[-1]["end"] - unit[0]["start"]

        if n_words <= 10 and total_dur <= 4.5:
            return [unit]

        num_chunks = max(2, round(max(n_words / 7.5, total_dur / 3.8)))
        target_chunk_size = n_words / num_chunks

        scores = [0.0] * (n_words - 1)
        for idx in range(n_words - 1):
            w = unit[idx]["word"]
            pause = unit[idx + 1]["start"] - unit[idx]["end"]

            if w.endswith(","):
                scores[idx] += 15.0
            elif pause >= 0.35:
                scores[idx] += 12.0

            next_w = unit[idx + 1]["word"].lower()
            if next_w in ["and", "but", "while", "where", "because", "which", "when", "that", "from", "with"]:
                scores[idx] += 8.0

        chunks = []
        start_idx = 0

        while start_idx < n_words:
            remaining = n_words - start_idx
            rem_dur = unit[-1]["end"] - unit[start_idx]["start"]
            if remaining <= 10 and rem_dur <= 4.5:
                chunks.append(unit[start_idx:])
                break

            min_take = 4
            max_take = min(11, remaining - 3)

            best_idx = start_idx + min_take - 1
            best_score = -9999.0

            for take in range(min_take, max_take + 1):
                cand_idx = start_idx + take - 1
                cand_dur = unit[cand_idx]["end"] - unit[start_idx]["start"]
                s = scores[cand_idx]
                dist = abs(take - target_chunk_size)
                s -= dist * 0.8
                if cand_dur > 4.5:
                    s -= (cand_dur - 4.5) * 5.0
                if s > best_score:
                    best_score = s
                    best_idx = cand_idx

            chunks.append(unit[start_idx : best_idx + 1])
            start_idx = best_idx + 1

        # Second pass: if any chunk is still > 4.5s and has >= 5 words, split at best internal point
        final_chunks = []
        for c in chunks:
            c_dur = c[-1]["end"] - c[0]["start"]
            if c_dur > 4.5 and len(c) >= 5:
                mid = len(c) // 2
                best_sub = mid
                best_s = -9999.0
                for si in range(1, len(c) - 2):
                    score = 0.0
                    if c[si]["word"].endswith(","):
                        score += 20.0
                    p = c[si + 1]["start"] - c[si]["end"]
                    if p >= 0.2:
                        score += 10.0
                    dur_left = c[si]["end"] - c[0]["start"]
                    dur_right = c[-1]["end"] - c[si + 1]["start"]
                    score -= abs(dur_left - dur_right) * 2.0
                    if score > best_s:
                        best_s = score
                        best_sub = si
                final_chunks.append(c[: best_sub + 1])
                final_chunks.append(c[best_sub + 1 :])
            else:
                final_chunks.append(c)

        # Merge any orphaned tiny chunks (< 4 words and < 1.1s)
        merged = []
        i = 0
        while i < len(final_chunks):
            c = final_chunks[i]
            dur = c[-1]["end"] - c[0]["start"]
            if (len(c) < 4 or dur < 1.1) and i < len(final_chunks) - 1:
                merged.append(c + final_chunks[i + 1])
                i += 2
            elif (len(c) < 4 or dur < 1.1) and merged and len(merged[-1]) + len(c) <= 12:
                merged[-1].extend(c)
                i += 1
            else:
                merged.append(c)
                i += 1

        return merged

    all_cues = []
    for u in thought_units:
        chunks = split_unit(u)
        all_cues.extend(chunks)

    # Format cues with timing smoothing
    formatted_cues = []
    for idx, c in enumerate(all_cues):
        start = c[0]["start"]
        end = c[-1]["end"]

        # If there is a silence after this cue, allow it to linger slightly for comfortable reading
        if idx < len(all_cues) - 1:
            next_start = all_cues[idx + 1][0]["start"]
            gap = next_start - end
            if gap > 0.05:
                end += min(0.35, gap - 0.05)
        else:
            end += 0.5

        raw_text = " ".join([x["word"] for x in c])
        wrapped_text = balance_two_lines(raw_text)

        formatted_cues.append({
            "index": idx + 1,
            "start": start,
            "end": end,
            "text": wrapped_text,
            "raw_text": raw_text,
            "words": len(c),
            "duration": end - start,
        })

    # Write SRT
    srt_lines = []
    for cue in formatted_cues:
        srt_lines.append(str(cue["index"]))
        srt_lines.append(f"{format_time(cue['start'])} --> {format_time(cue['end'])}")
        srt_lines.append(cue["text"])
        srt_lines.append("")

    dst_path.parent.mkdir(parents=True, exist_ok=True)
    dst_path.write_text("\n".join(srt_lines), encoding="utf-8")
    return formatted_cues


if __name__ == "__main__":
    base = Path(__file__).resolve().parent.parent
    src = base / "inputs" / "subtitles_word_by_word.srt"
    dst1 = base / "inputs" / "youtube_captions.srt"
    dst2 = base / "inputs" / "subtitles_youtube.srt"

    cues = build_youtube_srt(src, dst1)
    build_youtube_srt(src, dst2)

    print(f"Successfully generated {len(cues)} YouTube subtitle cues:")
    print(f"  -> {dst1}")
    print(f"  -> {dst2}")
    
    durations = [c["duration"] for c in cues]
    word_counts = [c["words"] for c in cues]
    print(f"Duration: min={min(durations):.2f}s, avg={sum(durations)/len(durations):.2f}s, max={max(durations):.2f}s")
    print(f"Words per cue: min={min(word_counts)}, avg={sum(word_counts)/len(word_counts):.1f}, max={max(word_counts)}")
