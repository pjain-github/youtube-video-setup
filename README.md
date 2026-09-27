# YouTube Video Setup

A Python toolkit for generating the audio, video, and animations needed for
YouTube videos. The initial package provides ElevenLabs text-to-speech and
speech-to-speech workflows.

## Setup

This project requires Python 3.11 or newer. Create a local virtual environment
and install the development dependencies:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -e ".[dev]"
```

Copy `.env.example` to `.env` for local-only configuration. Set your ElevenLabs
API key in the environment when generating audio:

```bash
export ELEVENLABS_API_KEY="your-api-key"
```

Never commit real credentials or generated recordings.

## Generate a narrated script

Write the narration to a UTF-8 text file. Blank lines are treated as preferred
split points, and long scripts are emitted as numbered MP3 files:

```bash
generate-elevenlabs-parts script.txt YOUR_VOICE_ID --output parts
```

The default part limit is 4,000 characters. Override it, or choose a different
ElevenLabs model, when needed:

```bash
generate-elevenlabs-parts script.txt YOUR_VOICE_ID \
  --output parts --max-characters 3000 --model eleven_multilingual_v2
```

The individual helpers can also be run as modules:

```bash
python -m youtube_video_setup.elevenlabs_audio.text_to_audio \
  "Hello from ElevenLabs" YOUR_VOICE_ID output.mp3

python -m youtube_video_setup.elevenlabs_audio.audio_to_audio \
  input.wav YOUR_VOICE_ID output.mp3
```

## General CLI

```bash
youtube-video-setup
```

## Test

Tests mock the HTTP API, so they are safe to run without credentials:

```bash
python -m pytest -q
```

For hosted Codex environments, run:

```bash
bash scripts/codex-setup.sh
```
