---
name: remotion-clean-animations-long
description: Guidelines and prompt templates for generating sleek, modern "Clean Tech UI" motion design in Long-Form (16:9 widescreen / 1920x1080) for full-length YouTube videos, deep-dive tech tutorials, and architecture walkthroughs.
---

# Remotion Clean Animations (Long-Form / 16:9 Widescreen Tech Explainers)

This skill provides prompt templates, layout patterns, and design guidelines for generating **Clean Tech UI / Developer Explainer** motion graphics in standard **16:9 landscape format (1920x1080)** for full-length YouTube videos, launch announcements, and architecture walkthroughs.

Directly sharing the minimalist light-mode aesthetic from [`remotion-clean-animations`](../remotion-clean-animations/SKILL.md), this widescreen format expands the clean paper canvas and charcoal typography into balanced multi-column presentations, side-by-side terminal/preview layouts, and horizontal step pipelines.

---

## Design System & Color Palette

- **Canvas Background**: Clean flat light-gray / off-white paper canvas (`#F0F0F0`).
- **Primary Ink**: Deep charcoal black (`#222222` / `#1A1A1A`) for punch headers and hero labels.
- **Secondary Ink**: Cool slate gray (`#737373`) for narrative connective words and subtitles.
- **Brand / Accent Colors**:
  - Claude Terracotta / Burnt Orange: `#D97757`
  - Tech Cyan / Blue: `#0284C7`
  - Success / Free / Local: `#16A34A`
  - Cost / Warning: `#DC2626`
- **Surface Cards**: Crisp white `#FFFFFF` or subtle container `#F8F8F8` with `border: 1px solid #E5E5E5` and soft elevation shadow `0 8px 30px rgba(0, 0, 0, 0.06)`.

---

## 16:9 Widescreen Layout Archetypes

### 1. Split Screen (50/50 Layout)
- **Left Column (X: 120px to 900px)**: Hero visual (Device mockup, Brand icon squircle, or Animated macOS terminal window).
- **Right Column (X: 1020px to 1800px)**: Rhythmic kinetic typography, stacked checklist items with status icons (`⊘` or `✓`), or performance telemetry stats.

### 2. Multi-Step Horizontal Pipeline (Process Flow)
- 3 to 4 stage nodes horizontally aligned:
  `[Model File / GGUF]` ➔ `[Load Single Layer]` ➔ `[Run Layer Inference]` ➔ `[Unload & Stream]`
- Connected with animated directional arrows or SVG lines.

### 3. Head-to-Head Benchmark Leaderboard
- Multi-row comparison table comparing proprietary cloud models (Claude 3.5 Sonnet: $20/mo) vs. local quantized models (Qwen 2.5 Coder 7B: 4GB RAM, $0 Forever).
- Smooth progress bars filling from 0% to the target percentage with spring interpolation.

---

## The Prompt Template for Long-Form (16:9)

When generating long-form scenes:

```text
You are an expert React and Remotion motion designer specializing in clean, modern tech UI animations for 16:9 widescreen YouTube videos.

Your task is to generate a 1920x1080 Remotion component for a clean tech explainer scene.

### Visual & Technical Directives
1. Canvas & Environment:
   - 1920x1080 widescreen dimensions at 30fps.
   - Clean flat light-gray / off-white paper canvas (#F0F0F0). NEVER pure sterile #FFFFFF, NEVER dark mode.
2. Layout Strategy:
   - Full 1920px horizontal canvas with 120px outer margins.
   - 50/50 split screen: Left column for hero graphic / device mockup / terminal, Right column for kinetic text / checklist / metrics.
3. Typography & Accents:
   - Deep charcoal text (#222222) and muted gray (#737373).
   - Accents: Terracotta Orange (#D97757), Tech Blue (#0284C7), Success Green (#16A34A).
4. Motion Physics:
   - Snappy spring physics for card and icon pop-ins: spring({damping: 18, stiffness: 180}).
   - Staggered reveals for sequential bullet rows.
   - Drive all animations strictly via useCurrentFrame().

### Specific Scene Instructions:
<SCENE_SPECIFIC_INSTRUCTIONS>
(Provide script, split-screen requirements, code/terminal commands, and benchmark metrics).
```
