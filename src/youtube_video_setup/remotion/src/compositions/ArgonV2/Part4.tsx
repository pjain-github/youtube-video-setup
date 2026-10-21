import React from 'react';
import {AbsoluteFill, Audio, Easing, staticFile} from 'remotion';
import wordsJson from '../../data/argon_v2/part_04_words.json';
import {C} from './tokens';
import {Draw, FPS, PaperCard, WordPages, hand, mono, roughBoxPath, type Word} from './hand';
import {CropCard, DotCanvas, Pill, Source, Stat, lerp, useRange, usePop, useT, win} from './common';

/**
 * Part 4 - Access, pricing and the Antigravity controversy (scenes 4.1 - 4.3).
 * Timed from part_04_words.json: s(i) / e(i) = start / end seconds of word i.
 */
const W = wordsJson as Word[];
const s = (i: number) => W[i].start;

export const PART4_AUDIO = 'audio/gemini_4_argon/part_04_access_pricing_and_antigravity.mp3';
export const PART4_FRAMES = Math.round(78.25 * FPS);

const T42 = s(66) - 0.1; // Antigravity starts
const T43 = s(126) - 0.1; // rate-limit backlash starts
const useExit = (t0: number) => useRange(t0 - 0.5, t0 + 0.1);

/** Yellow highlighter sweep over a region (card px). */
const Mark: React.FC<{x: number; y: number; w: number; h: number; at: number; dur?: number}> = ({x, y, w, h, at, dur = 1.0}) => {
  const p = useRange(at, at + dur, (v) => v);
  return <div style={{position: 'absolute', left: x, top: y, width: w * p, height: h, background: 'rgba(253,224,71,0.34)', border: '2px solid rgba(253,224,71,0.8)', boxSizing: 'border-box', borderRadius: 4}} />;
};

/* ================================================================== */
/* Scene 4.1 - API price win (number-first)                           */
/* ================================================================== */
const PR = {x: 760, y: 625, w: 2200, h: 525};
const PR_W = 1500;

