"""Assemble the final YouTube documentary video with synchronized narration and music showcase."""

from __future__ import annotations

import argparse
import shutil
import subprocess
from pathlib import Path

AUDIO_DIR_DEFAULT = Path("video assets/audio/bytesplained_narration_v3")
VIDEOS_DIR_DEFAULT = Path("videos")
FINAL_OUTPUT_DEFAULT = Path("video assets/videos/final_video.mp4")
AUDIO_TEMPO = 0.90  # 10% slower narration for relaxed, clear delivery


def get_duration(file_path: Path) -> float:
    cmd = [
        "ffprobe",
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "default=noprint_wrappers=1:nokey=1",
        str(file_path),
    ]
    result = subprocess.check_output(cmd).decode().strip()
    return float(result)


def build_segment(
    video_path: Path,
    audio_path: Path | None,
    output_path: Path,
    *,
    target_duration: float | None = None,
    speed_video: bool = True,
    apply_audio_tempo: bool = True,
) -> float:
    """Build a synced segment with exact 1920x1080 @ 30fps H.264 and 48kHz AAC."""
    v_src_dur = get_duration(video_path)

    if audio_path:
        raw_a_dur = get_duration(audio_path)
        a_dur = raw_a_dur / AUDIO_TEMPO if apply_audio_tempo else raw_a_dur
        final_dur = target_duration or a_dur
    else:
        final_dur = target_duration or v_src_dur

    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Calculate video filter
    if speed_video and v_src_dur != final_dur:
        pts_factor = final_dur / v_src_dur
        v_filter = f"[0:v]setpts={pts_factor:.6f}*PTS,fps=30,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1"
    else:
        if v_src_dur < final_dur:
            pad_sec = final_dur - v_src_dur
            v_filter = (
                f"[0:v]fps=30,scale=1920:1080:force_original_aspect_ratio=decrease,"
                f"pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,tpad=stop_mode=clone:stop_duration={pad_sec:.3f}"
            )
        else:
            v_filter = f"[0:v]trim=0:{final_dur:.3f},setpts=PTS-STARTPTS,fps=30,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1"

    if audio_path:
        if apply_audio_tempo and AUDIO_TEMPO != 1.0:
            a_filter = f"[1:a]atempo={AUDIO_TEMPO},apad,atrim=0:{final_dur:.3f},aformat=sample_rates=48000:channel_layouts=stereo[aout]"
        else:
            a_filter = f"[1:a]apad,atrim=0:{final_dur:.3f},aformat=sample_rates=48000:channel_layouts=stereo[aout]"
        filter_complex = f"{v_filter}[vout];{a_filter}"
        inputs = ["-i", str(video_path), "-i", str(audio_path)]
    else:
        # Pass through original video audio (e.g. MusicVideo-small.mp4)
        filter_complex = (
            f"{v_filter}[vout];"
            f"[0:a]atrim=0:{final_dur:.3f},aformat=sample_rates=48000:channel_layouts=stereo[aout]"
        )
        inputs = ["-i", str(video_path)]

    cmd = [
        "ffmpeg",
        "-y",
        *inputs,
        "-filter_complex",
        filter_complex,
        "-map",
        "[vout]",
        "-map",
        "[aout]",
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "18",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-t",
        f"{final_dur:.3f}",
        str(output_path),
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return final_dur


def concat_segments(segment_files: list[Path], final_output: Path) -> None:
    concat_list = final_output.parent / "concat_segments.txt"
    with concat_list.open("w", encoding="utf-8") as f:
        for seg in segment_files:
            f.write(f"file '{seg.resolve()}'\n")

    cmd = [
        "ffmpeg",
        "-y",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        str(concat_list),
        "-c",
        "copy",
        str(final_output),
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    concat_list.unlink(missing_ok=True)


def main() -> None:
    parser = argparse.ArgumentParser(description="Assemble documentary video.")
    parser.add_argument("--videos-dir", type=Path, default=VIDEOS_DIR_DEFAULT)
    parser.add_argument("--audio-dir", type=Path, default=AUDIO_DIR_DEFAULT)
    parser.add_argument("--output", type=Path, default=FINAL_OUTPUT_DEFAULT)
    parser.add_argument("--keep-segments", action="store_true")
    args = parser.parse_args()

    temp_dir = args.output.parent / "_synced_segments"
    temp_dir.mkdir(parents=True, exist_ok=True)

    synced_files: list[Path] = []
    print("=== Assembling Final Documentary Video ===")
    print(f"Videos dir:  {args.videos_dir}")
    print(f"Audio dir:   {args.audio_dir}")
    print(f"Audio tempo: {AUDIO_TEMPO}x (10% slower narration)")
    print(f"Output:      {args.output}\n")

    # 1. Segment 01A: Hook - First 15s of generated music video with original track (no voiceover)
    print("[1/12] Sec 01A (Hook): First 15s of MusicVideo-small.mp4 with original music...")
    seg_01a = temp_dir / "seg_01a_hook.mp4"
    dur = build_segment(
        args.videos_dir / "MusicVideo-small.mp4",
        None,
        seg_01a,
        target_duration=15.000,
        speed_video=False,
    )
    synced_files.append(seg_01a)
    print(f"  -> Duration: {dur:.2f}s")

    # 2. Segment 01B: Cold Open Excited Hook Animation (HookReveal.mp4)
    print("[2/12] Sec 01B (Cold Open Animation): HookReveal.mp4 + part_01_hook_excited.mp3...")
    seg_01b = temp_dir / "seg_01b_hook_reveal.mp4"
    dur = build_segment(
        args.videos_dir / "HookReveal.mp4",
        args.audio_dir / "part_01_hook_excited.mp3",
        seg_01b,
        speed_video=True,
        apply_audio_tempo=False,  # Already paced for ~19s animation
    )
    synced_files.append(seg_01b)
    print(f"  -> Duration: {dur:.2f}s")

    # 3. Segment 02: Proof (ProofViewCounters.mp4)
    print("[3/12] Sec 02 (Proof): ProofViewCounters.mp4 + part_02_proof.mp3...")
    seg_02 = temp_dir / "seg_02_proof.mp4"
    dur = build_segment(
        args.videos_dir / "ProofViewCounters.mp4",
        args.audio_dir / "part_02_proof.mp3",
        seg_02,
        speed_video=True,
        apply_audio_tempo=True,
    )
    synced_files.append(seg_02)
    print(f"  -> Duration: {dur:.2f}s")

    # 4. Segment 03: What Claude Code on the web is (ClaudeCodeWebDiagram.mp4)
    print("[4/12] Sec 03 (What Claude Code is): ClaudeCodeWebDiagram.mp4 + part_03_what_claude_code_is.mp3...")
    seg_03 = temp_dir / "seg_03_diagram.mp4"
    dur = build_segment(
        args.videos_dir / "ClaudeCodeWebDiagram.mp4",
        args.audio_dir / "part_03_what_claude_code_is.mp3",
        seg_03,
        speed_video=True,
        apply_audio_tempo=True,
    )
    synced_files.append(seg_03)
    print(f"  -> Duration: {dur:.2f}s")

    # 5. Segment 04: Create the repo and connect it (Framed-GithubSetup.mp4)
    print("[5/12] Sec 04 (Create Repo): Framed-GithubSetup.mp4 + part_04_create_repo.mp3...")
    seg_04 = temp_dir / "seg_04_github_setup.mp4"
    dur = build_segment(
        args.videos_dir / "Framed-GithubSetup.mp4",
        args.audio_dir / "part_04_create_repo.mp3",
        seg_04,
        speed_video=True,
        apply_audio_tempo=True,
    )
    synced_files.append(seg_04)
    print(f"  -> Duration: {dur:.2f}s")

    # 6. Segment 05: The setup prompt (Framed-RemotionSetupPaced.mp4 - normal pace paste, then 4x fast-forward)
    print("[6/12] Sec 05 (Setup Prompt): Framed-RemotionSetupPaced.mp4 + part_05_setup_prompt.mp3...")
    seg_05 = temp_dir / "seg_05_setup_prompt.mp4"
    dur = build_segment(
        args.videos_dir / "Framed-RemotionSetupPaced.mp4",
        args.audio_dir / "part_05_setup_prompt.mp3",
        seg_05,
        speed_video=True,
        apply_audio_tempo=True,
    )
    synced_files.append(seg_05)
    print(f"  -> Duration: {dur:.2f}s")

    # 7. Segment 06: How Remotion makes video (MentalModel.mp4)
    print("[7/12] Sec 06 (Mental Model): MentalModel.mp4 + part_06_mental_model.mp3...")
    seg_06 = temp_dir / "seg_06_mental_model.mp4"
    dur = build_segment(
        args.videos_dir / "MentalModel.mp4",
        args.audio_dir / "part_06_mental_model.mp3",
        seg_06,
        speed_video=True,
        apply_audio_tempo=True,
    )
    synced_files.append(seg_06)
    print(f"  -> Duration: {dur:.2f}s")

    # 8. Segment 07: Add the music (Framed-UploadAudio.mp4)
    print("[8/12] Sec 07 (Add Music): Framed-UploadAudio.mp4 + part_07_add_music.mp3...")
    seg_07 = temp_dir / "seg_07_upload_audio.mp4"
    dur = build_segment(
        args.videos_dir / "Framed-UploadAudio.mp4",
        args.audio_dir / "part_07_add_music.mp3",
        seg_07,
        speed_video=True,
        apply_audio_tempo=True,
    )
    synced_files.append(seg_07)
    print(f"  -> Duration: {dur:.2f}s")

    # 9. Segment 08: The generation prompt (Framed-GeneratingVideo.mp4)
    print("[9/12] Sec 08 (Generation Prompt): Framed-GeneratingVideo.mp4 + part_08_generation_prompt.mp3...")
    seg_08 = temp_dir / "seg_08_generating_video.mp4"
    dur = build_segment(
        args.videos_dir / "Framed-GeneratingVideo.mp4",
        args.audio_dir / "part_08_generation_prompt.mp3",
        seg_08,
        speed_video=True,
        apply_audio_tempo=True,
    )
    synced_files.append(seg_08)
    print(f"  -> Duration: {dur:.2f}s")

    # 10. Segment 09: The render (Framed-RenderingVideo.mp4)
    print("[10/12] Sec 09 (Render): Framed-RenderingVideo.mp4 + part_09_render.mp3...")
    seg_09 = temp_dir / "seg_09_rendering_video.mp4"
    dur = build_segment(
        args.videos_dir / "Framed-RenderingVideo.mp4",
        args.audio_dir / "part_09_render.mp3",
        seg_09,
        speed_video=True,
        apply_audio_tempo=True,
    )
    synced_files.append(seg_09)
    print(f"  -> Duration: {dur:.2f}s")

    # 11. Segment 10: Download and playback (Framed-DownloadVideo.mp4)
    print("[11/12] Sec 10 (Download): Framed-DownloadVideo.mp4 + part_10_download.mp3...")
    seg_10 = temp_dir / "seg_10_download.mp4"
    dur = build_segment(
        args.videos_dir / "Framed-DownloadVideo.mp4",
        args.audio_dir / "part_10_download.mp3",
        seg_10,
        speed_video=True,
        apply_audio_tempo=True,
    )
    synced_files.append(seg_10)
    print(f"  -> Duration: {dur:.2f}s")

    # 12. Segment 10B: THE ENTIRE FINISHED MUSIC VIDEO (Full 35s with original music)
    print("[12/13] Sec 10B (Full Showcase): Complete 35s MusicVideo-small.mp4 with original track...")
    seg_10b = temp_dir / "seg_10b_full_music_video.mp4"
    dur = build_segment(
        args.videos_dir / "MusicVideo-small.mp4",
        None,
        seg_10b,
        target_duration=35.000,
        speed_video=False,
    )
    synced_files.append(seg_10b)
    print(f"  -> Duration: {dur:.2f}s")

    # 13. Segment 12: Outro (OutroEndScreen.mp4) - Part 11 completely removed!
    print("[13/13] Sec 12 (Outro): OutroEndScreen.mp4 + part_12_outro.mp3...")
    seg_12 = temp_dir / "seg_12_outro.mp4"
    dur = build_segment(
        args.videos_dir / "OutroEndScreen.mp4",
        args.audio_dir / "part_12_outro.mp3",
        seg_12,
        speed_video=True,
        apply_audio_tempo=True,
    )
    synced_files.append(seg_12)
    print(f"  -> Duration: {dur:.2f}s")

    # Final Concatenation
    print(f"\nConcatenating {len(synced_files)} segments into {args.output}...")
    concat_segments(synced_files, args.output)

    if not args.keep_segments:
        shutil.rmtree(temp_dir, ignore_errors=True)

    final_dur = get_duration(args.output)
    print(f"\nSuccessfully created final video at: {args.output}")
    print(f"Total duration: {final_dur:.2f}s (~{int(final_dur // 60)}m {int(final_dur % 60)}s)")


if __name__ == "__main__":
    main()
