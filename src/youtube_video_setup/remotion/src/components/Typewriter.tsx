import React from 'react';
import {useCurrentFrame} from 'remotion';

/** Types `text` in over time, starting at `delay`. `speed` = frames per character. */
export const Typewriter: React.FC<{
  text: string;
  speed?: number;
  delay?: number;
  style?: React.CSSProperties;
}> = ({text, speed = 1.5, delay = 0, style}) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((frame - delay) / speed)));
  return <span style={style}>{text.slice(0, n)}</span>;
};
