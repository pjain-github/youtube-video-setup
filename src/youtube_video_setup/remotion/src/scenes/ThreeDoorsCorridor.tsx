import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from '../colors';
import {Bg} from '../components/Bg';
import {Scene} from '../components/Scene';
import {Typewriter} from '../components/Typewriter';
import {springAt} from '../utils/useSpring';

const DOORS = [
  {label: 'HUMAN CO-PILOT', color: colors.green, x: 460},
  {label: 'POWER CONSOLIDATION', color: colors.amber, x: 960},
  {label: 'LOSS OF CONTROL', color: colors.coral, x: 1460},
];
const ARCH_W = 300;
const ARCH_H = 460;
const ARCH_TOP = 200;

const Doors: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const zoom = interpolate(frame, [60, durationInFrames], [1, 1.12], {
    easing: Easing.inOut(Easing.quad),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const lines = interpolate(frame, [0, 30], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <Bg y="55%">
      <div style={{position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: '50% 55%'}}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          {Array.from({length: 13}).map((_, i) => (
            <line key={i} x1={160 + i * 133} y1={0} x2={160 + i * 133} y2={1080} stroke={colors.white} strokeWidth={2} opacity={0.05 * lines} />
          ))}
          <line x1={120} y1={ARCH_TOP + ARCH_H} x2={1800} y2={ARCH_TOP + ARCH_H} stroke={colors.white} strokeWidth={2} opacity={0.25 * lines} />
        </svg>
        {DOORS.map((d, i) => {
          const rise = springAt(frame, fps, i * 12);
          const glow = interpolate(frame, [i * 12 + 14, i * 12 + 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <React.Fragment key={d.label}>
              <div
                style={{
                  position: 'absolute',
                  left: d.x - ARCH_W / 2,
                  top: ARCH_TOP,
                  width: ARCH_W,
                  height: ARCH_H,
                  borderRadius: `${ARCH_W / 2}px ${ARCH_W / 2}px 0 0`,
                  background: `${d.color}14`,
                  border: `4px solid ${d.color}`,
                  borderBottom: 'none',
                  boxShadow: `0 0 ${60 * glow}px ${d.color}66, inset 0 0 ${50 * glow}px ${d.color}33`,
                  transform: `translateY(${(1 - rise) * 640}px)`,
                  opacity: Math.min(1, rise * 2),
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: d.x - 230,
                  width: 460,
                  top: ARCH_TOP + ARCH_H + 40,
                  textAlign: 'center',
                  fontFamily: fonts.mono,
                  fontWeight: 700,
                  fontSize: 30,
                  letterSpacing: 4,
                  color: d.color,
                  height: 44,
                }}
              >
                <Typewriter text={d.label} delay={i * 12 + 24} speed={1.2} />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </Bg>
  );
};

export const ThreeDoorsCorridor: React.FC<{durationInFrames?: number}> = ({durationInFrames = 180}) => (
  <Scene durationInFrames={durationInFrames}>
    <Doors durationInFrames={durationInFrames} />
  </Scene>
);
