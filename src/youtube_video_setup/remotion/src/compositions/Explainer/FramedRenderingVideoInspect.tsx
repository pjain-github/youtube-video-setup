import React from 'react';
import {AbsoluteFill, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BlurPatch, C, FramedBox, mono, sans} from './common';
import {ZoomInspectCallout} from './ZoomInspectCallout';

// 691 frames = 23.02s at 30fps (matches 0.90x tempo narration)
export const RENDERING_VIDEO_FRAMES = 691;

export const FramedRenderingVideoInspect: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}});

  // Source video is 59.36s, target is 23.02s (691 frames), playbackRate = 59.36 / 23.02 = 2.578
  const videoRate = 59.36 / 23.02;

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <FramedBox progress={enter}>
        <OffthreadVideo
          src={staticFile('video assets/videos/rendering-video.mov')}
          muted
          playbackRate={videoRate}
          style={{width: '100%', height: '100%', objectFit: 'contain'}}
        />

        {/* PII Blur Overlay: Bottom-Left Claude Profile */}
        <BlurPatch x={6} y={960} width={145} height={48} borderRadius={8} intensity={20} />

        {/* Top Floating Badge for general step awareness (0 to 110 frames) */}
        {frame < 110 && (
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
                STEP 5
              </div>
              <div style={{fontFamily: sans, fontWeight: 800, fontSize: 36, color: C.text}}>
                Autonomous render in the cloud
              </div>
            </div>
          </div>
        )}

        {/* RENDER INSTRUCTION ZOOM INSPECT (frames 60 to 390 = 330 frames, ~11s) */}
        {/* targetBox lowered to frame the chat placeholder directly */}
        <ZoomInspectCallout
          fromFrame={60}
          durationInFrames={330}
          targetBox={{x: 605, y: 878, width: 950, height: 76}}
          badge="STEP 5 · EXECUTE RENDER"
          badgeColor={C.cyan}
          accentColor={C.cyan}
          title="Trigger Remotion Cloud Render"
          subtitle="claude.ai/code autonomous execution"
          centerTop={240}
          centerWidth={890}
          centerCardHeight={280}
        >
          <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
            {/* User Prompt Box */}
            <div
              style={{
                background: 'rgba(5, 9, 20, 0.90)',
                border: `1.2px solid ${C.cyan}55`,
                borderRadius: 12,
                padding: '16px 20px',
                fontFamily: mono,
                fontSize: 17,
                lineHeight: 1.5,
                color: C.text,
              }}
            >
              &ldquo;
              <span style={{color: C.cyan, fontWeight: 700}}>
                render the video here
              </span>{' '}
              and give me the download link&rdquo;
            </div>

            {/* CLI Command Executed under the hood */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: `${C.surface}cc`,
                border: `1px solid ${C.text}22`,
                borderRadius: 10,
                padding: '12px 18px',
              }}
            >
              <span style={{fontFamily: mono, color: C.green, fontWeight: 700, fontSize: 16}}>
                $
              </span>
              <span style={{fontFamily: mono, fontSize: 16, color: C.text}}>
                npx remotion render MusicVideo out/MusicVideo.mp4
              </span>
            </div>

            {/* Autonomous Self-Healing Info */}
            <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 13,
                  color: C.green,
                  background: `${C.green}20`,
                  padding: '3px 10px',
                  borderRadius: 999,
                  border: `1px solid ${C.green}44`,
                  fontWeight: 600,
                }}
              >
                Zero Local Load
              </span>
              <span style={{fontFamily: sans, fontSize: 14.5, color: `${C.text}bb`}}>
                Cloud sandbox renders all 1,050 frames with headless Chromium and fixes any errors.
              </span>
            </div>
          </div>
        </ZoomInspectCallout>
      </FramedBox>
    </AbsoluteFill>
  );
};
