import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Backdrop, C, ClipPlaceholder, FramedBox, cardStyle, mono, sans, smooth, whip} from './common';

export const THREE_LOOKS_FRAMES = 2100;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const OVERLAP = 12;
const DROP_START = 645; // 21.5s @30fps

export type LooksProps = {clips: {base?: string; neon?: string; mono?: string; bass?: string}};

type Row =
  | {key: string; kind: 'color'; from: string; to: string}
  | {key: string; kind: 'number'; from: number; to: number; dec: number}
  | {key: string; kind: 'bool'; from: boolean; to: boolean}
  | {key: string; kind: 'text'; from: string; to: string};

type Look = {name: string; prompt: string; highlights: string[]; rows: Row[]; accent: string; preview: 'swatch' | 'mono' | 'bass'};

/** Replace from/to with the real before/after values from src/timing.ts once each prompt has run. */
const LOOKS: Look[] = [
  {
    name: 'Neon',
    prompt: 'Change the palette in src/timing.ts to cyberpunk neon: magenta, cyan and deep purple, with a stronger glow.',
    highlights: ['cyberpunk neon', 'stronger glow'],
    accent: '#FF2BD6',
    preview: 'swatch',
    rows: [
      {key: 'primary', kind: 'color', from: '#7CC8FF', to: '#FF2BD6'},
      {key: 'accent', kind: 'color', from: '#9BF0D2', to: '#00F0FF'},
      {key: 'glow', kind: 'number', from: 1.0, to: 1.8, dec: 1},
    ],
  },
  {
    name: 'Monochrome',
    prompt: 'Switch to black and white, thinner bars, no particles, and a slow film-grain overlay.',
    highlights: ['black and white', 'thinner bars', 'film-grain'],
    accent: C.text,
    preview: 'mono',
    rows: [
      {key: 'saturation', kind: 'number', from: 1, to: 0, dec: 1},
      {key: 'barWidth', kind: 'number', from: 40, to: 18, dec: 0},
      {key: 'particles', kind: 'bool', from: true, to: false},
      {key: 'filmGrain', kind: 'number', from: 0, to: 0.4, dec: 1},
    ],
  },
  {
    name: 'Bass only',
    prompt: 'Make the bars react only to frequencies under 250 Hz, and make the whole screen pulse softly on each kick.',
    highlights: ['under 250 Hz', 'pulse softly'],
    accent: C.amber,
    preview: 'bass',
    rows: [
      {key: 'bandRange', kind: 'text', from: '32-16000 Hz', to: '32-250 Hz'},
      {key: 'pulseStrength', kind: 'number', from: 0.1, to: 0.4, dec: 1},
    ],
  },
];

/* ---------- shared bits ---------- */

const Clip: React.FC<{src?: string; label: string; start?: number; fit?: 'contain' | 'cover'}> = ({src, label, start = 0, fit = 'contain'}) =>
  src ? (
    <OffthreadVideo src={staticFile(src)} startFrom={start} muted style={{width: '100%', height: '100%', objectFit: fit}} />
  ) : (
    <ClipPlaceholder label={label} hint="render pending" />
  );

/** Whip-pan entrance: slides in from the right, with 3 offset ghost copies instead of blur. */
const WhipIn: React.FC<{children: React.ReactNode; ghost?: string}> = ({children, ghost = C.cyan}) => {
  const frame = useCurrentFrame();
  const t = whip(Math.min(1, frame / OVERLAP));
  const x = (1 - t) * 1920;
  return (
    <AbsoluteFill>
      {t < 1
        ? [3, 2, 1].map((k) => (
            <AbsoluteFill key={k} style={{transform: `translateX(${x + k * 70}px)`, background: ghost, opacity: 0.04 * k + 0.02}} />
          ))
        : null}
      <AbsoluteFill style={{transform: `translateX(${x}px)`}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

const Chip: React.FC<{text: string; index: number}> = ({text, index}) => (
  <>
    <div style={{position: 'absolute', left: 120, top: 80, fontFamily: sans, fontWeight: 600, fontSize: 26, color: `${C.text}b3`}}>{text}</div>
    <div style={{position: 'absolute', right: 120, top: 92, display: 'flex', gap: 10}}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{height: 14, width: i === index ? 44 : 14, borderRadius: 7, background: i === index ? C.cyan : `${C.text}33`}} />
      ))}
    </div>
  </>
);

