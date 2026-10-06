import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../config';
import {springIn, springs} from '../utils/animation';
import {stagger} from '../utils/timing';

type Props = {
  text: string;
  fontSize?: number;
  color?: string;
  delay?: number;
  /** frames between each word */
  wordStagger?: number;
  style?: React.CSSProperties;
};

/** Word-by-word spring reveal (rise + fade + de-blur). */
export const AnimatedTitle: React.FC<Props> = ({
  text,
  fontSize = 120,
  color = theme.text,
  delay = 0,
  wordStagger = 4,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: fontSize * 0.25,
        fontFamily: theme.fontFamily,
        fontWeight: 800,
        fontSize,
        color,
        letterSpacing: -2,
        ...style,
      }}
    >
      {text.split(' ').map((word, i) => {
        const p = springIn(frame, fps, delay + stagger(i, wordStagger), springs.snappy);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: p,
              transform: `translateY(${(1 - p) * 60}px) scale(${0.9 + 0.1 * p})`,
              filter: `blur(${(1 - p) * 12}px)`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
