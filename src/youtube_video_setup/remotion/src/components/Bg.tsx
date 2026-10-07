import React from 'react';
import {AbsoluteFill} from 'remotion';
import {colors, fonts} from '../colors';

/** Navy canvas with one soft radial glow. */
export const Bg: React.FC<{
  x?: string;
  y?: string;
  color?: string;
  children?: React.ReactNode;
}> = ({x = '50%', y = '50%', color = colors.cyan, children}) => (
  <AbsoluteFill style={{background: colors.bg, fontFamily: fonts.ui}}>
    <AbsoluteFill
      style={{background: `radial-gradient(circle at ${x} ${y}, ${color}22 0%, transparent 55%)`}}
    />
    {children}
  </AbsoluteFill>
);
