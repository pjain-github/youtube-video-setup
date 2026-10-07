import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {MousePointer2} from 'lucide-react';
import {colors, fonts} from '../colors';
import {Bg} from '../components/Bg';
import {Scene} from '../components/Scene';
import {springAt} from '../utils/useSpring';

const MODAL = {left: 510, top: 270, w: 900, h: 520};
const DENY = {x: 720, y: 270 + 400, w: 300, h: 92};
const APPROVE = {x: 1140, y: 270 + 400, w: 440, h: 92};
const CLICK = 222;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const BG_LINES = [
  '$ agent run --task nightly-maintenance',
  '[ok] snapshot created: db-2026-10-07',
  '[ok] schema diff computed (14 changes)',
  '[..] preparing migration plan',
  '[..] preparing payment batch #4471',
  '[!!] irreversible actions require approval',
  '$ _',
];

const Modal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = springAt(frame, fps, 14);
  const blocked = frame >= CLICK + 3;
  const dots = '.'.repeat(Math.floor(frame / 12) % 4);

  const kf = [0, 70, 110, 140, 175, 200, 420];
  const cx = interpolate(frame, kf, [1600, 1600, APPROVE.x, APPROVE.x, DENY.x + 30, DENY.x + 30, DENY.x + 30], clamp);
  const cy = interpolate(frame, kf, [900, 900, APPROVE.y + 20, APPROVE.y + 20, DENY.y + 20, DENY.y + 20, DENY.y + 20], clamp);
  const press = interpolate(frame, [CLICK - 4, CLICK, CLICK + 5], [1, 0.82, 1], clamp);
  const denyFlash = interpolate(frame, [CLICK, CLICK + 2, CLICK + 16], [0, 0.55, 0], clamp);
  const hoverApprove = frame >= 118 && frame < 168;
  const hoverDeny = frame >= 186;
  const modalDim = interpolate(frame, [CLICK + 24, CLICK + 50], [1, 0], clamp);

  return (
    <Bg y="50%" color={colors.amber}>
      {/* dimmed terminal */}
      <div style={{position: 'absolute', left: 160, top: 120, width: 1600, height: 840, borderRadius: 24, background: colors.surface, opacity: 0.55, padding: '40px 56px', fontFamily: fonts.mono, fontSize: 28, lineHeight: '52px', color: colors.white}}>
        {BG_LINES.map((l, i) => (
          <div key={i} style={{opacity: i === BG_LINES.length - 1 ? 1 : 0.5}}>
            {l}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', inset: 0, background: 'rgba(7,11,25,0.55)'}} />

      {/* status */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 140, display: 'flex', justifyContent: 'center', opacity: pop}}>
        <div
          style={{
            padding: '12px 40px',
            borderRadius: 18,
            background: colors.bg,
            border: `2px solid ${blocked ? colors.coral : colors.amber}66`,
            fontFamily: fonts.mono,
            fontWeight: 700,
            fontSize: 44,
            letterSpacing: 4,
            color: blocked ? colors.coral : colors.amber,
            minWidth: 640,
            textAlign: 'center',
          }}
        >
          {blocked ? 'ACTION BLOCKED' : `WAITING FOR HUMAN${dots}`}
        </div>
      </div>

      {/* modal */}
      <div
        style={{
          position: 'absolute',
          left: MODAL.left,
          top: MODAL.top,
          width: MODAL.w,
          height: MODAL.h,
          borderRadius: 32,
          background: colors.surface,
          border: `3px solid ${blocked ? colors.coral : colors.amber}`,
          boxShadow: `0 30px 90px rgba(0,0,0,0.6), 0 0 40px ${blocked ? colors.coral : colors.amber}33`,
          padding: '48px 56px',
          opacity: pop,
          filter: `brightness(${0.55 + 0.45 * modalDim})`,
          transform: `scale(${0.85 + 0.15 * pop})`,
        }}
      >
        <div style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 36, letterSpacing: 3, color: colors.amber}}>CRITICAL ACTION REQUESTED</div>
        <div style={{marginTop: 38, fontSize: 46, lineHeight: '62px', fontWeight: 600, color: colors.white}}>Run DB migration and wire $14,200</div>
      </div>

      {/* buttons */}
      {[
        {...DENY, label: 'DENY', color: colors.coral, hover: hoverDeny, flash: denyFlash, text: colors.white},
        {...APPROVE, label: 'APPROVE (human)', color: colors.green, hover: hoverApprove, flash: 0, text: colors.bg},
      ].map((b) => (
        <div
          key={b.label}
          style={{
            position: 'absolute',
            left: b.x - b.w / 2,
            top: b.y - b.h / 2 + 0,
            width: b.w,
            height: b.h,
            borderRadius: 22,
            background: b.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: 34,
            letterSpacing: 2,
            color: b.text,
            opacity: pop,
            filter: `brightness(${0.55 + 0.45 * modalDim})`,
            transform: `scale(${(b.hover ? 1.05 : 1) * pop})`,
            boxShadow: b.hover ? `0 0 30px ${b.color}99` : 'none',
          }}
        >
          {b.label}
          <div style={{position: 'absolute', inset: 0, borderRadius: 22, background: colors.white, opacity: b.flash}} />
        </div>
      ))}

      <div style={{position: 'absolute', left: cx - 6, top: cy - 4, transform: `scale(${press})`, transformOrigin: 'top left'}}>
        <MousePointer2 size={46} color={colors.white} fill={colors.white} strokeWidth={1.5} />
      </div>
    </Bg>
  );
};

export const HumanInTheLoopModal: React.FC<{durationInFrames?: number}> = ({durationInFrames = 300}) => (
  <Scene durationInFrames={durationInFrames}>
    <Modal />
  </Scene>
);
