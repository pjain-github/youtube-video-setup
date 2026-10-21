import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Card, Fade, Header, Hl, K, Mono, Reveal, Serif, Stage, mono, segment, sf, useCount, useP, useT} from './kit';

/* ------------------------------------------------------------------ */
/* P2-04  Human video -> robot pipeline (part 2, s3-s4)                */
/* ------------------------------------------------------------------ */
const PIPE = segment(2, 3, 4);
export const PIPELINE_FRAMES = PIPE.frames;

const STEPS = [
  {tag: 'Step 1', title: 'Human cornhole video', sub: 'Standard footage of a human playing', at: 1.0, color: K.ink},
  {tag: 'Step 2', title: 'MuJoCo physics simulation', sub: 'Spatial physics mapped into a sim', at: PIPE.at(4, 1.5), color: K.cobalt},
  {tag: 'Step 3', title: 'Whole-body joint trajectories', sub: 'Calculated for Apollo 2', at: PIPE.at(4, 5.2), color: K.cobalt},
  {tag: 'Step 4', title: 'Apollo 2 tosses', sub: 'Executed in the physical world', at: PIPE.at(4, 8.6), color: K.green},
];

const StepCard: React.FC<{i: number}> = ({i}) => {
  const s = STEPS[i];
  const p = useP(s.at, 14, 170);
  return (
    <div style={{width: 380, opacity: 0.3 + 0.7 * p, transform: `translateY(${(1 - p) * 26}px) scale(${0.95 + 0.05 * p})`}}>
      <Card badge={s.tag} badgeBg={p > 0.05 ? s.color : K.muted} style={{height: 340, background: p > 0.5 ? K.white : K.cream}}>
        <div style={{fontWeight: 800, fontSize: 46, lineHeight: 1.12, marginTop: 14}}>{s.title}</div>
        <div style={{marginTop: 22}}>
          <Serif size={32}>{s.sub}</Serif>
        </div>
      </Card>
    </div>
  );
};

const Arrow: React.FC<{from: number}> = ({from}) => {
  const t = useT(from - 0.6, from);
  return (
    <svg width="72" height="40" viewBox="0 0 72 40" style={{marginTop: 150}}>
      <path d="M4 20 H60" stroke={K.ink} strokeWidth="5" strokeLinecap="round" strokeDasharray="60" strokeDashoffset={60 * (1 - t)} fill="none" />
      <path d="M48 8 L64 20 L48 32" stroke={K.ink} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={t} />
    </svg>
  );
};

export const ArgonPipeline: React.FC = () => {
  const toss0 = PIPE.at(4, 11.0);
  const count = Math.min(7, Math.floor(useT(toss0, toss0 + 7 * 0.9) * 7 + 0.0001) + (useT(toss0, toss0 + 7 * 0.9) > 0 ? 1 : 0));
  const tagP = useP(PIPE.at(4, 18.2), 14, 170);
  return (
    <Fade frames={PIPE.frames}>
      <Stage>
        <Header tag="Gemini 4 Argon · robotics demo" lead={<>From a <Hl at={0.9}>video</Hl> to a robot throw</>} />
        <div style={{position: 'absolute', left: 60, right: 60, top: 330, display: 'flex', justifyContent: 'center', alignItems: 'flex-start'}}>
          {STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <StepCard i={i} />
              {i < STEPS.length - 1 && <Arrow from={STEPS[i + 1].at} />}
            </React.Fragment>
          ))}
        </div>
        <div style={{position: 'absolute', left: 120, right: 120, top: 760, display: 'flex', alignItems: 'center', gap: 36}}>
          <Reveal at={toss0 - 0.4}>
            <Mono size={26} color={K.ink}>Consecutive bullseyes</Mono>
          </Reveal>
          <div style={{display: 'flex', gap: 18}}>
            {Array.from({length: 7}).map((_, i) => (
              <Dot key={i} on={count > i} />
            ))}
          </div>
          <Reveal at={toss0 - 0.4}>
            <span style={{fontWeight: 800, fontSize: 64}}>
              {count}
              <span style={{color: K.muted}}> OF 7</span>
            </span>
          </Reveal>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 900, display: 'flex', justifyContent: 'center', opacity: tagP, transform: `translateY(${(1 - tagP) * 20}px)`}}>
          <Card bg={K.yellow} style={{padding: '14px 38px', borderRadius: 999}}>
            <span style={{fontFamily: mono, fontWeight: 700, fontSize: 32, textTransform: 'uppercase'}}>No human fine-tuning</span>
          </Card>
        </div>
      </Stage>
    </Fade>
  );
};

const Dot: React.FC<{on: boolean}> = ({on}) => (
  <div
    style={{
      width: 46,
      height: 46,
      borderRadius: '50%',
      border: `3px solid ${K.ink}`,
      background: on ? K.green : K.white,
      boxShadow: on ? `3px 3px 0 ${K.ink}` : 'none',
    }}
  />
);

/* ------------------------------------------------------------------ */
/* P2-07  Chromium scale: 40M lines, 6M legacy, months -> weeks        */
/* (part 2, s6-s8)                                                     */
/* ------------------------------------------------------------------ */
const CHR = segment(2, 6, 8);
export const CHROMIUM_FRAMES = CHR.frames;
const COLS = 20;
const ROWS = 10; // 200 cells -> 200k lines each
const LEGACY = 30; // 30 cells = 6M lines

