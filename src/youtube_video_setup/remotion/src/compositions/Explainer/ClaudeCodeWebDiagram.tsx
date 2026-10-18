import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Backdrop, C, cardStyle, mono, sans, smooth} from './common';

export const DIAGRAM_FRAMES = 900;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ic = {fill: 'none', strokeWidth: 4, strokeLinecap: 'round', strokeLinejoin: 'round'} as const;

const Icon: React.FC<{kind: number; color: string}> = ({kind, color}) => (
  <svg width="72" height="72" viewBox="0 0 72 72" stroke={color} {...ic}>
    {kind === 0 && <path d="M10 14h52v34H34l-12 12V48H10z" />}
    {kind === 1 && (
      <>
        <path d="M22 54a14 14 0 010-28 18 18 0 0135-4 14 14 0 014 32z" />
        <path d="M28 36l8 6-8 6M42 48h8" />
      </>
    )}
    {kind === 2 && (
      <>
        <circle cx="20" cy="16" r="6" />
        <circle cx="20" cy="56" r="6" />
        <circle cx="52" cy="28" r="6" />
        <path d="M20 22v28M52 34c0 12-14 8-32 16" />
      </>
    )}
    {kind === 3 && (
      <>
        <rect x="8" y="14" width="56" height="44" rx="8" />
        <path d="M30 28l16 8-16 8z" />
      </>
    )}
  </svg>
);

const NODES = [
  {title: 'Your prompt', color: C.text, sub: 'Make a music video...'},
  {title: 'Claude Code in the cloud', color: C.cyan, sub: ''},
  {title: 'Your GitHub repo', color: C.amber, sub: ''},
  {title: 'Rendered MP4', color: C.green, sub: ''},
];
const CARD_W = 340;
const CARD_H = 260;
const GAP = (1680 - 4 * CARD_W) / 3;
const cardX = (i: number) => 120 + i * (CARD_W + GAP);

