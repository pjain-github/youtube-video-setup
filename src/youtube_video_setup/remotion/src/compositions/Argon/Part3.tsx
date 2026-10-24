import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Card, Fade, Header, Hl, K, Mono, Reveal, Serif, Stage, mono, segment, sf, useCount, useP, useT} from './kit';

/* ------------------------------------------------------------------ */
/* P3-02 + P3-03  Benchmark scorecards (part 3, s0-s6)                 */
/* ------------------------------------------------------------------ */
const BM = segment(3, 0, 6);
export const BENCH_FRAMES = BM.frames;

const Duel: React.FC<{label: string; at: number; to: number; value: string; color: string; max: number}> = ({label, at, to, value, color, max}) => {
  const t = useT(at, at + 1.4);
  const e = 1 - Math.pow(1 - t, 3);
  const shown = (parseFloat(value) * e).toFixed(1);
  return (
    <div style={{marginBottom: 20}}>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <Mono size={22} color={K.ink}>{label}</Mono>
        <span style={{fontWeight: 800, fontSize: 40, color}}>{shown}%</span>
      </div>
      <div style={{height: 36, border: `3px solid ${K.ink}`, borderRadius: 6, background: K.cream, marginTop: 6}}>
        <div style={{height: '100%', width: `${(to / max) * e * 100}%`, background: color}} />
      </div>
    </div>
  );
};

const Ring: React.FC<{at: number; pct: number}> = ({at, pct}) => {
  const t = useT(at, at + 1.6);
  const e = 1 - Math.pow(1 - t, 3);
  const r = 78;
  const c = 2 * Math.PI * r;
  const val = useCount(at, at + 1.6, pct, 1);
  return (
    <div style={{position: 'relative', width: 200, height: 200}}>
      <svg width="200" height="200" viewBox="0 0 200 200" style={{transform: 'rotate(-90deg)'}}>
        <circle cx="100" cy="100" r={r} stroke={K.cream} strokeWidth="26" fill="none" />
        <circle cx="100" cy="100" r={r} stroke={K.ink} strokeWidth="30" fill="none" opacity="0.08" />
        <circle cx="100" cy="100" r={r} stroke={K.cobalt} strokeWidth="24" fill="none" strokeDasharray={c} strokeDashoffset={c * (1 - (pct / 100) * e)} strokeLinecap="butt" />
      </svg>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 44}}>{val}%</div>
    </div>
  );
};