const Pricing: React.FC = () => {
  const t = useT();
  const tableIn = useRange(1.2, 2.0);
  const rIn = useRange(s(18) - 0.1, s(18) + 0.8);
  const rOut = useRange(s(24) - 0.1, s(24) + 0.8);
  const rCache = useRange(s(36), s(36) + 0.8);
  const note = usePop(s(11), 12, 190);
  const dec = useRange(s(12) + 0.6, s(12) + 1.4);
  const off = usePop(s(34), 10, 220);
  const banner = usePop(s(44) - 0.1, 10, 190);
  const aggressive = useRange(s(52), s(52) + 0.8);
  const out = useExit(T42);
  if (t > T42 + 0.2) return null;
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <div style={{position: 'absolute', top: 36, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
        <div style={{opacity: Math.min(1, note * 2), transform: `translateY(${(1 - note) * -26}px)`, fontFamily: mono, fontWeight: 700, fontSize: 24, letterSpacing: 2, background: C.note, color: C.ink, borderRadius: 999, padding: '8px 28px'}}>
          LAUNCH PRICING · THROUGH NOV 30
        </div>
        <div style={{opacity: dec, fontFamily: mono, fontSize: 20, color: C.slateText}}>rises to $4 / $20 / $0.20 on Dec 1</div>
      </div>

      <div style={{position: 'absolute', left: 90, top: 130, display: 'flex', gap: 60}}>
        <Stat at={s(18)} width={540} label="INPUT · PER 1M TOKENS" big="$2" caption="input tokens" color={C.google} bigSize={150} />
        <Stat at={s(24)} width={540} label="OUTPUT · PER 1M TOKENS" big="$10" caption="output tokens" color={C.google} bigSize={150} />
        <Stat
          at={s(38) - 0.3}
          width={540}
          label="CACHED INPUT"
          big={
            <>
              $0.10 <span style={{fontSize: 70, color: C.good, opacity: Math.min(1, off * 2)}}>−95%</span>
            </>
          }
          caption="prompt cache"
          color={C.good}
          bigSize={150}
        />
      </div>

      <div style={{position: 'absolute', left: (1920 - PR_W) / 2, top: 450, opacity: tableIn, transform: `translateY(${(1 - tableIn) * 60}px)`}}>
        <CropCard src="images/part4_A11_gemini_api_pricing_table.png" srcW={3840} srcH={2160} crop={PR} width={PR_W}>
          {(k) => (
            <svg width={PR.w * k} height={PR.h * k} style={{position: 'absolute', inset: 0}}>
              <Draw d={roughBoxPath(1455 * k, 106 * k, 735 * k, 106 * k, 3, 3)} progress={rIn} stroke={C.blue} width={5} />
              <Draw d={roughBoxPath(1455 * k, 218 * k, 735 * k, 106 * k, 5, 3)} progress={rOut} stroke={C.blue} width={5} />
              <Draw d={roughBoxPath(1455 * k, 332 * k, 735 * k, 120 * k, 7, 3)} progress={rCache} stroke={C.blue} width={5} />
            </svg>
          )}
        </CropCard>
        <Source text="Source: ai.google.dev · Gemini API pricing" style={{marginTop: 8}} />
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 860, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: Math.min(1, banner * 2), transform: `scale(${0.85 + 0.15 * banner})`}}>
        <div style={{background: C.ink, color: '#fff', fontFamily: hand, fontSize: 78, lineHeight: 1, borderRadius: 18, padding: '6px 44px 14px', boxShadow: '0 16px 30px -12px rgba(15,23,42,0.5)'}}>
          HALF THE PRICE OF <span style={{color: C.note}}>OPUS 5.5</span> <span style={{fontSize: 34, color: '#CBD5E1'}}>(list price)</span>
        </div>
        <div style={{fontFamily: mono, fontSize: 20, color: C.slateText, opacity: aggressive}}>among the most aggressive pricing for a frontier reasoning model</div>
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* Scene 4.2 - Antigravity announcement and Pro rollout (+ 4.3 start) */
/* ================================================================== */
const TW = {x: 604, y: 58, w: 586, h: 222};
const TW_W = 900;
const TW_K = TW_W / TW.w;
const TW_END = s(140) - 0.3;

const Tier: React.FC<{top: number; at: number; label: string; big: string; caption: string; color: string}> = ({top, at, label, big, caption, color}) => {
  const pop = usePop(at, 12, 170);
  return (
    <div style={{position: 'absolute', left: 100, top, width: 660, opacity: Math.min(1, pop * 2), transform: `translateX(${(1 - pop) * -80}px)`}}>
      <PaperCard border={color} style={{padding: '14px 28px 20px', borderWidth: 4}}>
        <div style={{fontFamily: mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, color}}>{label}</div>
        <div style={{fontFamily: hand, fontSize: 104, lineHeight: 1, color: C.ink}}>
          {big} <span style={{fontSize: 46, color: C.slateText}}>/ month</span>
        </div>
        <div style={{fontFamily: hand, fontSize: 40, color: C.ink}}>{caption}</div>
      </PaperCard>
    </div>
  );
};

const Antigravity: React.FC = () => {
  const t = useT();
  const tweetIn = useRange(s(105) - 0.2, s(105) + 0.8);
  const slide = useRange(T43, T43 + 1.0);
  const tierOut = useRange(T43 - 0.5, T43 + 0.1);
  const twOut = useRange(TW_END - 0.3, TW_END + 0.3);
  const arrow = useRange(s(100) - 0.1, s(100) + 0.8);
  const push = usePop(s(100), 10, 200);
  const x = 940 + (460 - 940) * slide;
  const pro = usePop(s(132), 10, 200);
  if (t < T42 - 0.1 || t > TW_END + 0.4) return null;
  return (
    <AbsoluteFill>
      <WordPages words={W} from={66} to={83} minAppear={T42 + 0.1} holdUntil={s(84) + 2.4} moveAt={s(84) - 0.8} rows={2} maxChars={120} fontSize={70} top={60} keys={['controversial']} />
      <div style={{opacity: 1 - tierOut}}>
        <Tier top={270} at={s(84)} label="GOOGLE AI ULTRA" big="$100–$200" caption="Argon here first, at launch" color={C.anthropic} />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <Draw d="M 430 585 C 410 610 450 640 430 665" progress={arrow} stroke={C.bad} width={7} />
          <Draw d="M 404 640 L 430 672 L 456 642" progress={arrow} stroke={C.bad} width={7} />
        </svg>
        <div style={{position: 'absolute', left: 470, top: 600, fontFamily: hand, fontSize: 40, color: C.bad, opacity: Math.min(1, push * 2), transform: `rotate(-3deg) scale(${0.8 + 0.2 * push})`}}>
          community pushback
        </div>
        <Tier top={690} at={s(114)} label="GOOGLE AI PRO" big="$20" caption="Argon added after pushback" color={C.good} />
      </div>

      <div style={{position: 'absolute', left: x, top: 330, opacity: tweetIn * (1 - twOut), transform: `translateY(${(1 - tweetIn) * 70 + twOut * 40}px)`}}>
        <CropCard src="images/part4_A12_x_antigravity_pro_weekly_quota.png" srcW={1920} srcH={962} crop={TW} width={TW_W}>
          {(k) => (
            <>
              <Mark x={364 * k} y={64 * k} w={162 * k} h={24 * k} at={s(116)} dur={1.6} />
              <Mark x={416 * k} y={112 * k} w={134 * k} h={24 * k} at={s(138)} dur={0.9} />
              <Mark x={8 * k} y={136 * k} w={112 * k} h={24 * k} at={s(138) + 0.8} dur={0.7} />
            </>
          )}
        </CropCard>
        <Source text="Source: @antigravity on X" style={{marginTop: 10}} />
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 28, opacity: Math.min(1, pro * 2), transform: `scale(${0.85 + 0.15 * pro})`}}>
          <div style={{fontFamily: hand, fontSize: 54, background: '#fff', border: `3px solid ${C.bad}`, color: C.ink, borderRadius: 999, padding: '4px 34px 8px'}}>
            Pro: <span style={{color: C.bad}}>weekly-only</span> quota ⚠
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* Scene 4.3 - The rate limit backlash                                */
/* ================================================================== */
const Battery: React.FC<{level: number}> = ({level}) => {
  const color = level > 0.5 ? C.good : level > 0.2 ? '#F59E0B' : C.bad;
  return (
    <svg width={260} height={460} viewBox="0 0 260 460">
      <rect x={90} y={4} width={80} height={26} rx={8} fill={C.ink} />
      <rect x={20} y={26} width={220} height={420} rx={26} fill="#fff" stroke={C.ink} strokeWidth={9} />
      <rect x={38} y={44 + 384 * (1 - level)} width={184} height={Math.max(0, 384 * level)} rx={14} fill={color} />
      <text x={130} y={248} textAnchor="middle" fontFamily={hand} fontSize={78} fill={level > 0.35 ? '#fff' : C.ink}>
        {Math.round(level * 100)}%
      </text>
    </svg>
  );
};

type Quote = {src: string; crop: {x: number; y: number; w: number; h: number}; top: number; at: number; mark: {x: number; y: number; w: number; h: number}};
const QUOTES: Quote[] = [
  {src: 'images/part4_A13_reddit_gemini_pro_weekly_quota_post.png', crop: {x: 550, y: 712, w: 740, h: 96}, top: 330, at: s(151), mark: {x: 40, y: 40, w: 138, h: 22}},
  {src: 'images/part4_A13_reddit_1prompt_11percent_quota.png', crop: {x: 550, y: 176, w: 720, h: 96}, top: 505, at: s(157) - 0.1, mark: {x: 225, y: 38, w: 285, h: 22}},
  {src: 'images/part4_A13_reddit_at_most_1_thing_limit.png', crop: {x: 550, y: 380, w: 740, h: 146}, top: 680, at: s(163), mark: {x: 40, y: 92, w: 400, h: 22}},
];

const RedditCard: React.FC<{q: Quote; out: number}> = ({q, out}) => {
  const t = useT();
  const drop = usePop(q.at, 11, 150);
  const exit = out;
  if (t < q.at - 0.05) return null;
  return (
    <div style={{position: 'absolute', left: 380, top: q.top, opacity: Math.min(1, drop * 3) * (1 - exit), transform: `translateY(${(1 - drop) * -320 + exit * 40}px) rotate(${(1 - drop) * -3}deg)`}}>
      <CropCard src={q.src} srcW={1920} srcH={962} crop={q.crop} width={1000} border={C.slateText}>
        {(k) => <Mark x={q.mark.x * k} y={q.mark.y * k} w={q.mark.w * k} h={q.mark.h * k} at={q.at + 0.9} dur={0.9} />}
      </CropCard>
    </div>
  );
};

const Backlash: React.FC = () => {
  const t = useT();
  const bar = useRange(s(144) - 0.2, s(147) + 0.8, Easing.in(Easing.quad));
  const barIn = usePop(s(143), 12, 170);
  const drain = useRange(s(157), s(169) + 0.2, Easing.inOut(Easing.cubic));
  const batIn = usePop(s(157) - 0.4, 12, 170);
  const dead = usePop(s(169) + 0.3, 9, 220);
  const cardsOut = useRange(s(170) - 0.4, s(170) + 0.3);
  const barOut = useRange(s(151) - 0.5, s(151));
  const proIn = usePop(s(172) - 0.2, 12, 170);
  const ultraIn = usePop(s(185) - 0.1, 12, 170);
  const head = usePop(s(172) - 0.2, 12, 170);
  const barC = bar < 0.5 ? C.good : bar < 0.8 ? '#F59E0B' : C.bad;
  if (t < s(139)) return null;
  return (
    <AbsoluteFill>
      <WordPages words={W} from={140} to={150} minAppear={s(139) + 0.4} holdUntil={s(151) + 0.3} moveAt={s(151) - 0.9} rows={2} maxChars={100} fontSize={72} top={60} keys={['context']} />

      {/* context window filling up */}
      <div style={{position: 'absolute', left: 300, top: 640, width: 1320, opacity: Math.min(1, barIn * 2) * (1 - barOut), transform: `translateY(${(1 - barIn) * 40}px)`}}>
        <div style={{fontFamily: mono, fontWeight: 700, fontSize: 24, letterSpacing: 2, color: C.slateText, marginBottom: 10}}>CONTEXT WINDOW · multi-file analysis</div>
        <div style={{height: 76, border: `4px solid ${C.ink}`, borderRadius: 14, background: '#fff', padding: 6, boxSizing: 'border-box'}}>
          <div style={{width: `${bar * 100}%`, height: '100%', background: barC, borderRadius: 8}} />
        </div>
      </div>

      {QUOTES.map((q, i) => (
        <RedditCard key={i} q={q} out={cardsOut} />
      ))}
      <div style={{position: 'absolute', left: 380, top: 892, opacity: win(t, QUOTES[2].at + 0.5, s(170) - 0.2, 0.3, 0.3)}}>
        <Source text="Source: r/GeminiAI" />
      </div>

      <div style={{position: 'absolute', left: 1530, top: 330, opacity: Math.min(1, batIn * 2) * (1 - cardsOut), transform: `translateY(${(1 - batIn) * 60}px)`}}>
        <Battery level={1 - drain} />
        <div style={{textAlign: 'center', fontFamily: mono, fontSize: 18, color: C.slateText}}>weekly quota · illustrative</div>
      </div>
      <div style={{position: 'absolute', left: 1440, top: 830, width: 440, display: 'flex', justifyContent: 'center', opacity: Math.min(1, dead * 2) * (1 - cardsOut), transform: `scale(${0.7 + 0.3 * dead})`}}>
        <div style={{background: C.bad, color: '#fff', fontFamily: hand, fontSize: 50, borderRadius: 999, padding: '0 30px 6px', boxShadow: '0 12px 24px -10px rgba(220,38,38,0.6)'}}>0% DEPLETED ⚠</div>
      </div>

      {/* Pro vs Ultra / direct API */}
      <div style={{position: 'absolute', top: 100, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: Math.min(1, head * 2) * cardsOut}}>
        <div style={{fontFamily: hand, fontSize: 84, lineHeight: 1, color: C.ink}}>
          Frontier <span style={{color: C.blue}}>intelligence</span>, but…
        </div>
      </div>
      <div style={{position: 'absolute', left: 190, top: 330, width: 700, opacity: Math.min(1, proIn * 2) * cardsOut, transform: `translateY(${(1 - proIn) * 70}px)`}}>
        <PaperCard border={C.bad} style={{padding: '16px 34px 28px', borderWidth: 4}}>
          <div style={{fontFamily: mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, color: C.bad}}>GOOGLE AI PRO · $20/mo</div>
          <div style={{fontFamily: hand, fontSize: 84, lineHeight: 1, color: C.ink, marginTop: 6}}>weekly-only quota</div>
          <div style={{fontFamily: hand, fontSize: 48, color: C.bad, marginTop: 14}}>✗ extended deep sessions</div>
        </PaperCard>
      </div>
      <div style={{position: 'absolute', left: 1030, top: 330, width: 700, opacity: Math.min(1, ultraIn * 2) * cardsOut, transform: `translateY(${(1 - ultraIn) * 70}px)`}}>
        <PaperCard border={C.good} style={{padding: '16px 34px 28px', borderWidth: 4}}>
          <div style={{fontFamily: mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, color: C.good}}>ULTRA · or the direct API</div>
          <div style={{fontFamily: hand, fontSize: 84, lineHeight: 1, color: C.ink, marginTop: 6}}>room to run</div>
          <div style={{fontFamily: hand, fontSize: 48, color: C.good, marginTop: 14}}>✓ extended deep sessions</div>
        </PaperCard>
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================== */
export const ArgonV2Part4: React.FC = () => (
  <AbsoluteFill>
    <DotCanvas id="argon-dots-p4" />
    <Audio src={staticFile(PART4_AUDIO)} />
    <Pricing />
    <Antigravity />
    <Backlash />
  </AbsoluteFill>
);
