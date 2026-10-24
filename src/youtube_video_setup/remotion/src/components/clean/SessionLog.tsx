import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

export type LogLine = {time: string; tag: string; text: string; color?: string};

type Props = {
  lines: LogLine[];
  title?: string;
  startFrame?: number;
  linesPerSecond?: number;
  fps?: number;
  height?: number;
  width?: number | string;
};

export const DUET_LOG: LogLine[] = [
  {time: '02:14:07', tag: 'slack', text: 'scanned 41 new messages', color: '#38BDF8'},
  {time: '02:14:09', tag: 'github', text: 'PR #482 reviewed: 2 comments', color: '#A78BFA'},
  {time: '02:31:44', tag: 'calendar', text: 'flight conflict detected', color: '#F59E0B'},
  {time: '02:31:46', tag: 'calendar', text: 'rescheduled meeting 09:00 → 11:30', color: '#34D399'},
  {time: '03:02:10', tag: 'gmail', text: 'drafted reply to Sarah', color: '#F472B6'},
  {time: '03:02:11', tag: 'gate', text: 'send blocked: awaiting user tap', color: '#EF4444'},
  {time: '05:48:52', tag: 'brief', text: 'morning brief assembled', color: '#D97757'},
  {time: '06:42:00', tag: 'push', text: 'notified user', color: '#34D399'},
];

/**
 * Illustrative agent session log that keeps auto-scrolling.
 * Dummy data, not a real log.
 */
export const SessionLog: React.FC<Props> = ({
  lines,
  title = 'duet-vm-01 — agent log',
  startFrame = 0,
  linesPerSecond = 3,
  fps = 30,
  height = 520,
  width = '100%',
}) => {
  const frame = useCurrentFrame();
  const rel = Math.max(0, frame - startFrame);
  const rowH = 44;
  const progress = (rel * linesPerSecond) / fps;
  const shown = Math.min(Math.floor(progress) + 1, lines.length);
  const rows = Math.floor((height - 130) / rowH);
  // Continuous scroll once the log is longer than the viewport
  const offset = Math.max(0, Math.min(progress, lines.length) - rows + 1) * rowH;
  const cursorOn = Math.floor(rel / 15) % 2 === 0;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 22,
        background: '#14110F',
        border: '1px solid rgba(245,158,11,0.35)',
        boxShadow: '0 20px 50px rgba(245,158,11,0.18)',
        overflow: 'hidden',
        fontFamily: '"JetBrains Mono", Menlo, monospace',
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px', background: 'rgba(255,255,255,0.05)'}}>
        <div style={{width: 13, height: 13, borderRadius: '50%', background: '#FF5F56'}} />
        <div style={{width: 13, height: 13, borderRadius: '50%', background: '#FFBD2E'}} />
        <div style={{width: 13, height: 13, borderRadius: '50%', background: '#27C93F'}} />
        <div style={{flex: 1, textAlign: 'center', fontSize: 15, color: '#A8A29E'}}>{title}</div>
      </div>
      <div style={{padding: '14px 22px', height: height - 52, overflow: 'hidden'}}>
        <div style={{transform: `translateY(${-offset}px)`}}>
          {lines.slice(0, shown).map((l, i) => {
            const born = (i * fps) / linesPerSecond;
            const op = interpolate(rel, [born, born + 5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            return (
              <div key={i} style={{height: rowH, display: 'flex', gap: 14, alignItems: 'center', fontSize: 21, opacity: op, whiteSpace: 'nowrap'}}>
                <span style={{color: '#78716C'}}>{l.time}</span>
                <span style={{color: l.color ?? '#F59E0B', fontWeight: 700, minWidth: 110}}>[{l.tag}]</span>
                <span style={{color: '#E7E5E4'}}>{l.text}</span>
              </div>
            );
          })}
          <div style={{height: rowH, display: 'flex', alignItems: 'center'}}>
            <span style={{color: '#F59E0B', opacity: cursorOn ? 1 : 0}}>▌</span>
          </div>
        </div>
      </div>
    </div>
  );
};
