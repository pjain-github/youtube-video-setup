/**
 * Single place to change video format. Every composition derives from these.
 * Duration is expressed in seconds so changing FPS never changes runtime.
 */
export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
  durationInSeconds: 12,
} as const;

export const durationInFrames = (seconds: number, fps: number = VIDEO.fps) =>
  Math.round(seconds * fps);

export const theme = {
  // Canvas & Surfaces
  background: '#F6F4EE',      // Warm paper cream / off-white
  surface: '#FFFFFF',         // Crisp white card surface
  surfaceCream: '#FAF7F2',    // Subtle cream container
  surfaceDark: '#1E1E1E',     // Dark app/icon tile

  // Ink & Text
  text: '#111111',            // Primary deep charcoal / black ink
  muted: '#78736B',           // Warm muted gray for connective phrases
  textMuted: '#78736B',       // Alias for secondary text

  // Accents (Editorial Explainer)
  primary: '#1D4ED8',         // Royal / Cobalt blue (code, action, focus)
  secondary: '#2563EB',       // Electric blue
  accent: '#E06A26',          // Terracotta orange (warm highlights, attention)
  warm: '#E06A26',            // Alias for warm accent
  highlight: '#FFE600',       // Marker yellow (highlighter wipes)
  success: '#1E6F50',         // Forest / Emerald green (metrics, positive)

  // Neo-Brutalist & Editorial UI Tokens
  border: '#111111',          // 1.5px - 2px crisp black border
  borderSubtle: '#E2DDD5',    // Subtle separator border
  shadow: '4px 4px 0px #111111', // Solid offset hard shadow
  shadowSoft: '0 10px 25px -5px rgba(0,0,0,0.06)', // Floating card shadow

  // Typography Pairing
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSans: 'Inter, system-ui, sans-serif',
  fontSerif: 'Newsreader, Playfair Display, Georgia, serif',
  fontMono: '"JetBrains Mono", Space Mono, monospace',
} as const;
