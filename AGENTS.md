# AGENTS.md — Working Guide for AI Agents (Astro Blog)

This document guides AI agents and contributors working in this repository. It defines conventions, safe modification areas, and how to run, build, and extend the site.

Scope: This file applies to the entire repository.

---

## Overview

- Framework: Astro 5 (TypeScript, React islands optional)
- Styling: Tailwind CSS v4 (via `@tailwindcss/vite`), custom CSS in `src/styles/`
- Content: Markdown collections in `src/data/blog` validated with Zod in `src/content.config.ts`
- Search: Pagefind (static index built during `pnpm run build`)
- Images/OG: Dynamic OG PNGs via Satori + Resvg; local assets under `src/assets/` and `public/`
- Lint/Format: ESLint (no-console) and Prettier (+ Astro + Tailwind plugins)
- Path alias: `@/*` → `src/*` (see `tsconfig.json`)

Key config files:
- `astro.config.ts` — site/integrations/markdown/shiki/tailwind plugin config
- `src/config.ts` — site-wide SITE options (posts per page, dynamic OG, etc.)
- `src/content.config.ts` — blog collection schema and loader
- `eslint.config.js`, `tsconfig.json` — linting and TS paths

Generated/ignored outputs (do not edit):
- `dist/`, `.astro/`, `public/pagefind/`

---

## Run & Build

