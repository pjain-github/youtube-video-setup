import React from 'react';
import {Composition} from 'remotion';
import {ContainmentChamber} from './ContainmentChamber';

/** Blueprint animation scenes (1920x1080). Add each new scene here. */
export const SceneCompositions: React.FC = () => (
  <>
    <Composition
      id="ContainmentChamber"
      component={ContainmentChamber}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={210}
    />
  </>
);
