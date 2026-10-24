import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Card, Fade, Hl, K, Mono, Reveal, Serif, Stage, mono, sans, segment, serif, sf, useP, useT} from './kit';

/* ------------------------------------------------------------------ */
/* P1-01 + P1-02  Hook title slam and narrative pills (part 1, s0-s4)  */
/* ------------------------------------------------------------------ */
const HOOK = segment(1, 0, 4);
export const HOOK_FRAMES = HOOK.frames;

const SlamWord: React.FC<{at: number; color?: string; children: string}> = ({at, color = K.ink, children}) => {
  const frame = useCurrentFrame();
  const p = useP(at, 12, 260);
  const since = frame - sf(at);
  const shake = since >= 0 && since < 6 ? Math.sin(since * 2.4) * (6 - since) * 1.6 : 0;
  return (
    <span
      style={{
        display: 'inline-block',
        opacity: Math.min(1, p * 3),
        transform: `translate(${shake}px, ${-shake * 0.6}px) scale(${1.55 - 0.55 * p})`,
        color,
        margin: '0 14px',
      }}
    >
      {children}
    </span>
  );
};

type PillDef = {at: number; end: number; text: string; kind: 'mono' | 'cobalt' | 'serif'};

const Pill: React.FC<{def: PillDef; index: number}> = ({def, index}) => {
  const p = useP(def.at, 14, 180);
  const out = useT(def.end - 0.35, def.end);
  const frame = useCurrentFrame();
  const chars = def.kind === 'mono' ? Math.floor(Math.max(0, frame - sf(def.at)) / 1.6) : def.text.length;
  const text = def.text.slice(0, chars);
  const shake = def.kind === 'cobalt' && frame - sf(def.at) < 8 ? Math.sin(frame * 2.2) * 4 : 0;
  const bg = def.kind === 'cobalt' ? K.cobalt : K.white;
  const fg = def.kind === 'cobalt' ? K.white : K.ink;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 560,
        display: 'flex',
        justifyContent: 'center',
        opacity: Math.min(1, p * 2) * (1 - out),
        transform: `translate(${shake}px, ${(1 - p) * 40 + out * -30}px) scale(${0.9 + 0.1 * p})`,
      }}
    >
      <div style={{textAlign: 'center'}}>
        <div style={{marginBottom: 22}}>
          <Mono size={22}>{`0${index + 1} / 03`}</Mono>
        </div>
        <Card bg={bg} style={{padding: '30px 64px', borderRadius: 999}}>
          {def.kind === 'serif' ? (
            <span style={{fontFamily: serif, fontStyle: 'italic', fontSize: 78, color: fg}}>
              Where is Gemini 3.5 Pro<span style={{color: K.terra}}>?</span>
            </span>
          ) : (
            <span
              style={{
                fontFamily: def.kind === 'mono' ? mono : sans,
                fontWeight: def.kind === 'mono' ? 500 : 800,
                fontSize: def.kind === 'mono' ? 66 : 78,
                color: fg,
              }}
            >
              {text}
              {def.kind === 'mono' && <span style={{opacity: frame % 16 < 8 ? 1 : 0}}>|</span>}
            </span>
          )}
        </Card>
      </div>
    </div>
  );
};

