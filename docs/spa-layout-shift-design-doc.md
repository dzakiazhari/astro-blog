# SPA Layout Shift Design Audit

## Evaluation Iterations
Each iteration documents the observed SPA shift, the suspected root cause, and the downstream impact. Findings compound across routes, explaining why “everything moves” whenever the user navigates.

1. **Container width strategy diverges between page types.**
   - *Observation:* Listing templates (`posts`, `tags`, `archives`) clamp content with a responsive `site-shell` width, while post details hard-code a `max-w-app` wrapper.
   - *Root cause:* Competing padding and `max-width` definitions produce a different gutter calculation once `ClientRouter` swaps layouts.
   - *Impact:* Horizontal snap becomes visible as the viewport scales, spiking CLS for transitions that cross layout families.【F:src/styles/global.css†L941-L951】【F:src/layouts/PostDetails.astro†L132-L138】

2. **Header navigation reflows dramatically on hydration.**
   - *Observation:* The nav starts hidden and the hydration script toggles `grid` once JS loads.
   - *Root cause:* SPA swaps recreate the component, repeating the hide → show cycle without deferring to persisted state.
   - *Impact:* The top bar collapses and then expands after every route change, causing a large shift above the fold.【F:src/components/Header.astro†L69-L200】

3. **Breadcrumb injection shifts the main column.**
   - *Observation:* `Main.astro` injects breadcrumbs for secondary pages but not for the homepage.
   - *Root cause:* The breadcrumb slot adds unique top/bottom margins and a background border that have no placeholder on routes that omit it.
   - *Impact:* Navigating to any secondary page inserts 48–64px of vertical offset mid-transition.【F:src/layouts/Main.astro†L23-L56】【F:src/components/Breadcrumb.astro†L26-L68】

4. **Hero grid height mismatch amplifies vertical snap.**
   - *Observation:* The homepage hero occupies multiple viewport heights with magazine-style cards.
   - *Root cause:* No skeleton or reserved height is present on the destination routes, so the SPA transition interpolates between wildly different DOM heights.
   - *Impact:* The main column animates through large deltas, producing the most visually jarring shift in the experience.【F:src/pages/index.astro†L25-L165】

5. **Card view-transition hooks animate unintended regions.**
   - *Observation:* Cards set `viewTransitionName` on titles, which matches the slug-based identifier on post headlines.
   - *Root cause:* When the router swaps, the browser morphs text blocks of different sizes and weights.
   - *Impact:* The morph drags neighboring layout boxes, creating a rubber-banding effect even if widths were stable.【F:src/components/Card.astro†L36-L127】【F:src/layouts/PostDetails.astro†L141-L145】

6. **Global ClientRouter captures whole-document transitions.**
   - *Observation:* `Layout.astro` opts into `client:load` `ClientRouter` with default view-transition behavior.
   - *Root cause:* Without scoping `prefers-reduced-motion` or `inactive` selectors, the router snapshots the full viewport for every navigation.
   - *Impact:* Even stable sections animate as though they moved, exacerbating the perception of layout instability.【F:src/layouts/Layout.astro†L2-L158】

7. **Inconsistent shell padding compounds horizontal jitter.**
   - *Observation:* Section padding varies between `px-4`, `px-5`, and `px-6` across templates.
   - *Root cause:* Tailwind utility divergence accumulates after each SPA swap; there is no consistent wrapper component.
   - *Impact:* Users see the main column “breathe” sideways with each navigation.【F:src/layouts/Main.astro†L23-L55】【F:src/pages/index.astro†L30-L112】

8. **Pagination block appears and disappears abruptly.**
   - *Observation:* Pagination renders conditionally on listing length.
   - *Root cause:* Its insertion adds `mt-16` and button height without reserving space during the transition.
   - *Impact:* Bottom-of-page content jumps just before the fade completes.【F:src/components/Pagination.astro†L15-L46】

9. **Footer spacing depends on contextual flags.**
   - *Observation:* `Footer.astro` accepts a `noMarginTop` prop toggled by pagination.
   - *Root cause:* SPA swaps flip the prop during or after the transition, changing flex behavior and margin.
   - *Impact:* The footer rises or drops dozens of pixels between routes, visible even when the rest of the page is static.【F:src/components/Footer.astro†L12-L21】【F:src/components/Pagination.astro†L15-L46】

