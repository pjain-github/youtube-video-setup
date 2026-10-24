---
name: remotion-clean-animations
description: Guidelines and prompt templates for generating sleek, modern "Clean Tech UI" motion design (light off-white canvas, kinetic typography, brand icon squircles, device mockups, checklist reveals, and step flowcharts) optimized for Short-Form (9:16 vertical / 1080x1920) YouTube Shorts, Reels, and TikTok.
---

# Remotion Clean Animations (Short-Form / Vertical 9:16 Clean Tech Style)

This skill provides prompt templates, animation rules, design tokens, and components for generating high-retention, modern **Clean Tech UI / Developer Explainer** motion graphics in **9:16 vertical format (1080x1920)** for YouTube Shorts, Instagram Reels, and TikTok.

Based directly on viral tech breakdowns (such as InsiderForce's viral AI models, Cursor/Claude feature launches, and local AI tutorials), this style is characterized by:
- **Clean flat light-gray / off-white paper canvas** (`#F0F0F0` / `#FAFAFA`). Never dark obsidian, never harsh sterile `#FFFFFF`.
- **Deep charcoal typography** (`#222222` / `#1A1A1A`) with soft secondary gray (`#737373`) for connective words.
- **Two-tier vertical layout**:
  - **Upper Visual Stage (Y: 15% to 50%)**: Hero graphic / brand icon squircle (e.g. Claude terracotta starburst `#D97757`), device mockup (laptop), hardware card, or animated progress bar.
  - **Lower Kinetic Content Zone (Y: 52% to 85%)**: High-cadence word-by-word sentence reveals, stacked checklist bullet points, or step-by-step pipeline cards.
  - **Bottom Safe Area (Y: 88% to 100%)**: Kept clean and clear for platform UI, with optional custom creator handle or branding.
- **Rhythmic speech cadence animation**: Words pop in sequentially in sync with voiceover (approx. 5 to 7 frames / ~200ms per word) with snappy spring physics (`scale: 0.9 -> 1.0`, `translateY: 16px -> 0px`).

> [!NOTE]
> For widescreen (16:9 landscape / 1920x1080) videos, see the companion skill [`remotion-clean-animations-long`](../remotion-clean-animations-long/SKILL.md).

---

## Design Tokens & Color Palette

```typescript
export const cleanLightTheme = {
  // Canvas & Surfaces
  canvas: '#F0F0F0',          // Clean light-gray paper canvas (RGB: 240, 240, 240)
  surfaceWhite: '#FFFFFF',    // Crisp card surface
  surfaceCard: '#F8F8F8',     // Secondary container
  borderSubtle: '#E5E5E5',    // 1px subtle divider border
  borderStrong: '#222222',    // 2px crisp accent border

  // Ink & Typography
  inkPrimary: '#222222',      // Deep charcoal black for headlines and hero words
  inkSecondary: '#737373',    // Cool neutral gray for connective text
  inkMuted: '#A3A3A3',        // Watermark, timestamps, metadata labels

  // Vibrant Tech Brand Accents
  accentClaude: '#D97757',    // Claude Anthropic Terracotta / Burnt Orange
  accentCyan: '#0284C7',      // Tech Blue / Cyan (models, software)
  accentGreen: '#16A34A',     // Success, 100% Free, Local, Offline checkmarks
  accentRed: '#DC2626',       // High costs, server bills, prohibition slash (⊘)
  accentAmber: '#F59E0B',     // Highlights, warnings, alerts

  // Shadows
  shadowSoft: '0 8px 30px rgba(0, 0, 0, 0.06)',
  shadowCard: '0 4px 16px rgba(0, 0, 0, 0.05)',
  shadowIcon: '0 12px 32px rgba(217, 119, 87, 0.25)', // Brand squircle glow
};
```

---

## Vertical Safe Zones (1080 × 1920)

- **Top Margin**: `160px` to `220px` (avoid system status bar and sound pill).
- **Upper Stage (Visual Hero)**: Centered around `y = 480px` (height ~450px to 550px).
- **Lower Stage (Text / Cards)**: Centered between `y = 950px` and `y = 1550px`.
- **Watermark / Footer**: Pinned at `y = 1680px` (`fontSize: 22px`, `opacity: 0.45`).
- **Bottom Margin**: Clear below `1720px` (avoid YouTube Shorts title, creator info, and subscribe button).
- **Horizontal Width**: `width: 900px` to `940px` centered horizontally.

---

## Key Animation Patterns

### 1. Rhythmic Word-by-Word Kinetic Speech
Words pop in sequentially every 5 to 7 frames (matching human speech pacing):
```tsx
const words = ["The", "open", "source", "model", "that", "just", "beat", "Claude"];
const wordDelay = 6; // frames per word

{words.map((word, idx) => {
  const p = spring({frame: frame - (startFrame + idx * wordDelay), fps, config: {damping: 16, stiffness: 200}});
  if (frame < startFrame + idx * wordDelay) return null;
  return (
    <span
      key={idx}
      style={{
        display: 'inline-block',
        transform: `translateY(${(1 - p) * 16}px) scale(${0.9 + 0.1 * p})`,
        opacity: p,
        marginRight: 14,
        color: word === 'Claude' ? '#D97757' : '#222222',
        fontWeight: word === 'Claude' ? 800 : 700,
      }}
    >
      {word}
    </span>
  );
})}
```

### 2. Brand Icon Squircle Pop-in
Hero visual centered on top:
```tsx
<div
  style={{
    width: 320,
    height: 320,
    borderRadius: 80, // squircle radius ~25%
    background: '#D97757', // Claude terracotta
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 20px 50px rgba(217, 119, 87, 0.3)',
    transform: `scale(${spring({frame, fps, config: {damping: 15, stiffness: 180}})})`,
  }}
>
  <ClaudeLogoIcon size={180} color="#FFFFFF" />
</div>
```

### 3. Stacked Checklist Items (Sequential Stagger)
Stacked bullet points with prohibition `⊘` or check `✓` badges spaced ~120px apart:
```tsx
const items = [
  "No subscriptions.",
  "No usage restrictions.",
  "No internet required."
];
// Each row enters staggered by 12-15 frames with slide-in and pop
```

### 4. Step Flowchart Pipeline
Step-by-step process visualization connected with clean directional arrows:
```tsx
// Layer loaded into RAM -> Runs it -> Unloads it -> Then pulls in next layer
```

---

## The Prompt Template for Vertical Shorts

When generating scenes in this style:

```text
You are an expert React and Remotion motion designer specializing in clean, high-retention tech explainer animations for YouTube Shorts.

Your task is to generate a vertical Remotion component (1080x1920, 30fps) for a clean tech update.

### Visual & Art Direction:
1. Canvas:
   - Clean flat light-gray / off-white paper canvas (#F0F0F0). NEVER pure #FFFFFF, NEVER dark mode.
   - Clean background without distracting clutter; optional bottom watermark or handle.
2. Layout (Two-Tier Vertical Hierarchy):
   - Upper Stage (Y: 15% to 50%): Hero brand icon squircle (e.g. Claude orange #D97757), device mockup (laptop), or animated progress meter.
   - Lower Stage (Y: 52% to 85%): Rhythmic kinetic speech text, stacked checklist rows, or step flowchart nodes.
3. Typography:
   - Primary Sans: Inter / Plus Jakarta Sans (bold #222222, connective words in muted #737373).
   - Monospace: JetBrains Mono (metrics, commands, specs).
   - Terracotta Orange (#D97757) or Tech Cyan (#0284C7) for primary hero highlights.
4. Animation Physics:
   - Word-by-word speech reveals: 5 to 7 frames per word.
   - Snappy spring physics for icon and card entrances: spring({damping: 16, stiffness: 200}).
   - All motion strictly driven by useCurrentFrame().

### Specific Scene Instructions:
<SCENE_SPECIFIC_INSTRUCTIONS>
(Provide voiceover transcript, hero graphic subject, checklist items, and keywords to emphasize).
```
