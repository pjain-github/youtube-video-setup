import React from 'react';
import {AbsoluteFill, Audio, Easing, staticFile} from 'remotion';
import wordsJson from '../../data/argon_v2/part_03_words.json';
import {C} from './tokens';
import {Draw, FPS, PaperCard, WordPages, hand, mono, roughBoxPath, type Word} from './hand';
import {CropCard, DotCanvas, Pill, Source, Stat, lerp, useRange, usePop, useT, win} from './common';

/**
 * Part 3 - Official benchmarks vs independent tests (scenes 3.1 - 3.5 of the v2 blueprint).
 * Timed from part_03_words.json: s(i) / e(i) = start / end seconds of word i.
 */
const W = wordsJson as Word[];
const s = (i: number) => W[i].start;
const e = (i: number) => W[i].end;

export const PART3_AUDIO = 'audio/gemini_4_argon/part_03_benchmarks_vs_independent_tests.mp3';
export const PART3_FRAMES = Math.round(125.55 * FPS);

const T32 = s(57) - 0.1; // Roboflow starts
const T33 = s(125) - 0.1; // DataCamp starts
const T34 = s(177) - 0.1; // Pat Simmons starts
const T35 = s(244) - 0.1; // Terminal-Bench starts

/** Fade-out ramp for a scene that ends at `t0`. */
const useExit = (t0: number) => useRange(t0 - 0.5, t0 + 0.1);

/* ================================================================== */
/* Scene 3.1 - The official benchmark deck                            */
/* ================================================================== */
const TBL = {x: 1040, y: 425, w: 2050, h: 470};
const ROWS = {vals: [84, 160], auto: [160, 236], harvey: [312, 388], deep: [388, 464]} as const;
const TBL_W = 1700;

const RowBox: React.FC<{k: number; row: readonly [number, number]; at: number; out: number; color?: string}> = ({k, row, at, out, color = C.blue}) => {
  const p = useRange(at, at + 0.9);
  const o = useRange(out, out + 0.4);
  return (
    <svg width={TBL.w * k} height={TBL.h * k} style={{position: 'absolute', inset: 0, opacity: 1 - o}}>
      <Draw d={roughBoxPath(18 * k, (row[0] + 4) * k, 2014 * k, (row[1] - row[0] - 8) * k, row[0] / 10, 3)} progress={p} stroke={color} width={5} />
    </svg>
  );
};

const CellRing: React.FC<{k: number; x: number; y: number; w: number; h: number; at: number; color: string; seed?: number}> = ({k, x, y, w, h, at, color, seed = 3}) => {
  const p = useRange(at, at + 0.8);
  return (
    <svg width={TBL.w * k} height={TBL.h * k} style={{position: 'absolute', inset: 0}}>
      <Draw d={roughBoxPath(x * k, y * k, w * k, h * k, seed, 3)} progress={p} stroke={color} width={6} />
    </svg>
  );
};

