# Maintenance Tasks

This log tracks review-identified tasks for AI agents and human contributors. Entries are grouped by status and include the
relevant source files for quick follow-up.

## Completed

| Category | Issue | Resolution | References |
| --- | --- | --- | --- |
| Typo Fix | Search page comment misspelled "inn" and misdescribed the warning. | Comment copy now reads "Display warning in dev mode." | `src/pages/search.astro` |
| Typo Fix | Back button script comment said "Search Praam" and downplayed the stored link behavior. | Clarified comment to describe synchronizing the stored back-link. | `src/components/BackButton.astro` |
| Bug Fix | `Main.astro` saved `data-backUrl` but read `dataset.backurl`, storing `"undefined"`. | Dataset access now uses the camelCase `backUrl` key. | `src/layouts/Main.astro` |
| Bug Fix | Social share URLs were concatenated without encoding, breaking links with query params or spaces. | URLs are serialized and encoded before being appended to provider templates. | `src/components/ShareLinks.astro` |
| Documentation | README referenced FuseJS even though Pagefind powers search. | README tech stack entry updated to mention Pagefind. | `README.md` |
| Test | `postFilter` lacked coverage for draft, scheduled, and dev-mode cases. | Node test runner validates draft, schedule margin, and dev overrides. | `src/utils/postFilter.ts`, `src/utils/postFilter.test.ts` |
| UI Polish | Shiki code blocks rendered every line as highlighted, creating a neon glow. | Syntax token backgrounds are forced transparent, keeping neutral code fences while preserving diff markers. | `src/styles/typography.css` |
| UI Polish | Copy affordance sometimes failed to render after lazy loads and appeared as plain text. | Copy control is a styled `<button>` reattached after Astro navigations with accessible labels. | `src/layouts/PostDetails.astro`, `src/styles/typography.css` |

## Backlog

_No open tasks are currently tracked._
