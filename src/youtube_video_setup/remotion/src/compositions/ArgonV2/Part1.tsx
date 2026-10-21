import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, staticFile, useCurrentFrame} from 'remotion';
import wordsJson from '../../data/argon_v2/part_01_words.json';
import {C} from './tokens';
import {Draw, FPS, PaperCard, WordPages, hand, mono, roughBoxPath, useRange, usePop, type Word} from './hand';

/**
 * Part 1 - The Hook (scenes 1.0 - 1.3 of the v2 blueprint).
 * Everything is timed from the ElevenLabs word timestamps in part_01_words.json;
 * `s(i)` / `e(i)` are the start / end seconds of word index i.
 */
const W = wordsJson as Word[];
const s = (i: number) => W[i].start;
const e = (i: number) => W[i].end;

export const PART1_AUDIO = 'audio/gemini_4_argon/part_01_the_hook.mp3';
export const PART1_FRAMES = Math.round(79.34 * FPS);

const useT = () => useCurrentFrame() / FPS;
/** 0..1 visibility window with soft fade in / out. */
const win = (t: number, a: number, b: number, fi = 0.25, fo = 0.35) =>
  Math.max(0, Math.min(1, Math.min((t - a) / fi, (b - t) / fo)));

const DotCanvas: React.FC = () => (
  <AbsoluteFill style={{background: C.canvas}}>
    <svg width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
      <defs>
        <pattern id="argon-dots" width={24} height={24} patternUnits="userSpaceOnUse">
          <circle cx={12} cy={12} r={1.5} fill={C.dot} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#argon-dots)" />
    </svg>
  </AbsoluteFill>
);

/* ================================================================== */
/* Scene 1.0 - Cold open (0:00 - 0:14)                                */
/* ================================================================== */
const WALL_AT = 6.3; // first ~6s is text only, centred; then it moves up and the animation starts

