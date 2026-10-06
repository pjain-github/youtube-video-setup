# Remotion project instructions

Read `.agents/skills/project-remotion-workflow/SKILL.md` (repo root) and the official `remotion-best-practices` skill before creating or editing videos.

- Run commands from this folder. Remotion packages are pinned to 4.0.533; upgrade only with `npx remotion upgrade`.
- Format/duration live in `src/config.ts`. Register compositions in `src/Root.tsx`.
- Animate only via `useCurrentFrame()`; no CSS transitions, no `Math.random()`.
- New composition: `npm run new -- Name`. Verify: `npm run typecheck && npm run still`. Render: `npm run render`.
- Media lives in repo-root `audio/`, `images/`, `videos/` (git-ignored; exposed through `public/` symlinks).
