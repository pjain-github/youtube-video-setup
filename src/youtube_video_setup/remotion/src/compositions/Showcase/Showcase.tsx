import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {loadFont} from '@remotion/google-fonts/Inter';
import {AnimatedBackground} from '../../components/AnimatedBackground';
import {AnimatedTitle} from '../../components/AnimatedTitle';
import {FloatingShape, GrowBar} from '../../components/Shapes';
import {theme} from '../../config';
import {fade as fadeValue, springIn, springs} from '../../utils/animation';

loadFont('normal', {weights: ['500', '800']});

const T = 15; // transition length in frames

const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 36}}>
      <FloatingShape kind="star" color={theme.warm} x={-640} y={-260} delay={10} />
      <FloatingShape kind="circle" color={theme.accent} x={650} y={240} size={180} delay={16} />
      <FloatingShape kind="triangle" color={theme.secondary} x={560} y={-300} size={120} delay={22} />
      <AnimatedTitle text="Programmatic Motion" fontSize={130} delay={4} />
      <GrowBar width={520} delay={22} />
      <div
        style={{
          fontFamily: theme.fontFamily,
          fontWeight: 500,
          fontSize: 44,
          color: theme.muted,
          opacity: fadeValue(frame, [30, 50]),
          transform: `translateY(${(1 - springIn(frame, fps, 30)) * 24}px)`,
        }}
      >
        Built with Remotion + React
      </div>
    </AbsoluteFill>
  );
};

const FEATURES = [
  {label: 'Typography', color: theme.primary},
  {label: 'Shapes', color: theme.secondary},
  {label: 'Transitions', color: theme.accent},
  {label: 'Audio Sync', color: theme.warm},
];

const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 56}}>
      <AnimatedTitle text="Everything is code" fontSize={96} />
      <div style={{display: 'flex', gap: 40}}>
        {FEATURES.map((f, i) => {
          const p = springIn(frame, fps, 14 + i * 6, springs.bouncy);
          return (
            <div
              key={f.label}
              style={{
                width: 340,
                height: 220,
                borderRadius: 36,
                background: theme.surface,
                border: `3px solid ${f.color}`,
                boxShadow: `0 24px 60px ${f.color}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: theme.fontFamily,
                fontWeight: 800,
                fontSize: 44,
                color: theme.text,
                opacity: p,
                transform: `translateY(${(1 - p) * 120}px) scale(${0.8 + 0.2 * p})`,
              }}
            >
              {f.label}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Scene3: React.FC = () => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 30}}>
    <FloatingShape kind="rect" color={theme.primary} x={-520} y={0} size={200} spin={40} />
    <FloatingShape kind="star" color={theme.warm} x={520} y={0} size={220} spin={-40} delay={6} />
    <AnimatedTitle text="Ready to create" fontSize={130} />
  </AbsoluteFill>
);

/**
 * Scene lengths are proportional to total duration so the composition
 * stays correct when VIDEO.durationInSeconds / fps change.
 */
export const Showcase: React.FC = () => {
  const {durationInFrames} = useVideoConfig();
  // 3 scenes, 2 transitions overlap => sum(scenes) = total + 2*T
  const total = durationInFrames + 2 * T;
  const s1 = Math.round(total * 0.34);
  const s2 = Math.round(total * 0.38);
  const s3 = total - s1 - s2;
  return (
    <AbsoluteFill>
      <AnimatedBackground />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={s1}>
          <Scene1 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({direction: 'from-right'})}
          timing={linearTiming({durationInFrames: T})}
        />
        <TransitionSeries.Sequence durationInFrames={s2}>
          <Scene2 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({direction: 'from-left'})}
          timing={linearTiming({durationInFrames: T})}
        />
        <TransitionSeries.Sequence durationInFrames={s3}>
          <Scene3 />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
