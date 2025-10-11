# Maintenance Tasks

This log tracks review-identified tasks for AI agents and human contributors. Entries are grouped by status and include the
relevant source files for quick follow-up.

## Completed

| Category | Issue | Resolution | References |
| --- | --- | --- | --- |
| Performance | Remote OG font loader issued separate CSS requests per weight, fetched large TTF binaries, and lacked regression coverage. | Consolidated the Google Fonts request, preferenced WOFF sources, memoised CSS/binary downloads, normalised the glyph query with retry/offline fallbacks, and added remote-only tests to lock the workflow using `@fontsource` bundles when offline. | `docs/performance-plan.md`, `src/utils/loadGoogleFont.ts`, `src/utils/loadGoogleFont.test.ts` |
| Performance | Post pages carried inline helpers, comments eagerly hydrated React + Giscus, and scroll scripts re-applied unchanged state. | Externalised the post enhancements, lazy-loaded comments, and cached scroll/toggle updates to eliminate redundant DOM work while preserving UX. | `docs/performance-plan.md`, `src/components/Comments.astro`, `public/scripts/comments.js`, `public/scripts/post-enhancements.js`, `public/scripts/scroll-manager.js`, `public/scripts/back-to-top.js`, `public/scripts/reading-progress.js`, `public/toggle-theme.js` |
| Documentation | README still used AstroPaper-focused messaging and assets. | Replaced the README with site-specific guidance for Unfold while preserving credit to AstroPaper. | `README.md` |
| Process | Remote font and performance passes kept re-running builds after Google Fonts 400s and format errors surfaced late in CI. | Documented the lessons in `docs/workflow-retrospective.md` and updated `AGENTS.md` with always-run build, test, and Prettier guidance so future work avoids the regressions. | `AGENTS.md`, `docs/workflow-retrospective.md` |
| Bug Fix | Reading progress, back-to-top, and Giscus comments failed to appear after navigating from the homepage. | Layout preloads the enhancement scripts and the comments island remounts per route, so helpers initialize on first visit. | `src/layouts/Layout.astro`, `src/layouts/PostDetails.astro`, `src/components/BackToTopButton.astro`, `src/components/Comments.tsx` |
| Bug Fix | `getPath` returned a leading slash when `includeBase` was false, producing incorrect dynamic route params. | Path builder now assembles slug segments without the `/posts` base and keeps nested directories slugified. | `src/utils/getPath.ts`, `src/utils/getPath.test.ts` |
| Typo Fix | Search page comment misspelled "inn" and misdescribed the warning. | Comment copy now reads "Display warning in dev mode." | `src/pages/search.astro` |
| Typo Fix | Back button script comment said "Search Praam" and downplayed the stored link behavior. | Clarified comment to describe synchronizing the stored back-link. | `src/components/BackButton.astro` |
| Bug Fix | `Main.astro` saved `data-backUrl` but read `dataset.backurl`, storing `"undefined"`. | Dataset access now uses the camelCase `backUrl` key. | `src/layouts/Main.astro` |
| Bug Fix | Social share URLs were concatenated without encoding, breaking links with query params or spaces. | URLs are serialized and encoded before being appended to provider templates. | `src/components/ShareLinks.astro` |
| Documentation | README referenced FuseJS even though Pagefind powers search. | README tech stack entry updated to mention Pagefind. | `README.md` |
| Test | `postFilter` lacked coverage for draft, scheduled, and dev-mode cases. | Node test runner validates draft, schedule margin, and dev overrides. | `src/utils/postFilter.ts`, `src/utils/postFilter.test.ts` |
| UI Polish | Shiki code blocks still carried theme-supplied panel colors and per-token backdrops, producing a noisy glow. | Syntax tokens inherit neutral surfaces defined in `typography.css`, keeping diff markers while rendering on the custom card background. | `src/styles/typography.css` |
| UI Polish | Copy affordance sometimes failed to render after lazy loads, appeared as plain text, and sat outside the curved card edge. | Copy control is a styled `<button>` reattached after Astro navigations, with the pill anchored inside the rounded margin via logical offsets. | `src/layouts/PostDetails.astro`, `src/styles/typography.css` |
| UI Polish | Deployed fences still felt ad-hoc: copy pill overlapped long lines and the neutral surface read as flat highlighter residue. | Shared spacing variables add breathing room on the inline end, lighten diff/line emphasis, and align the pill with the first code line while keeping tokens vivid. | `src/styles/typography.css` |
| DX | Dev server defaulted to localhost, so remote preview tools could not connect. | The dev script now binds to `0.0.0.0:4321` and documentation/agent notes highlight the accessible host. | `package.json`, `AGENTS.md`, `README.md` |
| Process | CMS configuration could drift from blog path helpers after routing changes. | Agent guide now flags `.pages.yml` for review when blog structure shifts, and the CMS config references `BLOG_PATH` usage. | `AGENTS.md`, `.pages.yml` |

## Backlog

_No open tasks are currently tracked._
