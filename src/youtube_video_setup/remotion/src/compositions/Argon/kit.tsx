import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame} from 'remotion';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadSerif} from '@remotion/google-fonts/Newsreader';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';
import timings from '../../data/argon_timings.json';

export const sans = loadInter('normal', {weights: ['500', '700', '800']}).fontFamily;
export const serif = loadSerif('italic', {weights: ['400', '500']}).fontFamily;
export const mono = loadMono('normal', {weights: ['500', '700']}).fontFamily;

/** Palette from the remotion-general-animation skill. */
export const K = {
  bg: '#F6F4EE',
  white: '#FFFFFF',
  cream: '#FAF7F2',
  ink: '#111111',
  muted: '#78736B',
  dot: '#DCD7CD',
  cobalt: '#1D4ED8',
  terra: '#E06A26',
  yellow: '#FFE600',
  green: '#1E6F50',
};

export const FPS = 30;
export const sf = (s: number) => Math.round(s * FPS);

type Part = {duration: number; sentences: {text: string; start: number; end: number}[]};

/**
 * A slice of one voiceover part, from sentence `a` to sentence `b`.
 * `at(i, off)` = seconds (relative to the slice start) at which sentence i begins (+off).
 */
export const segment = (part: number, a: number, b: number, tail = 0) => {
  const p = (timings as {parts: Part[]}).parts[part - 1];
  const start = p.sentences[a].start;
  const end = Math.min(p.duration, p.sentences[b].end + tail);
  return {
    part,
    start,
    end,
    seconds: end - start,
    frames: sf(end - start),
    at: (i: number, off = 0) => p.sentences[i].start - start + off,
  };
};

/** 0 -> 1 spring starting at `atSec`. */
export const useP = (atSec: number, damping = 200, stiffness = 100) => {
  const frame = useCurrentFrame();
  return spring({frame: frame - sf(atSec), fps: FPS, config: {damping, stiffness}});
};

/** Linear 0 -> 1 between two times (seconds). */
export const useT = (fromSec: number, toSec: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [sf(fromSec), sf(toSec)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

export const useCount = (fromSec: number, toSec: number, to: number, decimals = 1) => {
  const t = useT(fromSec, toSec);
  const e = 1 - Math.pow(1 - t, 3);
  return (to * e).toFixed(decimals);
};

/** Warm paper canvas with a drifting dot grid. */
export const Stage: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: K.bg, fontFamily: sans, color: K.ink, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${K.dot} 2.2px, transparent 2.4px)`,
          backgroundSize: '30px 30px',
          backgroundPosition: `${frame * 0.18}px ${frame * 0.1}px`,
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 55%, #000 25%, rgba(0,0,0,0.25) 100%)',
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

/** Spring entrance: rise, de-blur, scale. */
export const Reveal: React.FC<{
  at: number;
  dist?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({at, dist = 28, style, children}) => {
  const p = useP(at, 16, 170);
  return (
    <div
      style={{
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${(1 - p) * dist}px) scale(${0.92 + 0.08 * p})`,
        filter: `blur(${(1 - p) * 10}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Neo-brutalist card with optional top pill badge. */
export const Card: React.FC<{
  badge?: string;
  badgeBg?: string;
  bg?: string;
  center?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({badge, badgeBg = K.ink, bg = K.white, center, style, children}) => (
  <div
    style={{
      position: 'relative',
      background: bg,
      border: `3px solid ${K.ink}`,
      borderRadius: 14,
      boxShadow: `7px 7px 0 ${K.ink}`,
      padding: 36,
      boxSizing: 'border-box',
      ...(center ? {display: 'flex', flexDirection: 'column', justifyContent: 'center'} : {}),
      ...style,
    }}
  >
    {badge && (
      <div
        style={{
          position: 'absolute',
          top: -17,
          left: 28,
          background: badgeBg,
          color: badgeBg === K.yellow ? K.ink : K.white,
          fontFamily: mono,
          fontWeight: 700,
          fontSize: 19,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          padding: '6px 16px',
          borderRadius: 999,
        }}
      >
        {badge}
      </div>
    )}
    {children}
  </div>
);

/** Yellow marker bar that sweeps in behind text. */
export const Hl: React.FC<{at: number; color?: string; children: React.ReactNode}> = ({
  at,
  color = K.yellow,
  children,
}) => {
  const t = useT(at, at + 0.45);
  return (
    <span style={{position: 'relative', display: 'inline-block', padding: '0 8px'}}>
      <span
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '46%',
          bottom: '2%',
          background: color,
          transformOrigin: 'left',
          transform: `scaleX(${t})`,
        }}
      />
      <span style={{position: 'relative'}}>{children}</span>
    </span>
  );
};

export const Mono: React.FC<{size?: number; color?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({
  size = 24,
  color = K.muted,
  children,
  style,
}) => (
  <span
    style={{fontFamily: mono, fontWeight: 500, fontSize: size, color, letterSpacing: 1, textTransform: 'uppercase', ...style}}
  >
    {children}
  </span>
);

export const Serif: React.FC<{size?: number; color?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({
  size = 52,
  color = K.muted,
  children,
  style,
}) => (
  <span style={{fontFamily: serif, fontStyle: 'italic', fontWeight: 400, fontSize: size, color, ...style}}>
    {children}
  </span>
);

/** Page header: mono pill + serif lead-in. */
export const Header: React.FC<{tag: string; lead: React.ReactNode; at?: number; tagBg?: string}> = ({
  tag,
  lead,
  at = 0.2,
  tagBg = K.ink,
}) => (
  <div style={{position: 'absolute', left: 120, top: 70}}>
    <Reveal at={at}>
      <div
        style={{
          display: 'inline-block',
          background: tagBg,
          color: K.white,
          fontFamily: mono,
          fontWeight: 700,
          fontSize: 20,
          letterSpacing: 1.5,
          padding: '7px 18px',
          borderRadius: 999,
          marginBottom: 14,
          textTransform: 'uppercase',
        }}
      >
        {tag}
      </div>
    </Reveal>
    <Reveal at={at + 0.15}>
      <div style={{fontFamily: serif, fontStyle: 'italic', fontSize: 62, lineHeight: 1.1}}>{lead}</div>
    </Reveal>
  </div>
);

/** Fades the whole scene in/out so renders cut cleanly. */
export const Fade: React.FC<{frames: number; children: React.ReactNode}> = ({frames, children}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 6, frames - 8, frames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};
