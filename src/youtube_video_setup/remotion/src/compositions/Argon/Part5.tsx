import React from 'react';
import {Card, Fade, Header, Hl, K, Mono, Reveal, Serif, Stage, mono, segment, useCount, useP, useT} from './kit';

/* ------------------------------------------------------------------ */
/* P5-01..04  Three pillars, benchmark gap, verdict (part 5, whole)    */
/* ------------------------------------------------------------------ */
const R = segment(5, 0, 8);
export const PILLARS_FRAMES = R.frames;

const G_AT = R.at(1); // Google lit
const A_AT = R.at(4); // Anthropic lit
const GAP_AT = R.at(6); // benchmarks broken
const VERDICT_AT = R.at(8);

type PillarProps = {
  x: number;
  badge: string;
  color: string;
  title: string;
  lines: string[];
  litAt: number;
  litUntil: number;
  introAt: number;
  chips?: {t: string; at: number}[];
  stat?: {at: number; node: React.ReactNode};
};

const Pillar: React.FC<PillarProps> = ({x, badge, color, title, lines, litAt, litUntil, introAt, chips = [], stat}) => {
  const rise = useP(introAt, 16, 140);
  const lit = useP(litAt, 14, 160);
  const unlit = useT(litUntil, litUntil + 0.6);
  const strength = lit * (1 - unlit * 0.7);
  const gone = useT(GAP_AT - 0.6, GAP_AT);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 270,
        width: 520,
        opacity: (0.3 + 0.7 * Math.min(1, rise * 1.5)) * (1 - gone),
        transform: `translateY(${(1 - rise) * 120 - strength * 16}px) scale(${1 + strength * 0.04})`,
      }}
    >
      <Card badge={badge} badgeBg={strength > 0.3 ? color : K.muted} bg={strength > 0.3 ? K.white : K.cream} style={{height: 640, boxShadow: strength > 0.3 ? `10px 10px 0 ${color}, 10px 10px 0 3px ${K.ink}` : `7px 7px 0 ${K.ink}`}}>
        <div style={{height: 22, borderRadius: 4, background: color, opacity: 0.25 + 0.75 * strength, marginTop: 10, marginBottom: 24}} />
        <div style={{fontWeight: 800, fontSize: 54, lineHeight: 1.1}}>{title}</div>
        <div style={{marginTop: 14}}>
          {lines.map((l, i) => (
            <div key={i} style={{fontFamily: mono, fontSize: 25, color: strength > 0.3 ? K.ink : K.muted, textTransform: 'uppercase', marginBottom: 8, fontWeight: 500}}>
              {l}
            </div>
          ))}
        </div>
        {stat && <Reveal at={stat.at} style={{marginTop: 22}}>{stat.node}</Reveal>}
        <div style={{marginTop: 18}}>
          {chips.map((c, i) => (
            <Reveal key={i} at={c.at} style={{marginBottom: 12}}>
              <span style={{background: K.cream, border: `2.5px solid ${K.ink}`, borderRadius: 999, padding: '6px 18px', fontWeight: 700, fontSize: 28, display: 'inline-block'}}>{c.t}</span>
            </Reveal>
          ))}
        </div>
      </Card>
    </div>
  );
};

