import React from 'react';
import {AbsoluteFill, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BlurPatch, C, FramedBox, mono, sans} from './common';
import {ZoomInspectCallout} from './ZoomInspectCallout';

// 859 frames = 28.62s at 30fps (matches 0.90x tempo narration)
export const GENERATING_VIDEO_FRAMES = 859;

export const FramedGeneratingVideoInspect: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}});

  // Source video is 25.68s, target is 28.62s (859 frames), playbackRate = 25.68 / 28.62 = 0.897
  const videoRate = 25.68 / 28.62;

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <FramedBox progress={enter}>
        <OffthreadVideo
          src={staticFile('video assets/videos/generating-video.mov')}
          muted
          playbackRate={videoRate}
          style={{width: '100%', height: '100%', objectFit: 'contain'}}
        />

        {/* PII Blur Overlay: Bottom-Left Claude Profile */}
        <BlurPatch x={6} y={960} width={145} height={48} borderRadius={8} intensity={20} />

        {/* Top Floating Badge for general step awareness (0 to 120 frames) */}
        {frame < 120 && (
          <div
            style={{
              position: 'absolute',
              top: 34,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '12px 28px',
                borderRadius: 999,
                background: `${C.bg}f2`,
                border: `2px solid ${C.cyan}`,
                boxShadow: `0 0 30px ${C.cyan}55`,
              }}
            >
              <div
                style={{
                  fontFamily: mono,
                  fontWeight: 600,
                  fontSize: 20,
                  color: C.bg,
                  background: C.cyan,
                  borderRadius: 999,
                  padding: '3px 12px',
                }}
              >
                STEP 4
              </div>
              <div style={{fontFamily: sans, fontWeight: 800, fontSize: 36, color: C.text}}>
                The generation prompt
              </div>
            </div>
          </div>
        )}

        {/* MASTER PROMPT ZOOM INSPECT (frames 120 to 580 = 460 frames, ~15.3s) */}
        <ZoomInspectCallout
          fromFrame={120}
          durationInFrames={460}
          targetBox={{x: 605, y: 560, width: 955, height: 350}}
          badge="STEP 4 · THE MASTER PROMPT"
          badgeColor={C.amber}
          accentColor={C.amber}
          title="Short Film Animation Prompt"
          subtitle="claude.ai/code master specification"
          centerTop={160}
          centerWidth={930}
          centerCardHeight={440}
        >
          <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
            {/* Prompt Header Quote */}
            <div
              style={{
                background: 'rgba(5, 9, 20, 0.92)',
                border: `1.2px solid ${C.amber}55`,
                borderRadius: 12,
                padding: '14px 18px',
                fontFamily: mono,
                fontSize: 15.5,
                lineHeight: 1.5,
                color: C.text,
              }}
            >
              <div style={{color: C.amber, fontWeight: 700, marginBottom: 4}}>
                // Music Video Concept: AI Satire Short Film
              </div>
              &ldquo;Build a short film: a robot mascot, new shot every few seconds for each lyric line,
              reacting to audio kick &amp; bass frequencies...&rdquo;
            </div>

            {/* Architecture Highlights Grid */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}}>
              {/* Feature 1: Timing Config */}
              <div
                style={{
                  background: `${C.surface}bb`,
                  border: `1px solid ${C.cyan}44`,
                  borderRadius: 10,
                  padding: '10px 14px',
                }}
              >
                <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3}}>
                  <span style={{fontSize: 16}}>⚙️</span>
                  <span style={{fontFamily: mono, fontWeight: 700, fontSize: 14.5, color: C.cyan}}>
                    src/timing.ts
                  </span>
                </div>
                <div style={{fontFamily: sans, fontSize: 13, color: `${C.text}bb`}}>
                  Single source of truth: 30 FPS, 1,050 frames, 12 shots, lyric timestamps &amp; palettes.
                </div>
              </div>

              {/* Feature 2: Mascot & Story */}
              <div
                style={{
                  background: `${C.surface}bb`,
                  border: `1px solid ${C.green}44`,
                  borderRadius: 10,
                  padding: '10px 14px',
                }}
              >
                <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3}}>
                  <span style={{fontSize: 16}}>🤖</span>
                  <span style={{fontFamily: mono, fontWeight: 700, fontSize: 14.5, color: C.green}}>
                    Mascot.tsx &amp; Camera
                  </span>
                </div>
                <div style={{fontFamily: sans, fontSize: 13, color: `${C.text}bb`}}>
                  Animated robot mascot with spring bounces, whip-pans, and seamless loop return.
                </div>
              </div>

              {/* Feature 3: Audio Reactive */}
              <div
                style={{
                  background: `${C.surface}bb`,
                  border: `1px solid ${C.amber}44`,
                  borderRadius: 10,
                  padding: '10px 14px',
                }}
              >
                <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3}}>
                  <span style={{fontSize: 16}}>🎵</span>
                  <span style={{fontFamily: mono, fontWeight: 700, fontSize: 14.5, color: C.amber}}>
                    useAudioSignals.ts
                  </span>
                </div>
                <div style={{fontFamily: sans, fontSize: 13, color: `${C.text}bb`}}>
                  Wraps <code style={{fontFamily: mono}}>useAudioData</code>: bass, mids, highs, and beat kick detection.
                </div>
              </div>

              {/* Feature 4: Self-Verification */}
              <div
                style={{
                  background: `${C.surface}bb`,
                  border: `1px solid ${C.coral}44`,
                  borderRadius: 10,
                  padding: '10px 14px',
                }}
              >
                <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3}}>
                  <span style={{fontSize: 16}}>📸</span>
                  <span style={{fontFamily: mono, fontWeight: 700, fontSize: 14.5, color: C.coral}}>
                    Autonomous Checks
                  </span>
                </div>
                <div style={{fontFamily: sans, fontSize: 13, color: `${C.text}bb`}}>
                  Claude renders still frames to inspect visuals and fixes any syntax or visual bugs.
                </div>
              </div>
            </div>
          </div>
        </ZoomInspectCallout>
      </FramedBox>
    </AbsoluteFill>
  );
};