const ColdOpenDoodles: React.FC = () => {
  const t = useT();
  // wall + red path clipping through it (text glides to the top at WALL_AT first)
  const wall = useRange(WALL_AT + 0.3, WALL_AT + 1.4);
  const arrow = useRange(7.9, 8.9);
  const burst = usePop(s(23), 9, 220);
  const vis2 = win(t, WALL_AT + 0.2, 10.1);
  // 3) big question mark
  const qPop = usePop(s(25) - 0.1, 10, 170);
  const vis3 = win(t, s(25) - 0.2, 12.5);
  // 4) a balloon inflating on "Or is this all hype?"
  const inflate = useRange(12.6, s(32), Easing.inOut(Easing.cubic));
  const vis4 = win(t, 12.4, 14.7);

  const brick = [
    'M540 660 L1380 660', 'M540 760 L1380 760',
    'M700 560 L700 660', 'M900 560 L900 660', 'M1100 560 L1100 660', 'M1260 560 L1260 660',
    'M620 660 L620 760', 'M820 660 L820 760', 'M1020 660 L1020 760', 'M1200 660 L1200 760',
    'M700 760 L700 860', 'M900 760 L900 860', 'M1100 760 L1100 860', 'M1260 760 L1260 860',
  ].join(' ');

  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      <g opacity={vis2}>
        <Draw d={roughBoxPath(540, 560, 840, 300, 3, 4)} progress={wall} width={6} />
        <Draw d={brick} progress={wall} width={3} stroke={C.slateText} />
        <Draw d="M 360 712 C 700 690 1100 735 1540 712" progress={arrow} stroke={C.bad} width={8} dash="0.03 0.022" />
        <Draw d="M 1495 668 L 1566 712 L 1498 756" progress={arrow} stroke={C.bad} width={8} />
        <text x={330} y={780} fontFamily={hand} fontSize={52} fill={C.ink} opacity={arrow}>
          Argon
        </text>
        <g opacity={Math.min(1, burst * 2)} transform={`translate(960 712) scale(${0.4 + 0.6 * burst}) translate(-960 -712)`}>
          <path
            d="M960 640 L985 690 L1040 676 L1010 722 L1058 752 L1000 760 L995 815 L960 772 L925 815 L920 760 L862 752 L910 722 L880 676 L935 690 Z"
            fill={C.bad}
            opacity={0.18}
            stroke={C.bad}
            strokeWidth={5}
            strokeLinejoin="round"
          />
        </g>
        <text
          x={960}
          y={525}
          textAnchor="middle"
          fontFamily={hand}
          fontSize={86}
          fill={C.bad}
          opacity={Math.min(1, burst * 2)}
          transform={`rotate(-6 960 525)`}
        >
          CLIP!
        </text>
      </g>

      <g opacity={vis3}>
        <text
          x={960}
          y={940}
          textAnchor="middle"
          fontFamily={hand}
          fontSize={560}
          fill={C.blue}
          opacity={Math.min(1, qPop * 2)}
          transform={`translate(960 740) rotate(${(1 - qPop) * -18 + Math.sin(t * 4) * 1.5}) scale(${0.6 + 0.4 * qPop}) translate(-960 -740)`}
        >
          ?
        </text>
      </g>

      <g opacity={vis4} transform={`translate(960 880) rotate(${Math.sin(t * 3) * 2 * inflate}) scale(${0.25 + 0.75 * inflate}) translate(-960 -880)`}>
        <path
          d="M 960 520 C 1095 520 1150 655 1095 765 C 1055 842 1005 862 960 880 C 915 862 865 842 825 765 C 770 655 825 520 960 520 Z"
          fill="#DBEAFE"
          stroke={C.ink}
          strokeWidth={7}
          strokeLinejoin="round"
        />
        <path d="M 944 888 L 976 888 L 960 912 Z" fill={C.ink} />
        <path d="M 960 912 C 925 955 995 995 958 1045" fill="none" stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
        <path d="M 885 600 C 900 575 925 562 950 558" fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.9} />
        <text x={960} y={730} textAnchor="middle" fontFamily={hand} fontSize={118} fill={C.blue}>
          HYPE
        </text>
      </g>
    </svg>
  );
};

const ColdOpen: React.FC = () => (
  <>
    <WordPages words={W} from={0} to={32} holdUntil={14.45} rows={2} maxChars={96} fontSize={84} top={60} moveAt={WALL_AT} keys={['claimed', 'walk', 'back?', 'hype?']} />
    <ColdOpenDoodles />
  </>
);

/* ================================================================== */
/* Scene 1.1 - The doubt (0:14 - 0:43)                                */
/* ================================================================== */
type News = {text: string; bar: string; badge: string; at: number; left: number; top: number; rot: number};
const NEWS: News[] = [
  {text: 'Anthropic’s Claude Code becomes default daily driver for developers', bar: C.bad, badge: 'TOP STORY', at: s(60), left: 110, top: 150, rot: -3},
  {text: 'OpenAI pushes autonomous multimodal reasoning with Astra launch', bar: C.newsBlue, badge: 'TECH DESK', at: s(70), left: 1150, top: 130, rot: 2.5},
  {text: 'Google rolls out another minor Flash model update', bar: C.newsSlate, badge: 'EXCLUSIVE', at: s(77), left: 600, top: 290, rot: -1.5},
  {text: 'Where is Gemini 3.5 Pro? Google delays next frontier release', bar: C.bad, badge: 'EXCLUSIVE', at: s(86), left: 150, top: 520, rot: 2},
  {text: 'Opus sweeps agentic coding leaderboards across all benchmarks', bar: C.newsBlue, badge: 'TECH DESK', at: e(89) - 0.3, left: 1140, top: 500, rot: -2.5},
  {text: 'Is Google falling behind in the frontier AI race?', bar: C.newsSlate, badge: 'TOP STORY', at: s(90), left: 620, top: 720, rot: 1.5},
];
const DROP_AT = s(96) + 0.15;

