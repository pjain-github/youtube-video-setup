import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile} from 'remotion';
import wordsJson from '../../data/argon_v2/part_06_words.json';
import {C} from './tokens';
import {FPS, WordPages, hand, mono, type Word} from './hand';
import {DotCanvas, Pill, lerp, useRange, usePop, useT, win} from './common';

/**
 * Part 6 - Outro (scenes 6.1 - 6.2). Teaser uses ONLY 0:07-0:15 of the reference
 * recording (pre-cut to videos/part6_claude_code_teaser.mp4, 8s).
 */
const W = wordsJson as Word[];
const s = (i: number) => W[i].start;

export const PART6_AUDIO = 'audio/gemini_4_argon/part_06_outro.mp3';
export const PART6_FRAMES = Math.round(31.7 * FPS);

const T_VID = s(43) - 0.6; // teaser card opens ("check out my ...")
const VID_LEN = 7.95;
const T_VID_END = T_VID + VID_LEN + 0.3;
const T_CTA = s(67) - 0.4;
const T_SUB = s(87) - 0.2;

const Chip: React.FC<{text: string; at: number; x: number; y: number; color: string}> = ({text, at, x, y, color}) => {
  const t = useT();
  const o = win(t, at, T_VID - 0.3, 0.01, 0.3);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: 'translateX(-50%)'}}>
      <div style={{opacity: o}}>
        <Pill text={text} at={at} color={color} size={54} />
      </div>
    </div>
  );
};

const Teaser: React.FC = () => {
  const t = useT();
  const pop = usePop(T_VID, 16, 140);
  const o = win(t, T_VID, T_VID_END, 0.2, 0.3);
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 320,
        top: 190,
        width: 1280,
        opacity: o,
        transform: `scale(${0.7 + 0.3 * pop})`,
        transformOrigin: 'center',
      }}
    >
      <div style={{position: 'absolute', left: 0, top: -64, zIndex: 2}}>
        <Pill text="MY RECENT VIDEO · Claude Code" at={T_VID + 0.3} color={C.anthropic} size={40} />
      </div>
      <div
        style={{
          width: 1280,
          height: 720,
          overflow: 'hidden',
          border: `3px solid ${C.ink}`,
          borderRadius: 14,
          background: '#000',
          boxShadow: '0 24px 50px -14px rgba(15,23,42,0.35)',
        }}
      >
        <Sequence from={Math.round(T_VID * FPS)} durationInFrames={Math.round(VID_LEN * FPS)} layout="none">
          <OffthreadVideo src={staticFile('videos/part6_claude_code_teaser.mp4')} muted style={{width: 1280, height: 720, objectFit: 'cover'}} />
        </Sequence>
      </div>
      <div style={{marginTop: 14, fontFamily: mono, fontSize: 22, color: C.slateText}}>generating music and automated code animations with Claude Code</div>
    </div>
  );
};

const Bell: React.FC<{at: number}> = ({at}) => {
  const t = useT();
  const pop = usePop(at, 10, 200);
  const swing = t > at ? Math.sin((t - at) * 14) * 22 * Math.exp(-(t - at) * 1.4) : 0;
  return (
    <svg width={110} height={120} viewBox="0 0 110 120" style={{opacity: Math.min(1, pop * 2), transform: `scale(${pop}) rotate(${swing}deg)`, transformOrigin: '55px 14px'}}>
      <path d="M55 14 C30 14 24 38 24 62 C24 80 14 88 10 96 L100 96 C96 88 86 80 86 62 C86 38 80 14 55 14 Z" fill="#FDE68A" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
      <circle cx={55} cy={106} r={9} fill={C.ink} />
    </svg>
  );
};

const Subscribe: React.FC = () => {
  const t = useT();
  const pop = usePop(T_SUB, 14, 170);
  const click = useRange(s(89), s(89) + 0.25);
  const press = click < 1 ? Math.sin(click * Math.PI) : 0;
  const clicked = t > s(89) + 0.12;
  const o = Math.min(1, pop * 2);
  if (t < T_SUB) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 480, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36, opacity: o}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 40, transform: `translateY(${(1 - pop) * 60}px) scale(${1 - 0.06 * press})`}}>
        <div
          style={{
            fontFamily: hand,
            fontSize: 110,
            color: '#fff',
            background: clicked ? '#64748B' : '#DC2626',
            borderRadius: 24,
            padding: '6px 64px 16px',
            boxShadow: '0 16px 30px -10px rgba(15,23,42,0.4)',
          }}
        >
          {clicked ? '✓ SUBSCRIBED' : 'SUBSCRIBE'}
        </div>
        <Bell at={s(89) + 0.4} />
      </div>
      <div style={{fontFamily: hand, fontSize: 64, color: C.ink}}>
        <span style={{color: C.blue}}>Bytesplained</span> · technical breakdowns
      </div>
    </div>
  );
};

export const ArgonV2Part6: React.FC = () => {
  const t = useT();
  const chipO = lerp(t, [T_VID - 0.6, T_VID - 0.2], [1, 0]);
  return (
    <AbsoluteFill>
      <DotCanvas id="argon-dots-p6" />
      <Audio src={staticFile(PART6_AUDIO)} />
      <WordPages words={W} from={0} to={42} holdUntil={T_VID - 0.1} pos="center" moveAt={4.4} rows={2} maxChars={74} fontSize={84} keys={['incredible', 'agentic']} />
      <div style={{opacity: chipO}}>
        <Chip text="AI AGENTS" at={s(22) + 0.2} x={560} y={620} color={C.google} />
        <Chip text="AGENTIC WORKFLOWS" at={s(32) + 0.2} x={1000} y={760} color={C.anthropic} />
        <Chip text="THE RIGHT TOOLS" at={s(41) + 0.2} x={1400} y={620} color={C.good} />
      </div>
      <Teaser />
      <WordPages words={W} from={67} to={86} minAppear={T_CTA} holdUntil={s(87) - 0.1} rows={2} maxChars={84} fontSize={72} top={110} keys={['comment', 'switching']} />
      <Subscribe />
    </AbsoluteFill>
  );
};
