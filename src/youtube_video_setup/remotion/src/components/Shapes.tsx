import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Circle, Rect, Star, Triangle} from '@remotion/shapes';
import {theme} from '../config';
import {springIn, springs} from '../utils/animation';

type Kind = 'circle' | 'rect' | 'star' | 'triangle';

type Props = {
  kind: Kind;
  size?: number;
  color?: string;
  x: number; // px from center
  y: number;
  delay?: number;
  spin?: number; // degrees per second
};

/** Popping, gently floating/rotating shape positioned relative to frame center. */
export const FloatingShape: React.FC<Props> = ({
  kind,
  size = 140,
  color = theme.primary,
  x,
  y,
  delay = 0,
  spin = 20,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = springIn(frame, fps, delay, springs.bouncy);
  const bob = Math.sin((frame + delay * 5) / 18) * 14;
  const rot = (frame / fps) * spin;
  const common = {fill: color};
  const shape =
    kind === 'circle' ? (
      <Circle radius={size / 2} {...common} />
    ) : kind === 'rect' ? (
      <Rect width={size} height={size} cornerRadius={size * 0.2} {...common} />
    ) : kind === 'star' ? (
      <Star innerRadius={size * 0.25} outerRadius={size * 0.5} points={5} {...common} />
    ) : (
      <Triangle length={size} direction="up" cornerRadius={8} {...common} />
    );
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y + bob}px)) scale(${p}) rotate(${rot}deg)`,
        opacity: p,
        filter: `drop-shadow(0 20px 30px ${color}55)`,
      }}
    >
      {shape}
    </div>
  );
};

/** Horizontal bar that grows in with a spring. */
export const GrowBar: React.FC<{width: number; height?: number; color?: string; delay?: number}> = ({
  width,
  height = 12,
  color = theme.secondary,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = springIn(frame, fps, delay);
  return <div style={{width: width * p, height, borderRadius: height, background: color}} />;
};
