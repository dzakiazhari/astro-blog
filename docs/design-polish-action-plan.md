# Design Polish Action Plan

This document consolidates the pending design refinement tasks for the Astro blog refresh. Each section outlines the current issue, desired outcome, and actionable steps to address it. Track progress by checking off items as they are completed.

## 1. Improve Dark-Mode Contrast for Brand Accents
- **Problem:** Logo and key interactive accents lose visibility in dark mode.
- **Goal:** Ensure the logo and accent elements maintain sufficient contrast and reinforce the green brand identity in dark mode.
- **Actions:**
  1. Audit the dark-mode palette used by the logo, primary buttons, and links (see `src/components/Header` and shared theme tokens).
  2. Prototype a green-accent logo variant (SVG or CSS filter) and verify accessibility contrast ratios.
  3. Update shared theme colors in `src/styles/variables.css` (or relevant theme file) for consistent accent usage.
  4. Validate the updates across dark-mode pages, refining hover and focus states as needed.

## 2. Restore Card Delineation in Dark Mode
- **Problem:** Card outlines disappear on dark backgrounds, reducing readability.
- **Goal:** Reinstate subtle yet clear card boundaries for dark mode.
- **Actions:**
  1. Inspect card components in `src/components/Card` for existing border and shadow definitions.
  2. Define a theme-aware border or shadow token suited for dark backgrounds (e.g., semi-transparent light border).
  3. Apply the new token to all card variants (home, notes, posts) and QA in both themes.
  4. Adjust spacing if necessary to maintain hierarchy.

## 3. Rework Code Block Copy Button Styling
- **Problem:** Copy buttons on code snippets blend into the background and are difficult to find.
- **Goal:** Make copy controls visible and accessible across themes.
- **Actions:**
  1. Locate the code block implementation (likely `src/components/CodeBlock` or Markdown renderer overrides).
  2. Design a button style (background, border, icon) that adapts to light and dark themes with clear contrast.
  3. Add focus and hover states, ensuring accessible contrast ratios.
  4. Test across varying code lengths and responsive breakpoints.

## 4. Unify Pill Component Sizing and Alignment
- **Problem:** Pill-shaped elements (buttons, tags, etc.) have inconsistent sizing and alignment.
- **Goal:** Establish a unified pill design system for consistent spacing and alignment.
- **Actions:**
  1. Inventory existing pill/button/tag styles in `src/components` and global styles.
  2. Define standard padding, border radius, typography, and icon spacing tokens.
  3. Create or update a shared “Pill”/“Badge” component and refactor usages.
  4. Verify responsiveness and alignment across cards, navigation, and tag listings.

## 5. Enhance Card Visuals with Iconography
- **Problem:** Cards feel plain and lack engaging visual cues.
- **Goal:** Introduce note-related iconography or supporting visuals to enrich card appearance.
- **Actions:**
  1. Source or create square note icon assets aligned with the brand.
  2. Determine placement (e.g., top-left badge, background watermark) and prototype variations.
  3. Update the card component to include optional icons and supporting microcopy.
  4. Test accessibility to ensure icons complement, rather than overpower, text content.

## 6. Redesign Card Arrow Affordances
- **Problem:** Existing arrow chevrons are too thin and lack emphasis.
- **Goal:** Replace card arrows with sharper, more pronounced cues.
- **Actions:**
  1. Identify arrow SVGs or CSS used in card CTAs (`src/components/Card`).
  2. Sketch a new arrow style with a thicker stroke and sharper head (consider filled variants).
  3. Replace assets and adjust hover animations if needed.
  4. Ensure consistency across all arrow usages (cards, garden, pagination).

## 7. Refine Markdown Typography and Layout
- **Problem:** Markdown heading scale overshadows post titles; other elements (tables, blockquotes) need alignment with refreshed styling.
- **Goal:** Harmonize Markdown typography hierarchy and component styling.
- **Actions:**
  1. Audit the Markdown stylesheet (e.g., `src/styles/markdown.css`) for heading, table, and blockquote rules.
  2. Align heading sizes with page title hierarchy; adjust line heights and margins accordingly.
  3. Update styles for tables, blockquotes, and lists to reflect the refreshed design language.
  4. Perform regression checks on existing posts to confirm readability improvements.

## 8. Update Garden Navigation Icons
- **Problem:** Notes garden arrow icons feel mismatched with the new design direction.
- **Goal:** Introduce garden-appropriate navigation iconography.
- **Actions:**
  1. Review the notes garden component (`src/pages/garden`) to locate current icons.
  2. Select new icons (e.g., compass or branch motifs) that align with the garden metaphor.
  3. Integrate the new icons and adjust spacing and hover states as necessary.
  4. Validate in both themes, confirming screen reader labels remain accurate.

---

**Progress Tracking:**
- [ ] Contrast improvements shipped
- [ ] Card delineation updated
- [ ] Code copy buttons restyled
- [ ] Pill components unified
- [ ] Card icons implemented
- [ ] Card arrows redesigned
- [ ] Markdown typography refined
- [ ] Garden icons updated

Update this document as tasks are completed or re-scoped.
