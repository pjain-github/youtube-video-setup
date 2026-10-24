import React from 'react';
import {AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Inter';
import {fade, springIn, springs} from '../../utils/animation';
import {sec} from '../../utils/timing';

const {fontFamily} = loadFont('normal', {weights: ['400', '600', '800']});

export const MENTAL_MODEL_SECONDS = 15;

// Project palette (remotion-general-animation skill)
const C = {
  bg: '#070B19',
  surface: '#111A33',
  text: '#EAF0FF',
  cyan: '#00F0FF',
  amber: '#FFB800',
  green: '#2BE38B',
};
const smooth = Easing.bezier(0.25, 1, 0.5, 1);

const CARD_W = 520;
const CARD_H = 430;
const GAP = 70;
const LEFT = (1920 - (3 * CARD_W + 2 * GAP)) / 2;
const CARD_TOP = 190;
const WAVE_Y = 840;
const BARS = 96;

/** Deterministic stand-in for visualizeAudio() output: amplitude of bar i at `frame`. */
const beatPulse = (frame: number) => Math.pow(Math.max(0, Math.sin(frame * 0.42)), 4);
const amp = (i: number, frame: number) => {
  const x = i / BARS;
  const body = 0.5 + 0.5 * Math.sin(i * 0.5 + frame * 0.19) * Math.cos(i * 0.21 - frame * 0.11);
  const env = 1 - 0.5 * Math.abs(x - 0.5) * 2;
  return Math.min(1, (0.15 + 0.65 * body * env) * (0.7 + 0.55 * beatPulse(frame)));
};

/* ---------- background ---------- */

const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = frame * 0.25;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 30%, ${C.surface} 0%, ${C.bg} 70%)`}} />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.text}0d 1px, transparent 1px), linear-gradient(90deg, ${C.text}0d 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          backgroundPosition: `${drift}px ${drift * 0.5}px`,
          maskImage: 'radial-gradient(ellipse at 50% 45%, black 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 45%, black 20%, transparent 75%)',
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------- waveform ---------- */

const Waveform: React.FC<{live: number}> = ({live}) => {
  const frame = useCurrentFrame();
  const bw = 12;
  const pitch = 1680 / BARS;
  const colorAt = (x: number) => (x < 0.33 ? C.cyan : x < 0.66 ? C.amber : C.green);
  return (
    <div style={{position: 'absolute', left: 120, top: WAVE_Y, width: 1680, height: 0}}>
      {Array.from({length: BARS}, (_, i) => {
        const a = amp(i, frame);
        const h = 10 + a * (60 + live * 150);
        const color = live > 0.5 ? colorAt(i / BARS) : C.cyan;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: i * pitch,
              top: -h / 2,
              width: bw,
              height: h,
              borderRadius: bw,
              background: color,
              opacity: 0.18 + live * (0.35 + a * 0.5),
              boxShadow: live > 0.2 ? `0 0 ${8 + a * 26 * live}px ${color}` : 'none',
            }}
          />
        );
      })}
    </div>
  );
};

/* ---------- cards ---------- */

const Card: React.FC<{
  index: number;
  title: string;
  sub: string;
  color: string;
  children: React.ReactNode;
}> = ({index, title, sub, color, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = springIn(frame, fps, 0, springs.smooth);
  const opacity = fade(frame, [0, 16], [0, 1], smooth);
  return (
    <div
      style={{
        position: 'absolute',
        left: LEFT + index * (CARD_W + GAP),
        top: CARD_TOP,
        width: CARD_W,
        height: CARD_H,
        boxSizing: 'border-box',
        padding: 36,
        borderRadius: 32,
        background: C.surface,
        border: `2px solid ${color}44`,
        boxShadow: `0 30px 80px #00000088, 0 0 60px ${color}1f`,
        opacity,
        transform: `translateY(${interpolate(p, [0, 1], [50, 0])}px) scale(${interpolate(p, [0, 1], [0.95, 1])})`,
        fontFamily,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <div style={{width: 12, height: 12, borderRadius: 6, background: color, boxShadow: `0 0 16px ${color}`}} />
        <div style={{fontSize: 22, fontWeight: 600, color, letterSpacing: 3}}>{`0${index + 1}`}</div>
      </div>
      <div style={{fontSize: 52, fontWeight: 800, color: C.text, letterSpacing: -1, marginTop: 14}}>{title}</div>
      <div style={{fontSize: 26, color: `${C.text}b3`, marginTop: 4}}>{sub}</div>
      <div style={{flex: 1, position: 'relative', marginTop: 20}}>{children}</div>
    </div>
  );
};

