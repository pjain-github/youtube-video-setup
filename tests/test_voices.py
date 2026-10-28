from youtube_video_setup.elevenlabs_audio.voices import VOICES, resolve_voice


def test_named_voices_resolve():
    assert resolve_voice("narrator") == "D9Thk1W7FRMgiOhy3zVI"
    assert resolve_voice("Energetic") == VOICES["energetic"]


def test_raw_id_passes_through():
    assert resolve_voice("C1npRmjB19a6yNkEucvx") == "C1npRmjB19a6yNkEucvx"