const Pipeline: React.FC<{scale?: number; y?: number; showCaption?: boolean}> = ({scale = 1, y = 380, showCaption = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cy = y + CARD_H / 2;
  const typed = Math.floor(interpolate(frame, [30, 80], [0, 'Make a music video...'.length], clamp));
  return (
    <AbsoluteFill style={{transform: `scale(${scale})`, transformOrigin: '960px 540px'}}>
      {NODES.map((n, i) => {
        const delay = 15 + i * 30;
        const p = spring({frame: frame - delay, fps, config: {damping: 200}});
        const float = Math.sin(frame * 0.05 + i * 1.7) * 4 * (frame > 210 ? 1 : 0);
        const pulse = i === 3 ? interpolate(frame, [190, 200, 212], [1, 1.06, 1], clamp) : 1;
        return (
          <div
            key={i}
            style={{
              ...cardStyle,
              position: 'absolute',
              left: cardX(i),
              top: y,
              width: CARD_W,
              height: CARD_H,
              opacity: p,
              transform: `translateY(${(1 - p) * 40 + float}px) scale(${(0.95 + 0.05 * p) * pulse})`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 18,
              boxShadow: i === 3 && frame > 195 ? `0 0 60px ${C.green}66` : cardStyle.boxShadow,
            }}
          >
            <Icon kind={i} color={n.color} />
            <div style={{fontFamily: sans, fontWeight: 700, fontSize: 30, color: C.text, textAlign: 'center', padding: '0 20px'}}>{n.title}</div>
            {i === 0 ? <div style={{fontFamily: mono, fontSize: 22, color: C.cyan}}>{'Make a music video...'.slice(0, typed)}</div> : null}
          </div>
        );
      })}
      {NODES.slice(0, 3).map((n, i) => {
        const start = 15 + i * 30 + 20;
        const x1 = cardX(i) + CARD_W + 12;
        const x2 = cardX(i + 1) - 12;
        const len = x2 - x1;
        const draw = interpolate(frame, [start, start + 20], [0, 1], {...clamp, easing: smooth});
        const travel = interpolate(frame, [start + 25, start + 70], [0, 1], {...clamp, easing: smooth});
        return (
          <React.Fragment key={i}>
            <svg style={{position: 'absolute', left: 0, top: 0}} width="1920" height="1080">
              <line x1={x1} y1={cy} x2={x2} y2={cy} stroke={n.color} strokeWidth="4" strokeDasharray={len} strokeDashoffset={len * (1 - draw)} strokeLinecap="round" />
              <path d={`M${x2 - 14} ${cy - 12} L${x2} ${cy} L${x2 - 14} ${cy + 12}`} stroke={n.color} strokeWidth="4" fill="none" strokeLinecap="round" opacity={draw > 0.95 ? 1 : 0} />
            </svg>
            {travel > 0 && travel < 1 ? (
              <div style={{position: 'absolute', left: x1 + len * travel - 6, top: cy - 6, width: 12, height: 12, borderRadius: 6, background: C.cyan, boxShadow: `0 0 20px ${C.cyan}`}} />
            ) : null}
          </React.Fragment>
        );
      })}
      {(() => {
        const p = spring({frame: frame - 70, fps, config: {damping: 200}});
        const x = (cardX(1) + CARD_W + cardX(2)) / 2;
        return (
          <div style={{position: 'absolute', left: x - 70, top: cy - 70, opacity: p, fontFamily: mono, fontSize: 22, color: C.text, background: C.surface, border: `1px solid ${C.text}33`, padding: '6px 16px', borderRadius: 999, whiteSpace: 'nowrap'}}>
            git commit
          </div>
        );
      })()}
      {showCaption ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: y + CARD_H + 90, textAlign: 'center', fontFamily: sans, fontWeight: 500, fontSize: 40, color: `${C.text}cc`, opacity: interpolate(frame, [150, 175], [0, 1], clamp)}}>
          Like a developer you hand a project to.
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const Requirements: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 200}});
  const rows = [
    {t: 'Claude account', s: 'with access to Claude Code on the web', c: C.cyan},
    {t: 'GitHub account', s: 'free', c: C.green},
  ];
  const slashDraw = interpolate(frame, [110, 130], [0, 1], clamp);
  const out = interpolate(frame, [285, 300], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', left: 510, top: 400, width: 900, opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${0.95 + 0.05 * p})`, ...cardStyle, padding: '40px 56px'}}>
        <div style={{fontFamily: sans, fontWeight: 700, fontSize: 44, color: C.text, marginBottom: 28}}>What you need</div>
        {rows.map((r, i) => {
          const rp = spring({frame: frame - 25 - i * 20, fps, config: {damping: 200}});
          const tick = interpolate(frame, [35 + i * 20, 55 + i * 20], [30, 0], clamp);
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24, opacity: rp, transform: `translateX(${(1 - rp) * -30}px)`}}>
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke={r.c} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="28" cy="28" r="24" />
                <path d="M16 29l8 8 16-17" strokeDasharray="30" strokeDashoffset={tick} />
              </svg>
              <div>
                <div style={{fontFamily: sans, fontWeight: 700, fontSize: 36, color: C.text}}>{r.t}</div>
                <div style={{fontFamily: sans, fontWeight: 400, fontSize: 24, color: `${C.text}b3`}}>{r.s}</div>
              </div>
            </div>
          );
        })}
        <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 8, padding: '18px 28px', borderRadius: 999, background: `${C.green}26`, border: `1px solid ${C.green}`}}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke={C.green} strokeWidth="4" strokeLinecap="round">
            <path d="M24 8v22M14 22l10 10 10-10M10 40h28" />
            <path d="M6 6l36 36" strokeDasharray="52" strokeDashoffset={52 * (1 - slashDraw)} stroke={C.coral} />
          </svg>
          <div style={{fontFamily: sans, fontWeight: 700, fontSize: 40, color: C.green, clipPath: `inset(0 ${100 - interpolate(frame, [130, 160], [0, 100], clamp)}% 0 0)`}}>
            Nothing to install
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Browser: React.FC<{side: 'l' | 'r'}> = ({side}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 200}});
  const left = side === 'l';
  const x = (1 - p) * (left ? -700 : 700);
  const shimmer = ((frame % 45) / 45) * 1000 - 200;
  const skeleton = (w: number, h = 22) => (
    <div style={{width: w, height: h, borderRadius: h / 2, background: `${C.text}14`, position: 'relative', overflow: 'hidden', marginBottom: 14}}>
      <div style={{position: 'absolute', top: 0, bottom: 0, width: 120, left: shimmer - 200, background: `linear-gradient(90deg, transparent, ${C.text}22, transparent)`}} />
    </div>
  );
  const placeholder = 'Describe your project...';
  const typed = Math.floor(interpolate(frame, [60, 140], [0, placeholder.length], clamp));
  const ripple = interpolate(frame, [100, 120], [0, 1], clamp);
  return (
    <div style={{...cardStyle, position: 'absolute', top: 210, width: 800, height: 520, left: left ? 120 : 1000, transform: `translateX(${x}px)`, opacity: p, overflow: 'hidden'}}>
      <div style={{height: 56, display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px', background: C.bg}}>
        {[C.coral, C.amber, C.green].map((c) => (
          <div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />
        ))}
        <div style={{marginLeft: 20, fontFamily: mono, fontSize: 22, color: `${C.text}b3`, background: C.surface, padding: '4px 20px', borderRadius: 999}}>{left ? 'claude.ai/code' : 'github.com'}</div>
      </div>
      <div style={{padding: 32}}>
        {left ? (
          <>
            {skeleton(520)}
            {skeleton(380)}
            {skeleton(460)}
            <div style={{marginTop: 120, border: `1px solid ${C.text}33`, borderRadius: 16, padding: '18px 24px', fontFamily: sans, fontSize: 26, color: `${C.text}b3`}}>
              {placeholder.slice(0, typed)}
              <span style={{color: C.cyan}}>{Math.floor(frame / 15) % 2 ? '' : '▌'}</span>
            </div>
          </>
        ) : (
          <>
            <div style={{position: 'relative', alignSelf: 'flex-end', width: 130, height: 54, borderRadius: 12, background: C.green, color: C.bg, fontFamily: sans, fontWeight: 700, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', marginBottom: 24}}>
              New
              {ripple > 0 && ripple < 1 ? <div style={{position: 'absolute', width: 160 * ripple, height: 160 * ripple, borderRadius: '50%', border: `3px solid ${C.cyan}`, opacity: 1 - ripple}} /> : null}
            </div>
            {skeleton(560, 28)}
            {skeleton(420, 28)}
            {skeleton(500, 28)}
            {skeleton(360, 28)}
          </>
        )}
      </div>
    </div>
  );
};

const SideBySide: React.FC = () => {
  const frame = useCurrentFrame();
  const dot = (Math.sin(frame * 0.08) + 1) / 2;
  const p = interpolate(frame, [30, 60], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Browser side="l" />
      <Browser side="r" />
      <svg style={{position: 'absolute', left: 0, top: 0}} width="1920" height="1080">
        <line x1="920" y1="470" x2="1000" y2="470" stroke={C.cyan} strokeWidth="4" opacity={p} />
      </svg>
      <div style={{position: 'absolute', left: 920 + 80 * dot - 7, top: 463, width: 14, height: 14, borderRadius: 7, background: C.cyan, boxShadow: `0 0 20px ${C.cyan}`, opacity: p}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 790, textAlign: 'center', opacity: interpolate(frame, [70, 100], [0, 1], clamp), transform: `translateY(${interpolate(frame, [70, 100], [24, 0], clamp)}px)`}}>
        <div style={{fontFamily: sans, fontWeight: 700, fontSize: 44, color: C.text}}>Claude account + GitHub account.</div>
        <div style={{fontFamily: sans, fontWeight: 700, fontSize: 44, color: C.green, marginTop: 6}}>Nothing to install.</div>
      </div>
    </AbsoluteFill>
  );
};

export const ClaudeCodeWebDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const shrink = interpolate(frame, [300, 330, 570, 600], [1, 0.5, 0.5, 1], {...clamp, easing: smooth});
  const yShift = interpolate(frame, [300, 330, 570, 600], [0, -250, -250, 0], {...clamp, easing: smooth});
  const pipeOut = interpolate(frame, [600, 620], [1, 0], clamp);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Backdrop />
      <AbsoluteFill style={{opacity: pipeOut, transform: `translateY(${yShift}px)`}}>
        <Pipeline scale={shrink} showCaption={frame < 330} />
      </AbsoluteFill>
      <Sequence from={300} durationInFrames={300}>
        <Requirements />
      </Sequence>
      <Sequence from={600} durationInFrames={300}>
        <SideBySide />
      </Sequence>
    </AbsoluteFill>
  );
};
