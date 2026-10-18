"""Synthesise an upbeat royalty-free music bed and mix it under video assets/videos/final_video.mp4.

Usage: python scripts/add_upbeat_music.py   # writes video assets/videos/final_video_music.mp4
Video stream is copied (no re-render); music ducks under narration.
"""
import subprocess
import wave
from pathlib import Path

import numpy as np
from scipy.signal import butter, lfilter

ROOT = Path(__file__).resolve().parent.parent
VIDEO = ROOT / "video assets/videos/final_video.mp4"
WAV = ROOT / "video assets/audio/upbeat_music.wav"
OUT = ROOT / "video assets/videos/final_video_music.mp4"
SR = 44100
BPM = 118
MUSIC_GAIN_DB = -20  # adjust to taste (+3 louder, -3 quieter)
PROG = [(0, (0, 4, 7)), (7, (0, 4, 7)), (9, (0, 3, 7)), (5, (0, 4, 7))]  # C G Am F
ROOT_MIDI = 48


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def lp(x, fc):
    b, a = butter(2, fc / (SR / 2), "low")
    return lfilter(b, a, x)


def duration():
    out = subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                   "-of", "csv=p=0", str(VIDEO)])
    return float(out)


def tone(f, n, kind="saw"):
    t = np.arange(n) / SR
    if kind == "saw":
        return 2 * ((t * f) % 1) - 1
    return np.sin(2 * np.pi * f * t)


def place(buf, sig, start):
    end = min(len(buf), start + len(sig))
    if start < len(buf):
        buf[start:end] += sig[: end - start]


def build(total):
    n = int((total + 2) * SR)
    mix = np.zeros(n)
    beat = 60 / BPM
    bl = int(beat * SR)
    rng = np.random.default_rng(1)
    bars = int((total + 2) / (beat * 4)) + 1
    for bar in range(bars):
        # intensity: soft intro, builds, then steady
        energy = 0.5 if bar < 4 else 1.0
        offs, chord = PROG[bar % 4]
        b0 = int(bar * 4 * bl)
        # pad
        pn = 4 * bl
        env = np.minimum(np.arange(pn) / (0.3 * SR), 1) * np.minimum((pn - np.arange(pn)) / (0.3 * SR), 1)
        pad = sum(tone(midi(ROOT_MIDI + 12 + offs + c), pn) for c in chord) * env
        place(mix, lp(pad, 1800) * 0.07, b0)
        for step in range(16):  # sixteenths
            s0 = b0 + int(step * bl / 4)
            # arpeggio pluck on 8ths
            if step % 2 == 0 and energy > 0.6 or step % 4 == 0:
                note = ROOT_MIDI + 24 + offs + chord[(step // 2) % 3]
                ln = int(0.22 * SR)
                e = np.exp(-np.arange(ln) / (0.07 * SR))
                place(mix, lp(tone(midi(note), ln), 3500) * e * 0.10, s0)
            # hats
            if step % 2 == 1 and energy > 0.6:
                ln = int(0.05 * SR)
                h = rng.standard_normal(ln) * np.exp(-np.arange(ln) / (0.012 * SR))
                place(mix, h * 0.05, s0)
        for q in range(4):
            s0 = b0 + q * bl
            if energy > 0.6 or q % 2 == 0:  # kick
                ln = int(0.25 * SR)
                t = np.arange(ln) / SR
                k = np.sin(2 * np.pi * (50 * t + 90 * (1 - np.exp(-t * 30)) / 30)) * np.exp(-t * 14)
                place(mix, k * 0.55, s0)
            if q in (1, 3) and energy > 0.6:  # clap
                ln = int(0.12 * SR)
                c = rng.standard_normal(ln) * np.exp(-np.arange(ln) / (0.03 * SR))
                place(mix, lp(c, 5000) * 0.10, s0)
            # bass on offbeat eighths
            for half in (0, 0.5):
                bs = s0 + int(half * bl)
                ln = int(0.4 * beat * SR)
                e = np.exp(-np.arange(ln) / (0.2 * SR))
                place(mix, lp(tone(midi(ROOT_MIDI - 12 + offs), ln, "sin"), 400) * e * 0.28, bs + (int(0.25 * bl) if half else 0))
    mix = mix[: int(total * SR)]
    fade = int(3 * SR)
    mix[:fade] *= np.linspace(0, 1, fade)
    mix[-fade * 2:] *= np.linspace(1, 0, fade * 2)
    mix = mix / np.max(np.abs(mix)) * 0.9
    return mix


def main():
    total = duration()
    pcm = (build(total) * 32767).astype("<i2")
    with wave.open(str(WAV), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    graph = (
        f"[1:a]volume={MUSIC_GAIN_DB}dB[m];"
        "[m][0:a]sidechaincompress=threshold=0.05:ratio=4:attack=30:release=600:makeup=1[duck];"
        "[0:a][duck]amix=inputs=2:normalize=0:duration=first[a]"
    )
    subprocess.run(["ffmpeg", "-y", "-i", str(VIDEO), "-i", str(WAV), "-filter_complex", graph,
                    "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", str(OUT)],
                   check=True, capture_output=True)
    print("wrote", OUT)


main()
