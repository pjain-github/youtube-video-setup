import React from 'react';
import {Img, staticFile} from 'remotion';

/** Loads public/logos/<name>.png. */
export const Logo: React.FC<{name: string; size?: number}> = ({name, size = 96}) => (
  <Img
    src={staticFile(`logos/${name}.png`)}
    style={{width: size, height: size, objectFit: 'contain'}}
  />
);
