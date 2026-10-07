import React from 'react';
import {AbsoluteFill, Easing, Sequence, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Activity, Code, GraduationCap, Languages} from 'lucide-react';
import {colors, fonts} from '../colors';
import {Bg} from '../components/Bg';
import {Scene} from '../components/Scene';
import {Typewriter} from '../components/Typewriter';
import {useSpring} from '../utils/useSpring';

const CARD_FRAMES = 105;

const Shell: React.FC<{icon: React.ReactNode; title: string; children: React.ReactNode}> = ({icon, title, children}) => {
  const frame = useCurrentFrame();
  const p = useSpring(0);
  const out = interpolate(frame, [CARD_FRAMES - 17, CARD_FRAMES], [0, -1300], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
  });
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', transform: `translateX(${(1 - p) * 1300 + out}px)`}}>
      <div
        style={{
          width: 900,
          height: 480,
          marginTop: -60,
          borderRadius: 32,
          background: colors.surface,
          border: `2px solid ${colors.cyan}33`,
          padding: '34px 48px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 16, color: colors.cyan, fontSize: 34, fontWeight: 600}}>
          {icon}
          <span style={{color: colors.white}}>{title}</span>
        </div>
        <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
      </div>
    </AbsoluteFill>
  );
};

const Chip: React.FC<{label: string}> = ({label}) => (
  <div
    style={{
      padding: '6px 16px',
      borderRadius: 999,
      border: `2px solid ${colors.cyan}`,
      color: colors.cyan,
      fontFamily: fonts.mono,
      fontSize: 22,
      fontWeight: 700,
    }}
  >
    {label}
  </div>
);

const Translate: React.FC = () => {
  const frame = useCurrentFrame();
  const row2 = useSpring(40);
  const row = (chip: string, text: string, delay: number, style?: React.CSSProperties) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        width: 700,
        height: 90,
        padding: '0 28px',
        borderRadius: 20,
        background: colors.bg,
        fontSize: 38,
        color: colors.white,
        ...style,
      }}
    >
      <Chip label={chip} />
      <Typewriter text={text} delay={delay} speed={1.2} />
    </div>
  );
  void frame;
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
      {row('EN', 'Hello, how are you?', 14)}
      <div style={{color: colors.cyan, fontSize: 34, opacity: row2}}>↓</div>
      {row('ES', 'Hola, ¿cómo estás?', 46, {opacity: row2, border: `2px solid ${colors.cyan}55`})}
    </div>
  );
};

const Tutor: React.FC = () => {
  const frame = useCurrentFrame();
  const terms = ['E', ' = ', 'm', 'c²'];
  const hot = frame < 20 ? -1 : Math.min(2, Math.floor((frame - 20) / 16));
  const hotIdx = [0, 2, 3][Math.max(0, hot)];
  return (
    <div style={{textAlign: 'center'}}>
      <div style={{fontSize: 120, fontWeight: 900, color: colors.white, display: 'flex', justifyContent: 'center'}}>
        {terms.map((t, i) => (
          <span
            key={i}
            style={{
              padding: '0 12px',
              borderRadius: 16,
              color: hot >= 0 && i === hotIdx ? colors.bg : colors.white,
              background: hot >= 0 && i === hotIdx ? colors.cyan : 'transparent',
              whiteSpace: 'pre',
            }}
          >
            {t}
          </span>
        ))}
      </div>
      <div style={{marginTop: 24, fontSize: 30, color: colors.white, opacity: 0.8, height: 40}}>
        <Typewriter text="Energy equals mass times the speed of light, squared." delay={50} speed={0.8} />
      </div>
    </div>
  );
};

