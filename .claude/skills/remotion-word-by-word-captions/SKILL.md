---
name: remotion-word-by-word-captions
description: Build word-by-word kinetic text (narration captions) in Remotion from a word-level SRT or timestamp JSON - pages of text, words fade in ~0.5s BEFORE they are spoken, one fixed accent-coloured key word per page. Position, number of lines, font and background are configurable. Use for "show the voiceover as animated text", lyric/caption-style explainer text, or any word-synced text track.
---

# Remotion word-by-word captions

Pattern proven in `src/youtube_video_setup/remotion/src/compositions/WordByWord/` (white dotted background, text in the top 20%, Handlee font). This skill captures the *pattern*; layout is a parameter. A copy-ready, parametrized implementation is in [WordPages.template.tsx](./WordPages.template.tsx).

Load `project-remotion-workflow` too (paths, render commands) and `remotion-general-animation` if the dotted background / palette is wanted.

## The pattern

1. **Input = word-level timestamps** `{text, start, end}` in seconds (one word per SRT cue). Convert the SRT once to `src/data/<name>_words.json` (snippet below). Never hand-type timings.
2. **Pages.** Group consecutive words into pages. A page is what is on screen at once. Greedy-fill up to `charsPerLine * lines` characters; also break early at `. ! ? , ; :` once the page is >60% full. Fewer, longer pages read better than many short ones.
3. **Words arrive early.** Each word fades in `LEAD` (0.5s) *before* it is spoken, so the viewer reads slightly ahead of the voice. A page appears `LEAD` before its first word, but never before the previous page's last word has ended (`appear = max(first.start - LEAD, prev.end)`); the previous page stays until the next appears, so pages never overlap or flicker. Last page holds ~0.3s.
4. **Smooth, no jitter.** Entrance = opacity 0→1 and `translateY(14px→0)` over ~0.28s with `Easing.out(Easing.cubic)`. Do NOT use `spring()` with low damping, blur or scale — they overshoot and look like vibration. Keep every word in the layout from the start (opacity 0, not unmounted) so the line never reflows/jumps as words arrive.
5. **Accent colour = emphasis, not a cursor.** Exactly one word per page is in the accent colour (default cobalt `#1D4ED8`), and it stays that colour for the whole page. All other words are ink (`#111111`), including ones not yet spoken. Do not colour the currently-spoken word. Pick the key word by heuristic: longest non-stopword, ties toward the middle; fall back to the middle word. (Simplest alternative the user accepts: always the middle word. Allow a manual override map `{pageIndex: wordIndex}` when the heuristic is wrong.)
6. **Exit** a short 5-frame fade at the end of the page's Sequence.
7. Drive everything from `useCurrentFrame()`; one `<Sequence layout="none">` per page; audio via `<Audio src={staticFile(...)}/>`.

## Parameters to expose (decide per video)

| Param | Meaning | Example used |
|---|---|---|
| `region` | box the text lives in (`top/left/width/height` in %, plus padding) | top 20%, paddingTop 48 |
| `lines` | max lines per page (1 = ticker style, 2-3 = paragraph style) | 1 |
| `charsPerLine` | chars that fit one line at the chosen font size / region width | 52 |
| `align` | `center` / `left`, vertical `flex-start`/`center`/`flex-end` | center |
| `fontSize`, font | font via `@remotion/google-fonts/<Name>` | 66px Handlee 400 |
| `lead`, `fade` | early appearance and entrance length (seconds) | 0.5, 0.28 |
| `accent`, `ink` | key-word colour / other words | `#1D4ED8` / `#111111` |
| `keyWord` | `'auto'` \| `'middle'` \| override map | auto |

Sizing: `charsPerLine ≈ regionWidthPx / (fontSize * ~0.42)` for Handlee (check other fonts). Verify with a still on the longest page, leave a safety margin, and keep `whiteSpace: nowrap` per line so a page can never silently wrap into an extra line. For multi-line, split the page's words into `lines` rows (balanced by chars) rather than relying on browser wrapping.

## Workflow

1. Convert SRT → words JSON:
   ```python
   import json
   def sec(x): h,m,r=x.split(':'); s,ms=r.split(','); return int(h)*3600+int(m)*60+int(s)+int(ms)/1000
   w=[]
   for b in open('inputs/x.srt').read().strip().split('\n\n'):
       l=b.split('\n'); a,c=l[1].split(' --> ')
       w.append({'text':' '.join(l[2:]).strip(),'start':sec(a),'end':sec(c)})
   json.dump(w,open('src/youtube_video_setup/remotion/src/data/x_words.json','w'))
   ```
2. Copy `WordPages.template.tsx` into `src/compositions/<Name>/`, set region/lines/font, wrap it in a composition with background + `<Audio>`, register in `Root.tsx`.
3. For a test cut, pass a `seconds` limit (e.g. 60) and set `durationInFrames = seconds*fps`.
4. `npm run typecheck`, render a still on a long page (`npx remotion still ... --frame=N`), then render. Save final renders to `video assets/video_output/`, not `out/`.

## Gotchas
- The user cares about: no vibration, text visible slightly before speech, accent word fixed per page, text small enough that a page fits its lines. Check these first when iterating.
- Backgrounds are independent of this pattern; for white dotted use `AnimatedBackground background="#FFFFFF" dotColor="#C9C9C9" uniformDots`.
