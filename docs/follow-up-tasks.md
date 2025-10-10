# Proposed Follow-up Tasks

## Fix a Typo
- **Issue**: The inline script comment in `BackButton.astro` says "Update Search Praam", which misspells "Param" and does not clearly describe the behavior that updates the stored back-link reference.
- **Task**: Update the comment to correct the spelling and clarify that it synchronizes the "Go back" link with the last visited page stored in `sessionStorage`.
- **Status**: ✅ Completed — comment copy corrected alongside share/search polish updates.
- **Source**: `src/components/BackButton.astro` lines 22-36.

## Fix a Bug
- **Issue**: `Main.astro` saves `data-backUrl` to `sessionStorage`, but it reads the dataset property using `backurl` instead of `backUrl`. Dataset keys are camelCased, so this always writes the string "undefined" to storage, breaking the back button's navigation.
- **Task**: Read the dataset value via `mainContent?.dataset?.backUrl` before writing to `sessionStorage`.
- **Status**: ✅ Completed — dataset access now respects camelCase when persisting the back button target.
- **Source**: `src/layouts/Main.astro` lines 45-54.

## Resolve a Documentation Discrepancy
- **Issue**: The README lists FuseJS as the static search provider even though the build script and dependencies use Pagefind.
- **Task**: Update the README tech stack entry to refer to Pagefind so the documentation matches the implementation.
- **Status**: ✅ Completed — README now references Pagefind with an updated link.
- **Source**: `README.md` lines 85-94; `package.json` lines 5-48.

## Improve a Test
- **Issue**: The scheduled post logic in `postFilter` determines whether unpublished posts appear in listings, but it currently has no automated coverage.
- **Task**: Add a unit test (e.g., using Vitest) that verifies `postFilter` hides draft posts and respects `SITE.scheduledPostMargin` by mocking posts just before and after the allowed publication time.
- **Status**: ✅ Completed — Node-based tests compile targeted fixtures and assert the draft/scheduling scenarios for `postFilter`.
- **Source**: `src/utils/postFilter.ts` lines 1-11.
