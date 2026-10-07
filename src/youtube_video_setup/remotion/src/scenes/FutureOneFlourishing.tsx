import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Check, FileText, FlaskConical, GraduationCap, ShieldCheck} from 'lucide-react';
import {colors, fonts} from '../colors';
import {Bg} from '../components/Bg';
import {Scene} from '../components/Scene';
import {springAt} from '../utils/useSpring';

const CARDS = [
  {Icon: FileText, title: 'Paperwork', status: 'automated'},
  {Icon: FlaskConical, title: 'Medicine design', status: 'accelerated'},
  {Icon: GraduationCap, title: 'Tutoring', status: 'personalized'},
  {Icon: ShieldCheck, title: 'Network defense', status: 'always on'},
];
const CARD_W = 760;
const CARD_H = 220;
const GAP = 40;
const LEFT = 960 - CARD_W - GAP / 2;
const TOP = 90;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ROUTE_Y = 810;
const RX0 = 300;
const RX1 = 1560;

const Flourish: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const routeDraw = interpolate(frame, [320, 360], [0, 1], clamp);
  const travel = interpolate(frame, [340, 410], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const dots = springAt(frame, fps, 310);

  return (
    <Bg x="50%" y="40%" color={colors.amber}>
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at 20% 90%, ${colors.green}1f 0%, transparent 45%)`}} />
      {CARDS.map((c, i) => {
        const at = 20 + i * 70;
        const enter = springAt(frame, fps, at);
        const bar = interpolate(frame, [at + 14, at + 44], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
        const check = springAt(frame, fps, at + 46);
        const Icon = c.Icon;
        const col = i % 2;
        const row = Math.floor(i / 2);
        return (
          <div
            key={c.title}
            style={{
              position: 'absolute',
              left: LEFT + col * (CARD_W + GAP),
              top: TOP + row * (CARD_H + GAP),
              width: CARD_W,
              height: CARD_H,
              borderRadius: 32,
              background: colors.surface,
              border: `3px solid ${colors.green}66`,
              padding: '34px 48px',
              opacity: enter,
              transform: `translateY(${(1 - enter) * 50}px) scale(${0.94 + 0.06 * enter})`,
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
              <Icon size={64} color={colors.amber} strokeWidth={2} strokeLinecap="round" />
              <div style={{fontSize: 35, fontWeight: 600, color: colors.white, whiteSpace: 'nowrap'}}>
                {c.title}: <span style={{color: colors.amber, fontWeight: 900}}>{c.status}</span>
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 36}}>
              <div style={{flex: 1, height: 26, borderRadius: 13, background: colors.bg, overflow: 'hidden'}}>
                <div style={{width: `${bar * 100}%`, height: '100%', borderRadius: 13, background: `linear-gradient(90deg, ${colors.green}, ${colors.amber})`}} />
              </div>
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 27,
                  background: colors.green,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `scale(${Math.max(0, check)})`,
                }}
              >
                <Check size={34} color={colors.bg} strokeWidth={4} strokeLinecap="round" />
              </div>
            </div>
          </div>
        );
      })}

      {/* route */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <line
          x1={RX0}
          y1={ROUTE_Y}
          x2={RX1}
          y2={ROUTE_Y}
          stroke={colors.amber}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={RX1 - RX0}
          strokeDashoffset={(RX1 - RX0) * (1 - routeDraw)}
        />
        <circle cx={RX0} cy={ROUTE_Y} r={18 * dots} fill={colors.green} />
        <circle cx={RX1} cy={ROUTE_Y} r={18 * dots} fill={colors.amber} />
        {frame >= 340 && <circle cx={RX0 + (RX1 - RX0) * travel} cy={ROUTE_Y} r={13} fill={colors.white} style={{filter: `drop-shadow(0 0 12px ${colors.white})`}} />}
      </svg>
      <div style={{position: 'absolute', left: RX0 - 260, width: 520, top: ROUTE_Y + 40, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: colors.green, opacity: dots}}>
        HUMANS SET THE DESTINATION
      </div>
      <div style={{position: 'absolute', left: RX1 - 350, width: 700, top: ROUTE_Y + 40, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: colors.amber, opacity: dots}}>
        MACHINES ACCELERATE THE JOURNEY
      </div>
    </Bg>
  );
};

export const FutureOneFlourishing: React.FC<{durationInFrames?: number}> = ({durationInFrames = 420}) => (
  <Scene durationInFrames={durationInFrames}>
    <Flourish />
  </Scene>
);
