import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

type Props = {
  width?: number;
  delay?: number;
  screenTitle?: string;
  commandText?: string;
  badgeText?: string;
};

export const DeviceMockup: React.FC<Props> = ({
  width = 620,
  delay = 0,
  screenTitle = 'terminal — local 7b',
  commandText = 'ollama run qwen2.5-coder:7b',
  badgeText = '4GB RAM · 0 Cloud Latency',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pop = spring({
    frame: frame - delay,
    fps,
    config: {damping: 16, stiffness: 180},
  });

  const screenHeight = width * 0.62;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: `scale(${pop})`,
        opacity: Math.min(1, pop * 2),
      }}
    >
      {/* Laptop Screen Lid */}
      <div
        style={{
          width,
          height: screenHeight,
          background: '#1A1A1A',
          borderRadius: '24px 24px 4px 4px',
          padding: 16,
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.18)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Web Camera Dot */}
        <div
          style={{
            position: 'absolute',
            top: 7,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#333333',
          }}
        />

        {/* Display Panel */}
        <div
          style={{
            flex: 1,
            background: '#0F172A',
            borderRadius: 12,
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: '"JetBrains Mono", Menlo, monospace',
          }}
        >
          {/* Top Window Bar */}
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', gap: 6}}>
              <div style={{width: 9, height: 9, borderRadius: '50%', background: '#FF5F56'}} />
              <div style={{width: 9, height: 9, borderRadius: '50%', background: '#FFBD2E'}} />
              <div style={{width: 9, height: 9, borderRadius: '50%', background: '#27C93F'}} />
            </div>
            <span style={{fontSize: 12, color: '#64748B'}}>{screenTitle}</span>
            <div style={{width: 30}} />
          </div>

          {/* Screen Content */}
          <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
            <div style={{fontSize: 18, color: '#38BDF8', fontWeight: 600}}>
              $ {commandText}
            </div>
            <div style={{fontSize: 14, color: '#34D399', fontWeight: 500}}>
              ✓ Model loaded into 3.8GB memory
            </div>
          </div>

          {/* Bottom Telemetry Pill */}
          <div
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.08)',
              fontSize: 12,
              color: '#94A3B8',
              alignSelf: 'flex-start',
            }}
          >
            {badgeText}
          </div>
        </div>
      </div>

      {/* Laptop Base / Hinge */}
      <div
        style={{
          width: width * 1.15,
          height: 18,
          background: '#D1D5DB',
          borderRadius: '0 0 16px 16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        {/* Notch Opening */}
        <div
          style={{
            width: 80,
            height: 6,
            background: '#9CA3AF',
            borderRadius: '0 0 6px 6px',
          }}
        />
      </div>
    </div>
  );
};