- Install: `pnpm install`
- Dev: `pnpm run dev` (binds to `0.0.0.0:4321` so preview tools can connect)
- Build: `pnpm run build` (runs `astro check`, `astro build`, then `pagefind` and copies UI into `public/pagefind/`)
- Preview: `pnpm run preview`
- Lint: `pnpm run lint`
- Tests: `pnpm run test` (runs `astro sync`, compiles targeted fixtures with `tsc`, then runs Node's test runner with the alias loader registered via `tools/register-test-alias.mjs`)
- Format: `pnpm run format` / `pnpm run format:check`
- Type sync: `pnpm run sync` (after changing content collections)

Docker:
- Dev via Compose: `docker compose up -d` (exposes `4321`)
- Static build image: `docker build -t astropaper .` then `docker run -p 4321:80 astropaper`

Environment:
- Optional: `PUBLIC_GOOGLE_SITE_VERIFICATION` (client, public) to add verification meta tag.

---

## Content Authoring (Blog)

- Location: `src/data/blog`
- Loader: Includes all `.md` except files/dirs prefixed with `_` (see `src/content.config.ts`).
- Frontmatter schema (Zod):
  - `title: string` (required)
  - `description: string` (required)
  - `pubDatetime: date` (required)
  - `modDatetime?: date | null`
  - `author: string` (defaults to `SITE.author`)
  - `tags: string[]` (defaults to `["others"]`)
  - `featured?: boolean`
  - `draft?: boolean`
  - `ogImage?: string | image()` (absolute URL or local asset)
  - `canonicalURL?: string`
  - `hideEditPost?: boolean`
  - `timezone?: string` (IANA)

Example:
```md
---
title: My Post Title
description: One-line summary for cards and SEO.
pubDatetime: 2025-01-01T09:00:00.000Z
modDatetime: 2025-01-03T10:00:00.000Z
author: Dzaki Azhari
tags: [astro, web]
featured: true
# Optional: Either an absolute URL or imported asset
# ogImage: https://example.com/og.png
# ogImage: ../images/local-og.png
---

Your Markdown content…
```

Scheduling & drafts:
- Drafts are hidden by default (`draft: true`).
- `src/utils/postFilter.ts` hides posts until `pubDatetime` minus `SITE.scheduledPostMargin` has passed.

Slugs & nested paths:
- URLs derive from on-disk location. `src/utils/getPath.ts` slugifies directory segments and the filename.
- Underscore-prefixed directories (e.g., `_drafts/`) are excluded from the URL.
- Post details route is `src/pages/posts/[...slug]/index.astro`.

Pagination:
- `src/pages/posts/[...page].astro` paginates with `SITE.postPerPage`.

Search:
- `src/pages/search.astro` uses Pagefind UI. Search results require a prior `pnpm run build` during development to see results.

---

## Components, Layouts, and Scripts

- Global shell & SEO: `src/layouts/Layout.astro` (head/meta/LD+JSON, `ClientRouter`, theme handling, RSS link)
- Post page: `src/layouts/PostDetails.astro` (Giscus comments, tags, prev/next links, dynamic OG resolution)
- Code block UX: Copy buttons are attached by the inline script in `PostDetails.astro`. Buttons are wrapped in `.code-block` containers, re-run after `astro:page-load`/`astro:after-swap`, and styled via `.code-block .copy-code` in `src/styles/typography.css`. Maintain the shared CSS custom properties (`--code-card-*`) so padding, scroll affordances, and the copy pill stay aligned with the first code line. Tokens must retain Shiki-provided foreground colors while rendering on the neutral card surface (token backgrounds stay `transparent`). When iterating, preview both light/dark themes and narrow viewports via `pnpm run dev -- --host 0.0.0.0 --port 4321` to confirm the button remains clear of wrapped code.
- Page shell: `src/layouts/Main.astro` (title/desc, breadcrumb, back-link persistence)
- Theme: `public/toggle-theme.js` writes `data-theme` and meta `theme-color`, synced with prefers-color-scheme
- UX helpers: `public/scripts/reading-progress.js`, `public/scripts/back-to-top.js`

Tailwind v4:
- Global styles: `src/styles/global.css`, typography overrides `src/styles/typography.css`
- Tailwind classes are auto-sorted by Prettier Tailwind plugin; do not hand-optimize ordering.

Icons & images:
- SVG icons in `src/assets/icons/`, images in `src/assets/images/`. Public assets (no processing) go in `public/`.

OG image generation:
- Dynamic endpoints: `src/pages/og.png.ts` (site), `src/pages/posts/[...slug]/index.png.ts` (per post)
- Templates in `src/utils/og-templates/` (JS). Avoid browser importing server-only packages (`@resvg/resvg-js`).

---

## Workflow for Agents

1. **Plan**
   - Re-read this guide and skim `docs/tasks.md` to understand past work or active concerns.
   - Outline the intended changes (files to touch, validations to run) before editing anything.
2. **Implement**
   - Run `pnpm install` if dependencies were updated since your last session (e.g., to ensure local OG fonts are linked).
   - Keep diffs scoped: prefer small, reviewable commits following Conventional Commit conventions.
3. **Validate**
   - Execute `pnpm run lint`, `pnpm run test`, and, when changes touch build/runtime behaviour, `pnpm run build`.
   - Capture command output for reporting (see Final Answer guidelines).
4. **Document & Retrospect**
   - Summarise noteworthy fixes, regressions avoided, or insights in `docs/tasks.md` under **Completed** with links to touched files.
   - Note any follow-up work in the **Backlog** table.

### Workflow Retrospective — Remote Font & Performance Pass (2024-03)

- **Guard against remote regressions.** Any time Google Fonts integration or OG rendering changes, run `pnpm run build` so the real HTTP call path is exercised. If the build fails, prefer strengthening retry/fallback logic and extending unit coverage instead of committing font binaries.
- **Automate fallback verification.** Add or update tests that simulate HTTP 4xx/5xx responses and network errors before relying on manual builds. This keeps the local `@fontsource` assets as the final safety net.
- **Resolve formatting locally.** Run `pnpm exec prettier --write <globs>` (or `pnpm run format`) immediately after touching JS/TS/Astro files so `pnpm run format:check` stays green in CI.
- **Log process learnings.** Capture workflow adjustments in `docs/workflow-retrospective.md` and mirror the highlights in `docs/tasks.md` so future agents inherit the caution points without rereading the entire history.

---

## Conventions & Guardrails

Imports & paths:
- Prefer alias imports with `@/…` instead of long `../` chains.
- Keep `tsconfig.json` `paths` mapping intact.

Linting:
- ESLint is configured with `no-console: error`. Avoid adding `console.*`; use comments or tests instead.
- Ignore lists include `dist/**`, `.astro/**`, `public/pagefind/**`.

Formatting:
- Use Prettier (with `prettier-plugin-astro` and `prettier-plugin-tailwindcss`). Run `pnpm run format` before submitting changes.

Astro/Markdown:
- Remark plugins include `remark-toc` and `remark-collapse` (typed via `remark-collapse.d.ts`).
- Shiki transformers include a custom file name label (`src/utils/transformers/fileName.js`). Use code fences with `file="…"` meta to display labels.

Scripts & transitions:
- `astro:transitions` is enabled. Avoid breaking `ClientRouter` placement and `experimental.preserveScriptOrder` behavior in `astro.config.ts`.

Do NOT edit:
- Generated outputs: `dist/`, `.astro/`, `public/pagefind/`.
- License headers.

When changing schemas:
- After modifying `src/content.config.ts`, run `pnpm run sync` to regenerate Astro/TS types.

Commit style:
- Use Conventional Commits (Commitizen configured in `cz.yaml`). Examples: `feat: …`, `fix: …`, `chore: …`, `docs: …`.

---

## Known Issues / Follow-ups

Recent maintenance history lives in `docs/tasks.md`, which consolidates resolved review items (typos, share-link encoding, README search-provider updates, post-filter tests, highlight tweaks, copy-button fixes). The backlog is empty right now, so add new work there as it arises.

---

## Quick Checklist for Agents

- Read and respect `SITE` options in `src/config.ts` when implementing features.
- Keep routes and path helpers (`getPath`, collection loader) compatible with nested blog directories.
- Avoid adding `console.*`; prefer returning values or comments.
- Run: `pnpm run lint` and `pnpm run format:check` before finalizing.
- If you add or modify blog frontmatter, ensure it passes `src/content.config.ts` validation.
- For search-related changes, perform a full `pnpm run build` to regenerate Pagefind index.
- Before shipping visual tweaks, load the component in a browser (desktop + ≤640px) and double-check behaviour in both themes so earlier regressions—like misplaced copy buttons or returning Shiki backdrops—are not reintroduced.
- Add meaningful discoveries or fixes to `docs/tasks.md` so future agents inherit the context.
- When work affects blog structure (collection paths, media directories, slug behaviour), review `.pages.yml` to keep the Pages CMS configuration aligned.

---

## Support Notes (Local Dev Quirks)

- Windows PowerShell may require installing `concurrently` to run `astro check --watch` alongside dev (see README warning). Not needed for standard `pnpm run dev`.
- Bracketed filenames in Windows shells need literal paths (use `-LiteralPath` in PowerShell) when reading files like `src/pages/posts/[...slug]/index.astro`.

