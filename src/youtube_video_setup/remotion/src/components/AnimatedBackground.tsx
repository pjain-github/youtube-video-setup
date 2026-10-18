import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../config';

type Props = {
  /** Include the subtle dot-matrix pattern overlay */
  dotGrid?: boolean;
  /** Dot grid spacing in px */
  dotSpacing?: number;
  /** Optional ambient warm accent blooms */
  ambientBlooms?: boolean;
};

/**
 * Editorial Warm Paper Canvas Background.
 * Renders an off-white paper canvas with a subtle dot-grid halftone matrix.
 */
export const AnimatedBackground: React.FC<Props> = ({
  dotGrid = true,
  dotSpacing = 22,
  ambientBlooms = false,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: theme.background,
        overflow: 'hidden',
      }}
    >
      {/* Subtle Dot Matrix / Halftone Pattern */}
      {dotGrid && (
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: 0.65,
          }}
        >
          <defs>
            <pattern
              id="dot-grid-pattern"
              width={dotSpacing}
              height={dotSpacing}
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx={dotSpacing / 2}
                cy={dotSpacing / 2}
                r={1.2}
                fill="#D4CEC2"
              />
            </pattern>
            {/* Radial vignette mask to softly fade dots toward edges/top */}
            <radialGradient id="dot-mask-gradient" cx="50%" cy="60%" r="55%">
              <stop offset="0%" stopColor="#fff" stopOpacity={0.9} />
              <stop offset="70%" stopColor="#fff" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#fff" stopOpacity={0.1} />
            </radialGradient>
            <mask id="dot-mask">
              <rect width="100%" height="100%" fill="url(#dot-mask-gradient)" />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#dot-grid-pattern)"
            mask="url(#dot-mask)"
          />
        </svg>
      )}

      {/* Optional subtle ambient warm blooms */}
      {ambientBlooms && (
        <>
          <div
            style={{
              position: 'absolute',
              width: width * 0.45,
              height: width * 0.45,
              borderRadius: '50%',
              background: '#FFECC0',
              opacity: 0.25,
              filter: 'blur(160px)',
              left: width * 0.1 + Math.sin(frame / 120) * 40,
              top: height * 0.2 + Math.cos(frame / 120) * 30,
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: width * 0.35,
              height: width * 0.35,
              borderRadius: '50%',
              background: '#DBEAFE',
              opacity: 0.3,
              filter: 'blur(140px)',
              right: width * 0.1 + Math.cos(frame / 100) * 35,
              bottom: height * 0.15 + Math.sin(frame / 100) * 25,
            }}
          />
        </>
      )}
    </AbsoluteFill>
  );
};