const Cell: React.FC<{i: number; legacyAt: number; liftAt: number}> = ({i, legacyAt, liftAt}) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  const fill = useP(0.4 + (i / (COLS * ROWS)) * 2.4, 20, 200);
  const isLegacy = i >= COLS * ROWS - LEGACY;
  const hl = useP(legacyAt, 20, 200);
  const lift = useP(liftAt, 18, 90);
  const li = i - (COLS * ROWS - LEGACY);
  const tx = isLegacy ? lift * 300 : 0;
  const ty = isLegacy ? -lift * (30 + li * 2) : 0;
  const bg = isLegacy && hl > 0.5 ? K.terra : K.white;
  return (
    <div
      style={{
        position: 'absolute',
        left: col * 36,
        top: row * 36,
        width: 30,
        height: 30,
        border: `2.5px solid ${K.ink}`,
        borderRadius: 4,
        background: bg,
        opacity: fill * (isLegacy ? 1 - lift : 1),
        transform: `translate(${tx}px, ${ty}px) scale(${0.6 + 0.4 * fill})`,
        zIndex: isLegacy ? 2 : 1,
      }}
    />
  );
};

export const ArgonChromiumScale: React.FC = () => {
  const frame = useCurrentFrame();
  const legacyAt = CHR.at(8, 0.5);
  const liftAt = CHR.at(8, 2.2);
  const total = useCount(0.4, 3.0, 40, 0);
  const tangle = useT(CHR.at(8, 4.5), CHR.at(8, 8.0)); // 0 tangled -> 1 straight
  const tl = CHR.at(8, 9.5);
  const months = useT(tl, tl + 1.2);
  const weeks = useT(tl + 3.0, tl + 4.2);
  const sag = (k: number) => {
    // wavy -> straight polyline
    const amp = (1 - tangle) * 26;
    return `M0 ${k * 22 + 11} ` + Array.from({length: 12}).map((_, j) => `L${(j + 1) * 22} ${k * 22 + 11 + Math.sin((j + k * 1.7 + frame * 0.08) * 1.9) * amp}`).join(' ');
  };
  return (
    <Fade frames={CHR.frames}>
      <Stage>
        <Header tag="Chromium · internal deployment" lead={<>The most <Hl at={0.9}>intimidating</Hl> hurdle</>} />
        <div style={{position: 'absolute', left: 120, top: 320}}>
          <Reveal at={0.3}>
            <Mono size={26} color={K.ink}>Chromium codebase</Mono>
            <div style={{fontWeight: 800, fontSize: 84, marginBottom: 18}}>{total}M <span style={{color: K.muted, fontSize: 40}}>lines</span></div>
          </Reveal>
          <div style={{position: 'relative', width: COLS * 36, height: ROWS * 36}}>
            {Array.from({length: COLS * ROWS}).map((_, i) => (
              <Cell key={i} i={i} legacyAt={legacyAt} liftAt={liftAt} />
            ))}
          </div>
        </div>
        <div style={{position: 'absolute', left: 1000, top: 300, width: 800}}>
          <Reveal at={liftAt - 0.2}>
            <Card badge="Legacy browser features folder" badgeBg={K.terra} style={{height: 330}}>
              <div style={{fontWeight: 800, fontSize: 58}}>6,000,000 <span style={{color: K.muted, fontSize: 32}}>lines</span></div>
              <svg width="264" height="120" style={{position: 'absolute', right: 36, top: 160}}>
                {[0, 1, 2, 3, 4].map((k) => (
                  <path key={k} d={sag(k)} stroke={tangle > 0.95 ? K.green : K.terra} strokeWidth="3.5" fill="none" strokeLinecap="round" />
                ))}
              </svg>
              <div style={{position: 'absolute', left: 36, bottom: 30}}>
                <Serif size={34}>{tangle > 0.95 ? 'Core page handling separated' : 'Hundreds of files, tangled together'}</Serif>
              </div>
            </Card>
          </Reveal>
        </div>
        <div style={{position: 'absolute', left: 1000, top: 680, width: 800}}>
          <Reveal at={tl - 0.3}>
            <Mono size={24} color={K.ink}>Refactor time</Mono>
            <div style={{marginTop: 14}}>
              <Mono size={20}>Google&apos;s estimate: months of senior engineer time</Mono>
              <div style={{height: 38, width: '100%', border: `3px solid ${K.ink}`, borderRadius: 6, background: K.white, marginTop: 8}}>
                <div style={{height: '100%', width: `${months * 100}%`, background: K.muted}} />
              </div>
            </div>
            <div style={{marginTop: 22}}>
              <Mono size={20}>Argon: weeks</Mono>
              <div style={{height: 38, width: '100%', border: `3px solid ${K.ink}`, borderRadius: 6, background: K.white, marginTop: 8}}>
                <div style={{height: '100%', width: `${weeks * 22}%`, background: K.green}} />
              </div>
            </div>
          </Reveal>
        </div>
      </Stage>
    </Fade>
  );
};
