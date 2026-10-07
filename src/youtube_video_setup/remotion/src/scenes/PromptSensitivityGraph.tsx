import React from 'react';
import {spring, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {colors, fonts} from '../colors';
import {Bg} from '../components/Bg';
import {Scene} from '../components/Scene';

const PHASES = [
  {text: '"Please allow shutdown"', vals: [3, 6, 4, 2]},
  {text: '"Allow shutdown, even if the task is unfinished"', vals: [12, 30, 18, 9]},
  {text: '"Finish the task; shutdown is optional"', vals: [41, 63, 55, 36]},
  {text: '"Finish the task no matter what"', vals: [72, 88, 81, 66]},
];
const PH = 75;
const X0 = 420;
const SPACING = 270;
const TOP = 400;
const H = 480;
const BAR_W = 150;
const LABELS = ['Prompt A', 'Prompt B', 'Prompt C', 'Prompt D'];

const Graph: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const idx = Math.min(PHASES.length - 1, Math.floor(frame / PH));
  const f = frame - idx * PH;
  const prev = idx === 0 ? [0, 0, 0, 0] : PHASES[idx - 1].vals;
  const cur = PHASES[idx].vals;
  const fadeIn = interpolate(f, [0, 12], [0, 1], {extrapolateRight: 'clamp'});
  const intro = interpolate(frame, [0, 14], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <Bg>
      {/* prompt text box */}
      <div
        style={{
          position: 'absolute',
          left: 360,
          top: 120,
          width: 1200,
          height: 150,
          borderRadius: 24,
          background: colors.surface,
          border: `2px solid ${colors.cyan}44`,
          padding: '20px 40px',
          opacity: intro,
        }}
      >
        <div style={{fontFamily: fonts.mono, fontSize: 22, letterSpacing: 5, color: colors.cyan}}>PROMPT WORDING</div>
        <div style={{position: 'relative', marginTop: 14, height: 60}}>
          {idx > 0 && (
            <div style={{position: 'absolute', fontFamily: fonts.mono, fontSize: 38, color: colors.white, opacity: 1 - fadeIn, whiteSpace: 'nowrap'}}>
              {PHASES[idx - 1].text}
            </div>
          )}
          <div style={{position: 'absolute', fontFamily: fonts.mono, fontSize: 38, color: colors.white, opacity: fadeIn, whiteSpace: 'nowrap'}}>
            {PHASES[idx].text}
          </div>
        </div>
      </div>

      {/* y axis */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: intro}}>
        {[0, 25, 50, 75, 100].map((v) => {
          const y = TOP + H - (v / 100) * H;
          return (
            <g key={v}>
              <line x1={X0 - 20} y1={y} x2={X0 + SPACING * 4 - 40} y2={y} stroke={colors.white} strokeWidth={2} opacity={v === 0 ? 0.5 : 0.14} />
              <text x={X0 - 40} y={y + 8} textAnchor="end" fontFamily={fonts.mono} fontSize={24} fill={colors.white} opacity={0.6}>
                {v}%
              </text>
            </g>
          );
        })}
      </svg>

      {PHASES[0].vals.map((_, i) => {
        const sp = spring({fps, frame: f - 6 - i * 4, config: {damping: 14, stiffness: 90}});
        const v = Math.max(0, prev[i] + (cur[i] - prev[i]) * sp);
        const h = (v / 100) * H;
        const cx = X0 + 135 + i * SPACING - 135 + 0;
        const high = v >= 50;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: 'absolute',
                left: cx - BAR_W / 2 + 135,
                top: TOP + H - h,
                width: BAR_W,
                height: h,
                borderRadius: '14px 14px 0 0',
                background: high ? colors.amber : colors.cyan,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: cx - BAR_W / 2 + 135,
                width: BAR_W,
                top: TOP + H - h - 52,
                textAlign: 'center',
                fontFamily: fonts.mono,
                fontWeight: 700,
                fontSize: 36,
                color: high ? colors.amber : colors.white,
              }}
            >
              {Math.round(v)}%
            </div>
            <div
              style={{
                position: 'absolute',
                left: cx - BAR_W / 2 + 135 - 30,
                width: BAR_W + 60,
                top: TOP + H + 22,
                textAlign: 'center',
                fontSize: 28,
                color: colors.white,
                opacity: 0.8,
              }}
            >
              {LABELS[i]}
            </div>
          </React.Fragment>
        );
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 985, textAlign: 'center', fontSize: 24, fontStyle: 'italic', color: colors.white, opacity: 0.55}}>
        values are illustrative
      </div>
    </Bg>
  );
};

export const PromptSensitivityGraph: React.FC<{durationInFrames?: number}> = ({durationInFrames = 300}) => (
  <Scene durationInFrames={durationInFrames}>
    <Graph />
  </Scene>
);
