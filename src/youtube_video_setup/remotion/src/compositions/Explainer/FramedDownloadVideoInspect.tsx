import React from 'react';
import {AbsoluteFill, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BlurPatch, C, FramedBox, mono, sans} from './common';
import {ZoomInspectCallout} from './ZoomInspectCallout';

// 460 frames = 15.33s at 30fps (matches 0.90x tempo narration)
export const DOWNLOAD_VIDEO_FRAMES = 460;

export const FramedDownloadVideoInspect: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}});

  // Source video is 62.98s, target is 15.33s (460 frames), playbackRate = 62.98 / 15.33 = 4.108
  const videoRate = 62.98 / 15.33;

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <FramedBox progress={enter}>
        <OffthreadVideo
          src={staticFile('video assets/videos/download-video.mov')}
          muted
          playbackRate={videoRate}
          style={{width: '100%', height: '100%', objectFit: 'contain'}}
        />

        {/* PII Blur Overlay: Bottom-Left Claude Profile */}
        <BlurPatch x={6} y={960} width={145} height={48} borderRadius={8} intensity={20} />

        {/* Top Floating Badge for general step awareness (0 to 100 frames) */}
        {frame < 100 && (
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
                LAST STEP
              </div>
              <div style={{fontFamily: sans, fontWeight: 800, fontSize: 36, color: C.text}}>
                Download the finished MP4
              </div>
            </div>
          </div>
        )}

        {/* DOWNLOAD ARTIFACT ZOOM INSPECT (frames 230 to 450 = 220 frames, ~7.3s) */}
        <ZoomInspectCallout
          fromFrame={230}
          durationInFrames={220}
          targetBox={{x: 605, y: 220, width: 920, height: 215}}
          badge="LAST STEP · DOWNLOAD MP4"
          badgeColor={C.green}
          accentColor={C.green}
          title="Video Rendered & Ready"
          subtitle="Direct file download from Claude session"
          centerTop={450}
          centerWidth={880}
          centerCardHeight={250}
        >
          <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
            {/* File Info Box */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(5, 9, 20, 0.90)',
                border: `1.2px solid ${C.green}55`,
                borderRadius: 12,
                padding: '16px 20px',
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
                <span style={{fontSize: 26}}>🎬</span>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <span style={{fontFamily: mono, fontWeight: 700, fontSize: 18, color: C.green}}>
                    MusicVideo-small.mp4
                  </span>
                  <span style={{fontFamily: mono, fontSize: 13.5, color: `${C.text}88`}}>
                    1920×1080 · 30 FPS · 35.0s duration · H.264 + AAC
                  </span>
                </div>
              </div>
              <span
                style={{
                  fontFamily: mono,
                  fontWeight: 600,
                  fontSize: 14,
                  color: C.green,
                  background: `${C.green}22`,
                  padding: '6px 14px',
                  borderRadius: 8,
                  border: `1px solid ${C.green}55`,
                }}
              >
                21 MB
              </span>
            </div>

            {/* Workflow recap */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                background: `${C.surface}bb`,
                borderRadius: 10,
                padding: '10px 16px',
                border: `1px solid ${C.text}1a`,
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <span style={{color: C.cyan}}>1.</span>
                <span style={{fontFamily: mono, fontSize: 13.5, color: C.text}}>Empty Repo</span>
              </div>
              <span style={{color: `${C.text}44`}}>→</span>
              <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <span style={{color: C.cyan}}>2.</span>
                <span style={{fontFamily: mono, fontSize: 13.5, color: C.text}}>Three Prompts</span>
              </div>
              <span style={{color: `${C.text}44`}}>→</span>
              <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <span style={{color: C.green}}>3.</span>
                <span style={{fontFamily: mono, fontSize: 13.5, color: C.green, fontWeight: 700}}>
                  One Cloud Render
                </span>
              </div>
            </div>
          </div>
        </ZoomInspectCallout>
      </FramedBox>
    </AbsoluteFill>
  );
};

