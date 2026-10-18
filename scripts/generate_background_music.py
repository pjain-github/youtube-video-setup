"""Build the background-music bed, one track per section.

Section N uses a real track if video assets/audio/music/NN_*.mp3 (or .wav/.m4a/.flac) exists
(e.g. 01_suspense.mp3, 02_documentary.mp3 ... 09_hopeful.mp3). It is looped with a
crossfade or trimmed to the section length. Sections without a file fall back to an
original track synthesised here (nothing to license).

Section boundaries come from inputs/audio_scene_timestamps.json. Neighbouring sections
crossfade, and every section is levelled to the same loudness.

Usage:
    python scripts/generate_background_music.py            # writes video assets/audio/background_music.wav
    python scripts/mux_background_music.py                 # mixes it under the video
"""
import subprocess
import itertools
import json
import wave
from pathlib import Path

import numpy as np
from scipy.signal import butter, fftconvolve, lfilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "inputs" / "audio_scene_timestamps.json"
OUT = ROOT / "audio" / "background_music.wav"
MUSIC_DIR = ROOT / "audio" / "music"
SR = 44100
XFADE = 4.0  # seconds of overlap between neighbouring sections
TARGET_RMS = 0.05  # per-section loudness before the final mix

# Chord = (semitones above key root, "m" | "M" | "m7" | "M7" | "sus")
INTERVALS = {"m": (0, 3, 7), "M": (0, 4, 7), "m7": (0, 3, 7, 10), "M7": (0, 4, 7, 11), "sus": (0, 5, 7)}

# One entry per section: (name, bpm, key root MIDI, progression, energy 0-1, heartbeat)
PLAN = [
    ("Cold Open",        124, 57, [(0, "m"), (8, "M"), (3, "M"), (10, "M")],  0.95, False),  # A minor, driving
    ("Machine Improved", 104, 60, [(0, "M7"), (5, "M"), (9, "m7"), (7, "M")], 0.65, False),  # C major, warm
    ("Chatbot to Agent",  92, 62, [(0, "m"), (10, "M"), (8, "M"), (7, "M")],  0.55, False),  # D minor
    ("Blackmail",         80, 52, [(0, "m"), (0, "m"), (8, "M"), (7, "sus")], 0.45, True),   # E minor, dark pulse
    ("Experts Warning",   72, 59, [(0, "m7"), (8, "M7"), (3, "M"), (10, "M")], 0.35, False), # B minor
    ("Rogue != Alive",    64, 55, [(0, "m7"), (5, "m7"), (8, "M7"), (7, "sus")], 0.20, False),  # G minor, slowest
    ("Three Futures",     78, 60, [(0, "m"), (8, "M"), (3, "M"), (10, "M")],  0.50, False),  # C minor, lifting
    ("Off Switch System", 96, 62, [(0, "M"), (7, "M"), (9, "m"), (5, "M")],   0.70, False),  # D major
    ("The Instruction",  112, 55, [(0, "M"), (7, "M"), (9, "m"), (5, "M")],   0.88, False),  # G major, resolve
]


def midi(n):
    return 440.0 * 2 ** ((np.asarray(n, dtype=float) - 69) / 12)


def lowpass(x, fc, order=2):
    b, a = butter(order, fc / (SR / 2), "low")
    return lfilter(b, a, x)


def highpass(x, fc):
    b, a = butter(2, fc / (SR / 2), "high")
    return lfilter(b, a, x)


def saw(freq, n):
    return 2.0 * ((np.arange(n) * freq / SR) % 1.0) - 1.0


def env(n, attack, release):
    e = np.ones(n)
    a, r = min(int(attack * SR), n), min(int(release * SR), n)
    if a:
        e[:a] = np.linspace(0, 1, a) ** 2
    if r:
        e[n - r :] *= np.linspace(1, 0, r) ** 2
    return e


