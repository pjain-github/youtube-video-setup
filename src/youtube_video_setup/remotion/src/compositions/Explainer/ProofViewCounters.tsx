import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Backdrop, C, Rise, cardStyle, mono, sans, smooth} from './common';

export const PROOF_FRAMES = 1050; // 35.0s at 30fps

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

type Item = {
  clip: string;
  target: number;
  label: string;
  title: string;
  glow: string;
  mirrored: boolean;
};

const ITEMS: Item[] = [
  {
    clip: 'video assets/videos/sample_audi_clip.mp4',
    target: 664000,
    label: '660K+ views',
    title: 'LGTM (Looks Good to Me)',
    glow: C.green,
    mirrored: false,
  },
  {
    clip: 'video assets/videos/sample_music_2_clip.mp4',
    target: 84000,
    label: '80K+ views',
    title: "The Simulation's Ending",
    glow: C.cyan,
    mirrored: true,
  },
];

const Sparkline: React.FC<{color: string}> = ({color}) => {
  const frame = useCurrentFrame();
  const d = 'M0 120 C 60 110, 90 100, 140 80 S 220 70, 270 40 S 340 20, 400 6';
  const off = interpolate(frame, [40, 130], [520, 0], {...clamp, easing: smooth});
  return (
    <svg width="400" height="130" viewBox="0 0 400 130" fill="none">
      <path d={d} stroke={color} strokeWidth="6" strokeLinecap="round" strokeDasharray="520" strokeDashoffset={off} />
    </svg>
  );
};

const ProofClip: React.FC<{item: Item}> = ({item}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inP = spring({frame, fps, config: {damping: 200}});
  const exit = interpolate(frame, [285, 300], [0, 1], clamp);
  const count = interpolate(frame, [20, 110], [0, item.target], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
  const settled = frame > 112;
  const pulse = interpolate(frame, [112, 124, 136], [0, 1, 0], clamp);
  const slide = (item.mirrored ? 1 : -1) * exit * 60;
  const imgX = item.mirrored ? 1800 - 940 : 120;
  const panelX = item.mirrored ? 120 : 120 + 940 + 40;

  return (
    <AbsoluteFill style={{opacity: 1 - exit}}>
      <Backdrop />
      {/* Video Preview Card */}
      <div
        style={{
          ...cardStyle,
          position: 'absolute',
          left: imgX,
          top: 190,
          width: 940,
          height: 718,
          padding: 14,
          opacity: inP,
          transform: `translate(${slide}px, ${(1 - inP) * 40}px) scale(${(0.95 + 0.05 * inP) * (1 + frame * 0.00012)})`,
          border: `2px solid ${item.glow}44`,
          boxShadow: `0 0 40px ${item.glow}22, 0 24px 60px rgba(0,0,0,0.5)`,
        }}
      >
        <OffthreadVideo
          src={staticFile(item.clip)}
          muted
          style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 14}}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            left: 30,
            padding: '6px 20px',
            borderRadius: 999,
            background: 'rgba(7, 11, 25, 0.85)',
            border: `1px solid ${item.glow}`,
            fontFamily: mono,
            fontSize: 20,
            fontWeight: 700,
            color: item.glow,
          }}
        >
          LIVE VIDEO
        </div>
      </div>

      {/* Metrics Stat Panel */}
      <Rise delay={14} style={{...cardStyle, position: 'absolute', left: panelX, top: 190, width: 700, height: 718, padding: 44}}>
        <div style={{fontFamily: sans, fontWeight: 500, fontSize: 24, letterSpacing: 6, color: `${C.text}99`}}>VIEWS</div>
        <div
          style={{
            fontFamily: sans,
            fontWeight: 800,
            fontSize: 88,
            color: C.text,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: -2,
            marginTop: 8,
            textShadow: `0 0 ${pulse * 50}px ${item.glow}`,
            whiteSpace: 'nowrap',
          }}
        >
          {settled ? item.label : fmt(count)}
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 36}}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 38,
              background: `${C.cyan}26`,
              color: C.cyan,
              fontFamily: sans,
              fontWeight: 800,
              fontSize: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            DP
          </div>
          <div>
            <div style={{fontFamily: sans, fontWeight: 600, fontSize: 32, color: C.text}}>Degenerative Pixels</div>
            <div style={{fontFamily: sans, fontWeight: 400, fontSize: 24, color: `${C.text}b3`, marginTop: 4}}>{item.title}</div>
          </div>
        </div>
        <div style={{marginTop: 54}}>
          <Sparkline color={item.glow} />
        </div>
      </Rise>
    </AbsoluteFill>
  );
};

const ClosingCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = ['Made', 'from', 'code,', 'not', 'keyframes.'];
  const under = interpolate(frame, [40, 70], [0, 100], {...clamp, easing: smooth});
  const code = 'const frame = useCurrentFrame();';
  const typed = Math.floor(interpolate(frame, [70, 70 + code.length * 1.5], [0, code.length], clamp));
  const out = interpolate(frame, [435, 450], [1, 0], clamp);
  const cursor = Math.floor(frame / 15) % 2 === 0;

  const leftIn = spring({frame, fps, config: {damping: 200}});
  const rightIn = spring({frame: frame - 10, fps, config: {damping: 200}});

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Backdrop />

      {/* Two Videos Side by Side */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 120,
          right: 120,
          display: 'flex',
          justifyContent: 'space-between',
          gap: 40,
        }}
      >
        {/* Left Video */}
        <div
          style={{
            ...cardStyle,
            flex: 1,
            height: 480,
            padding: 10,
            opacity: leftIn,
            transform: `translateY(${(1 - leftIn) * 30}px)`,
            border: `2px solid ${C.green}55`,
            position: 'relative',
          }}
        >
          <OffthreadVideo
            src={staticFile('video assets/videos/sample_audi_clip.mp4')}
            muted
            style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16}}
          />
          <div
            style={{
              position: 'absolute',
              top: 24,
              left: 24,
              padding: '6px 20px',
              borderRadius: 999,
              background: 'rgba(7, 11, 25, 0.85)',
              border: `1px solid ${C.green}`,
              fontFamily: mono,
              fontSize: 20,
              fontWeight: 700,
              color: C.green,
            }}
          >
            LGTM · 664K VIEWS
          </div>
        </div>

        {/* Right Video */}
        <div
          style={{
            ...cardStyle,
            flex: 1,
            height: 480,
            padding: 10,
            opacity: rightIn,
            transform: `translateY(${(1 - rightIn) * 30}px)`,
            border: `2px solid ${C.cyan}55`,
            position: 'relative',
          }}
        >
          <OffthreadVideo
            src={staticFile('video assets/videos/sample_music_2_clip.mp4')}
            muted
            style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16}}
          />
          <div
            style={{
              position: 'absolute',
              top: 24,
              left: 24,
              padding: '6px 20px',
              borderRadius: 999,
              background: 'rgba(7, 11, 25, 0.85)',
              border: `1px solid ${C.cyan}`,
              fontFamily: mono,
              fontSize: 20,
              fontWeight: 700,
              color: C.cyan,
            }}
          >
            SIMULATION · 84K VIEWS
          </div>
        </div>
      </div>

      {/* Bottom Area: "Made from code, not keyframes." */}
      <div
        style={{
          position: 'absolute',
          bottom: 110,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 22,
            fontFamily: sans,
            fontWeight: 800,
            fontSize: 76,
            color: C.text,
            letterSpacing: -2,
          }}
        >
          {words.map((w, i) => {
            const p = spring({frame: frame - 25 - i * 5, fps, config: {damping: 200}});
            const isCode = w.startsWith('code');
            return (
              <span
                key={i}
                style={{
                  position: 'relative',
                  opacity: p,
                  transform: `translateY(${(1 - p) * 20}px)`,
                  color: isCode ? C.cyan : C.text,
                }}
              >
                {w}
                {isCode ? (
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      bottom: -4,
                      height: 5,
                      width: `${under}%`,
                      background: C.cyan,
                      borderRadius: 3,
                    }}
                  />
                ) : null}
              </span>
            );
          })}
        </div>

        <div
          style={{
            ...cardStyle,
            marginTop: 36,
            padding: '20px 40px',
            borderRadius: 999,
            opacity: interpolate(frame, [60, 80], [0, 1], clamp),
            background: `${C.surface}ee`,
            border: `1px solid ${C.cyan}44`,
          }}
        >
          <span style={{fontFamily: mono, fontSize: 32, color: C.cyan}}>{code.slice(0, typed)}</span>
          <span style={{fontFamily: mono, fontSize: 32, color: C.text, opacity: cursor ? 1 : 0}}>▌</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ProofViewCounters: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <Sequence from={0} durationInFrames={300}>
      <ProofClip item={ITEMS[0]} />
    </Sequence>
    <Sequence from={300} durationInFrames={300}>
      <ProofClip item={ITEMS[1]} />
    </Sequence>
    <Sequence from={600} durationInFrames={450}>
      <ClosingCard />
    </Sequence>
  </AbsoluteFill>
);
