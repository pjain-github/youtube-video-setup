import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

type Props = {
  label: string;
  badge?: string;
  badgeColor?: string;
  score: number; // 0 to 100
  scoreLabel?: string;
  subLabel?: string;
  barColor?: string;
  glowColor?: string;
  delay?: number;
  highlight?: boolean;
};

export const BenchmarkBar: React.FC<Props> = ({
  label,
  badge,
  badgeColor = '#38BDF8',
  score,
  scoreLabel,
  subLabel,
  barColor = 'linear-gradient(90deg, #0284C7, #06B6D4)',
  glowColor = 'rgba(6, 182, 212, 0.35)',
  delay = 0,
  highlight = false,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Snappy spring entrance for container
  const pop = spring({
    frame: frame - delay,
    fps,
    config: {damping: 18, stiffness: 180},
  });

  // Animated bar fill progress 0 -> 1
  const fillProgress = interpolate(frame - delay - 6, [0, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const currentScore = (score * fillProgress).toFixed(1);

  return (
    <div
      style={{
        width: '100%',
        padding: '20px 24px',
        borderRadius: 20,
        background: highlight ? 'rgba(30, 41, 59, 0.9)' : 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(16px)',
        border: highlight
          ? '1.5px solid rgba(6, 182, 212, 0.5)'
          : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: highlight
          ? `0 16px 40px ${glowColor}, inset 0 0 20px rgba(6, 182, 212, 0.1)`
          : '0 10px 30px rgba(0, 0, 0, 0.4)',
        transform: `scale(${pop})`,
        opacity: interpolate(pop, [0, 0.2], [0, 1], {extrapolateLeft: 'clamp'}),
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* Top Label & Score */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <span style={{fontSize: 24, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.01em'}}>
            {label}
          </span>
          {badge && (
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '4px 10px',
                borderRadius: 999,
                background: 'rgba(255, 255, 255, 0.08)',
                color: badgeColor,
                border: `1px solid ${badgeColor}40`,
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <div style={{textAlign: 'right'}}>
          <span style={{fontSize: 30, fontWeight: 800, color: highlight ? '#22D3EE' : '#F8FAFC'}}>
            {scoreLabel || `${currentScore}%`}
          </span>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div
        style={{
          width: '100%',
          height: 14,
          borderRadius: 999,
          background: 'rgba(255, 255, 255, 0.07)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${score * fillProgress}%`,
            borderRadius: 999,
            background: barColor,
            boxShadow: highlight ? `0 0 16px ${glowColor}` : 'none',
          }}
        />
      </div>

      {/* Optional Subtitle / Meta Tag */}
      {subLabel && (
        <div
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: highlight ? '#67E8F9' : '#94A3B8',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {subLabel}
        </div>
      )}
    </div>
  );
};

