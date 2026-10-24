"""Mix video assets/audio/background_music.wav under the narration of the subtitled video (video stream is copied, no re-render)."""
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VIDEO = ROOT / "video assets/videos/AI_Models_Going_Rogue_Subtitled.mp4"
MUSIC = ROOT / "video assets/audio/background_music.wav"
OUT = ROOT / "video assets/videos/AI_Models_Going_Rogue_Subtitled_Music.mp4"
MUSIC_GAIN_DB = -22  # music is generated at about -16 LUFS; narration is about -24 LUFS. Adjust to taste (+3 louder, -3 quieter)

graph = (
    f"[1:a]volume={MUSIC_GAIN_DB}dB[m];"
    "[m][0:a]sidechaincompress=threshold=0.06:ratio=3:attack=30:release=600:makeup=1[duck];"
    "[0:a][duck]amix=inputs=2:normalize=0:duration=first[a]"
)
subprocess.run(
    ["ffmpeg", "-y", "-i", str(VIDEO), "-i", str(MUSIC), "-filter_complex", graph,
     "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", str(OUT)],
    check=True,
)
print("wrote", OUT)
