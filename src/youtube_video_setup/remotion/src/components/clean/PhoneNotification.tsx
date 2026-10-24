import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

type Props = {
  width?: number;
  delay?: number;
  appName?: string;
  time?: string;
  body?: string;
  clock?: string;
  date?: string;
};

/**
 * Illustrative lock-screen mockup with a push notification that drops in
 * and wobbles like a haptic buzz. Not a real app screenshot.
 */
export const PhoneNotification: React.FC<Props> = ({
  width = 520,
  delay = 0,
  appName = 'Claude Duet',
  time = 'now',
  body = 'Morning brief ready: 2 PR reviews organized & flight conflict rescheduled.',
  clock = '6:42',
  date = 'Tuesday, October 22',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const height = width * 2.05;

  const rise = spring({frame: frame - delay, fps, config: {damping: 16, stiffness: 170}});
  const wake = interpolate(frame - delay, [8, 22], [0.15, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dropFrame = delay + 26;
  const drop = spring({frame: frame - dropFrame, fps, config: {damping: 11, stiffness: 190}});
  const since = frame - dropFrame;
  const wobble = since > 0 && since < 14 ? Math.sin(since * 2.4) * (1 - since / 14) * 7 : 0;
  // Slow push-in so the phone never sits still
  const push = 1 + interpolate(frame - delay, [0, 240], [0, 0.04], {extrapolateRight: 'clamp'});

  return (
    <div
      style={{
        width,
        height,
        borderRadius: width * 0.13,
        background: '#1A1A1A',
        padding: width * 0.025,
        boxShadow: '0 30px 70px rgba(0,0,0,0.22)',
        transform: `translateY(${(1 - rise) * 260}px) scale(${(0.9 + 0.1 * rise) * push}) rotate(${wobble * 0.15}deg)`,
        opacity: rise,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: width * 0.105,
          overflow: 'hidden',
          position: 'relative',
          background: 'linear-gradient(170deg, #FBE7DC 0%, #F3C7B1 45%, #D97757 100%)',
          filter: `brightness(${wake})`,
        }}
      >
        <div style={{position: 'absolute', top: 22, left: '50%', width: 110, height: 30, borderRadius: 16, background: '#000', transform: 'translateX(-50%)'}} />
        <div style={{position: 'absolute', top: 110, width: '100%', textAlign: 'center', color: '#222'}}>
          <div style={{fontSize: 26, fontWeight: 600, opacity: 0.7}}>{date}</div>
          <div style={{fontSize: 150, fontWeight: 800, lineHeight: 1}}>{clock}</div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 22,
            right: 22,
            top: 380,
            padding: '20px 22px',
            borderRadius: 28,
            background: 'rgba(255,255,255,0.88)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
            transform: `translateY(${(1 - drop) * -220}px) translateX(${wobble}px)`,
            opacity: Math.min(1, drop * 1.5),
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10}}>
            <div style={{width: 38, height: 38, borderRadius: 10, background: '#D97757', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24, fontWeight: 800}}>
              ✳
            </div>
            <div style={{flex: 1, fontSize: 22, fontWeight: 700, color: '#222'}}>{appName}</div>
            <div style={{fontSize: 20, color: '#737373'}}>{time}</div>
          </div>
          <div style={{fontSize: 27, lineHeight: 1.3, fontWeight: 500, color: '#222'}}>{body}</div>
        </div>
      </div>
    </div>
  );
};
