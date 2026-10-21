import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C} from './tokens';
import {FPS, hand, mono, useRange, usePop} from './hand';

/** Shared building blocks for Parts 3-5 (same look as Parts 1-2). */

export const useT = () => useCurrentFrame() / FPS;

/** 0..1 visibility window with soft fade in / out. */
export const win = (t: number, a: number, b: number, fi = 0.25, fo = 0.35) =>
  Math.max(0, Math.min(1, Math.min((t - a) / fi, (b - t) / fo)));

export const lerp = (t: number, xs: number[], ys: number[]) =>
  interpolate(t, xs, ys, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});

export const DotCanvas: React.FC<{id?: string}> = ({id = 'argon-dots-x'}) => (
  <AbsoluteFill style={{background: C.canvas}}>
    <svg width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
      <defs>
        <pattern id={id} width={24} height={24} patternUnits="userSpaceOnUse">
          <circle cx={12} cy={12} r={1.5} fill={C.dot} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  </AbsoluteFill>
);

export const Source: React.FC<{text: string; style?: React.CSSProperties}> = ({text, style}) => (
  <div style={{fontFamily: mono, fontSize: 20, color: C.slateText, ...style}}>{text}</div>
);

/** Rounded pill that pops in at `at` (seconds). */
export const Pill: React.FC<{text: string; at: number; color?: string; size?: number; fill?: string; ink?: string}> = ({
  text,
  at,
  color = C.google,
  size = 46,
  fill = '#fff',
  ink = C.ink,
}) => {
  const pop = usePop(at, 12, 190);
  return (
    <div
      style={{
        fontFamily: hand,
        fontSize: size,
        color: ink,
        background: fill,
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

/** A stat block: mono label, big hand-print number, small caption. */
export const Stat: React.FC<{
  at: number;
  label: string;
  big: React.ReactNode;
  caption?: React.ReactNode;
  color?: string;
  width?: number;
  bigSize?: number;
  style?: React.CSSProperties;
}> = ({at, label, big, caption, color = C.ink, width = 400, bigSize = 112, style}) => {
  const pop = usePop(at, 12, 180);
  return (
    <div
      style={{
        width,
        boxSizing: 'border-box',
        background: '#fff',
        border: `3px solid ${color}`,
        borderRadius: 14,
        padding: '12px 22px 16px',
        boxShadow: '0 14px 30px -12px rgba(15,23,42,0.25)',
        opacity: Math.min(1, pop * 2),
        transform: `translateY(${(1 - pop) * 40}px) scale(${0.9 + 0.1 * pop})`,
        ...style,
      }}
    >
      <div style={{fontFamily: mono, fontWeight: 700, fontSize: 18, letterSpacing: 2, color: C.slateText}}>{label}</div>
      <div style={{fontFamily: hand, fontSize: bigSize, lineHeight: 1.0, color}}>{big}</div>
      {caption && <div style={{fontFamily: hand, fontSize: 34, lineHeight: 1.1, color: C.ink, marginTop: 4}}>{caption}</div>}
    </div>
  );
};

/** Crops a region of a screenshot into an overflow-hidden card; children get the zoom factor k. */
export const CropCard: React.FC<{
  src: string;
  srcW: number;
  srcH: number;
  crop: {x: number; y: number; w: number; h: number};
  width: number;
  border?: string;
  children?: (k: number) => React.ReactNode;
  style?: React.CSSProperties;
  radius?: number;
}> = ({src, srcW, srcH, crop, width, border = C.slate, children, style, radius = 12}) => {
  const k = width / crop.w;
  const height = crop.h * k;
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
        background: '#fff',
        border: `2px solid ${border}`,
        borderRadius: radius,
        boxShadow: '0 14px 34px -10px rgba(15,23,42,0.18), 0 3px 8px rgba(15,23,42,0.06)',
        boxSizing: 'content-box',
        ...style,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{position: 'absolute', width: srcW * k, height: srcH * k, left: -crop.x * k, top: -crop.y * k, maxWidth: 'none'}}
      />
      {children?.(k)}
    </div>
  );
};

/** Wall-clock helper: seconds range -> eased progress (re-export for brevity). */
export {useRange, usePop};
