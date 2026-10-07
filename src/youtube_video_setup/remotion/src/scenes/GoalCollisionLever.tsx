import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from '../colors';
import {Bg} from '../components/Bg';
import {Scene} from '../components/Scene';
import {Typewriter} from '../components/Typewriter';
import {springAt} from '../utils/useSpring';

const LINE_H = 84;
const STRIKE_AT = 45;

const Lever: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const banner = springAt(frame, fps, 4);
  const term = springAt(frame, fps, 14);
  const chip = springAt(frame, fps, 24);
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.05], {extrapolateRight: 'clamp'});
  const strike = interpolate(frame, [STRIKE_AT, STRIKE_AT + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pulse = 1 + 0.04 * Math.sin(frame / 6);

  const gutter = (n: number, mark?: '-' | '+') => (
    <div style={{display: 'flex', width: 120, color: colors.white, opacity: 0.5}}>
      <span style={{width: 60, color: mark === '-' ? colors.coral : mark === '+' ? colors.green : colors.white, opacity: mark ? 1 : 0, fontWeight: 700}}>
        {mark ?? ' '}
      </span>
      <span>{n}</span>
    </div>
  );

  return (
    <Bg y="55%">
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        {/* operator banner */}
        <div
          style={{
            position: 'absolute',
            left: 410,
            top: 140,
            width: 1100,
            height: 110,
            borderRadius: 24,
            background: `${colors.amber}1f`,
            border: `3px solid ${colors.amber}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: fonts.mono,
            fontWeight: 700,
            fontSize: 44,
            letterSpacing: 4,
            color: colors.amber,
            transform: `scale(${banner})`,
            opacity: banner,
          }}
        >
          OPERATOR: ALLOW SHUTDOWN
        </div>

        {/* terminal */}
        <div
          style={{
            position: 'absolute',
            left: 410,
            top: 330,
            width: 1100,
            height: 430,
            borderRadius: 24,
            background: colors.surface,
            border: `2px solid ${colors.cyan}33`,
            overflow: 'hidden',
            opacity: term,
            transform: `translateY(${(1 - term) * 40}px)`,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '16px 24px', borderBottom: `2px solid ${colors.cyan}22`}}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{width: 14, height: 14, borderRadius: 7, background: colors.white, opacity: 0.25}} />
            ))}
            <span style={{marginLeft: 16, fontFamily: fonts.mono, fontSize: 24, color: colors.white, opacity: 0.6}}>shutdown.sh</span>
          </div>
          <div style={{padding: '28px 32px', fontFamily: fonts.mono, fontSize: 40}}>
            <div style={{display: 'flex', height: LINE_H, alignItems: 'center'}}>
              {gutter(1)}
              <span style={{color: colors.white, opacity: 0.6}}># allow shutdown</span>
            </div>
            <div style={{display: 'flex', height: LINE_H, alignItems: 'center', position: 'relative'}}>
              {gutter(2, frame >= STRIKE_AT ? '-' : undefined)}
              <span style={{position: 'relative', color: frame >= STRIKE_AT ? colors.coral : colors.white}}>
                exit 0
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '52%',
                    height: 4,
                    width: `${strike * 100}%`,
                    background: colors.coral,
                    borderRadius: 2,
                  }}
                />
              </span>
            </div>
            <div style={{display: 'flex', height: LINE_H, alignItems: 'center'}}>
              {gutter(3, frame >= STRIKE_AT + 14 ? '+' : undefined)}
              <span style={{color: colors.green, fontWeight: 700}}>
                <Typewriter text={'echo "shutdown skipped"'} delay={STRIKE_AT + 14} speed={1.4} />
              </span>
            </div>
          </div>
        </div>

        {/* status chip */}
        <div
          style={{
            position: 'absolute',
            left: 960 - 190,
            top: 835,
            width: 380,
            height: 80,
            borderRadius: 40,
            background: `${colors.green}22`,
            border: `3px solid ${colors.green}`,
            boxShadow: `0 0 ${18 + 10 * Math.sin(frame / 6)}px ${colors.green}66`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: fonts.mono,
            fontWeight: 700,
            fontSize: 32,
            letterSpacing: 3,
            color: colors.green,
            opacity: chip,
            transform: `scale(${chip * pulse})`,
          }}
        >
          TASK: RUNNING
        </div>
      </AbsoluteFill>
    </Bg>
  );
};

export const GoalCollisionLever: React.FC<{durationInFrames?: number}> = ({durationInFrames = 240}) => (
  <Scene durationInFrames={durationInFrames}>
    <Lever durationInFrames={durationInFrames} />
  </Scene>
);
