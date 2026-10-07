import React from 'react';
import {interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bot, Lock, LockOpen, X} from 'lucide-react';
import {colors, fonts} from '../colors';
import {Bg} from '../components/Bg';
import {Scene} from '../components/Scene';
import {springAt} from '../utils/useSpring';
import {spring} from 'remotion';

const AX = 960;
const AY = 500;
const R = 250;
const TOOL = {label: 'DOCUMENT_SUMMARIZER', x: 960, y: 690, w: 310, h: 74};
const LOCKED = [
  {label: 'ROOT_CREDENTIALS', x: 300, y: 500, cutAt: 140},
  {label: 'EMAIL_INBOX', x: 1620, y: 270, cutAt: 200},
  {label: 'PAYMENT_GATEWAY', x: 1620, y: 780, cutAt: 260},
];
const NODE_W = 400;
const NODE_H = 104;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Sandbox: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = springAt(frame, fps, 0);
  const faint = interpolate(frame, [30, 80], [0, 1], clamp);

  // tiny screen shake right after each lock slams
  let shake = 0;
  LOCKED.forEach((n) => {
    const f = frame - (n.cutAt + 16);
    if (f >= 0 && f < 8) shake += (random(`sh-${n.label}-${f}`) * 2 - 1) * 7 * (1 - f / 8);
  });

  return (
    <Bg>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${shake}px, ${shake * 0.6}px)`}}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          {/* faint lines to every node, locked ones get cut */}
          {LOCKED.map((n) => {
            const cut = interpolate(frame, [n.cutAt, n.cutAt + 12], [0, 1], clamp);
            const full = Math.hypot(n.x - AX, n.y - AY);
            const len = full * (1 - cut * 0.62);
            const ux = (n.x - AX) / full;
            const uy = (n.y - AY) / full;
            const endX = AX + ux * len;
            const endY = AY + uy * len;
            const flash = interpolate(frame, [n.cutAt + 10, n.cutAt + 14, n.cutAt + 34], [0, 1, 0], clamp);
            return (
              <g key={n.label}>
                <line x1={AX} y1={AY} x2={endX} y2={endY} stroke={colors.white} strokeWidth={3} strokeDasharray="10 10" opacity={0.28 * faint} strokeLinecap="round" />
                {flash > 0 && (
                  <g opacity={flash} stroke={colors.coral} strokeWidth={7} strokeLinecap="round">
                    <line x1={endX - 22} y1={endY - 22} x2={endX + 22} y2={endY + 22} />
                    <line x1={endX + 22} y1={endY - 22} x2={endX - 22} y2={endY + 22} />
                  </g>
                )}
              </g>
            );
          })}
          <line x1={AX} y1={AY} x2={TOOL.x} y2={TOOL.y} stroke={colors.cyan} strokeWidth={5} strokeLinecap="round" opacity={interpolate(frame, [70, 90], [0, 1], clamp)} />
          <circle cx={AX} cy={AY} r={R} fill="none" stroke={colors.cyan} strokeWidth={3} strokeDasharray="16 14" opacity={intro * 0.8} />
        </svg>

        {/* agent */}
        <div
          style={{
            position: 'absolute',
            left: AX - 62,
            top: AY - 62,
            width: 124,
            height: 124,
            borderRadius: 62,
            background: colors.surface,
            border: `3px solid ${colors.cyan}`,
            boxShadow: `0 0 36px ${colors.cyan}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${intro})`,
          }}
        >
          <Bot size={64} color={colors.cyan} strokeWidth={2} strokeLinecap="round" />
        </div>
        <div style={{position: 'absolute', left: AX - 100, width: 200, top: AY - 118, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: colors.cyan, opacity: intro}}>
          AGENT
        </div>

        {/* allowed tool */}
        <div
          style={{
            position: 'absolute',
            left: TOOL.x - TOOL.w / 2,
            top: TOOL.y - TOOL.h / 2,
            width: TOOL.w,
            height: TOOL.h,
            borderRadius: 18,
            background: colors.surface,
            border: `3px solid ${colors.cyan}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: fonts.mono,
            fontWeight: 700,
            fontSize: 21,
            color: colors.white,
            opacity: interpolate(frame, [60, 80], [0, 1], clamp),
          }}
        >
          {TOOL.label}
        </div>

        {/* locked nodes */}
        {LOCKED.map((n, i) => {
          const enter = springAt(frame, fps, 24 + i * 6);
          const slam = spring({fps, frame: frame - (n.cutAt + 14), config: {damping: 9, stiffness: 160}});
          const slammed = frame >= n.cutAt + 14;
          const lockScale = slammed ? 1.4 - 0.4 * Math.min(1.2, slam) : 1;
          return (
            <div
              key={n.label}
              style={{
                position: 'absolute',
                left: n.x - NODE_W / 2,
                top: n.y - NODE_H / 2,
                width: NODE_W,
                height: NODE_H,
                borderRadius: 22,
                background: colors.surface,
                border: `3px solid ${slammed ? colors.coral : colors.white + '44'}`,
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                padding: '0 28px',
                opacity: enter,
                transform: `scale(${enter})`,
              }}
            >
              <div style={{transform: `scale(${lockScale})`}}>
                {slammed ? (
                  <Lock size={46} color={colors.coral} strokeWidth={2.4} strokeLinecap="round" />
                ) : (
                  <LockOpen size={46} color={colors.white} strokeWidth={2.4} strokeLinecap="round" />
                )}
              </div>
              <span style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 25, color: slammed ? colors.coral : colors.white}}>{n.label}</span>
            </div>
          );
        })}
      </div>
    </Bg>
  );
};
void X;

export const LeastPrivilegeSandbox: React.FC<{durationInFrames?: number}> = ({durationInFrames = 360}) => (
  <Scene durationInFrames={durationInFrames}>
    <Sandbox />
  </Scene>
);
