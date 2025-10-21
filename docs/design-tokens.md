# Design Tokens Reference

This document captures the shared layout primitives introduced during the layout shift remediation. Use these tokens and
components when extending the site so that new surfaces respect the stabilized gutters, padding, and reserved vertical
space.

## Layout Shell

The `Shell.astro` component standardises horizontal rhythm across routes. It renders a semantic wrapper (default `div`)
with responsive gutters derived from a single set of CSS custom properties.

```astro
---
import Shell from "@/components/Shell.astro";
---

<Shell as="main" class="pb-8">
  <slot />
</Shell>
```

`Shell` accepts an optional `padding` prop:

| Prop value | Description | Resulting classes |
| ---------- | ----------- | ----------------- |
| _default_  | Standard shell padding | `layout-shell` |
| `"tight"`  | Reduced inline padding for dense content | `layout-shell layout-shell--tight` |
| `"none"`   | Full-bleed container (no inline padding) | `layout-shell layout-shell--flush` |

Always prefer `Shell` over hand-authored `mx-auto` or `max-w-*` utilities so that future adjustments to shell metrics only
require touching the CSS tokens below.

## Shell Variables

The shell relies on the following custom properties (all defined in `src/styles/global.css`). Adjust them with care:

| Token | Purpose | Default |
| ----- | ------- | ------- |
| `--shell-gutter` | Total horizontal gutter reserved outside the shell width | `clamp(2.5rem, 6vw, 4rem)` |
| `--shell-padding-inline` | Default inline padding applied by `layout-shell` | `clamp(1rem, 3vw, 1.5rem)` |
| `--shell-padding-inline-tight` | Inline padding when `padding="tight"` is used | `clamp(0.75rem, 2.5vw, 1.25rem)` |
| `--shell-content-min-height` | Minimum height applied to main content sections to prevent SPA jump cuts | `clamp(24rem, 68vh, 36rem)` |
| `--shell-breadcrumb-height` | Reserved height for the breadcrumb spacer | `clamp(2.75rem, 6vw, 3.75rem)` |
| `--shell-breadcrumb-padding-block` | Vertical padding applied around the breadcrumb slot | `clamp(0.75rem, 2vw, 1rem)` |
| `--shell-pagination-height` | Reserved height for pagination | `clamp(3.5rem, 6vw, 4.5rem)` |
| `--shell-pagination-padding-block` | Vertical padding around pagination controls | `clamp(1.5rem, 4vw, 2.5rem)` |
| `--shell-pagination-control-height` | Control height used by the pagination placeholder | `2.75rem` |
| `--shell-footer-padding-block` | Footer block padding, keeping spacing consistent below the fold | `clamp(2.5rem, 6vw, 3.5rem)` |

## Reserved Layout Slots

Certain shells declare `data-shell-slot` attributes so that the CSS layer can reserve space even when the dynamic element is
missing. Use the same slot names when introducing new wrappers:

| Slot | Purpose |
| ---- | ------- |
| `breadcrumb` | Maintains a consistent gap above the primary content surface whether breadcrumbs render or not. |
| `pagination` | Reserves the vertical space for pagination controls to prevent the footer from jumping upwards on shorter lists. |
| `footer` | Applies consistent block padding so the footer baseline aligns across templates. |

A pagination skeleton is rendered automatically when the control is absent; avoid removing it so that SPA navigations preserve the
same height budget.

## Route Layout Guidance

- **Listing pages** (`Main.astro` consumers) inherit `min-height: var(--shell-content-min-height)` on the primary card surface.
  When adding new sections, keep the outer `Shell` wrapper and append children inside the existing section to retain the reserved
  height.
- **Homepage hero** surfaces should use the same minimum height token to align transition targets with listing pages.
- **Search** embeds rely on `min-height: var(--shell-content-min-height)` so the Pagefind UI has space to render before hydration.
  Avoid overriding the height without replacing it with an equivalent placeholder.

By relying on these tokens and the shared `Shell` component, new features stay within the balanced layout envelope established in
Phase 2 of the layout shift remediation work.
