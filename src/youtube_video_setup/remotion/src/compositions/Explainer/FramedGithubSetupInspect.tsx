import React from 'react';
import {AbsoluteFill, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BlurPatch, C, FramedBox, mono, sans} from './common';
import {ZoomInspectCallout} from './ZoomInspectCallout';

export const GITHUB_SETUP_FRAMES = 733; // 24.44s at 30fps

export const FramedGithubSetupInspect: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}});

  // Source video is 25.93s, target duration is 24.44s (733 frames), playbackRate = 25.93 / 24.44 = 1.061
  const videoRate = 25.93 / 24.44;

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <FramedBox progress={enter}>
        <OffthreadVideo
          src={staticFile('video assets/videos/github-setup.mov')}
          muted
          playbackRate={videoRate}
          style={{width: '100%', height: '100%', objectFit: 'contain'}}
        />

        {/* PII Blur Overlays: GitHub Profile & Handle Redactions */}
        {/* Top-Right User Avatar (round) */}
        <BlurPatch x={1760} y={52} width={42} height={42} borderRadius={21} intensity={20} />

        {/* Initial Profile View (frames 0 to 130) */}
        {frame < 130 && (
          <>
            {/* Top-Left Navbar Handle 'pjain-github' */}
            <BlurPatch x={90} y={52} width={110} height={34} borderRadius={6} intensity={20} />
            {/* Left Profile Card: Avatar, Name, Handle, Bio & Links */}
            <BlurPatch x={315} y={165} width={315} height={570} borderRadius={24} intensity={25} />
          </>
        )}

        {/* Repository Creation View (frame 130 to 688) */}
        {frame >= 130 && frame < 689 && (
          <>
            {/* Owner dropdown button showing pjain-github */}
            <BlurPatch x={550} y={280} width={155} height={44} borderRadius={8} intensity={20} />
          </>
        )}

        {/* Newly Created Repository View (frame 689+) */}
        {frame >= 689 && (
          <>
            {/* Top-Left Breadcrumb Handle 'pjain-github' */}
            <BlurPatch x={86} y={62} width={120} height={36} borderRadius={6} intensity={20} />
            {/* Quick Setup Repo URL */}
            <BlurPatch x={661} y={519} width={495} height={40} borderRadius={6} intensity={20} />
            {/* Command Line 1 Git Remote URL */}
            <BlurPatch x={498} y={742} width={537} height={30} borderRadius={6} intensity={20} />
            {/* Command Line 2 Git Remote URL */}
            <BlurPatch x={498} y={852} width={537} height={30} borderRadius={6} intensity={20} />
          </>
        )}

        {/* Top Floating Badge for general step awareness (0 to 125 frames) */}
        {frame < 125 && (
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
                STEP 1
              </div>
              <div style={{fontFamily: sans, fontWeight: 800, fontSize: 36, color: C.text}}>
                Create a new repository
              </div>
            </div>
          </div>
        )}

        {/* POINT A: REPO NAME ZOOM (frames 130 to 245 = 115 frames, ~3.8s) - 20% reduced */}
        <ZoomInspectCallout
          fromFrame={130}
          durationInFrames={115}
          targetBox={{x: 775, y: 300, width: 515, height: 38}}
          badge="POINT A · REPO NAME"
          badgeColor={C.cyan}
          accentColor={C.cyan}
          title="Repository Name"
          subtitle="github.com/new"
          centerTop={410}
          centerWidth={770}
          centerCardHeight={130}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              background: 'rgba(5, 9, 20, 0.88)',
              borderRadius: 12,
              padding: '14px 18px',
              border: `1.2px solid ${C.cyan}55`,
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
              <span style={{fontFamily: mono, fontSize: 19, color: `${C.text}88`}}>Owner /</span>
              <span
                style={{
                  fontFamily: mono,
                  fontWeight: 700,
                  fontSize: 27,
                  color: C.cyan,
                  letterSpacing: -0.5,
                }}
              >
                bytesplained-music-video
              </span>
              <span
                style={{
                  width: 2.5,
                  height: 26,
                  background: C.cyan,
                  opacity: Math.sin(frame * 0.4) > 0 ? 1 : 0,
                }}
              />
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 2}}>
              <div style={{width: 8, height: 8, borderRadius: '50%', background: C.green}} />
              <div style={{fontFamily: sans, fontSize: 15, color: C.green, fontWeight: 600}}>
                bytesplained-music-video is available
              </div>
            </div>
          </div>
        </ZoomInspectCallout>

        {/* POINT B: DESCRIPTION ZOOM (frames 255 to 370 = 115 frames, ~3.8s) - 20% reduced */}
        <ZoomInspectCallout
          fromFrame={255}
          durationInFrames={115}
          targetBox={{x: 620, y: 405, width: 670, height: 38}}
          badge="POINT B · DESCRIPTION"
          badgeColor={C.amber}
          accentColor={C.amber}
          title="Optional Description"
          subtitle="Short & memorable summary"
          centerTop={460}
          centerWidth={770}
          centerCardHeight={120}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              background: 'rgba(5, 9, 20, 0.88)',
              borderRadius: 12,
              padding: '14px 18px',
              border: `1.2px solid ${C.amber}55`,
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <span
                style={{
                  fontFamily: sans,
                  fontWeight: 600,
                  fontSize: 24,
                  color: C.text,
                }}
              >
                A repo to create AI animations
              </span>
              <span
                style={{
                  width: 2.5,
                  height: 24,
                  background: C.amber,
                  opacity: Math.sin(frame * 0.4) > 0 ? 1 : 0,
                }}
              />
            </div>
            <div style={{fontFamily: mono, fontSize: 13, color: `${C.text}66`}}>
              31 / 350 characters
            </div>
          </div>
        </ZoomInspectCallout>

        {/* POINT C: CHECKBOXES ZOOM (frames 385 to 585 = 200 frames, ~6.6s) - 20% reduced */}
        <ZoomInspectCallout
          fromFrame={385}
          durationInFrames={200}
          targetBox={{x: 1125, y: 580, width: 175, height: 175}}
          badge="POINT C · CRITICAL STEP"
          badgeColor={C.coral}
          accentColor={C.coral}
          title="Leave Repository Completely Empty"
          subtitle="Prevents git conflicts when Claude scaffolds Remotion"
          centerTop={280}
          centerWidth={830}
          centerCardHeight={190}
        >
          <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 10,
              }}
            >
              {/* README */}
              <div
                style={{
                  background: 'rgba(5, 9, 20, 0.88)',
                  border: `1.2px solid ${C.coral}66`,
                  borderRadius: 12,
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div style={{fontFamily: sans, fontWeight: 700, fontSize: 16, color: C.text}}>
                  Add README
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
                  <div
                    style={{
                      fontFamily: mono,
                      fontWeight: 700,
                      fontSize: 13,
                      color: C.coral,
                      background: `${C.coral}22`,
                      borderRadius: 6,
                      padding: '3px 8px',
                      border: `1px solid ${C.coral}44`,
                    }}
                  >
                    OFF
                  </div>
                  <span style={{fontFamily: sans, fontSize: 13, color: `${C.text}77`}}>Unchecked</span>
                </div>
              </div>

              {/* .gitignore */}
              <div
                style={{
                  background: 'rgba(5, 9, 20, 0.88)',
                  border: `1.2px solid ${C.coral}66`,
                  borderRadius: 12,
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div style={{fontFamily: sans, fontWeight: 700, fontSize: 16, color: C.text}}>
                  Add .gitignore
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
                  <div
                    style={{
                      fontFamily: mono,
                      fontWeight: 700,
                      fontSize: 13,
                      color: C.coral,
                      background: `${C.coral}22`,
                      borderRadius: 6,
                      padding: '3px 8px',
                      border: `1px solid ${C.coral}44`,
                    }}
                  >
                    NONE
                  </div>
                  <span style={{fontFamily: sans, fontSize: 13, color: `${C.text}77`}}>Unchecked</span>
                </div>
              </div>

              {/* License */}
              <div
                style={{
                  background: 'rgba(5, 9, 20, 0.88)',
                  border: `1.2px solid ${C.coral}66`,
                  borderRadius: 12,
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div style={{fontFamily: sans, fontWeight: 700, fontSize: 16, color: C.text}}>
                  Add license
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
                  <div
                    style={{
                      fontFamily: mono,
                      fontWeight: 700,
                      fontSize: 13,
                      color: C.coral,
                      background: `${C.coral}22`,
                      borderRadius: 6,
                      padding: '3px 8px',
                      border: `1px solid ${C.coral}44`,
                    }}
                  >
                    NONE
                  </div>
                  <span style={{fontFamily: sans, fontSize: 13, color: `${C.text}77`}}>Unchecked</span>
                </div>
              </div>
            </div>

            <div
              style={{
                fontFamily: sans,
                fontSize: 14,
                color: C.green,
                fontWeight: 600,
                textAlign: 'center',
                padding: '5px 12px',
                background: `${C.green}15`,
                borderRadius: 8,
                border: `1px solid ${C.green}33`,
              }}
            >
              ✓ Zero initial files — Claude Code initializes everything cleanly
            </div>
          </div>
        </ZoomInspectCallout>
      </FramedBox>
    </AbsoluteFill>
  );
};
