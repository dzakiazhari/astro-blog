# Workflow Retrospective — Remote Font & Performance Pass

## Context
Performance work between February and March 2024 focused on remote font delivery, script scheduling, and OG rendering resilience. Multiple agents iterated on caching, request deduplication, and fallback behaviour while balancing formatting and CI stability requirements.

## Observations
- `pnpm run build` surfaced repeated Google Fonts HTTP 400 responses whenever the subset endpoint rejected long `text` queries. Manual retries alone did not help and cost ~2 minutes per run while builds failed during the `/og.png` route generation.
- Formatting checks (`pnpm run format:check`) failed after script rewrites because Prettier had not been run locally, forcing re-runs of the CI pipeline and delaying verification of the performance gains.
- Local fallbacks (`@fontsource` WOFF assets) already existed but were not exercised until error types were tightened and tests asserted the failure paths.

## Actions Taken
1. Added a dedicated `GoogleFontsResponseError` and broadened the loader test suite to cover repeated 400 responses, WOFF2 selection, and offline fallbacks so that builds succeed without remote access.
2. Documented the expectation to run Prettier immediately after editing scripts or Astro components, keeping `format:check` green.
3. Captured these lessons in `AGENTS.md` so that future performance passes start with the stronger workflow defaults instead of rediscovering the issues mid-review.

## Always Do (重要ポイント)
- Run `pnpm run build` after changing any remote font or OG generation code to confirm the live network path and fallback behaviour stay healthy.
- Exercise error branches through automated tests before relying on manual builds; simulate 4xx/5xx responses and network disconnects in the unit suite.
- Execute `pnpm exec prettier --write <globs>` (or `pnpm run format`) before committing to prevent `format:check` failures.
- Log process-level learnings in this document and mirror high-level notes in `docs/tasks.md` so the caution points remain visible to the next agent.

## References
- `src/utils/loadGoogleFont.ts`
- `src/utils/loadGoogleFont.test.ts`
- `AGENTS.md`
