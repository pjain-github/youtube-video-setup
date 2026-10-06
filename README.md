# YouTube Documentary Production Pipeline

An end-to-end Python production system for automated Kurzgesagt-style 2D animated documentaries.

---

## Architecture: The 3 Core Pillars

```
┌─────────────────────────────────────────────────────────────┐
│ 1. AUDIO GENERATION (ElevenLabs)                            │
│    - Splits narration scripts into API-safe sections        │
│    - Synthesizes professional broadcast narration           │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. IMAGE GENERATION (Google Gemini Imagen)                  │
│    - 1920×1080 Full HD 16:9 flat vector Kurzgesagt art      │
│    - Enforces strict negative constraints (Zero text/words) │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. VIDEO ANIMATION ENGINE (KurzgesagtAnimator)              │
│    - 100% distortion-free 2D vector animation               │
│    - Cinematic camera motion (eased dolly, pan, snap zoom)  │
│    - Procedural vector FX (strobes, beads, shockwaves, rings│
│    - Native 1080p Full HD @ 30/60 fps via FFmpeg            │
└─────────────────────────────────────────────────────────────┘
```

---

## Quickstart

### 1. Installation

Requires Python 3.11+.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
```

Configure your API keys in `.env`:
```bash
GEMINI_API_KEY="your-gemini-key"
ELEVENLABS_API_KEY="your-elevenlabs-key"
```

---

## Usage

### Pillar 1: ElevenLabs Voiceover Generation
Generate narration MP3 files from the script:
```bash
python -m youtube_video_setup.cli audio \
  --script inputs/AI_Models_Going_Rogue_YouTube_Script.md \
  --output-dir audio
```

### Pillar 2: Gemini 1080p Image Keyframes
Generate flat vector Kurzgesagt keyframes:
```bash
# Test first 5 scenes:
python -m youtube_video_setup.cli images --scenes inputs/scenes.json --limit 5

# Generate all 119 scenes:
python -m youtube_video_setup.cli images --scenes inputs/scenes.json
```

### Pillar 3: Kurzgesagt 2D Video Animation
Render distortion-free 1080p video clips with eased camera motion and vector FX:
```bash
# Render first 5 scenes:
python -m youtube_video_setup.cli video --scenes inputs/scenes.json --limit 5

# Render all scenes:
python -m youtube_video_setup.cli video --scenes inputs/scenes.json
```

### Final Merge: Concatenate Scenes into Full Video
```bash
python -m youtube_video_setup.cli merge \
  --videos-dir videos \
  --output final_documentary_1080p.mp4
```

---

## Archived code (`src/youtube_video_setup/_archived/`)
The Gemini image generator, Kurzgesagt animator, 2D-infographics skill, helper scripts and RunPod tooling are kept in `_archived/` and no longer part of the active workflow.

## RunPod Execution (archived)

For fast execution on RunPod without any trial-and-error:
See [src/youtube_video_setup/_archived/runpod/README.md](src/youtube_video_setup/_archived/runpod/README.md).

```bash
# On RunPod:
bash src/youtube_video_setup/_archived/runpod/setup_pod.sh
bash src/youtube_video_setup/_archived/runpod/run_pipeline.sh all 5
```

---

## Media folders
Only three git-ignored folders hold media: `audio/`, `images/`, `videos/`.

## Remotion motion graphics (active)
Project: `src/youtube_video_setup/remotion/` (Remotion 4.0.533). Agent skills live in `.agents/skills/` (official `remotion-*` skills + `project-remotion-workflow`).

```bash
source .venv/bin/activate && bash scripts/setup-remotion.sh   # one-time: Node in .venv + npm ci
cd src/youtube_video_setup/remotion
npm run studio          # preview at http://localhost:3000
npm run compositions    # list compositions
npm run new -- MyVideo  # scaffold + register a composition
npm run render          # -> out/Showcase.mp4
npx remotion render src/index.ts MyVideo out/MyVideo.mp4
```
Resolution, fps and duration: edit `VIDEO` in `src/config.ts`.
