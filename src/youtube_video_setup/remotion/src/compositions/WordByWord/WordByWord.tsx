import React from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Handlee';
import {theme} from '../../config';
import {AnimatedBackground} from '../../components/AnimatedBackground';
import words from '../../data/word_captions.json';

const {fontFamily} = loadFont('normal', {weights: ['400']});

export const WORDBYWORD_AUDIO = 'audio/gemini_4_argon/master_voiceover.mp3';
export const WORDBYWORD_SECONDS = 60;

const FONT_SIZE = 66;
const MAX_CHARS = 52; // keeps a page on a single line at FONT_SIZE in a 1920px frame
type Word = {text: string; start: number; end: number};
const STOP = new Set(
  'a an the and or but so if of to in on at by for with from as is are was were be been it its this that these those i you he she we they my your our their not no than then there here have has had do does did will would can could just also into over about more most very what which who when how all any some one'.split(' '),
);
const clean = (w: string) => w.toLowerCase().replace(/[^a-z0-9']/g, '');
/** The key word of a page: the longest non-stopword, ties broken toward the middle. Falls back to the middle word. */
const keyWordIndex = (ws: Word[]): number => {
  const mid = (ws.length - 1) / 2;
  let best = -1;
  ws.forEach((w, i) => {
    const c = clean(w.text);
    if (!c || STOP.has(c)) return;
    if (best < 0 || c.length > clean(ws[best].text).length || (c.length === clean(ws[best].text).length && Math.abs(i - mid) < Math.abs(best - mid))) best = i;
  });
  return best >= 0 ? best : Math.round(mid);
};

const LEAD = 0.5; // words appear this many seconds before they are spoken
const FADE = 0.28; // seconds for the soft entrance
type Page = {start: number; appear: number; end: number; words: Word[]};

const buildPages = (all: Word[], limit: number): Page[] => {
  const pages: Page[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) pages.push({start: cur[0].start, appear: 0, end: cur[cur.length - 1].end, words: cur});
    cur = [];
  };
  for (const w of all) {
    if (w.start >= limit) break;
    const chars = cur.reduce((n, x) => n + x.text.length + 1, 0) + w.text.length;
    if (chars > MAX_CHARS) flush();
    cur.push(w);
    if (/[.!?,;:]$/.test(w.text) && chars > MAX_CHARS * 0.6) flush();
  }
  flush();
  // a page shows up LEAD early, but never before the previous page's last word has finished
  pages.forEach((pg, i) => {
    pg.appear = Math.max(pg.start - LEAD, i > 0 ? pages[i - 1].end : 0);
  });
  return pages;
};

const PageView: React.FC<{page: Page; duration: number}> = ({page, duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = page.appear + frame / fps;
  const keyIdx = keyWordIndex(page.words);
  const exit = interpolate(frame, [duration - 5, duration], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', height: '20%', paddingTop: 48, boxSizing: 'border-box', opacity: exit}}>
      <div style={{height: '100%', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', fontFamily, fontWeight: 400, fontSize: FONT_SIZE}}>
        {page.words.map((w, i) => {
          const appearAt = Math.max(w.start - LEAD, page.appear);
          // smooth ease-out, no spring overshoot (that caused the jitter)
          const p = interpolate(t, [appearAt, appearAt + FADE], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          });
          const active = i === keyIdx;
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                marginRight: '0.26em',
                color: active ? theme.primary : theme.text,
                opacity: p,
                transform: `translateY(${(1 - p) * 14}px)`,
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const WordByWord: React.FC<{seconds?: number}> = ({seconds = WORDBYWORD_SECONDS}) => {
  const {fps} = useVideoConfig();
  const pages = buildPages(words as Word[], seconds);
  return (
    <AbsoluteFill>
      <AnimatedBackground background="#FFFFFF" dotColor="#C9C9C9" uniformDots />
      <Audio src={staticFile(WORDBYWORD_AUDIO)} />
      {pages.map((p, i) => {
        const from = Math.round(p.appear * fps);
        const next = pages[i + 1];
        const end = Math.round((next ? next.appear : p.end + 0.3) * fps);
        const dur = Math.max(1, end - from);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} layout="none">
            <PageView page={p} duration={dur} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