/* ---------- Base ---------- */

const Base: React.FC<{src?: string}> = ({src}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - 10, fps, config: {damping: 200}});
  return (
    <FramedBox>
      <Clip src={src} label="BASE" />
      <div
        style={{
          position: 'absolute',
          left: 40,
          bottom: 40,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '12px 34px',
          borderRadius: 999,
          background: `${C.surface}f2`,
          opacity: p,
          transform: `translateX(${(1 - p) * -60}px)`,
        }}
      >
        <div style={{width: 16, height: 16, borderRadius: 8, background: C.cyan}} />
        <div style={{fontFamily: sans, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.text}}>BASE</div>
      </div>
    </FramedBox>
  );
};

/* ---------- Look: prompt + code cards ---------- */

const TypedPrompt: React.FC<{look: Look; frame: number}> = ({look, frame}) => {
  const typed = Math.min(look.prompt.length, Math.floor(Math.max(0, frame - 20) * 1.5));
  const marks = look.highlights.map((h) => {
    const s = look.prompt.indexOf(h);
    return [s, s + h.length] as const;
  });
  const chars = look.prompt.slice(0, typed).split('');
  return (
    <div style={{fontFamily: sans, fontWeight: 500, fontSize: 40, lineHeight: 1.35, color: C.text}}>
      {chars.map((ch, i) => {
        const m = marks.find(([a, b]) => i >= a && i < b);
        const done = m && typed >= m[1];
        return (
          <span key={i} style={{color: m ? C.cyan : C.text, borderBottom: done ? `4px solid ${C.cyan}` : '4px solid transparent'}}>
            {ch}
          </span>
        );
      })}
      <span style={{color: C.cyan, opacity: Math.floor(frame / 15) % 2 ? 0 : 1}}>▌</span>
    </div>
  );
};

