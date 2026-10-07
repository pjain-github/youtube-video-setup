import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BellRing} from 'lucide-react';
import {colors, fonts} from '../colors';
import {Bg} from '../components/Bg';
import {Scene} from '../components/Scene';
import {Typewriter} from '../components/Typewriter';
import {springAt} from '../utils/useSpring';

const LINE_Y = 800;
const X_START = 260;
const X_TODAY = 620;
const X_FUTURE = 1500;
const X_END = 1660;
const BELL_AT = 60;

const Alarm: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const draw = interpolate(frame, [0, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const card = springAt(frame, fps, 36);
  const marker = springAt(frame, fps, 24);
  const f = frame - BELL_AT;
  const bell = f >= 0 ? 15 * Math.exp(-f / 30) * Math.sin(f * 0.314) : 0; // two damped swings
  const glow = 0.45 + 0.35 * Math.sin(frame / 14);
  const solidLen = X_TODAY - X_START;
  const dashLen = X_END - X_TODAY;
  const dashDraw = interpolate(frame, [24, 56], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <Bg y="60%" color={colors.amber}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <line
          x1={X_START}
          y1={LINE_Y}
          x2={X_TODAY}
          y2={LINE_Y}
          stroke={colors.cyan}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={solidLen}
          strokeDashoffset={solidLen * (1 - draw)}
        />
        <line
          x1={X_TODAY}
          y1={LINE_Y}
          x2={X_TODAY + dashLen * dashDraw}
          y2={LINE_Y}
          stroke={colors.white}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray="4 22"
          opacity={0.5}
        />
        {/* TODAY marker */}
        <circle cx={X_TODAY} cy={LINE_Y} r={46} fill={colors.amber} opacity={glow * 0.35 * marker} />
        <circle cx={X_TODAY} cy={LINE_Y} r={18 * marker} fill={colors.cyan} />
        {/* FUTURE marker */}
        <circle cx={X_FUTURE} cy={LINE_Y} r={18 * marker} fill={colors.bg} stroke={colors.white} strokeWidth={4} />
        {/* connector */}
        <line
          x1={X_TODAY}
          y1={690}
          x2={X_TODAY}
          y2={LINE_Y - 26}
          stroke={colors.cyan}
          strokeWidth={3}
          strokeLinecap="round"
          opacity={card * 0.7}
        />
      </svg>
      <div style={{position: 'absolute', left: X_TODAY - 100, top: LINE_Y + 46, width: 200, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: colors.white, opacity: marker}}>
        TODAY
      </div>
      <div style={{position: 'absolute', left: X_FUTURE - 100, top: LINE_Y + 46, width: 200, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: colors.white, opacity: marker * 0.7}}>
        FUTURE
      </div>
      <div style={{position: 'absolute', left: X_FUTURE - 40, top: LINE_Y - 100, width: 80, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 700, fontSize: 64, color: colors.white, opacity: marker * 0.8}}>
        ?
      </div>

      {/* alarm card */}
      <div
        style={{
          position: 'absolute',
          left: X_TODAY - 290,
          top: 370,
          width: 580,
          height: 300,
          borderRadius: 32,
          background: colors.surface,
          border: `3px solid ${colors.amber}88`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 18,
          opacity: card,
          transform: `scale(${0.9 + 0.1 * card})`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
          <div style={{transform: `rotate(${bell}deg)`, transformOrigin: '50% 10%'}}>
            <BellRing size={96} color={colors.amber} strokeWidth={2} strokeLinecap="round" />
          </div>
          <span style={{fontWeight: 900, fontSize: 56, letterSpacing: 2, color: colors.white}}>ALARM TEST</span>
        </div>
        <div style={{fontFamily: fonts.mono, fontSize: 32, color: colors.green, height: 44}}>
          <Typewriter text="Building: normal ✓" delay={90} speed={1.4} />
        </div>
      </div>
    </Bg>
  );
};

export const FireAlarmAnalogy: React.FC<{durationInFrames?: number}> = ({durationInFrames = 240}) => (
  <Scene durationInFrames={durationInFrames}>
    <Alarm />
  </Scene>
);
