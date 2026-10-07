import React from 'react';
import {interpolate, interpolateColors, random, useCurrentFrame} from 'remotion';
import {colors, fonts} from '../colors';
import {Bg} from '../components/Bg';
import {Scene} from '../components/Scene';
import {useSpring} from '../utils/useSpring';

const STAGES = ['Sentence', 'Plan', 'Code', 'Action', 'Real World'];
const CARD_W = 760;
const CARD_H = 160;
const GAP = 80;
const PAD = 100;
const FLIP = 25;
const T0 = 20;
const cardTop = (i: number) => PAD + i * (CARD_H + GAP);
const CONTENT_H = PAD * 2 + 5 * CARD_H + 4 * GAP;

const Cascade: React.FC = () => {
  const frame = useCurrentFrame();
  const flipStart = (i: number) => T0 + i * FLIP;

  // camera follows the card that is currently flipping
  const centers = STAGES.map((_, i) => cardTop(i) + CARD_H / 2);
  const focus = interpolate(frame, STAGES.map((_, i) => flipStart(i)), centers, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const maxShift = CONTENT_H - 1080;
  const shift = Math.max(0, Math.min(maxShift, focus - 540));

  // shake on each flip
  let shake = 0;
  STAGES.forEach((_, i) => {
    const f = frame - flipStart(i);
    if (f >= 0 && f < 10) {
      const amp = 8 * (1 - f / 10);
      shake += (random(`sx${frame}`) * 2 - 1) * amp;
    }
  });

  return (
    <Bg y="40%" color={colors.coral}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: CONTENT_H, transform: `translate(${shake}px, ${-shift}px)`}}>
        <svg width={1920} height={CONTENT_H} style={{position: 'absolute', inset: 0}}>
          {STAGES.slice(0, -1).map((_, i) => {
            const y1 = cardTop(i) + CARD_H;
            const y2 = cardTop(i + 1);
            const p = interpolate(frame, [flipStart(i) + 8, flipStart(i) + FLIP + 6], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <g key={i}>
                <line x1={960} y1={y1} x2={960} y2={y2} stroke={colors.white} strokeWidth={3} strokeLinecap="round" opacity={0.25} />
                {p > 0 && p < 1 && <circle cx={960} cy={y1 + (y2 - y1) * p} r={10} fill={colors.coral} />}
              </g>
            );
          })}
        </svg>
        {STAGES.map((label, i) => {
          const enter = useSpring(i * 4);
          const color = interpolateColors(
            frame,
            [flipStart(i), flipStart(i) + 12, flipStart(i) + FLIP],
            [colors.green, colors.amber, colors.coral],
          );
          return (
            <div
              key={label}
              style={{
                position: 'absolute',
                left: 960 - CARD_W / 2,
                top: cardTop(i),
                width: CARD_W,
                height: CARD_H,
                borderRadius: 32,
                background: colors.surface,
                border: `4px solid ${color}`,
                display: 'flex',
                alignItems: 'center',
                padding: '0 48px',
                gap: 28,
                opacity: enter,
                transform: `scale(${0.9 + 0.1 * enter})`,
              }}
            >
              <div style={{width: 26, height: 26, borderRadius: 13, background: color}} />
              <div style={{fontSize: 52, fontWeight: 600, color: colors.white}}>{label}</div>
              {i === 0 && (
                <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12, fontFamily: fonts.mono, fontSize: 26, color: colors.coral}}>
                  <div style={{width: 12, height: 12, borderRadius: 6, background: colors.coral}} />
                  assumption
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Bg>
  );
};

export const ErrorCascadeEffect: React.FC<{durationInFrames?: number}> = ({durationInFrames = 210}) => (
  <Scene durationInFrames={durationInFrames}>
    <Cascade />
  </Scene>
);
