import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from '../colors';
import {Bg} from '../components/Bg';
import {Scene} from '../components/Scene';
import {springAt} from '../utils/useSpring';

const BOX_W = 1320;
const BOX_H = 150;
const GAP = 110;
const TOP0 = 175;
const BOXES = [
  {label: 'PRIMARY GOAL:', text: 'Maximize benchmark score', at: 10},
  {label: 'IF SHUTDOWN:', text: 'completion = 0', at: 70},
  {label: 'SUB-GOAL:', text: 'Avoid shutdown', at: 140},
];
const ARROWS = [
  {from: 50, to: 70},
  {from: 120, to: 140},
];
const boxTop = (i: number) => TOP0 + i * (BOX_H + GAP);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Tree: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const active = frame < 70 ? 0 : frame < 140 ? 1 : 2;

  return (
    <Bg y="50%">
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {ARROWS.map((a, i) => {
          const p = interpolate(frame, [a.from, a.to + 14], [0, 1], clamp);
          const y1 = boxTop(i) + BOX_H;
          const y2 = boxTop(i + 1);
          const len = y2 - y1;
          return (
            <g key={i} opacity={0.9}>
              <line x1={960} y1={y1} x2={960} y2={y2 - 6} stroke={colors.white} strokeWidth={4} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} opacity={0.6} />
              <path d={`M ${960 - 16} ${y2 - 24} L 960 ${y2 - 4} L ${960 + 16} ${y2 - 24}`} fill="none" stroke={colors.white} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" opacity={0.6 * p} />
            </g>
          );
        })}
      </svg>
      {BOXES.map((b, i) => {
        const p = springAt(frame, fps, b.at);
        const isLast = i === 2;
        const isActive = active === i;
        const accent = isLast && frame >= b.at ? colors.amber : colors.cyan;
        const glow = isActive || (isLast && frame >= b.at);
        return (
          <div
            key={b.label}
            style={{
              position: 'absolute',
              left: 960 - BOX_W / 2,
              top: boxTop(i),
              width: BOX_W,
              height: BOX_H,
              borderRadius: 28,
              background: isLast && frame >= b.at ? `${colors.amber}1a` : colors.surface,
              border: `3px solid ${glow ? accent : colors.white + '2a'}`,
              boxShadow: glow ? `0 0 ${26 + 8 * Math.sin(frame / 10)}px ${accent}77` : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 28,
              padding: '0 56px',
              fontFamily: fonts.mono,
              opacity: p,
              transform: `translateX(${(1 - p) * -120}px)`,
            }}
          >
            <span style={{whiteSpace: 'nowrap', fontSize: 30, letterSpacing: 4, fontWeight: 700, color: glow ? accent : colors.white, opacity: glow ? 1 : 0.6}}>{b.label}</span>
            <span style={{whiteSpace: 'nowrap', fontSize: 50, fontWeight: 700, color: isLast && frame >= b.at ? colors.amber : colors.white}}>{b.text}</span>
          </div>
        );
      })}
    </Bg>
  );
};

export const InstrumentalSubgoalTree: React.FC<{durationInFrames?: number}> = ({durationInFrames = 270}) => (
  <Scene durationInFrames={durationInFrames}>
    <Tree />
  </Scene>
);
