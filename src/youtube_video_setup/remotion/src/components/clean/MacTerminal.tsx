import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

type Props = {
  title?: string;
  command?: string;
  outputLines?: {text: string; color?: string}[];
  startFrame?: number;
  width?: number | string;
};

export const MacTerminal: React.FC<Props> = ({
  title = 'zsh — ollama run qwen2.5-coder',
  command = 'ollama run qwen2.5-coder:7b',
  outputLines = [],
  startFrame = 0,
  width = '100%',
}) => {
  const frame = useCurrentFrame();
  const relFrame = Math.max(0, frame - startFrame);

  // Typewriter effect for command: 1 char every 1.5 frames
  const charsCount = Math.floor(interpolate(relFrame, [5, 5 + command.length * 1.5], [0, command.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }));
  const typedCommand = command.slice(0, charsCount);
  const isTypingDone = charsCount === command.length;

  // Blinking cursor
  const cursorVisible = Math.floor(relFrame / 10) % 2 === 0;

  return (
    <div
      style={{
        width,
        borderRadius: 18,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
        fontFamily: '"JetBrains Mono", Menlo, Monaco, monospace',
      }}
    >
      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          background: 'rgba(255, 255, 255, 0.04)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
          <div style={{width: 13, height: 13, borderRadius: '50%', background: '#FF5F56'}} />
          <div style={{width: 13, height: 13, borderRadius: '50%', background: '#FFBD2E'}} />
          <div style={{width: 13, height: 13, borderRadius: '50%', background: '#27C93F'}} />
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: '#94A3B8',
            letterSpacing: '0.02em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '70%',
          }}
        >
          {title}
        </div>
        <div style={{width: 48}} />
      </div>

      {/* Terminal Body */}
      <div
        style={{
          padding: '24px 24px',
          minHeight: 140,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          fontSize: 22,
          lineHeight: 1.5,
        }}
      >
        {/* Command line */}
        <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8}}>
          <span style={{color: '#10B981', fontWeight: 700}}>$</span>
          <span style={{color: '#F8FAFC', fontWeight: 600}}>{typedCommand}</span>
          {!isTypingDone && cursorVisible && (
            <span
              style={{
                display: 'inline-block',
                width: 10,
                height: 22,
                background: '#06B6D4',
                marginLeft: 2,
              }}
            />
          )}
        </div>

        {/* Output lines displayed when command finishes typing */}
        {isTypingDone &&
          outputLines.map((line, idx) => {
            const lineDelay = 5 + command.length * 1.5 + idx * 8;
            const lineOpacity = interpolate(relFrame, [lineDelay, lineDelay + 6], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            if (relFrame < lineDelay) return null;

            return (
              <div
                key={idx}
                style={{
                  opacity: lineOpacity,
                  color: line.color || '#94A3B8',
                  fontSize: 18,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                {line.text}
              </div>
            );
          })}
      </div>
    </div>
  );
};

