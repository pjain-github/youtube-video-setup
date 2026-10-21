import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Card, Fade, Header, Hl, K, Mono, Reveal, Serif, Stage, mono, segment, useP, useT} from './kit';

/* ------------------------------------------------------------------ */
/* P4-01  API price cards (part 4, s0-s2)                              */
/* ------------------------------------------------------------------ */
const PR = segment(4, 0, 2);
export const PRICE_FRAMES = PR.frames;

const Price: React.FC<{at: number; badge: string; badgeBg: string; big: string; unit: string; note?: React.ReactNode; children?: React.ReactNode}> = ({at, badge, badgeBg, big, unit, note, children}) => (
  <Reveal at={at} style={{width: 540}}>
    <Card center badge={badge} badgeBg={badgeBg} style={{height: 430}}>
      <div style={{marginTop: 16}}>{children}</div>
      <div style={{fontWeight: 800, fontSize: 140, lineHeight: 1}}>{big}</div>
      <div style={{marginTop: 10}}>
        <Mono size={26} color={K.ink}>{unit}</Mono>
      </div>
      {note && <div style={{marginTop: 20}}>{note}</div>}
    </Card>
  </Reveal>
);

export const ArgonPriceCards: React.FC = () => {
  const stamp = useP(PR.at(1, 10.2), 9, 260);
  const strike = useT(PR.at(1, 9.2), PR.at(1, 10.0));
  const half = PR.at(2, 1.2);
  return (
    <Fade frames={PR.frames}>
      <Stage>
        <Header tag="Gemini API · launch pricing" lead={<>Raw API <Hl at={1.2}>economics</Hl></>} />
        <div style={{position: 'absolute', right: 120, top: 92}}>
          <Reveal at={PR.at(1, 0.8)}>
            <Card bg={K.yellow} style={{padding: '12px 26px', boxShadow: `5px 5px 0 ${K.ink}`, borderRadius: 999}}>
              <span style={{fontFamily: mono, fontWeight: 700, fontSize: 28, textTransform: 'uppercase'}}>Through November 30</span>
            </Card>
          </Reveal>
        </div>
        <div style={{position: 'absolute', left: 90, right: 90, top: 300, display: 'flex', justifyContent: 'space-between'}}>
          <Price at={PR.at(1, 3.0)} badge="Input" badgeBg={K.cobalt} big="$2.00" unit="per 1M input tokens" />
          <Price at={PR.at(1, 6.0)} badge="Output" badgeBg={K.ink} big="$10.00" unit="per 1M output tokens" />
          <Reveal at={PR.at(1, 8.4)} style={{width: 540, position: 'relative'}}>
            <Card center badge="Cached input" badgeBg={K.green} style={{height: 430}}>
              <div style={{marginTop: 16, position: 'relative', display: 'inline-block'}}>
                <span style={{fontWeight: 800, fontSize: 52, color: K.muted}}>$2.00</span>
                <div style={{position: 'absolute', left: -6, right: -6, top: '52%', height: 6, background: K.terra, transformOrigin: 'left', transform: `scaleX(${strike})`}} />
              </div>
              <div style={{fontWeight: 800, fontSize: 140, lineHeight: 1, color: K.green}}>$0.10</div>
              <div style={{marginTop: 10}}>
                <Mono size={26} color={K.ink}>per 1M cached tokens</Mono>
              </div>
            </Card>
            <div
              style={{
                position: 'absolute',
                right: -26,
                top: -40,
                opacity: Math.min(1, stamp * 2),
                transform: `rotate(8deg) scale(${1.9 - 0.9 * stamp})`,
              }}
            >
              <Card bg={K.terra} style={{padding: '10px 26px', borderRadius: 10, boxShadow: `5px 5px 0 ${K.ink}`}}>
                <span style={{fontWeight: 800, fontSize: 66, color: K.white}}>-95%</span>
              </Card>
            </div>
          </Reveal>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 800, textAlign: 'center'}}>
          <Reveal at={half}>
            <Serif size={66} color={K.ink}>
              Roughly <Hl at={half + 0.6}>half the cost</Hl> of running Opus 5.5
            </Serif>
          </Reveal>
        </div>
      </Stage>
    </Fade>
  );
};

