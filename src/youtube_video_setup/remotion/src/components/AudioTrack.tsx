import React from 'react';
import {Audio, interpolate, staticFile, useVideoConfig} from 'remotion';

type Props = {
  /** Path relative to public/, e.g. "audio/narration.mp3" */
  src: string;
  volume?: number;
  fadeInSeconds?: number;
  fadeOutSeconds?: number;
  /** Seconds to trim from start of the file */
  startFromSeconds?: number;
};

/** Audio with fade in/out. Place inside a <Sequence> to offset its start. */
export const AudioTrack: React.FC<Props> = ({
  src,
  volume = 1,
  fadeInSeconds = 0.5,
  fadeOutSeconds = 1,
  startFromSeconds = 0,
}) => {
  const {fps, durationInFrames} = useVideoConfig();
  const fi = fadeInSeconds * fps;
  const fo = fadeOutSeconds * fps;
  return (
    <Audio
      src={staticFile(src)}
      startFrom={Math.round(startFromSeconds * fps)}
      volume={(f) =>
        volume *
        interpolate(f, [0, fi, durationInFrames - fo, durationInFrames], [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      }
    />
  );
};
