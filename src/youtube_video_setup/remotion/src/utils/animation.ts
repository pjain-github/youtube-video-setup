import {Easing, interpolate, spring, type SpringConfig} from 'remotion';

export const ease = {
  out: Easing.out(Easing.cubic),
  inOut: Easing.inOut(Easing.cubic),
  back: Easing.out(Easing.back(1.6)),
};

export const springs: Record<'smooth' | 'snappy' | 'bouncy', Partial<SpringConfig>> = {
  smooth: {damping: 200},
  snappy: {damping: 20, stiffness: 200},
  bouncy: {damping: 10, stiffness: 120},
};

/** 0→1 spring progress starting at `delay` frames. */
export const springIn = (
  frame: number,
  fps: number,
  delay = 0,
  config: Partial<SpringConfig> = springs.smooth,
) => spring({frame: frame - delay, fps, config});

/** Clamped linear/eased interpolation between two frames. */
export const fade = (
  frame: number,
  [from, to]: [number, number],
  [a, b]: [number, number] = [0, 1],
  easing: (t: number) => number = ease.out,
) =>
  interpolate(frame, [from, to], [a, b], {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** Fade-in at start and fade-out at end of a sequence of `total` frames. */
export const fadeInOut = (frame: number, total: number, edge = 12) =>
  Math.min(fade(frame, [0, edge]), fade(frame, [total - edge, total], [1, 0]));
