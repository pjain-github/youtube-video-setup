import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

type WordConfig = {
  text: string;
  color?: string;
  highlight?: boolean;
};

type Props = {
  words: (string | WordConfig)[];
  startFrame?: number;
  wordInterval?: number; // frames per word (default: 6 frames = 200ms)
  fontSize?: number;
  lineHeight?: number;
  textAlign?: 'center' | 'left';
};

export const KineticSpeechText: React.FC<Props> = ({
  words,
  startFrame = 0,
  wordInterval = 6,
  fontSize = 58,
  lineHeight = 1.25,
  textAlign = 'center',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: textAlign === 'center' ? 'center' : 'flex-start',
        alignItems: 'center',
        gap: `${fontSize * 0.24}px`,
        maxWidth: 960,
        textAlign,
        lineHeight,
      }}
    >
      {words.map((item, idx) => {
        const wordText = typeof item === 'string' ? item : item.text;
        const color = typeof item === 'object' && item.color ? item.color : '#222222';
        const isHighlight = typeof item === 'object' && item.highlight;
        const delay = startFrame + idx * wordInterval;

        const pop = spring({
          frame: frame - delay,
          fps,
          config: {damping: 16, stiffness: 210},
        });

        if (frame < delay) return null;

        return (
          <span
            key={idx}
            style={{
              display: 'inline-block',
              fontSize,
              fontWeight: isHighlight ? 800 : 700,
              color,
              transform: `translateY(${(1 - pop) * 16}px) scale(${0.9 + 0.1 * pop})`,
              opacity: pop,
              letterSpacing: '-0.02em',
            }}
          >
            {wordText}
          </span>
        );
      })}
    </div>
  );
};

