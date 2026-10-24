import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

type Props = {
  size?: number;
  backgroundColor?: string;
  delay?: number;
  children?: React.ReactNode;
  icon?: 'claude' | 'laptop' | 'chip' | 'custom';
};

export const HeroIconSquircle: React.FC<Props> = ({
  size = 320,
  backgroundColor = '#D97757', // Claude terracotta
  delay = 0,
  children,
  icon = 'claude',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Snappy spring entrance with slight overshoot
  const pop = spring({
    frame: frame - delay,
    fps,
    config: {damping: 15, stiffness: 180},
  });

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.26, // authentic squircle curve (~26% radius)
        backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 18px 45px ${backgroundColor}45`,
        transform: `scale(${pop})`,
        opacity: Math.min(1, pop * 2),
      }}
    >
      {icon === 'claude' && (
        <svg
          width={size * 0.58}
          height={size * 0.58}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Anthropic / Claude iconic starburst rays */}
          <line x1="12" y1="2" x2="12" y2="22" strokeWidth="2.8" />
          <line x1="2" y1="12" x2="22" y2="12" strokeWidth="2.8" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" strokeWidth="2.5" />
          <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" strokeWidth="2.5" />
          <circle cx="12" cy="12" r="3" fill="#FFFFFF" />
        </svg>
      )}

      {icon === 'laptop' && (
        <svg
          width={size * 0.55}
          height={size * 0.55}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="12" rx="2" fill="rgba(255,255,255,0.15)" />
          <line x1="2" y1="20" x2="22" y2="20" strokeWidth="2.5" />
        </svg>
      )}

      {icon === 'custom' && children}
    </div>
  );
};

