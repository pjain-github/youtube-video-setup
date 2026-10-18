import React from 'react';
import {AbsoluteFill, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BlurPatch, C, FramedBox, mono, sans} from './common';
import {ZoomInspectCallout} from './ZoomInspectCallout';

// 972 frames = 32.39s at 30fps (matches 0.90x tempo narration)
export const UPLOAD_AUDIO_FRAMES = 972;

export const FramedUploadAudioInspect: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}});

  // Source video is 74.97s, target is 32.39s (972 frames), playbackRate = 74.97 / 32.39 = 2.315
  const videoRate = 74.97 / 32.39;

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <FramedBox progress={enter}>
        <OffthreadVideo
          src={staticFile('video assets/videos/upload-audio.mov')}
          muted
          playbackRate={videoRate}
          style={{width: '100%', height: '100%', objectFit: 'contain'}}
        />

        {/* PII Blur Overlays */}
        {/* Bottom-Left Claude Profile (during Claude Code view) */}
        {frame < 850 && (
          <BlurPatch x={6} y={960} width={145} height={48} borderRadius={8} intensity={20} />
        )}

        {/* Finder modal Locations sidebar (frames 0 to 140) */}
        {frame < 140 && (
          <BlurPatch x={360} y={490} width={200} height={165} borderRadius={10} intensity={20} />
        )}

        {/* GitHub view (frames 850 to 972) */}
        {frame >= 850 && (
          <>
            {/* Top-Left Navbar Handle 'pjain-github' */}
            <BlurPatch x={110} y={34} width={115} height={32} borderRadius={6} intensity={20} />
            {/* Top-Right User Avatar */}
            <BlurPatch x={1752} y={35} width={44} height={44} borderRadius={22} intensity={20} />
            {/* Bottom-Left Browser URL Tooltip */}
            <BlurPatch x={0} y={965} width={630} height={46} borderRadius={4} intensity={20} />
          </>
        )}

        {/* Top Floating Badge for general step awareness (0 to 140 frames) */}
        {frame < 140 && (
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
                STEP 3
              </div>
              <div style={{fontFamily: sans, fontWeight: 800, fontSize: 36, color: C.text}}>
                Add the audio to the project
              </div>
            </div>
          </div>
        )}

        {/* CALLOUT 1: CHAT PLACEHOLDER / ATTACH AUDIO PROMPT (frames 430 to 730 = 300 frames, ~10s) */}
        {/* Matches full video ~3:00 to 3:10! */}
        <ZoomInspectCallout
          fromFrame={430}
          durationInFrames={300}
          targetBox={{x: 605, y: 735, width: 955, height: 215}}
          badge="STEP 3 · ATTACH & RENAME"
          badgeColor={C.cyan}
          accentColor={C.cyan}
          title="Upload Audio into Public Folder"
          subtitle="claude.ai/code chat prompt"
          centerTop={220}
          centerWidth={900}
          centerCardHeight={285}
        >
          <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
            {/* Attached file pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                background: `${C.cyan}18`,
                border: `1.2px solid ${C.cyan}77`,
                borderRadius: 10,
                padding: '10px 18px',
                alignSelf: 'flex-start',
              }}
            >
              <span style={{fontSize: 22}}>🎵</span>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <span style={{fontFamily: mono, fontWeight: 700, fontSize: 18, color: C.cyan}}>
                  Intro - 0.mp3
                </span>
                <span style={{fontFamily: mono, fontSize: 13, color: `${C.text}77`}}>
                  Audio File Attachment · MP3
                </span>
              </div>
            </div>

            {/* Prompt instruction box */}
            <div
              style={{
                background: 'rgba(5, 9, 20, 0.90)',
                border: `1.2px solid ${C.cyan}55`,
                borderRadius: 12,
                padding: '16px 20px',
                fontFamily: mono,
                fontSize: 17,
                lineHeight: 1.55,
                color: C.text,
              }}
            >
              Upload this audio file into github{' '}
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
                public folder
              </span>{' '}
              and rename it{' '}
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
                track.mp3
              </span>
            </div>

            {/* Clarification note */}
            <div
              style={{
                fontFamily: sans,
                fontSize: 15,
                color: `${C.text}99`,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{color: C.green}}>✓</span> Remotion serves assets from{' '}
              <code
                style={{
                  fontFamily: mono,
                  color: C.cyan,
                  background: `${C.cyan}15`,
                  padding: '2px 6px',
                  borderRadius: 4,
                }}
              >
                public/
              </code>{' '}
              via <code style={{fontFamily: mono, color: C.green}}>staticFile(&apos;track.mp3&apos;)</code>
            </div>
          </div>
        </ZoomInspectCallout>

        {/* CALLOUT 2A: GITHUB PAGE 1 - REPO ROOT (frames 855 to 885 = 30 frames, ~1s, at ~3:23) */}
        {/* Highlights 'public' folder row on repository root page */}
        <ZoomInspectCallout
          fromFrame={855}
          durationInFrames={30}
          targetBox={{x: 180, y: 266, width: 1100, height: 40}}
          badge="VERIFIED ON GITHUB"
          badgeColor={C.green}
          accentColor={C.green}
          title="public/ Folder in Repo"
          subtitle="github.com/bytesplained-music-video"
          centerTop={470}
          centerWidth={820}
          centerCardHeight={170}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              background: 'rgba(5, 9, 20, 0.88)',
              borderRadius: 12,
              padding: '16px 20px',
              border: `1.2px solid ${C.green}55`,
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                <span style={{fontSize: 20}}>📁</span>
                <span style={{fontFamily: mono, fontWeight: 700, fontSize: 19, color: C.green}}>
                  public /
                </span>
              </div>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 13,
                  color: C.green,
                  background: `${C.green}20`,
                  padding: '3px 10px',
                  borderRadius: 999,
                  border: `1px solid ${C.green}44`,
                }}
              >
                Committed by Claude
              </span>
            </div>
            <div style={{fontFamily: sans, fontSize: 14.5, color: `${C.text}aa`, display: 'flex', gap: 8}}>
              <span>Commit:</span>
              <span style={{fontFamily: mono, color: C.text}}>
                claude Add track.mp3 to public folder
              </span>
            </div>
          </div>
        </ZoomInspectCallout>

        {/* CALLOUT 2B: GITHUB PAGE 2 - INSIDE PUBLIC FOLDER (frames 886 to 965 = 79 frames, ~2.6s, at 3:24 to 3:26) */}
        {/* Accurately highlights 'track.mp3' row on the new page! */}
        <ZoomInspectCallout
          fromFrame={886}
          durationInFrames={79}
          targetBox={{x: 440, y: 410, width: 1330, height: 42}}
          badge="TRACK.MP3 VERIFIED"
          badgeColor={C.green}
          accentColor={C.green}
          title="track.mp3 in public/"
          subtitle="bytesplained-music-video / public / track.mp3"
          centerTop={500}
          centerWidth={840}
          centerCardHeight={170}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              background: 'rgba(5, 9, 20, 0.90)',
              borderRadius: 12,
              padding: '16px 20px',
              border: `1.2px solid ${C.green}55`,
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                <span style={{fontSize: 20}}>🎵</span>
                <span style={{fontFamily: mono, fontSize: 17, color: `${C.text}88`}}>public /</span>
                <span style={{fontFamily: mono, fontWeight: 700, fontSize: 19, color: C.green}}>
                  track.mp3
                </span>
              </div>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 13,
                  color: C.green,
                  background: `${C.green}20`,
                  padding: '3px 10px',
                  borderRadius: 999,
                  border: `1px solid ${C.green}44`,
                }}
              >
                ✓ Asset Ready
              </span>
            </div>
            <div style={{fontFamily: sans, fontSize: 14.5, color: `${C.text}aa`, display: 'flex', gap: 8}}>
              <span>Commit message:</span>
              <span style={{fontFamily: mono, color: C.text}}>
                Add track.mp3 to public folder (now)
              </span>
            </div>
          </div>
        </ZoomInspectCallout>
      </FramedBox>
    </AbsoluteFill>
  );
};
