---
name: remotion-story-style
description: Guidelines and prompts for generating story-style Remotion animations (kinetic typography, abstract motion design) distinct from explainer videos.
---

# Remotion Story-Style Animation (Kinetic Typography & Editorial Motion Design)

This skill provides prompt templates and guidelines for generating "story-style" kinetic typography and motion design in Remotion. It focuses on high-impact, editorial kinetic typography, punchy rhythmic word-by-word reveals, and clean graphic motion over a **warm off-white/paper background**.

**When to use this:**
Use this for high-energy hooks, chapter titles, dramatic quote highlights, and "pure text" scenes where words drive the story forward with dynamic weights, sizes, and colors.

## The Claude Prompt Template

When you need an LLM or Remotion agent to generate a story-style kinetic text scene, use the following prompt template. **Copy this directly and fill in the `<SCENE_SPECIFIC_INSTRUCTIONS>`:**

```text
You are an expert React and Remotion motion designer. Your task is to generate a Remotion component for an editorial "story-style" kinetic typography scene on a warm off-white canvas.

### Art Direction & Animation Style
1. **Dynamic Typographic Hierarchy:**
   - Mix font families within the same sentence:
     - **Editorial Serif (Italic/Regular):** (e.g. Newsreader, Playfair Display, Georgia) for introspective, narrative, or transitional clauses (e.g. "*But before that,*", "*where the...*").
     - **Grotesque Sans (Heavy Bold):** (e.g. Inter, Space Grotesk) for explosive keywords (e.g. "**things**", "**people**", "**creating**").
     - **Monospace:** (e.g. JetBrains Mono) for numbers, technical metrics, and sub-labels.
   - Varied sizing: combine small conversational sub-lines (32px-48px) with massive screen-dominating hero words (96px-150px).
2. **Kinetic Motion & Spring Physics:**
   - Every key word or phrase enters with snappy spring physics: `spring({frame: frame - delay, fps, config: {damping: 13, stiffness: 210}})`.
   - Transitions include rapid vertical pop (`translateY(30px -> 0)`), scale overshoot (`0.9 -> 1.0`), and de-blur (`blur(12px -> 0)`).
   - Use kinetic highlighter sweeps: animated yellow (`#FFE600`) or orange box wiping behind key words.
3. **Canvas & Atmosphere:**
   - Warm editorial paper background (`#F6F4EE` or `#F7F5F0`), NOT sterile `#FFFFFF` and NOT dark.
   - Subtle halftone / dot grid texture in the lower half or background (`#DCD7CD`, 20px dot spacing, soft mask fade).
   - Crisp neo-brutalist badge accents where appropriate (borders `2px solid #111111`, shadow `4px 4px 0px #111111`).

### Color Palette Constraints (CRITICAL)
You MUST ONLY use this exact editorial palette:
- **Background / Canvas:** `#F6F4EE` (Warm Editorial Cream / Paper)
- **Primary Ink / Charcoal:** `#111111` (Headings, hero text, solid borders)
- **Muted Gray:** `#78736B` (De-emphasized words, connectors)
- **Cobalt / Royal Blue:** `#1D4ED8` (Tech focus, punch words)
- **Terracotta Orange:** `#E06A26` (Warm accent, action words)
- **Highlighter Yellow:** `#FFE600` (Keyword highlight bar)
- **Forest Green:** `#1E6F50` (Positive metrics / emphasis)
- **Surface / Card (White):** `#FFFFFF`

### Technical Constraints
- The component must be written in React using `@remotion/components`, `spring`, `interpolate`, `useCurrentFrame`, and `useVideoConfig`.
- Use `<Sequence>` blocks heavily to sequence different beats of the narration.
- Use flexbox, absolute positioning, and frame-driven transforms.
- Never use CSS `@keyframes` or native CSS transitions. Base all motion entirely on `useCurrentFrame()`.

### Specific Scene Instructions:
<SCENE_SPECIFIC_INSTRUCTIONS>
(Provide the voiceover line, the exact words to highlight, font pairing preference, and timing beats).
```

## How to Apply This Skill
- **When to apply:** When creating punchy video intros, memorable one-liner statements, kinetic text transitions, or emphasis sequences where the narration is visualized purely through typography.
- **How to apply:** Send the above prompt to the LLM. Replace `<SCENE_SPECIFIC_INSTRUCTIONS>` with the transcript segment and desired text layout.
