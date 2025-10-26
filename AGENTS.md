# AGENTS.md — Working Guide for AI Agents (Unfold)

This guide describes the current Astro Erudite codebase used by Unfold. Follow these conventions when contributing automation or manual changes.

Scope: applies to the entire repository.

---

## Overview

- Framework: Astro 5 with optional React islands
- Styling: Tailwind CSS v4 via `@tailwindcss/vite`, custom tokens in `src/styles/`
- Content: Markdown collections under `src/content` validated in `src/content.config.ts`
- Dynamic OG: Satori + Resvg (`src/lib/generateOgImages.ts`, `src/pages/og.png.ts`)
- Lint/Format: ESLint + Prettier (Astro + Tailwind plugins)
- Path alias: `@/*` → `src/*` (`tsconfig.json`)

Key config files:

- `astro.config.ts` — integrations, markdown/rehype stack, Tailwind plugin
- `src/consts.ts` — SITE metadata, navigation, social links
- `src/content.config.ts` — blog & author schemas
- `src/styles/global.css` / `src/styles/typography.css` — palette and typographic overrides
- `eslint.config.js`, `.prettierrc.mjs`, `tsconfig.json`

Generated/ignored outputs:

- `dist/`, `.astro/`

---

## Run & Build

- Install deps: `pnpm install`
- Dev server: `pnpm run dev` (binds to `0.0.0.0:4321`)
- Quality gates: `pnpm run lint`, `pnpm run format:check`, `pnpm run test`
- Production build: `pnpm run build`
- Formatting: `pnpm run format`

> Docker scripts from Astro Paper were removed during the migration.

Environment variables:

- Optional `PUBLIC_GOOGLE_SITE_VERIFICATION` adds the verification meta tag.

---

## Content Authoring

- Posts live in `src/content/blog/<year>/<slug>.md`
- Authors are defined under `src/content/authors`
- The schema enforces: `title`, `description`, `pubDatetime`, optional `modDatetime`, `tags`, `draft`, `timezone`, `canonicalURL`, etc.
- Drafts remain hidden until `pubDatetime` passes `SITE.scheduledPostMargin`
- Year-prefixed directories are preserved in the URL (e.g. `/posts/2025/my-post`)

When editing schema, run `pnpm run test` (Astro sync + validation) and update any affected content.

---

## Components & Utilities

- Layout shell: `src/layouts/Layout.astro`
- Home/posts/about: `src/pages/index.astro`, `src/pages/posts/[...page].astro`, `src/pages/about.astro`
- Post details: `src/pages/posts/[...id]/index.astro`
- Code-block UX: styled in `src/styles/typography.css`, behaviour attached via `public/scripts/post-enhancements.js`
- OG helpers: `src/lib/normalizePostDate.ts`, `src/lib/data-utils.ts`, `src/lib/generateOgImages.ts`
- Icons/SVG: sourced from Lucide through `astro-icon`

No legacy `PostDetails.astro` or `public/toggle-theme.js` remains.

---

## Workflow Checklist

1. **Plan**
   - Review this guide and `docs/tasks.md`
   - Outline files to touch + validation commands in your plan/tool updates
2. **Implement**
   - Keep diffs minimal and scoped to the task
   - Update docs when behaviour or commands change
3. **Validate**
   - Run `pnpm run lint`
   - Run `pnpm run format:check`
   - Run `pnpm run test`
   - Run `pnpm run build` if runtime or build surfaces are affected
4. **Document**
   - Summarise work in `docs/tasks.md` (Completed & Backlog sections)
   - Archive outdated design docs under `docs/archive/`

---

## Guardrails

- Prefer `@/...` imports over relative chains
- Avoid `console.*` (ESLint `no-console`)
- Use Prettier + Tailwind plugin for class ordering; do not hand-sort
- Do not commit generated assets under `dist/`
- Keep OG image endpoints aligned with `src/lib/generateOgImages.ts`

Happy shipping!
