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
  background: '#0B1020',
  surface: '#141B34',
  primary: '#6C5CE7',
  secondary: '#00D2FF',
  accent: '#FF6B9D',
  warm: '#FFC857',
  text: '#F5F7FF',
  muted: '#9AA4C7',
  fontFamily: 'Inter, system-ui, sans-serif',
} as const;
