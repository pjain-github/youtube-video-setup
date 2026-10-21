import React from 'react';
import {AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Handlee'; // swap for any @remotion/google-fonts font

const {fontFamily} = loadFont('normal', {weights: ['400']});

export type Word = {text: string; start: number; end: number};
type Page = {start: number; appear: number; end: number; words: Word[]};

export type WordPagesProps = {
  words: Word[];
  /** Only use words starting before this many seconds (for test cuts). */
  seconds?: number;
  /** Text box as CSS (percent or px). Default: top 20% of the frame. */
  region?: React.CSSProperties;
  align?: 'center' | 'left';
  verticalAlign?: 'flex-start' | 'center' | 'flex-end';
  lines?: number;
  charsPerLine?: number;
  fontSize?: number;
  lead?: number; // words appear this many seconds before being spoken
  fade?: number; // entrance length in seconds
  accent?: string;
  ink?: string;
  /** 'auto' = longest non-stopword, 'middle' = middle word, or per-page override {pageIndex: wordIndex}. */
  keyWord?: 'auto' | 'middle' | Record<number, number>;
};

const STOP = new Set(
  'a an the and or but so if of to in on at by for with from as is are was were be been it its this that these those i you he she we they my your our their not no than then there here have has had do does did will would can could just also into over about more most very what which who when how all any some one'.split(' '),
);
const clean = (w: string) => w.toLowerCase().replace(/[^a-z0-9']/g, '');

const keyWordIndex = (ws: Word[], mode: WordPagesProps['keyWord'], pageIdx: number): number => {
  const mid = (ws.length - 1) / 2;
  if (typeof mode === 'object' && mode[pageIdx] !== undefined) return mode[pageIdx];
  if (mode === 'middle') return Math.round(mid);
  let best = -1;
  ws.forEach((w, i) => {
    const c = clean(w.text);
    if (!c || STOP.has(c)) return;
    const bl = best >= 0 ? clean(ws[best].text).length : -1;
    if (c.length > bl || (c.length === bl && Math.abs(i - mid) < Math.abs(best - mid))) best = i;
  });
  return best >= 0 ? best : Math.round(mid);
};

const buildPages = (all: Word[], limit: number, maxChars: number, lead: number): Page[] => {
  const pages: Page[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) pages.push({start: cur[0].start, appear: 0, end: cur[cur.length - 1].end, words: cur});
    cur = [];
  };
  for (const w of all) {
    if (w.start >= limit) break;
    const chars = cur.reduce((n, x) => n + x.text.length + 1, 0) + w.text.length;
    if (chars > maxChars) flush();
    cur.push(w);
    if (/[.!?,;:]$/.test(w.text) && chars > maxChars * 0.6) flush();
  }
  flush();
  // appear `lead` early, but never before the previous page has finished
  pages.forEach((pg, i) => {
    pg.appear = Math.max(pg.start - lead, i > 0 ? pages[i - 1].end : 0);
  });
  return pages;
};

/** Split a page's words into `lines` rows balanced by character count. */
const toRows = (ws: Word[], lines: number): Word[][] => {
  if (lines <= 1) return [ws];
  const total = ws.reduce((n, w) => n + w.text.length + 1, 0);
  const target = total / lines;
  const rows: Word[][] = [[]];
  let n = 0;
  for (const w of ws) {
    if (n >= target * rows.length && rows.length < lines) rows.push([]);
    rows[rows.length - 1].push(w);
    n += w.text.length + 1;
  }
  return rows;
};

const PageView: React.FC<Required<Omit<WordPagesProps, 'words' | 'seconds'>> & {page: Page; pageIdx: number; duration: number}> = (p) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = p.page.appear + frame / fps;
  const keyIdx = keyWordIndex(p.page.words, p.keyWord, p.pageIdx);
  const exit = interpolate(frame, [p.duration - 5, p.duration], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rows = toRows(p.page.words, p.lines);
  let flat = -1;

  return (
    <AbsoluteFill style={{opacity: exit}}>
      <div
        style={{
          position: 'absolute',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: p.verticalAlign,
          alignItems: p.align === 'center' ? 'center' : 'flex-start',
          fontFamily,
          fontSize: p.fontSize,
          lineHeight: 1.3,
          ...p.region,
        }}
      >
        {rows.map((row, r) => (
          <div key={r} style={{whiteSpace: 'nowrap'}}>
            {row.map((w) => {
              flat += 1;
              const appearAt = Math.max(w.start - p.lead, p.page.appear);
              const e = interpolate(t, [appearAt, appearAt + p.fade], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.out(Easing.cubic),
              });
              return (
                <span
                  key={flat}
                  style={{
                    display: 'inline-block',
                    marginRight: '0.26em',
                    color: flat === keyIdx ? p.accent : p.ink,
                    opacity: e, // always mounted so the layout never reflows
                    transform: `translateY(${(1 - e) * 14}px)`,
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

/** Drop inside a composition (above the background / audio). */
export const WordPages: React.FC<WordPagesProps> = ({
  words,
  seconds = Infinity,
  region = {top: 0, left: 0, width: '100%', height: '20%', paddingTop: 48},
  align = 'center',
  verticalAlign = 'center',
  lines = 1,
  charsPerLine = 52,
  fontSize = 66,
  lead = 0.5,
  fade = 0.28,
  accent = '#1D4ED8',
  ink = '#111111',
  keyWord = 'auto',
}) => {
  const {fps} = useVideoConfig();
  const pages = buildPages(words, seconds, charsPerLine * lines, lead);
  return (
    <>
      {pages.map((pg, i) => {
        const from = Math.round(pg.appear * fps);
        const next = pages[i + 1];
        const end = Math.round((next ? next.appear : pg.end + 0.3) * fps);
        const duration = Math.max(1, end - from);
        return (
          <Sequence key={i} from={from} durationInFrames={duration} layout="none">
            <PageView page={pg} pageIdx={i} duration={duration} {...{region, align, verticalAlign, lines, charsPerLine, fontSize, lead, fade, accent, ink, keyWord}} />
          </Sequence>
        );
      })}
    </>
  );
};
