#!/usr/bin/env bash
# ==============================================================================
# High-Speed RunPod Setup Script (< 20 Seconds Cold Start)
# Works on ANY RunPod Template (PyTorch, Debian, or CPU instance)
# ==============================================================================
set -e

t_start=$(date +%s)
echo "=============================================================================="
echo "==> STARTING RUNPOD SETUP FOR YOUTUBE VIDEO PIPELINE..."
echo "=============================================================================="

# 1. Setup workspace directories
mkdir -p /workspace/youtube-video/inputs
mkdir -p /workspace/youtube-video/image_output
mkdir -p /workspace/youtube-video/audio
mkdir -p /workspace/youtube-video/videos

# 2. Check and install FFmpeg if missing
if ! command -v ffmpeg &> /dev/null; then
  echo "==> [1/2] Installing FFmpeg..."
  apt-get update -qq && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq --no-install-recommends ffmpeg rsync tmux
else
  echo "==> [1/2] FFmpeg already present ($(command -v ffmpeg)), skipping apt-get."
fi

# 3. Install Python production dependencies
echo "==> [2/2] Installing Python dependencies..."
pip install --no-cache-dir --break-system-packages -q \
  "google-genai>=2.0.0" \
  "pillow>=10.0.0" \
  "python-dotenv>=1.0.0" \
  "requests>=2.30.0"

t_total=$(( $(date +%s) - t_start ))
echo "=============================================================================="
echo "==> SETUP COMPLETED IN ${t_total} SECONDS!"
echo "=============================================================================="
echo "Next step: Run the pipeline with: bash runpod/run_pipeline.sh [audio|images|video|all]"