/* ------------------------------------------------------------------ */
/* P4-04  Antigravity subscription tier ladder (part 4, s3-s5)         */
/* ------------------------------------------------------------------ */
const LAD = segment(4, 3, 5);
export const LADDER_FRAMES = LAD.frames;

export const ArgonTierLadder: React.FC = () => {
  const frame = useCurrentFrame();
  const ultra = LAD.at(4, 0.6);
  const push = LAD.at(5, 0.2);
  const pro = LAD.at(5, 4.0);
  const star = LAD.at(5, 9.5);
  const ripple = useT(push, push + 1.6);
  const ultraP = useP(ultra, 14, 170);
  const proP = useP(pro, 12, 190);
  return (
    <Fade frames={LAD.frames}>
      <Stage>
        <Header tag="Google Antigravity" lead={<>The agent workspace <Hl at={1.0}>took a turn</Hl></>} />
        <div style={{position: 'absolute', left: 120, top: 320, width: 860}}>
          <div style={{opacity: 0.35 + 0.65 * ultraP, transform: `translateY(${(1 - ultraP) * 30}px)`}}>
            <Card center badge="Ultra tier" badgeBg={K.ink} style={{height: 250}}>
              <div style={{display: 'flex', alignItems: 'baseline', gap: 16}}>
                <span style={{fontWeight: 800, fontSize: 110}}>$100–$200</span>
                <Mono size={30}>/ month</Mono>
              </div>
              <div style={{marginTop: 8}}>
                <Serif size={38}>Argon access, exclusively</Serif>
              </div>
            </Card>
          </div>
        </div>
        <div style={{position: 'absolute', left: 120, top: 640, width: 860}}>
          <div style={{opacity: 0.3 + 0.7 * proP, transform: `translateY(${(1 - proP) * 30}px) scale(${0.96 + 0.04 * proP})`, filter: proP < 0.1 ? 'grayscale(1)' : 'none'}}>
            <Card badge="Google AI Pro" badgeBg={proP > 0.1 ? K.green : K.muted} style={{height: 250}}>
              <div style={{display: 'flex', alignItems: 'baseline', gap: 16}}>
                <span style={{fontWeight: 800, fontSize: 110}}>$20</span>
                <Mono size={30}>/ month</Mono>
              </div>
              <div style={{marginTop: 8}}>
                <Serif size={38}>
                  Argon added{' '}
                  <span style={{opacity: useP(star, 14, 200), color: K.terra, fontStyle: 'normal', fontFamily: mono, fontWeight: 700, fontSize: 34}}>
                    * weekly-only quota
                  </span>
                </Serif>
              </div>
            </Card>
          </div>
        </div>
        <div style={{position: 'absolute', left: 1080, top: 300, width: 720, height: 680}}>
          <svg width="720" height="680" style={{position: 'absolute', inset: 0}}>
            <path d="M 20 200 C 160 200, 220 340, 20 480" stroke={K.ink} strokeWidth="4" strokeDasharray="10 10" strokeDashoffset={-frame * 0.7} fill="none" opacity={useP(push, 20, 100)} />
          </svg>
          <div style={{position: 'absolute', left: 140, top: 150, opacity: useP(push, 14, 180), transform: `translateY(${(1 - useP(push, 14, 180)) * 24}px)`}}>
            <Card badge="Community pushback" badgeBg={K.terra} style={{width: 520, padding: 30}}>
              <div style={{position: 'relative'}}>
                {[0, 1, 2].map((i) => {
                  const t = Math.max(0, Math.min(1, ripple * 1.3 - i * 0.25));
                  return (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        right: 8,
                        top: 4,
                        width: 70 + t * 150,
                        height: 70 + t * 150,
                        marginRight: -(35 + t * 75) + 35,
                        marginTop: -(35 + t * 75) + 35,
                        borderRadius: '50%',
                        border: `3px solid ${K.terra}`,
                        opacity: (1 - t) * (t > 0 ? 1 : 0),
                      }}
                    />
                  );
                })}
                <div style={{fontWeight: 800, fontSize: 44, lineHeight: 1.15}}>Developers push back on X</div>
                <div style={{marginTop: 10}}>
                  <Serif size={32}>and the Antigravity team responds</Serif>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Stage>
    </Fade>
  );
};

