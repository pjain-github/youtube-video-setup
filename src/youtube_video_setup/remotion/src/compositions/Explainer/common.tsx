import React from 'react';
import {AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';

export const sans = loadInter('normal', {weights: ['400', '500', '600', '700', '800']}).fontFamily;
export const mono = loadMono('normal', {weights: ['400', '600']}).fontFamily;

/** Project palette (remotion-general-animation skill). */
export const C = {
  bg: '#070B19',
  surface: '#111A33',
  text: '#EAF0FF',
  cyan: '#00F0FF',
  coral: '#FF3366',
  amber: '#FFB800',
  green: '#2BE38B',
};

export const smooth = Easing.bezier(0.25, 1, 0.5, 1);
export const whip = Easing.bezier(0.7, 0, 0.3, 1);

/** Safe area for all text: x [120,1800], y [80,1000]. */
export const SAFE = {left: 120, right: 120, top: 80, bottom: 80};

/** Buttery entrance: glide up + scale 0.95→1 + fade. */
export const useRise = (delay = 0, dist = 40) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: {damping: 200}});
  return {
    p,
    style: {
      opacity: p,
      transform: `translateY(${(1 - p) * dist}px) scale(${0.95 + 0.05 * p})`,
    } as React.CSSProperties,
  };
};

export const Rise: React.FC<{
  delay?: number;
  dist?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({delay = 0, dist = 40, style, children}) => {
  const {style: s} = useRise(delay, dist);
  return <div style={{...s, ...style}}>{children}</div>;
};

/** Linear 0→1 progress between two frames (eased, clamped). */
export const prog = (frame: number, from: number, to: number, easing = smooth) =>
  Math.min(1, Math.max(0, easing((frame - from) / Math.max(1, to - from))));

export const Backdrop: React.FC<{drift?: number}> = ({drift = 0.2}) => {
  const frame = useCurrentFrame();
  const d = frame * drift;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 30%, ${C.surface} 0%, ${C.bg} 70%)`}} />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.text}0d 1px, transparent 1px), linear-gradient(90deg, ${C.text}0d 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          backgroundPosition: `${d}px ${d * 0.5}px`,
          maskImage: 'radial-gradient(ellipse at 50% 45%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 45%, black 20%, transparent 80%)',
        }}
      />
    </AbsoluteFill>
  );
};

export const cardStyle: React.CSSProperties = {
  background: C.surface,
  borderRadius: 24,
  border: `1px solid ${C.text}1a`,
  boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
};

/**
 * Real footage wrapper: pure black canvas, 2.5% black margin on every side,
 * then a colourful (animated gradient) box that holds the footage.
 */
export const FramedBox: React.FC<{children: React.ReactNode; inset?: number; progress?: number}> = ({
  children,
  inset = 0.025,
  progress = 1,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const mx = width * inset;
  const my = height * inset;
  const angle = 135 + frame * 0.6;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div
        style={{
          position: 'absolute',
          left: mx,
          top: my,
          right: mx,
          bottom: my,
          borderRadius: 22,
          padding: 6,
          background: `linear-gradient(${angle}deg, ${C.cyan}, ${C.green}, ${C.amber}, ${C.coral}, ${C.cyan})`,
          boxShadow: `0 0 50px ${C.cyan}33, 0 0 90px ${C.coral}22`,
          opacity: progress,
          transform: `scale(${0.985 + 0.015 * progress})`,
        }}
      >
        <div style={{width: '100%', height: '100%', borderRadius: 16, overflow: 'hidden', background: '#0b0b0e', position: 'relative'}}>
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Stand-in shown where a render that doesn't exist yet will go. */
export const ClipPlaceholder: React.FC<{label: string; hint: string}> = ({label, hint}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `linear-gradient(135deg, ${C.surface}, ${C.bg})`, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', gap: 14, alignItems: 'flex-end', height: 260}}>
        {Array.from({length: 24}).map((_, i) => (
          <div
            key={i}
            style={{
              width: 22,
              height: 40 + 200 * (0.5 + 0.5 * Math.sin(i * 0.55 + frame * 0.2)) * (0.6 + 0.4 * Math.sin(frame * 0.07 + i)),
              borderRadius: 11,
              background: i % 2 ? C.cyan : C.green,
              opacity: 0.8,
            }}
          />
        ))}
      </div>
      <div style={{marginTop: 36, fontFamily: sans, fontWeight: 800, fontSize: 56, color: C.text, letterSpacing: 4}}>{label}</div>
      <div style={{marginTop: 10, fontFamily: mono, fontSize: 28, color: `${C.text}99`}}>{hint}</div>
    </AbsoluteFill>
  );
};

/** Blur / Redaction overlay patch to mask private info cleanly in screencasts */
export const BlurPatch: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius?: number;
  intensity?: number;
  style?: React.CSSProperties;
}> = ({x, y, width, height, borderRadius = 8, intensity = 20, style}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        borderRadius,
        backdropFilter: `blur(${intensity}px)`,
        WebkitBackdropFilter: `blur(${intensity}px)`,
        background: 'rgba(11, 14, 22, 0.88)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: 'inset 0 0 12px rgba(0, 0, 0, 0.5)',
        pointerEvents: 'none',
        zIndex: 10,
        ...style,
      }}
    />
  );
};

