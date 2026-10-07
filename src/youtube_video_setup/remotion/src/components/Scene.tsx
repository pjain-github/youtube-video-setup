import React from 'react';
import {Sequence} from 'remotion';

/** Blueprint wrapper: trims a scene to `durationInFrames`. */
export const Scene: React.FC<{durationInFrames: number; children: React.ReactNode}> = ({
  durationInFrames,
  children,
}) => <Sequence durationInFrames={durationInFrames}>{children}</Sequence>;
