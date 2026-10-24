import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

type Props = {
  text: string;
  type?: 'prohibition' | 'check';
  delay?: number;
  color?: string;
  fontSize?: number;
};

export const ChecklistRow: React.FC<Props> = ({
  text,
  type = 'prohibition',
  delay = 0,
  color = '#222222',
  fontSize = 42,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pop = spring({
    frame: frame - delay,
    fps,
    config: {damping: 17, stiffness: 200},
  });

  if (frame < delay) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        transform: `translateY(${(1 - pop) * 20}px) scale(${0.92 + 0.08 * pop})`,
        opacity: pop,
      }}
    >
      {/* Icon Badge */}
      <div
        style={{
          width: fontSize * 1.35,
          height: fontSize * 1.35,
          borderRadius: '50%',
          border: `3px solid ${color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          position: 'relative',
        }}
      >
        {type === 'prohibition' && (
          <div
            style={{
              position: 'absolute',
              width: fontSize * 0.95,
              height: 3.5,
              background: color,
              transform: 'rotate(-45deg)',
            }}
          />
        )}
        {type === 'check' && (
          <svg
            width={fontSize * 0.75}
            height={fontSize * 0.75}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>

      {/* Row Text */}
      <span
        style={{
          fontSize,
          fontWeight: 700,
          color,
          letterSpacing: '-0.02em',
        }}
      >
        {text}
      </span>
    </div>
  );
};