def add(buf, sig, start):
    start = int(start * SR)
    if start >= len(buf):
        return
    end = min(len(buf), start + len(sig))
    buf[start:end] += sig[: end - start]


def reverb(x, rng, seconds=2.6):
    n = int(seconds * SR)
    ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 6, n))
    ir = lowpass(ir, 5000)
    return fftconvolve(x, ir / np.sqrt(np.sum(ir**2)))[: len(x)]


def render_section(idx, length, seed):
    name, bpm, root, prog, energy, heartbeat = PLAN[idx]
    rng = np.random.default_rng(seed)
    n = int(length * SR)
    beat = 60.0 / bpm
    beats_per_chord = 4 if beat * 4 >= 3.5 else 8
    chord_len = beats_per_chord * beat

    pad, arp, bass, drums = (np.zeros(n + 6 * SR) for _ in range(4))
    n_chords = int(length / chord_len) + 2
    for c in range(n_chords):
        off, quality = prog[c % len(prog)]
        t0 = c * chord_len
        notes = [root + off + i for i in INTERVALS[quality]]

        # pad: detuned saws, filtered; brighter when energetic
        dur = chord_len + 1.5
        m = int(dur * SR)
        chord_pad = np.zeros(m)
        for note in notes:
            for cents in (-9, 0, 9):
                chord_pad += saw(float(midi(note)) * 2 ** (cents / 1200), m)
        chord_pad = lowpass(chord_pad, 500 + 1500 * energy) * env(m, 1.0, 1.2) / (3 * len(notes))
        add(pad, chord_pad, t0)

        # bass: sustained when calm, pulsing eighths when energetic
        bnote = float(midi(root + off - 24))
        if energy < 0.5:
            m = int(chord_len * SR)
            tt = np.arange(m) / SR
            add(bass, np.sin(2 * np.pi * bnote * tt) * env(m, 0.3, 0.8) * 0.9, t0)
        else:
            step = beat / 2
            for k in range(int(chord_len / step)):
                m = int(step * 0.9 * SR)
                tt = np.arange(m) / SR
                tone = np.sin(2 * np.pi * bnote * tt) + 0.3 * np.sin(4 * np.pi * bnote * tt)
                add(bass, tone * np.exp(-tt * 7) * (0.9 if k % 2 == 0 else 0.55), t0 + k * step)

        # arpeggio: 16ths when very energetic, else 8ths, else quarter notes
        step = beat / 4 if energy > 0.8 else beat / 2 if energy > 0.3 else beat
        tones = [x + 12 for x in notes] + [notes[0] + 24]
        for k in range(int(chord_len / step)):
            f = float(midi(tones[(k if k % 8 < 4 else 7 - k % 8) % len(tones)]))
            m = int(0.6 * SR)
            tt = np.arange(m) / SR
            tone = np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(6 * np.pi * f * tt)
            add(arp, tone * np.exp(-tt * (9 if energy > 0.5 else 5)) * (0.6 if k % 4 else 0.9), t0 + k * step)

    # percussion
    t = 0.0
    k = 0
    while t < length + 1:
        if heartbeat:
            for dt, g in ((0, 1.0), (beat * 0.35, 0.6)):
                m = int(0.3 * SR)
                tt = np.arange(m) / SR
                thump = np.sin(2 * np.pi * (45 + 60 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 12)
                add(drums, thump * g, t + dt)
            t += beat * 2
            continue
        if energy >= 0.6 or (energy >= 0.4 and k % 2 == 0):
            m = int(0.25 * SR)
            tt = np.arange(m) / SR
            kick = np.sin(2 * np.pi * (48 + 90 * np.exp(-tt * 35)) * tt) * np.exp(-tt * 14)
            add(drums, kick * 0.9, t)
        if energy >= 0.6:
            m = int(0.05 * SR)
            hat = highpass(rng.standard_normal(m), 7000) * np.exp(-np.linspace(0, 9, m))
            add(drums, hat * 0.18, t + beat / 2)
        t += beat
        k += 1

    # arp echo (dotted eighth) + reverb on the airy parts
    d = int(beat * 0.75 * SR)
    arp_fx = arp.copy()
    for tap in (1, 2, 3):
        arp_fx[tap * d :] += arp[: len(arp) - tap * d] * 0.45**tap
    wet = reverb(pad + 0.7 * arp_fx, rng)
    mix = 0.55 * pad + 0.35 * arp_fx + 0.6 * wet + 0.9 * bass + 0.8 * drums
    mix = mix[:n]
    rms = np.sqrt(np.mean(mix**2)) or 1.0
    return mix * (TARGET_RMS / rms), name, bpm


def find_track(idx):
    for p in sorted(MUSIC_DIR.glob(f"{idx + 1:02d}_*")):
        if p.suffix.lower() in (".mp3", ".wav", ".m4a", ".flac", ".ogg"):
            return p
    return None


def load_track(path, length):
    """Decode to mono-summed float samples, loop with equal-power crossfade, trim to `length`."""
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
        check=True, capture_output=True,
    ).stdout
    x = np.frombuffer(raw, dtype="<f4").astype(float)
    n = int(length * SR)
    xf = int(min(3.0, len(x) / SR / 4) * SR)
    out = x.copy()
    while len(out) < n:  # loop: overlap the tail of the music with its own start
        fo, fi = np.cos(np.linspace(0, np.pi / 2, xf)), np.sin(np.linspace(0, np.pi / 2, xf))
        out = np.concatenate([out[:-xf], out[-xf:] * fo + x[:xf] * fi, x[xf:]])
    out = out[:n]
    rms = np.sqrt(np.mean(out**2)) or 1.0
    return out * (TARGET_RMS / rms)


