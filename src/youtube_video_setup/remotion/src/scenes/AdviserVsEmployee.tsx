import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Check, KeyRound, Lightbulb, X} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import {colors, fonts} from '../colors';
import {Bg} from '../components/Bg';
import {Scene} from '../components/Scene';
import {springAt} from '../utils/useSpring';

const CARD_W = 700;
const CARD_H = 640;
const TOP = 220;
const FINAL = 300;

type Row = {label: string; ok: boolean};

const SideCard: React.FC<{
  left: number;
  title: string;
  Icon: LucideIcon;
  rows: Row[];
  enterAt: number;
  ring: string;
  glowAll?: boolean;
  glowRow?: number;
}> = ({left, title, Icon, rows, enterAt, ring, glowAll, glowRow}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = springAt(frame, fps, enterAt);
  const ringAt = enterAt + 30 + rows.length * 18 + 10;
  const rt = frame >= ringAt && frame < ringAt + 80 ? ((frame - ringAt) % 40) / 40 : -1;
  const glowing = frame >= FINAL;

  return (
    <>
      {rt >= 0 && (
        <div
          style={{
            position: 'absolute',
            left,
            top: TOP,
            width: CARD_W,
            height: CARD_H,
            borderRadius: 36,
            border: `4px solid ${ring}`,
            opacity: (1 - rt) * 0.8,
            transform: `scale(${1 + rt * 0.07})`,
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          left,
          top: TOP,
          width: CARD_W,
          height: CARD_H,
          borderRadius: 36,
          background: colors.surface,
          border: `3px solid ${glowing && glowAll ? colors.amber : colors.white + '22'}`,
          padding: '40px 56px',
          opacity: enter,
          transform: `translateY(${(1 - enter) * 50}px)`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 22, marginBottom: 30}}>
          <Icon size={60} color={ring} strokeWidth={2} strokeLinecap="round" />
          <span style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 48, letterSpacing: 4, color: colors.white}}>{title}</span>
        </div>
        {rows.map((r, i) => {
          const p = springAt(frame, fps, enterAt + 30 + i * 18);
          const glow = glowing && (glowAll || glowRow === i);
          const glowColor = glowAll ? colors.amber : colors.cyan;
          return (
            <div
              key={r.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 90,
                marginBottom: 12,
                padding: '0 28px',
                borderRadius: 20,
                background: colors.bg,
                border: `2px solid ${glow ? glowColor : 'transparent'}`,
                boxShadow: glow ? `0 0 ${24 + 10 * Math.sin(frame / 7)}px ${glowColor}88` : 'none',
                opacity: p,
                transform: `translateX(${(1 - p) * 40}px)`,
              }}
            >
              <span style={{fontFamily: fonts.mono, fontSize: 42, color: glow ? glowColor : colors.white}}>{r.label}</span>
              {r.ok ? (
                <Check size={46} color={glowAll && glowing ? colors.amber : colors.green} strokeWidth={3.5} strokeLinecap="round" />
              ) : (
                <X size={46} color={glow ? colors.cyan : colors.white} strokeWidth={3.5} strokeLinecap="round" />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

const Compare: React.FC = () => {
  const frame = useCurrentFrame();
  const divider = interpolate(frame, [110, 150], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const len = CARD_H - 40;
  return (
    <Bg>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <line
          x1={960}
          y1={TOP + 20}
          x2={960}
          y2={TOP + 20 + len}
          stroke={colors.white}
          strokeWidth={2}
          strokeLinecap="round"
          opacity={0.35}
          strokeDasharray={len}
          strokeDashoffset={len * (1 - divider)}
        />
      </svg>
      <SideCard
        left={160}
        title="ADVISER"
        Icon={Lightbulb}
        ring={colors.green}
        enterAt={10}
        glowRow={3}
        rows={[
          {label: 'read', ok: true},
          {label: 'analyze', ok: true},
          {label: 'answer', ok: true},
          {label: 'act', ok: false},
        ]}
      />
      <SideCard
        left={1060}
        title="EMPLOYEE"
        Icon={KeyRound}
        ring={colors.amber}
        enterAt={150}
        glowAll
        rows={[
          {label: 'read', ok: true},
          {label: 'write', ok: true},
          {label: 'spend', ok: true},
          {label: 'deploy', ok: true},
        ]}
      />
    </Bg>
  );
};

export const AdviserVsEmployee: React.FC<{durationInFrames?: number}> = ({durationInFrames = 360}) => (
  <Scene durationInFrames={durationInFrames}>
    <Compare />
  </Scene>
);