const Gap: React.FC = () => {
  const gaugeT = useT(GAP_AT + 1.2, GAP_AT + 3.2);
  const pct = useCount(GAP_AT + 1.2, GAP_AT + 3.2, 100, 0);
  const wire = useT(GAP_AT + 5.5, GAP_AT + 8.5);
  const label = useP(GAP_AT + 0.4, 14, 200);
  const fade = useT(VERDICT_AT - 0.5, VERDICT_AT);
  return (
    <div style={{position: 'absolute', inset: 0, opacity: 1 - fade}}>
      <div style={{position: 'absolute', top: 250, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: label}}>
        <Card bg={K.yellow} style={{padding: '10px 34px', borderRadius: 999}}>
          <span style={{fontFamily: mono, fontWeight: 700, fontSize: 34, textTransform: 'uppercase', textDecoration: useT(GAP_AT + 1.2, GAP_AT + 1.3) > 0 ? 'line-through' : 'none', textDecorationThickness: 5}}>Synthetic benchmarks</span>
        </Card>
      </div>
      <div style={{position: 'absolute', left: 120, top: 360, width: 780}}>
        <Reveal at={GAP_AT + 0.8}>
          <Card badge="Enterprise evaluation" badgeBg={K.green} style={{height: 520}}>
            <div style={{fontWeight: 800, fontSize: 150, lineHeight: 1, color: K.green}}>{pct}%</div>
            <div style={{height: 60, border: `3px solid ${K.ink}`, borderRadius: 8, marginTop: 24, background: K.cream}}>
              <div style={{height: '100%', width: `${gaugeT * 100}%`, background: K.green}} />
            </div>
            <div style={{marginTop: 22}}>
              <Serif size={42}>A record score on paper</Serif>
            </div>
          </Card>
        </Reveal>
      </div>
      <div style={{position: 'absolute', left: 1020, top: 360, width: 780}}>
        <Reveal at={GAP_AT + 4.6}>
          <Card badge="A cohesive Three.js website" badgeBg={K.terra} style={{height: 520}}>
            <svg width="700" height="400" viewBox="0 0 700 400">
              {/* messy layout settles into a clean one as `wire` goes 0 -> 1 on the right half; left half stays messy */}
              <g>
                <rect x={20 + (1 - wire) * 0} y={20} width={300} height={50} fill="none" stroke={K.ink} strokeWidth="3" transform={`rotate(${-3 * (1 - 0)} 100 40)`} />
                <rect x={50} y={95} width={220} height={150} fill="none" stroke={K.ink} strokeWidth="3" transform="rotate(4 160 170)" />
                <rect x={170} y={210} width={160} height={120} fill="none" stroke={K.ink} strokeWidth="3" transform="rotate(-6 250 270)" />
                <rect x={20} y={290} width={110} height={80} fill="none" stroke={K.ink} strokeWidth="3" transform="rotate(8 70 330)" />
                <text x="20" y="395" fontFamily={mono} fontSize="18" fill={K.terra}>Argon</text>
              </g>
              <g opacity={wire}>
                <rect x={380} y={20} width={300} height={50} fill={K.cobalt} stroke={K.ink} strokeWidth="3" />
                <rect x={380} y={95} width={300} height={150} fill={K.white} stroke={K.ink} strokeWidth="3" />
                <rect x={380} y={270} width={140} height={100} fill={K.white} stroke={K.ink} strokeWidth="3" />
                <rect x={540} y={270} width={140} height={100} fill={K.white} stroke={K.ink} strokeWidth="3" />
                <text x="380" y="395" fontFamily={mono} fontSize="18" fill={K.cobalt}>Claude</text>
              </g>
              <line x1="350" y1="10" x2="350" y2="380" stroke={K.ink} strokeWidth="2" strokeDasharray="6 8" />
            </svg>
            <div style={{position: 'absolute', bottom: 24, left: 36}}>
              <Serif size={34}>Visual hierarchy still struggles</Serif>
            </div>
          </Card>
        </Reveal>
      </div>
    </div>
  );
};

