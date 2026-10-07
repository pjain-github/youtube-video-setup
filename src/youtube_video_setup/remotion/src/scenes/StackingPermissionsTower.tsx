import React from 'react';
import {interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Database, Globe, Rocket, Terminal, Wallet} from 'lucide-react';
import {colors, fonts} from '../colors';
import {Bg} from '../components/Bg';
import {Scene} from '../components/Scene';

const BLOCKS = [
  {label: 'BROWSER', Icon: Globe},
  {label: 'BASH', Icon: Terminal},
  {label: 'MEMORY', Icon: Database},
  {label: 'WALLET', Icon: Wallet},
  {label: 'PROD_DEPLOY', Icon: Rocket},
];
const W = 560;
const H = 108;
const GAP = 10;
const BASE_Y = 930;
const PIVOT_X = 960;
const DROP_AT = (i: number) => 14 + i * 52;
const LAND_AT = (i: number) => DROP_AT(i) + 20;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Tower: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // each landing adds 1 degree of lean and nudges the base sideways
  const landed = BLOCKS.reduce((s, _, i) => s + interpolate(frame, [LAND_AT(i), LAND_AT(i) + 14], [0, 1], clamp), 0);
  const rot = landed * 1;
  const shift = landed * 7;
  const lastLand = LAND_AT(BLOCKS.length - 1) + 6;
  const crack = interpolate(frame, [lastLand, lastLand + 14], [0, 1], clamp);
  const dust = frame - lastLand;

  return (
    <Bg y="75%">
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <line x1={420} y1={BASE_Y + 4} x2={1500} y2={BASE_Y + 4} stroke={colors.white} strokeWidth={3} opacity={0.4} strokeLinecap="round" />
        {/* crack at the base */}
        <polyline
          points={`${PIVOT_X - 60},${BASE_Y + 4} ${PIVOT_X - 36},${BASE_Y + 30} ${PIVOT_X - 52},${BASE_Y + 52} ${PIVOT_X - 10},${BASE_Y + 78}`}
          fill="none"
          stroke={colors.coral}
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={140}
          strokeDashoffset={140 * (1 - crack)}
        />
        {/* dust puff */}
        {dust >= 0 &&
          Array.from({length: 10}).map((_, i) => {
            const a = Math.PI + (random(`d${i}`) * Math.PI);
            const t = Math.min(1, dust / 36);
            const d = 30 + 90 * t * (0.5 + random(`dd${i}`));
            return <circle key={i} cx={PIVOT_X + 100 + Math.cos(a) * d * 1.2} cy={BASE_Y - 10 + Math.sin(a) * d * 0.5} r={8 + 12 * t} fill={colors.white} opacity={(1 - t) * 0.35} />;
          })}
      </svg>
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${shift}px) rotate(${rot}deg)`, transformOrigin: `${PIVOT_X}px ${BASE_Y}px`}}>
        {BLOCKS.map((b, i) => {
          const sp = spring({fps, frame: frame - DROP_AT(i), config: {damping: 9, stiffness: 110}});
          const y = BASE_Y - (i + 1) * H - i * GAP;
          const Icon = b.Icon;
          const top = i === BLOCKS.length - 1;
          return (
            <div
              key={b.label}
              style={{
                position: 'absolute',
                left: PIVOT_X - W / 2,
                top: y,
                width: W,
                height: H,
                borderRadius: 24,
                background: colors.surface,
                border: `3px solid ${top ? colors.amber : colors.cyan}`,
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                padding: '0 40px',
                opacity: frame < DROP_AT(i) ? 0 : 1,
                transform: `translateY(${(1 - sp) * -(y + 200)}px)`,
              }}
            >
              <Icon size={48} color={top ? colors.amber : colors.cyan} strokeWidth={2} strokeLinecap="round" />
              <span style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 40, letterSpacing: 3, color: top ? colors.amber : colors.white}}>{b.label}</span>
            </div>
          );
        })}
      </div>
    </Bg>
  );
};

export const StackingPermissionsTower: React.FC<{durationInFrames?: number}> = ({durationInFrames = 330}) => (
  <Scene durationInFrames={durationInFrames}>
    <Tower />
  </Scene>
);
