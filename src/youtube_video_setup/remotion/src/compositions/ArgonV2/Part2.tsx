import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import wordsJson from '../../data/argon_v2/part_02_words.json';
import {C} from './tokens';
import {Draw, FPS, PaperCard, hand, mono, roughBoxPath, useRange, usePop, type Word} from './hand';

/**
 * Part 2 - Google's launch demos (scenes 2.1 - 2.4 of the v2 blueprint).
 * Timed from part_02_words.json: s(i) / e(i) = start / end seconds of word i.
 */
const W = wordsJson as Word[];
const s = (i: number) => W[i].start;
const e = (i: number) => W[i].end;

export const PART2_AUDIO = 'audio/gemini_4_argon/part_02_google_launch_demos.mp3';
export const PART2_FRAMES = Math.round(66.13 * FPS);

const useT = () => useCurrentFrame() / FPS;
const win = (t: number, a: number, b: number, fi = 0.25, fo = 0.35) =>
  Math.max(0, Math.min(1, Math.min((t - a) / fi, (b - t) / fo)));
const lerp = (t: number, xs: number[], ys: number[]) =>
  interpolate(t, xs, ys, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});

// scene boundaries (seconds)
const T22 = 15.1; // 2.2 starts
const T23 = s(89) - 0.1; // 2.3 starts
const T24 = s(118) - 0.1; // 2.4 starts

const DotCanvas: React.FC = () => (
  <AbsoluteFill style={{background: C.canvas}}>
    <svg width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
      <defs>
        <pattern id="argon-dots2" width={24} height={24} patternUnits="userSpaceOnUse">
          <circle cx={12} cy={12} r={1.5} fill={C.dot} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#argon-dots2)" />
    </svg>
  </AbsoluteFill>
);

const Source: React.FC<{text: string; style?: React.CSSProperties}> = ({text, style}) => (
  <div style={{fontFamily: mono, fontSize: 20, color: C.slateText, ...style}}>{text}</div>
);

