import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {CleanBackground, PhoneNotification, SessionLog, DUET_LOG} from '../../components/clean';

const inter = loadInter('normal', {weights: ['500', '700', '800']}).fontFamily;

export const CLAUDE_DUET_MOCKS_FRAMES = 300;

/** Preview of the generated stand-ins for the phone notification and the agent log. */
export const ClaudeDuetMocks: React.FC = () => (
  <AbsoluteFill style={{fontFamily: inter, backgroundColor: '#F0F0F0', overflow: 'hidden'}}>
    <CleanBackground />
    <Sequence from={0} durationInFrames={150}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <PhoneNotification delay={6} />
      </AbsoluteFill>
    </Sequence>
    <Sequence from={150} durationInFrames={150}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: 70}}>
        <SessionLog lines={DUET_LOG} linesPerSecond={3} />
      </AbsoluteFill>
    </Sequence>
  </AbsoluteFill>
);