const Verdict: React.FC = () => {
  const bar = useT(VERDICT_AT + 0.4, VERDICT_AT + 2.0);
  const second = useP(VERDICT_AT + 2.8, 14, 160);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 120, right: 120, top: 280, textAlign: 'center'}}>
        <Reveal at={VERDICT_AT + 0.1}>
          <div style={{fontWeight: 800, fontSize: 110, lineHeight: 1.05}}>
            Google is <Hl at={VERDICT_AT + 1.0}>back</Hl> in the fight
          </div>
        </Reveal>
        <Reveal at={VERDICT_AT + 2.8}>
          <div style={{marginTop: 20}}>
            <Serif size={78} color={K.terra}>
              ...but hasn&apos;t dethroned Anthropic yet.
            </Serif>
          </div>
        </Reveal>
      </div>
      <div style={{position: 'absolute', left: 520, top: 700, width: 880}}>
        <Mono size={22} color={K.ink}>Anthropic · software engineering crown</Mono>
        <div style={{height: 46, border: `3px solid ${K.ink}`, borderRadius: 8, background: K.white, marginTop: 6, marginBottom: 22}}>
          <div style={{height: '100%', width: `${bar * 100}%`, background: K.cobalt}} />
        </div>
        <Mono size={22} color={K.ink}>Google · Gemini 4 Argon</Mono>
        <div style={{height: 46, border: `3px solid ${K.ink}`, borderRadius: 8, background: K.white, marginTop: 6, position: 'relative'}}>
          <div style={{height: '100%', width: `${bar * 82}%`, background: K.green}} />
          <div style={{position: 'absolute', top: -6, left: '82%', width: `${16 * second}%`, height: 54, borderTop: `3px dashed ${K.ink}`, borderBottom: `3px dashed ${K.ink}`, borderRight: `3px dashed ${K.ink}`, opacity: second}} />
        </div>
      </div>
    </div>
  );
};

export const ArgonPillars: React.FC = () => {
  const headFade = useT(GAP_AT - 0.6, GAP_AT);
  const xs = [90, 700, 1310];
  return (
    <Fade frames={R.frames}>
      <Stage>
        <div style={{opacity: 1 - headFade}}>
          <Header tag="The AI race" lead={<>Where does Google <Hl at={1.4}>actually</Hl> stand?</>} />
        </div>
        <Pillar
          x={xs[0]}
          badge="Pillar 1"
          color={K.green}
          title="Google DeepMind"
          lines={['Hardware scale', 'Custom Trillium TPUs']}
          introAt={1.0}
          litAt={G_AT}
          litUntil={A_AT - 0.3}
          stat={{
            at: R.at(2),
            node: (
              <div style={{fontWeight: 800, fontSize: 44, lineHeight: 1.1}}>
                1M-token context <span style={{background: K.yellow, padding: '0 8px'}}>at ½ the price</span>
              </div>
            ),
          }}
          chips={[
            {t: '500-page filings', at: R.at(3, 1.2)},
            {t: 'Vision pipelines', at: R.at(3, 3.6)},
            {t: 'Million-line codebases', at: R.at(3, 6.0)},
          ]}
        />
        <Pillar
          x={xs[1]}
          badge="Pillar 2"
          color={K.cobalt}
          title="Anthropic"
          lines={['Developer taste', 'Terminal autonomy', 'Claude Code']}
          introAt={1.5}
          litAt={A_AT}
          litUntil={GAP_AT - 0.3}
          chips={[
            {t: 'Terminal workflows', at: R.at(5, 1.0)},
            {t: 'Design aesthetics', at: R.at(5, 3.4)},
            {t: 'Architectural taste', at: R.at(5, 5.6)},
          ]}
        />
        <Pillar
          x={xs[2]}
          badge="Pillar 3"
          color={K.terra}
          title="OpenAI"
          lines={['General multimodal', 'Consumer ecosystem']}
          introAt={2.0}
          litAt={999}
          litUntil={999}
        />
        <GapStage />
      </Stage>
    </Fade>
  );
};

const GapStage: React.FC = () => {
  const inP = useT(GAP_AT - 0.2, GAP_AT + 0.4);
  const vP = useT(VERDICT_AT - 0.5, VERDICT_AT);
  return (
    <>
      <div style={{position: 'absolute', inset: 0, opacity: inP, pointerEvents: 'none', display: vP >= 1 ? 'none' : 'block'}}>
        <Gap />
      </div>
      <div style={{position: 'absolute', inset: 0, opacity: vP, display: vP <= 0 ? 'none' : 'block'}}>
        <Verdict />
      </div>
    </>
  );
};