export const ArgonHookTitle: React.FC = () => {
  const p = useP(4.0, 24, 90);
  const pills: PillDef[] = [
    {at: 4.4, end: HOOK.at(2), text: '6 Months of Silence...', kind: 'mono'},
    {at: HOOK.at(2, 0.1), end: HOOK.at(2, 11), text: 'Opus 5.5 Dominating', kind: 'cobalt'},
    {at: HOOK.at(2, 11.3), end: HOOK.seconds - 0.2, text: 'Where is Gemini 3.5 Pro?', kind: 'serif'},
  ];
  const line: React.CSSProperties = {fontFamily: sans, fontWeight: 800, fontSize: 150, lineHeight: 1.08, whiteSpace: 'nowrap'};
  return (
    <Fade frames={HOOK.frames}>
      <Stage>
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translateY(${-p * 305}px) scale(${1 - p * 0.42})`,
          }}
        >
          <div style={{textAlign: 'center'}}>
            <div style={line}>
              <SlamWord at={0.1}>DID</SlamWord>
              <SlamWord at={0.4} color={K.cobalt}>GOOGLE</SlamWord>
              <SlamWord at={0.7}>JUST</SlamWord>
            </div>
            <div style={line}>
              <SlamWord at={1.0}>FLIP</SlamWord>
              <SlamWord at={1.25}>THE</SlamWord>
              <SlamWord at={1.5}>AI</SlamWord>
            </div>
            <div style={line}>
              <Hl at={2.2}>
                <SlamWord at={1.9}>LEADERBOARD?</SlamWord>
              </Hl>
            </div>
          </div>
        </AbsoluteFill>
        {pills.map((d, i) => (
          <Pill key={i} def={d} index={i} />
        ))}
      </Stage>
    </Fade>
  );
};

/* ------------------------------------------------------------------ */
/* P1-07 + P1-06  Split verdict then agenda roadmap (part 1, s8-s10)   */
/* ------------------------------------------------------------------ */
const VERDICT = segment(1, 8, 10);
export const VERDICT_FRAMES = VERDICT.frames;

const Bar: React.FC<{label: string; at: number; to: number; color: string; max?: number}> = ({label, at, to, color, max = 690}) => {
  const t = useT(at, at + 1.1);
  const e = 1 - Math.pow(1 - t, 3);
  return (
    <div style={{marginBottom: 26}}>
      <Mono size={22} color={K.ink}>{label}</Mono>
      <div style={{marginTop: 8, height: 34, width: max, border: `2.5px solid ${K.ink}`, borderRadius: 6, background: K.cream}}>
        <div style={{height: '100%', width: `${to * e * 100}%`, background: color}} />
      </div>
    </div>
  );
};

const AGENDA = [
  {t: 'The real demos', at: 2.4},
  {t: 'The hard benchmark data', at: 4.6},
  {t: 'The independent tests', at: 6.6},
  {t: 'The Antigravity paywall', at: 8.6},
];

const Node: React.FC<{i: number; x: number; at: number; label: string}> = ({i, x, at, label}) => {
  const p = useP(at, 12, 200);
  const last = i === 3;
  const color = last ? K.terra : K.cobalt;
  return (
    <div style={{position: 'absolute', left: x - 190, top: 400, width: 380, textAlign: 'center'}}>
      <div
        style={{
          margin: '0 auto',
          width: 92,
          height: 92,
          borderRadius: '50%',
          border: `3px solid ${K.ink}`,
          background: p > 0.05 ? color : K.white,
          color: K.white,
          fontFamily: mono,
          fontWeight: 700,
          fontSize: 42,
          lineHeight: '86px',
          boxShadow: `5px 5px 0 ${K.ink}`,
          transform: `scale(${0.8 + 0.2 * p + Math.sin(p * Math.PI) * 0.15})`,
        }}
      >
        {p > 0.05 ? i + 1 : ''}
      </div>
      <div style={{marginTop: 34, opacity: 0.25 + 0.75 * p}}>
        <Card badge={last ? 'furious' : undefined} badgeBg={K.terra} style={{padding: '22px 18px', borderRadius: 10}}>
          <span style={{fontWeight: 800, fontSize: 36, lineHeight: 1.15}}>{label}</span>
        </Card>
      </div>
    </div>
  );
};

export const ArgonVerdictAgenda: React.FC = () => {
  const A = VERDICT.at(10);
  const split = useT(A - 0.5, A + 0.3);
  const agenda = useP(A, 20, 120);
  const route = useT(A + 1.4, A + 9.0);
  const frame = useCurrentFrame();
  const xs = [260, 740, 1220, 1700];
  return (
    <Fade frames={VERDICT.frames}>
      <Stage>
        <div style={{position: 'absolute', inset: 0, opacity: 1 - split, transform: `translateY(${-split * 40}px)`}}>
          <div style={{position: 'absolute', top: 70, left: 0, right: 0, textAlign: 'center'}}>
            <Reveal at={0.2}>
              <Serif size={70} color={K.ink}>
                A fascinating <Hl at={1.0}><span style={{fontStyle: 'italic'}}>split.</span></Hl>
              </Serif>
            </Reveal>
          </div>
          <div style={{position: 'absolute', left: 120, top: 300, width: 790}}>
            <Reveal at={0.9}>
              <Card center badge="Structured enterprise & vision" badgeBg={K.green} style={{height: 560}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 24, marginBottom: 34}}>
                  <svg width="84" height="84" viewBox="0 0 84 84">
                    <circle cx="42" cy="42" r="38" fill={K.green} stroke={K.ink} strokeWidth="3" />
                    <path d="M24 44 L37 57 L61 30" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{fontWeight: 800, fontSize: 44, lineHeight: 1.1}}>Blew the competition out of the water</span>
                </div>
                <Bar label="Marketing slides" at={3.2} to={0.92} color={K.green} />
                <Bar label="Real results" at={4.0} to={0.88} color={K.green} />
                <Mono size={18}>illustrative, not measured</Mono>
              </Card>
            </Reveal>
          </div>
          <div style={{position: 'absolute', left: 1010, top: 300, width: 790}}>
            <Reveal at={VERDICT.at(9, 0.2)}>
              <Card center badge="Practical, autonomous dev execution" badgeBg={K.terra} style={{height: 560}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 24, marginBottom: 34}}>
                  <svg width="84" height="84" viewBox="0 0 84 84">
                    <path d="M42 6 L80 76 H4 Z" fill={K.terra} stroke={K.ink} strokeWidth="3" strokeLinejoin="round" />
                    <rect x="38" y="30" width="8" height="26" rx="3" fill="#fff" />
                    <circle cx="42" cy="65" r="4.5" fill="#fff" />
                  </svg>
                  <span style={{fontWeight: 800, fontSize: 44, lineHeight: 1.1}}>A massive gulf</span>
                </div>
                <Bar label="Marketing slides" at={VERDICT.at(9, 2.0)} to={0.92} color={K.ink} />
                <Bar label="What developers experience" at={VERDICT.at(9, 2.8)} to={0.24} color={K.terra} />
                <Mono size={18}>illustrative, not measured</Mono>
              </Card>
            </Reveal>
          </div>
        </div>

        <div style={{position: 'absolute', inset: 0, opacity: agenda}}>
          <div style={{position: 'absolute', top: 130, left: 0, right: 0, textAlign: 'center'}}>
            <Serif size={64} color={K.ink}>
              Today, we&apos;re breaking down <Hl at={A + 0.5}><span style={{fontStyle: 'italic'}}>four things</span></Hl>
            </Serif>
          </div>
          <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
            <path
              d={`M ${xs[0]} 446 L ${xs[3]} 446`}
              stroke={K.ink}
              strokeWidth="4"
              strokeDasharray="14 12"
              strokeDashoffset={-frame * 0.8}
              fill="none"
              opacity="0.9"
              pathLength={1000}
              style={{clipPath: `inset(0 ${100 - route * 100}% 0 0)`}}
            />
            <circle cx={xs[0] + (xs[3] - xs[0]) * route} cy="446" r="12" fill={K.yellow} stroke={K.ink} strokeWidth="3" opacity={route > 0 && route < 1 ? 1 : 0} />
          </svg>
          {AGENDA.map((a, i) => (
            <Node key={i} i={i} x={xs[i]} at={A + a.at} label={a.t} />
          ))}
        </div>
      </Stage>
    </Fade>
  );
};