const Medical: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [30, 55], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const label = useSpring(58);
  const blobs = Array.from({length: 14}).map((_, i) => {
    const x = 15 + random(`mx${i}`) * 70;
    const y = 15 + random(`my${i}`) * 70;
    const a = 0.08 + random(`ma${i}`) * 0.28;
    const r = 18 + random(`mr${i}`) * 30;
    return `radial-gradient(circle at ${x}% ${y}%, rgba(220,226,240,${a}) 0%, transparent ${r}%)`;
  });
  const perim = 2 * (110 + 80);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 56}}>
      <div style={{position: 'relative', width: 280, height: 280}}>
        <div
          style={{
            width: 280,
            height: 280,
            borderRadius: 140,
            background: `${blobs.join(',')}, #161B27`,
            filter: 'grayscale(1)',
          }}
        />
        <svg width={280} height={280} style={{position: 'absolute', inset: 0}}>
          <rect
            x={140}
            y={60}
            width={110}
            height={80}
            rx={14}
            fill="none"
            stroke={colors.green}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={perim}
            strokeDashoffset={perim * (1 - draw)}
          />
        </svg>
      </div>
      <div style={{opacity: label, transform: `translateX(${(1 - label) * 30}px)`}}>
        <div style={{fontFamily: fonts.mono, fontSize: 40, fontWeight: 700, color: colors.green}}>Anomaly 0.94</div>
        <div style={{fontSize: 26, color: colors.white, opacity: 0.7, marginTop: 8}}>Region flagged for review</div>
      </div>
    </div>
  );
};

const CODE = ['def total(items):', '    return sum(i.price for i in items)', '', 'assert total(cart) == 42', 'print("ok")'];
const KW = /(\b(?:def|return|for|in|assert|print)\b)/;

const CodeCard: React.FC = () => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.floor((frame - 12) / 0.7));
  const total = CODE.join('\n').length;
  const pass = useSpring(12 + Math.ceil(total * 0.7) + 6);
  let left = n;
  return (
    <div style={{width: 760}}>
      <div style={{fontFamily: fonts.mono, fontSize: 27, lineHeight: '44px', background: colors.bg, borderRadius: 18, padding: '18px 28px', height: 244}}>
        {CODE.map((line, i) => {
          const take = Math.max(0, Math.min(line.length, left));
          left -= line.length + 1;
          return (
            <div key={i} style={{whiteSpace: 'pre', color: colors.white, height: 44}}>
              {line
                .slice(0, take)
                .split(KW)
                .map((part, k) => (
                  <span key={k} style={{color: KW.test(part) && part.length > 1 ? colors.cyan : colors.white}}>
                    {part}
                  </span>
                ))}
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 14,
          padding: '10px 22px',
          borderRadius: 14,
          background: `${colors.green}22`,
          color: colors.green,
          fontFamily: fonts.mono,
          fontWeight: 700,
          fontSize: 28,
          opacity: pass,
          transform: `translateY(${(1 - pass) * 14}px)`,
        }}
      >
        Tests passed ✓
      </div>
    </div>
  );
};

const CARDS = [
  {title: 'Translate', icon: <Languages size={40} />, body: <Translate />},
  {title: 'Tutor', icon: <GraduationCap size={40} />, body: <Tutor />},
  {title: 'Medical imaging', icon: <Activity size={40} />, body: <Medical />},
  {title: 'Code', icon: <Code size={40} />, body: <CodeCard />},
];

const Carousel: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  void fps;
  const active = Math.min(CARDS.length - 1, Math.floor(frame / CARD_FRAMES));
  return (
    <Bg>
      {CARDS.map((c, i) => (
        <Sequence key={c.title} from={i * CARD_FRAMES} durationInFrames={CARD_FRAMES}>
          <Shell icon={c.icon} title={c.title}>
            {c.body}
          </Shell>
        </Sequence>
      ))}
      <div style={{position: 'absolute', left: 0, right: 0, top: 830, display: 'flex', justifyContent: 'center', gap: 20}}>
        {CARDS.map((_, i) => (
          <div
            key={i}
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              background: i === active ? colors.cyan : colors.surface,
              border: `2px solid ${colors.cyan}66`,
            }}
          />
        ))}
      </div>
    </Bg>
  );
};

export const UtilityCarousel: React.FC<{durationInFrames?: number}> = ({durationInFrames = 420}) => (
  <Scene durationInFrames={durationInFrames}>
    <Carousel />
  </Scene>
);
