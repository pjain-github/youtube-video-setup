import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from '../colors';
import {Bg} from '../components/Bg';
import {Scene} from '../components/Scene';
import {springAt} from '../utils/useSpring';

const CARD_W = 820;
const CARD_H = 640;
const CARD_TOP = 130;
const CELL = 70;
const BOARD = CELL * 6;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Card: React.FC<{left: number; title: string; enterAt: number; children: React.ReactNode}> = ({left, title, enterAt, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = springAt(frame, fps, enterAt);
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: CARD_TOP,
        width: CARD_W,
        height: CARD_H,
        borderRadius: 32,
        background: colors.surface,
        border: `2px solid ${colors.cyan}33`,
        padding: '34px 50px',
        opacity: p,
        transform: `translateY(${(1 - p) * 40}px)`,
      }}
    >
      <div style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 34, letterSpacing: 5, color: colors.cyan, marginBottom: 28}}>{title}</div>
      {children}
    </div>
  );
};

// nav graph (card-local coordinates, svg is 720x400)
const NODES: Record<string, [number, number]> = {
  A: [60, 300],
  B: [190, 100],
  C: [330, 300],
  D: [470, 100],
  F: [470, 300],
  E: [650, 300],
};
const EDGES = [['A', 'B'], ['B', 'D'], ['A', 'C'], ['C', 'F'], ['F', 'E'], ['C', 'D'], ['D', 'E']];
const pathOf = (ids: string[]) => ids.map((id, i) => `${i ? 'L' : 'M'} ${NODES[id][0]} ${NODES[id][1]}`).join(' ');

const Analogy: React.FC = () => {
  const frame = useCurrentFrame();
  const evalVal = interpolate(frame, [78, 112], [3.1, 4.8], clamp);
  const pawn = interpolate(frame, [70, 88], [0, 1], clamp);
  const bottomDraw = frame < 80 ? interpolate(frame, [20, 60], [0, 1], clamp) : interpolate(frame, [80, 100], [1, 0], clamp);
  const topDraw = interpolate(frame, [96, 142], [0, 1], clamp);
  const closed = interpolate(frame, [66, 76], [0, 1], clamp);
  const caption = interpolate(frame, [170, 195], [0, 1], clamp);
  const fill = 0.5 + evalVal / 16;
  const qPos = {r: 3, c: 3};
  const pawnRow = 5 - pawn; // moves forward one square, ending directly below the queen

  return (
    <Bg>
      {/* left: chess */}
      <Card left={100} title="CHESS ENGINE" enterAt={4}>
        <div style={{display: 'flex', gap: 36, alignItems: 'flex-start', paddingLeft: 40}}>
          <div style={{position: 'relative', width: BOARD, height: BOARD, borderRadius: 12, overflow: 'hidden'}}>
            {Array.from({length: 36}).map((_, i) => {
              const r = Math.floor(i / 6);
              const c = i % 6;
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: c * CELL,
                    top: r * CELL,
                    width: CELL,
                    height: CELL,
                    background: (r + c) % 2 === 0 ? colors.bg : '#1b2748',
                  }}
                />
              );
            })}
            <div style={{position: 'absolute', left: qPos.c * CELL, top: qPos.r * CELL, width: CELL, height: CELL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 58, color: colors.cyan, fontFamily: 'DejaVu Sans, Segoe UI Symbol, sans-serif'}}>
              ♛
            </div>
            <div style={{position: 'absolute', left: 3 * CELL, top: pawnRow * CELL, width: CELL, height: CELL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 58, color: colors.white, fontFamily: 'DejaVu Sans, Segoe UI Symbol, sans-serif'}}>
              ♟
            </div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
            <div style={{position: 'relative', width: 44, height: BOARD, borderRadius: 22, background: colors.bg, overflow: 'hidden'}}>
              <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${fill * 100}%`, background: colors.cyan}} />
            </div>
          </div>
        </div>
        <div style={{marginTop: 22, paddingLeft: 40, fontFamily: fonts.mono, fontSize: 40, fontWeight: 700, color: colors.white}}>
          eval <span style={{color: colors.cyan}}>+{evalVal.toFixed(1)}</span>
        </div>
      </Card>

      {/* right: navigation */}
      <Card left={1000} title="NAVIGATION" enterAt={14}>
        <svg width={720} height={400} style={{overflow: 'visible'}}>
          {EDGES.map(([a, b]) => (
            <line
              key={a + b}
              x1={NODES[a][0]}
              y1={NODES[a][1]}
              x2={NODES[b][0]}
              y2={NODES[b][1]}
              stroke={colors.white}
              strokeWidth={8}
              strokeLinecap="round"
              opacity={0.22}
            />
          ))}
          <path d={pathOf(['A', 'C', 'F', 'E'])} fill="none" stroke={colors.cyan} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - bottomDraw} />
          <path d={pathOf(['A', 'B', 'D', 'E'])} fill="none" stroke={colors.cyan} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - topDraw} />
          {/* closed edge C-F */}
          <g opacity={closed}>
            <line x1={NODES.C[0]} y1={NODES.C[1]} x2={NODES.F[0]} y2={NODES.F[1]} stroke={colors.coral} strokeWidth={8} strokeLinecap="round" />
            <text x={400} y={262} textAnchor="middle" fontFamily={fonts.mono} fontWeight={700} fontSize={26} letterSpacing={3} fill={colors.coral}>
              CLOSED
            </text>
          </g>
          {Object.entries(NODES).map(([id, [x, y]]) => (
            <circle key={id} cx={x} cy={y} r={20} fill={colors.bg} stroke={id === 'A' || id === 'E' ? colors.cyan : colors.white} strokeWidth={5} />
          ))}
        </svg>
      </Card>

      <div style={{position: 'absolute', left: 0, right: 0, top: 850, textAlign: 'center', fontSize: 52, fontWeight: 600, color: colors.white, opacity: caption, transform: `translateY(${(1 - caption) * 16}px)`}}>
        No feelings. Just optimization.
      </div>
    </Bg>
  );
};

export const ChessAndNavAnalogy: React.FC<{durationInFrames?: number}> = ({durationInFrames = 270}) => (
  <Scene durationInFrames={durationInFrames}>
    <Analogy />
  </Scene>
);
