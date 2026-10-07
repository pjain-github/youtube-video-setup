import React from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {colors, fonts} from '../colors';
import {Bg} from '../components/Bg';
import {Scene} from '../components/Scene';

const N = 6;
const CELL_W = 140;
const CELL_H = 78;
const GRID_W = N * CELL_W;
const GRID_H = N * CELL_H;
const PULSE_COL = 3;

const Matrix: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const tick = Math.floor(frame / 3);
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.15], {extrapolateRight: 'clamp'});
  const intro = interpolate(frame, [0, 18], [0, 1], {extrapolateRight: 'clamp'});
  const sweep = interpolate(frame, [30, durationInFrames - 30], [0, N], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const hotRow = Math.min(N - 1, Math.floor(sweep));
  const colPulse = 0.08 + 0.1 * (0.5 + 0.5 * Math.sin(frame / 9));
  const bracket: React.CSSProperties = {
    width: 34,
    height: GRID_H + 24,
    borderTop: `6px solid ${colors.white}`,
    borderBottom: `6px solid ${colors.white}`,
    opacity: 0.8,
  };

  return (
    <Bg>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: '50% 50%', opacity: intro}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 130, textAlign: 'center', fontFamily: fonts.mono, fontSize: 76, fontWeight: 700, color: colors.white}}>
          y = σ(Wx + b)
        </div>
        <div style={{position: 'absolute', left: 960 - GRID_W / 2 - 60, top: 540 - GRID_H / 2 + 50 - 12, display: 'flex'}}>
          <div style={{...bracket, borderLeft: `6px solid ${colors.white}`}} />
        </div>
        <div style={{position: 'absolute', left: 960 + GRID_W / 2 + 60 - 34, top: 540 - GRID_H / 2 + 50 - 12}}>
          <div style={{...bracket, borderRight: `6px solid ${colors.white}`}} />
        </div>
        <div style={{position: 'absolute', left: 960 - GRID_W / 2, top: 540 - GRID_H / 2 + 50, width: GRID_W, height: GRID_H}}>
          {/* pulsing column + sweeping row highlights */}
          <div style={{position: 'absolute', left: PULSE_COL * CELL_W, top: 0, width: CELL_W, height: GRID_H, background: `rgba(0,240,255,${colPulse})`}} />
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: hotRow * CELL_H,
              width: GRID_W,
              height: CELL_H,
              background: `${colors.cyan}2e`,
              borderTop: `2px solid ${colors.cyan}`,
              borderBottom: `2px solid ${colors.cyan}`,
              opacity: frame >= 30 && frame < durationInFrames - 20 ? 1 : 0,
            }}
          />
          {Array.from({length: N * N}).map((_, i) => {
            const r = Math.floor(i / N);
            const c = i % N;
            const v = (random(`m-${tick}-${i}`) * 2 - 1).toFixed(2);
            const hot = r === hotRow && frame >= 30 && frame < durationInFrames - 20;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: c * CELL_W,
                  top: r * CELL_H,
                  width: CELL_W,
                  height: CELL_H,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: fonts.mono,
                  fontSize: 38,
                  color: hot ? colors.cyan : colors.white,
                  opacity: hot ? 1 : 0.55,
                }}
              >
                {v}
              </div>
            );
          })}
        </div>
      </div>
    </Bg>
  );
};

export const ColdMathMatrix: React.FC<{durationInFrames?: number}> = ({durationInFrames = 270}) => (
  <Scene durationInFrames={durationInFrames}>
    <Matrix durationInFrames={durationInFrames} />
  </Scene>
);
