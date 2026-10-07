import React from 'react';
import {interpolateColors, useCurrentFrame} from 'remotion';
import {Monitor} from 'lucide-react';
import {colors, fonts} from '../colors';
import {Bg} from '../components/Bg';
import {Scene} from '../components/Scene';
import {Typewriter} from '../components/Typewriter';
import {useSpring} from '../utils/useSpring';

const COLS = 4;
const ROWS = 3;
const CW = 340;
const CH = 200;
const G = 40;
const GX = 960 - (COLS * CW + (COLS - 1) * G) / 2;
const GY = 290;
const WARN = 6; // row 1, col 2
const WARN_AT = 80;

const Cell: React.FC<{i: number}> = ({i}) => {
  const frame = useCurrentFrame();
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  const lightAt = 20 + (col + row) * 7; // diagonal wave
  const enter = useSpring(lightAt - 14);
  const lit = frame >= lightAt;
  const isWarn = i === WARN;
  const dot = isWarn ? interpolateColors(frame, [WARN_AT, WARN_AT + 6], [colors.green, colors.amber]) : colors.green;
  const tag = useSpring(WARN_AT + 6);
  const accent = lit ? (isWarn && frame >= WARN_AT ? colors.amber : colors.cyan) : colors.white;

  return (
    <div
      style={{
        position: 'absolute',
        left: GX + col * (CW + G),
        top: GY + row * (CH + G),
        width: CW,
        height: CH,
        borderRadius: 24,
        background: colors.surface,
        border: `3px solid ${lit ? accent : colors.white + '22'}`,
        boxShadow: lit ? `0 0 ${isWarn && frame >= WARN_AT ? 36 : 14}px ${accent}44` : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: enter,
        transform: `scale(${0.9 + 0.1 * enter})`,
      }}
    >
      <div style={{transform: `translateY(${isWarn && frame >= WARN_AT ? -16 : 0}px)`}}>
        <Monitor size={84} color={accent} strokeWidth={2} strokeLinecap="round" opacity={lit ? 1 : 0.3} />
      </div>
      <div style={{position: 'absolute', top: 18, right: 22, width: 20, height: 20, borderRadius: 10, background: lit ? dot : colors.white + '33'}} />
      {isWarn && frame >= WARN_AT + 6 && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 12,
            marginLeft: -118,
            padding: '6px 16px',
            borderRadius: 12,
            background: colors.amber,
            color: colors.bg,
            fontFamily: fonts.mono,
            fontWeight: 700,
            fontSize: 22,
            whiteSpace: 'nowrap',
            transform: `scale(${tag})`,
            transformOrigin: 'bottom center',
          }}
        >
          ⚠ WARNING SIGN
        </div>
      )}
    </div>
  );
};

const HUD: React.FC = () => {
  const head = useSpring(0);
  return (
    <Bg>
      <div
        style={{
          position: 'absolute',
          left: GX,
          top: 110,
          width: COLS * CW + (COLS - 1) * G,
          height: 96,
          borderRadius: 20,
          background: colors.surface,
          border: `2px solid ${colors.cyan}44`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 36px',
          fontFamily: fonts.mono,
          fontSize: 34,
          fontWeight: 700,
          color: colors.cyan,
          letterSpacing: 3,
          opacity: head,
          transform: `translateY(${(1 - head) * -24}px)`,
        }}
      >
        <Typewriter text="CONTROLLED_EVAL_LAB // SIMULATION" delay={4} speed={1} />
      </div>
      {Array.from({length: COLS * ROWS}).map((_, i) => (
        <Cell key={i} i={i} />
      ))}
    </Bg>
  );
};

export const TestChamberHUD: React.FC<{durationInFrames?: number}> = ({durationInFrames = 150}) => (
  <Scene durationInFrames={durationInFrames}>
    <HUD />
  </Scene>
);