/** 01 – a frame with size, frame-rate ticks and a length bar. */
const CompositionArt: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const box = springIn(frame, fps, 8, springs.smooth);
  const lbl = fade(frame, [22, 38]);
  const ticks = 15;
  const scan = Math.floor(frame / 2) % ticks;
  const len = fade(frame, [30, 70], [0, 1], smooth);
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 260 * box,
          height: 146 * box,
          borderRadius: 14,
          border: `3px solid ${C.cyan}`,
          background: `${C.cyan}12`,
          boxShadow: `0 0 30px ${C.cyan}33`,
        }}
      />
      <div style={{position: 'absolute', left: 0, top: 156, width: 260, textAlign: 'center', opacity: lbl, fontSize: 22, fontWeight: 600, color: C.cyan}}>
        1920 × 1080
      </div>
      <div style={{position: 'absolute', left: 290, top: 50, opacity: lbl, fontSize: 26, fontWeight: 800, color: C.text}}>
        30
        <div style={{fontSize: 18, fontWeight: 400, color: `${C.text}99`}}>fps</div>
      </div>
      {/* length bar with frame ticks */}
      <div style={{position: 'absolute', left: 0, top: 200, width: 448, height: 14, borderRadius: 7, background: `${C.text}14`}}>
        <div style={{width: `${len * 100}%`, height: '100%', borderRadius: 7, background: C.cyan}} />
      </div>
      <div style={{position: 'absolute', left: 0, top: 224, width: 448, display: 'flex', justifyContent: 'space-between'}}>
        {Array.from({length: ticks}, (_, i) => (
          <div key={i} style={{width: 3, height: i === scan ? 18 : 9, background: i === scan ? C.cyan : `${C.text}40`}} />
        ))}
      </div>
      <div style={{position: 'absolute', right: 0, top: 104, opacity: lbl, fontSize: 22, fontWeight: 600, color: C.text}}>15 s</div>
    </div>
  );
};

/** 02 – tracks with sequences placed at different times, playhead sweeping. */
const SequenceArt: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const W = 448;
  const rows = [
    {x: 0, w: 170, c: C.amber, name: 'Intro'},
    {x: 150, w: 190, c: C.cyan, name: 'Scene'},
    {x: 300, w: 148, c: C.green, name: 'Outro'},
  ];
  const head = fade(frame, [30, sec(3.2, fps)], [0, W], Easing.linear);
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily}}>
      {rows.map((r, i) => {
        const p = springIn(frame, fps, 6 + i * 9, springs.snappy);
        return (
          <div key={i} style={{position: 'absolute', left: 0, right: 0, top: i * 68, height: 52, borderRadius: 12, background: `${C.text}0a`}}>
            <div
              style={{
                position: 'absolute',
                left: r.x,
                width: r.w * p,
                height: 52,
                borderRadius: 12,
                background: r.c,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 14,
                fontSize: 20,
                fontWeight: 600,
                color: C.bg,
                whiteSpace: 'nowrap',
              }}
            >
              {p > 0.8 ? r.name : ''}
            </div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: head, top: -10, width: 4, height: 212, borderRadius: 2, background: C.text, boxShadow: `0 0 14px ${C.text}`}} />
    </div>
  );
};