const Pill: React.FC<{text: string; at: number; color?: string; size?: number}> = ({text, at, color = C.google, size = 46}) => {
  const pop = usePop(at, 12, 190);
  return (
    <div
      style={{
        fontFamily: hand,
        fontSize: size,
        color: C.ink,
        background: '#fff',
        border: `3px solid ${color}`,
        borderRadius: 999,
        padding: '4px 30px 8px',
        boxShadow: `0 8px 18px -8px ${color}66`,
        opacity: Math.min(1, pop * 2),
        transform: `translateY(${(1 - pop) * 24}px) scale(${0.85 + 0.15 * pop})`,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

const UrlPill: React.FC<{url: string; at: number; out: number}> = ({url, at, out}) => {
  const t = useT();
  const inn = useRange(at, at + 0.7, Easing.out(Easing.back(1.4)));
  const o = useRange(out - 0.4, out);
  if (t < at - 0.1 || t > out) return null;
  return (
    <div style={{position: 'absolute', top: 40, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: 1 - o, transform: `translateY(${(1 - inn) * -160}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, background: '#fff', border: `3px solid ${C.ink}`, borderRadius: 999, padding: '10px 32px', boxShadow: '0 10px 24px -10px rgba(15,23,42,0.3)'}}>
        <svg width="24" height="24" viewBox="0 0 26 26">
          <rect x="4" y="11" width="18" height="12" rx="3" fill="none" stroke={C.ink} strokeWidth="2.5" />
          <path d="M8 11 V8 a5 5 0 0 1 10 0 V11" fill="none" stroke={C.ink} strokeWidth="2.5" />
        </svg>
        <span style={{fontFamily: mono, fontWeight: 500, fontSize: 24, color: C.ink}}>{url}</span>
      </div>
    </div>
  );
};

/* ================================================================== */
/* Scene 2.1 - Spatial intelligence intro (AI Studio showcase)        */
/* ================================================================== */
const SHOW_W = 1400;
const SHOW_H = 788;

const Showcase: React.FC = () => {
  const t = useT();
  const cardIn = useRange(0.1, 0.9);
  const out = useRange(T22 - 0.5, T22 + 0.1);
  const scale = lerp(t, [0, 3.6, 8.6, 10.4, 12.4], [1, 1, 1.45, 1.45, 1.85]);
  const ox = lerp(t, [0, 3.6, 8.6, 10.4, 12.4], [50, 50, 30, 30, 46]);
  const oy = lerp(t, [0, 3.6, 8.6, 10.4, 12.4], [50, 50, 12, 12, 86]);
  const box1 = useRange(1.0, 1.8);
  const box1Out = useRange(8.0, 8.6);
  const box2 = useRange(11.2, 12.2);
  if (t > T22 + 0.2) return null;
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <UrlPill url="aistudio.google.com/learn/gemini-4-argon-showcase" at={0.2} out={T22} />
      <div style={{position: 'absolute', left: (1920 - SHOW_W) / 2, top: 115, opacity: cardIn, transform: `translateY(${(1 - cardIn) * 100}px)`}}>
        <PaperCard style={{width: SHOW_W, height: SHOW_H, overflow: 'hidden', position: 'relative'}}>
          <div style={{position: 'absolute', inset: 0, transform: `scale(${scale})`, transformOrigin: `${ox}% ${oy}%`}}>
            <Img src={staticFile('images/part2_A03_aistudio_builders_showcase_3d.png')} style={{width: SHOW_W, height: SHOW_H, display: 'block'}} />
            <svg width={SHOW_W} height={SHOW_H} style={{position: 'absolute', inset: 0}}>
              <Draw d={roughBoxPath(280, 80, 523, 56, 4, 3)} progress={box1} stroke={C.blue} width={5} opacity={1 - box1Out} />
              <Draw d={roughBoxPath(519, 603, 327, 183, 6, 3)} progress={box2} stroke={C.blue} width={5} />
            </svg>
          </div>
        </PaperCard>
        <Source text="Source: Google AI Studio" style={{marginTop: 10}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 972, display: 'flex', justifyContent: 'center', gap: 30, opacity: 1}}>
        <Pill text="Spatial Reasoning" at={s(30) - 0.1} />
        <Pill text="Physics Simulation" at={s(32) - 0.1} />
        <Pill text="Autonomous Code" at={s(35) - 0.1} />
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* Scene 2.2 - Apollo 2 cornhole (montage clip in a card)             */
/* ================================================================== */
const BEATS = [
  {from: s(38), to: s(56), label: 'Watches a human play'},
  {from: s(56), to: s(65), label: 'Maps it into MuJoCo simulation'},
  {from: s(65), to: s(69), label: 'Whole-body joint trajectories'},
  {from: s(69), to: s(76), label: 'Apptronik Apollo 2 humanoid'},
  {from: s(76), to: s(89), label: 'Real world · no fine-tuning'},
];
const TOSS_AT = s(78) + 0.2; // "seven"

const BeatChip: React.FC<{b: (typeof BEATS)[number]; i: number}> = ({b, i}) => {
  const t = useT();
  const v = win(t, b.from - 0.05, b.to - 0.05, 0.25, 0.25);
  const pop = usePop(b.from, 13, 200);
  if (v <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 850, display: 'flex', justifyContent: 'center', opacity: v}}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          background: '#fff',
          border: `3px solid ${C.ink}`,
          borderRadius: 999,
          padding: '4px 34px 8px 20px',
          fontFamily: hand,
          fontSize: 50,
          color: C.ink,
          transform: `translateY(${(1 - pop) * 20}px)`,
          boxShadow: '0 10px 22px -10px rgba(15,23,42,0.3)',
        }}
      >
        <span style={{fontFamily: mono, fontWeight: 700, fontSize: 24, background: C.ink, color: '#fff', borderRadius: 999, padding: '2px 14px'}}>{`0${i + 1}`}</span>
        {b.label}
      </div>
    </div>
  );
};

const TossCounter: React.FC = () => {
  const t = useT();
  const n = Math.max(1, Math.min(7, 1 + Math.floor((t - TOSS_AT) / 0.7)));
  const pop = usePop(TOSS_AT + (n - 1) * 0.7, 9, 260);
  if (t < TOSS_AT) return null;
  const done = n === 7;
  return (
    <div
      style={{
        position: 'absolute',
        right: 18,
        bottom: 18,
        background: '#fff',
        border: `4px solid ${done ? C.good : C.ink}`,
        borderRadius: 16,
        padding: '6px 26px 10px',
        fontFamily: hand,
        fontSize: 52,
        color: done ? C.good : C.ink,
        transform: `scale(${0.9 + 0.1 * pop})`,
        boxShadow: '0 10px 24px -8px rgba(0,0,0,0.35)',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <svg width="40" height="40" viewBox="0 0 40 40">
        <path d="M6 22 L16 32 L34 8" fill="none" stroke={C.good} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {`Toss ${n} of 7`}
    </div>
  );
};

const Cornhole: React.FC = () => {
  const t = useT();
  const cardIn = useRange(T22, T22 + 0.8);
  const out = useRange(T23 - 0.5, T23 + 0.1);
  if (t < T22 - 0.1 || t > T23 + 0.2) return null;
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <div style={{position: 'absolute', left: 320, top: 70, opacity: cardIn, transform: `translateY(${(1 - cardIn) * 100}px)`}}>
        <PaperCard style={{width: 1280, height: 720, overflow: 'hidden', position: 'relative'}}>
          <Sequence from={Math.round(s(38) * FPS)} layout="none">
            <OffthreadVideo src={staticFile('videos/part2_apollo_montage.mp4')} muted style={{width: 1280, height: 720, objectFit: 'cover'}} />
          </Sequence>
          <TossCounter />
        </PaperCard>
        <Source text="Source: Google DeepMind" style={{marginTop: 10}} />
      </div>
      {BEATS.map((b, i) => (
        <BeatChip key={i} b={b} i={i} />
      ))}
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* Scene 2.3 - Demis Hassabis' 3D Wizard Chess (X post)               */
/* ================================================================== */
const CROP = {x: 600, y: 50, w: 590, h: 710};
const CZ = 1.2;

const Chess: React.FC = () => {
  const t = useT();
  const cardIn = useRange(T23, T23 + 0.8);
  const out = useRange(T24 - 0.5, T24 + 0.1);
  const box = useRange(s(99), s(99) + 1.0);
  const a = usePop(s(105) - 0.1, 12, 190);
  const b = usePop(s(110) - 0.1, 12, 190);
  const p = usePop(s(115) - 0.3, 11, 190);
  const arrows = useRange(s(115) - 0.1, s(115) + 0.9);
  const titleIn = useRange(s(95) - 0.4, s(95) + 0.3);
  if (t < T23 - 0.1 || t > T24 + 0.2) return null;
  const startFrom = Math.round(12 * FPS);
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <div style={{position: 'absolute', left: 250, top: 100, opacity: cardIn, transform: `translateY(${(1 - cardIn) * 100}px)`}}>
        <PaperCard style={{width: CROP.w * CZ, height: CROP.h * CZ, overflow: 'hidden', position: 'relative'}}>
          <Sequence from={Math.round(T23 * FPS)} layout="none">
            <OffthreadVideo
              src={staticFile('videos/part2_A05_x_demis_wizard_chess_3d.mov')}
              muted
              startFrom={startFrom}
              playbackRate={0.88}
              style={{position: 'absolute', width: 1920 * CZ, height: 962 * CZ, left: -CROP.x * CZ, top: -CROP.y * CZ, maxWidth: 'none'}}
            />
          </Sequence>
          <svg width={CROP.w * CZ} height={CROP.h * CZ} style={{position: 'absolute', inset: 0}}>
            <Draw d={roughBoxPath(8 * CZ, 88 * CZ, 574 * CZ, 82 * CZ, 7, 3)} progress={box} stroke={C.blue} width={5} />
          </svg>
        </PaperCard>
        <Source text="Source: @demishassabis on X" style={{marginTop: 10}} />
      </div>

      <div style={{position: 'absolute', left: 1000, top: 110, width: 860, textAlign: 'center', fontFamily: hand, fontSize: 96, lineHeight: 1, color: C.ink, opacity: win(t, s(95) - 0.4, T24 - 0.1, 0.4, 0.4), transform: `translateY(${(1 - titleIn) * 20}px)`}}>
        3D <span style={{color: C.blue}}>Wizard</span> Chess
      </div>
      {/* one prompt -> assets + logic */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Draw d="M 1190 560 C 1260 520 1300 400 1380 372" progress={arrows} stroke={C.slateText} width={5} />
        <Draw d="M 1190 560 C 1260 600 1300 700 1380 728" progress={arrows} stroke={C.slateText} width={5} />
        <Draw d="M 1352 360 L 1384 372 L 1362 398" progress={arrows} stroke={C.slateText} width={5} />
        <Draw d="M 1352 742 L 1384 728 L 1360 704" progress={arrows} stroke={C.slateText} width={5} />
      </svg>
      <div style={{position: 'absolute', left: 1400, top: 320, opacity: Math.min(1, a * 2), transform: `translateX(${(1 - a) * 40}px)`}}>
        <PaperCard border={C.google} style={{padding: '10px 36px 16px', fontFamily: hand, fontSize: 60, color: C.ink, textAlign: 'center'}}>
          <div style={{fontFamily: mono, fontWeight: 700, fontSize: 18, letterSpacing: 2, color: C.google}}>GENERATED</div>
          3D visual assets
        </PaperCard>
      </div>
      <div style={{position: 'absolute', left: 1400, top: 680, opacity: Math.min(1, b * 2), transform: `translateX(${(1 - b) * 40}px)`}}>
        <PaperCard border={C.google} style={{padding: '10px 36px 16px', fontFamily: hand, fontSize: 60, color: C.ink, textAlign: 'center'}}>
          <div style={{fontFamily: mono, fontWeight: 700, fontSize: 18, letterSpacing: 2, color: C.google}}>GENERATED</div>
          Game logic
        </PaperCard>
      </div>
      <div style={{position: 'absolute', left: 1000, top: 500, opacity: Math.min(1, p * 2), transform: `scale(${0.7 + 0.3 * p})`, transformOrigin: 'right center'}}>
        <div
          style={{
            background: C.ink,
            color: '#fff',
            fontFamily: hand,
            fontSize: 52,
            lineHeight: 1.05,
            borderRadius: 28,
            padding: '10px 30px 16px',
            textAlign: 'center',
            boxShadow: '0 12px 26px -10px rgba(15,23,42,0.5)',
          }}
        >
          <span style={{color: C.note}}>one</span> natural-language
          <br />
          prompt
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* Scene 2.4 - Chromium refactor                                       */
/* ================================================================== */
const CR = {x: 600, y: 400, k: 1.375}; // crop of the blog screenshot (in 2000px display coords) and zoom
const crX = (x: number) => (x - CR.x) * CR.k;
const crY = (y: number) => (y - CR.y) * CR.k;

const Highlight: React.FC<{x0: number; x1: number; y0: number; y1: number; p: number}> = ({x0, x1, y0, y1, p}) => (
  <div
    style={{
      position: 'absolute',
      left: crX(x0),
      top: crY(y0),
      width: (crX(x1) - crX(x0)) * p,
      height: crY(y1) - crY(y0),
      background: 'rgba(253,224,71,0.62)',
      mixBlendMode: 'multiply',
      borderRadius: 4,
    }}
  />
);

const FileCard: React.FC<{i: number; at: number}> = ({i, at}) => {
  const t = useT();
  const pop = usePop(at + i * 0.06, 14, 200);
  const col = i % 4;
  const row = Math.floor(i / 4);
  const rot = ((i * 37) % 7) - 3;
  if (t < at - 0.05) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 1140 + col * 112,
        top: 600 + row * 125,
        width: 84,
        height: 108,
        opacity: Math.min(1, pop * 2),
        transform: `translate(${(1 - pop) * -140}px, ${(1 - pop) * 40}px) rotate(${rot}deg) scale(${0.7 + 0.3 * pop})`,
      }}
    >
      <svg width="84" height="108" viewBox="0 0 84 108">
        <path d="M6 4 H58 L78 24 V104 H6 Z" fill="#fff" stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />
        <path d="M58 4 V24 H78" fill="none" stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />
        <path d="M18 46 H64 M18 62 H64 M18 78 H48" stroke={C.slateText} strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
};

const Chromium: React.FC = () => {
  const t = useT();
  const cardIn = useRange(T24, T24 + 0.8);
  const hl1 = useRange(s(128), s(128) + 3.0, (x) => x);
  const hl2 = useRange(s(155) - 0.3, s(155) + 1.1);
  const node = usePop(s(124) - 0.2, 12, 170);
  const core = useRange(s(128), s(128) + 0.9);
  const coreBox = usePop(s(130), 12, 180);
  const leg = useRange(s(135) - 0.3, s(135) + 0.8);
  const legBox = usePop(s(135), 12, 180);
  const months = usePop(s(150) - 0.2, 9, 220);
  const strike = useRange(s(155) - 0.4, s(155) + 0.2);
  const badge = usePop(s(156), 10, 200);
  if (t < T24 - 0.1) return null;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 410, top: 56, opacity: cardIn, transform: `translateY(${(1 - cardIn) * 100}px)`}}>
        <PaperCard style={{width: 1100, height: 440, overflow: 'hidden', position: 'relative'}}>
          <Img
            src={staticFile('images/part2_A06_google_blog_chromium_refactor.png')}
            style={{position: 'absolute', width: 2000 * CR.k, height: 1125 * CR.k, left: -CR.x * CR.k, top: -CR.y * CR.k, maxWidth: 'none'}}
          />
          <Highlight x0={690} x1={1332} y0={481} y1={535} p={hl1} />
          <Highlight x0={835} x1={1101} y0={563} y1={590} p={hl2} />
        </PaperCard>
        <Source text="Source: Google Blog" style={{marginTop: 10}} />
      </div>

      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Draw d="M 510 760 C 580 760 600 690 640 680" progress={core} stroke={C.ink} width={6} />
        <Draw d="M 510 800 C 580 820 600 900 640 905" progress={leg} stroke={C.bad} width={7} dash="0.04 0.03" />
        <Draw d="M 1070 905 C 1100 905 1110 860 1140 850" progress={leg} stroke={C.bad} width={7} dash="0.04 0.03" />
      </svg>

      {/* Chromium: the big codebase */}
      <div style={{position: 'absolute', left: 80, top: 640, width: 430, height: 250, opacity: Math.min(1, node * 2), transform: `scale(${0.8 + 0.2 * node})`}}>
        <PaperCard border={C.ink} style={{width: '100%', height: '100%', boxSizing: 'border-box', padding: '20px 26px', borderWidth: 4}}>
          <div style={{fontFamily: mono, fontWeight: 700, fontSize: 20, letterSpacing: 2, color: C.slateText}}>CHROMIUM</div>
          <div style={{fontFamily: hand, fontSize: 96, color: C.ink, lineHeight: 1}}>40M</div>
          <div style={{fontFamily: hand, fontSize: 44, color: C.ink}}>lines of code</div>
          <svg width="370" height="46" viewBox="0 0 370 46" style={{marginTop: 4}}>
            {Array.from({length: 24}).map((_, i) => (
              <rect key={i} x={i * 15.5} y={8 + (i % 3) * 8} width={10} height={26 - (i % 3) * 8} fill={i >= 18 ? C.bad : C.slate} opacity={0.9} />
            ))}
          </svg>
        </PaperCard>
      </div>

      {/* Core webpage handling */}
      <div style={{position: 'absolute', left: 640, top: 610, width: 430, opacity: Math.min(1, coreBox * 2), transform: `translateX(${(1 - coreBox) * 40}px)`}}>
        <PaperCard border={C.good} style={{padding: '12px 26px 18px', borderWidth: 4}}>
          <div style={{fontFamily: mono, fontWeight: 700, fontSize: 18, letterSpacing: 2, color: C.good}}>SEPARATED</div>
          <div style={{fontFamily: hand, fontSize: 56, lineHeight: 1.05, color: C.ink}}>Core webpage handling</div>
        </PaperCard>
      </div>
      {/* Legacy features: 6M */}
      <div style={{position: 'absolute', left: 640, top: 830, width: 430, opacity: Math.min(1, legBox * 2), transform: `translateX(${(1 - legBox) * 40}px)`}}>
        <PaperCard border={C.bad} style={{padding: '12px 26px 18px', borderWidth: 4, background: '#FFFBEB'}}>
          <div style={{fontFamily: mono, fontWeight: 700, fontSize: 18, letterSpacing: 2, color: C.bad}}>LEGACY FEATURES</div>
          <div style={{fontFamily: hand, fontSize: 56, lineHeight: 1.05, color: C.ink}}>
            ~6M lines <span style={{color: C.slateText, fontSize: 38}}>moved out</span>
          </div>
        </PaperCard>
      </div>

      {Array.from({length: 12}).map((_, i) => (
        <FileCard key={i} i={i} at={s(140)} />
      ))}
      <div style={{position: 'absolute', left: 1140, top: 552, fontFamily: hand, fontSize: 38, color: C.slateText, opacity: win(t, s(140), 66, 0.4, 0.3)}}>
        across hundreds of files
      </div>

      {/* MONTHS -> WEEKS */}
      <div style={{position: 'absolute', left: 1640, top: 720, opacity: Math.min(1, months * 2), transform: `rotate(-6deg) scale(${0.6 + 0.4 * months})`}}>
        <div style={{position: 'relative', fontFamily: hand, fontSize: 62, color: C.bad, border: `5px solid ${C.bad}`, borderRadius: 14, padding: '0 22px 6px', background: '#fff'}}>
          MONTHS
          <svg width="230" height="20" style={{position: 'absolute', left: 0, top: 36, overflow: 'visible'}}>
            <Draw d="M -6 8 L 236 8" progress={strike} stroke={C.ink} width={8} />
          </svg>
        </div>
      </div>
      <div style={{position: 'absolute', left: 560, top: 985, width: 800, display: 'flex', justifyContent: 'center', opacity: Math.min(1, badge * 2), transform: `scale(${0.7 + 0.3 * badge})`}}>
        <div style={{background: C.good, color: '#fff', fontFamily: hand, fontSize: 56, borderRadius: 999, padding: '0 36px 6px', display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap', boxShadow: '0 12px 26px -10px rgba(5,150,105,0.6)'}}>
          <svg width="46" height="46" viewBox="0 0 40 40">
            <path d="M6 22 L16 32 L34 8" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Weeks, not months
          <span style={{fontFamily: mono, fontWeight: 500, fontSize: 20, opacity: 0.9}}>per Google</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================== */
export const ArgonV2Part2: React.FC = () => (
  <AbsoluteFill>
    <DotCanvas />
    <Audio src={staticFile(PART2_AUDIO)} />
    <Showcase />
    <Cornhole />
    <Chess />
    <Chromium />
  </AbsoluteFill>
);
