import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../config';

/** Slowly drifting gradient blobs. Fully deterministic (frame-driven). */
export const AnimatedBackground: React.FC<{colors?: string[]}> = ({
  colors = [theme.primary, theme.secondary, theme.accent],
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: theme.background, overflow: 'hidden'}}>
      {colors.map((c, i) => {
        const t = frame / 90 + i * 2.1;
        const size = Math.max(width, height) * 0.55;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: '50%',
              background: c,
              opacity: 0.35,
              filter: 'blur(140px)',
              left: width / 2 - size / 2 + Math.cos(t) * width * 0.3,
              top: height / 2 - size / 2 + Math.sin(t * 1.3) * height * 0.3,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
