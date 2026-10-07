import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../colors';
import {Bg} from '../components/Bg';
import {Scene} from '../components/Scene';
import {useSpring} from '../utils/useSpring';

const DARK = '#0B1F2A';

const Avatar: React.FC = () => {
  const frame = useCurrentFrame();
  const floatY = Math.sin(frame / 15) * 10;
  const b = (frame + 30) % 90;
  const blink = b < 6 ? interpolate(b, [0, 3, 6], [1, 0.1, 1]) : 1;
  const ctrl = interpolate(frame, [0, 150], [160, 180]);
  const enter = useSpring(0);
  const bubble = useSpring(40);

  return (
    <Bg y="52%" color={colors.teal}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            width: 220,
            height: 220,
            position: 'relative',
            transform: `translateY(${floatY}px) scale(${1.7 * enter})`,
            opacity: enter,
          }}
        >
          <div style={{position: 'absolute', inset: 0, borderRadius: 60, background: colors.teal}} />
          {[62, 158].map((cx) => (
            <div
              key={cx}
              style={{
                position: 'absolute',
                left: cx - 14,
                top: 72,
                width: 28,
                height: 28,
                borderRadius: 14,
                background: DARK,
                transform: `scaleY(${blink})`,
              }}
            />
          ))}
          <svg width={220} height={220} style={{position: 'absolute', inset: 0}}>
            <path
              d={`M 66 140 Q 110 ${ctrl} 154 140`}
              fill="none"
              stroke={DARK}
              strokeWidth={9}
              strokeLinecap="round"
            />
          </svg>
        </div>
        {/* chat bubble, upper right */}
        <div
          style={{
            position: 'absolute',
            left: 1130,
            top: 230,
            width: 190,
            height: 96,
            borderRadius: 48,
            background: colors.surface,
            border: `3px solid ${colors.teal}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            transform: `scale(${bubble})`,
            transformOrigin: 'bottom left',
            opacity: bubble,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                background: colors.white,
                transform: `translateY(${Math.sin((frame - i * 5) / 5) * -7}px)`,
                opacity: 0.9,
              }}
            />
          ))}
        </div>
      </AbsoluteFill>
    </Bg>
  );
};

export const FriendlyAIAvatar: React.FC<{durationInFrames?: number}> = ({durationInFrames = 150}) => (
  <Scene durationInFrames={durationInFrames}>
    <Avatar />
  </Scene>
);
