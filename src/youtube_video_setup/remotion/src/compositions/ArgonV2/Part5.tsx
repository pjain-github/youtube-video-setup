import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import wordsJson from '../../data/argon_v2/part_05_words.json';
import {C} from './tokens';
import {Draw, FPS, PaperCard, WordPages, hand, mono, type Word} from './hand';
import {DotCanvas, lerp, useRange, usePop, useT, win} from './common';

/**
 * Part 5 - The verdict (scenes 5.1 - 5.2 of the v2 blueprint).
 * Timed from part_05_words.json: s(i) = start seconds of word i.
 */
const W = wordsJson as Word[];
const s = (i: number) => W[i].start;

export const PART5_AUDIO = 'audio/gemini_4_argon/part_05_the_verdict.mp3';
export const PART5_FRAMES = Math.round(49.45 * FPS);

const T_FIRST = 4.2; // pedestals rise
const T_SECOND = s(60) - 0.1;
const T_THIRD = s(83) - 0.1;
const T_FINAL = s(106) - 0.4;

/* ------------------------------------------------------------------ */
/* Pedestals                                                           */
/* ------------------------------------------------------------------ */
const BASE_TOP = 770;

const Pedestal: React.FC<{x: number; name: string; sub: string; color: string; raise: number; dim: number; appear: number}> = ({x, name, sub, color, raise, dim, appear}) => (
  <div
    style={{
      position: 'absolute',
      left: x - 210,
      top: BASE_TOP - raise * 110,
      width: 420,
      opacity: appear * (1 - 0.5 * dim),
      transform: `translateY(${(1 - appear) * 160}px) scale(${1 + 0.1 * raise - 0.06 * dim})`,
      transformOrigin: 'center bottom',
    }}
  >
    <svg width={420} height={260} viewBox="0 0 420 260" style={{overflow: 'visible'}}>
      <path d="M 40 30 L 380 30 L 420 66 L 0 66 Z" fill="#F8FAFC" stroke={color} strokeWidth={5} strokeLinejoin="round" />
      <rect x={0} y={66} width={420} height={190} fill="#fff" stroke={color} strokeWidth={5} />
      <text x={210} y={150} textAnchor="middle" fontFamily={hand} fontSize={80} fill={C.ink}>
        {name}
      </text>
      <text x={210} y={196} textAnchor="middle" fontFamily={mono} fontWeight={700} fontSize={22} letterSpacing={3} fill={color}>
        {sub}
      </text>
    </svg>
  </div>
);

const Chip: React.FC<{text: string; at: number; color: string; x: number; y: number}> = ({text, at, color, x, y}) => {
  const pop = usePop(at, 12, 190);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: '#fff',
        border: `3px solid ${color}`,
        borderRadius: 999,
        padding: '2px 30px 8px 18px',
        fontFamily: hand,
        fontSize: 50,
        color: C.ink,
        opacity: Math.min(1, pop * 2),
        transform: `translateX(${(1 - pop) * 40}px)`,
        boxShadow: `0 8px 18px -8px ${color}66`,
        whiteSpace: 'nowrap',
      }}
    >
      <svg width="34" height="34" viewBox="0 0 40 40">
        <path d="M6 22 L16 32 L34 8" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {text}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Google focus: TPU chip, 1M context, enterprise checks               */
/* ------------------------------------------------------------------ */
const Tpu: React.FC<{p: number}> = ({p}) => (
  <svg width={300} height={300} viewBox="0 0 300 300">
    <Draw d="M 60 60 L 240 60 L 240 240 L 60 240 Z" progress={p} width={8} stroke={C.google} fill="#EFF6FF" />
    <Draw d="M 100 100 L 200 100 L 200 200 L 100 200 Z" progress={p} width={6} stroke={C.ink} />
    {[90, 130, 170, 210].map((v) => (
      <Draw key={v} d={`M ${v} 60 L ${v} 30 M ${v} 240 L ${v} 270 M 60 ${v} L 30 ${v} M 240 ${v} L 270 ${v}`} progress={p} width={6} stroke={C.ink} />
    ))}
    <text x={150} y={166} textAnchor="middle" fontFamily={mono} fontWeight={700} fontSize={42} fill={C.google} opacity={p}>
      TPU
    </text>
  </svg>
);

