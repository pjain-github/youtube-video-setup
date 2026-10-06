import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

/** Blueprint entrance spring (damping 14, stiffness 90), 0→1 from `delay`. */
export const useSpring = (delay = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({fps, frame: frame - delay, config: {damping: 14, stiffness: 90}});
};
