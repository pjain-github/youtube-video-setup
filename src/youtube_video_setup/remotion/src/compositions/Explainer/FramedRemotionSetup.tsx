import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FramedBox, mono, sans, smooth} from './common';

// 851 frames = 28.36s at 30fps (matches 0.90x tempo narration)
export const REMOTION_SETUP_FRAMES = 851;

export const FramedRemotionSetup: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}});

  // Split:
  // Phase 1 (0 to 660 frames = 22.0s): Slow 0.5x speed while reading & pasting the prompt (0 to 11s source)
  // Phase 2 (660 to 851 frames = 6.36s): Fast 32x speed while Claude builds & commits (11s to 211s source)
  const isSpedUp = frame >= 660;

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <FramedBox progress={enter}>
        {/* Phase 1: Slow 0.5x Speed while showing the prompt */}
        <Sequence from={0} durationInFrames={660}>
          <OffthreadVideo
            src={staticFile('video assets/videos/remotion-setup.mov')}
            muted
            playbackRate={0.5}
            style={{width: '100%', height: '100%', objectFit: 'contain'}}
          />
        </Sequence>

        {/* Phase 2: Fast-forward while building in cloud */}
        <Sequence from={660} durationInFrames={191}>
          <OffthreadVideo
            src={staticFile('video assets/videos/remotion-setup.mov')}
            muted
            startFrom={Math.round(11 * 60)} // source is 60fps
            playbackRate={31.5}
            style={{width: '100%', height: '100%', objectFit: 'contain'}}
          />
        </Sequence>

        {/* Callout 1 (0 to 650 frames): Paste the prompt (slowed down for readability) */}
        {frame < 650 && (
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
                gap: 20,
                padding: '16px 36px',
                borderRadius: 999,
                background: `${C.bg}f2`,
                border: `2px solid ${C.cyan}`,
                boxShadow: `0 0 40px ${C.cyan}55, 0 18px 50px rgba(0,0,0,0.6)`,
              }}
            >
              <div
                style={{
                  fontFamily: mono,
                  fontWeight: 600,
                  fontSize: 26,
                  color: C.bg,
                  background: C.cyan,
                  borderRadius: 999,
                  padding: '4px 16px',
                }}
              >
                STEP 2
              </div>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{fontFamily: sans, fontWeight: 800, fontSize: 46, color: C.text, letterSpacing: -1, lineHeight: 1.1}}>
                  Type what you want to set up
                </div>
                <div style={{fontFamily: sans, fontWeight: 500, fontSize: 24, color: C.amber, marginTop: 2}}>
                  Blank TypeScript template + audio tools (0.5x view)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Callout 2 (650 to 851 frames): Claude building in cloud */}
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
                gap: 20,
                padding: '16px 36px',
                borderRadius: 999,
                background: `${C.bg}f2`,
                border: `2px solid ${C.green}`,
                boxShadow: `0 0 40px ${C.green}55, 0 18px 50px rgba(0,0,0,0.6)`,
              }}
            >
              <div
                style={{
                  fontFamily: mono,
                  fontWeight: 600,
                  fontSize: 26,
                  color: C.bg,
                  background: C.green,
                  borderRadius: 999,
                  padding: '4px 16px',
                }}
              >
                CLOUD
              </div>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{fontFamily: sans, fontWeight: 800, fontSize: 46, color: C.text, letterSpacing: -1, lineHeight: 1.1}}>
                  Claude builds &amp; commits
                </div>
                <div style={{fontFamily: sans, fontWeight: 500, fontSize: 24, color: C.text, opacity: 0.85, marginTop: 2}}>
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
              fontSize: 38,
              color: C.bg,
              background: C.amber,
              borderRadius: 14,
              padding: '6px 22px',
              boxShadow: `0 0 30px ${C.amber}88`,
            }}
          >
            FAST FORWARD
          </div>
        )}
      </FramedBox>
    </AbsoluteFill>
  );
};
