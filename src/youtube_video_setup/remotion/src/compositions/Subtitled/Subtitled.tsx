import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Inter';
import {theme} from '../../config';
import {fade, ease} from '../../utils/animation';
import data from '../../data/captions.json';

const {fontFamily} = loadFont('normal', {weights: ['600', '800']});

export const VIDEO_FILE = 'video assets/videos/AI_Models_Going_Rogue_Full_Documentary.mp4';

type Word = {text: string; start: number; end: number};
type Phrase = {start: number; end: number; words: Word[]};

const Caption: React.FC<{phrase: Phrase; durationInFrames: number}> = ({phrase, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = phrase.start + frame / fps;
  const enter = fade(frame, [0, 6]);
  const scene = data.scenes.filter((s) => s.start <= phrase.start).at(-1) ?? data.scenes[0];
  const num = scene.section.match(/^Section (\d+)/)?.[1] ?? '•';
  const exit = fade(frame, [durationInFrames - 5, durationInFrames], [1, 0]);

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 70}}>
      <div
        style={{
          opacity: Math.min(enter, exit),
          transform: `translateY(${(1 - enter) * 18}px) scale(${0.97 + 0.03 * enter})`,
          maxWidth: 1700,
          padding: '20px 44px',
          borderRadius: 28,
          background: 'rgba(11,16,32,0.72)',
          border: '1.5px solid rgba(255,255,255,0.14)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
          backdropFilter: 'blur(10px)',
          fontFamily,
          fontWeight: 800,
          fontSize: 52,
          lineHeight: 1.25,
          textAlign: 'center',
          textShadow: '0 2px 8px rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          gap: 28,
        }}
      >
        <span
          style={{
            flex: 'none',
            width: 64,
            height: 64,
            borderRadius: 999,
            display: 'grid',
            placeItems: 'center',
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
            color: '#fff',
            fontSize: 34,
            textShadow: 'none',
          }}
        >
          {num}
        </span>
        <span>
        {phrase.words.map((w, i) => {
          const active = t >= w.start && t < w.end;
          const spoken = t >= w.end;
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                marginRight: '0.28em',
                color: active ? theme.warm : spoken ? theme.text : 'rgba(245,247,255,0.55)',
                transform: active ? 'scale(1.08)' : 'scale(1)',
                transformOrigin: 'bottom center',
              }}
            >
              {w.text}
            </span>
          );
        })}
        </span>
      </div>
    </AbsoluteFill>
  );
};

const TopBar: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = frame / fps;
  const scene = data.scenes.filter((s) => s.start <= t).at(-1) ?? data.scenes[0];
  const m = scene.section.match(/^Section (\d+):\s*(.*)$/);
  const label = m ? m[2].replace(/^"|"$/g, '') : scene.section;
  const sectionStart = data.scenes.find((s) => s.section === scene.section)!.start;
  const pop = fade(t - sectionStart, [0, 0.6], [0, 1], ease.back);
  const progress = frame / durationInFrames;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          top: 36,
          left: 48,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '10px 26px 10px 10px',
          borderRadius: 999,
          background: 'rgba(11,16,32,0.7)',
          border: '1.5px solid rgba(255,255,255,0.14)',
          fontFamily,
          opacity: fade(t - sectionStart, [0, 0.4]),
          transform: `translateX(${(1 - pop) * -40}px)`,
        }}
      >
        <span
          style={{
            width: 46,
            height: 46,
            borderRadius: 999,
            display: 'grid',
            placeItems: 'center',
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
            color: '#fff',
            fontWeight: 800,
            fontSize: 24,
          }}
        >
          {m ? m[1] : '•'}
        </span>
        <span style={{color: theme.text, fontWeight: 600, fontSize: 28, letterSpacing: 0.3}}>{label}</span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 6, background: 'rgba(255,255,255,0.1)'}}>
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${theme.secondary}, ${theme.primary}, ${theme.accent})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const Subtitled: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <OffthreadVideo src={staticFile(VIDEO_FILE)} />
      <TopBar />
      {data.phrases.map((p, i) => {
        const from = Math.round(p.start * fps);
        const next = data.phrases[i + 1];
        // hold until just before the next phrase (or end) so there are no flickers
        const end = Math.round(Math.min(p.end + 0.25, next ? next.start : p.end + 0.25) * fps);
        const dur = Math.max(1, end - from);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} layout="none">
            <Caption phrase={p as Phrase} durationInFrames={dur} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
