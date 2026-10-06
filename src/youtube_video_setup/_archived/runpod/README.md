# RunPod Deployment & Execution Guide

This guide details how to run the entire **YouTube Documentary Production Pipeline** on RunPod without any trial-and-error or configuration guesswork.

---

## 1. RunPod Template Recommendation

| Setting | Recommended Value | Notes |
| :--- | :--- | :--- |
| **Pod Type** | **CPU Pod** (8–16 vCPUs) or **GPU Pod** (RTX 4090 / A40) | Our Kurzgesagt Animation Engine is pure 2D vector rendering; it runs super fast even on low-cost CPU instances ($0.05/hr)! |
| **Template** | **RunPod PyTorch** (or `runpod/base:latest` / `ubuntu:22.04`) | Standard template with Python 3.11+ |
| **Container Disk** | **20 GB** | Minimal footprint needed |
| **Volume Disk** | None required (or optional 20 GB) | Keeps costs at minimum |

---

## 2. One-Time Setup (< 20 Seconds)

### Step 1: Connect to your pod from your Mac
```bash
ssh root@<IP> -p <PORT> -i ~/.ssh/id_ed25519
```

### Step 2: Copy repository to the pod
Run this from your local Mac terminal:
```bash
# Sync codebase and inputs
rsync -avz -P -e "ssh -p <PORT> -i ~/.ssh/id_ed25519" \
  --exclude="videos" \
  --exclude="audio" \
  --exclude="images" \
  --exclude=".venv" \
  --exclude="__pycache__" \
  ./ root@<IP>:/workspace/youtube-video/
```

### Step 3: Run the automated cold setup
On the pod:
```bash
cd /workspace/youtube-video
bash runpod/setup_pod.sh
```
*Installs FFmpeg and Python dependencies in under 20 seconds.*

### Step 4: Configure API Keys in `.env`
On the pod, create or edit `/workspace/youtube-video/.env`:
```bash
cat << 'EOF' > /workspace/youtube-video/.env
GEMINI_API_KEY=your_gemini_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
EOF
```

---

## 3. Running the Pipeline

The pipeline is split into three clean pillars:

### Pillar 1: ElevenLabs Audio Generation
Generates narration voiceovers from the script:
```bash
bash runpod/run_pipeline.sh audio
```

### Pillar 2: Gemini 1080p Image Generation
Generates flat vector Kurzgesagt keyframes using Gemini Imagen:
```bash
# Test first 5 scenes:
bash runpod/run_pipeline.sh images 5

# Generate all 119 scenes:
bash runpod/run_pipeline.sh images 0
```

### Pillar 3: Kurzgesagt 2D Video Animation Engine
Renders Full HD 1080p distortion-free 2D animation clips with smooth camera easing and procedural vector FX:
```bash
# Render first 5 scenes:
bash runpod/run_pipeline.sh video 5

# Render all 119 scenes:
bash runpod/run_pipeline.sh video 0
```

### Final Merge: Concatenate Clips into Full Video
Stitches all scene clips together into the final documentary:
```bash
bash runpod/run_pipeline.sh merge
```

### Or Run Full End-to-End Pipeline:
```bash
bash runpod/run_pipeline.sh all 5
```

---

## 4. Download Completed Videos to Local Mac

Run this on your Mac:
```bash
# Download rendered video clips:
rsync -avz -P -e "ssh -p <PORT> -i ~/.ssh/id_ed25519" \
  root@<IP>:/workspace/youtube-video/videos/ \
  videos/

# Download final documentary:
scp -P <PORT> -i ~/.ssh/id_ed25519 \
  root@<IP>:/workspace/youtube-video/final_documentary_1080p.mp4 ./
```
