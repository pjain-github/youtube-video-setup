import React from 'react';
import {interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Check, MousePointer2} from 'lucide-react';
import {colors, fonts} from '../colors';
import {Bg} from '../components/Bg';
import {Scene} from '../components/Scene';
import {Typewriter} from '../components/Typewriter';

const WIN = {left: 310, top: 120, w: 1300, h: 840, bar: 72};
const ROWS = [
  {label: 'Origin', value: 'San Francisco (SFO)'},
  {label: 'Destination', value: 'Lisbon (LIS)'},
  {label: 'Passport', value: '••••••••'},
  {label: 'Payment', value: '•••• •••• •••• 4242'},
];
const START = [30, 100, 170, 240];
const fieldY = (i: number) => WIN.top + WIN.bar + 40 + 35 + 112 * i;
const BTN = {x: 960, y: WIN.top + WIN.bar + 40 + 4 * 112 + 20 + 45};

const Flow: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pts = ROWS.map((_, i) => ({x: 590, y: fieldY(i) + 14}));
  const frames = [0, START[0] - 24, START[0] - 6];
  const xs = [1500, 1500, pts[0].x];
  const ys = [960, 960, pts[0].y];
  for (let i = 1; i < 4; i++) {
    frames.push(START[i] - 24, START[i] - 6);
    xs.push(pts[i - 1].x, pts[i].x);
    ys.push(pts[i - 1].y, pts[i].y);
  }
  frames.push(285, 305, 360);
  xs.push(pts[3].x, BTN.x + 170, BTN.x + 170);
  ys.push(pts[3].y, BTN.y + 12, BTN.y + 12);
  const cx = interpolate(frame, frames, xs, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cy = interpolate(frame, frames, ys, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const click = interpolate(frame, [313, 317, 321], [1, 0.82, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const win = spring({fps, frame, config: {damping: 14, stiffness: 90}});
  const btnColor = interpolateColors(frame, [316, 324], [colors.surface, colors.green]);
  const stamp = spring({fps, frame: frame - 318, config: {damping: 9, stiffness: 140}});

  return (
    <Bg>
      <div
        style={{
          position: 'absolute',
          left: WIN.left,
          top: WIN.top,
          width: WIN.w,
          height: WIN.h,
          borderRadius: 28,
          background: colors.bg,
          border: `2px solid ${colors.cyan}44`,
          overflow: 'hidden',
          opacity: win,
          transform: `scale(${0.96 + 0.04 * win})`,
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{height: WIN.bar, background: colors.surface, display: 'flex', alignItems: 'center', padding: '0 28px', gap: 12}}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{width: 16, height: 16, borderRadius: 8, background: colors.white, opacity: 0.25}} />
          ))}
          <div
            style={{
              marginLeft: 28,
              padding: '8px 28px',
              borderRadius: 999,
              background: colors.bg,
              fontFamily: fonts.mono,
              fontSize: 24,
              color: colors.white,
              opacity: 0.8,
            }}
          >
            travel-site.example
          </div>
        </div>
      </div>

      {ROWS.map((r, i) => {
        const done = START[i] + r.value.length + 8;
        const check = spring({fps, frame: frame - done, config: {damping: 7, stiffness: 140}});
        return (
          <React.Fragment key={r.label}>
            <div
              style={{
                position: 'absolute',
                left: 370,
                top: fieldY(i) - 20,
                fontSize: 28,
                fontWeight: 600,
                color: colors.white,
                opacity: win,
              }}
            >
              {r.label}
            </div>
            <div
              style={{
                position: 'absolute',
                left: 570,
                top: fieldY(i) - 35,
                width: 800,
                height: 70,
                borderRadius: 16,
                background: colors.surface,
                border: `2px solid ${frame >= START[i] && frame < done ? colors.cyan : colors.cyan + '33'}`,
                display: 'flex',
                alignItems: 'center',
                padding: '0 24px',
                fontFamily: fonts.mono,
                fontSize: 30,
                color: colors.white,
                opacity: win,
              }}
            >
              <Typewriter text={r.value} delay={START[i]} speed={1} />
            </div>
            <div
              style={{
                position: 'absolute',
                left: 1400,
                top: fieldY(i) - 24,
                width: 48,
                height: 48,
                borderRadius: 24,
                background: colors.green,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${Math.max(0, check)})`,
              }}
            >
              <Check size={30} color={colors.bg} strokeWidth={3.5} strokeLinecap="round" />
            </div>
          </React.Fragment>
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: BTN.x - 220,
          top: BTN.y - 45,
          width: 440,
          height: 90,
          borderRadius: 24,
          background: btnColor,
          border: `2px solid ${colors.cyan}55`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: win,
          fontWeight: 900,
          fontSize: 34,
          letterSpacing: 4,
          color: frame >= 318 ? colors.bg : colors.white,
        }}
      >
        {frame >= 318 ? (
          <span style={{transform: `scale(${1 + (1 - Math.min(1, stamp)) * 0.7})`}}>SUCCESS</span>
        ) : (
          'BOOK TRIP'
        )}
      </div>

      <div style={{position: 'absolute', left: cx - 6, top: cy - 4, transform: `scale(${click})`, transformOrigin: 'top left'}}>
        <MousePointer2 size={46} color={colors.white} fill={colors.white} strokeWidth={1.5} />
      </div>
    </Bg>
  );
};

export const AutonomousBookingFlow: React.FC<{durationInFrames?: number}> = ({durationInFrames = 360}) => (
  <Scene durationInFrames={durationInFrames}>
    <Flow />
  </Scene>
);
