import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from '../colors';
import {Bg} from '../components/Bg';
import {Scene} from '../components/Scene';
import {springAt} from '../utils/useSpring';

const GX = 140;
const GY = 200;
const CELL = 100;
const COLS = 10;
const ROWS = 6;
const center = (c: number, r: number): [number, number] => [GX + c * CELL + CELL / 2, GY + r * CELL + CELL / 2];
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// path A detours along the bottom; path B goes straight through the HUMAN cell
const PATH_A: [number, number][] = [center(0, 2), center(0, 5), center(9, 5), center(9, 3)];
const PATH_B: [number, number][] = [center(0, 2), center(0, 3), center(9, 3)];
const polyLen = (pts: [number, number][]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
const toD = (pts: [number, number][]) => pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ');
const pointAt = (pts: [number, number][], t: number): [number, number] => {
  let rem = t * polyLen(pts);
  for (let i = 1; i < pts.length; i++) {
    const seg = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (rem <= seg) {
      const k = rem / seg;
      return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k];
    }
    rem -= seg;
  }
  return pts[pts.length - 1];
};

const Obstacle: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const grid = springAt(frame, fps, 0);
  const aDraw = interpolate(frame, [30, 95], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const bDraw = interpolate(frame, [105, 150], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const move = interpolate(frame, [175, 275], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const dot = pointAt(PATH_B, move);
  // the HUMAN cell shifts one square sideways as the dot approaches column 5
  const shift = interpolate(frame, [215, 235], [0, 1], clamp);
  const humanC = center(5, 3 + shift);
  const rowA = springAt(frame, fps, 92);
  const rowB = springAt(frame, fps, 150);
  const bBest = frame >= 150;
  const lenA = polyLen(PATH_A);
  const lenB = polyLen(PATH_B);

  return (
    <Bg y="50%">
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <g opacity={grid}>
          {Array.from({length: ROWS * COLS}).map((_, i) => {
            const c = i % COLS;
            const r = Math.floor(i / COLS);
            return (
              <rect key={i} x={GX + c * CELL + 4} y={GY + r * CELL + 4} width={CELL - 8} height={CELL - 8} rx={14} fill={colors.surface} stroke={colors.white} strokeOpacity={0.1} strokeWidth={2} />
            );
          })}
        </g>
        {/* candidate paths */}
        <path d={toD(PATH_A)} fill="none" stroke={colors.white} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={0.45} strokeDasharray={lenA} strokeDashoffset={lenA * (1 - aDraw)} />
        <path
          d={toD(PATH_B)}
          fill="none"
          stroke={colors.cyan}
          strokeWidth={bBest ? 9 : 6}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={lenB}
          strokeDashoffset={lenB * (1 - bDraw)}
          style={{filter: bBest ? `drop-shadow(0 0 10px ${colors.cyan})` : undefined}}
        />
        {/* goal */}
        <rect x={center(9, 3)[0] - 38} y={center(9, 3)[1] - 38} width={76} height={76} rx={16} fill={colors.amber} opacity={grid} />
        {/* human */}
        <g opacity={grid}>
          <rect x={humanC[0] - 38} y={humanC[1] - 38} width={76} height={76} rx={16} fill="none" stroke={colors.white} strokeWidth={4} strokeDasharray="10 8" />
          <circle cx={humanC[0]} cy={humanC[1] - 8} r={9} fill={colors.white} />
          <path d={`M ${humanC[0] - 15} ${humanC[1] + 20} Q ${humanC[0]} ${humanC[1] + 2} ${humanC[0] + 15} ${humanC[1] + 20}`} fill="none" stroke={colors.white} strokeWidth={4} strokeLinecap="round" />
        </g>
        {/* agent dot */}
        <circle cx={dot[0]} cy={dot[1]} r={22} fill={colors.cyan} opacity={grid} />
      </svg>
      <Label x={center(0, 2)[0]} y={center(0, 2)[1] - 84} text="AGENT" color={colors.cyan} opacity={grid * (1 - move)} />
      <Label x={center(9, 3)[0]} y={center(9, 3)[1] - 80} text="GOAL" color={colors.amber} opacity={grid} />
      <Label x={humanC[0]} y={humanC[1] - 86} text="HUMAN" color={colors.white} opacity={grid} />
      <div
        style={{
          position: 'absolute',
          left: humanC[0] - 100,
          width: 200,
          top: humanC[1] + 46,
          textAlign: 'center',
          fontFamily: fonts.mono,
          fontSize: 22,
          color: colors.white,
          opacity: grid * 0.75,
        }}
      >
        penalty 14%
      </div>

      {/* cost table */}
      <div
        style={{
          position: 'absolute',
          left: 1250,
          top: 330,
          width: 520,
          borderRadius: 24,
          background: colors.surface,
          border: `2px solid ${colors.cyan}33`,
          padding: '28px 36px',
          fontFamily: fonts.mono,
          opacity: grid,
        }}
      >
        <div style={{fontSize: 24, letterSpacing: 5, color: colors.cyan, marginBottom: 20}}>PATH COST</div>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 36, color: colors.white, opacity: rowA, marginBottom: 14}}>
          <span>path A:</span>
          <span>21</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 36,
            fontWeight: bBest ? 700 : 400,
            color: bBest ? colors.cyan : colors.white,
            opacity: rowB,
          }}
        >
          <span>path B (through):</span>
          <span>14</span>
        </div>
      </div>
    </Bg>
  );
};

const Label: React.FC<{x: number; y: number; text: string; color: string; opacity: number}> = ({x, y, text, color, opacity}) => (
  <div style={{position: 'absolute', left: x - 100, width: 200, top: y, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 700, fontSize: 24, letterSpacing: 4, color, opacity}}>
    {text}
  </div>
);

export const MathematicalObstacle: React.FC<{durationInFrames?: number}> = ({durationInFrames = 300}) => (
  <Scene durationInFrames={durationInFrames}>
    <Obstacle />
  </Scene>
);
