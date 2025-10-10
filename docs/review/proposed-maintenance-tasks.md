# Proposed Maintenance Tasks

## Typo Fix
- **Issue:** The inline comment before initializing the search UI on the search page says "Display warning inn dev mode," which includes a misspelled "inn".
- **Task:** Correct the comment spelling to "Display warning in dev mode" in `src/pages/search.astro`.
- **Resolution:** Comment text updated to clarify the dev-mode warning in `src/pages/search.astro`.

## Bug Fix
- **Issue:** Social share links concatenate the page `URL` object onto predefined base URLs without encoding. When a permalink contains query parameters or spaces, providers such as WhatsApp, X, or email will receive an improperly formatted share URL.
- **Task:** Update `src/components/ShareLinks.astro` to serialize and `encodeURIComponent` the page URL before concatenation so that every share link receives a valid, encoded target.
- **Resolution:** Share links now append an `encodeURIComponent`-encoded string derived from `Astro.url`.

## Comment/Documentation Discrepancy
- **Issue:** The README tech stack lists FuseJS as the static search provider, but the project now uses Pagefind (see `package.json` build script and `src/pages/search.astro`).
- **Task:** Refresh the README to mention Pagefind (and link to its site) instead of FuseJS in the tech stack section.
- **Resolution:** README tech stack entry now references Pagefind with an updated link.

## Test Improvement
- **Issue:** The `postFilter` utility implements time-based filtering that relies on `SITE.scheduledPostMargin`, but there are no automated tests to guard its behavior.
- **Task:** Introduce unit tests (e.g., using Vitest) that cover draft posts, scheduled posts inside/outside the margin, and development-mode overrides for `src/utils/postFilter.ts`.
- **Resolution:** Node's built-in test runner compiles targeted fixtures and asserts the draft/scheduling/dev-mode scenarios for `postFilter`.

## UI Polish — Code Block Highlighting
- **Issue:** Every code fence rendered by Shiki displays as if each line were highlighted, producing a distracting tinted background across the entire snippet.
- **Task:** Adjust the syntax-highlighting styles so that only explicit diff/annotation markers receive emphasis, restoring a neutral background for normal code lines.
- **Resolution:** `.astro-code` highlight styles now default to transparent lines unless diff/annotation classes are present.

## UI Polish — Copy Button
- **Issue:** The "Copy" affordance sometimes fails to render after Astro's partial page loads and appears as plain text even when it does show up, making it easy to miss.
- **Task:** Update the copy-button script and styles so the button reinitializes after client-side navigations and is consistently presented as a distinct, accessible button element.
- **Resolution:** Copy buttons rehydrate after `astro:page-load` and `astro:after-swap` events and use dedicated `.code-block` styles for consistent presentation.
