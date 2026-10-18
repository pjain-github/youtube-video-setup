import React from 'react';
import {Composition} from 'remotion';
import {VIDEO, durationInFrames} from './config';
import {Showcase} from './compositions/Showcase';
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
import {FramedDownloadVideoInspect, DOWNLOAD_VIDEO_FRAMES} from './compositions/Explainer/FramedDownloadVideoInspect';

/**
 * Register every composition here. Format comes from src/config.ts.
 * Override per composition if needed (e.g. a 1080x1920 vertical short).
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Showcase"
        component={Showcase}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={durationInFrames(VIDEO.durationInSeconds)}
      />
      <Composition
        id="Subtitled"
        component={Subtitled}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={Math.round(697.76 * 30)}
      />
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
    </>
  );
};
