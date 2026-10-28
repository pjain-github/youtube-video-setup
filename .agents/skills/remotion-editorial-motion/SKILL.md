---
name: remotion-editorial-motion
description: Guidelines and prompt templates for "editorial" 16:9 motion graphics in Remotion - full-bleed colour-block scenes that change per beat, mixed sans + italic-serif headlines with highlighter-marked words, mono "// label" eyebrows, white UI/data cards with hard offset shadows, halftone mascots, and Vox-style scale/data explainers. Use for SaaS product ads, benchmark/comparison videos, launch videos, and designer-style showreels. Derived from the Claude Opus 5.5 motion-graphics demos (Pocketsflow ad, Sonnet vs Opus benchmark, Sun and planets).
---

# Remotion Editorial Motion (16:9, scene-per-beat)

Reference: "Claude Opus 5.5 Is INSANE at Motion Graphics" (https://www.youtube.com/watch?v=OIAWkkSO4WY). The video shows three outputs that share one design DNA. This skill captures that DNA plus a recipe for each.

Companion skills: [`remotion-clean-animations-long`](../remotion-clean-animations-long/SKILL.md) (calmer, light-only look), [`remotion-word-by-word-captions`](../remotion-word-by-word-captions/SKILL.md) (narration text), [`project-remotion-workflow`](../project-remotion-workflow/SKILL.md) (render/preview in this repo).

---

## Shared DNA (what makes it look designed, not "AI slop")

1. **One idea per scene, 2 to 4 seconds each.** Every beat gets its own full-bleed background colour (cream -> near-black -> brand colour -> warm gray). Colour change = scene change; no gradients or stock backgrounds.
2. **Mixed-type headlines.** Bold grotesque sans for the claim, *italic serif* for the emotional word ("Daily work: *nearly even.*"). Optionally a **highlighter box** (solid blue or terracotta rectangle with white/black text) behind the payoff phrase ("Opus pulls ahead.").
3. **Mono eyebrow labels** in the top-left of every scene: `// for creators`, `02 - EVERYDAY WORK`, with a small coloured square bullet. Tiny uppercase, letter-spacing 0.12em. A top-right running timecode/brand tag is optional.
4. **White cards with a hard, offset shadow** (e.g. `4px 4px 0 #1a1a1a` plus 1.5px dark border, radius 16-20) holding UI or data. Cards enter with spring scale/translate, rows inside stagger by 4-6 frames.
5. **Two accents only per video**, plus neutrals. Example: Sonnet blue `#6C9BD2` and Opus terracotta `#E07A5F`. A legend (small squares + names) sits bottom-left.
6. **Big whitespace, one hero.** Headline left (about 45% width), card/visual right. Nothing else competes.
7. **Motion vocabulary**: spring pop-ins (damping 14-18, stiffness 160-220), bar fills that ease from 0 to value, text that slides up 16-24px with a short fade, per-letter or per-word stagger for kinetic type, hard cuts between colour scenes (or a 6-8 frame wipe). No bouncy overshoot on text.
8. **Audio is part of the piece.** Short whooshes/ticks on card entrances, a quiet music bed. Remotion does not add audio automatically, so say so in the prompt (see Audio).

---

## Design tokens

```typescript
export const editorial = {
  // Scene backgrounds (rotate one per beat)
  cream: '#F6F3EC',
  ink: '#161616',        // near-black scene
  paper: '#ECE9E4',      // warm gray scene
  brand: '#E07A5F',      // full-bleed brand-colour scene (swap for your brand)
  blue: '#2F5BFF',       // electric-blue scene (SaaS ad variant)

  // Text
  textOnLight: '#161616',
  textOnDark: '#FAFAFA',
  muted: '#8A8A8A',

  // Data accents
  accentA: '#6C9BD2',
  accentB: '#E07A5F',
  track: '#EAE6DF',      // bar track inside cards

  // Card
  card: '#FFFFFF',
  cardBorder: '#1A1A1A',
  cardShadow: '4px 4px 0 #1A1A1A',
  highlighter: '#2F5BFF', // text selection-style box behind a key phrase
};

export const editorialFonts = {
  sans: '"Inter Tight", "Inter", system-ui, sans-serif',     // headlines, UI
  serif: '"Newsreader", "Instrument Serif", Georgia, serif',  // italic emphasis
  mono: '"JetBrains Mono", "IBM Plex Mono", monospace',       // eyebrows, labels
};
```

Load fonts with `@remotion/google-fonts` (see `remotion-best-practices`), never from a runtime `<link>`.

---

## Core building blocks

### Eyebrow label
```tsx
const Eyebrow: React.FC<{n?: string; text: string; color?: string; dot?: string}> = ({n, text, color = '#161616', dot = '#E07A5F'}) => (
  <div style={{position: 'absolute', top: 56, left: 72, display: 'flex', alignItems: 'center', gap: 14,
    fontFamily: editorialFonts.mono, fontSize: 20, letterSpacing: '0.12em', textTransform: 'uppercase', color}}>
    <span style={{width: 12, height: 12, background: dot}} />
    {n ? `${n} - ` : ''}{text}
  </div>
);
```

### Mixed headline with italic serif + highlighter
```tsx
<h1 style={{fontFamily: editorialFonts.sans, fontWeight: 600, fontSize: 96, lineHeight: 1.05, color: '#FAFAFA', margin: 0}}>
  Daily work:<br />
  <em style={{fontFamily: editorialFonts.serif, fontWeight: 400, color: editorial.accentA}}>nearly even.</em>
</h1>

// Highlighter: background box wipes in left->right behind the words
const wipe = interpolate(frame - start, [0, 10], [0, 100], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
<span style={{background: `linear-gradient(90deg, ${editorial.highlighter} ${wipe}%, transparent ${wipe}%)`, padding: '0 14px', color: '#fff'}}>
  Opus pulls ahead.
</span>
```

### Hard-shadow data card with animated bars
```tsx
const Bar: React.FC<{label: string; value: number; max: number; color: string; delay: number}> = ({label, value, max, color, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: {damping: 20, stiffness: 120}});
  return (
    <div style={{display: 'grid', gridTemplateColumns: '140px 1fr 90px', alignItems: 'center', gap: 16, fontFamily: editorialFonts.sans}}>
      <span style={{fontSize: 22}}>{label}</span>
      <div style={{height: 16, borderRadius: 8, background: editorial.track}}>
        <div style={{height: '100%', width: `${(value / max) * 100 * p}%`, borderRadius: 8, background: color}} />
      </div>
      <span style={{fontSize: 26, fontWeight: 700, textAlign: 'right'}}>{(value * p).toFixed(1)}%</span>
    </div>
  );
};

<div style={{background: '#fff', border: '1.5px solid #1A1A1A', borderRadius: 20, boxShadow: editorial.cardShadow, padding: 32, width: 640,
  transform: `translateY(${(1 - enter) * 40}px) scale(${0.96 + 0.04 * enter})`, opacity: enter}}>
  {/* title row with outlined pill badge, then Bar rows */}
</div>
```

### Scene sequencer (colour per beat)
```tsx
const scenes = [
  {bg: editorial.cream, dur: 75, el: <Intro />},
  {bg: editorial.ink,   dur: 90, el: <DailyWork />},
  {bg: editorial.brand, dur: 90, el: <HardTasks />},
  {bg: editorial.paper, dur: 90, el: <MatchTheTask />},
];
// <Series> with each scene wrapped in <AbsoluteFill style={{background: bg}}>.
// Hard cut, or 6-8 frame slide/wipe via @remotion/transitions (see remotion-best-practices).
```

---

## Recipe A - SaaS product ad (the "Pocketsflow" look)

- Scene backgrounds flip **white -> electric blue -> white -> near-black**, one short phrase per scene: "Got something to sell?" / "Courses, ebooks, apps?" / "Pocketsflow turns it into a store" / "Checkout, subscriptions, upsells, taxes, payouts, handled" / "You create. We handle the flow."
- **Halftone/dithered mascot** (greyscale dot-pattern character, bust crop, bottom-right) is the brand face; it reacts by sliding/bobbing between scenes. Generate with an image model, then convert to halftone (e.g. Pillow ordered dithering) so it matches the page. Use a transparent PNG.
- Headline: tight sans with one word swapped to **serif** ("Pocketsflow *turns it into*"). Letters of the brand name can fly in per-character and snap together.
- UI proof: a phone mockup with a store listing, then a **bento grid** (checkout, subscription slider "$9 / month" with timeline dots, upsell checkbox, taxes list, payouts "$0.00") where tiles fill in one by one (stagger 8-10 frames). Tiny mono `// checkout` labels on each tile.
- Palette: black/white plus one blue. Total length 12-20s.

## Recipe B - Benchmark / comparison video (the "Sonnet vs Opus" look)

- 4-6 scenes: question -> daily work -> hard tasks -> which to use -> CTA.
- Each scene: eyebrow (`02 - EVERYDAY WORK`), 2-line headline with italic serif tail, **one white card** with 2 benchmark groups (benchmark name in bold, italic serif sub-caption, two bars, value at right), small pill badge for the delta (`OPUS +2.3`), source line in 12-14px at the card bottom, legend bottom-left.
- Final scene: two stacked cards ("Reach for A" / "Reach for B") with checklist rows and tiny right-aligned mono tags.
- Use real, sourced numbers. Put the source in the card footer. Do not invent benchmarks; research them and cite.
- 20s at 30fps = 600 frames; about 100-120 frames per scene.

## Recipe C - Vox-style scale / data explainer (the "Sun and planets" look)

- Dark textured background (subtle cloudy noise at low opacity, never a bright image), top-left small caption `THE SUN & PLANETS, BY DIAMETER`, top-right pill showing the unit reference (`EARTH = 1x`).
- Numbered chapter title top-left of the stage (`02 SMALLER THAN EARTH`, `03 THE ICE GIANTS`).
- **Objects drawn to true relative scale** on a shared baseline; labels in condensed bold sans, multiplier chips on **yellow highlighter badges** (`#FFD60A` with black text), dotted baseline reference, bracket line with the measurement (`1,391,400 km`).
- Camera moves are animated `scale`/`translateX` on a world container, not cuts: pan to the next group, then zoom out for the finale ("THE SUN 109x") with an inset "magnified x10, not to scale" mini-map.
- Footer: tiny `SOURCE: ...` left and `ARTWORK IS ILLUSTRATIVE` right.
- Narration drives timing: write the script first, generate the voiceover, then place each scene start from word timestamps.

## Recipe D - Designer showreel

- Prompt: "Make a dynamic 15-second motion graphics video that shows what an incredible motion designer you are. This is your showreel for a resume. Go all out." Works with a strong model but is a gamble; add a palette and 3 named techniques (dot-grid morph, kinetic type, shape transitions) for consistency.
- Look: electric-blue and off-white fields, a dot-matrix grid that morphs into a ring/torus, tilted rounded squares, cursor clicks, sound ticks on every hit.

---

## Workflow (what the video recommends, adapted to this repo)

1. **Give a reference.** Attach a reference clip or screenshots of the target style. Ask the model to study layout structure, typography treatment and pacing before coding. Vague prompts ("make a stunning premium video") produce boring output.
2. **Be explicit about**: duration, fps, resolution (1920x1080 for this skill), brand hex codes and fonts, scene list with the exact text per scene, and what to avoid.
3. **Fair test / isolation** (optional): tell the model not to read older compositions if you want a fresh take; otherwise point it at `CleanViralShort`, `Argon`, etc. as house style.
4. **Audio**: Remotion does not add sound by itself. Ask for generated SFX and a music bed (Python synthesis, or MCP music/voice tools), plus an ElevenLabs voiceover via `src/youtube_video_setup/elevenlabs_audio/` when narration is wanted. Mix at roughly -14 LUFS, music about -22 dB under the voice.
5. **Level two (orchestrator)**: connect MCPs for image generation (mascot/hero art), voice, music, and Blender for 3D. Then let the model generate assets and wire them into the composition.
6. Fix script/typography afterwards by editing text or supplying your own script; don't regenerate everything.
7. Register the composition in `src/youtube_video_setup/remotion/src/Root.tsx`, preview in Studio, render per `project-remotion-workflow`.

---

## Prompt template

```text
You are an expert Remotion motion designer. Build a 1920x1080, 30fps, <N>-second composition: <topic>.

Reference: <attached video / screenshots>. Replicate its layout structure, typography treatment and pacing. Do not copy its content.

Art direction (editorial, scene-per-beat):
- Each scene is a full-bleed solid colour: <list 3-4 colours with hex>. Hard cut or 6-8 frame wipe between scenes.
- Headlines: <sans> semibold, with the key phrase in italic <serif>; one highlighter box on the payoff phrase per scene.
- Mono uppercase eyebrow top-left on every scene ("01 - TOPIC"), small coloured square bullet.
- White cards with 1.5px dark border, radius 20, hard offset shadow 4px 4px 0 #1A1A1A. Cards spring in; inner rows stagger 4-6 frames.
- Only two data accents: <hex A>, <hex B>. Legend bottom-left. Source line in each data card.
- Spring physics damping 14-18, stiffness 160-220. All motion from useCurrentFrame(); no CSS transitions.

Scenes:
1. <text + visual>
2. ...

Audio: synthesize SFX (whoosh on card entrance, tick on number reveal) and a low music bed with Python; mix under <voiceover if any>.
Research and cite any facts or numbers; do not invent data.
Register in Root.tsx and run the Studio preview.
```

## Checklist before delivering

- [ ] No scene shows more than one headline plus one visual.
- [ ] Every scene has an eyebrow label and a distinct background colour.
- [ ] Only two accent colours; the neutral palette is consistent.
- [ ] Text never overshoots; cards use spring, bars ease to value.
- [ ] Numbers are sourced; source text is legible at 1080p.
- [ ] Audio present and mixed; safe margins of 72px respected.
