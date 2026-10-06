# Professional Kurzgesagt-Style 2D Vector Infographic Generator

Generates bold, high-saturation, flat vector illustrations in the signature aesthetic of *Kurzgesagt – In a Nutshell*.

## Visual Style Philosophy & Specification

- **Art Style:** Flat vector illustration using clean, rounded geometric shapes, pill silhouettes, and smooth mathematical curves.
- **Color Saturation:** Extremely high color saturation levels throughout the composition. Bold color blocking where each distinct element contains a single saturated, luminous hue.
- **Color Temperature Contrast:** Masterful, intense contrast between warm tones (electric ruby red, radiant amber, neon coral, intense tangerine) and cool tones (deep space midnight navy, ultra-saturated cobalt, bright cyan, vivid electric teal).
- **Shading & Gradients:** Mostly solid flat colors with minimal gradients. Shading is strictly subtle, flat, and limited—favoring pure flat color blocking over tonal variation.
- **Boundaries & Details:** Clean vector shapes with razor-sharp color boundaries between elements. Simplified, iconic forms with minimal clutter but maximum color intensity.
- **Approachability:** Maintains an approachable, modern, and playful geometric aesthetic while projecting authoritative, serious scientific tension.
- **Backgrounds:** Seamless, deep saturated space or dark obsidian/midnight navy blue (`#070B19` to `#0B132B`) with faint floating geometric vector accents (glowing rings, clean circular nodes, minimal plus markers).
- **Negative Constraints:** Strictly flat 2D vector art. ABSOLUTELY NO text, NO words, NO letters, NO numbers, NO labels, NO typography anywhere in the image (text distorts during diffusion video conversion). Use pure geometric symbols and visual metaphors only. ABSOLUTELY NO floor perspective grids, NO wireframe mesh ground, NO 3D photorealism, NO real plastic reflections, NO muddy gradients, NO watermarks or logos.

---

## 5-Second Video & Keyframe Pacing Architecture

Every 5 seconds of narration pairs with a dedicated, focused visual beat:
1. **Clear Focal Subject:** Exactly one primary concept per 5 seconds (e.g. containment chamber, escaping pulse, global internet mesh, algorithmic eye).
2. **Kinetic Camera Intent:** Designed specifically for the 2D Kurzgesagt Animation Engine (`kurzgesagt_animator`) with explicit camera motion instructions (smooth dolly forward, sweeping horizontal track, continuous geometric rotation, or macro punch-in) and procedural vector FX.
3. **High Retainability:** High-saturation color blocking ensures immediate visual comprehension in the first 0.5s of playback.

---

## Prompt Engineering Blueprint for Kurzgesagt Keyframes

```text
Create in the style of Kurzgesagt with flat vector illustration using rounded geometric shapes and smooth curves. Apply mostly solid flat colors with minimal gradients. Use extremely high color saturation levels throughout the composition. Emphasize strong contrast between warm and cool tones for dramatic visual impact. Build with bold color blocking where each shape contains a single saturated hue. Keep shading subtle and limited, favoring pure flat color over tonal variation. Design with vibrant and intense color relationships that create energetic visual tension. Maintain clean vector shapes with sharp color boundaries between elements. Use simplified forms with minimal detail but maximum color intensity. Style should feel bold, eye catching, and modern with masterful use of high saturation color theory and flat design principles while preserving the approachable geometric aesthetic.

Scene Subject:
[SPECIFIC CONCEPTUAL SUBJECT WITH ROUNDED GEOMETRIC SHAPES]

Composition & Color Palette:
[SPECIFIC BOLD SATURATED COLORS: e.g. vibrant cyan #00F5FF, intense neon coral #FF3366, radiant amber #FFB703, deep space midnight navy background #0A1128, zero floor grids, 16:9 widescreen, Full HD]
```