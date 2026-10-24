import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, mono, sans} from './common';

export type TargetBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ZoomInspectCalloutProps = {
  fromFrame: number;
  durationInFrames: number;
  targetBox: TargetBox;
  badge: string;
  badgeColor?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  centerWidth?: number;
  centerTop?: number;
  centerCardHeight?: number;
  accentColor?: string;
};

export const ZoomInspectCallout: React.FC<ZoomInspectCalloutProps> = ({
  fromFrame,
  durationInFrames,
  targetBox,
  badge,
  badgeColor = C.cyan,
  title,
  subtitle,
  children,
  centerWidth = 800,
  centerTop = 270,
  centerCardHeight = 220,
  accentColor = C.cyan,
}) => {
  const frame = useCurrentFrame();
  const {fps, width: compWidth} = useVideoConfig();

  const rel = frame - fromFrame;
  if (rel < 0 || rel > durationInFrames) {
    return null;
  }

  // Entrance spring (12 frames)
  const enterSpring = spring({
    frame: rel,
    fps,
    config: {damping: 180, mass: 0.8},
  });

  // Exit fade (10 frames)
  const exitFrames = 10;
  const exitProgress = interpolate(
    rel,
    [durationInFrames - exitFrames, durationInFrames],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const activeOpacity = Math.min(enterSpring, exitProgress);

  // Center box position
  const centerLeft = (compWidth - centerWidth) / 2;

  // Connector line calculation:
  const targetCenterX = targetBox.x + targetBox.width / 2;
  const cardCenterX = compWidth / 2;

  let sourceX = targetCenterX;
  let sourceY = targetBox.y;
  let cardX = cardCenterX;
  let cardY = centerTop;

  if (targetBox.y < centerTop) {
    // Target is ABOVE the card
    sourceY = targetBox.y + targetBox.height; // bottom of target
    cardY = centerTop; // top of card
  } else {
    // Target is BELOW the card
    sourceY = targetBox.y; // top of target
    cardY = centerTop + centerCardHeight; // bottom of card
  }

  // Bezier curve connecting card and target
  const midY = (sourceY + cardY) / 2;
  const pathD = `M ${sourceX} ${sourceY} C ${sourceX} ${midY}, ${cardX} ${midY}, ${cardX} ${cardY}`;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity: activeOpacity,
        zIndex: 100,
      }}
    >
      {/* 1. Backdrop Blur & Darken Overlay: lighter scrim & softer blur so background is more visible */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(5, 9, 20, 0.32)',
          backdropFilter: 'blur(3.5px)',
          WebkitBackdropFilter: 'blur(3.5px)',
        }}
      />

      {/* 2. Target Box on Source Element */}
      <div
        style={{
          position: 'absolute',
          left: targetBox.x,
          top: targetBox.y,
          width: targetBox.width,
          height: targetBox.height,
          border: `2px solid ${accentColor}`,
          borderRadius: 8,
          boxShadow: `0 0 20px ${accentColor}88, inset 0 0 12px ${accentColor}33`,
          transform: `scale(${0.97 + 0.03 * enterSpring})`,
        }}
      >
        {/* Pulsing indicator tag on target box corner */}
        <div
          style={{
            position: 'absolute',
            top: -8,
            right: -8,
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: accentColor,
            boxShadow: `0 0 12px ${accentColor}`,
          }}
        />
      </div>

      {/* 3. Sleek Connector Line (SVG) */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
      >
        <defs>
          <filter id={`glow-${badge.replace(/[^a-zA-Z0-9]/g, '-')}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Shadow glow line */}
        <path
          d={pathD}
          fill="none"
          stroke={accentColor}
          strokeWidth="5"
          opacity="0.3"
          filter={`url(#glow-${badge.replace(/[^a-zA-Z0-9]/g, '-')})`}
        />
        {/* Crisp dashed line */}
        <path
          d={pathD}
          fill="none"
          stroke={accentColor}
          strokeWidth="2.2"
          strokeDasharray="5 3.5"
        />
        {/* Anchor circles at ends */}
        <circle cx={sourceX} cy={sourceY} r="4" fill={accentColor} />
        <circle cx={cardX} cy={cardY} r="4" fill={accentColor} />
      </svg>

      {/* 4. Center Zoom Box (20% reduced dimensions & typography) */}
      <div
        style={{
          position: 'absolute',
          left: centerLeft,
          top: centerTop,
          width: centerWidth,
          background: 'rgba(11, 17, 33, 0.92)',
          border: `1.8px solid ${accentColor}`,
          borderRadius: 16,
          boxShadow: `0 20px 60px rgba(0,0,0,0.8), 0 0 35px ${accentColor}38`,
          padding: '18px 26px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          transform: `scale(${0.94 + 0.06 * enterSpring}) translateY(${(1 - enterSpring) * 12}px)`,
        }}
      >
        {/* Card Header */}
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${C.text}1a`, paddingBottom: 10}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <div
              style={{
                fontFamily: mono,
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: 1.2,
                color: C.bg,
                background: badgeColor,
                borderRadius: 999,
                padding: '3px 12px',
                textTransform: 'uppercase',
              }}
            >
              {badge}
            </div>
            <div style={{fontFamily: sans, fontWeight: 700, fontSize: 22, color: C.text}}>
              {title}
            </div>
          </div>
          {subtitle && (
            <div style={{fontFamily: sans, fontSize: 15, color: `${C.text}99`, fontWeight: 500}}>
              {subtitle}
            </div>
          )}
        </div>

        {/* Card Body / Zoomed Content */}
        <div style={{marginTop: 2}}>{children}</div>
      </div>
    </div>
  );
};