const mix = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(',')})`;
};

const RowView: React.FC<{row: Row; frame: number; delay: number}> = ({row, frame, delay}) => {
  const t = interpolate(frame, [delay, delay + 28], [0, 1], {...clamp, easing: smooth});
  const appear = interpolate(frame, [delay - 40, delay - 25], [0, 1], clamp);
  const roll = (a: string, b: string) => (
    <span style={{display: 'inline-block', position: 'relative', height: 44, overflow: 'hidden', verticalAlign: 'top'}}>
      <span style={{display: 'block', transform: `translateY(${-t * 44}px)`, opacity: 1 - t}}>{a}</span>
      <span style={{display: 'block', position: 'absolute', top: 44, transform: `translateY(${-t * 44}px)`, opacity: t, color: C.green}}>{b}</span>
    </span>
  );
  let value: React.ReactNode;
  if (row.kind === 'color') {
    value = (
      <span style={{display: 'inline-flex', alignItems: 'center', gap: 16}}>
        <span style={{width: 36, height: 36, borderRadius: 8, background: mix(row.from, row.to, t), border: `1px solid ${C.text}55`}} />
        {roll(`"${row.from}"`, `"${row.to}"`)}
      </span>
    );
  } else if (row.kind === 'number') {
    value = <span style={{color: t > 0.98 ? C.green : C.text, fontVariantNumeric: 'tabular-nums'}}>{(row.from + (row.to - row.from) * t).toFixed(row.dec)}</span>;
  } else if (row.kind === 'bool') {
    const on = row.from ? 1 - t : t;
    value = (
      <span style={{display: 'inline-flex', alignItems: 'center', gap: 16}}>
        <span style={{width: 72, height: 38, borderRadius: 19, background: mix(C.amber, C.green, on), position: 'relative', display: 'inline-block'}}>
          <span style={{position: 'absolute', top: 4, left: 4 + 34 * on, width: 30, height: 30, borderRadius: 15, background: C.bg}} />
        </span>
        {roll(String(row.from), String(row.to))}
      </span>
    );
  } else {
    value = roll(`"${row.from}"`, `"${row.to}"`);
  }
  return (
    <div style={{display: 'flex', alignItems: 'center', height: 56, opacity: appear, position: 'relative'}}>
      <div style={{position: 'absolute', left: -20, right: -20, top: 0, bottom: 0, background: `${C.cyan}${t > 0 ? '1f' : '00'}`, borderRadius: 10, opacity: interpolate(t, [0, 0.2], [0, 1], clamp)}} />
      <span style={{width: 40, color: C.green, fontFamily: mono, fontSize: 30, opacity: t}}>+</span>
      <span style={{position: 'relative', fontFamily: mono, fontSize: 32, color: C.text}}>
        {'  '}
        <span style={{color: C.cyan}}>{row.key}</span>: {value}
        <span style={{color: `${C.text}99`}}>,</span>
      </span>
    </div>
  );
};

const Preview: React.FC<{look: Look; frame: number}> = ({look, frame}) => {
  const t = interpolate(frame, [215, 245], [0, 1], {...clamp, easing: smooth});
  if (look.preview === 'swatch') return null;
  const n = look.preview === 'mono' ? 5 : 16;
  return (
    <div style={{position: 'relative', display: 'flex', gap: look.preview === 'mono' ? 18 : 12, alignItems: 'flex-end', height: 110, marginTop: 20}}>
      {Array.from({length: n}).map((_, i) => {
        const h = 40 + 60 * (0.5 + 0.5 * Math.sin(i * 0.9 + frame * 0.15));
        const w = look.preview === 'mono' ? 40 - 22 * t : 28;
        const dim = look.preview === 'bass' && i >= 6 ? 1 - 0.8 * t : 1;
        const col = look.preview === 'mono' ? mix(['#7CC8FF', '#FF8FC7', '#9BF0D2', '#FFC9A8', '#00F2FE'][i], '#808080', t) : C.cyan;
        return <div key={i} style={{width: w, height: h, borderRadius: w / 2, background: col, opacity: dim}} />;
      })}
      {look.preview === 'bass' ? (
        <div style={{position: 'absolute', left: 6 * 40 - 6, bottom: 0, width: 4, height: 110 * t, background: C.amber}} />
      ) : null}
    </div>
  );
};

const LookCards: React.FC<{look: Look; index: number}> = ({look, index}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cardP = spring({frame: frame - 6, fps, config: {damping: 200}});
  const shrink = interpolate(frame, [105, 130], [1, 0.7], {...clamp, easing: smooth});
  const lift = interpolate(frame, [105, 130], [0, -70], {...clamp, easing: smooth});
  const sendP = interpolate(frame, [96, 106, 116], [1, 1.12, 1], clamp);
  const ripple = interpolate(frame, [100, 120], [0, 1], clamp);
  const codeP = spring({frame: frame - 135, fps, config: {damping: 200}});
  return (
    <AbsoluteFill>
      <Backdrop />
      <Chip text={`Look 0${index + 1} / ${look.name}`} index={index} />
      <div
        style={{
          ...cardStyle,
          position: 'absolute',
          left: 310,
          top: 190,
          width: 1300,
          padding: '36px 48px 40px',
          opacity: cardP,
          transformOrigin: '50% 0',
          transform: `translateY(${(1 - cardP) * 40 + lift}px) scale(${(0.95 + 0.05 * cardP) * shrink})`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, fontFamily: mono, fontSize: 24, color: `${C.text}99`}}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill={C.amber}>
            <path d="M15 2l3 9 9 4-9 4-3 9-3-9-9-4 9-4z" />
          </svg>
          PROMPT
          <div style={{marginLeft: 'auto', position: 'relative', background: C.cyan, color: C.bg, fontFamily: sans, fontWeight: 700, fontSize: 24, padding: '8px 26px', borderRadius: 999, transform: `scale(${sendP})`}}>
            Send
            {ripple > 0 && ripple < 1 ? <div style={{position: 'absolute', left: '50%', top: '50%', width: 140 * ripple, height: 140 * ripple, marginLeft: -70 * ripple, marginTop: -70 * ripple, borderRadius: '50%', border: `3px solid ${C.cyan}`, opacity: 1 - ripple}} /> : null}
          </div>
        </div>
        <TypedPrompt look={look} frame={frame} />
      </div>
      <div
        style={{
          ...cardStyle,
          position: 'absolute',
          left: 310,
          top: 450,
          width: 1300,
          padding: '0 48px 36px',
          opacity: codeP,
          transform: `translateY(${(1 - codeP) * 50}px) scale(${0.95 + 0.05 * codeP})`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 10, height: 64}}>
          {[C.coral, C.amber, C.green].map((c) => (
            <div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />
          ))}
          <div style={{marginLeft: 16, fontFamily: mono, fontSize: 24, color: `${C.text}b3`}}>src/timing.ts</div>
        </div>
        <div style={{fontFamily: mono, fontSize: 32, color: `${C.text}99`, height: 50}}>export const LOOK = {'{'}</div>
        {look.rows.map((r, i) => (
          <RowView key={r.key} row={r} frame={frame} delay={165 + i * 20} />
        ))}
        <div style={{fontFamily: mono, fontSize: 32, color: `${C.text}99`, height: 50}}>{'};'}</div>
        <Preview look={look} frame={frame} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Look: footage + big title ---------- */

const LookRender: React.FC<{look: Look; index: number; src?: string}> = ({look, index, src}) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [OVERLAP + 220, OVERLAP + 240], [1, 0], clamp);
  return (
    <FramedBox>
      <Clip src={src} label={look.name.toUpperCase()} start={DROP_START} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 380, background: `linear-gradient(transparent, ${C.bg}b3)`, opacity: out}} />
      <div style={{position: 'absolute', left: 72, bottom: 70, opacity: out}}>
        <div style={{display: 'flex', fontFamily: sans, fontWeight: 800, fontSize: 140, letterSpacing: -3, color: C.text, lineHeight: 1}}>
          {look.name.split('').map((ch, i) => {
            const p = interpolate(frame, [OVERLAP + 4 + i * 2, OVERLAP + 20 + i * 2], [0, 1], {...clamp, easing: smooth});
            return (
              <span key={i} style={{display: 'inline-block', whiteSpace: 'pre', opacity: p, transform: `translateY(${(1 - p) * -60}px)`}}>
                {ch}
              </span>
            );
          })}
        </div>
        <div style={{height: 8, borderRadius: 4, marginTop: 14, background: look.accent, width: `${interpolate(frame, [OVERLAP + 30, OVERLAP + 60], [0, 100], clamp)}%`}} />
      </div>
      <div style={{position: 'absolute', right: 50, top: 42, display: 'flex', gap: 10, alignItems: 'center'}}>
        <span style={{fontFamily: sans, fontWeight: 600, fontSize: 26, color: C.text, marginRight: 12}}>Look {index + 1} of 3</span>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{height: 14, width: i === index ? 44 : 14, borderRadius: 7, background: i === index ? C.cyan : `${C.text}55`}} />
        ))}
      </div>
    </FramedBox>
  );
};

/* ---------- Finale ---------- */

const KICKS = Array.from({length: 40}, (_, i) => i * 15);

const Finale: React.FC<{clips: LooksProps['clips']}> = ({clips}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tiles = [
    {label: 'Base', src: clips.base, color: C.text},
    {label: 'Neon', src: clips.neon, color: '#FF2BD6'},
    {label: 'Monochrome', src: clips.mono, color: C.text},
    {label: 'Bass only', src: clips.bass, color: C.amber},
  ];
  const words = 'Same track. One sentence each.'.split(' ');
  const TW = 700;
  const TH = 394;
  const x0 = (1920 - (2 * TW + 24)) / 2;
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{position: 'absolute', left: 0, right: 0, top: 88, display: 'flex', justifyContent: 'center', gap: 20, fontFamily: sans, fontWeight: 800, fontSize: 64, color: C.text}}>
        {words.map((w, i) => {
          const p = spring({frame: frame - i * 5, fps, config: {damping: 200}});
          return (
            <span key={i} style={{opacity: p, transform: `translateY(${(1 - p) * 24}px)`}}>
              {w}
            </span>
          );
        })}
      </div>
      {tiles.map((t, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const p = spring({frame: frame - 10 - i * 6, fps, config: {damping: 200}});
        const f = frame - i * 4;
        const last = [...KICKS].reverse().find((k) => k <= f) ?? 0;
        const kick = spring({frame: f - last, fps, config: {damping: 12, stiffness: 200}});
        const pulse = 1 + 0.08 * (1 - kick);
        const sx = col ? 1920 : -TW;
        const sy = row ? 1080 : -TH;
        const x = x0 + col * (TW + 24);
        const y = 190 + row * (TH + 24);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + (1 - p) * (sx - x) * 0.4,
              top: y + (1 - p) * (sy - y) * 0.4,
              width: TW,
              height: TH,
              opacity: p,
              borderRadius: 24,
              padding: 5,
              background: `linear-gradient(${135 + frame * 0.6}deg, ${C.cyan}, ${C.green}, ${C.amber}, ${C.coral}, ${C.cyan})`,
            }}
          >
            <div style={{width: '100%', height: '100%', borderRadius: 19, overflow: 'hidden', position: 'relative', background: '#0b0b0e'}}>
              <Clip src={t.src} label={t.label.toUpperCase()} start={DROP_START} />
              <div
                style={{
                  position: 'absolute',
                  left: 20,
                  bottom: 20,
                  fontFamily: sans,
                  fontWeight: 700,
                  fontSize: 28,
                  color: C.text,
                  background: `${C.bg}e6`,
                  padding: '8px 22px',
                  borderRadius: 999,
                  border: `2px solid ${t.color}`,
                  boxShadow: `0 0 ${24 * (1 - kick)}px ${t.color}`,
                  transform: `scale(${pulse})`,
                  transformOrigin: 'left bottom',
                }}
              >
                {t.label}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- Timeline ---------- */

const LOOK_LEN = 540;
const FIRST = 150;

export const ThreeLooks: React.FC<LooksProps> = ({clips}) => {
  const srcs = [clips.neon, clips.mono, clips.bass];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Sequence from={0} durationInFrames={FIRST + OVERLAP}>
        <Base src={clips.base} />
      </Sequence>
      {LOOKS.map((look, i) => {
        const start = FIRST + i * LOOK_LEN;
        return (
          <React.Fragment key={look.name}>
            <Sequence from={start} durationInFrames={300 + OVERLAP}>
              <WhipIn ghost={look.accent}>
                <LookCards look={look} index={i} />
              </WhipIn>
            </Sequence>
            <Sequence from={start + 300} durationInFrames={240 + OVERLAP}>
              <WhipIn ghost={look.accent}>
                <LookRender look={look} index={i} src={srcs[i]} />
              </WhipIn>
            </Sequence>
          </React.Fragment>
        );
      })}
      <Sequence from={FIRST + 3 * LOOK_LEN} durationInFrames={330}>
        <WhipIn>
          <Finale clips={clips} />
        </WhipIn>
      </Sequence>
    </AbsoluteFill>
  );
};