/** 03 – music frequencies drive bars, a glow orb and a ring. */
const AudioArt: React.FC = () => {
  const frame = useCurrentFrame();
  const beat = beatPulse(frame);
  const n = 16;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 120, display: 'flex', alignItems: 'flex-end', gap: 8}}>
        {Array.from({length: n}, (_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 14 + amp(i * 6, frame) * 106,
              borderRadius: 6,
              background: C.green,
              boxShadow: `0 0 12px ${C.green}88`,
            }}
          />
        ))}
      </div>
      <div style={{position: 'absolute', left: 224 - 50, top: 150, width: 100, height: 100}}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${C.green} 0%, ${C.green}00 70%)`,
            transform: `scale(${1 + beat * 0.9})`,
            opacity: 0.5 + beat * 0.5,
          }}
        />
        <div style={{position: 'absolute', inset: 30, borderRadius: '50%', background: C.green, transform: `scale(${1 + beat * 0.35})`}} />
        <div
          style={{
            position: 'absolute',
            inset: -10,
            borderRadius: '50%',
            border: `3px solid ${C.green}`,
            opacity: beat * 0.8,
            transform: `scale(${1 + beat * 0.5})`,
          }}
        />
      </div>
    </div>
  );
};

/* ---------- connectors ---------- */

const Connector: React.FC<{index: number; color: string; start: number}> = ({index, color, start}) => {
  const frame = useCurrentFrame();
  const x = LEFT + (index + 1) * CARD_W + index * GAP;
  const p = fade(frame, [start, start + 24], [0, 1], smooth);
  return (
    <div style={{position: 'absolute', left: x, top: CARD_TOP + CARD_H / 2, width: GAP, height: 4}}>
      <div style={{width: GAP * p, height: 4, borderRadius: 2, background: color, boxShadow: `0 0 12px ${color}`}} />
    </div>
  );
};

/** Beams from the audio card down to the waveform = "drives". */
const DriveBeam: React.FC<{start: number}> = ({start}) => {
  const frame = useCurrentFrame();
  const p = fade(frame, [start, start + 20], [0, 1], smooth);
  const x = LEFT + 2 * (CARD_W + GAP) + CARD_W / 2;
  const top = CARD_TOP + CARD_H;
  const beat = beatPulse(frame);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 2,
        top,
        width: 4,
        height: (WAVE_Y - 120 - top) * p,
        borderRadius: 2,
        background: `linear-gradient(${C.green}, ${C.green}00)`,
        opacity: 0.5 + beat * 0.5,
        boxShadow: `0 0 18px ${C.green}`,
      }}
    />
  );
};

/* ---------- main ---------- */

export const MentalModel: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const t1 = sec(0.6, fps);
  const t2 = sec(4.6, fps);
  const t3 = sec(8.6, fps);
  const tText = sec(12, fps);

  const live = fade(frame, [t3 + 6, t3 + sec(1.2, fps)]);
  const out = fade(frame, [durationInFrames - 12, durationInFrames], [1, 0]);
  const cap = springIn(frame, fps, tText, springs.smooth);

  return (
    <AbsoluteFill style={{background: C.bg, opacity: out, fontFamily}}>
      <Backdrop />

      <div
        style={{
          position: 'absolute',
          top: 70,
          width: '100%',
          textAlign: 'center',
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: 8,
          color: `${C.text}99`,
          opacity: fade(frame, [0, 20]),
        }}
      >
        HOW REMOTION WORKS
      </div>

      <Sequence from={t1}>
        <Card index={0} title="Composition" sub="size · frame rate · length" color={C.cyan}>
          <CompositionArt />
        </Card>
      </Sequence>
      <Connector index={0} color={C.cyan} start={t2 - 12} />
      <Sequence from={t2}>
        <Card index={1} title="Sequence" sub="what plays when" color={C.amber}>
          <SequenceArt />
        </Card>
      </Sequence>
      <Connector index={1} color={C.amber} start={t3 - 12} />
      <Sequence from={t3}>
        <Card index={2} title="visualizeAudio" sub="music drives the visuals" color={C.green}>
          <AudioArt />
        </Card>
      </Sequence>

      <DriveBeam start={t3 + 24} />
      <Waveform live={live} />

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 64,
          textAlign: 'center',
          fontSize: 46,
          fontWeight: 800,
          letterSpacing: -0.5,
          color: C.text,
          opacity: fade(frame, [tText, tText + 14], [0, 1], smooth),
          transform: `translateY(${interpolate(cap, [0, 1], [24, 0])}px)`,
        }}
      >
        <span style={{color: C.cyan}}>Composition.</span> <span style={{color: C.amber}}>Sequence.</span>{' '}
        <span style={{color: C.green}}>Audio drives the visuals.</span>
      </div>
    </AbsoluteFill>
  );
};