const NewsCard: React.FC<{n: News; i: number}> = ({n, i}) => {
  const t = useT();
  const pop = usePop(n.at, 12, 190);
  const dropT = Math.max(0, (t - (DROP_AT + i * 0.06)) / 0.7);
  const fall = 1500 * dropT * dropT;
  if (t < n.at - 0.05 || fall > 1400) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: n.left,
        top: n.top,
        width: 650,
        opacity: Math.min(1, pop * 2),
        transform: `translateY(${(1 - pop) * 60 + fall}px) rotate(${n.rot + dropT * (i % 2 ? 9 : -9)}deg) scale(${0.82 + 0.18 * pop})`,
      }}
    >
      <PaperCard style={{overflow: 'hidden', border: `2px solid ${n.bar}`}}>
        <div style={{background: n.bar, height: 46, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8}}>
          {[0, 1, 2].map((d) => (
            <div key={d} style={{width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.75)'}} />
          ))}
          <div style={{flex: 1}} />
          <div style={{fontFamily: mono, fontWeight: 700, fontSize: 17, letterSpacing: 1.5, color: '#fff'}}>{n.badge}</div>
        </div>
        <div style={{padding: '18px 24px 22px', fontFamily: hand, fontSize: 42, lineHeight: 1.12, color: C.ink}}>{n.text}</div>
      </PaperCard>
    </div>
  );
};


/** 13-20s: "the sentiment was unanimous" - Google's lead falls while chatter bubbles pile up. */
const SENT_FROM = 14.8;
const SENT_TO = s(50) + 0.1;

const Bubble: React.FC<{x: number; y: number; at: number; badge?: string; rot: number}> = ({x, y, at, badge, rot}) => {
  const pop = usePop(at, 11, 200);
  const wob = Math.sin(useT() * 2.2 + x) * 3;
  return (
    <g transform={`translate(${x} ${y + wob}) rotate(${rot}) scale(${0.4 + 0.6 * pop})`} opacity={Math.min(1, pop * 2)}>
      <path
        d="M 0 0 H 190 a 18 18 0 0 1 18 18 V 74 a 18 18 0 0 1 -18 18 H 60 L 30 122 L 36 92 H 0 a 18 18 0 0 1 -18 -18 V 18 a 18 18 0 0 1 18 -18 Z"
        fill="#fff"
        stroke={C.ink}
        strokeWidth={4}
        strokeLinejoin="round"
        transform="translate(10 0)"
      />
      <path d="M 70 28 L 100 62 L 130 28" fill="none" stroke={C.bad} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" transform="translate(10 0)" />
      {badge && (
        <g transform="translate(18 -26)">
          <rect width={badge.length * 15 + 28} height={32} rx={16} fill={C.ink} />
          <text x={14} y={22} fontFamily={mono} fontWeight={700} fontSize={17} letterSpacing={1.5} fill="#fff">
            {badge}
          </text>
        </g>
      )}
    </g>
  );
};

