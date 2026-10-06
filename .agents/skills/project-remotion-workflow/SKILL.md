---
name: project-remotion-workflow
description: How to create, preview and render Remotion videos in this repo (src/youtube_video_setup/remotion). Use for any motion-graphics, scene, typography, audio-sync or MP4 render task here.
---

# Remotion workflow for this repo

Project root for video work: `src/youtube_video_setup/remotion/` (run all npm commands there).
Pinned version: Remotion 4.0.533 (all `remotion` / `@remotion/*` packages must share this exact version).
Also load the official `remotion-best-practices` skill for API details.

## Layout
- `src/config.ts` — **single source** of width/height/fps/duration (`VIDEO`) and design tokens (`theme`).
- `src/Root.tsx` — register every `<Composition>` here.
- `src/compositions/<Name>/` — one folder per video (`<Name>.tsx` + `index.ts`).
- `src/components/` — reusable: `AnimatedTitle`, `AnimatedBackground`, `FloatingShape`, `GrowBar`, `AudioTrack`.
- `src/utils/animation.ts` (springs, `fade`, `fadeInOut`, easings) and `timing.ts` (`sec`, `stagger`).
- `public/{audio,images,videos}` — symlinks to repo-root `audio/`, `images/`, `videos/` (git-ignored media). Reference with `staticFile("audio/x.mp3")`.
- `out/` — renders (git-ignored).

## Create a scene / composition
1. `npm run new -- MyVideo` scaffolds `src/compositions/MyVideo/` and registers it in `Root.tsx`.
2. Build with `TransitionSeries` (from `@remotion/transitions`) for scenes; make scene lengths derive from `useVideoConfig()` / seconds, never hard-coded frames at one fps.
3. Reuse components before writing new ones; add new shared pieces to `src/components`.

## Animation rules
- Drive ALL motion from `useCurrentFrame()`. No CSS transitions/animations, no `setTimeout`, no `Math.random()` (use `random("seed")` from remotion).
- Use `springIn(frame, fps, delay, springs.smooth|snappy|bouncy)` for entrances; `fade(frame,[a,b])` for clamped eased values.
- Typography: `AnimatedTitle` for word-by-word reveals; load fonts with `@remotion/google-fonts/<Font>`. Stagger with `stagger(i)`.
- Shapes: `@remotion/shapes` via `FloatingShape`; prefer transforms/opacity over layout props.
- Transitions: `slide`, `wipe`, `fade` presentations with `linearTiming`/`springTiming`. Overlap means total = sum(scenes) − sum(transitions).

## Audio sync
- Put files in repo `audio/`, use `<AudioTrack src="audio/file.mp3" />` (fade in/out, trim via `startFromSeconds`); wrap in `<Sequence from={sec(2, fps)}>` to offset.
- Get duration for `durationInFrames` with `getAudioDurationInSeconds` (`@remotion/media-utils`) inside `calculateMetadata` on the `<Composition>`.
- Cut visuals to beats/words via timestamps in seconds converted with `sec()`.

## Preview, verify, render (from `src/youtube_video_setup/remotion`)
- `npm run studio` — Studio at http://localhost:3000
- `npm run compositions` — list IDs/sizes/durations
- `npm run still` — PNG of a frame (check layout fast; edit `--frame`)
- `npx remotion still src/index.ts <Id> out/x.png --frame=N` — any frame
- `npm run render` — Showcase → `out/Showcase.mp4`; any other: `npx remotion render src/index.ts <Id> out/<Id>.mp4`
- Useful flags: `--fps`, `--scale=0.5` (draft), `--crf=18`, `--frames=0-59`, `--props='{"title":"Hi"}'`
- Always run `npm run typecheck` before rendering. Inspect a still before a full render.

## Changing format
Edit `VIDEO` in `src/config.ts` (e.g. 3840×2160, 60 fps, `durationInSeconds`). Vertical: override `width/height` on that `<Composition>` only.
