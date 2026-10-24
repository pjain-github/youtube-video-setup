import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Card, Fade, Hl, K, Mono, Reveal, Serif, Stage, mono, sans, segment, sf, useP, useT} from './kit';

/* ------------------------------------------------------------------ */
/* P6-02 + P6-03  End screen: video slot, subscribe, comment prompt    */
/* (part 6, s2-s4 plus a short tail)                                   */
/* ------------------------------------------------------------------ */
const END = segment(6, 2, 4, 3.0);
export const END_FRAMES = END.frames;

export const ArgonEndScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const click = END.at(4, 0.8);
  const clicked = useP(click, 10, 260);
  const press = Math.max(0, 1 - Math.abs(frame - sf(click)) / 4);
  const bell = useT(click + 0.3, click + 1.5);
  const swing = Math.sin(bell * 18) * (1 - bell) * 24;
  const pulse = (period: number, offset = 0) => 1 + 0.03 * Math.sin((frame / 30 + offset) * Math.PI * 2 / period);
  const cA = END.at(3, 0.2);
  const cB = END.at(3, 0.9);
  const active = Math.floor((frame / 30 - END.at(3, 2)) / 2) % 2;
  return (
    <Fade frames={END.frames}>
      <Stage>
        <div style={{position: 'absolute', left: 90, top: 150}}>
          <Reveal at={0.3}>
            <Card badge="Watch next" badgeBg={K.cobalt} style={{width: 1000, height: 610, background: K.cream, borderStyle: 'dashed', transform: `scale(${pulse(3.2)})`}}>
              <div style={{position: 'absolute', inset: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
                <Mono size={26}>Video card slot</Mono>
                <div style={{fontWeight: 800, fontSize: 52, lineHeight: 1.12, marginTop: 14}}>
                  How to generate <Hl at={1.4}>viral music</Hl> &amp; automated 2D animations using Claude Code
                </div>
                <div style={{marginTop: 16}}>
                  <Serif size={34}>(place the clickable YouTube end-screen element here)</Serif>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
        <div style={{position: 'absolute', left: 1180, top: 150, width: 650}}>
          <Reveal at={END.at(2, 1.0)}>
            <Card badge="Bytesplained" badgeBg={K.ink} style={{height: 610}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 6}}>
                <div style={{width: 120, height: 120, borderRadius: '50%', background: K.yellow, border: `3px solid ${K.ink}`, boxShadow: `5px 5px 0 ${K.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: sans, fontWeight: 800, fontSize: 72}}>
                  B
                </div>
                <div>
                  <div style={{fontWeight: 800, fontSize: 52}}>Bytesplained</div>
                  <Serif size={32}>technical breakdowns</Serif>
                </div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 56}}>
                <div style={{transform: `scale(${1 - press * 0.06}) translate(${press * 4}px, ${press * 4}px)`}}>
                  <div
                    style={{
                      background: clicked > 0.5 ? K.white : K.terra,
                      color: clicked > 0.5 ? K.ink : K.white,
                      border: `3px solid ${K.ink}`,
                      borderRadius: 999,
                      padding: '20px 46px',
                      fontWeight: 800,
                      fontSize: 48,
                      boxShadow: `${5 - press * 3}px ${5 - press * 3}px 0 ${K.ink}`,
                    }}
                  >
                    {clicked > 0.5 ? 'Subscribed ✓' : 'Subscribe'}
                  </div>
                </div>
                <svg width="76" height="76" viewBox="0 0 76 76" style={{transformOrigin: '38px 8px', transform: `rotate(${swing}deg)`}}>
                  <path d="M38 8 C22 8 18 22 18 36 C18 50 10 54 10 58 H66 C66 54 58 50 58 36 C58 22 54 8 38 8 Z" fill={clicked > 0.5 ? K.yellow : K.white} stroke={K.ink} strokeWidth="4" strokeLinejoin="round" />
                  <path d="M30 62 C30 68 46 68 46 62" fill="none" stroke={K.ink} strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>
              <div style={{marginTop: 44}}>
                <Mono size={24} color={K.ink}>More technical breakdowns, every week</Mono>
              </div>
            </Card>
          </Reveal>
        </div>
        <div style={{position: 'absolute', left: 90, right: 90, top: 820, display: 'flex', gap: 50, alignItems: 'center'}}>
          <Reveal at={END.at(3, -0.4)}>
            <Serif size={46} color={K.ink}>Drop a comment:</Serif>
          </Reveal>
          <Reveal at={cA} style={{flex: 1}}>
            <Card bg={active === 0 ? K.yellow : K.white} style={{padding: '22px 30px', transform: `scale(${active === 0 ? 1.03 : 1})`}}>
              <span style={{fontWeight: 800, fontSize: 40}}>Switching from Claude?</span>
            </Card>
          </Reveal>
          <Reveal at={cB} style={{flex: 1}}>
            <Card bg={active === 1 ? K.yellow : K.white} style={{padding: '22px 30px', transform: `scale(${active === 1 ? 1.03 : 1})`}}>
              <span style={{fontWeight: 800, fontSize: 40}}>Antigravity limits in the way?</span>
            </Card>
          </Reveal>
        </div>
      </Stage>
    </Fade>
  );
};

/* ------------------------------------------------------------------ */
/* G-01  Chapter title cards (one composition per part)                */
/* ------------------------------------------------------------------ */
export const CHAPTER_FRAMES = sf(3.5);
export const CHAPTERS = [
  {n: 1, pre: 'The', hl: 'Hook', sub: 'Is Google back?'},
  {n: 2, pre: 'The Launch', hl: 'Demos', sub: 'What can it actually do?'},
  {n: 3, pre: 'Benchmarks vs.', hl: 'Independent Tests', sub: 'Official cards against the real world'},
  {n: 4, pre: 'Pricing & The', hl: 'Quota Backlash', sub: 'Great API economics, tight Antigravity limits'},
  {n: 5, pre: 'Where Does Google', hl: 'Stand?', sub: 'The AI race verdict'},
  {n: 6, pre: 'Next', hl: 'Steps', sub: 'Build with agents yourself'},
];

export const ArgonChapter: React.FC<{n: number; label?: number; total?: number; secs?: number}> = ({n, label = n, total = 6, secs = CHAPTER_FRAMES / 30}) => {
  const c = CHAPTERS[n - 1];
  const line = useT(0.1, 0.7);
  const out = useT(secs - 0.5, secs);
  return (
    <Stage>
      <div style={{position: 'absolute', left: 140, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: 1 - out, transform: `translateX(${-out * 120}px)`}}>
        <Reveal at={0.2}>
          <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
            <div style={{background: K.ink, color: K.white, fontFamily: mono, fontWeight: 700, fontSize: 26, padding: '8px 22px', borderRadius: 999, letterSpacing: 2}}>
              PART {label} OF {total}
            </div>
            <div style={{display: 'flex', gap: 8}}>
              {Array.from({length: total}, (_, k) => k + 1).map((i) => (
                <div key={i} style={{width: 54, height: 12, border: `2.5px solid ${K.ink}`, borderRadius: 3, background: i <= label ? K.cobalt : K.white}} />
              ))}
            </div>
          </div>
        </Reveal>
        <div style={{height: 6, background: K.ink, width: `${line * 1000}px`, marginTop: 36, marginBottom: 30}} />
        <Reveal at={0.5}>
          <div style={{fontWeight: 800, fontSize: 112, lineHeight: 1.05, maxWidth: 1500}}>
            {c.pre} <Hl at={1.0}>{c.hl}</Hl>
          </div>
        </Reveal>
        <Reveal at={0.9}>
          <div style={{marginTop: 24}}>
            <Serif size={58}>{c.sub}</Serif>
          </div>
        </Reveal>
      </div>
    </Stage>
  );
};
