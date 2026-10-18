# Website Video Recording & Cinematic Highlight Skill

Automated system for capturing websites, articles, tweets, and documentation in razor-sharp 4K/high-DPI, and animating cinematic camera push-ins with animated highlighter callout boxes and dark-mode browser mockups.

---

## 1. Visual Directives & Production Standard

Documentary explainer videos (e.g. *Vox*, *Johnny Harris*, *Kurzgesagt*) present digital evidence with authoritative, cinematic polish:

1. **4K High-DPI Capture:**
   - Always capture with `deviceScaleFactor: 2` (Retina resolution, effective 3840×2160 canvas).
   - Text, UI controls, and typography must remain razor sharp when the camera punches in 1.8x–2.5x.
2. **Native Dark Mode:**
   - Emulate `colorScheme: 'dark'` and dark browser styles (`#070B19` background).
3. **Cinematic Camera Push-In (Smoothstep / Cubic Ease):**
   - Eased camera zoom from full overview (`scale: 1.0`) into the focal headline or paragraph (`scale: 1.4 – 1.8`).
   - Smoothly shifts camera anchor so the highlighted phrase rests exactly along the rule-of-thirds focal line.
4. **Animated Highlighter Callout Box:**
   - A radiant neon amber/yellow (`#FFD600` / `#FFB800`) or electric cyan (`#00F0FF`) highlighter stroke.
   - Draws smoothly from left-to-right (`0% -> 100%`) across the targeted text phrase.
   - Includes subtle glowing border radius and semi-transparent marker fill (15–25% alpha) so text is 100% legible beneath it.
5. **Modern Browser Mockup & Lighting:**
   - Wrapped in a dark frosted glass browser container with macOS traffic-light buttons (red, yellow, green) and an address bar pill showing the verified domain.
   - Subtle dark vignette around outer screen edges and warm amber/cyan rim lighting.

---

## 2. Blueprint Directives Mapping

| Blueprint Type | Description | Production Directive |
| :--- | :--- | :--- |
| `website` | News headlines, CVE reports, research papers | 4K dark capture + slow push-in on section header + animated yellow marker box over the key phrase. |
| `twitter` | Posts on X (executives, researchers) | Dark mode tweet card + subtle 3D tilt (`perspective: 800px`, `rotateY: -8deg`) + animated radiating warning rings + metric view counter. |

---

## 3. Python Engine Reference (`youtube_video_setup.website_video`)

### CLI Usage:

```bash
# 1. Capture high-res snapshot & locate text coordinates:
python -m youtube_video_setup.website_video.cli capture \
  --url "https://openai.com/index/hugging-face-model-evaluation-security-incident/" \
  --output "video assets/images/openai_incident_4k.png" \
  --highlight-text "unintended network egress detected"

# 2. Render cinematic 1080p MP4 video with camera zoom and animated highlighter:
python -m youtube_video_setup.website_video.cli animate \
  --image "video assets/images/openai_incident_4k.png" \
  --output "video assets/videos/openai_incident_highlight_1080p.mp4" \
  --highlight-text "unintended network egress detected" \
  --duration 6.0 \
  --fps 30

# 3. All-in-one capture and video render:
python -m youtube_video_setup.website_video.cli create \
  --url "https://openai.com/index/hugging-face-model-evaluation-security-incident/" \
  --highlight-text "unintended network egress detected" \
  --output "video assets/videos/openai_incident_final_1080p.mp4" \
  --duration 6.0
```

---

## 4. Remotion Component Integration

The engine also provides the `<WebsiteHighlightScene />` component for Remotion:

```tsx
import { WebsiteHighlightScene } from '../../components/WebsiteHighlightScene';

<WebsiteHighlightScene
  imageSrc="video assets/images/openai_incident_4k.png"
  url="openai.com/index/security-incident"
  highlightText="unintended network egress detected"
  durationInSeconds={6}
  targetBox={{ x: 340, y: 520, width: 680, height: 42 }}
/>
```
