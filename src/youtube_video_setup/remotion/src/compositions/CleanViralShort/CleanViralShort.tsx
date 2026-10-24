import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Sequence} from 'remotion';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {
  CleanBackground,
  HeroIconSquircle,
  KineticSpeechText,
  DeviceMockup,
  ChecklistRow,
  StepFlowchart,
} from '../../components/clean';

const inter = loadInter('normal', {weights: ['500', '700', '800', '900']}).fontFamily;

export const CLEAN_SHORT_FRAMES = 330; // 11 seconds at 30fps

export const CleanViralShort: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        fontFamily: inter,
        color: '#222222',
        backgroundColor: '#F0F0F0',
        overflow: 'hidden',
      }}
    >
      <CleanBackground />

      {/* =========================================================================
          SCENE 1: THE CLAUDE BEATER HOOK (Frames 0 - 75 / 0s - 2.5s)
         ========================================================================= */}
      <Sequence from={0} durationInFrames={78}>
        <Scene1Hook />
      </Sequence>

      {/* =========================================================================
          SCENE 2: LAPTOP LOCAL EXECUTION (Frames 75 - 160 / 2.5s - 5.3s)
         ========================================================================= */}
      <Sequence from={75} durationInFrames={88}>
        <Scene2Laptop />
      </Sequence>

      {/* =========================================================================
          SCENE 3: NO RESTRICTIONS CHECKLIST (Frames 160 - 245 / 5.3s - 8.2s)
         ========================================================================= */}
      <Sequence from={160} durationInFrames={88}>
        <Scene3Checklist />
      </Sequence>

      {/* =========================================================================
          SCENE 4: STEP-BY-STEP AIRLLM PIPELINE (Frames 245 - 330 / 8.2s - 11s)
         ========================================================================= */}
      <Sequence from={245} durationInFrames={85}>
        <Scene4Pipeline />
      </Sequence>
    </AbsoluteFill>
  );
};

// -----------------------------------------------------------------------------
// SCENE 1: THE CLAUDE BEATER HOOK
// -----------------------------------------------------------------------------
const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Outro transition
  const outro = interpolate(frame, [68, 77], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Scale pop when "Claude" is spoken at frame 42
  const claudePop = spring({
    frame: frame - 42,
    fps,
    config: {damping: 14, stiffness: 220},
  });
  const heroScale = 1 + 0.15 * claudePop;

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: outro,
        transform: `scale(${interpolate(outro, [0, 1], [0.96, 1])})`,
        padding: '0 60px',
      }}
    >
      {/* Upper Stage: Claude Terracotta Icon Squircle */}
      <div
        style={{
          transform: `scale(${heroScale})`,
          marginBottom: 80,
        }}
      >
        <HeroIconSquircle size={320} backgroundColor="#D97757" delay={2} icon="claude" />
      </div>

      {/* Lower Stage: Word-by-word kinetic speech */}
      <KineticSpeechText
        startFrame={4}
        wordInterval={6} // 6 frames = 200ms per word cadence
        fontSize={62}
        words={[
          'The',
          'open',
          'source',
          'model',
          'that',
          'just',
          'beat',
          {text: 'Claude', color: '#D97757', highlight: true},
        ]}
      />
    </AbsoluteFill>
  );
};

// -----------------------------------------------------------------------------
// SCENE 2: LAPTOP LOCAL EXECUTION
// -----------------------------------------------------------------------------
const Scene2Laptop: React.FC = () => {
  const frame = useCurrentFrame();

  const outro = interpolate(frame, [78, 87], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: outro,
        transform: `scale(${interpolate(outro, [0, 1], [0.96, 1])})`,
        padding: '0 60px',
      }}
    >
      {/* Upper Stage: Device Mockup (Laptop) */}
      <div style={{marginBottom: 70}}>
        <DeviceMockup
          width={640}
          delay={2}
          screenTitle="zsh — ollama run qwen2.5-coder:7b"
          commandText="ollama run qwen2.5-coder:7b"
          badgeText="⚡ 114 Tokens/sec · 4GB RAM"
        />
      </div>

      {/* Lower Stage: Word-by-word kinetic speech */}
      <KineticSpeechText
        startFrame={4}
        wordInterval={5}
        fontSize={56}
        words={[
          'you',
          'can',
          'now',
          'run',
          'it',
          'locally',
          'on',
          'any',
          'cheap',
          'laptop',
          'for',
          {text: 'free', color: '#16A34A', highlight: true},
          'forever',
        ]}
      />
    </AbsoluteFill>
  );
};

// -----------------------------------------------------------------------------
// SCENE 3: NO RESTRICTIONS CHECKLIST
// -----------------------------------------------------------------------------
const Scene3Checklist: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const outro = interpolate(frame, [78, 87], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const headerSpring = spring({frame: frame - 2, fps, config: {damping: 16, stiffness: 200}});

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: outro,
        padding: '0 70px',
      }}
    >
      {/* Upper Category Label */}
      <div
        style={{
          transform: `scale(${headerSpring})`,
          opacity: headerSpring,
          fontSize: 22,
          fontWeight: 700,
          color: '#737373',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '8px 20px',
          borderRadius: 999,
          background: '#E5E5E5',
          marginBottom: 60,
        }}
      >
        ZERO CLOUD DEPENDENCIES
      </div>

      {/* Lower Stage: 3 Stacked Checklist Rows */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 40,
          width: '100%',
          maxWidth: 780,
        }}
      >
        <ChecklistRow text="No subscriptions." delay={6} fontSize={48} type="prohibition" />
        <ChecklistRow text="No usage restrictions." delay={20} fontSize={48} type="prohibition" />
        <ChecklistRow text="No internet required." delay={34} fontSize={48} type="prohibition" />
      </div>
    </AbsoluteFill>
  );
};

// -----------------------------------------------------------------------------
// SCENE 4: STEP-BY-STEP AIRLLM PIPELINE
// -----------------------------------------------------------------------------
const Scene4Pipeline: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const headerSpring = spring({frame: frame - 2, fps, config: {damping: 16, stiffness: 200}});

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 70px',
      }}
    >
      {/* Upper Stage: AirLLM Architecture Badge */}
      <div
        style={{
          transform: `scale(${headerSpring})`,
          opacity: headerSpring,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          marginBottom: 50,
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#0284C7',
          }}
        >
          HOW IT WORKS
        </div>
        <div
          style={{
            fontSize: 54,
            fontWeight: 900,
            color: '#222222',
            letterSpacing: '-0.03em',
          }}
        >
          LAYERED INFERENCE
        </div>
      </div>

      {/* Lower Stage: Flowchart Steps */}
      <StepFlowchart
        startFrame={8}
        interval={16}
        fontSize={42}
        steps={[
          {text: 'Loads single layer to RAM', tag: '3.8 GB'},
          {text: 'Runs layer inference', tag: 'Fast'},
          {text: 'Unloads & pulls next layer', tag: 'Loop'},
        ]}
      />
    </AbsoluteFill>
  );
};
