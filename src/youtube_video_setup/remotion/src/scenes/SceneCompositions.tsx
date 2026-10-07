import React from 'react';
import {Composition} from 'remotion';
import {ContainmentChamber} from './ContainmentChamber';
import {BenchmarkExploitHUD} from './BenchmarkExploitHUD';
import {GlitchTitleCard} from './GlitchTitleCard';
import {FriendlyAIAvatar} from './FriendlyAIAvatar';
import {UtilityCarousel} from './UtilityCarousel';
import {ChatbotToAgentMorph} from './ChatbotToAgentMorph';
import {AgentArchitectureGrid} from './AgentArchitectureGrid';
import {AutonomousBookingFlow} from './AutonomousBookingFlow';
import {ErrorCascadeEffect} from './ErrorCascadeEffect';
import {PaperclipMaximizer} from './PaperclipMaximizer';
import {CompetenceTargetHUD} from './CompetenceTargetHUD';
import {TestChamberHUD} from './TestChamberHUD';

const SCENES = [
  {id: 'ContainmentChamber', component: ContainmentChamber, frames: 210, fps: 30},
  {id: 'BenchmarkExploitHUD', component: BenchmarkExploitHUD, frames: 180, fps: 30},
  {id: 'GlitchTitleCard', component: GlitchTitleCard, frames: 240, fps: 60},
  {id: 'FriendlyAIAvatar', component: FriendlyAIAvatar, frames: 150, fps: 30},
  {id: 'UtilityCarousel', component: UtilityCarousel, frames: 420, fps: 30},
  {id: 'ChatbotToAgentMorph', component: ChatbotToAgentMorph, frames: 180, fps: 30},
  {id: 'AgentArchitectureGrid', component: AgentArchitectureGrid, frames: 420, fps: 30},
  {id: 'AutonomousBookingFlow', component: AutonomousBookingFlow, frames: 360, fps: 30},
  {id: 'ErrorCascadeEffect', component: ErrorCascadeEffect, frames: 210, fps: 30},
  {id: 'PaperclipMaximizer', component: PaperclipMaximizer, frames: 360, fps: 30},
  {id: 'CompetenceTargetHUD', component: CompetenceTargetHUD, frames: 180, fps: 30},
  {id: 'TestChamberHUD', component: TestChamberHUD, frames: 150, fps: 30},
] as const;

/** Blueprint animation scenes (1920x1080). Add each new scene to SCENES. */
export const SceneCompositions: React.FC = () => (
  <>
    {SCENES.map((s) => (
      <Composition
        key={s.id}
        id={s.id}
        component={s.component}
        width={1920}
        height={1080}
        fps={s.fps}
        durationInFrames={s.frames}
      />
    ))}
  </>
);
