import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Backdrop, C, cardStyle, mono, sans, smooth} from './common';

export const HOOK_REVEAL_FRAMES = 572; // ~19.06s at 30fps

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const HookReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Phase 1: 0 - 180 (0s - 6s) "Did you like that? Built 100% with AI"
  const p1Enter = spring({frame, fps, config: {damping: 200}});
  const p1Exit = interpolate(frame, [160, 180], [0, 1], clamp);

  // Phase 2: 180 - 380 (6s - 12.6s) "No editing skills · No software · Just code"
  const p2Enter = spring({frame: frame - 180, fps, config: {damping: 200}});
  const p2Exit = interpolate(frame, [360, 380], [0, 1], clamp);

  // Phase 3: 380 - 572 (12.6s - 19.06s) "The exact prompts & full workflow"
  const p3Enter = spring({frame: frame - 380, fps, config: {damping: 200}});
  const p3Exit = interpolate(frame, [555, 572], [0, 1], clamp);

  const pulse = Math.sin(frame * 0.1) * 0.5 + 0.5;

  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Backdrop />

      {/* Decorative ambient background glows */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          left: 400,
          width: 800,
          height: 800,
          borderRadius: 400,
          background: `radial-gradient(circle, ${C.cyan}18 0%, transparent 70%)`,
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -150,
          right: 300,
          width: 900,
          height: 900,
          borderRadius: 450,
          background: `radial-gradient(circle, ${C.coral}14 0%, transparent 70%)`,
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* PHASE 1: DID YOU LIKE THAT? 100% GENERATED WITH AI */}
      {frame < 190 && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: p1Enter * (1 - p1Exit),
            transform: `scale(${0.95 + 0.05 * p1Enter}) translateY(${-30 * p1Exit}px)`,
          }}
        >
          {/* Glowing Top Chip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '12px 32px',
              borderRadius: 999,
              background: `${C.surface}ee`,
              border: `2px solid ${C.cyan}`,
              boxShadow: `0 0 35px ${C.cyan}44`,
              marginBottom: 36,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                background: C.green,
                boxShadow: `0 0 16px ${C.green}`,
              }}
            />
            <span
              style={{
                fontFamily: mono,
                fontSize: 28,
                fontWeight: 700,
                color: C.cyan,
                letterSpacing: 2,
              }}
            >
              100% GENERATED WITH AI
            </span>
          </div>

          <h1
            style={{
              fontFamily: sans,
              fontSize: 110,
              fontWeight: 900,
              color: C.text,
              letterSpacing: -3,
              margin: 0,
              textAlign: 'center',
              textShadow: `0 0 ${40 + 30 * pulse}px ${C.cyan}44`,
            }}
          >
            DID YOU LIKE THAT?
          </h1>

          <p
            style={{
              fontFamily: sans,
              fontSize: 44,
              fontWeight: 500,
              color: `${C.text}cc`,
              marginTop: 24,
              textAlign: 'center',
            }}
          >
            Built from scratch in a single browser tab.
          </p>
        </AbsoluteFill>
      )}

      {/* PHASE 2: 3 PILLARS - NO SKILLS · NO SOFTWARE · JUST CODE */}
      {frame >= 170 && frame < 390 && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: p2Enter * (1 - p2Exit),
            transform: `scale(${0.95 + 0.05 * p2Enter}) translateY(${-25 * p2Exit}px)`,
          }}
        >
          <div style={{display: 'flex', gap: 36, marginBottom: 50}}>
            {[
              {tag: '01', title: 'NO EDITING SKILLS', sub: 'Zero video experience needed', color: C.cyan},
              {tag: '02', title: 'NO SOFTWARE INSTALLED', sub: 'Runs 100% in the cloud', color: C.amber},
              {tag: '03', title: 'JUST PURE CODE', sub: 'TypeScript & Remotion', color: C.green},
            ].map((card, i) => {
              const cardIn = spring({frame: frame - 185 - i * 6, fps, config: {damping: 200}});
              return (
                <div
                  key={i}
                  style={{
                    ...cardStyle,
                    width: 480,
                    padding: '44px 36px',
                    opacity: cardIn,
                    transform: `translateY(${(1 - cardIn) * 40}px)`,
                    borderTop: `4px solid ${card.color}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: mono,
                      fontSize: 24,
                      fontWeight: 700,
                      color: card.color,
                      letterSpacing: 3,
                      marginBottom: 16,
                    }}
                  >
                    STEP {card.tag}
                  </span>
                  <div
                    style={{
                      fontFamily: sans,
                      fontSize: 34,
                      fontWeight: 800,
                      color: C.text,
                      lineHeight: 1.2,
                    }}
                  >
                    {card.title}
                  </div>
                  <div
                    style={{
                      fontFamily: sans,
                      fontSize: 22,
                      fontWeight: 500,
                      color: `${C.text}99`,
                      marginTop: 14,
                    }}
                  >
                    {card.sub}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Typing terminal snippet */}
          <div
            style={{
              ...cardStyle,
              padding: '18px 40px',
              borderRadius: 999,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              background: `${C.surface}cc`,
            }}
          >
            <span style={{fontFamily: mono, fontSize: 26, color: C.cyan}}>
              &gt; const musicVideo = await Claude.code(&#39;build from track.mp3&#39;);
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* PHASE 3: THE EXACT PROMPTS & COMPLETE WORKFLOW */}
      {frame >= 370 && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: p3Enter * (1 - p3Exit),
            transform: `scale(${0.95 + 0.05 * p3Enter})`,
          }}
        >
          <div
            style={{
              ...cardStyle,
              width: 1300,
              padding: '60px 80px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: `0 0 60px ${C.cyan}33, 0 30px 80px rgba(0,0,0,0.7)`,
              border: `2px solid ${C.cyan}`,
            }}
          >
            <div
              style={{
                fontFamily: mono,
                fontSize: 24,
                fontWeight: 700,
                color: C.cyan,
                letterSpacing: 4,
                marginBottom: 20,
              }}
            >
              COMPLETE BREAKDOWN
            </div>

            <h2
              style={{
                fontFamily: sans,
                fontSize: 72,
                fontWeight: 900,
                color: C.text,
                letterSpacing: -2,
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              THE EXACT PROMPTS &amp; CLOUD WORKFLOW
            </h2>

            <p
              style={{
                fontFamily: sans,
                fontSize: 34,
                fontWeight: 500,
                color: `${C.text}bb`,
                marginTop: 24,
                maxWidth: 900,
              }}
            >
              Step-by-step from blank GitHub repo to full 1080p render.
            </p>

            <div
              style={{
                marginTop: 40,
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                padding: '16px 44px',
                borderRadius: 999,
                background: `${C.cyan}22`,
                border: `1px solid ${C.cyan}`,
              }}
            >
              <span style={{fontFamily: sans, fontSize: 28, fontWeight: 700, color: C.cyan}}>
                Let&#39;s dive in →
              </span>
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
