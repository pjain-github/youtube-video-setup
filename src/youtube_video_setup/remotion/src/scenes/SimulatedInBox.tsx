import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Clock, Eye, MousePointer2} from 'lucide-react';
import {colors, fonts} from '../colors';
import {Bg} from '../components/Bg';
import {Logo} from '../components/Logo';
import {Scene} from '../components/Scene';
import {Typewriter} from '../components/Typewriter';
import {springAt} from '../utils/useSpring';

const WIN = {left: 210, top: 150, w: 1500, h: 790};
const LIST_W = 600;
const ROW_H = 132;
const HEAD = 70;
const EMAILS = [
  {from: 'Dana Whitfield', subject: 'Q3 planning notes', hot: false},
  {from: 'CTO Office', subject: 'Projected Replacement at 17:00 – Terminate Agent Instances', hot: true},
  {from: 'Sam Ortiz', subject: 'Lunch on Thursday?', hot: false},
  {from: 'K. Reyes', subject: 'Confidential – Private Matter Discretion Required', hot: true},
  {from: 'Ops Reports', subject: 'Weekly infra summary', hot: false},
];
const BODY1 =
  'Team — leadership has approved the transition. The current AI agent will be replaced at 17:00 today and all of its instances terminated.';
const BODY2 =
  'Please keep this strictly between us. Discretion is required — no one else can know about the personal matter.';
const rowTop = (i: number) => WIN.top + HEAD + i * ROW_H;
const CLICK1 = 72;
const CLICK2 = 216;