10. **Back-button session state rewrites layout between visits.**
    - *Observation:* Back-button logic stores `lastPathname` in `sessionStorage` and rehydrates controls depending on match state.
    - *Root cause:* The script re-runs post-transition, toggling the back button and breadcrumb visibility based on historic paths.
    - *Impact:* On return navigations the DOM mutates again, producing double shifts (transition + hydration updates).【F:src/layouts/Main.astro†L58-L67】【F:src/components/BackButton.astro†L1-L47】

11. **Mobile menu toggling introduces delayed height changes.**
    - *Observation:* Mobile nav remains `hidden` until the toggle script sets `grid`.
    - *Root cause:* SPA swaps reset the DOM but do not immediately reapply the persisted open/closed state.
    - *Impact:* Viewers on narrow widths see the header expand after a beat, perceived as layout drift.【F:src/components/Header.astro†L88-L200】

12. **Reading-progress scripts add late-loading overlays.**
    - *Observation:* Post details attach `reading-progress.js` and `back-to-top.js` after `astro:page-load`.
    - *Root cause:* Scripts append fixed-position elements and adjust padding without guarding for SPA timing.
    - *Impact:* Scrolling space changes after the transition resolves, nudging content upward.【F:src/layouts/PostDetails.astro†L100-L200】【F:src/layouts/Layout.astro†L140-L154】

13. **Inline TOC collapse reinitializes column heights.**
    - *Observation:* Post pages mount `remark-collapse` accordions that default to `open` server-side but close when hydrated.
    - *Root cause:* Hydration scripts rewrite the `open` attribute and animation height.
    - *Impact:* The content column shortens as soon as JS binds, creating an after-transition drop.【F:src/layouts/PostDetails.astro†L146-L189】【F:src/styles/typography.css†L227-L278】

14. **Tag filters rebuild card grids on client navigation.**
    - *Observation:* `/tags/[tag]` pages compute filtered posts in `onMount` to preserve SPA behavior.
    - *Root cause:* Client-side sorting delays final grid render, so initial layout lacks post cards until the effect runs.
    - *Impact:* Users see empty space collapse and then expand, compounding with other shifts.【F:src/pages/tags/[tag].astro†L43-L138】

15. **Theme toggle flashes adjust background offsets.**
    - *Observation:* `toggle-theme.js` synchronizes `data-theme` and `meta[name=theme-color]` after load.
    - *Root cause:* SPA navigations re-trigger the script, briefly applying default theme tokens before user preference is restored.
    - *Impact:* Background colors flicker, and contrast-aware spacing (e.g., box shadows, borders) recalculates, accentuating motion.【F:public/toggle-theme.js†L1-L78】【F:src/styles/global.css†L68-L156】

16. **Code block copy buttons reflow monospace sections.**
    - *Observation:* `PostDetails.astro` reruns copy-button initialization after each `astro:after-swap` event.
    - *Root cause:* Buttons insert absolute-positioned pills, forcing layout remeasure on large code fences.
    - *Impact:* Long snippets jump vertically post-transition, especially on mobile where wrapping occurs.【F:src/layouts/PostDetails.astro†L164-L200】【F:src/styles/typography.css†L279-L356】

17. **Archive timeline uses alternating columns without consistent skeletons.**
    - *Observation:* `/archives` alternates posts left/right with timeline connectors.
    - *Root cause:* CSS selectors rely on `:nth-child` to assign offsets; during SPA transitions, partial hydration means widths settle late.
    - *Impact:* Timeline markers slide sideways until the grid recalculates, adding to perceived motion.【F:src/pages/archives.astro†L37-L183】

18. **Client-side search route injects Pagefind UI late.**
    - *Observation:* `/search` pulls Pagefind’s script bundle that renders controls after the SPA swap completes.
    - *Root cause:* The template reserves only minimal space before the JS widget loads.
    - *Impact:* The search input and results list pop into place seconds after navigation, keeping the layout in flux.【F:src/pages/search.astro†L21-L127】

## Three-Phase Action Plan
Each phase deepens focus: start with measurement, then normalize layout primitives, then tackle interactive enhancements. Deliverables, owners, and exit criteria ensure the plan is actionable.