export const ArgonBenchmarks: React.FC = () => {
  const vals = BM.at(1, 0);
  const harvey = BM.at(3, 0.2);
  const auto = BM.at(4, 0);
  const swe = BM.at(6, 0);
  const cardH = 340;
  return (
    <Fade frames={BM.frames}>
      <Stage>
        <Header tag="Official benchmark cards" lead={<>Argon looks like an absolute <Hl at={1.2}>monster</Hl></>} />
        <div style={{position: 'absolute', left: 120, top: 290, width: 810}}>
          <Reveal at={vals}>
            <Card center badge="The Vals Index" badgeBg={K.green} style={{height: cardH}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
                <div style={{fontWeight: 800, fontSize: 150, lineHeight: 1, color: K.green}}>#1</div>
                <div>
                  <div style={{fontWeight: 800, fontSize: 40, lineHeight: 1.15}}>Ranked overall</div>
                  <div style={{marginTop: 10}}>
                    <Serif size={32}>across enterprise finance, tax, and coding</Serif>
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
        <div style={{position: 'absolute', left: 990, top: 290, width: 810}}>
          <Reveal at={harvey}>
            <Card center badge="Harvey's Legal Agent Benchmark" badgeBg={K.ink} style={{height: cardH}}>
              <div style={{marginTop: 8}}>
                <Duel label="Gemini 4 Argon" at={harvey + 0.4} to={19.6} value="19.6" color={K.green} max={25} />
                <Duel label="Claude Opus 5.5" at={harvey + 2.2} to={3.8} value="3.8" color={K.muted} max={25} />
              </div>
            </Card>
          </Reveal>
        </div>
        <div style={{position: 'absolute', left: 120, top: 670, width: 810}}>
          <Reveal at={auto}>
            <Card center badge="AutomationBench" badgeBg={K.terra} style={{height: cardH}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
                <div style={{fontWeight: 800, fontSize: 130, lineHeight: 1}}>{useCount(auto + 0.2, auto + 1.8, 51.3, 1)}%</div>
                <div>
                  <Card bg={K.yellow} style={{padding: '8px 20px', borderRadius: 999, boxShadow: `4px 4px 0 ${K.ink}`, display: 'inline-block'}}>
                    <span style={{fontFamily: mono, fontWeight: 700, fontSize: 26, textTransform: 'uppercase'}}>Record</span>
                  </Card>
                  <div style={{marginTop: 18}}>
                    <Serif size={32}>complex enterprise software automations</Serif>
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
        <div style={{position: 'absolute', left: 990, top: 670, width: 810}}>
          <Reveal at={swe}>
            <Card center badge="DeepSWE Agentic Coding" badgeBg={K.cobalt} style={{height: cardH}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 36}}>
                <Ring at={swe + 0.2} pct={77.9} />
                <div>
                  <div style={{fontWeight: 800, fontSize: 40, lineHeight: 1.15}}>Leads competing frontier baselines</div>
                  <div style={{marginTop: 10}}>
                    <Serif size={30}>per Google&apos;s model card</Serif>
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </Stage>
    </Fade>
  );
};

/* ------------------------------------------------------------------ */
/* P3-07  Terminal-Bench head to head (part 3, s14-s15)                */
/* ------------------------------------------------------------------ */
const TB = segment(3, 14, 15);
export const TERMINAL_FRAMES = TB.frames;

const HBar: React.FC<{label: string; value: number; at: number; color: string; textColor?: string}> = ({label, value, at, color, textColor = K.white}) => {
  const t = useT(at, at + 1.5);
  const e = 1 - Math.pow(1 - t, 3);
  const w = 1080;
  return (
    <Reveal at={at - 0.3}>
      <div style={{marginBottom: 38}}>
        <Mono size={28} color={K.ink}>{label}</Mono>
        <div style={{display: 'flex', alignItems: 'center', gap: 28, marginTop: 10}}>
          <div style={{width: w, height: 96, border: `3px solid ${K.ink}`, borderRadius: 10, background: K.white, boxShadow: `6px 6px 0 ${K.ink}`}}>
            <div style={{width: `${value * e}%`, height: '100%', background: color, borderRadius: 6}} />
          </div>
          <span style={{fontWeight: 800, fontSize: 86, color: textColor === K.white ? color : K.ink}}>{(value * e).toFixed(1)}%</span>
        </div>
      </div>
    </Reveal>
  );
};

export const ArgonTerminalBench: React.FC = () => {
  const frame = useCurrentFrame();
  const opus = TB.at(14, 10.4);
  const argon = TB.at(14, 12.8);
  const gap = useP(TB.at(14, 14.6), 14, 170);
  const edge = TB.at(15, 3.2);
  return (
    <Fade frames={TB.frames}>
      <Stage>
        <div style={{position: 'absolute', left: 120, top: 70}}>
          <Reveal at={2.4}>
            <div style={{fontFamily: mono, fontWeight: 700, fontSize: 70}}>
              $ terminal-bench 4.0<span style={{opacity: frame % 20 < 10 ? 1 : 0}}>_</span>
            </div>
          </Reveal>
          <Reveal at={4.6}>
            <Serif size={48}>practical, daily command-line problem-solving</Serif>
          </Reveal>
        </div>
        <div style={{position: 'absolute', left: 120, top: 330}}>
          <HBar label="Claude Opus 5.5" value={66.4} at={opus} color={K.cobalt} />
          <HBar label="Gemini 4 Argon" value={57.4} at={argon} color={K.terra} />
        </div>
        <div style={{position: 'absolute', left: 1590, top: 440, opacity: gap, transform: `scale(${0.8 + 0.2 * gap})`}}>
          <Card bg={K.yellow} style={{padding: '14px 24px', boxShadow: `5px 5px 0 ${K.ink}`}}>
            <span style={{fontFamily: mono, fontWeight: 700, fontSize: 40}}>-9.0 pts</span>
          </Card>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 800, textAlign: 'center'}}>
          <Reveal at={edge - 0.4}>
            <Serif size={64} color={K.ink}>
              Anthropic still maintains <Hl at={edge + 0.6}>the edge</Hl>
            </Serif>
          </Reveal>
        </div>
      </Stage>
    </Fade>
  );
};
