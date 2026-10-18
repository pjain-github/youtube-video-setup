import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, sans, smooth} from './common';

export const COLD_OPEN_FRAMES = 90;

/** Transparent overlay: render as ProRes 4444 and drop over the footage. */
export const ColdOpenOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - 45, fps, config: {damping: 200}});
  const out = interpolate(frame, [80, 90], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const words = 'Built in a browser tab.'.split(' ');
  const line = interpolate(frame, [48, 80], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: smooth});
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 120,
          bottom: 120,
          opacity: p * out,
          transform: `translateY(${(1 - p) * 40 + (1 - out) * 16}px) scale(${0.95 + 0.05 * p})`,
          padding: '28px 44px 34px',
          borderRadius: 999,
          background: `${C.surface}d9`,
          border: `1px solid ${C.cyan}`,
          boxShadow: `0 0 50px ${C.cyan}44`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke={C.cyan} strokeWidth="4" strokeLinejoin="round">
            <rect x="6" y="16" width="52" height="36" rx="8" />
            <path d="M6 24h52M14 16v-4a3 3 0 013-3h14a3 3 0 013 3v4" />
          </svg>
          <div style={{display: 'flex', gap: 14, fontFamily: sans, fontWeight: 600, fontSize: 52, color: C.text}}>
            {words.map((w, i) => {
              const wp = spring({frame: frame - 50 - i * 3, fps, config: {damping: 200}});
              return (
                <span key={i} style={{opacity: wp, transform: `translateX(${(1 - wp) * -24}px)`, display: 'inline-block'}}>
                  {w}
                </span>
              );
            })}
          </div>
        </div>
        <div style={{height: 3, marginTop: 18, background: `${C.text}22`, borderRadius: 2}}>
          <div style={{width: `${line}%`, height: '100%', background: C.cyan, borderRadius: 2}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
