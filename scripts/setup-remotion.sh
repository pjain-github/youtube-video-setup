#!/usr/bin/env bash
# Installs Node (inside the active .venv via nodeenv, unless node is already provided
# e.g. by conda) and the pinned Remotion dependencies.
set -euo pipefail
cd "$(dirname "$0")/.."
if [[ -n "${VIRTUAL_ENV:-}" && ! -x "$VIRTUAL_ENV/bin/node" && -z "${CONDA_PREFIX:-}" ]]; then
  python -m pip install -q nodeenv
  nodeenv -p --node=22.12.0
  hash -r
fi
cd src/youtube_video_setup/remotion
npm ci
echo "Remotion ready: $(npx remotion versions 2>/dev/null | head -3 | tr '\n' ' ')"
