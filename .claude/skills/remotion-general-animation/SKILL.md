---
name: remotion-general-animation
description: Guidelines and prompts for generating clean, professional "general" motion graphics (launch videos, smooth UI reveals, elegant cards) using Remotion.
---

# Remotion General Animation (Warm Editorial & Neo-Brutalist Motion Design)

This skill provides prompt templates, animation rules, and design guidelines for generating clean, modern Remotion animations in the **Editorial Tech Explainer** style (inspired by modern 2D AI explainer animations, Kevin Ngo, SattTheGreat, and Day One Films).

This style is characterized by:
- **Warm off-white / editorial paper canvas** with subtle dot-matrix / halftone grid patterns.
- **High-contrast typographic pairing**: Elegant Editorial Serif (for conversational intros, italicized headers) + Punchy Grotesque Sans (for massive bold keywords) + Monospace (for UI tags, badges, and technical labels).
- **Pure text kinetic typography scenes**: Sentences constructed from dynamic multi-style, multi-weight, multi-color word groupings with spring reveals and yellow highlighter bars.
- **Neo-brutalist & editorial UI cards**: Crisp black borders (`2px solid #111`), hard offset drop shadows (`4px 4px 0px #111`), top pill badge tags, and organic curved bezier connector arrows.

**When to use this:**
Use this for explainer videos, educational sequences, step-by-step tutorials, architecture flowcharts, and kinetic text segments.

---

## The Claude Prompt Template

When you need an LLM or Remotion agent to generate a scene in this style, use the following prompt template. **Copy this directly and fill in the `<SCENE_SPECIFIC_INSTRUCTIONS>`:**

```text
You are an expert React and Remotion motion designer. Your task is to generate a Remotion component for an "Editorial Tech Explainer" animation with a warm off-white canvas, kinetic typography, and neo-brutalist cards.

### Art Direction & Visual Aesthetics
1. **Canvas & Environment:**
   - Background: Warm off-white / paper cream (`#F6F4EE` or `#F7F5F0`), NEVER pure harsh white `#FFFFFF` and NEVER dark blue/black.
   - Dot Grid Pattern: Include a subtle dot-matrix / halftone pattern overlay (dots in `#DCD7CD` with ~20px spacing, faded out towards the edges or top via radial mask).
2. **Typography Pairing:**
   - **Serif (Editorial / Conversational):** Use elegant serif fonts (e.g. Newsreader, Playfair Display, Cormorant, Georgia) for narrative hooks, introductory clauses, and transitional phrasing. Frequently use italics (e.g. "*Level 1 · the simplest way to make*", "*But before that,*", "*where the...*").
   - **Grotesque Sans (High-Impact Punch):** Use heavy bold sans-serif (e.g. Inter, Space Grotesk, Plus Jakarta Sans) for high-energy punch words (e.g. "**things**", "**creating**", "**people**").
   - **Monospace / UI (Technical Details):** Use monospace (e.g. JetBrains Mono, Space Mono) for code snippets, pill tags, arrows, and metadata labels (e.g. `GSAP · CANVAS · SVG`, `→ WRITES THE CODE`, `LEVEL 1 OF 3`).
3. **Pure Text Kinetic Sequences ("Just Text" Scenes):**
   - Break sentences into dynamic visual hierarchies rather than uniform lines:
     - Connective/intro words: medium size, muted gray (`#78736B`) or italic serif.
     - Core subject: massive font size (90px-130px), extra-bold black (`#111111`).
     - Action / key takeaway: highlighted in Royal Blue (`#1D4ED8`) or Terracotta Orange (`#E06A26`).
   - Animated Highlighter Bar: Draw an animated bright yellow (`#FFE600`) or orange box behind key words using `interpolate(frame, [start, end], [0, 100])` on width or scaleX with `transformOrigin: 'left'`.
   - Word Entrances: Use `spring({frame: frame - delay, fps, config: {damping: 14, stiffness: 180}})` with a subtle vertical rise (`translateY(24px -> 0px)`), de-blur (`blur(10px -> 0px)`), and scale (`0.92 -> 1.0`).
4. **Neo-Brutalist & Editorial UI Containers:**
   - **Cards:** Crisp black border (`2px solid #111111`), solid offset black shadow (`box-shadow: 4px 4px 0px #111111` or `5px 5px 0px #111111`), rounded corners (`border-radius: 6px` to `12px`).
   - **Pill Badges & Tabs:** Small pill badge pinned to the top edge or top-left corner of the card (e.g. `background: #111111` or `#E06A26`, text: white, uppercase monospace, `font-size: 11px`, `border-radius: 999px`).
   - **Connected Flowcharts / Node Graphs:**
     - Connect cards using SVG `<path>` bezier curves (`d="M x1 y1 C cx1 cy1, cx2 cy2, x2 y2"`).
     - Use dashed stroke (`strokeDasharray: "6 6"`) with animated `strokeDashoffset` driven by `useCurrentFrame()`.
     - Animate the line drawing in using `strokeDasharray` and `strokeDashoffset`.
     - End with a circular node dot or directional arrowhead.
   - **App / Tool Icon Tiles:** Rounded squircle tiles (`border-radius: 20px`), dark background (`#1E1E1E`) or bright accent with centered SVG icon and label below.
   - **Step / Progress Badges:** Top-right "LEVEL X OF Y" badge with segmented horizontal progress bar indicators.

### Color Palette Constraints (CRITICAL)
You MUST ONLY use this exact editorial color palette:
- **Canvas / Background:** `#F6F4EE` (Warm Paper Cream)
- **Card Surface (White):** `#FFFFFF`
- **Card Surface (Cream):** `#FAF7F2`
- **Primary Ink / Charcoal:** `#111111` (Headings, primary text, borders, hard shadows)
- **Muted Gray:** `#78736B` (Connective words, subtext, subtle borders)
- **Cobalt / Royal Blue Accent:** `#1D4ED8` (Tech focus, code execution, key action words)
- **Terracotta Orange Accent:** `#E06A26` (Warm highlights, attention badges)
- **Highlighter Yellow:** `#FFE600` (Animated marker highlights behind text)
- **Forest Green:** `#1E6F50` (Success, positive metrics, natural elements)
- **Hard Shadow:** `4px 4px 0px #111111`

### Technical Constraints
- Written in React using `@remotion/components`, `spring`, `interpolate`, `useCurrentFrame`, and `useVideoConfig`.
- Drive ALL animations strictly from `useCurrentFrame()`. Never use CSS `@keyframes` or transitions.
- Use `<Sequence>` to manage staggered timing so text and cards animate sequentially in sync with narration.
- Ensure all layouts are centered or responsive to 1920x1080 canvas dimensions.

### Specific Scene Instructions:
<SCENE_SPECIFIC_INSTRUCTIONS>
(Provide the narration line, desired layout: pure text kinetic reveal vs card diagram vs flowchart, and specific keywords to highlight).
```

## How to Apply This Skill
- **Pure Text Scenes:** When the voiceover delivers an impactful statement, generate a multi-tier kinetic text composition featuring mixed serif/sans typography, word-by-word spring reveals, and yellow highlighter accents.
- **Flowcharts & Architecture:** When explaining how systems connect (e.g. Claude -> Code -> Remotion -> Video), render neo-brutalist cards with 2px borders, 4px hard black shadows, and animated dashed SVG bezier curves.
- **Step / Progress Scenes:** Include the segmented "LEVEL X OF Y" progress header with an active colored pill bar.