const GoogleFocus: React.FC = () => {
  const t = useT();
  const v = win(t, s(13), T_SECOND, 0.4, 0.6);
  const chip = useRange(s(15) - 0.2, s(15) + 1.1);
  const ctx = usePop(s(30), 11, 190);
  const hw = usePop(s(58), 10, 200);
  if (v <= 0) return null;
  return (
    <AbsoluteFill style={{opacity: v}}>
      <div style={{position: 'absolute', left: 250, top: 160}}>
        <Tpu p={chip} />
        <div style={{textAlign: 'center', fontFamily: hand, fontSize: 48, color: C.ink, opacity: chip}}>custom TPU infrastructure</div>
      </div>
      <div style={{position: 'absolute', left: 740, top: 180, opacity: Math.min(1, ctx * 2), transform: `scale(${0.8 + 0.2 * ctx})`, transformOrigin: 'left center'}}>
        <div style={{background: C.google, color: '#fff', fontFamily: hand, fontSize: 74, borderRadius: 18, padding: '4px 36px 12px', boxShadow: '0 14px 28px -10px rgba(26,115,232,0.6)'}}>
          1M-token context · lower price
        </div>
      </div>
      <Chip text="Enterprise data" at={s(39)} color={C.good} x={740} y={330} />
      <Chip text="Regulatory filings" at={s(44)} color={C.good} x={1230} y={330} />
      <Chip text="Vision pipelines" at={s(48)} color={C.good} x={740} y={430} />
      <Chip text="Million-line repos" at={s(53)} color={C.good} x={1230} y={430} />
      <div style={{position: 'absolute', left: 740, top: 560, opacity: Math.min(1, hw * 2), transform: `scale(${0.85 + 0.15 * hw})`, transformOrigin: 'left center'}}>
        <div style={{fontFamily: hand, fontSize: 80, color: C.google, lineHeight: 1}}>
          a legitimate <span style={{color: C.ink}}>heavyweight</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Anthropic focus: terminal + the standard                            */
/* ------------------------------------------------------------------ */
const AnthropicFocus: React.FC = () => {
  const t = useT();
  const v = win(t, T_SECOND + 0.6, T_THIRD, 0.4, 0.6);
  const term = usePop(s(65), 12, 170);
  const std = usePop(s(77) - 0.2, 11, 190);
  const typed = Math.floor(lerp(t, [s(68), s(68) + 1.2], [0, 18]));
  if (v <= 0) return null;
  return (
    <AbsoluteFill style={{opacity: v}}>
      <div style={{position: 'absolute', left: 200, top: 150, width: 760, opacity: Math.min(1, term * 2), transform: `translateY(${(1 - term) * 60}px)`}}>
        <PaperCard border={C.anthropic} style={{overflow: 'hidden', borderWidth: 4}}>
          <div style={{height: 44, background: '#EDE9FE', display: 'flex', alignItems: 'center', gap: 9, padding: '0 16px'}}>
            {['#F87171', '#FBBF24', '#34D399'].map((c) => (
              <div key={c} style={{width: 14, height: 14, borderRadius: '50%', background: c}} />
            ))}
            <div style={{flex: 1, textAlign: 'center', fontFamily: mono, fontSize: 18, color: C.slateText}}>claude — terminal</div>
          </div>
          <div style={{padding: '24px 32px 30px', fontFamily: mono, fontSize: 32, color: C.ink, lineHeight: 1.5}}>
            <div>{'$ claude "refactor it"'.slice(0, typed + 2)}</div>
            <div style={{color: C.good, opacity: win(t, s(68) + 1.2, 999, 0.3, 1)}}>✓ plan → edit → test → fix</div>
          </div>
        </PaperCard>
      </div>
      <Chip text="Terminal reliability" at={s(68)} color={C.anthropic} x={1040} y={190} />
      <Chip text="Architectural taste" at={s(72)} color={C.anthropic} x={1040} y={290} />
      <div style={{position: 'absolute', left: 1040, top: 420, opacity: Math.min(1, std * 2), transform: `scale(${0.85 + 0.15 * std})`, transformOrigin: 'left center'}}>
        <div style={{fontFamily: hand, fontSize: 70, lineHeight: 1.05, color: C.ink}}>
          Opus 5.5 + Claude Code
          <br />
          <span style={{color: C.anthropic}}>remain the standard</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Third point: benchmarks do not equal reliability                    */
/* ------------------------------------------------------------------ */
const Trap: React.FC = () => {
  const t = useT();
  const v = win(t, T_THIRD + 0.3, T_FINAL, 0.4, 0.5);
  const ban = usePop(s(84), 10, 190);
  const wall = useRange(s(95), s(95) + 0.8);
  const arrow = useRange(s(96), s(98) + 0.4);
  const flat = usePop(s(100), 11, 190);
  if (v <= 0) return null;
  return (
    <AbsoluteFill style={{opacity: v}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', justifyContent: 'center', opacity: Math.min(1, ban * 2), transform: `scale(${0.85 + 0.15 * ban})`}}>
        <div style={{background: '#fff', border: `5px solid ${C.bad}`, borderRadius: 18, padding: '4px 50px 14px', fontFamily: hand, fontSize: 96, lineHeight: 1.05, color: C.ink, boxShadow: '0 16px 30px -12px rgba(220,38,38,0.4)'}}>
          ⚠ Benchmarks <span style={{color: C.bad}}>≠</span> Agentic Reliability
        </div>
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {/* wall + clipping arrow */}
        <g transform="translate(330 360)">
          <Draw d="M 120 40 L 260 40 L 260 260 L 120 260 Z" progress={wall} stroke={C.slateText} width={7} fill="#E2E8F0" />
          <Draw d="M 120 100 L 260 100 M 120 160 L 260 160 M 190 40 L 190 100 M 160 100 L 160 160 M 220 160 L 220 260" progress={wall} stroke="#fff" width={6} />
          <Draw d="M 0 150 L 380 150" progress={arrow} stroke={C.bad} width={9} dash="0.05 0.035" />
          <Draw d="M 340 112 L 388 150 L 340 188" progress={arrow} stroke={C.bad} width={9} />
        </g>
        <text x={520} y={720} textAnchor="middle" fontFamily={hand} fontSize={52} fill={C.bad} opacity={arrow}>
          clips through walls
        </text>
        {/* flat 2D bottle */}
        <g opacity={Math.min(1, flat * 2)} transform={`translate(1210 330) scale(${0.7 + 0.3 * flat})`}>
          <path d="M 100 120 L 100 80 Q 100 60 120 60 L 180 60 Q 200 60 200 80 L 200 120 C 240 150 250 190 250 230 L 250 380 Q 250 410 220 410 L 80 410 Q 50 410 50 380 L 50 230 C 50 190 60 150 100 120 Z" fill="#CBD5E1" stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
          <rect x={110} y={30} width={80} height={34} rx={6} fill="#94A3B8" stroke={C.ink} strokeWidth={7} />
          <rect x={75} y={250} width={150} height={90} rx={8} fill="#fff" stroke={C.ink} strokeWidth={6} />
        </g>
        <text x={1350} y={800} textAnchor="middle" fontFamily={hand} fontSize={52} fill={C.bad} opacity={flat}>
          cuts corners (flat 2D)
        </text>
      </svg>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
const Crown: React.FC<{x: number; top: number; p: number; wob: number}> = ({x, top, p, wob}) => (
  <svg width={160} height={110} viewBox="0 0 160 110" style={{position: 'absolute', left: x - 80, top: top - 100, opacity: Math.min(1, p * 2), transform: `rotate(${wob}deg) scale(${0.6 + 0.4 * p})`, transformOrigin: 'center bottom'}}>
    <path d="M 14 96 L 8 28 L 50 62 L 80 14 L 110 62 L 152 28 L 146 96 Z" fill={C.note} stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
    <circle cx={8} cy={26} r={9} fill={C.ink} />
    <circle cx={80} cy={12} r={9} fill={C.ink} />
    <circle cx={152} cy={26} r={9} fill={C.ink} />
  </svg>
);

const Pedestals: React.FC = () => {
  const t = useT();
  const appear = usePop(T_FIRST, 14, 150);
  const ks = [T_FIRST, T_FIRST + 0.9, T_SECOND - 0.1, T_SECOND + 0.7, T_THIRD - 0.1, T_THIRD + 0.7, T_FINAL, T_FINAL + 1.3];
  const google = lerp(t, ks, [0, 1, 1, 0, 0, 0, 0, 0.8]);
  const anthropic = lerp(t, [T_SECOND - 0.1, T_SECOND + 0.7, T_THIRD - 0.1, T_THIRD + 0.7, T_FINAL, T_FINAL + 1.3], [0, 1, 1, 0, 0, 1]);
  const crown = usePop(s(112), 10, 160);
  const wob = Math.sin(t * 9) * 5 * win(t, s(117) - 0.2, s(117) + 1.4, 0.2, 0.6);
  const dimG = Math.max(anthropic * (1 - google), 0);
  const dimA = Math.max(google * (1 - anthropic), 0);
  const dimO = Math.max(google, anthropic);
  if (t < T_FIRST - 0.1) return null;
  return (
    <>
      <Pedestal x={360} name="Google" sub="TPUs · 1M CONTEXT" color={C.google} raise={google} dim={dimG} appear={appear} />
      <Pedestal x={960} name="Anthropic" sub="CLAUDE CODE" color={C.anthropic} raise={anthropic} dim={dimA} appear={appear} />
      <Pedestal x={1560} name="OpenAI" sub="ASTRA" color={C.slateText} raise={0} dim={dimO} appear={appear} />
      {t > s(112) - 0.2 && <Crown x={960} top={BASE_TOP - anthropic * 110 + 24} p={crown} wob={wob} />}
    </>
  );
};

export const ArgonV2Part5: React.FC = () => (
  <AbsoluteFill>
    <DotCanvas id="argon-dots-p5" />
    <Audio src={staticFile(PART5_AUDIO)} />
    <WordPages words={W} from={0} to={11} holdUntil={T_FIRST + 0.1} pos="center" rows={2} maxChars={80} fontSize={96} keys={['verdict?']} />
    <Pedestals />
    <GoogleFocus />
    <AnthropicFocus />
    <Trap />
    <WordPages words={W} from={106} to={119} minAppear={T_FINAL + 0.3} holdUntil={49.4} rows={2} maxChars={96} fontSize={74} top={90} keys={['dethroned']} />
  </AbsoluteFill>
);
