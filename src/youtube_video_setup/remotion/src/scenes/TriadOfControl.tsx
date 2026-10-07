import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Eye} from 'lucide-react';
import {colors, fonts} from '../colors';
import {Bg} from '../components/Bg';
import {Scene} from '../components/Scene';
import {springAt} from '../utils/useSpring';

const CX = 960;
const CY = 540;
const RINGS = [
  {r: 120, label: 'GOAL SPECIFICATION', color: colors.cyan, speed: 0.9, phase: 200},
  {r: 190, label: 'PERMISSION BOUNDARIES', color: colors.amber, speed: -0.6, phase: 20},
  {r: 260, label: 'KILL-SWITCHES', color: colors.coral, speed: 0.4, phase: 110},
];
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Triad: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const eye = springAt(frame, fps, 0);
  const pulse = 1 + 0.07 * Math.sin(frame / 18);

  return (
    <Bg>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {RINGS.map((ring, i) => {
          const circ = 2 * Math.PI * ring.r;
          const draw = interpolate(frame, [i * 28, i * 28 + 44], [0, 1], clamp);
          const ang = ring.phase + frame * ring.speed;
          const dotA = ((ang + 180) * Math.PI) / 180;
          return (
            <g key={ring.r}>
              <circle
                cx={CX}
                cy={CY}
                r={ring.r}
                fill="none"
                stroke={ring.color}
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - draw)}
                opacity={0.8}
                transform={`rotate(-90 ${CX} ${CY})`}
              />
              <circle cx={CX + ring.r * Math.cos(dotA)} cy={CY + ring.r * Math.sin(dotA)} r={9} fill={ring.color} opacity={draw} />
            </g>
          );
        })}
      </svg>
      {/* labels ride the rings but stay upright (HTML is never rotated) */}
      {RINGS.map((ring, i) => {
        const draw = interpolate(frame, [i * 28 + 30, i * 28 + 50], [0, 1], clamp);
        const a = ((ring.phase + frame * ring.speed) * Math.PI) / 180;
        // anchor the chip outward from its ring point so it never slides under the centre eye
        const halfW = (ring.label.length * 13.4 + 36) / 2;
        const ox = Math.cos(a) * halfW;
        return (
          <div
            key={ring.label}
            style={{
              position: 'absolute',
              left: CX + ring.r * Math.cos(a) + ox,
              top: CY + ring.r * Math.sin(a),
              transform: 'translate(-50%, -50%)',
              padding: '6px 16px',
              borderRadius: 999,
              background: colors.bg,
              border: `2px solid ${ring.color}`,
              fontFamily: fonts.mono,
              fontWeight: 700,
              fontSize: 19,
              letterSpacing: 2,
              color: ring.color,
              whiteSpace: 'nowrap',
              opacity: draw,
            }}
          >
            {ring.label}
          </div>
        );
      })}
      {/* center eye */}
      <div
        style={{
          position: 'absolute',
          left: CX - 60,
          top: CY - 60,
          width: 120,
          height: 120,
          borderRadius: 60,
          background: colors.surface,
          border: `3px solid ${colors.white}55`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${eye * pulse})`,
        }}
      >
        <Eye size={58} color={colors.white} strokeWidth={2} strokeLinecap="round" />
      </div>
    </Bg>
  );
};

export const TriadOfControl: React.FC<{durationInFrames?: number}> = ({durationInFrames = 270}) => (
  <Scene durationInFrames={durationInFrames}>
    <Triad />
  </Scene>
);