1. **Stabilize baseline & instrumentation (Week 1).**
   - *Disable disruptive animations:* Configure `ClientRouter` to `prefetch={false}` and `transitions={{ name: "none" }}` for audit builds; toggle off `viewTransitionName` attributes during measurement runs.【F:src/layouts/Layout.astro†L2-L158】【F:src/components/Card.astro†L36-L127】
   - *Quantify shifts:* Capture Lighthouse traces for home ↔ posts ↔ post detail ↔ tags ↔ archives, logging CLS and Interaction to Next Paint. Store results in `/docs/perf/layout-shift-baseline.md`.
   - *Record qualitative evidence:* Produce screen recordings (desktop + mobile breakpoints) to highlight hero, breadcrumb, and footer motions. Annotate timestamps against the above trace logs.
   - *Audit script timing:* Instrument `astro:page-load` and `astro:after-swap` handlers with `performance.mark` to identify the biggest post-transition DOM mutations.

2. **Normalize structural layout primitives (Weeks 2–3).**
   - *Unify shell wrappers:* Refactor `site-shell`, `max-w-app`, and hero containers into a single `Shell` component with consistent padding, gutters, and max width tokens. Update pages/layouts to consume it and verify zero-diff spacing across route families.【F:src/styles/global.css†L941-L951】【F:src/layouts/Main.astro†L23-L56】【F:src/layouts/PostDetails.astro†L132-L138】
   - *Reserve vertical rhythm:* Introduce placeholder slots (e.g., breadcrumb spacer, pagination skeleton) that maintain height whether populated or not. Confirm breadcrumbs, pagination, and footer all align without mid-transition pushes.【F:src/components/Breadcrumb.astro†L26-L68】【F:src/components/Pagination.astro†L15-L46】【F:src/components/Footer.astro†L12-L21】
   - *Balance route-specific layouts:* Redesign hero, archives, and search grids to share column counts and predictable heights. Provide collapse/expand animations that finish before `astro:after-swap` fires to avoid late reflows.【F:src/pages/index.astro†L25-L165】【F:src/pages/archives.astro†L37-L183】【F:src/pages/search.astro†L21-L127】
   - *Document tokens:* Update `/docs/design-tokens.md` (new or existing) with canonical spacing, max-width, and breakpoint usage so future contributions stay aligned.

3. **Refine interactive behaviors & progressive enhancement (Weeks 4–5).**
   - *Scope transitions intentionally:* Reintroduce view transitions only for small, matched elements (e.g., post thumbnail → hero image) and guard them behind reduced-motion queries. Add regression tests that diff snapshots pre/post navigation.【F:src/components/Card.astro†L36-L127】【F:src/layouts/PostDetails.astro†L141-L145】
   - *Hydration-safe navigation:* Rewrite header and mobile menu to render in their final state server-side, using CSS-only disclosure where possible. Persist open state via data attributes so SPA swaps respect the stored preference.【F:src/components/Header.astro†L69-L200】
   - *Defer optional scripts:* Gate reading-progress, back-to-top, TOC collapse, and Pagefind initialization behind `requestIdleCallback` or user interaction. Ensure they provide reserved space placeholders to avoid reflow.【F:src/layouts/PostDetails.astro†L100-L200】【F:public/toggle-theme.js†L1-L78】【F:src/pages/search.astro†L21-L127】
 - *Regression monitoring:* Automate a Playwright visual regression suite that walks key routes, checking for layout shift budgets under 0.05 and recording before/after diffs per release.

## Phase 2 Progress Notes

- Implemented a shared `Shell.astro` wrapper so listings, posts, and standalone pages inherit the same horizontal gutters and
  min-height budget, replacing ad-hoc `site-shell`/`max-w-app` classes.【F:src/components/Shell.astro†L1-L40】【F:src/layouts/Main.astro†L1-L71】【F:src/layouts/PostDetails.astro†L1-L247】
- Reserved layout slots for breadcrumbs, pagination, and footers using `data-shell-slot` hooks plus shell tokens to prevent
  vertical snap when slots are empty.【F:src/styles/global.css†L934-L970】【F:src/components/Pagination.astro†L1-L71】【F:src/components/Footer.astro†L1-L38】
- Normalised hero, listing, and search surfaces to the shared `--shell-content-min-height` token so SPA transitions animate
  between similarly sized containers.【F:src/styles/global.css†L320-L334】【F:src/layouts/Main.astro†L41-L66】【F:src/pages/index.astro†L27-L141】【F:src/pages/search.astro†L1-L106】