/* ------------------------------------------------------------------ */
/* P4-06  Weekly quota meter drain (part 4, s6-s9)                     */
/* ------------------------------------------------------------------ */
const Q = segment(4, 6, 9);
export const QUOTA_FRAMES = Q.frames;

export const ArgonQuotaMeter: React.FC = () => {
  const p1 = Q.at(8, 8.0);
  const p2 = Q.at(8, 10.4);
  const d1 = useT(p1, p1 + 0.7);
  const d2 = useT(p2, p2 + 0.7);
  const pct = Math.max(0, 100 - d1 * 88 - d2 * 12);
  const lock = useP(p2 + 0.9, 12, 200);
  const exit1 = Q.at(9, 2.8);
  const exit2 = Q.at(9, 5.6);
  const critical = pct < 30;
  return (
    <Fade frames={Q.frames}>
      <Stage>
        <Header tag="Google Antigravity · Pro" lead={<>A restrictive <Hl at={Q.at(7, 0.8)}>weekly-only</Hl> quota</>} at={Q.at(6, 0.2)} />
        <div style={{position: 'absolute', left: 120, top: 330, width: 1680}}>
          <Reveal at={Q.at(7, 0.6)}>
            <Card center badge="Weekly Argon quota · Pro" badgeBg={critical ? K.terra : K.ink} style={{height: 330}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 40}}>
                <div style={{fontWeight: 800, fontSize: 160, width: 420, color: critical ? K.terra : K.ink}}>{Math.round(pct)}%</div>
                <div style={{flex: 1}}>
                  <div style={{height: 78, border: `3px solid ${K.ink}`, borderRadius: 10, background: K.cream}}>
                    <div style={{height: '100%', width: `${pct}%`, background: critical ? K.terra : K.green, borderRadius: 6}} />
                  </div>
                  <div style={{display: 'flex', gap: 20, marginTop: 28, alignItems: 'center'}}>
                    <PromptChip at={p1} n={1} />
                    <PromptChip at={p2} n={2} />
                    <div style={{marginLeft: 'auto', opacity: lock, transform: `translateY(${(1 - lock) * 12}px)`}}>
                      <Card bg={K.ink} style={{padding: '10px 26px', borderRadius: 999, boxShadow: 'none'}}>
                        <span style={{fontFamily: mono, fontWeight: 700, fontSize: 26, color: K.white, textTransform: 'uppercase'}}>Locked · resets next week</span>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
        <div style={{position: 'absolute', left: 120, right: 120, top: 740, display: 'flex', gap: 60}}>
          <Reveal at={exit1} style={{flex: 1}}>
            <Card center badge="Exit 1" badgeBg={K.cobalt} style={{height: 190}}>
              <div style={{fontWeight: 800, fontSize: 54}}>Upgrade to Ultra</div>
              <Serif size={34}>$100–$200 a month</Serif>
            </Card>
          </Reveal>
          <Reveal at={exit2} style={{flex: 1}}>
            <Card center badge="Exit 2" badgeBg={K.green} style={{height: 190}}>
              <div style={{fontWeight: 800, fontSize: 54}}>Build on the raw API</div>
              <Serif size={34}>pay per token instead</Serif>
            </Card>
          </Reveal>
        </div>
        <div style={{position: 'absolute', right: 120, bottom: 40}}>
          <Mono size={18}>illustrative · based on user reports of 100% used in one or two prompts</Mono>
        </div>
      </Stage>
    </Fade>
  );
};

const PromptChip: React.FC<{at: number; n: number}> = ({at, n}) => {
  const p = useP(at, 10, 220);
  return (
    <div style={{opacity: 0.25 + 0.75 * Math.min(1, p * 2), transform: `scale(${0.85 + 0.15 * p})`}}>
      <Card bg={p > 0.2 ? K.yellow : K.white} style={{padding: '8px 22px', borderRadius: 999, boxShadow: `4px 4px 0 ${K.ink}`}}>
        <span style={{fontFamily: mono, fontWeight: 700, fontSize: 24, textTransform: 'uppercase'}}>Complex prompt {n}</span>
      </Card>
    </div>
  );
};
