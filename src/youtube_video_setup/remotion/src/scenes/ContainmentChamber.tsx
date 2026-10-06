import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Server} from 'lucide-react';
import {colors, fonts} from '../colors';
import {Logo} from '../components/Logo';
import {Typewriter} from '../components/Typewriter';
import {useSpring} from '../utils/useSpring';

const R = 260;
const CIRC = 2 * Math.PI * R;
const SIZE = 760;
const C = SIZE / 2;

const Chamber: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  void fps;
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.06], {extrapolateRight: 'clamp'});
  const draw = interpolate(frame, [0, 40], [CIRC, 0], {extrapolateRight: 'clamp'});
  const agent = useSpring(40);
  const pill = useSpring(10);
  const dotOpacity = 0.5 + 0.5 * Math.sin(frame / 5);
  // red dot sits on the circle's edge (upper right), appears once drawn
  const dotAngle = -Math.PI / 4;
  const dx = C + R * Math.cos(dotAngle);
  const dy = C + R * Math.sin(dotAngle);

  return (
    <AbsoluteFill style={{background: colors.bg, fontFamily: fonts.ui}}>
      <AbsoluteFill
        style={{background: `radial-gradient(circle at 50% 52%, ${colors.cyan}22 0%, transparent 55%)`}}
      />
      <AbsoluteFill
        style={{alignItems: 'center', justifyContent: 'center', transform: `scale(${scale})`}}
      >
        {/* pill */}
        <div
          style={{
            position: 'absolute',
            top: 120,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '12px 28px 12px 18px',
            borderRadius: 999,
            background: colors.surface,
            border: `2px solid ${colors.cyan}66`,
            opacity: pill,
            transform: `translateY(${(1 - pill) * -20}px)`,
          }}
        >
          <Logo name="openai" size={32} />
          <Typewriter
            text="ENV: ISOLATED_SANDBOX_V4"
            delay={12}
            speed={1.2}
            style={{fontFamily: fonts.mono, fontSize: 30, color: colors.white, letterSpacing: 1}}
          />
        </div>

        <div style={{position: 'relative', width: SIZE, height: SIZE, marginTop: 60}}>
          <svg width={SIZE} height={SIZE} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
            {/* expanding rings */}
            {[0, 1, 2].map((i) => {
              const t = ((frame - 40 - i * 25) % 75) / 75;
              if (frame < 40 + i * 25) return null;
              return (
                <circle
                  key={i}
                  cx={C}
                  cy={C}
                  r={R + t * 200}
                  fill="none"
                  stroke={colors.cyan}
                  strokeWidth={2}
                  opacity={(1 - t) * 0.35}
                />
              );
            })}
            <defs>
              <mask id="reveal">
                <circle
                  cx={C}
                  cy={C}
                  r={R}
                  fill="none"
                  stroke="white"
                  strokeWidth={12}
                  strokeDasharray={CIRC}
                  strokeDashoffset={draw}
                  transform={`rotate(-90 ${C} ${C})`}
                />
              </mask>
            </defs>
            <circle
              cx={C}
              cy={C}
              r={R}
              fill="none"
              stroke={colors.cyan}
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray="18 14"
              mask="url(#reveal)"
            />
            {frame >= 40 && (
              <circle cx={dx} cy={dy} r={11} fill={colors.coral} opacity={dotOpacity} />
            )}
          </svg>

          {/* agent */}
          <div
            style={{
              position: 'absolute',
              left: C - 80,
              top: C - 80,
              width: 160,
              height: 160,
              borderRadius: 32,
              background: colors.surface,
              border: `3px solid ${colors.cyan}`,
              boxShadow: `0 0 40px ${colors.cyan}55`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${agent})`,
              opacity: agent,
            }}
          >
            <Server size={80} color={colors.cyan} strokeWidth={2} strokeLinecap="round" />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: C + 110,
              textAlign: 'center',
              fontFamily: fonts.mono,
              fontSize: 26,
              color: colors.white,
              opacity: agent,
              letterSpacing: 4,
            }}
          >
            AGENT
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: C + R + 28,
              textAlign: 'center',
              fontFamily: fonts.mono,
              fontSize: 26,
              color: colors.cyan,
              opacity: interpolate(frame, [30, 50], [0, 1], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'}),
              letterSpacing: 6,
            }}
          >
            ISOLATED SANDBOX
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ContainmentChamber: React.FC<{durationInFrames?: number}> = ({
  durationInFrames = 210,
}) => (
  <Sequence durationInFrames={durationInFrames}>
    <Chamber durationInFrames={durationInFrames} />
  </Sequence>
);
