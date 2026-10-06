import {continueRender, delayRender, staticFile} from 'remotion';

/** Blueprint palette + fonts. Change the video style here only. */
export const colors = {
  bg: '#070B19',
  cyan: '#00F0FF',
  coral: '#FF3366',
  amber: '#FFB800',
  surface: '#111A33',
  green: '#2BE38B',
  white: '#EAF0FF',
  teal: '#4FD1C5',
  silver: '#C9D3E6',
} as const;

// Fonts are bundled in public/fonts (from @fontsource) so renders work offline.
const FONT_FILES: [string, string, string][] = [
  ['Inter', '400', 'inter-latin-400-normal'],
  ['Inter', '600', 'inter-latin-600-normal'],
  ['Inter', '900', 'inter-latin-900-normal'],
  ['JetBrains Mono', '400', 'jetbrains-mono-latin-400-normal'],
  ['JetBrains Mono', '700', 'jetbrains-mono-latin-700-normal'],
];
if (typeof document !== 'undefined') {
  const handle = delayRender('Loading fonts');
  Promise.all(
    FONT_FILES.map(async ([family, weight, file]) => {
      const face = new FontFace(family, `url(${staticFile(`fonts/${file}.woff2`)})`, {weight});
      await face.load();
      document.fonts.add(face);
    }),
  )
    .catch((e) => console.error('Font load failed', e))
    .finally(() => continueRender(handle));
}

export const fonts = {
  ui: 'Inter, system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
} as const;
