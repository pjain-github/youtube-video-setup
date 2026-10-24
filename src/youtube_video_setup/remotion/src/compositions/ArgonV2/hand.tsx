import React from 'react';
import {AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont as loadHand} from '@remotion/google-fonts/PatrickHand';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';
import {C} from './tokens';

export const hand = loadHand('normal', {weights: ['400']}).fontFamily;
export const mono = loadMono('normal', {weights: ['500', '700']}).fontFamily;

export type Word = {text: string; start: number; end: number};

export const FPS = 30;

/** Eased 0..1 progress between two absolute times (seconds). */
export const useRange = (from: number, to: number, ease: (t: number) => number = Easing.out(Easing.cubic)) => {
  const frame = useCurrentFrame();
  return interpolate(frame / FPS, [from, to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
};

/** Springy 0..1 entrance starting at an absolute time (for cards, not for words). */
export const usePop = (at: number, damping = 14, stiffness = 170) => {
  const frame = useCurrentFrame();
  return spring({frame: frame - Math.round(at * FPS), fps: FPS, config: {damping, stiffness}});
};

/* ------------------------------------------------------------------ */
/* Word pages: top-center hand-print text driven by word timestamps    */
/* ------------------------------------------------------------------ */
const LEAD = 0.5; // words appear this long BEFORE they are spoken
const FADE = 0.28;
const STOP = new Set(
  'a an the and or but so if of to in on at by for with from as is are was were be been it its this that these those i you he she we they my your our their not no than then there here have has had do does did will would can could just also into over about more most very what which who when how all any some one'.split(' '),
);
const clean = (w: string) => w.toLowerCase().replace(/[^a-z0-9']/g, '');

const keyWordIndex = (ws: Word[], keys: string[]): number => {
  for (const k of keys) {
    const i = ws.findIndex((w) => clean(w.text) === clean(k));
    if (i >= 0) return i;
  }
  const mid = (ws.length - 1) / 2;
  let best = -1;
  ws.forEach((w, i) => {
    const c = clean(w.text);
    if (!c || STOP.has(c)) return;
    if (best < 0 || c.length > clean(ws[best].text).length || (c.length === clean(ws[best].text).length && Math.abs(i - mid) < Math.abs(best - mid))) best = i;
  });
  return best >= 0 ? best : Math.round(mid);
};

type Page = {appear: number; start: number; end: number; words: Word[]};

const buildPages = (ws: Word[], maxChars: number, minAppear: number): Page[] => {
  const pages: Page[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) pages.push({appear: 0, start: cur[0].start, end: cur[cur.length - 1].end, words: cur});
    cur = [];
  };
  for (const w of ws) {
    const chars = cur.reduce((n, x) => n + x.text.length + 1, 0) + w.text.length;
    if (chars > maxChars) flush();
    cur.push(w);
    if (/[.!?:]$/.test(w.text) && !/\.\.\.$/.test(w.text)) flush(); // sentence end (an ellipsis is a beat, not an end)
    else if (/,$/.test(w.text) && chars > maxChars * 0.6) flush();
  }
  flush();
  pages.forEach((p, i) => {
    p.appear = Math.max(p.start - LEAD, i > 0 ? pages[i - 1].end : 0, minAppear);
  });
  return pages;
};

const splitRows = (ws: Word[], rows: number): Word[][] => {
  if (rows <= 1 || ws.length < 2) return [ws];
  // 2 rows: split where the character counts are most balanced
  const total = ws.reduce((n, w) => n + w.text.length + 1, 0);
  let acc = 0;
  let bestI = 1;
  let bestD = Infinity;
  for (let i = 1; i < ws.length; i++) {
    acc += ws[i - 1].text.length + 1;
    const d = Math.abs(acc - (total - acc));
    if (d < bestD) {
      bestD = d;
      bestI = i;
    }
  }
  return [ws.slice(0, bestI), ws.slice(bestI)];
};

const PageView: React.FC<{
  page: Page;
  dur: number;
  rows: number;
  fontSize: number;
  top: number;
  keys: string[];
  pos: 'top' | 'center';
  moveAt?: number;
}> = ({page, dur, rows, fontSize, top, keys, pos, moveAt}) => {
  const frame = useCurrentFrame(); // relative to this page's Sequence
  const t = page.appear + frame / FPS;
  const keyIdx = keyWordIndex(page.words, keys);
  const exit = interpolate(frame, [dur - 5, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const lines = splitRows(page.words, rows);
  // vertical position: 'top', 'center', or centre that glides to the top at `moveAt`
  const centerTop = (1080 - lines.length * fontSize * 1.18) / 2;
  const mp =
    moveAt !== undefined
      ? interpolate(t, [moveAt, moveAt + 0.7], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)})
      : pos === 'top'
        ? 1
        : 0;
  const y = centerTop + (top - centerTop) * mp;
  let idx = 0;
  return (
    <AbsoluteFill style={{opacity: exit, alignItems: 'center', justifyContent: 'flex-start', paddingTop: y}}>
      <div style={{fontFamily: hand, fontSize, lineHeight: 1.18, textAlign: 'center', color: C.ink}}>
        {lines.map((line, li) => (
          <div key={li} style={{whiteSpace: 'nowrap'}}>
            {line.map((w) => {
              const i = idx++;
              const appearAt = Math.max(w.start - LEAD, page.appear);
              const p = interpolate(t, [appearAt, appearAt + FADE], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.out(Easing.cubic),
              });
              return (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    marginRight: '0.26em',
                    color: i === keyIdx ? C.blue : C.ink,
                    opacity: p,
                    transform: `translateY(${(1 - p) * 14}px)`,
                  }}
                >
                  {w.text}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Renders words[from..to] as paged hand-print text. Must be mounted at the composition
 * root (not inside another Sequence) so absolute seconds line up with the audio.
 */
export const WordPages: React.FC<{
  words: Word[];
  from: number;
  to: number; // inclusive
  /** Seconds the last page holds before leaving. Default last word end + 0.3. */
  holdUntil?: number;
  /** Pages never appear before this absolute time (seconds). */
  minAppear?: number;
  rows?: number;
  maxChars?: number;
  fontSize?: number;
  top?: number;
  keys?: string[];
  /** 'top' (default) or 'center' (vertically centred on the canvas). */
  pos?: 'top' | 'center';
  /** If set, text starts centred and glides to `top` at this absolute time (seconds). */
  moveAt?: number;
}> = ({words, from, to, holdUntil, minAppear = 0, rows = 2, maxChars = 84, fontSize = 78, top = 70, keys = [], pos = 'top', moveAt}) => {
  const pages = buildPages(words.slice(from, to + 1), maxChars, minAppear);
  return (
    <>
      {pages.map((p, i) => {
        const a = Math.round(p.appear * FPS);
        const next = pages[i + 1];
        const e = Math.round((next ? next.appear : (holdUntil ?? p.end + 0.3)) * FPS);
        const dur = Math.max(1, e - a);
        return (
          <Sequence key={i} from={a} durationInFrames={dur} layout="none">
            <PageView page={p} dur={dur} rows={rows} fontSize={fontSize} top={top} keys={keys} pos={pos} moveAt={moveAt} />
          </Sequence>
        );
      })}
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Hand-drawn SVG helpers (deterministic wobble, no Math.random)       */
/* ------------------------------------------------------------------ */
const jit = (seed: number, i: number) => Math.sin(seed * 12.9898 + i * 78.233) * 0.5;

/** A wobbly rectangle outline that overshoots where it closes, like a marker. */
export const roughBoxPath = (x: number, y: number, w: number, h: number, seed = 1, wob = 3): string => {
  const j = (i: number) => jit(seed, i) * wob * 2;
  const p = [
    [x + j(0), y + j(1)],
    [x + w + j(2), y + j(3)],
    [x + w + j(4), y + h + j(5)],
    [x + j(6), y + h + j(7)],
    [x + j(8) - 2, y + j(9) + 6],
  ];
  return `M ${p[0][0]} ${p[0][1]} Q ${x + w / 2} ${y - wob * 2 + j(10)} ${p[1][0]} ${p[1][1]} Q ${x + w + wob * 2 + j(11)} ${y + h / 2} ${p[2][0]} ${p[2][1]} Q ${x + w / 2} ${y + h + wob * 2 + j(12)} ${p[3][0]} ${p[3][1]} Q ${x - wob * 2 + j(13)} ${y + h / 2} ${p[4][0]} ${p[4][1]}`;
};

/** A path that draws itself in as `progress` goes 0..1. */
export const Draw: React.FC<{
  d: string;
  progress: number;
  stroke?: string;
  width?: number;
  fill?: string;
  dash?: string;
  opacity?: number;
}> = ({d, progress, stroke = C.ink, width = 5, fill = 'none', dash, opacity = 1}) => (
  <path
    d={d}
    pathLength={1}
    fill={fill}
    stroke={stroke}
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeDasharray={dash ?? '1 1'}
    strokeDashoffset={dash ? 0 : 1 - progress}
    opacity={dash ? opacity * Math.min(1, progress * 3) : opacity}
    style={dash ? {clipPath: `inset(0 ${100 - progress * 100}% 0 0)`} : undefined}
  />
);

/** Soft white card with slate border and ambient shadow (blueprint "card surface"). */
export const PaperCard: React.FC<{
  children?: React.ReactNode;
  style?: React.CSSProperties;
  border?: string;
}> = ({children, style, border = C.slate}) => (
  <div
    style={{
      background: '#fff',
      border: `2px solid ${border}`,
      borderRadius: 12,
      boxShadow: '0 14px 34px -10px rgba(15,23,42,0.18), 0 3px 8px rgba(15,23,42,0.06)',
      ...style,
    }}
  >
    {children}
  </div>
);