const Sentiment: React.FC = () => {
  const t = useT();
  const axes = useRange(SENT_FROM, SENT_FROM + 0.9);
  const lines = useRange(SENT_FROM + 0.8, s(49) + 0.4, Easing.inOut(Easing.quad));
  const labels = useRange(SENT_FROM + 1.0, SENT_FROM + 1.7);
  const lab2 = useRange(s(49), s(49) + 0.6);
  const out = useRange(s(50) - 0.55, s(50) - 0.05);
  if (t < SENT_FROM - 0.1 || t > SENT_TO) return null;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: 1 - out, transform: `translateY(${out * 24}px)`}}>
      <Draw d="M 330 940 L 330 480 M 330 940 L 1600 940" progress={axes} width={5} stroke={C.slateText} />
      <text x={330} y={1000} fontFamily={hand} fontSize={38} fill={C.slateText} opacity={labels}>
        6 months
      </text>
      <Draw d="M 520 985 L 640 985 M 618 972 L 642 985 L 618 998" progress={labels} width={4} stroke={C.slateText} />
      <Draw d="M 360 520 C 560 508 700 556 860 650 S 1220 820 1570 880" progress={lines} width={11} stroke={C.google} />
      <Draw d="M 360 900 C 600 892 760 820 920 722 S 1250 560 1570 480" progress={lines} width={8} stroke={C.slateText} dash="0.03 0.022" />
      <text x={372} y={478} fontFamily={hand} fontSize={42} fill={C.google} opacity={labels}>
        Google
      </text>
      <text x={1210} y={455} fontFamily={hand} fontSize={42} fill={C.slateText} opacity={lab2}>
        everyone else
      </text>
      <Bubble x={420} y={305} at={s(42) - 0.2} badge="TWITTER" rot={-4} />
      <Bubble x={700} y={298} at={s(44) - 0.1} badge="DEV FORUMS" rot={3} />
      <Bubble x={1000} y={308} at={s(47)} rot={-2} />
      <Bubble x={1270} y={298} at={s(48) + 0.1} rot={4} />
      <Bubble x={1530} y={310} at={s(49) - 0.15} rot={-3} />
    </svg>
  );
};

const Doubt: React.FC = () => {
  const t = useT();
  const tag = win(t, NEWS[0].at, DROP_AT + 0.2, 0.3, 0.3);
  return (
    <>
      <WordPages words={W} from={33} to={49} holdUntil={s(50) - 0.5} rows={2} maxChars={110} fontSize={70} top={90} keys={['sentiment']} />
      <Sentiment />
      <WordPages words={W} from={50} to={59} pos="center" holdUntil={s(60) - 0.15} rows={2} maxChars={110} fontSize={92} keys={['lost']} />
      {NEWS.map((n, i) => (
        <NewsCard key={i} n={n} i={i} />
      ))}
      <div
        style={{
          position: 'absolute',
          left: 56,
          bottom: 38,
          fontFamily: mono,
          fontWeight: 500,
          fontSize: 20,
          color: C.slateText,
          opacity: tag,
        }}
      >
        Headlines paraphrased
      </div>
      <WordPages words={W} from={97} to={106} minAppear={DROP_AT + 0.9} holdUntil={s(107) - 0.15} pos="center" rows={2} maxChars={96} fontSize={92} keys={['competes?']} />
    </>
  );
};

/* ================================================================== */
/* Scene 1.2 - The Argon reveal (0:45 - 0:59)                         */
/* ================================================================== */
const URL_AT = s(107) - 0.3;
const CARD_W = 1240;
const CARD_H = 697;

const TagPill: React.FC<{text: string; at: number}> = ({text, at}) => {
  const pop = usePop(at, 12, 190);
  return (
    <div
      style={{
        fontFamily: hand,
        fontSize: 46,
        color: C.ink,
        background: '#fff',
        border: `3px solid ${C.google}`,
        borderRadius: 999,
        padding: '4px 30px 8px',
        boxShadow: '0 8px 18px -8px rgba(26,115,232,0.35)',
        opacity: Math.min(1, pop * 2),
        transform: `translateY(${(1 - pop) * 24}px) scale(${0.85 + 0.15 * pop})`,
      }}
    >
      {text}
    </div>
  );
};

