# Performance Iteration Plan

## Baseline Metrics

- OG renderer remote font cost (before this pass): 4 network calls per render (2 CSS requests + 2 `ttf` binaries totalling ~412 KB).
- Build time variability: ±1.4 s depending on Google Fonts latency because every invocation re-downloaded the same subset.
- Scroll helper bundle sizes: unchanged from prior audit (`reading-progress.js` 2,453 B, `back-to-top.js` 2,758 B, `toggle-theme.js` 2,561 B) and monitored to ensure font work keeps other UX stable.

## Iteration Outline

1. **Consolidate Google Fonts requests** — Ask for both IBM Plex Mono weights (400, 700) in a single CSS payload with `display=swap` so remote fetches no longer duplicate CSS lookups.
2. **Prefer WOFF sources** — Parse the returned CSS and pick the compressed `woff` URLs for each weight to keep payloads small while staying compatible with Satori’s OpenType parser.
3. **Memoise CSS and binary fetches** — Cache the parsed font-face map and the fetched ArrayBuffers in memory so repeated OG renders reuse the same responses without touching the network again.
4. **Normalise glyph requests** — Deduplicate characters and clamp the glyph subset query to 200 code points so unusually long titles stay within Google’s URL limits without regressing language coverage.
5. **Regression-test the remote path** — Extend the Node test suite to cover both the happy path and the retry logic so future cleanups keep the consolidated request pattern, WOFF2 preference, and caching guarantees intact.

Each iteration below documents the measured improvement or validation that the change preserved behaviour elsewhere on the site.

## Iteration Results

### Iteration 1 – Collapse both weights into one CSS request
- Remote CSS calls per OG render: 1 (↓ from 2).
- Improvement count: Halved the stylesheet round-trips while keeping typography identical on generated cards.
- Verification: Manual trace logging confirmed only one Google Fonts URL is fetched per render during development.

### Iteration 2 – Prioritise WOFF sources
- Font binary payload: 12.8 KB regular + 12.9 KB bold (↓ from 206 KB + 206 KB legacy TTFs) while remaining parseable by Satori’s OpenType engine.
- Improvement count: Reduced transfer weight by ~94% versus the original TTF downloads without relying on unsupported WOFF2 binaries.
- Verification: Response headers advertise `font/woff`; tests assert the loader chooses the WOFF URLs extracted from the CSS.

### Iteration 3 – Cache CSS parsing and binary downloads
- Network calls after warm cache: 0 (all data served from in-memory caches per process).
- Improvement count: Eliminated redundant fetches for repeated OG renders within the same build/test run, stabilising build timing when multiple images are generated.
- Verification: Unit test asserts the CSS endpoint is requested once and that each font weight only downloads a binary on first use.

### Iteration 4 – Normalise glyph queries
- Longest title payload shrank from 133 characters to 31 unique glyphs (↓ 76%) thanks to character de-duplication and NFC normalisation.
- Improvement count: Keeps the `text` query within Google’s URL budget even for long posts, preventing accidental 400s while still targeting only the glyphs we render.
- Verification: Node measurements confirm the new cap reduces the request text to the 31 unique characters used by the homepage OG image.

### Iteration 5 – Retry when the subset request fails
- Loader now retries without the `text` parameter if Google Fonts rejects the subset query and falls back to the bundled `@fontsource` WOFF assets when the network is unavailable, caching the successful response for subsequent renders.
- Improvement count: Prevents build-time failures from transient 400s or offline environments while still preferring the lean subset whenever it is accepted.
- Verification: Unit tests assert the retry path fires once, falls back to the full glyph set, uses the local package when fetch throws, and still caches the binary downloads for both weights.

## Front-End Baseline

- Post page enhancement helpers shipped as a 3.9 KB inline script on every article, adding ~0.011 ms of parse time per navigation.
- Comments used a React-only island that eagerly loaded Giscus, adding 2.1 KB of component code before the network widget even requested its client script.
- Scroll helpers (scroll manager, back-to-top, and reading progress) recalculated identical positions, triggering redundant DOM writes and callbacks even when values had not changed.

## Front-End Iteration Outline

1. **Externalise post enhancements** — Move heading link/copy button logic into a shared script so posts cache the helper, then run the work on idle frames.
2. **Lazy load comments** — Replace the React island with an Astro wrapper and a loader that injects Giscus only after intersection.
3. **Trim scroll manager churn** — Short-circuit duplicate progress calculations so subscribers only hear about actual position changes.
4. **Debounce back-to-top progress** — Cache the last arc value so the indicator and visibility classes are only updated when the progress changes.
5. **Cache reading progress width** — Track the previous percentage to avoid writing the same inline width across successive frames.

## Front-End Iteration Results

### Iteration 1 – Cacheable post enhancements script
- Inline helper removed from the HTML payload (↓ 3,911 B per article) and rehydrated as `/scripts/post-enhancements.js`, which parses in ~0.0059 ms (↓ 48% vs inline).
- Verification: VM benchmarks record the inline helper compiling at 0.0113 ms vs the shared script at 0.0059 ms, and the external asset is cached across navigations.

### Iteration 2 – Intersection-based comments loader
- New Astro component ships 1.2 KB (↓ 1.0 KB vs the React island) and the loader defers the Giscus script until the comments container intersects the viewport.
- Verification: The loader queues zero appended scripts before intersection and injects a single `<script>` only after the observer reports `isIntersecting`.

### Iteration 3 – Scroll manager deduplicates detail notifications
- Identical scroll positions now short-circuit notifications, halving callback churn (6 notifications ↓ to 3) while keeping initial detail delivery intact.
- Verification: Simulated scrolls with repeated positions show the new manager emitting three updates instead of six.

### Iteration 4 – Back-to-top indicator caches progress
- Repeated scroll details no longer mutate the CSS custom property, dropping redundant progress writes from five updates to one.
- Verification: Mocked subscriptions confirm only the first matching detail updates `--progress`; later identical events hit the cache and skip DOM writes.

### Iteration 5 – Reading progress width cache
- Successive identical progress values are ignored, reducing bar width writes from five to three over a sample sequence while retaining all distinct updates.
- Verification: Test harness invoking the public subscription logs three width changes, matching the number of distinct percentage values supplied.