const Official: React.FC = () => {
  const t = useT();
  const cardIn = useRange(0.1, 0.9);
  const out = useExit(T32);
  const tag = win(t, 1.0, T32 - 0.3, 0.4, 0.4);
  if (t > T32 + 0.2) return null;
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <div style={{position: 'absolute', left: (1920 - TBL_W) / 2, top: 120, opacity: cardIn, transform: `translateY(${(1 - cardIn) * 80}px)`}}>
        <CropCard src="images/part3_A07_deepmind_terminalbench_4k.png" srcW={3840} srcH={2160} crop={TBL} width={TBL_W}>
          {(k) => (
            <>
              <RowBox k={k} row={ROWS.vals} at={s(11)} out={s(24) - 0.2} />
              <RowBox k={k} row={ROWS.harvey} at={s(24)} out={s(37) - 0.2} />
              <CellRing k={k} x={1790} y={316} w={170} h={68} at={s(32) - 0.1} color={C.bad} seed={5} />
              <RowBox k={k} row={ROWS.auto} at={s(37)} out={s(47) - 0.2} />
              <RowBox k={k} row={ROWS.deep} at={s(47)} out={T32} />
              <CellRing k={k} x={1210} y={392} w={170} h={68} at={s(51)} color={C.slateText} seed={7} />
              <CellRing k={k} x={1790} y={392} w={170} h={68} at={s(53)} color={C.slateText} seed={9} />
            </>
          )}
        </CropCard>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 10, opacity: tag}}>
          <Source text="Source: Google DeepMind model card" />
          <Source text="Google-reported numbers" style={{color: C.bad}} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 84, top: 640, display: 'flex', gap: 24}}>
        <Stat at={s(13)} label="VALS INDEX" big="#1" caption="overall · finance, tax, coding" color={C.google} />
        <Stat
          at={s(28)}
          label="HARVEY LEGAL AGENT"
          big="19.6%"
          caption={
            <>
              vs <span style={{color: C.bad}}>3.8%</span> for Claude Opus 5.5
            </>
          }
          color={C.google}
        />
        <Stat at={s(40)} label="AUTOMATIONBENCH" big="51.3%" caption="complex business app automations" color={C.google} />
        <Stat at={s(50)} label="DEEPSWE CODING" big="77.9%" caption="edges Opus 74.2% · Astra 74.1%" color={C.google} />
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* Scene 3.2 - Roboflow vision verification                           */
/* ================================================================== */
const Roboflow: React.FC = () => {
  const t = useT();
  const chartIn = useRange(T32 + 0.2, T32 + 1.0);
  const ocrIn = useRange(s(76), s(76) + 0.8);
  const ring = useRange(s(97) - 0.2, s(97) + 0.9);
  const scaleBox = useRange(s(111), s(111) + 0.8);
  const exactBox = useRange(s(111) + 0.7, s(111) + 1.5);
  const out = useExit(T33);
  const head = usePop(s(69) - 0.2, 12, 180);
  if (t < T32 - 0.1 || t > T33 + 0.2) return null;
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <div style={{position: 'absolute', top: 44, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 20, opacity: Math.min(1, head * 2), transform: `translateY(${(1 - head) * -30}px)`}}>
        <div style={{fontFamily: mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, background: C.ink, color: '#fff', borderRadius: 999, padding: '8px 26px'}}>INDEPENDENT TEST</div>
        <div style={{fontFamily: hand, fontSize: 52, lineHeight: 1, color: C.ink}}>Piotr Skalski · Roboflow</div>
      </div>

      <div style={{position: 'absolute', left: 60, top: 190, opacity: chartIn, transform: `translateY(${(1 - chartIn) * 80}px)`}}>
        <CropCard src="images/part3_A08_roboflow_map_chart.png" srcW={1000} srcH={672} crop={{x: 0, y: 0, w: 1000, h: 672}} width={900}>
          {(k) => (
            <svg width={1000 * k} height={672 * k} style={{position: 'absolute', inset: 0}}>
              <Draw d={roughBoxPath(505 * k, 78 * k, 486 * k, 46 * k, 4, 3)} progress={ring} stroke={C.blue} width={5} />
            </svg>
          )}
        </CropCard>
        <Source text="Source: Roboflow" style={{marginTop: 10}} />
      </div>

      <div style={{position: 'absolute', left: 1020, top: 230, opacity: ocrIn, transform: `translateY(${(1 - ocrIn) * 80}px)`}}>
        <CropCard src="images/part3_A08_roboflow_scale_ocr.png" srcW={1000} srcH={563} crop={{x: 0, y: 0, w: 1000, h: 563}} width={840}>
          {(k) => (
            <svg width={1000 * k} height={563 * k} style={{position: 'absolute', inset: 0}}>
              <Draw d={roughBoxPath(98 * k, 194 * k, 92 * k, 38 * k, 6, 3)} progress={scaleBox} stroke={C.good} width={5} />
              <Draw d={roughBoxPath(692 * k, 448 * k, 130 * k, 40 * k, 8, 3)} progress={exactBox} stroke={C.good} width={5} />
            </svg>
          )}
        </CropCard>
        <Source text="Source: Roboflow" style={{marginTop: 10}} />
      </div>

      <div style={{position: 'absolute', left: 60, width: 900, top: 880, display: 'flex', justifyContent: 'center'}}>
        <Pill text="85.1% mAP@50 · #1 on detection" at={s(97)} color={C.good} size={48} />
      </div>
      <div style={{position: 'absolute', left: 1020, width: 840, top: 770, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
        <Pill text="OCR: 100% exact match" at={s(111) + 0.3} color={C.good} size={48} />
        <Pill text="at a fraction of the cost" at={s(120)} color={C.note} size={42} />
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* Scene 3.3 - DataCamp boundary collision (illustrative diagram)     */
/* ================================================================== */
const OPUS_PATH = 'M 80 320 C 220 320 300 150 470 140 C 600 130 640 380 770 400 C 900 420 1000 330 1120 320';
const ARGON_PATH = 'M 80 320 L 1120 316';

const Collision: React.FC = () => {
  const t = useT();
  const arena = usePop(s(146) - 0.3, 14, 160);
  const grid = useRange(s(146), s(146) + 1.2);
  const opus = useRange(s(155), s(166) + 0.3, (x) => x);
  const argon = useRange(s(167), s(172), (x) => x);
  const burst = usePop(s(171) - 0.1, 9, 220);
  const warn = usePop(s(171) + 0.2, 10, 200);
  const label = usePop(s(140) + 0.1, 12, 180);
  const out = useExit(T34);
  if (t < T33 - 0.1 || t > T34 + 0.2) return null;
  const A = {x: 400, y: 230, w: 140, h: 210};
  const B = {x: 700, y: 120, w: 140, h: 180};
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <WordPages words={W} from={125} to={139} minAppear={T33 + 0.1} holdUntil={s(140) + 0.2} moveAt={s(140) - 0.9} rows={2} maxChars={96} fontSize={74} top={70} keys={['cracks']} />
      <div style={{position: 'absolute', top: 100, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: Math.min(1, label * 2), transform: `translateY(${(1 - label) * -30}px)`}}>
        <div style={{fontFamily: hand, fontSize: 56, color: C.ink, lineHeight: 1}}>
          Josef Waples · <span style={{color: C.blue}}>DataCamp</span> obstacle test
        </div>
      </div>
      <div style={{position: 'absolute', left: 360, top: 330, opacity: Math.min(1, arena * 2), transform: `scale(${0.94 + 0.06 * arena})`}}>
        <PaperCard style={{width: 1200, height: 620, position: 'relative', overflow: 'hidden'}}>
          <svg width={1200} height={620} style={{position: 'absolute', inset: 0}}>
            {Array.from({length: 13}).map((_, i) => (
              <Draw key={`v${i}`} d={`M ${i * 100} 0 L ${i * 100} 620`} progress={grid} stroke="#E2E8F0" width={2} />
            ))}
            {Array.from({length: 7}).map((_, i) => (
              <Draw key={`h${i}`} d={`M 0 ${i * 100} L 1200 ${i * 100}`} progress={grid} stroke="#E2E8F0" width={2} />
            ))}
            {[A, B].map((o, i) => (
              <g key={i} opacity={grid}>
                <rect x={o.x} y={o.y} width={o.w} height={o.h} rx={8} fill="#E2E8F0" stroke={C.slateText} strokeWidth={5} />
                <path d={`M ${o.x + 14} ${o.y + 30} L ${o.x + o.w - 14} ${o.y + 30} M ${o.x + 14} ${o.y + 70} L ${o.x + o.w - 14} ${o.y + 70}`} stroke="#fff" strokeWidth={5} strokeLinecap="round" />
              </g>
            ))}
            <circle cx={70} cy={320} r={26} fill="#fff" stroke={C.ink} strokeWidth={6} opacity={grid} />
            <text x={70} y={326} textAnchor="middle" fontFamily={mono} fontWeight={700} fontSize={18} fill={C.ink} opacity={grid}>
              ARM
            </text>
            <path d="M 1120 280 L 1120 360 M 1120 284 L 1170 302 L 1120 322 Z" stroke={C.ink} strokeWidth={6} fill={C.note} strokeLinejoin="round" opacity={grid} />
            <Draw d={OPUS_PATH} progress={opus} stroke={C.good} width={9} />
            <Draw d={ARGON_PATH} progress={argon} stroke={C.bad} width={9} dash="0.03 0.022" />
            <g opacity={Math.min(1, burst * 2)} transform={`translate(470 320) scale(${0.4 + 0.6 * burst}) translate(-470 -320)`}>
              <path d="M470 250 L492 300 L545 288 L515 330 L560 360 L505 366 L500 415 L470 380 L440 415 L435 366 L380 360 L425 330 L395 288 L448 300 Z" fill={C.bad} opacity={0.2} stroke={C.bad} strokeWidth={5} strokeLinejoin="round" />
            </g>
          </svg>
          <div style={{position: 'absolute', left: 40, top: 28, display: 'flex', flexDirection: 'column', gap: 6, fontFamily: hand, fontSize: 38}}>
            <div style={{opacity: opus > 0.05 ? 1 : 0, color: C.good}}>━ Opus 5.5 · 0 collisions</div>
            <div style={{opacity: argon > 0.05 ? 1 : 0, color: C.bad}}>┅ Argon · clips through</div>
          </div>
          <div style={{position: 'absolute', right: 24, top: 22, fontFamily: mono, fontSize: 18, color: C.slateText}}>Illustrative simulation</div>
          <div
            style={{
              position: 'absolute',
              left: 250,
              top: 470,
              opacity: Math.min(1, warn * 2),
              transform: `scale(${0.7 + 0.3 * warn})`,
              background: C.bad,
              color: '#fff',
              fontFamily: mono,
              fontWeight: 700,
              fontSize: 30,
              letterSpacing: 1,
              padding: '10px 26px',
              borderRadius: 10,
              boxShadow: '0 12px 24px -10px rgba(220,38,38,0.6)',
            }}
          >
            ⚠ COLLISION DETECTED
          </div>
        </PaperCard>
        <Source text="Source: DataCamp test, recreated for illustration" style={{marginTop: 10}} />
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* Scene 3.4 - Pat Simmons comparison (custom recreation)             */
/* ================================================================== */
const RINGS: [number, number][] = [[125, 50], [160, 85], [200, 98], [240, 100], [290, 100], [340, 100], [390, 98]];
const BODY = 'M100 120 L100 80 Q100 60 120 60 L180 60 Q200 60 200 80 L200 120 C240 150 250 190 250 230 L250 380 Q250 410 220 410 L80 410 Q50 410 50 380 L50 230 C50 190 60 150 100 120 Z';

const FlatBottle: React.FC<{p: number}> = ({p}) => (
  <svg width={330} height={473} viewBox="0 0 300 430">
    <path d={BODY} fill="#CBD5E1" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" opacity={Math.min(1, p * 2)} />
    <rect x={110} y={30} width={80} height={34} rx={6} fill="#94A3B8" stroke={C.ink} strokeWidth={6} opacity={p} />
    <rect x={75} y={250} width={150} height={90} rx={8} fill="#fff" stroke={C.ink} strokeWidth={5} opacity={p} />
    <text x={150} y={310} textAnchor="middle" fontFamily={hand} fontSize={32} fill={C.ink} opacity={p}>
      COLD BREW
    </text>
    {[[22, 150, 14], [272, 205, 18], [30, 330, 12], [265, 345, 15]].map(([x, y, r], i) => (
      <circle key={i} cx={x} cy={y} r={r} fill="#94A3B8" stroke={C.ink} strokeWidth={4} opacity={p} />
    ))}
  </svg>
);

const MeshBottle: React.FC<{p: number}> = ({p}) => (
  <svg width={330} height={473} viewBox="0 0 300 430">
    <Draw d={BODY} progress={p} width={4} stroke={C.ink} />
    <rect x={110} y={30} width={80} height={34} rx={6} fill="none" stroke={C.ink} strokeWidth={4} opacity={p} />
    {RINGS.map(([y, rx], i) => (
      <ellipse key={i} cx={150} cy={y} rx={rx} ry={14} fill="none" stroke={C.good} strokeWidth={2.5} opacity={Math.min(1, p * 1.5) * 0.9} />
    ))}
    {[-1, -0.5, 0, 0.5, 1].map((f, i) => (
      <Draw key={i} d={RINGS.map(([y, rx], j) => `${j === 0 ? 'M' : 'L'} ${150 + f * rx} ${y + (f === 0 ? 14 : 14 * Math.sqrt(1 - f * f))}`).join(' ')} progress={p} width={2.5} stroke={C.good} />
    ))}
    <path d="M 62 270 C 90 250 120 290 150 270 S 210 250 238 272 L 238 380 Q 238 398 220 398 L 80 398 Q 62 398 62 380 Z" fill={C.good} opacity={0.18 * p} />
    <Draw d="M 78 300 C 98 285 116 300 136 288 M 170 312 C 192 298 214 312 228 300" progress={p} width={3} stroke={C.good} />
    <Draw d="M 82 150 C 70 190 70 230 76 270 M 218 150 C 232 190 232 230 226 270" progress={p} width={5} stroke={C.slateText} />
    <circle cx={150} cy={430} r={6} fill={C.good} opacity={p} />
  </svg>
);

const BottleCard: React.FC<{
  left: number;
  at: number;
  title: string;
  color: string;
  flat?: boolean;
  tags: {text: string; at: number; color: string}[];
}> = ({left, at, title, color, flat, tags}) => {
  const pop = usePop(at, 13, 170);
  const draw = useRange(at + 0.3, at + 2.6);
  return (
    <>
      <div style={{position: 'absolute', left, top: 210, width: 700, opacity: Math.min(1, pop * 2), transform: `translateY(${(1 - pop) * 80}px)`}}>
        <PaperCard border={color} style={{width: '100%', height: 560, boxSizing: 'border-box', borderWidth: 4, textAlign: 'center', paddingTop: 16}}>
          <div style={{fontFamily: mono, fontWeight: 700, fontSize: 22, letterSpacing: 2, color}}>{title}</div>
          <div style={{display: 'flex', justifyContent: 'center', marginTop: 4}}>{flat ? <FlatBottle p={draw} /> : <MeshBottle p={draw} />}</div>
        </PaperCard>
      </div>
      <div style={{position: 'absolute', left, top: 790, width: 700, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12}}>
        {tags.map((tg) => (
          <Pill key={tg.text} text={tg.text} at={tg.at} color={tg.color} size={34} />
        ))}
      </div>
    </>
  );
};

const Simmons: React.FC = () => {
  const t = useT();
  const head = usePop(s(179) - 0.3, 12, 170);
  const div = useRange(s(188), s(188) + 1.2);
  const out = useExit(T35);
  if (t < T34 - 0.1 || t > T35 + 0.2) return null;
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <div style={{position: 'absolute', top: 50, left: 0, right: 0, textAlign: 'center', opacity: Math.min(1, head * 2), transform: `translateY(${(1 - head) * -30}px)`}}>
        <div style={{fontFamily: hand, fontSize: 70, lineHeight: 1, color: C.ink}}>
          Pat Simmons · <span style={{color: C.blue}}>long-running</span> builds
        </div>
        <div style={{fontFamily: mono, fontSize: 20, color: C.slateText, marginTop: 10}}>Illustrative recreation · data from Pat Simmons&apos; test</div>
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Draw d="M 960 210 C 954 400 968 700 958 960" progress={div} stroke={C.slateText} width={6} />
      </svg>
      <BottleCard
        left={230}
        at={s(188)}
        title="GEMINI 4 ARGON"
        color={C.bad}
        flat
        tags={[
          {text: '⚠ 2D vector shortcuts', at: s(220), color: C.bad},
          {text: 'Missing animation triggers', at: s(228), color: C.bad},
          {text: 'Cost: $6.85', at: s(240) - 0.2, color: C.slateText},
          {text: 'Rank: #4 (last)', at: s(236), color: C.bad},
        ]}
      />
      <BottleCard
        left={990}
        at={s(190)}
        title="CLAUDE OPUS 5.5"
        color={C.good}
        tags={[
          {text: '✓ Photoreal 3D mesh', at: s(233), color: C.good},
          {text: 'Dynamic fluid physics', at: s(235), color: C.good},
          {text: 'Cost: $29.00', at: s(240) - 0.2, color: C.slateText},
          {text: 'Rank: #1 (winner)', at: s(236), color: C.good},
        ]}
      />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* Scene 3.5 - Terminal-Bench truth                                   */
/* ================================================================== */
const STRIP = {x: 1040, y: 431, w: 2050};
const TB_W = 1700;

const Bar: React.FC<{label: string; value: number; color: string; at: number; to: number; showAt: number}> = ({label, value, color, at, to, showAt}) => {
  const p = useRange(at, to, Easing.out(Easing.cubic));
  const max = 760;
  return (
    <div style={{marginTop: 26}}>
      <div style={{fontFamily: mono, fontWeight: 700, fontSize: 24, color: C.ink, marginBottom: 8}}>{label}</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
        <div style={{width: max, height: 54, border: `3px solid ${C.ink}`, borderRadius: 8, background: '#F1F5F9', position: 'relative'}}>
          <div style={{width: `${(value / 80) * 100 * p}%`, height: '100%', background: color, borderRadius: 4}} />
        </div>
        <div style={{fontFamily: hand, fontSize: 66, color, opacity: win(useT(), showAt, 999, 0.3, 1)}}>{value}%</div>
      </div>
    </div>
  );
};

const TerminalBench: React.FC = () => {
  const t = useT();
  const stripIn = useRange(T35 + 0.1, T35 + 0.9);
  const cardIn = useRange(T35 + 0.4, T35 + 1.2);
  const hiOpus = useRange(s(261), s(261) + 0.8);
  const hiArgon = useRange(s(267) - 0.3, s(267) + 0.6);
  const gap = useRange(s(269) - 0.2, s(269) + 0.9);
  const plus = usePop(s(269), 10, 200);
  const edge = usePop(s(280) - 0.1, 11, 190);
  const typed = Math.floor(lerp(t, [T35 + 0.8, T35 + 2.6], [0, 30]));
  if (t < T35 - 0.1) return null;
  const cmd = '$ eval --terminal-bench-4.0'.slice(0, typed);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: (1920 - TB_W) / 2, top: 80, opacity: stripIn, transform: `translateY(${(1 - stripIn) * 60}px)`}}>
        <PaperCard style={{overflow: 'hidden', width: TB_W, background: '#fff'}}>
          <CropCard src="images/part3_A07_deepmind_terminalbench_4k.png" srcW={3840} srcH={2160} crop={{...STRIP, h: 78}} width={TB_W} style={{border: 'none', boxShadow: 'none', borderRadius: 0}} />
          <div style={{textAlign: 'center', fontFamily: mono, fontSize: 22, color: C.slateText, lineHeight: '14px'}}>⋮</div>
          <CropCard src="images/part3_A07_deepmind_terminalbench_4k.png" srcW={3840} srcH={2160} crop={{...STRIP, y: 1041, h: 76}} width={TB_W} style={{border: 'none', boxShadow: 'none', borderRadius: 0}}>
            {(k) => (
              <svg width={STRIP.w * k} height={76 * k} style={{position: 'absolute', inset: 0}}>
                <Draw d={roughBoxPath(1716 * k, 4 * k, 318 * k, 68 * k, 3, 3)} progress={hiOpus} stroke={C.anthropic} width={5} />
                <Draw d={roughBoxPath(865 * k, 4 * k, 311 * k, 68 * k, 5, 3)} progress={hiArgon} stroke={C.google} width={5} />
              </svg>
            )}
          </CropCard>
        </PaperCard>
        <Source text="Source: Google DeepMind model card" style={{marginTop: 10}} />
      </div>

      <div style={{position: 'absolute', left: 130, top: 360, opacity: cardIn, transform: `translateY(${(1 - cardIn) * 80}px)`}}>
        <PaperCard style={{width: 1130, height: 450, boxSizing: 'border-box', overflow: 'hidden'}}>
          <div style={{height: 46, background: '#E2E8F0', display: 'flex', alignItems: 'center', gap: 9, padding: '0 16px'}}>
            {['#F87171', '#FBBF24', '#34D399'].map((c) => (
              <div key={c} style={{width: 14, height: 14, borderRadius: '50%', background: c}} />
            ))}
            <div style={{flex: 1, textAlign: 'center', fontFamily: mono, fontSize: 18, color: C.slateText}}>bash — eval</div>
          </div>
          <div style={{padding: '22px 36px 0'}}>
            <div style={{fontFamily: mono, fontWeight: 500, fontSize: 32, color: C.ink}}>
              {cmd}
              <span style={{opacity: Math.floor(t * 2) % 2 === 0 ? 1 : 0}}>▌</span>
            </div>
            <Bar label="Claude Opus 5.5" value={66.4} color={C.anthropic} at={s(261)} to={s(265) + 0.9} showAt={s(265)} />
            <Bar label="Gemini 4 Argon" value={57.4} color={C.google} at={s(267)} to={s(268) + 0.9} showAt={s(268)} />
          </div>
        </PaperCard>
      </div>

      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Draw d="M 1300 520 C 1340 520 1340 640 1300 640" progress={gap} stroke={C.ink} width={6} />
      </svg>
      <div style={{position: 'absolute', left: 1350, top: 470, width: 500, opacity: Math.min(1, plus * 2), transform: `scale(${0.8 + 0.2 * plus})`, transformOrigin: 'left center'}}>
        <div style={{fontFamily: hand, fontSize: 170, lineHeight: 0.9, color: C.anthropic}}>+9.0</div>
        <div style={{fontFamily: hand, fontSize: 44, lineHeight: 1.05, color: C.ink}}>points · practical dev edge for Claude</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 950, display: 'flex', justifyContent: 'center', opacity: Math.min(1, edge * 2), transform: `translateY(${(1 - edge) * 30}px)`}}>
        <div style={{background: C.anthropic, color: '#fff', fontFamily: hand, fontSize: 60, borderRadius: 999, padding: '0 44px 8px', boxShadow: '0 14px 28px -10px rgba(124,58,237,0.6)'}}>
          Anthropic keeps the edge
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================== */
export const ArgonV2Part3: React.FC = () => (
  <AbsoluteFill>
    <DotCanvas id="argon-dots-p3" />
    <Audio src={staticFile(PART3_AUDIO)} />
    <Official />
    <Roboflow />
    <Collision />
    <Simmons />
    <TerminalBench />
  </AbsoluteFill>
);
