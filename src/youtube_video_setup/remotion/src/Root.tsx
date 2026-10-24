import React from 'react';
import {Composition} from 'remotion';
import {VIDEO, durationInFrames} from './config';
import {Showcase} from './compositions/Showcase';
import {SceneCompositions} from './scenes/SceneCompositions';
import {Subtitled} from './compositions/Subtitled';
import {MentalModel, MENTAL_MODEL_SECONDS} from './compositions/MentalModel';
import {ColdOpenOverlay, COLD_OPEN_FRAMES} from './compositions/Explainer/ColdOpenOverlay';
import {ProofViewCounters, PROOF_FRAMES} from './compositions/Explainer/ProofViewCounters';
import {ClaudeCodeWebDiagram, DIAGRAM_FRAMES} from './compositions/Explainer/ClaudeCodeWebDiagram';
import {ThreeLooks, THREE_LOOKS_FRAMES} from './compositions/Explainer/ThreeLooks';
import {OutroEndScreen, OUTRO_FRAMES} from './compositions/Explainer/OutroEndScreen';
import {FramedRecording} from './compositions/Explainer/FramedRecording';
import {FRAMED, framedFrames} from './compositions/Explainer/framedData';
import {FramedGithubSetupInspect, GITHUB_SETUP_FRAMES} from './compositions/Explainer/FramedGithubSetupInspect';
import {FramedRemotionSetupInspect, REMOTION_SETUP_FRAMES} from './compositions/Explainer/FramedRemotionSetupInspect';
import {FramedUploadAudioInspect, UPLOAD_AUDIO_FRAMES} from './compositions/Explainer/FramedUploadAudioInspect';
import {FramedGeneratingVideoInspect, GENERATING_VIDEO_FRAMES} from './compositions/Explainer/FramedGeneratingVideoInspect';
import {FramedRenderingVideoInspect, RENDERING_VIDEO_FRAMES} from './compositions/Explainer/FramedRenderingVideoInspect';
import {WordByWord, WORDBYWORD_SECONDS} from './compositions/WordByWord';
import {ARGON_ITEMS} from './compositions/Argon';
import {ArgonV2Part1, PART1_FRAMES} from './compositions/ArgonV2/Part1';
import {ArgonV2Part2, PART2_FRAMES} from './compositions/ArgonV2/Part2';
import {ArgonV2Part3, PART3_FRAMES} from './compositions/ArgonV2/Part3';
import {ArgonV2Part4, PART4_FRAMES} from './compositions/ArgonV2/Part4';
import {ArgonV2Part5, PART5_FRAMES} from './compositions/ArgonV2/Part5';
import {ArgonV2Part6, PART6_FRAMES} from './compositions/ArgonV2/Part6';
import {FramedDownloadVideoInspect, DOWNLOAD_VIDEO_FRAMES} from './compositions/Explainer/FramedDownloadVideoInspect';
import {CleanViralShort, CLEAN_SHORT_FRAMES} from './compositions/CleanViralShort';
import {ClaudeDuetMocks, CLAUDE_DUET_MOCKS_FRAMES} from './compositions/ClaudeDuetMocks';

/**
 * Register every composition here. Format comes from src/config.ts.
 * Override per composition if needed (e.g. a 1080x1920 vertical short).
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CleanViralShort"
        component={CleanViralShort}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={CLEAN_SHORT_FRAMES}
      />
      <Composition
        id="ClaudeDuetMocks"
        component={ClaudeDuetMocks}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={CLAUDE_DUET_MOCKS_FRAMES}
      />
      <Composition
        id="Showcase"
        component={Showcase}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={durationInFrames(VIDEO.durationInSeconds)}
      />
      <SceneCompositions />
      <Composition
        id="Subtitled"
        component={Subtitled}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={Math.round(697.76 * 30)}
      />
      <Composition id="WordByWord" component={WordByWord} width={1920} height={1080} fps={30} durationInFrames={WORDBYWORD_SECONDS * 30} />
      <Composition
        id="MentalModel"
        component={MentalModel}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={durationInFrames(MENTAL_MODEL_SECONDS, 30)}
      />
      <Composition id="ColdOpenOverlay" component={ColdOpenOverlay} width={1920} height={1080} fps={30} durationInFrames={COLD_OPEN_FRAMES} />
      <Composition id="ProofViewCounters" component={ProofViewCounters} width={1920} height={1080} fps={30} durationInFrames={PROOF_FRAMES} />
      <Composition id="ClaudeCodeWebDiagram" component={ClaudeCodeWebDiagram} width={1920} height={1080} fps={30} durationInFrames={DIAGRAM_FRAMES} />
      <Composition
        id="ThreeLooks"
        component={ThreeLooks}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={THREE_LOOKS_FRAMES}
        defaultProps={{clips: {}}}
      />
      <Composition
        id="OutroEndScreen"
        component={OutroEndScreen}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={OUTRO_FRAMES}
        defaultProps={{}}
      />
      {FRAMED.map((r) => (
        <Composition
          key={r.id}
          id={r.id}
          component={FramedRecording}
          width={1920}
          height={1080}
          fps={30}
          durationInFrames={framedFrames(r)}
          defaultProps={{src: r.src, rate: r.rate, callouts: r.callouts}}
        />
      ))}
      <Composition
        id="FramedGithubSetupInspect"
        component={FramedGithubSetupInspect}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={GITHUB_SETUP_FRAMES}
      />
      <Composition
        id="FramedRemotionSetupInspect"
        component={FramedRemotionSetupInspect}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={REMOTION_SETUP_FRAMES}
      />
      <Composition
        id="FramedUploadAudioInspect"
        component={FramedUploadAudioInspect}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={UPLOAD_AUDIO_FRAMES}
      />
      <Composition
        id="FramedGeneratingVideoInspect"
        component={FramedGeneratingVideoInspect}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={GENERATING_VIDEO_FRAMES}
      />
      <Composition
        id="FramedRenderingVideoInspect"
        component={FramedRenderingVideoInspect}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={RENDERING_VIDEO_FRAMES}
      />
      <Composition
        id="FramedDownloadVideoInspect"
        component={FramedDownloadVideoInspect}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={DOWNLOAD_VIDEO_FRAMES}
      />
      <Composition id="ArgonV2Part1" component={ArgonV2Part1} width={1920} height={1080} fps={30} durationInFrames={PART1_FRAMES} />
      <Composition id="ArgonV2Part2" component={ArgonV2Part2} width={1920} height={1080} fps={30} durationInFrames={PART2_FRAMES} />
      <Composition id="ArgonV2Part3" component={ArgonV2Part3} width={1920} height={1080} fps={30} durationInFrames={PART3_FRAMES} />
      <Composition id="ArgonV2Part4" component={ArgonV2Part4} width={1920} height={1080} fps={30} durationInFrames={PART4_FRAMES} />
      <Composition id="ArgonV2Part5" component={ArgonV2Part5} width={1920} height={1080} fps={30} durationInFrames={PART5_FRAMES} />
      <Composition id="ArgonV2Part6" component={ArgonV2Part6} width={1920} height={1080} fps={30} durationInFrames={PART6_FRAMES} />
      {ARGON_ITEMS.map((a) => (
        <Composition
          key={a.id}
          id={a.id}
          component={a.component}
          width={1920}
          height={1080}
          fps={30}
          durationInFrames={a.frames}
          defaultProps={a.props ?? {}}
        />
      ))}
    </>
  );
};
