import React from 'react';
import {AbsoluteFill, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Backdrop, C, ClipPlaceholder, cardStyle, mono, sans, whip} from './common';

export const OUTRO_FRAMES = 900;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export type OutroProps = {clip?: string};

const GENRES = ['Lo-fi', 'Synthwave', 'Drum & bass'];

export const OutroEndScreen: React.FC<OutroProps> = ({clip}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = whip(interpolate(frame, [120, 150], [0, 1], clamp));
  const box = {
    x: 48 + (120 - 48) * t,
    y: 27 + (80 - 27) * t,
    w: 1824 + (960 - 1824) * t,
    h: 1026 + (540 - 1026) * t,
  };
  const ui = interpolate(frame, [135, 160], [0, 1], clamp);
  const scrim = interpolate(frame, [90, 120], [0, 1], clamp);
  const fadeOut = interpolate(frame, [880, 900], [1, 0], clamp);
  const float = (i: number) => Math.sin(frame * 0.05 + i * 2) * 4 * ui;
  const rise = (d: number) => spring({frame: frame - d, fps, config: {damping: 200}});

  const gIdx = Math.min(GENRES.length - 1, Math.floor(Math.max(0, frame - 190) / 45));
  const subP = rise(200);
  const click = interpolate(frame, [260, 280], [0, 1], clamp);

  return (
    <AbsoluteFill style={{background: '#000', opacity: fadeOut}}>
      <AbsoluteFill style={{opacity: ui}}>
        <Backdrop />
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: box.x,
          top: box.y,
          width: box.w,
          height: box.h,
          borderRadius: 22,
          padding: 6,
          background: `linear-gradient(${135 + frame * 0.6}deg, ${C.cyan}, ${C.green}, ${C.amber}, ${C.coral}, ${C.cyan})`,
          transform: `translateY(${float(0)}px)`,
        }}
      >
        <div style={{width: '100%', height: '100%', borderRadius: 16, overflow: 'hidden', background: '#0b0b0e', position: 'relative'}}>
          {clip ? (
            <OffthreadVideo src={staticFile(clip)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          ) : (
            <ClipPlaceholder label="NEON" hint="render pending" />
          )}
          <div style={{position: 'absolute', inset: 0, background: `linear-gradient(transparent 60%, ${C.bg}cc)`, opacity: scrim * (1 - ui)}} />
        </div>
      </div>

      <div style={{position: 'absolute', left: 1180, top: 100, width: 620, opacity: ui}}>
        <div style={{opacity: rise(140), transform: `translateY(${(1 - rise(140)) * 24}px)`, fontFamily: sans, fontWeight: 800, fontSize: 64, color: C.text, letterSpacing: -1}}>
          Comment a genre.
        </div>
        <div style={{opacity: rise(152), transform: `translateY(${(1 - rise(152)) * 24}px)`, fontFamily: sans, fontWeight: 600, fontSize: 40, color: C.cyan, marginTop: 12}}>
          Best one gets animated next.
        </div>
      </div>

      <div style={{...cardStyle, position: 'absolute', left: 1180, top: 390, width: 620, height: 230, padding: 28, opacity: rise(170) * ui, transform: `translateY(${(1 - rise(170)) * 30 + float(1)}px)`, overflow: 'hidden'}}>
        {GENRES.map((g, i) => {
          if (i > gIdx) return null;
          const start = 190 + i * 45;
          const p = interpolate(frame, [start, start + 15], [0, 1], clamp);
          const slot = gIdx - i;
          return (
            <div
              key={g}
              style={{
                position: 'absolute',
                left: 28,
                right: 28,
                top: 28,
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                opacity: slot === 0 ? p : 0,
                transform: `translateY(${(1 - p) * 30}px)`,
              }}
            >
              <div style={{width: 60, height: 60, borderRadius: 30, background: `${C.cyan}26`}} />
              <div style={{fontFamily: sans, fontWeight: 600, fontSize: 40, color: C.text, background: `${C.text}12`, padding: '12px 28px', borderRadius: 24}}>{g}</div>
              {i === 1 && frame > 245 && frame < 290 ? (
                <div style={{fontFamily: sans, fontWeight: 700, fontSize: 22, color: C.bg, background: C.amber, padding: '4px 14px', borderRadius: 999}}>★ Best one</div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Subscribe slot */}
      <div style={{position: 'absolute', left: 140, top: 700, width: 280, opacity: rise(150) * ui, transform: `translateY(${float(2)}px)`}}>
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: 100,
            margin: '0 auto',
            border: `3px dashed ${C.text}4d`,
            transform: `scale(${1 + 0.03 * Math.sin(frame * 0.1)})`,
          }}
        />
        <div style={{textAlign: 'center', fontFamily: sans, fontWeight: 700, fontSize: 28, color: C.text, marginTop: 16}}>Subscribe to Bytesplained</div>
      </div>
      <div style={{position: 'absolute', left: 140, top: 775, width: 200, display: 'flex', justifyContent: 'center', opacity: rise(200) * ui}}>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: C.coral,
            color: C.text,
            fontFamily: sans,
            fontWeight: 700,
            fontSize: 24,
            padding: '8px 20px',
            borderRadius: 999,
            transform: `scale(${0.8 + 0.2 * rise(200) + 0.08 * Math.sin(click * Math.PI)})`,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 26 26" fill={C.text}>
            <path d="M6 3l17 10L6 23z" />
          </svg>
          Subscribe
          {click > 0 && click < 1 ? <div style={{position: 'absolute', left: '50%', top: '50%', width: 220 * click, height: 220 * click, marginLeft: -110 * click, marginTop: -110 * click, borderRadius: '50%', border: `3px solid ${C.text}`, opacity: 1 - click}} /> : null}
        </div>
      </div>

      {/* Next video slot */}
      <div style={{position: 'absolute', left: 520, top: 640, width: 640, height: 360, borderRadius: 24, border: `2px solid ${C.text}40`, background: `${C.surface}99`, opacity: rise(165) * ui, transform: `translateY(${(1 - rise(165)) * 30 + float(3)}px)`}}>
        <div style={{position: 'absolute', left: 20, top: 20, fontFamily: mono, fontSize: 22, color: C.bg, background: C.cyan, padding: '4px 16px', borderRadius: 999}}>Next video</div>
      </div>

      {/* Prompts link slot */}
      <div style={{...cardStyle, position: 'absolute', left: 1220, top: 700, width: 580, height: 220, padding: 32, opacity: rise(180) * ui, transform: `translateY(${(1 - rise(180)) * 30 + float(4)}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke={C.cyan} strokeWidth="4" strokeLinecap="round">
            <path d="M18 26l8-8M16 20l-4 4a7 7 0 009 9l4-4M28 24l4-4a7 7 0 00-9-9l-4 4" />
          </svg>
          <div style={{fontFamily: sans, fontWeight: 600, fontSize: 30, color: C.text, lineHeight: 1.25}}>Every prompt is in the description</div>
        </div>
        <svg width="40" height="50" viewBox="0 0 40 50" fill="none" stroke={C.amber} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" style={{marginTop: 18, marginLeft: 4, transform: `translateY(${Math.sin(frame * 0.2) * 8}px)`}}>
          <path d="M20 6v34M8 28l12 12 12-12" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
