#!/usr/bin/env bash
# ==============================================================================
# Master Pipeline Runner on RunPod
# Usage:
#   bash runpod/run_pipeline.sh [audio | images | video | merge | all]
# ==============================================================================
set -e

STEP="${1:-all}"
LIMIT="${2:-0}"

export PYTHONPATH="/workspace/youtube-video/src:${PYTHONPATH:-}"

echo "=============================================================================="
echo "==> RUNNING YOUTUBE PRODUCTION PIPELINE [STEP: ${STEP^^}]"
echo "=============================================================================="

case "$STEP" in
  audio)
    echo "==> Generating ElevenLabs audio..."
    python3 -m youtube_video_setup.cli audio \
      --script /workspace/youtube-video/inputs/AI_Models_Going_Rogue_YouTube_Script.md \
      --output-dir /workspace/youtube-video/audio
    ;;

  images)
    echo "==> Generating Gemini 1080p keyframe images (limit: ${LIMIT:-all})..."
    python3 -m youtube_video_setup.cli images \
      --scenes /workspace/youtube-video/inputs/scenes.json \
      --output-dir /workspace/youtube-video/image_output \
      --limit "${LIMIT:-0}"
    ;;

  video)
    echo "==> Rendering Kurzgesagt 2D animated 1080p clips (limit: ${LIMIT:-all})..."
    python3 -m youtube_video_setup.cli video \
      --scenes /workspace/youtube-video/inputs/scenes.json \
      --output-dir /workspace/youtube-video/videos \
      --limit "${LIMIT:-0}" \
      --fps 30
    ;;

  merge)
    echo "==> Merging clips into final video..."
    python3 -m youtube_video_setup.cli merge \
      --videos-dir /workspace/youtube-video/videos \
      --output /workspace/youtube-video/final_documentary_1080p.mp4
    ;;

  all)
    echo "==> Running full end-to-end pipeline..."
    python3 -m youtube_video_setup.cli images \
      --scenes /workspace/youtube-video/inputs/scenes.json \
      --output-dir /workspace/youtube-video/image_output \
      --limit "${LIMIT:-0}"

    python3 -m youtube_video_setup.cli video \
      --scenes /workspace/youtube-video/inputs/scenes.json \
      --output-dir /workspace/youtube-video/videos \
      --limit "${LIMIT:-0}" \
      --fps 30

    python3 -m youtube_video_setup.cli merge \
      --videos-dir /workspace/youtube-video/videos \
      --output /workspace/youtube-video/final_documentary_1080p.mp4
    ;;

  *)
    echo "Unknown step: $STEP"
    echo "Available steps: audio | images | video | merge | all"
    exit 1
    ;;
esac

echo "=============================================================================="
echo "==> PIPELINE STEP '${STEP^^}' COMPLETED SUCCESSFULLY!"
echo "=============================================================================="
