import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {noise2D} from '@remotion/noise';
import {colors, fonts} from '../colors';
import {Bg} from '../components/Bg';
import {Scene} from '../components/Scene';

const X0 = 220;
const X1 = 1700;
const Y_TOP = 220;
const Y_BOT = 860;
const H = Y_BOT - Y_TOP;
const N = 140;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// both curves share one trend plus a little smooth noise, so the gap stays narrow
const capability = (t: number) => 0.13 + 0.79 * Math.pow(t, 1.25) + 0.035 * noise2D('cap', t * 4, 0);
const safety = (t: number) => capability(t) - 0.07 + 0.025 * noise2D('safe', t * 4, 3);
const px = (t: number) => X0 + t * (X1 - X0);
const py = (v: number) => Y_BOT - v * H;

const Chart: React.FC = () => {
  const frame = useCurrentFrame(); // composition runs at 60fps
  const p = interpolate(frame, [30, 360], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const label = interpolate(frame, [370, 400], [0, 1], clamp);
  const intro = interpolate(frame, [0, 24], [0, 1], clamp);

  const ts = Array.from({length: N + 1}, (_, i) => (i / N) * p);
  const capPts = ts.map((t) => `${px(t)},${py(capability(t))}`);
  const safePts = ts.map((t) => `${px(t)},${py(safety(t))}`);
  const area = `M ${capPts.join(' L ')} L ${[...safePts].reverse().join(' L ')} Z`;
  const capHead = [px(p), py(capability(p))];
  const safeHead = [px(p), py(safety(p))];

  return (
    <Bg y="60%">
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: intro}}>
        <line x1={X0} y1={Y_BOT} x2={X1 + 40} y2={Y_BOT} stroke={colors.white} strokeOpacity={0.5} strokeWidth={3} strokeLinecap="round" />
        <line x1={X0} y1={Y_TOP - 20} x2={X0} y2={Y_BOT} stroke={colors.white} strokeOpacity={0.25} strokeWidth={2} />
        {p > 0.002 && <path d={area} fill={colors.green} opacity={0.14} />}
        {p > 0.002 && <polyline points={capPts.join(' ')} fill="none" stroke={colors.cyan} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />}
        {p > 0.002 && <polyline points={safePts.join(' ')} fill="none" stroke={colors.amber} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />}
        {p > 0.002 && (
          <>
            <circle cx={capHead[0]} cy={capHead[1]} r={13} fill={colors.cyan} style={{filter: `drop-shadow(0 0 10px ${colors.cyan})`}} />
            <circle cx={safeHead[0]} cy={safeHead[1]} r={13} fill={colors.amber} style={{filter: `drop-shadow(0 0 10px ${colors.amber})`}} />
          </>
        )}
      </svg>
      <div style={{position: 'absolute', left: X1 - 20, top: Y_BOT + 18, fontFamily: fonts.mono, fontWeight: 700, fontSize: 26, letterSpacing: 5, color: colors.white, opacity: 0.7 * intro}}>TIME</div>
      <div style={{position: 'absolute', left: X0, top: 90, display: 'flex', gap: 56, fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, letterSpacing: 3, opacity: intro}}>
        <span style={{color: colors.cyan}}>━ MODEL CAPABILITY</span>
        <span style={{color: colors.amber}}>━ SAFETY ARCHITECTURE</span>
      </div>
      <div
        style={{
          position: 'absolute',
          right: 220,
          top: 160,
          fontFamily: fonts.mono,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: 4,
          color: colors.green,
          opacity: label,
          transform: `translateY(${(1 - label) * 14}px)`,
        }}
      >
        ADVANCING TOGETHER
      </div>
    </Bg>
  );
};

export const SynchronizedGears: React.FC<{durationInFrames?: number}> = ({durationInFrames = 420}) => (
  <Scene durationInFrames={durationInFrames}>
    <Chart />
  </Scene>
);
