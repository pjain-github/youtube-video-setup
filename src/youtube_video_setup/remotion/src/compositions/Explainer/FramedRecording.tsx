import React from 'react';
import {AbsoluteFill, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FramedBox, mono, sans, smooth} from './common';

/** Callout times are in SOURCE seconds, so they stay correct at any playback rate. */
export type Callout = {from: number; to: number; title: string; sub?: string; badge?: string};

export type FramedProps = {
  src: string;
  rate: number;
  callouts: Callout[];
};

const CalloutView: React.FC<{c: Callout; rate: number}> = ({c, rate}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = (c.from / rate) * fps;
  const b = (c.to / rate) * fps;
  if (frame < a || frame > b + 10) return null;
  const inP = spring({frame: frame - a, fps, config: {damping: 200}});
  const out = Math.min(1, Math.max(0, (b + 10 - frame) / 10));
  const o = Math.min(inP, out);
  return (
    <div
      style={{
        position: 'absolute',
        top: 34,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity: o,
        transform: `translateY(${(1 - inP) * -30}px) scale(${0.95 + 0.05 * inP})`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          padding: '16px 36px',
          borderRadius: 999,
          background: `${C.bg}f2`,
          border: `2px solid ${C.cyan}`,
          boxShadow: `0 0 40px ${C.cyan}55, 0 18px 50px rgba(0,0,0,0.6)`,
        }}
      >
        {c.badge ? (
          <div style={{fontFamily: mono, fontWeight: 600, fontSize: 26, color: C.bg, background: C.cyan, borderRadius: 999, padding: '4px 16px'}}>
            {c.badge}
          </div>
        ) : null}
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div style={{fontFamily: sans, fontWeight: 800, fontSize: 50, color: C.text, letterSpacing: -1, lineHeight: 1.1}}>{c.title}</div>
          {c.sub ? <div style={{fontFamily: sans, fontWeight: 500, fontSize: 26, color: C.amber, marginTop: 2}}>{c.sub}</div> : null}
        </div>
      </div>
    </div>
  );
};

/** Screen recording inside the colourful box on a 2.5% black margin, with headline callouts. */
export const FramedRecording: React.FC<FramedProps> = ({src, rate, callouts}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}});
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <FramedBox progress={enter}>
        <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
        {callouts.map((c, i) => (
          <CalloutView key={i} c={c} rate={rate} />
        ))}
        {rate > 1 ? (
          <div
            style={{
              position: 'absolute',
              right: 28,
              bottom: 28,
              fontFamily: mono,
              fontWeight: 600,
              fontSize: 40,
              color: C.bg,
              background: C.amber,
              borderRadius: 14,
              padding: '6px 20px',
              opacity: 0.55 + 0.45 * smooth(0.5 + 0.5 * Math.sin(frame * 0.2)),
            }}
          >
            {rate}x
          </div>
        ) : null}
      </FramedBox>
    </AbsoluteFill>
  );
};
