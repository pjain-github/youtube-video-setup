import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Paperclip} from 'lucide-react';
import {colors, fonts} from '../colors';
import {Bg} from '../components/Bg';
import {Scene} from '../components/Scene';

const COLS = 12;
const ROWS = 7;
const CELL = 90;
const GAP = 14;
const GRID_W = COLS * (CELL + GAP) - GAP;
const GRID_H = ROWS * (CELL + GAP) - GAP;
const MUTED_GREEN = '#1F7A56';

// wave from the left; the delay between squares shrinks each step
const order = Array.from({length: COLS * ROWS}, (_, k) => ({col: Math.floor(k / ROWS), row: k % ROWS}));
const convertAt = (k: number) => 20 + (9 * (1 - Math.pow(0.97, k))) / 0.03;
const LAST = convertAt(COLS * ROWS - 1);

const fmt = (n: number) => {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return `${Math.floor(n)}`;
};

const World: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const count = frame < 20 ? 0 : Math.pow(1.35, frame / 6);
  const finished = frame > LAST + 6;
  const indexOf = (c: number, r: number) => c * ROWS + r;

  return (
    <Bg y="55%" color={colors.green}>
      <div
        style={{
          position: 'absolute',
          left: 960 - GRID_W / 2,
          top: 130,
          fontFamily: fonts.mono,
          fontSize: 34,
          letterSpacing: 8,
          color: finished ? colors.silver : colors.green,
          fontWeight: 700,
        }}
      >
        {finished ? 'NOTHING ELSE LEFT' : 'THE WORLD'}
      </div>
      <div style={{position: 'absolute', right: 110, top: 120, fontFamily: fonts.mono, fontSize: 36, color: colors.silver}}>
        Paperclips: <span style={{color: colors.white, fontWeight: 700}}>{fmt(count)}</span>
      </div>
      <div style={{position: 'absolute', left: 960 - GRID_W / 2, top: 230, width: GRID_W, height: GRID_H}}>
        {Array.from({length: COLS * ROWS}).map((_, k) => {
          const {col, row} = {col: Math.floor(k / ROWS), row: k % ROWS};
          void indexOf;
          const t = convertAt(k);
          const sp = spring({fps, frame: frame - t, config: {damping: 14, stiffness: 140}});
          const converted = Math.min(1, Math.max(0, sp));
          return (
            <div
              key={k}
              style={{
                position: 'absolute',
                left: col * (CELL + GAP),
                top: row * (CELL + GAP),
                width: CELL,
                height: CELL,
                borderRadius: 18,
                background: converted > 0.5 ? `${colors.silver}22` : MUTED_GREEN,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: converted > 0 && converted < 0.5 ? 1 - converted : 1,
              }}
            >
              {converted > 0.5 && (
                <div style={{transform: `scale(${converted}) rotate(${(1 - converted) * -60}deg)`}}>
                  <Paperclip size={58} color={colors.silver} strokeWidth={2.4} strokeLinecap="round" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Bg>
  );
};
void order;
void interpolate;

export const PaperclipMaximizer: React.FC<{durationInFrames?: number}> = ({durationInFrames = 360}) => (
  <Scene durationInFrames={durationInFrames}>
    <World />
  </Scene>
);
