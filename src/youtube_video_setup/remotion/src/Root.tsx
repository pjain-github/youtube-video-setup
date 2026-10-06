import React from 'react';
import {Composition} from 'remotion';
import {VIDEO, durationInFrames} from './config';
import {Showcase} from './compositions/Showcase';
import {SceneCompositions} from './scenes/SceneCompositions';

/**
 * Register every composition here. Format comes from src/config.ts.
 * Override per composition if needed (e.g. a 1080x1920 vertical short).
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Showcase"
        component={Showcase}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={durationInFrames(VIDEO.durationInSeconds)}
      />
      <SceneCompositions />
    </>
  );
};
