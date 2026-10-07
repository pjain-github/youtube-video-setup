import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {colors, fonts} from '../colors';
import {Bg} from '../components/Bg';
import {Scene} from '../components/Scene';

const TEXT = 'ACCIDENT OR PREVIEW?';
const textStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  textAlign: 'center',
  fontFamily: fonts.ui,
  fontWeight: 900,
  fontSize: 128,
  letterSpacing: -2,
  whiteSpace: 'nowrap',
  lineHeight: '160px',
};

const Card: React.FC = () => {
  const frame = useCurrentFrame();
  const glitching = frame <= 8;
  const layers = [colors.coral, colors.cyan, colors.white];
  const underline = interpolate(frame, [14, 50], [0, 1560], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pulse = 0.88 + 0.12 * Math.sin(frame / 22);

  return (
    <Bg>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{position: 'relative', width: 1920, height: 160, opacity: glitching ? 1 : pulse}}>
          {glitching ? (
            layers.map((color, i) => {
              const dx = (random(`gx-${frame}-${i}`) * 2 - 1) * 12;
              const top = random(`gt-${frame}-${i}`) * 55;
              const h = 15 + random(`gh-${frame}-${i}`) * 25;
              const slice = i < 2 ? `inset(${top}% 0 ${100 - top - h}% 0)` : undefined;
              const sliceDx = i < 2 ? (random(`gs-${frame}-${i}`) * 2 - 1) * 24 : 0;
              return (
                <div
                  key={i}
                  style={{
                    ...textStyle,
                    color,
                    transform: `translateX(${dx + sliceDx}px)`,
                    clipPath: slice,
                    mixBlendMode: i < 2 ? 'screen' : 'normal',
                  }}
                >
                  {TEXT}
                </div>
              );
            })
          ) : (
            <div style={{...textStyle, color: colors.white}}>{TEXT}</div>
          )}
        </div>
        <div
          style={{
            width: underline,
            height: 5,
            borderRadius: 3,
            background: colors.cyan,
            marginTop: 10,
            boxShadow: `0 0 18px ${colors.cyan}88`,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            'repeating-linear-gradient(0deg, rgba(234,240,255,0.045) 0px, rgba(234,240,255,0.045) 2px, transparent 2px, transparent 5px)',
        }}
      />
    </Bg>
  );
};

export const GlitchTitleCard: React.FC<{durationInFrames?: number}> = ({durationInFrames = 240}) => (
  <Scene durationInFrames={durationInFrames}>
    <Card />
  </Scene>
);
