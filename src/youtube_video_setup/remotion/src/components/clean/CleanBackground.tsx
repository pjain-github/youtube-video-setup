import React from 'react';
import {AbsoluteFill} from 'remotion';

type Props = {
  background?: string;
  watermark?: string;
  showWatermark?: boolean;
};

export const CleanBackground: React.FC<Props> = ({
  background = '#F0F0F0',
  watermark,
  showWatermark = false,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: background,
        overflow: 'hidden',
      }}
    >
      {/* Optional Bottom Watermark in Safe Zone */}
      {showWatermark && watermark && (
        <div
          style={{
            position: 'absolute',
            bottom: 240, // 240px from bottom edge (above YouTube Shorts UI)
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: '"JetBrains Mono", Menlo, monospace',
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: '0.04em',
            color: '#A3A3A3',
            pointerEvents: 'none',
          }}
        >
          {watermark}
        </div>
      )}
    </AbsoluteFill>
  );
};
