# Unfold

Personal blog built with Astro 5, Tailwind CSS v4, and the Astro Erudite component set. The site keeps the Unfold color palette and IBM Plex typography while layering custom code-block utilities and dynamic Open Graph generation.

## Tech Stack

- [Astro](https://astro.build/) 5 with islands enabled on demand
- Tailwind CSS v4 via `@tailwindcss/vite`
- React 19 (for interactive islands)
- `astro-icon`, Lucide icon set, and shadcn/ui primitives
- Dynamic OG images rendered with Satori + Resvg

## Getting Started

```bash
pnpm install          # install dependencies
pnpm run dev          # start local dev server (0.0.0.0:4321)
pnpm run lint         # eslint
pnpm run format       # prettier write
pnpm run format:check # prettier check only
pnpm run test         # astro check / content validation
pnpm run build        # production build with OG generation
```

## Content

- Blog posts live in `src/content/blog/<year>/<slug>.md`
- Authors live in `src/content/authors`
- Frontmatter is validated in `src/content.config.ts`
- Posts stay hidden until `pubDatetime` passes the configured `scheduledPostMargin`

## Notable Features

- Code fences gain “Copy Markdown” + “View Markdown” controls via `public/scripts/post-enhancements.js`
- Dynamic Open Graph images served from `src/pages/og.png.ts` and `src/pages/blog/[...id]/index.png.ts`
- IBM Plex Sans/Mono palette defined in `src/styles/global.css` with matching code-block skinning in `src/styles/typography.css`

## Repository Conventions

- Path alias `@/*` maps to `src/*`
- Keep docs updates in `docs/tasks.md` (Completed / Backlog tables)
- Archive historical design docs under `docs/archive/`
- Run lint → test → build before handing off changes

Happy shipping!
