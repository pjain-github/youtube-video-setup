import React from 'react';
import {Easing, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from '../colors';
import {Bg} from '../components/Bg';
import {Scene} from '../components/Scene';
import {springAt} from '../utils/useSpring';

const BOX = {x: 140, y: 110, w: 640, h: 380};
const CLOUD = {x: 1160, y: 120, w: 620, h: 360};
const BOUNDARY_X = 960;
const CONTACT = 200;
const PORT_CLOSED = 232;
const GRAPH = {x: 160, y: 650, w: 1600, h: 280};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const HERO_Y = 300;

const sample = (k: number) => {
  const t = k * 2; // each sample is 2 frames
  const base = 0.34 + 0.09 * Math.sin(k * 0.31) + (random(`pk-${k}`) - 0.5) * 0.12;
  const spike = 0.58 * Math.exp(-Math.pow((t - (CONTACT + 8)) / 9, 2));
  const calm = t >= PORT_CLOSED ? 0.55 : 1;
  return Math.max(0.04, base * calm + spike);
};

const Tripwires: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = springAt(frame, fps, 0);
  const contacted = frame >= CONTACT;
  const closed = frame >= PORT_CLOSED;
  const flash = contacted ? 0.5 + 0.5 * Math.sin((frame - CONTACT) / 2.2) : 0;
  const flashOn = contacted && frame < CONTACT + 60 ? Math.max(0, flash) : contacted ? 0.35 : 0;

  // hero packet approaches the boundary then freezes
  const heroX = interpolate(frame, [70, CONTACT], [260, BOUNDARY_X - 18], {...clamp, easing: Easing.in(Easing.quad)});

  // scrolling graph
  const SAMPLES = 160;
  const kEnd = Math.floor(frame / 2);
  const pts = Array.from({length: SAMPLES}, (_, i) => {
    const k = kEnd - (SAMPLES - 1 - i);
    const v = k < 0 ? 0.3 : sample(k);
    return `${GRAPH.x + (i / (SAMPLES - 1)) * GRAPH.w},${GRAPH.y + GRAPH.h - Math.min(1, v) * GRAPH.h}`;
  }).join(' ');

  const cutGap = interpolate(frame, [PORT_CLOSED - 8, PORT_CLOSED + 20], [0, 1], clamp);
  const lineY = HERO_Y;
  const L0 = BOX.x + BOX.w;
  const L1 = CLOUD.x + 40;
  const mid = (L0 + L1) / 2;
  const gap = 150 * cutGap;
  const banner = interpolate(frame, [CONTACT + 14, CONTACT + 24], [0, 1], clamp);

  return (
    <Bg>
      {/* sandbox */}
      <div
        style={{
          position: 'absolute',
          left: BOX.x,
          top: BOX.y,
          width: BOX.w,
          height: BOX.h,
          borderRadius: 28,
          background: colors.surface,
          border: `3px solid ${colors.cyan}88`,
          opacity: intro,
        }}
      >
        <div style={{padding: '22px 32px', fontFamily: fonts.mono, fontWeight: 700, fontSize: 26, letterSpacing: 3, color: colors.cyan}}>SANDBOX 192.168.1.0/24</div>
      </div>
      {/* cloud */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: intro}}>
        <path
          d={`M ${CLOUD.x + 140} ${CLOUD.y + CLOUD.h - 20} a 100 100 0 0 1 -10 -200 a 150 150 0 0 1 280 -50 a 120 120 0 0 1 190 90 a 100 100 0 0 1 -20 160 z`}
          fill={colors.surface}
          stroke={colors.white}
          strokeOpacity={0.5}
          strokeWidth={3}
        />
        {/* connecting line with a gap that opens when the port is closed */}
        <line x1={L0} y1={lineY} x2={mid - gap / 2} y2={lineY} stroke={colors.cyan} strokeWidth={4} strokeDasharray="14 12" strokeLinecap="round" opacity={0.7} />
        <line x1={mid + gap / 2} y1={lineY} x2={L1} y2={lineY} stroke={colors.cyan} strokeWidth={4} strokeDasharray="14 12" strokeLinecap="round" opacity={0.7} />
        {/* boundary */}
        <line x1={BOUNDARY_X} y1={90} x2={BOUNDARY_X} y2={540} stroke={contacted ? colors.coral : colors.white} strokeWidth={contacted ? 6 : 3} strokeDasharray="18 14" opacity={contacted ? 0.4 + 0.6 * flashOn : 0.4} />
        {/* packets */}
        {[0, 1, 2, 3, 4].map((i) => {
          const x = BOX.x + 90 + ((i * 130 + frame * (1.1 + i * 0.25)) % 480);
          const y = BOX.y + 120 + 40 * Math.sin(frame / 18 + i * 1.9) + (i % 3) * 52;
          return <circle key={i} cx={x} cy={y} r={9} fill={colors.cyan} opacity={0.7} />;
        })}
        <circle cx={heroX} cy={HERO_Y} r={14} fill={contacted ? colors.coral : colors.cyan} style={{filter: `drop-shadow(0 0 10px ${contacted ? colors.coral : colors.cyan})`}} />
        {/* graph */}
        <line x1={GRAPH.x} y1={GRAPH.y + GRAPH.h} x2={GRAPH.x + GRAPH.w} y2={GRAPH.y + GRAPH.h} stroke={colors.white} strokeOpacity={0.4} strokeWidth={2} />
        <line x1={GRAPH.x} y1={GRAPH.y} x2={GRAPH.x} y2={GRAPH.y + GRAPH.h} stroke={colors.white} strokeOpacity={0.4} strokeWidth={2} />
        <polyline points={pts} fill="none" stroke={contacted && !closed ? colors.coral : colors.cyan} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <div style={{position: 'absolute', left: CLOUD.x + 140, top: CLOUD.y + 150, width: 400, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 700, fontSize: 28, letterSpacing: 3, color: colors.white}}>PUBLIC INTERNET</div>
      {/* Hugging Face badge: light pill so the dark wordmark stays readable */}
      <div style={{position: 'absolute', left: CLOUD.x + 330, top: CLOUD.y + 220, padding: '8px 18px', borderRadius: 16, background: colors.white, opacity: intro}}>
        <Img src={staticFile('logos/huggingface.png')} style={{height: 44, width: 'auto', display: 'block'}} />
      </div>
      <div style={{position: 'absolute', left: GRAPH.x, top: GRAPH.y - 44, fontFamily: fonts.mono, fontSize: 24, letterSpacing: 3, color: colors.white, opacity: 0.6}}>packets/sec</div>

      {/* banner */}
      <div
        style={{
          position: 'absolute',
          left: 460,
          top: 530,
          width: 1000,
          height: 84,
          borderRadius: 18,
          background: `${colors.coral}22`,
          border: `3px solid ${colors.coral}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: fonts.mono,
          fontWeight: 700,
          fontSize: 38,
          letterSpacing: 4,
          color: colors.coral,
          opacity: banner,
          transform: `scale(${0.92 + 0.08 * banner})`,
        }}
      >
        ANOMALY DETECTED // PORT CLOSED
      </div>
    </Bg>
  );
};

export const TelemetryTripwires: React.FC<{durationInFrames?: number}> = ({durationInFrames = 360}) => (
  <Scene durationInFrames={durationInFrames}>
    <Tripwires />
  </Scene>
);
