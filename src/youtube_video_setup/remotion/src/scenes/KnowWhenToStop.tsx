import React from 'react';
import {AbsoluteFill, interpolate, interpolateColors, useCurrentFrame} from 'remotion';
import {colors, fonts} from '../colors';

const LINES = ['agent.execute({', '  objective,', '  bounds: "STRICT",', '  allowOverride: false', '});', '// Know when to stop.'];
const START = 15;
const CODE_SPEED = 1.5; // frames per char
const COMMENT_SPEED = 3.2;
const KW = /(agent\.execute|objective|bounds|allowOverride|false)/;

const codeChars = LINES.slice(0, 5).reduce((s, l) => s + l.length + 1, 0);
const COMMENT_START = START + codeChars * CODE_SPEED + 14;

const charsAt = (frame: number) => {
  if (frame < START) return 0;
  const main = Math.min(codeChars, Math.floor((frame - START) / CODE_SPEED));
  const comment = frame < COMMENT_START ? 0 : Math.floor((frame - COMMENT_START) / COMMENT_SPEED);
  return {main, comment: Math.min(LINES[5].length, comment)};
};

const Code: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const c = charsAt(frame) || {main: 0, comment: 0};
  const fade = interpolate(frame, [durationInFrames - 30, durationInFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const commentColor = interpolateColors(frame, [COMMENT_START, COMMENT_START + LINES[5].length * COMMENT_SPEED], [colors.white, colors.amber]);
  let left = c.main;
  const typingComment = frame >= COMMENT_START;
  const cursorBlink = Math.floor(frame / 15) % 2 === 0;

  const cursor = <span style={{display: 'inline-block', width: 22, height: 44, marginLeft: 4, background: colors.white, verticalAlign: 'middle', opacity: cursorBlink ? 0.9 : 0}} />;

  return (
    <AbsoluteFill style={{background: colors.bg, fontFamily: fonts.mono}}>
      <div style={{position: 'absolute', left: 400, top: 330, opacity: fade, fontSize: 36, lineHeight: '58px', color: colors.white}}>
        {LINES.slice(0, 5).map((line, i) => {
          const take = Math.max(0, Math.min(line.length, left));
          const isCursorLine = !typingComment && take < line.length + 1 && left >= 0 && left <= line.length;
          left -= line.length + 1;
          return (
            <div key={i} style={{whiteSpace: 'pre', height: 58}}>
              {line
                .slice(0, take)
                .split(KW)
                .map((part, k) => (
                  <span key={k} style={{color: KW.test(part) && part.length > 2 ? colors.cyan : colors.white}}>
                    {part}
                  </span>
                ))}
              {isCursorLine && frame >= START && cursor}
            </div>
          );
        })}
        <div style={{whiteSpace: 'pre', height: 58, color: commentColor}}>
          {LINES[5].slice(0, c.comment)}
          {typingComment && cursor}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const KnowWhenToStop: React.FC<{durationInFrames?: number}> = ({durationInFrames = 270}) => <Code durationInFrames={durationInFrames} />;
