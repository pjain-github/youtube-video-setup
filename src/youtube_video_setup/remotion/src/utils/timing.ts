/** Convert seconds to frames. Always pass fps from useVideoConfig(). */
export const sec = (seconds: number, fps: number) => Math.round(seconds * fps);

/** Per-item stagger delay in frames. */
export const stagger = (index: number, everyFrames = 4) => index * everyFrames;
