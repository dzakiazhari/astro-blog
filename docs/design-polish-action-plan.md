# Design Polish Action Plan

This document consolidates the pending design refinement tasks for the Astro blog refresh. Each section outlines the current issue, desired outcome, and actionable steps to address it. The roadmap below breaks the effort into manageable checkpoints so we can land incremental improvements while maintaining momentum.

## Milestone Roadmap

### Milestone 1 – Dark-Mode Legibility
- ✅ Definition of done: Dark theme surfaces clearly display the logo, accent colors, card boundaries, and copy buttons across desktop and mobile breakpoints.
- Includes tasks: [1](#1-improve-dark-mode-contrast-for-brand-accents), [2](#2-restore-card-delineation-in-dark-mode), [3](#3-rework-code-block-copy-button-styling).
- Suggested workflow:
  1. Prototype accent adjustments in an isolated branch and validate contrast ratios.
  2. Roll the winning theme tokens into shared CSS variables.
  3. QA critical screens (home, post, notes) in both themes before closing the milestone.

### Milestone 2 – Component Cohesion
- ✅ Definition of done: Pills, badges, and CTA arrows follow a unified visual system and cards gain lightweight iconography for quicker scanning.
- Includes tasks: [4](#4-unify-pill-component-sizing-and-alignment), [5](#5-enhance-card-visuals-with-iconography), [6](#6-redesign-card-arrow-affordances).
- Suggested workflow:
  1. Establish shared component tokens (radius, padding, icon spacing) and refactor the most visible components first.
  2. Prototype icon usage on a single card template, gather feedback, and propagate once approved.
  3. Replace arrow assets last to avoid rework while the card structure is still in flux.

### Milestone 3 – Content Presentation Polish
- ✅ Definition of done: Markdown-rendered content matches the refreshed hierarchy, and the garden navigation feels intentional and on-brand.
- Includes tasks: [7](#7-refine-markdown-typography-and-layout), [8](#8-update-garden-navigation-icons).
- Suggested workflow:
  1. Adjust typography scale tokens and validate against long-form posts with multiple element types (tables, blockquotes, etc.).
  2. Iterate on garden iconography with a focus on recognisability in both themes and small viewports.
  3. Conduct a content sweep to catch regressions before signing off the milestone.

## 1. Improve Dark-Mode Contrast for Brand Accents
- **Problem:** Logo and key interactive accents lose visibility in dark mode.
- **Goal:** Ensure the logo and accent elements maintain sufficient contrast and reinforce the green brand identity in dark mode.
- **Actions:**
  1. Audit the dark-mode palette used by the logo, primary buttons, and links (see `src/components/Header` and shared theme tokens).
  2. Prototype a green-accent logo variant (SVG or CSS filter) and verify accessibility contrast ratios.
  3. Update shared theme colors in `src/styles/variables.css` (or relevant theme file) for consistent accent usage.
  4. Validate the updates across dark-mode pages, refining hover and focus states as needed.
- **Checkpoint:** Logo, navigation links, and primary buttons meet WCAG AA contrast against dark backgrounds.
- **Status:** ✅ Theme tokens now supply a brighter accent and heading color in both palettes (`src/styles/global.css`), restoring logo and navigation contrast in dark mode.

## 2. Restore Card Delineation in Dark Mode
- **Problem:** Card outlines disappear on dark backgrounds, reducing readability.
- **Goal:** Reinstate subtle yet clear card boundaries for dark mode.
- **Actions:**
  1. Inspect card components in `src/components/Card` for existing border and shadow definitions.
  2. Define a theme-aware border or shadow token suited for dark backgrounds (e.g., semi-transparent light border).
  3. Apply the new token to all card variants (home, notes, posts) and QA in both themes.
  4. Adjust spacing if necessary to maintain hierarchy.
- **Checkpoint:** Cards display a perceptible border/shadow at 100% zoom in dark mode without overpowering content.
- **Status:** ✅ Card surfaces now draw from dedicated border and shadow tokens with enhanced hover treatments (`src/components/Card.astro`, `src/styles/global.css`).

## 3. Rework Code Block Copy Button Styling
- **Problem:** Copy buttons on code snippets blend into the background and are difficult to find.
- **Goal:** Make copy controls visible and accessible across themes.
- **Actions:**
  1. Locate the code block implementation (likely `src/components/CodeBlock` or Markdown renderer overrides).
  2. Design a button style (background, border, icon) that adapts to light and dark themes with clear contrast.
  3. Add focus and hover states, ensuring accessible contrast ratios.
  4. Test across varying code lengths and responsive breakpoints.
- **Checkpoint:** Copy button remains visible and reachable on narrow viewports, with keyboard focus states clearly highlighted.
- **Status:** ✅ Copy controls receive a persistent, theme-aware pill treatment with responsive offsets and active states (`src/styles/global.css`, `src/styles/typography.css`).

## 4. Unify Pill Component Sizing and Alignment
- **Problem:** Pill-shaped elements (buttons, tags, etc.) have inconsistent sizing and alignment.
- **Goal:** Establish a unified pill design system for consistent spacing and alignment.
- **Actions:**
  1. Inventory existing pill/button/tag styles in `src/components` and global styles.
  2. Define standard padding, border radius, typography, and icon spacing tokens.
  3. Create or update a shared “Pill”/“Badge” component and refactor usages.
  4. Verify responsiveness and alignment across cards, navigation, and tag listings.
- **Checkpoint:** All pill variants align to an 8px spacing grid and share consistent typography styles across the site.

## 5. Enhance Card Visuals with Iconography
- **Problem:** Cards feel plain and lack engaging visual cues.
- **Goal:** Introduce note-related iconography or supporting visuals to enrich card appearance.
- **Actions:**
  1. Source or create square note icon assets aligned with the brand.
  2. Determine placement (e.g., top-left badge, background watermark) and prototype variations.
  3. Update the card component to include optional icons and supporting microcopy.
  4. Test accessibility to ensure icons complement, rather than overpower, text content.
- **Checkpoint:** Updated card layout ships with icons on at least two card types, with no regression in text truncation or responsiveness.

## 6. Redesign Card Arrow Affordances
- **Problem:** Existing arrow chevrons are too thin and lack emphasis.
- **Goal:** Replace card arrows with sharper, more pronounced cues.
- **Actions:**
  1. Identify arrow SVGs or CSS used in card CTAs (`src/components/Card`).
  2. Sketch a new arrow style with a thicker stroke and sharper head (consider filled variants).
  3. Replace assets and adjust hover animations if needed.
  4. Ensure consistency across all arrow usages (cards, garden, pagination).
- **Checkpoint:** Card CTA arrows match the new icon weight and remain legible at 14px size on retina screens.

## 7. Refine Markdown Typography and Layout
- **Problem:** Markdown heading scale overshadows post titles; other elements (tables, blockquotes) need alignment with refreshed styling.
- **Goal:** Harmonize Markdown typography hierarchy and component styling.
- **Actions:**
  1. Audit the Markdown stylesheet (e.g., `src/styles/markdown.css`) for heading, table, and blockquote rules.
  2. Align heading sizes with page title hierarchy; adjust line heights and margins accordingly.
  3. Update styles for tables, blockquotes, and lists to reflect the refreshed design language.
  4. Perform regression checks on existing posts to confirm readability improvements.
- **Checkpoint:** Markdown headings scale down progressively from the post title, and tables/quotes maintain consistent spacing across viewports.

## 8. Update Garden Navigation Icons
- **Problem:** Notes garden arrow icons feel mismatched with the new design direction.
- **Goal:** Introduce garden-appropriate navigation iconography.
- **Actions:**
  1. Review the notes garden component (`src/pages/garden`) to locate current icons.
  2. Select new icons (e.g., compass or branch motifs) that align with the garden metaphor.
  3. Integrate the new icons and adjust spacing and hover states as necessary.
  4. Validate in both themes, confirming screen reader labels remain accurate.
- **Checkpoint:** Garden navigation icons ship with updated aria-labels and remain crisp at 1x resolution.

---

**Progress Tracking:**
- **Milestone 1 – Dark-Mode Legibility**
  - [x] Contrast improvements shipped
  - [x] Card delineation updated
  - [x] Code copy buttons restyled
- **Milestone 2 – Component Cohesion**
  - [ ] Pill components unified
  - [ ] Card icons implemented
  - [ ] Card arrows redesigned
- **Milestone 3 – Content Presentation Polish**
  - [ ] Markdown typography refined
  - [ ] Garden icons updated

Update this document as tasks are completed or re-scoped.
