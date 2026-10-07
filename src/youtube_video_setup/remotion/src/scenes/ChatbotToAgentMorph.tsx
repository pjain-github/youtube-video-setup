import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CreditCard, Folder, Globe, Terminal} from 'lucide-react';
import {colors, fonts} from '../colors';
import {Bg} from '../components/Bg';
import {Scene} from '../components/Scene';
import {Typewriter} from '../components/Typewriter';

const CX = 960;
const CY = 540;
const DIST = 320;
const TOOLS = [
  {Icon: Terminal, dx: 0, dy: -1},
  {Icon: Globe, dx: 1, dy: 0},
  {Icon: CreditCard, dx: 0, dy: 1},
  {Icon: Folder, dx: -1, dy: 0},
];

const Morph: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({fps, frame, config: {damping: 14, stiffness: 90}});
  const shrink = spring({fps, frame: frame - 60, config: {damping: 16, stiffness: 90}});
  const scale = 1 - 0.6 * shrink;
  const glow = 22 + 14 * Math.sin(frame / 8);
  const ringOpacity = interpolate(frame, [110, 130], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <Bg>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {TOOLS.map((t, i) => {
          const start = 66 + i * 6;
          const p = interpolate(frame, [start, start + 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          const startOff = t.dx !== 0 ? 190 : 40; // begin at the bar's edge
          const len = DIST - 55 - startOff;
          return (
            <line
              key={i}
              x1={CX + t.dx * startOff}
              y1={CY + t.dy * startOff}
              x2={CX + t.dx * (startOff + len)}
              y2={CY + t.dy * (startOff + len)}
              stroke={colors.cyan}
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={len}
              strokeDashoffset={len * (1 - p)}
              opacity={0.7}
            />
          );
        })}
        <circle
          cx={CX}
          cy={CY}
          r={235}
          fill="none"
          stroke={colors.cyan}
          strokeWidth={2}
          strokeDasharray="14 16"
          opacity={ringOpacity * 0.6}
          transform={`rotate(${frame * 1.2} ${CX} ${CY})`}
        />
      </svg>

      {/* chat bar -> hub core */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            width: 900,
            height: 110,
            borderRadius: 55,
            background: colors.surface,
            border: `3px solid ${colors.cyan}`,
            boxShadow: `0 0 ${glow}px ${colors.cyan}88`,
            display: 'flex',
            alignItems: 'center',
            padding: '0 44px',
            fontSize: 34,
            color: colors.white,
            transform: `scale(${scale * enter})`,
            opacity: enter,
          }}
        >
          <span style={{opacity: 0.55}}>
            <Typewriter text="Type a message..." delay={8} speed={1.5} />
          </span>
          <span
            style={{
              width: 3,
              height: 44,
              marginLeft: 6,
              background: colors.cyan,
              opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0,
            }}
          />
        </div>
      </AbsoluteFill>

      {TOOLS.map((t, i) => {
        const land = 72 + i * 6;
        const sp = spring({fps, frame: frame - land, config: {damping: 12, stiffness: 100}});
        const pulse = interpolate(frame, [land + 18, land + 24, land + 32], [1, 1.18, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const Icon = t.Icon;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: CX + t.dx * DIST * sp - 55,
              top: CY + t.dy * DIST * sp - 55,
              width: 110,
              height: 110,
              borderRadius: 28,
              background: colors.surface,
              border: `3px solid ${colors.cyan}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: Math.min(1, sp * 2),
              transform: `scale(${pulse})`,
            }}
          >
            <Icon size={54} color={colors.cyan} strokeWidth={2} strokeLinecap="round" />
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 940,
          textAlign: 'center',
          fontFamily: fonts.mono,
          fontSize: 26,
          letterSpacing: 6,
          color: colors.cyan,
          opacity: interpolate(frame, [120, 140], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        }}
      >
        AGENT
      </div>
    </Bg>
  );
};

export const ChatbotToAgentMorph: React.FC<{durationInFrames?: number}> = ({durationInFrames = 180}) => (
  <Scene durationInFrames={durationInFrames}>
    <Morph />
  </Scene>
);
