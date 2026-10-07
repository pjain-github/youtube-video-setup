import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from '../colors';
import {Bg} from '../components/Bg';
import {Scene} from '../components/Scene';
import {Typewriter} from '../components/Typewriter';
import {springAt} from '../utils/useSpring';

const W = 1920;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ARRIVE = [0, 120, 230]; // frame each panel is centred

const Label: React.FC<{text: string; at: number}> = ({text, at}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 16], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 860, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 700, fontSize: 38, letterSpacing: 8, color: colors.cyan, opacity: o, transform: `translateY(${(1 - o) * 14}px)`}}>
      {text}
    </div>
  );
};

const PanelAutocomplete: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 1080}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 440, textAlign: 'center', fontFamily: fonts.mono, fontSize: 96, color: colors.white}}>
        <Typewriter text="The next word is" delay={10} speed={2.2} />
        <span style={{color: colors.cyan, opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0}}>|</span>
      </div>
      <Label text="AUTOCOMPLETE" at={46} />
    </div>
  );
};

const PanelAssistant: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const win = springAt(frame, fps, ARRIVE[1] - 30);
  const b1 = springAt(frame, fps, ARRIVE[1] + 6);
  const b2 = springAt(frame, fps, ARRIVE[1] + 40);
  return (
    <div style={{position: 'absolute', left: W, top: 0, width: W, height: 1080}}>
      <div style={{position: 'absolute', left: 560, top: 230, width: 800, height: 560, borderRadius: 32, background: colors.surface, border: `2px solid ${colors.cyan}44`, padding: '48px 44px', opacity: win}}>
        <div style={{marginLeft: 'auto', width: 420, padding: '20px 28px', borderRadius: 28, background: colors.cyan, color: colors.bg, fontSize: 32, fontWeight: 600, opacity: b1, transform: `scale(${b1})`, transformOrigin: 'right bottom'}}>
          Summarize this contract.
        </div>
        <div style={{marginTop: 36, width: 560, padding: '20px 28px', borderRadius: 28, background: colors.bg, color: colors.white, fontSize: 32, lineHeight: '44px', opacity: b2, transform: `scale(${b2})`, transformOrigin: 'left bottom'}}>
          Sure. Here are the three key points…
        </div>
      </div>
      <Label text="ASSISTANT" at={ARRIVE[1] + 26} />
    </div>
  );
};

const NODES = [
  {x: 560, y: 360},
  {x: 800, y: 560},
  {x: 560, y: 740},
  {x: 360, y: 560},
];
const CODE = ['agent.run(task)', '  browse()', '  write_code()', '  deploy()'];

const PanelAgent: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t0 = ARRIVE[2];
  const n = Math.max(0, Math.floor((frame - (t0 + 30)) / 1.1));
  let left = n;
  return (
    <div style={{position: 'absolute', left: W * 2, top: 0, width: W, height: 1080}}>
      <svg width={W} height={1080} style={{position: 'absolute', inset: 0}}>
        {NODES.map((a, i) => {
          const b = NODES[(i + 1) % NODES.length];
          const p = interpolate(frame, [t0 + 14 + i * 8, t0 + 34 + i * 8], [0, 1], clamp);
          return <line key={i} x1={a.x} y1={a.y} x2={a.x + (b.x - a.x) * p} y2={a.y + (b.y - a.y) * p} stroke={colors.cyan} strokeWidth={4} strokeLinecap="round" opacity={0.7} />;
        })}
        <line x1={NODES[0].x} y1={NODES[0].y} x2={NODES[2].x} y2={NODES[2].y} stroke={colors.cyan} strokeWidth={3} strokeLinecap="round" opacity={0.35 * interpolate(frame, [t0 + 40, t0 + 60], [0, 1], clamp)} />
      </svg>
      {NODES.map((nd, i) => {
        const s = springAt(frame, fps, t0 - 6 + i * 8);
        return <div key={i} style={{position: 'absolute', left: nd.x - 34, top: nd.y - 34, width: 68, height: 68, borderRadius: 34, background: colors.surface, border: `4px solid ${i === 0 ? colors.amber : colors.cyan}`, transform: `scale(${s})`}} />;
      })}
      <div style={{position: 'absolute', left: 1060, top: 380, width: 640, borderRadius: 24, background: colors.surface, border: `2px solid ${colors.cyan}44`, padding: '34px 40px', fontFamily: fonts.mono, fontSize: 34, lineHeight: '56px', minHeight: 300}}>
        {CODE.map((line, i) => {
          const take = Math.max(0, Math.min(line.length, left));
          left -= line.length + 1;
          return (
            <div key={i} style={{whiteSpace: 'pre', color: i === 0 ? colors.cyan : colors.white, height: 56}}>
              {line.slice(0, take)}
            </div>
          );
        })}
      </div>
      <Label text="AGENT" at={t0 + 20} />
    </div>
  );
};

const Timeline: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = interpolate(frame, [0, 80, 120, 190, 230, 300], [0, 0, -W, -W, -2 * W, -2 * W], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return (
    <Bg>
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${cam}px)`}}>
        <PanelAutocomplete />
        <PanelAssistant />
        <PanelAgent />
      </div>
    </Bg>
  );
};

export const EvolutionTimeline: React.FC<{durationInFrames?: number}> = ({durationInFrames = 300}) => (
  <Scene durationInFrames={durationInFrames}>
    <Timeline />
  </Scene>
);
