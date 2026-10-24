---
name: project-remotion-workflow
description: How to create, preview and render Remotion videos in this repo (src/youtube_video_setup/remotion). Use for any motion-graphics, scene, typography, audio-sync or MP4 render task here.
---

# Remotion workflow for this repo

Project root for video work: `src/youtube_video_setup/remotion/` (run all npm commands there).
Pinned version: Remotion 4.0.533 (all `remotion` / `@remotion/*` packages must share this exact version).
Also load the official `remotion-best-practices` skill for API details.

## Layout
- `src/config.ts` — **single source** of width/height/fps/duration (`VIDEO`) and design tokens (`theme`: warm off-white canvas `#F6F4EE`, pure ink `#111111`, cobalt blue `#1D4ED8`, terracotta orange `#E06A26`, highlighter yellow `#FFE600`, neo-brutalist borders/shadows, and font tokens).
- `src/Root.tsx` — register every `<Composition>` here.
- `src/compositions/<Name>/` — one folder per video (`<Name>.tsx` + `index.ts`).
- `src/components/` — reusable:
  - `DotGridBackground` / `AnimatedBackground`: warm off-white paper canvas with subtle dot-matrix/halftone overlay.
  - `EditorialCard`: neo-brutalist container with `2px solid #111` border, `4px 4px 0px #111` hard shadow, and optional pill badge.
  - `HighlighterText`: animated yellow/orange marker bar sweeping behind key words.
  - `KineticTextScene`: multi-tier sentence reveals mixing elegant serif, bold grotesque sans, and monospace.
  - `AnimatedTitle`: word-by-word spring reveals.
  - `Shapes`: `@remotion/shapes` primitives and connectors.
  - `AudioTrack`: audio wrapper with fade in/out and sync.
- `src/utils/animation.ts` (springs, `fade`, `fadeInOut`, easings) and `timing.ts` (`sec`, `stagger`).
- `public/{audio,images,videos}` — symlinks to repo-root `video assets/{audio,images,videos}/` (git-ignored media). Reference with `staticFile("audio/x.mp3")`.
- `out/` — renders (git-ignored).

## Create a scene / composition
1. `npm run new -- MyVideo` scaffolds `src/compositions/MyVideo/` and registers it in `Root.tsx`.
2. Build with `TransitionSeries` (from `@remotion/transitions`) for scenes; derive scene lengths from `useVideoConfig()` / seconds, never hard-coded frames.
3. Reuse components before writing new ones; add new shared pieces to `src/components`.

## Visual & Animation Styles Available in Repo
1. **Editorial Tech Explainer Style** (`remotion-general-animation` / `remotion-story-style`):
   - Warm paper cream (`#F6F4EE`) canvas with subtle dot-matrix texture.
   - Serif + Grotesque Sans + Monospace pairing.
   - Neo-brutalist cards with `2px solid #111111` borders and `4px 4px 0px #111111` hard offset shadows.
   - Animated yellow highlighter strokes (`#FFE600`).

2. **Clean Tech UI / Viral Tech Updates** (`remotion-clean-animations` & `remotion-clean-animations-long`):
   - Deep obsidian / dark navy slate (`#090D16`) with radial glow blobs and subtle digital grid.
   - Sleek glassmorphism (`rgba(15, 23, 42, 0.75)` with `1px solid rgba(255, 255, 255, 0.1)`).
   - macOS Terminal windows with traffic lights, typing command line, and syntax output.
   - Comparative benchmark bars with animated fill percentages and glowing accents.
   - Short format: `remotion-clean-animations` (9:16 vertical 1080x1920 mobile safe-zone optimized).
   - Long format: `remotion-clean-animations-long` (16:9 widescreen 1920x1080 multi-column & pipeline layouts).

## Visual & Animation rules
- **Canvas:** Use warm paper cream (`#F6F4EE` or `#F7F5F0`) with a subtle dot-matrix texture. Avoid pure harsh `#FFFFFF` or dark backgrounds.
- **Typography Pairing:**
  - Serif (Newsreader, Playfair Display, Georgia) for narrative/intro phrases and italic hooks.
  - Grotesque Sans (Inter, Space Grotesk) for massive, bold, punchy hero words.
  - Monospace (JetBrains Mono) for tags, pill badges, and code labels.
- **Kinetic Text ("Just Text" Scenes):**
  - Break sentences into mixed-weight, multi-color tiers.
  - Animate entrance with `springIn` using `translateY(24px -> 0)`, de-blur (`blur(10px -> 0)`), and scale (`0.92 -> 1.0`).
  - Highlight keywords with animated yellow highlighter strokes (`#FFE600`).
- **Cards & Flowcharts:**
  - Cards: Crisp `2px solid #111111` border, `4px 4px 0px #111111` hard offset drop shadow, and top pill badges.
  - Flowcharts / Nodes: SVG bezier curves (`M ... C ...`), dashed animated lines (`strokeDasharray` + `strokeDashoffset`), and rounded endpoints.
- **Drive ALL motion from `useCurrentFrame()`:** No CSS transitions/animations, no `setTimeout`, no `Math.random()`.
- Put files in `video assets/audio/`, use `<AudioTrack src="audio/file.mp3" />` (fade in/out, trim via `startFromSeconds`); wrap in `<Sequence from={sec(2, fps)}>` to offset.
- Get duration for `durationInFrames` with `getAudioDurationInSeconds` (`@remotion/media-utils`) inside `calculateMetadata` on the `<Composition>`.
- Cut visuals to beats/words via timestamps in seconds converted with `sec()`.

## Preview, verify, render (from `src/youtube_video_setup/remotion`)
- `npm run studio` — Studio at http://localhost:3000
- `npm run compositions` — list IDs/sizes/durations
- `npm run still` — PNG of a frame (check layout fast; edit `--frame`)
- `npx remotion still src/index.ts <Id> "../../../video assets/images/remotion_image/x.png" --frame=N` — any frame
- `npm run render` — Showcase → `out/Showcase.mp4`; any other: `npx remotion render src/index.ts <Id> out/<Id>.mp4`
- Useful flags: `--fps`, `--scale=0.5` (draft), `--crf=18`, `--frames=0-59`, `--props='{"title":"Hi"}'`
- Always run `npm run typecheck` before rendering. Inspect a still before a full render.

## Changing format
Edit `VIDEO` in `src/config.ts` (e.g. 3840×2160, 60 fps, `durationInSeconds`). Vertical: override `width/height` on that `<Composition>` only.
