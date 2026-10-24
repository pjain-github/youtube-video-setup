import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

type Props = {
  icon: string;
  title: string;
  desc: string;
  accentColor?: string;
  delay?: number;
};

export const TechStatCard: React.FC<Props> = ({
  icon,
  title,
  desc,
  accentColor = '#06B6D4',
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pop = spring({
    frame: frame - delay,
    fps,
    config: {damping: 18, stiffness: 210},
  });

  const translateY = interpolate(pop, [0, 1], [30, 0]);
  const opacity = interpolate(pop, [0, 0.3], [0, 1], {extrapolateLeft: 'clamp'});

  return (
    <div
      style={{
        width: '100%',
        padding: '20px 24px',
        borderRadius: 20,
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(16px)',
        border: `1px solid rgba(255, 255, 255, 0.1)`,
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        transform: `translateY(${translateY}px) scale(${pop})`,
        opacity,
      }}
    >
      <div
        style={{
          width: 58,
          height: 58,
          borderRadius: 16,
          background: `${accentColor}18`,
          border: `1px solid ${accentColor}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          flexShrink: 0,
          boxShadow: `0 0 20px ${accentColor}25`,
        }}
      >
        {icon}
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
        <div style={{fontSize: 22, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.01em'}}>
          {title}
        </div>
        <div style={{fontSize: 16, fontWeight: 500, color: '#94A3B8'}}>
          {desc}
        </div>
      </div>
    </div>
  );
};

