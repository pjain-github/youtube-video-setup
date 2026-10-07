import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {BrainCircuit, Database, Hash, KeyRound, Wrench} from 'lucide-react';
import {colors, fonts} from '../colors';
import {Bg} from '../components/Bg';
import {Scene} from '../components/Scene';
import {useSpring} from '../utils/useSpring';

const NODE_W = 380;
const NODE_H = 120;
const NODES = [
  {label: 'MEMORY_STORE', Icon: Database, x: 960, y: 150, from: [960, 430], to: [960, 210]},
  {label: 'TOOL_EXECUTION', Icon: Wrench, x: 1530, y: 540, from: [1070, 540], to: [1340, 540]},
  {label: 'CREDENTIAL_VAULT', Icon: KeyRound, x: 960, y: 930, from: [960, 650], to: [960, 870]},
  {label: 'STEP_COUNTER', Icon: Hash, x: 390, y: 540, from: [850, 540], to: [580, 540]},
];
const DELAYS = [20, 90, 160, 230];

const Grid: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const center = useSpring(0);
  const s0 = useSpring(DELAYS[0]);
  const s1 = useSpring(DELAYS[1]);
  const s2 = useSpring(DELAYS[2]);
  const s3 = useSpring(DELAYS[3]);
  const springs = [s0, s1, s2, s3];
  const steps = Math.floor(interpolate(frame, [0, durationInFrames], [0, 300], {extrapolateRight: 'clamp'}));

  return (
    <Bg>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {NODES.map((n, i) => {
          const lineP = interpolate(frame, [DELAYS[i] + 6, DELAYS[i] + 30], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const [x1, y1] = n.from;
          const [x2, y2] = n.to;
          const t = (((frame - DELAYS[i] - 30 + i * 12) % 50) + 50) % 50 / 50;
          const tt = i % 2 === 0 ? t : 1 - t;
          return (
            <g key={i}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={colors.cyan}
                strokeWidth={3}
                strokeLinecap="round"
                opacity={0.55}
                strokeDasharray={Math.hypot(x2 - x1, y2 - y1)}
                strokeDashoffset={Math.hypot(x2 - x1, y2 - y1) * (1 - lineP)}
              />
              {frame > DELAYS[i] + 30 && (
                <circle cx={x1 + (x2 - x1) * tt} cy={y1 + (y2 - y1) * tt} r={8} fill={colors.cyan} />
              )}
            </g>
          );
        })}
      </svg>

      <div
        style={{
          position: 'absolute',
          left: 960 - 110,
          top: 540 - 110,
          width: 220,
          height: 220,
          borderRadius: 110,
          background: colors.surface,
          border: `3px solid ${colors.cyan}`,
          boxShadow: `0 0 40px ${colors.cyan}55`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          transform: `scale(${center})`,
        }}
      >
        <BrainCircuit size={80} color={colors.cyan} strokeWidth={2} strokeLinecap="round" />
        <div style={{fontFamily: fonts.mono, fontSize: 22, fontWeight: 700, color: colors.white, letterSpacing: 2}}>AGENT_LOOP</div>
      </div>

      {NODES.map((n, i) => {
        const Icon = n.Icon;
        const isCounter = n.label === 'STEP_COUNTER';
        return (
          <div
            key={n.label}
            style={{
              position: 'absolute',
              left: n.x - NODE_W / 2,
              top: n.y - NODE_H / 2,
              width: NODE_W,
              height: NODE_H,
              borderRadius: 24,
              background: colors.surface,
              border: `2px solid ${colors.cyan}66`,
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              padding: '0 28px',
              transform: `scale(${springs[i]})`,
              opacity: Math.min(1, springs[i] * 2),
            }}
          >
            <Icon size={44} color={colors.cyan} strokeWidth={2} strokeLinecap="round" />
            <div>
              <div style={{fontFamily: fonts.mono, fontSize: 26, fontWeight: 700, color: colors.white}}>{n.label}</div>
              {isCounter && (
                <div style={{fontFamily: fonts.mono, fontSize: 40, fontWeight: 700, color: colors.cyan}}>{steps}</div>
              )}
            </div>
          </div>
        );
      })}
    </Bg>
  );
};

export const AgentArchitectureGrid: React.FC<{durationInFrames?: number}> = ({durationInFrames = 420}) => (
  <Scene durationInFrames={durationInFrames}>
    <Grid durationInFrames={durationInFrames} />
  </Scene>
);
