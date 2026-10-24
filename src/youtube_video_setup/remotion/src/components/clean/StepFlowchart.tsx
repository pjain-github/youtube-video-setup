import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

type StepItem = {
  text: string;
  tag?: string;
  color?: string;
};

type Props = {
  steps: StepItem[];
  startFrame?: number;
  interval?: number; // frames between steps
  fontSize?: number;
};

export const StepFlowchart: React.FC<Props> = ({
  steps,
  startFrame = 0,
  interval = 14,
  fontSize = 44,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
        width: '100%',
        maxWidth: 820,
      }}
    >
      {steps.map((step, idx) => {
        const delay = startFrame + idx * interval;
        const pop = spring({
          frame: frame - delay,
          fps,
          config: {damping: 17, stiffness: 190},
        });

        if (frame < delay) return null;

        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              transform: `translateY(${(1 - pop) * 18}px) scale(${0.93 + 0.07 * pop})`,
              opacity: pop,
            }}
          >
            {/* Arrow Badge */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: '#222222',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: 26,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              ➔
            </div>

            {/* Step Content */}
            <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
              <span
                style={{
                  fontSize,
                  fontWeight: 700,
                  color: step.color || '#222222',
                  letterSpacing: '-0.02em',
                }}
              >
                {step.text}
              </span>
              {step.tag && (
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    padding: '4px 12px',
                    borderRadius: 999,
                    background: '#E5E5E5',
                    color: '#555555',
                  }}
                >
                  {step.tag}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