const Reveal: React.FC = () => {
  const t = useT();
  const urlIn = useRange(URL_AT, URL_AT + 0.7, Easing.out(Easing.back(1.4)));
  const cardIn = useRange(URL_AT + 0.35, URL_AT + 1.1);
  const zoom = useRange(URL_AT + 0.4, e(136), (x) => x);
  const box = useRange(s(115), s(115) + 1.0);
  const out = useRange(e(136) - 0.1, e(136) + 0.4);
  if (t < URL_AT - 0.1 || t > e(136) + 0.6) return null;
  const scale = 1 + 0.08 * zoom;
  return (
    <AbsoluteFill style={{opacity: 1 - out, transform: `translateY(${out * 40}px)`}}>
      <div style={{position: 'absolute', top: 54, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - urlIn) * -170}px)`}}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            background: '#fff',
            border: `3px solid ${C.ink}`,
            borderRadius: 999,
            padding: '12px 34px',
            boxShadow: '0 10px 24px -10px rgba(15,23,42,0.3)',
          }}
        >
          <svg width="26" height="26" viewBox="0 0 26 26">
            <rect x="4" y="11" width="18" height="12" rx="3" fill="none" stroke={C.ink} strokeWidth="2.5" />
            <path d="M8 11 V8 a5 5 0 0 1 10 0 V11" fill="none" stroke={C.ink} strokeWidth="2.5" />
          </svg>
          <span style={{fontFamily: mono, fontWeight: 500, fontSize: 26, color: C.ink}}>deepmind.google/models/model-cards/gemini-4-argon/</span>
        </div>
      </div>

      <div style={{position: 'absolute', left: (1920 - CARD_W) / 2, top: 170, opacity: cardIn, transform: `translateY(${(1 - cardIn) * 110}px)`}}>
        <PaperCard style={{width: CARD_W, height: CARD_H, overflow: 'hidden', position: 'relative'}}>
          <div style={{position: 'absolute', inset: 0, transform: `scale(${scale})`, transformOrigin: '50% 18%'}}>
            <Img src={staticFile('images/part1_A01_deepmind_hero_4k.png')} style={{width: CARD_W, height: CARD_H, display: 'block'}} />
            <svg width={CARD_W} height={CARD_H} style={{position: 'absolute', inset: 0}}>
              <Draw d={roughBoxPath(500, 92, 242, 78, 5, 3)} progress={box} stroke={C.blue} width={6} />
            </svg>
          </div>
        </PaperCard>
        <div style={{marginTop: 10, fontFamily: mono, fontSize: 20, color: C.slateText}}>Source: Google DeepMind</div>
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 925, display: 'flex', justifyContent: 'center', gap: 30}}>
        <TagPill text="Enterprise Automation" at={s(130) - 0.1} />
        <TagPill text="Legal Analysis" at={s(132) - 0.1} />
        <TagPill text="Spatial Intelligence" at={s(135) - 0.1} />
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* Scene 1.3 - Three pillars, then the divide (1:00 - 1:26)           */
/* ================================================================== */
const Eye: React.FC<{p: number}> = ({p}) => (
  <svg width="220" height="180" viewBox="0 0 200 180">
    <Draw d="M 15 92 Q 100 8 185 92 Q 100 172 15 92 Z" progress={p} width={6} />
    <Draw d="M 100 62 a 30 30 0 1 0 0.1 0" progress={p} width={6} stroke={C.blue} />
    <circle cx="100" cy="92" r="11" fill={C.ink} opacity={p} />
    <Draw d="M 45 40 L 58 56 M 100 18 L 100 38 M 155 40 L 142 56" progress={p} width={5} stroke={C.slateText} />
  </svg>
);
const Arm: React.FC<{p: number}> = ({p}) => (
  <svg width="220" height="180" viewBox="0 0 200 180">
    <Draw d="M 30 165 L 110 165 M 50 165 L 50 140 L 90 140 L 90 165" progress={p} width={6} />
    <Draw d="M 70 140 L 70 98 L 130 40" progress={p} width={9} stroke={C.blue} />
    <Draw d="M 130 40 L 168 62 M 168 62 L 176 90 M 168 62 L 148 76" progress={p} width={6} />
    <circle cx="70" cy="98" r="9" fill="#fff" stroke={C.ink} strokeWidth="5" opacity={p} />
    <circle cx="130" cy="40" r="9" fill="#fff" stroke={C.ink} strokeWidth="5" opacity={p} />
  </svg>
);
const Cube: React.FC<{p: number}> = ({p}) => (
  <svg width="220" height="180" viewBox="0 0 200 180">
    <Draw d="M 100 15 L 168 52 L 168 128 L 100 165 L 32 128 L 32 52 Z" progress={p} width={6} />
    <Draw d="M 32 52 L 100 90 L 168 52 M 100 90 L 100 165" progress={p} width={6} stroke={C.blue} />
  </svg>
);

const PILLARS = [
  {badge: 'ROBOFLOW', label: 'Computer Vision & OCR', icon: Eye, at: s(151) + 0.05},
  {badge: 'DATACAMP', label: 'Spatial Simulation', icon: Arm, at: s(155) - 0.1},
  {badge: 'YOUTUBE', label: 'Autonomous 3D & Web', icon: Cube, at: s(160) - 0.1},
];
const PILLARS_OUT = s(165) - 0.1;

const Pillar: React.FC<{i: number}> = ({i}) => {
  const t = useT();
  const def = PILLARS[i];
  const rise = useRange(def.at, def.at + 0.7, Easing.out(Easing.back(1.1)));
  const draw = useRange(def.at + 0.3, def.at + 1.3);
  const out = useRange(PILLARS_OUT, PILLARS_OUT + 0.6, Easing.in(Easing.cubic));
  if (t < def.at - 0.05 || t > PILLARS_OUT + 0.7) return null;
  const hover = Math.sin(t * 1.6 + i * 1.7) * 7;
  const Icon = def.icon;
  return (
    <div
      style={{
        position: 'absolute',
        left: 150 + i * 560,
        top: 360,
        width: 500,
        opacity: Math.min(1, rise * 1.5) * (1 - out),
        transform: `translateY(${(1 - rise) * 160 + hover + out * 80}px) rotate(${(i - 1) * 1.2}deg)`,
      }}
    >
      <PaperCard style={{padding: '26px 26px 30px', textAlign: 'center', height: 440, boxSizing: 'border-box'}}>
        <div style={{display: 'inline-block', background: C.ink, color: '#fff', fontFamily: mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, padding: '6px 18px', borderRadius: 999}}>
          {def.badge}
        </div>
        <div style={{marginTop: 26}}>
          <Icon p={draw} />
        </div>
        <div style={{marginTop: 14, fontFamily: hand, fontSize: 50, lineHeight: 1.1, color: C.ink}}>{def.label}</div>
      </PaperCard>
    </div>
  );
};

const HandLine: React.FC<{parts: {t: string; key?: boolean}[]; size: number}> = ({parts, size}) => (
  <div style={{fontFamily: hand, fontSize: size, lineHeight: 1.12, color: C.ink}}>
    {parts.map((p, i) => (
      <span key={i} style={{color: p.key ? C.blue : C.ink}}>
        {p.t}
      </span>
    ))}
  </div>
);

const Split: React.FC = () => {
  const t = useT();
  const lineAt = s(169) - 0.1;
  const line = useRange(lineAt, lineAt + 1.0);
  const left = useRange(s(170) - 0.2, s(170) + 0.5);
  const right = useRange(s(181) - 0.2, s(181) + 0.5);
  const up = useRange(s(170) + 0.5, s(170) + 2.2);
  const div = useRange(s(181) + 0.5, s(181) + 2.4);
  const warn = usePop(s(185), 10, 200);
  if (t < lineAt - 0.1) return null;
  const panel: React.CSSProperties = {position: 'absolute', top: 330, width: 800, height: 650};
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Draw d="M 960 305 C 952 480 970 700 958 1005" progress={line} width={6} stroke={C.slateText} />
      </svg>
      <div style={{...panel, left: 110, opacity: left, transform: `translateY(${(1 - left) * 70}px)`}}>
        <PaperCard border={C.good} style={{width: '100%', height: '100%', boxSizing: 'border-box', padding: '34px 40px', borderWidth: 4}}>
          <HandLine size={58} parts={[{t: 'Some tasks, Google '}, {t: 'blew', key: true}, {t: ' them out of the water.'}]} />
          <svg width={720} height={380} viewBox="0 0 720 380" style={{marginTop: 22}}>
            <Draw d="M 40 350 L 40 30 M 40 350 L 690 350" progress={up} width={5} stroke={C.slateText} />
            <Draw d="M 70 320 C 200 312 260 240 360 210 S 560 110 650 60" progress={up} width={10} stroke={C.good} />
            <Draw d="M 610 50 L 656 56 L 638 102" progress={up} width={10} stroke={C.good} />
          </svg>
        </PaperCard>
      </div>
      <div style={{...panel, left: 1010, opacity: right, transform: `translateY(${(1 - right) * 70}px)`}}>
        <PaperCard border={C.bad} style={{width: '100%', height: '100%', boxSizing: 'border-box', padding: '34px 40px', borderWidth: 4, position: 'relative'}}>
          <div style={{paddingRight: 100}}>
            <HandLine size={58} parts={[{t: 'But on others... a massive '}, {t: 'divide.', key: true}]} />
          </div>
          <svg width={720} height={380} viewBox="0 0 720 380" style={{marginTop: 22}}>
            <Draw d="M 40 350 L 40 30 M 40 350 L 690 350" progress={div} width={5} stroke={C.slateText} />
            <Draw d="M 70 200 C 220 180 440 120 650 62" progress={div} width={9} stroke={C.ink} dash="0.03 0.022" />
            <Draw d="M 70 200 C 220 212 440 262 650 300" progress={div} width={10} stroke={C.bad} />
            <text x={90} y={96} fontFamily={hand} fontSize={34} fill={C.ink} opacity={div}>
              what benchmarks promise
            </text>
            <text x={120} y={318} fontFamily={hand} fontSize={34} fill={C.bad} opacity={div}>
              what developers get
            </text>
          </svg>
          <svg
            width={84}
            height={84}
            viewBox="0 0 84 84"
            style={{position: 'absolute', right: 34, top: 28, opacity: Math.min(1, warn * 2), transform: `scale(${0.5 + 0.5 * warn}) rotate(${(1 - warn) * 20}deg)`}}
          >
            <path d="M42 8 L78 72 H6 Z" fill={C.bad} fillOpacity={0.15} stroke={C.bad} strokeWidth={5} strokeLinejoin="round" />
            <path d="M42 30 V50" stroke={C.bad} strokeWidth={6} strokeLinecap="round" />
            <circle cx="42" cy="61" r="3.8" fill={C.bad} />
          </svg>
        </PaperCard>
      </div>
    </>
  );
};

const Pillars: React.FC = () => (
  <>
    <WordPages words={W} from={137} to={150} minAppear={e(136) + 0.1} holdUntil={s(151) + 1.2} moveAt={s(151) - 0.8} rows={2} maxChars={96} fontSize={74} top={80} keys={['independent']} />
    {PILLARS.map((_, i) => (
      <Pillar key={i} i={i} />
    ))}
    <WordPages words={W} from={165} to={169} minAppear={PILLARS_OUT + 0.4} holdUntil={s(170) + 0.2} moveAt={PILLARS_OUT + 0.9} rows={1} maxChars={60} fontSize={84} top={110} keys={['split.']} />
    <Split />
    <WordPages words={W} from={187} to={196} minAppear={s(186) + 0.6} holdUntil={e(196) + 0.1} rows={2} maxChars={96} fontSize={62} top={60} keys={['benchmarks']} />
  </>
);

/* ================================================================== */
export const ArgonV2Part1: React.FC = () => (
  <AbsoluteFill>
    <DotCanvas />
    <Audio src={staticFile(PART1_AUDIO)} />
    <ColdOpen />
    <Doubt />
    <Reveal />
    <Pillars />
  </AbsoluteFill>
);
