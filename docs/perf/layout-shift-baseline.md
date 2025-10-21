# Layout Shift Baseline — Phase 1

Phase 1 focused on creating a controlled "audit" build so navigation-driven layout shifts can be measured without the noise of view transitions or speculative prefetching. This document captures the instrumentation that now ships with audit builds, the baseline measurement rubric, and slots for ongoing trace data.

## Audit Mode Toggle

| Switch | Description | Default |
| --- | --- | --- |
| `LAYOUT_AUDIT_MODE` | Server-side flag that also disables Astro's HTML prefetch pipeline during build. | `false` |
| `PUBLIC_LAYOUT_AUDIT_MODE` | Client-side toggle that removes view transitions, turns off card-level view-transition names, and loads the measurement helpers. | `false` |

Enable both flags (for example via `.env` or the CLI) to run an audit session:

```bash
LAYOUT_AUDIT_MODE=true PUBLIC_LAYOUT_AUDIT_MODE=true pnpm run dev -- --host 0.0.0.0 --port 4321
```

## Instrumentation Summary

- **Client router hardening:** When audit mode is on, the layout injects a short inline script that tags `<html data-layout-audit-mode="true">` before hydration and forces the router fallback to `none`, preventing fallback animations from playing.
- **Prefetch gating:** The prefetched hover strategy is skipped while auditing so navigation timings reflect on-demand fetching.
- **View-transition suppression:** A global inline `<style>` zeroes out `::view-transition-*` animations to make DOM movements visible. Card titles also stop publishing `viewTransitionName` tokens so the browser does not morph headings between pages.
- **Event marks:** `/public/scripts/layout-audit-marks.js` attaches listeners for `astro:page-load` and `astro:after-swap`. Each navigation pushes two entries—`event` and `event:post-frame`—into `window.__layoutAudit.marks` with `scrollHeight`, `bodyHeight`, and viewport metrics. Other hydration scripts call `window.__layoutAudit.mark(...)` around expensive work so the marks can be correlated with DOM mutations.

## Lighthouse Trace Log

| Route chain | CLS | INP (ms) | Notes |
| --- | --- | --- | --- |
| Home → Posts | _Pending_ | _Pending_ | Collect after running an audit-mode Lighthouse trace (`pnpm dlx lighthouse http://localhost:4321/ --preset=desktop --view`). |
| Posts → Post detail | _Pending_ | _Pending_ | Capture both mobile and desktop runs; annotate which post slug was exercised. |
| Post detail → Tags → Tag detail | _Pending_ | _Pending_ | Ensure the chosen tag has ≥6 posts so pagination renders. |
| Tag detail → Archives | _Pending_ | _Pending_ | Record whether timeline cards alternated correctly or collapsed to one column. |
| Archives → Home | _Pending_ | _Pending_ | Confirm the hero resumes the shared shell width without snapping. |

Once each run completes, export the Lighthouse JSON and drop summary numbers in the table above. Attach raw files to `/docs/perf/artifacts/` for long-term reference.

## Qualitative Screen Capture Checklist

| Scenario | Desktop | Mobile | Notes |
| --- | --- | --- | --- |
| Home → Posts | _Pending_ | _Pending_ | Highlight hero collapse, header stability, and pagination entrance timing. |
| Posts → Post detail | _Pending_ | _Pending_ | Call out breadcrumb spacer, code block adjustments, and reading-progress injection. |
| Post detail → Tags | _Pending_ | _Pending_ | Confirm tag filters render immediately with audit mode. |
| Archives → Home | _Pending_ | _Pending_ | Watch for footer repositioning and timeline connectors realignment. |

Store screen captures alongside trace artifacts with naming that encodes viewport and route (e.g., `2025-03-01-desktop-home-to-posts.mp4`).

## Interpreting `window.__layoutAudit.marks`

Each mark entry has the shape:

```json
{
  "label": "toggle-theme:bootstrap:end",
  "metrics": {
    "scrollHeight": 5218,
    "bodyHeight": 5129.5,
    "viewportHeight": 900,
    "timestamp": 1295.1
  },
  "pathname": "/posts/my-entry"
}
```

Pull the array in DevTools (`window.__layoutAudit.marks`) or export it after an automated Playwright run. Comparing `astro:page-load` and `astro:page-load:post-frame` height deltas reveals which hydration scripts still move the layout.

## Next Steps

- Populate the trace and capture tables with real numbers and links once Lighthouse audits are executed.
- Feed the collected deltas into Phase 2 structural work (unifying shell wrappers, reserving breadcrumb/pagination space).

## Phase 3 Automation Snapshot

- Added a Playwright scenario that traverses home → posts → article → tags → archives → home and fails when CLS exceeds 0.05, so
  future navigation or enhancement tweaks surface regressions immediately in CI.【F:tests/visual/layout-shift.spec.ts†L1-L63】【F:playwright.config.ts†L1-L16】
- Extend the instrumentation if new scripts appear during refactors so post-swap mutations remain observable.
