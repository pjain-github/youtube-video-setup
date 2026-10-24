import type {Callout} from './FramedRecording';

type Rec = {id: string; src: string; seconds: number; rate: number; callouts: Callout[]};

/** All times in SOURCE seconds of the original recording in /videos. */
export const FRAMED: Rec[] = [
  {
    id: 'Framed-GithubSetup',
    src: 'video assets/videos/github-setup.mov',
    seconds: 25.93,
    rate: 1,
    callouts: [
      {from: 0.3, to: 3.6, badge: 'STEP 1', title: 'New repository', sub: 'GitHub → + → New repository'},
      {from: 4.2, to: 8, title: 'Name: bytesplained-music-video'},
      {from: 8.5, to: 20.5, title: 'Leave it empty', sub: 'No README · no .gitignore · no license'},
      {from: 21.2, to: 23.4, title: 'Create repository'},
      {from: 23.8, to: 25.9, title: 'Empty repo, ready', sub: 'Next: connect it to Claude Code'},
    ],
  },
  {
    id: 'Framed-RemotionSetup',
    src: 'video assets/videos/remotion-setup.mov',
    seconds: 211.69,
    rate: 4,
    callouts: [
      {from: 1, to: 14, badge: 'STEP 2', title: 'Paste the setup prompt', sub: 'Blank TypeScript template + @remotion/media-utils'},
      {from: 16, to: 90, title: 'Claude scaffolds the project', sub: 'create-video → install → verify'},
      {from: 92, to: 190, title: 'Building & checking…'},
      {from: 193, to: 211, title: 'Setup complete', sub: 'Committed to GitHub'},
    ],
  },
  {
    id: 'Framed-UploadAudio',
    src: 'video assets/videos/upload-audio.mov',
    seconds: 74.97,
    rate: 1.5,
    callouts: [
      {from: 0.5, to: 5.5, badge: 'STEP 3', title: 'Attach your audio'},
      {from: 6, to: 12, title: 'Pick the MP3'},
      {from: 12.5, to: 37, title: 'Save it as public/track.mp3', sub: 'Then commit & push'},
      {from: 38, to: 58, title: 'Claude commits & pushes'},
      {from: 60.5, to: 67.5, title: 'Check it on GitHub'},
      {from: 68, to: 74.8, title: 'public/track.mp3 ✓'},
    ],
  },
  {
    id: 'Framed-GeneratingVideo',
    src: 'video assets/videos/generating-video.mov',
    seconds: 25.68,
    rate: 1,
    callouts: [
      {from: 0.3, to: 7, badge: 'STEP 4', title: 'The main prompt', sub: 'One prompt = a whole short film'},
      {from: 7.5, to: 16, title: 'Mascot · shots · beat cuts', sub: 'Lyrics with timings · different visualizer per shot'},
      {from: 16.5, to: 25.5, title: 'Claude starts building'},
    ],
  },
  {
    id: 'Framed-RenderingVideo',
    src: 'video assets/videos/rendering-video.mov',
    seconds: 59.36,
    rate: 4,
    callouts: [
      {from: 0.5, to: 17, badge: 'STEP 5', title: 'Ask Claude to render', sub: 'npx remotion render MusicVideo'},
      {from: 18, to: 50, title: 'Rendering in the cloud', sub: 'Nothing running on your laptop'},
      {from: 51, to: 59, title: 'Render running…'},
    ],
  },
  {
    id: 'Framed-DownloadVideo',
    src: 'video assets/videos/download-video.mov',
    seconds: 62.99,
    rate: 2,
    callouts: [
      {from: 0.5, to: 12, title: 'Render in progress', sub: 'About 64% done'},
      {from: 14, to: 40, title: 'Waiting for the file…'},
      {from: 41, to: 49, title: 'Video is ready'},
      {from: 50, to: 62.5, badge: 'LAST STEP', title: 'Download the MP4'},
    ],
  },
];

export const framedFrames = (r: Rec, fps = 30) => Math.round((r.seconds / r.rate) * fps);
