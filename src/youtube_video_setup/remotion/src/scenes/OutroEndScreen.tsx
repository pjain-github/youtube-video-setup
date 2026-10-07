import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bell, MousePointer2} from 'lucide-react';
import {colors, fonts} from '../colors';
import {Scene} from '../components/Scene';
import {springAt} from '../utils/useSpring';

const clampOpts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const FREEZE = 180; // everything holds still after ~6s so end-screen elements can sit on top
const RECT = {w: 480, h: 270, top: 405};
const PILL = {x: 960, y: 560, w: 440, h: 120};
const CLICK = 112;

const Rect: React.FC<{left: number; label: string}> = ({left, label}) => (
  <div
    style={{
      position: 'absolute',
      left,
      top: RECT.top,
      width: RECT.w,
      height: RECT.h,
      borderRadius: 28,
      border: `3px dashed ${colors.white}55`,
      background: `${colors.white}08`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: fonts.mono,
      fontSize: 24,
      letterSpacing: 4,
      color: colors.white,
      opacity: 0.55,
    }}
  >
    {label}
  </div>
);

const Outro: React.FC = () => {
  const real = useCurrentFrame();
  const frame = Math.min(real, FREEZE);
  const {fps} = useVideoConfig();
  const pill = springAt(frame, fps, 16);
  const rects = springAt(frame, fps, 4);
  const subscribed = frame >= CLICK + 2;
  const t = frame / 60;

  // bell rings every 3 seconds (damped sine, +-15deg)
  const ringStart = frame >= 130 ? 130 : 40;
  const f = frame - ringStart;
  const bell = f >= 0 && f < 60 ? 15 * Math.exp(-f / 14) * Math.sin(f * 0.55) : 0;

  const cx = interpolate(frame, [70, 108, 400], [1500, PILL.x + 70, PILL.x + 70], clampOpts);
  const cy = interpolate(frame, [70, 108, 400], [900, PILL.y + 25, PILL.y + 25], clampOpts);
  const press = interpolate(frame, [CLICK - 4, CLICK, CLICK + 5], [1, 0.82, 1], clampOpts);
  const cursorOpacity = interpolate(frame, [64, 76, 150, 170], [0, 1, 1, 0], clampOpts);

  return (
    <AbsoluteFill style={{background: colors.bg, fontFamily: fonts.ui}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${30 + 18 * Math.sin(t * 0.9)}% ${40 + 14 * Math.cos(t * 0.7)}%, ${colors.cyan}2a 0%, transparent 45%), radial-gradient(circle at ${70 + 16 * Math.cos(t * 0.8)}% ${62 + 12 * Math.sin(t * 0.6)}%, ${colors.coral}22 0%, transparent 45%)`,
        }}
      />
      <div style={{opacity: rects, transform: `scale(${0.94 + 0.06 * rects})`}}>
        <Rect left={130} label="VIDEO" />
        <Rect left={1920 - 130 - RECT.w} label="VIDEO" />
      </div>

      {/* bell */}
      <div
        style={{
          position: 'absolute',
          left: 960 - 56,
          top: 340,
          width: 112,
          height: 112,
          borderRadius: 56,
          background: colors.surface,
          border: `3px solid ${subscribed ? colors.white + '55' : colors.amber}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pill,
        }}
      >
        <div style={{transform: `rotate(${bell}deg)`, transformOrigin: '50% 12%'}}>
          <Bell size={58} color={subscribed ? colors.white : colors.amber} strokeWidth={2.2} strokeLinecap="round" />
        </div>
      </div>

      {/* subscribe pill */}
      <div
        style={{
          position: 'absolute',
          left: PILL.x - PILL.w / 2,
          top: PILL.y - PILL.h / 2,
          width: PILL.w,
          height: PILL.h,
          borderRadius: PILL.h / 2,
          background: subscribed ? '#4a5170' : '#E8283C',
          color: colors.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900,
          fontSize: 46,
          letterSpacing: 2,
          transform: `scale(${pill * (subscribed ? 1 + 0.04 * Math.max(0, 1 - (frame - CLICK) / 10) : 1)})`,
          opacity: pill,
          boxShadow: subscribed ? 'none' : '0 12px 50px rgba(232,40,60,0.45)',
        }}
      >
        {subscribed ? 'Subscribed ✓' : 'SUBSCRIBE'}
      </div>

      <div style={{position: 'absolute', left: cx - 6, top: cy - 4, opacity: cursorOpacity, transform: `scale(${press})`, transformOrigin: 'top left'}}>
        <MousePointer2 size={52} color={colors.white} fill={colors.white} strokeWidth={1.5} />
      </div>
    </AbsoluteFill>
  );
};

export const OutroEndScreen: React.FC<{durationInFrames?: number}> = ({durationInFrames = 600}) => (
  <Scene durationInFrames={durationInFrames}>
    <Outro />
  </Scene>
);