def main():
    scenes = json.loads(SRC.read_text())
    sections = []
    for _, g in itertools.groupby(scenes, key=lambda s: s["section"]):
        g = list(g)
        sections.append((g[0]["start_sec"], g[-1]["end_sec"]))
    assert len(sections) == len(PLAN), (len(sections), len(PLAN))
    total = sections[-1][1]

    out = np.zeros(int((total + 1) * SR))
    for i, (start, end) in enumerate(sections):
        nxt = sections[i + 1][0] if i + 1 < len(sections) else None
        a = 0.0 if i == 0 else start - XFADE / 2
        b = total if nxt is None else nxt + XFADE / 2
        track = find_track(i)
        if track:
            seg, name, bpm = load_track(track, b - a), track.name, 0
        else:
            seg, name, bpm = render_section(i, b - a, seed=1000 + i)
        m = len(seg)
        fade_in = np.sin(np.linspace(0, np.pi / 2, int(XFADE * SR))) if i else None
        fade_out = np.cos(np.linspace(0, np.pi / 2, int(XFADE * SR))) if nxt is not None else None
        if fade_in is not None:
            seg[: len(fade_in)] *= fade_in
        if fade_out is not None:
            seg[m - len(fade_out) :] *= fade_out
        add(out, seg, a)
        print(f"section {i + 1}: {name:28s} {bpm:3d} BPM  {a:6.1f}s -> {b:6.1f}s")

    out = out[: int(total * SR)]
    out *= env(len(out), 3.0, 8.0)  # fade in / out
    # simple stereo widening: slightly different reverb-free delay per channel
    left = out
    right = np.concatenate([np.zeros(int(0.012 * SR)), out[: -int(0.012 * SR)]])
    stereo = np.stack([left, right], axis=1)
    stereo *= 0.89 / max(1e-9, np.abs(stereo).max())
    OUT.parent.mkdir(exist_ok=True)
    with wave.open(str(OUT), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((stereo * 32767).astype("<i2").tobytes())
    print("wrote", OUT, f"({total:.1f}s)")


if __name__ == "__main__":
    main()
