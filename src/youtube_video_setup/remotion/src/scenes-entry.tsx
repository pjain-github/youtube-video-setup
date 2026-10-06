import React from 'react';
import {registerRoot} from 'remotion';
import {SceneCompositions} from './scenes/SceneCompositions';

/** Entry for blueprint scenes only: npx remotion render src/scenes-entry.tsx <Id> ... */
registerRoot(() => <SceneCompositions />);
