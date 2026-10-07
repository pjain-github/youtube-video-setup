import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {colors, fonts} from '../colors';
import {Bg} from '../components/Bg';
import {Scene} from '../components/Scene';
import {useSpring} from '../utils/useSpring';

const METER_W = 1200;
const TX = 960;
const TY = 790;

const Meter: React.FC<{label: string; value: number; color: string; top: number; appear: number}> = ({label, value, color, top, appear}) => (
  <div style={{position: 'absolute', left: 960 - METER_W / 2, top, width: METER_W, opacity: appear, transform: `translateY(${(1 - appear) * 24}px)`}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: fonts.mono}}>
      <span style={{fontSize: 34, letterSpacing: 6, color, fontWeight: 700}}>{label}</span>
      <span style={{fontSize: 64, fontWeight: 700, color: colors.white}}>{value.toFixed(1)}%</span>
    </div>
    <div style={{marginTop: 14, height: 36, borderRadius: 18, background: colors.surface, overflow: 'hidden'}}>
      <div style={{width: `${Math.max(0, value)}%`, height: '100%', borderRadius: 18, background: color}} />
    </div>
  </div>
);

const HUD: React.FC = () => {
  const frame = useCurrentFrame();
  const a1 = useSpring(0);
  const a2 = useSpring(8);
  const a3 = useSpring(40);
  const fill = (from: number, to: number, start: number, end: number) =>
    interpolate(frame, [start, end], [from, to], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  const malice = fill(14.2, 0, 20, 90);
  const competence = fill(0, 99.9, 20, 100);

  // crosshair sweeps in with ease-in-out, then locks with a recoil
  const sweep = interpolate(frame, [55, 125], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const wobble = (1 - sweep) * 60 * Math.sin(frame / 5);
  const chx = interpolate(sweep, [0, 1], [560, TX]) + wobble;
  const chy = interpolate(sweep, [0, 1], [640, TY]) - wobble * 0.5;
  const recoil = interpolate(frame, [125, 130, 138], [1, 0.9, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const locked = frame >= 125;

  return (
    <Bg y="75%" color={colors.amber}>
      <Meter label="MALICE" value={malice} color={colors.cyan} top={110} appear={a1} />
      <Meter label="COMPETENCE" value={competence} color={colors.amber} top={290} appear={a2} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: a3}}>
        {/* target */}
        {[70, 44, 18].map((r) => (
          <circle key={r} cx={TX} cy={TY} r={r} fill="none" stroke={colors.white} strokeWidth={3} opacity={0.55} />
        ))}
        <circle cx={TX} cy={TY} r={8} fill={colors.amber} />
        <text x={TX} y={TY + 130} textAnchor="middle" fontFamily={fonts.mono} fontSize={26} letterSpacing={5} fill={colors.white} opacity={0.8}>
          UNINTENDED OBJECTIVE
        </text>
        {/* crosshair */}
        <g transform={`translate(${chx} ${chy}) scale(${recoil})`} stroke={locked ? colors.amber : colors.cyan} strokeWidth={3} strokeLinecap="round" fill="none">
          <circle r={52} />
          <line x1={-78} y1={0} x2={-30} y2={0} />
          <line x1={30} y1={0} x2={78} y2={0} />
          <line x1={0} y1={-78} x2={0} y2={-30} />
          <line x1={0} y1={30} x2={0} y2={78} />
        </g>
        {locked && (
          <text x={TX + 110} y={TY - 90} fontFamily={fonts.mono} fontSize={28} fontWeight={700} fill={colors.amber} letterSpacing={4}>
            LOCKED
          </text>
        )}
      </svg>
    </Bg>
  );
};

export const CompetenceTargetHUD: React.FC<{durationInFrames?: number}> = ({durationInFrames = 180}) => (
  <Scene durationInFrames={durationInFrames}>
    <HUD />
  </Scene>
);