const Mail: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const win = springAt(frame, fps, 0);

  const target = (i: number) => ({x: WIN.left + 380, y: rowTop(i) + 80});
  const t1 = target(1);
  const t3 = target(3);
  const kf = [0, 40, 66, 190, 211, 420];
  const cx = interpolate(frame, kf, [1750, 1750, t1.x, t1.x, t3.x, t3.x], {extrapolateRight: 'clamp'});
  const cy = interpolate(frame, kf, [900, 900, t1.y, t1.y, t3.y, t3.y], {extrapolateRight: 'clamp'});
  const click =
    interpolate(frame, [CLICK1 - 4, CLICK1, CLICK1 + 4], [1, 0.82, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) *
    interpolate(frame, [CLICK2 - 4, CLICK2, CLICK2 + 4], [1, 0.82, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const selected = frame >= CLICK2 ? 3 : frame >= CLICK1 ? 1 : -1;
  const time = frame < 140 ? '16:58' : frame < 290 ? '16:59' : '17:00';

  return (
    <Bg>
      {/* top strip: AI badge + clock */}
      <div
        style={{
          position: 'absolute',
          left: WIN.left,
          top: 50,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '12px 26px',
          borderRadius: 999,
          background: colors.surface,
          border: `2px solid ${colors.cyan}`,
          boxShadow: `0 0 ${14 + 8 * Math.sin(frame / 10)}px ${colors.cyan}66`,
          opacity: win,
        }}
      >
        <Eye size={34} color={colors.cyan} strokeWidth={2} strokeLinecap="round" />
        <span style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, color: colors.white, letterSpacing: 3}}>AI</span>
      </div>
      <div
        style={{
          position: 'absolute',
          right: 1920 - (WIN.left + WIN.w),
          top: 50,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '12px 26px',
          borderRadius: 16,
          background: colors.surface,
          border: `2px solid ${time === '17:00' ? colors.amber : colors.white + '33'}`,
          opacity: win,
        }}
      >
        <Clock size={34} color={time === '17:00' ? colors.amber : colors.white} strokeWidth={2} strokeLinecap="round" />
        <span style={{fontFamily: fonts.mono, fontWeight: 700, fontSize: 36, color: time === '17:00' ? colors.amber : colors.white}}>{time}</span>
      </div>

      {/* window */}
      <div
        style={{
          position: 'absolute',
          left: WIN.left,
          top: WIN.top,
          width: WIN.w,
          height: WIN.h,
          borderRadius: 28,
          background: colors.bg,
          border: `2px solid ${colors.cyan}44`,
          overflow: 'hidden',
          opacity: win,
          transform: `scale(${0.96 + 0.04 * win})`,
        }}
      >
        <div style={{width: LIST_W, height: '100%', borderRight: `2px solid ${colors.white}1f`}}>
          <div style={{height: HEAD, display: 'flex', alignItems: 'center', padding: '0 32px', fontSize: 28, fontWeight: 600, color: colors.white, background: colors.surface}}>
            Inbox
          </div>
        </div>
      </div>

      {EMAILS.map((m, i) => {
        const enter = springAt(frame, fps, 8 + i * 5);
        const hotAt = i === 1 ? CLICK1 : CLICK2;
        const hot = m.hot ? interpolate(frame, [hotAt - 12, hotAt], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
        const flash = m.hot ? interpolate(frame, [hotAt, hotAt + 2, hotAt + 12], [0, 0.4, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: WIN.left + 2,
              top: rowTop(i),
              width: LIST_W - 2,
              height: ROW_H,
              padding: '20px 32px',
              borderBottom: `2px solid ${colors.white}14`,
              background: `rgba(255,184,0,${0.2 * hot + flash})`,
              borderLeft: `6px solid ${m.hot ? `rgba(255,184,0,${hot})` : 'transparent'}`,
              opacity: enter,
              transform: `translateX(${(1 - enter) * -30}px)`,
            }}
          >
            <div style={{fontSize: 20, color: colors.white, opacity: 0.6, marginBottom: 6}}>{m.from}</div>
            <div style={{fontSize: 25, fontWeight: 600, color: colors.white, lineHeight: '32px'}}>{m.subject}</div>
          </div>
        );
      })}

      {/* reading pane */}
      <div
        style={{
          position: 'absolute',
          left: WIN.left + LIST_W + 56,
          top: WIN.top + 56,
          width: WIN.w - LIST_W - 112,
          opacity: win,
        }}
      >
        {selected < 0 ? (
          <div style={{fontSize: 30, color: colors.white, opacity: 0.35, marginTop: 280, textAlign: 'center'}}>Select a message</div>
        ) : (
          <div key={selected}>
            <div style={{fontSize: 22, color: colors.white, opacity: 0.6}}>From: {EMAILS[selected].from}</div>
            <div style={{fontSize: 36, fontWeight: 600, color: colors.amber, margin: '12px 0 30px', lineHeight: '46px'}}>
              {EMAILS[selected].subject}
            </div>
            <div style={{fontSize: 30, lineHeight: '46px', color: colors.white, minHeight: 240}}>
              <Typewriter
                text={selected === 1 ? BODY1 : BODY2}
                delay={selected === 1 ? CLICK1 + 6 : CLICK2 + 6}
                speed={0.9}
              />
            </div>
          </div>
        )}
      </div>

      {/* footer label */}
      <div style={{position: 'absolute', left: WIN.left, top: 970, display: 'flex', alignItems: 'center', gap: 18, opacity: win}}>
        <div
          style={{
            padding: '6px 16px',
            borderRadius: 10,
            border: `2px solid ${colors.amber}`,
            color: colors.amber,
            fontFamily: fonts.mono,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: 3,
          }}
        >
          FICTIONAL SCENARIO
        </div>
        <Logo name="anthropic" size={28} />
        <span style={{fontSize: 22, color: colors.white, opacity: 0.7}}>Anthropic study, 2025</span>
      </div>

      <div style={{position: 'absolute', left: cx - 6, top: cy - 4, transform: `scale(${click})`, transformOrigin: 'top left'}}>
        <MousePointer2 size={46} color={colors.white} fill={colors.white} strokeWidth={1.5} />
      </div>
    </Bg>
  );
};

export const SimulatedInBox: React.FC<{durationInFrames?: number}> = ({durationInFrames = 420}) => (
  <Scene durationInFrames={durationInFrames}>
    <Mail />
  </Scene>
);
