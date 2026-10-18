import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BlurPatch, C, FramedBox, mono, sans, smooth} from './common';
import {ZoomInspectCallout} from './ZoomInspectCallout';

// 851 frames = 28.36s at 30fps (matches 0.90x tempo narration)
export const REMOTION_SETUP_FRAMES = 851;

export const FramedRemotionSetupInspect: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}});

  // Phases:
  // Phase 1 (0 to 180 frames = 6.0s): Normal pace opening Claude Code & preparing prompt (0s to 4.8s source)
  // Phase 2 (180 to 390 frames = 7.0s): PAUSED ON PROMPT (frozen at 4.8s source) with Zoom Highlight Callout!
  // Phase 3 (390 to 851 frames = 15.36s): Fast-forward building in the cloud (4.8s to 211s source)
  const isSpedUp = frame >= 390;

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <FramedBox progress={enter}>
        {/* PII Blur Overlays: Bottom-Left Profile & Top Greeting */}
        <BlurPatch x={6} y={918} width={145} height={46} borderRadius={8} intensity={20} />
        {frame < 390 && (
          <BlurPatch x={670} y={86} width={315} height={44} borderRadius={10} intensity={20} />
        )}

        {/* Phase 1: Normal pace approaching prompt input (0 to 180 frames) */}
        <Sequence from={0} durationInFrames={180}>
          <OffthreadVideo
            src={staticFile('video assets/videos/remotion-setup.mov')}
            muted
            playbackRate={0.8}
            style={{width: '100%', height: '100%', objectFit: 'contain'}}
          />
        </Sequence>

        {/* Phase 2: PAUSED ON PROMPT (180 to 390 frames = 7 full seconds freeze) */}
        <Sequence from={180} durationInFrames={210}>
          <Img
            src={staticFile('video assets/videos/remotion_setup_prompt_frozen.png')}
            style={{width: '100%', height: '100%', objectFit: 'contain'}}
          />
        </Sequence>

        {/* Phase 3: Fast-forward while building in cloud (390 to 851 frames) */}
        <Sequence from={390} durationInFrames={461}>
          <OffthreadVideo
            src={staticFile('video assets/videos/remotion-setup.mov')}
            muted
            startFrom={Math.round(4.8 * 30)}
            playbackRate={14.8}
            style={{width: '100%', height: '100%', objectFit: 'contain'}}
          />
        </Sequence>

        {/* POINT D: PROMPT ZOOM INSPECT (frames 180 to 380 = 200 frames, ~6.6s) - 20% reduced */}
        <ZoomInspectCallout
          fromFrame={180}
          durationInFrames={200}
          targetBox={{x: 720, y: 825, width: 770, height: 100}}
          badge="POINT D · SETUP PROMPT"
          badgeColor={C.cyan}
          accentColor={C.cyan}
          title="Type What You Want to Set Up"
          subtitle="claude.ai/code"
          centerTop={220}
          centerCardHeight={290}
          centerWidth={920}
        >
          <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            {/* Syntax Styled Prompt Box (font reduced from 22px to 17.5px) */}
            <div
              style={{
                background: 'rgba(5, 9, 20, 0.90)',
                border: `1.2px solid ${C.cyan}55`,
                borderRadius: 12,
                padding: '16px 22px',
                fontFamily: mono,
                fontSize: 17.5,
                lineHeight: 1.55,
                color: C.text,
              }}
            >
              Set up a new Remotion project in this repo using{' '}
              <span
                style={{
                  color: C.cyan,
                  background: `${C.cyan}22`,
                  padding: '2px 6px',
                  borderRadius: 5,
                  fontWeight: 700,
                  border: `1px solid ${C.cyan}66`,
                }}
              >
                npx create-video@latest
              </span>{' '}
              with the{' '}
              <span
                style={{
                  color: C.green,
                  background: `${C.green}22`,
                  padding: '2px 6px',
                  borderRadius: 5,
                  fontWeight: 700,
                  border: `1px solid ${C.green}66`,
                }}
              >
                blank TypeScript template
              </span>
              . Install{' '}
              <span
                style={{
                  color: C.amber,
                  background: `${C.amber}22`,
                  padding: '2px 6px',
                  borderRadius: 5,
                  fontWeight: 700,
                  border: `1px solid ${C.amber}66`,
                }}
              >
                @remotion/media-utils
              </span>{' '}
              so we have audio visualization APIs. Verify that the project builds cleanly,
              then commit everything to main with the message{' '}
              <span style={{color: C.coral}}>'Initial Remotion setup'</span>.
            </div>

            {/* Two Key Takeaways Highlights */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}}>
              <div
                style={{
                  background: 'rgba(5, 9, 20, 0.88)',
                  border: `1px solid ${C.green}44`,
                  borderRadius: 10,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div style={{fontSize: 20}}>⚡️</div>
                <div>
                  <div style={{fontFamily: sans, fontWeight: 700, fontSize: 15, color: C.green}}>
                    Blank TypeScript Template
                  </div>
                  <div style={{fontFamily: sans, fontSize: 12.5, color: `${C.text}88`}}>
                    Clean project without starter clutter
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(5, 9, 20, 0.88)',
                  border: `1px solid ${C.amber}44`,
                  borderRadius: 10,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div style={{fontSize: 20}}>🎵</div>
                <div>
                  <div style={{fontFamily: sans, fontWeight: 700, fontSize: 15, color: C.amber}}>
                    @remotion/media-utils
                  </div>
                  <div style={{fontFamily: sans, fontSize: 12.5, color: `${C.text}88`}}>
                    Built-in audio frequency analysis APIs
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ZoomInspectCallout>

        {/* Top Callout for Phase 3: Claude building in cloud (390 to 851 frames) */}
        {isSpedUp && (
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
                border: `2px solid ${C.green}`,
                boxShadow: `0 0 35px ${C.green}55`,
              }}
            >
              <div
                style={{
                  fontFamily: mono,
                  fontWeight: 600,
                  fontSize: 20,
                  color: C.bg,
                  background: C.green,
                  borderRadius: 999,
                  padding: '3px 12px',
                }}
              >
                CLOUD
              </div>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{fontFamily: sans, fontWeight: 800, fontSize: 36, color: C.text, letterSpacing: -1, lineHeight: 1.1}}>
                  Claude builds &amp; commits
                </div>
                <div style={{fontFamily: sans, fontWeight: 500, fontSize: 18, color: C.text, opacity: 0.85, marginTop: 2}}>
                  Auto-scaffolded &amp; pushed to GitHub
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Badge during fast-forward */}
        {isSpedUp && (
          <div
            style={{
              position: 'absolute',
              right: 28,
              bottom: 28,
              fontFamily: mono,
              fontWeight: 700,
              fontSize: 30,
              color: C.bg,
              background: C.amber,
              borderRadius: 12,
              padding: '5px 16px',
              boxShadow: `0 0 25px ${C.amber}88`,
              opacity: 0.8 + 0.2 * smooth(0.5 + 0.5 * Math.sin(frame * 0.2)),
            }}
          >
            FAST FORWARD
          </div>
        )}
      </FramedBox>
    </AbsoluteFill>
  );
};
