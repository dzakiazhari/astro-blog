# Unfold — Dzaki Azhari's Digital Garden

Welcome to the codebase that powers [Unfold](https://dzakiazhari.com/), the personal blog of Dzaki Azhari. This repository hosts the source for essays, notes, and experiments about technology, learning, and personal growth. It is built on [Astro](https://astro.build/) with content stored in Markdown so the writing experience stays fast and distraction-free.

## Project Goals

- **Share long-form ideas clearly.** The layout is tuned for readability on both mobile and desktop, supports light/dark themes, and ships accessible interactions.
- **Keep publishing sustainable.** Posts live alongside code, letting Dzaki iterate on copy, styles, and metadata with version control.
- **Stay friendly to contributors.** Clear scripts, linting rules, and content schemas make it easy to submit improvements or suggest edits.

## Feature Highlights

- Type-safe Markdown content validated through Astro Content Collections
- Automatic pagination, scheduled publishing windows, and draft previews
- Dynamic Open Graph image generation for posts and the homepage
- Built-in dark/light theme toggle with persisted preference
- Static site search via Pagefind, optimized for privacy and speed
- RSS feed, sitemap, and SEO defaults tailored to the site branding
- Optional Giscus-powered discussions on individual posts

## Tech Stack

| Area | Tools |
| --- | --- |
| Framework | Astro 5 with island-based enhancements |
| Language | TypeScript |
| Styling | Tailwind CSS v4 plus custom typography styles |
| Content | Markdown files validated by Zod schemas |
| Search | Pagefind static index generated during `pnpm run build` |
| Tooling | ESLint, Prettier, Commitizen, and pnpm |
| Deployment | Optimized for static hosting providers (the production site runs on Cloudflare Pages) |

## Getting Started

1. **Install dependencies** (requires Node 18+ and [pnpm](https://pnpm.io/)):  
   `pnpm install`
2. **Run the dev server**:  
   `pnpm run dev`

The dev server listens on `0.0.0.0:4321` so you can preview from other devices or containers. If you prefer Docker, build and run with:

```bash
docker build -t unfold-blog .
docker run -p 4321:80 unfold-blog
```

## Common Commands

| Command | Purpose |
| --- | --- |
| `pnpm run dev` | Start the local dev server |
| `pnpm run build` | Create an optimized production build in `dist/` |
| `pnpm run preview` | Serve the production build locally |
| `pnpm run lint` | Lint source files with ESLint |
| `pnpm run format` | Format files with Prettier + Tailwind plugin |
| `pnpm run format:check` | Verify formatting without writing changes |
| `pnpm run sync` | Regenerate Astro content types after schema edits |
| `pnpm run test` | Execute the unit tests and Astro sync step |

## Project Structure

```
/
├── public/                 # Static assets served as-is
│   ├── scripts/            # Vanilla JS helpers (theme toggle, reading progress, etc.)
│   └── astropaper-og.jpg   # Default Open Graph fallback image
├── src/
│   ├── assets/             # Icons, images, and fonts used by components
│   ├── components/         # UI building blocks and islands
│   ├── data/blog/          # Markdown posts with frontmatter metadata
│   ├── layouts/            # Page shells (Layout, Main, PostDetails)
│   ├── pages/              # Astro routes (posts, archives, search, og images)
│   ├── styles/             # Tailwind layer definitions and typography overrides
│   ├── utils/              # Helpers such as path builders and OG templates
│   └── config.ts           # Site-wide settings for Unfold
├── astro.config.ts         # Astro configuration and integrations
└── docs/tasks.md           # Running log of notable maintenance work
```

## Writing & Managing Content

- Create new posts in `src/data/blog`. Filenames become part of the slug, so nest folders to group topics when needed.
- Each Markdown file requires frontmatter. A minimal example:
  ```md
  ---
  title: My New Post
  description: A quick summary that appears in cards and meta tags.
  pubDatetime: 2025-01-01T09:00:00.000Z
  tags: [productivity, learning]
  featured: true
  ---
  ```
- Optional fields support scheduled publishing (`pubDatetime` in the future), drafts (`draft: true`), canonical URLs, custom OG images, and time zone overrides.
- When you change `src/content.config.ts` or add new frontmatter fields, run `pnpm run sync` to refresh generated types.
- Pagefind search results rely on a production build. Run `pnpm run build` while developing to refresh the static index before testing search locally.

## Customization Tips

- Tweak site metadata, pagination, and feature toggles in `src/config.ts`.
- Global colors, spacing, and typography live in `src/styles/global.css` and `src/styles/typography.css`.
- Client-side enhancements—theme switching, reading progress, back-to-top button—reside in `public/scripts/` and are registered in the main layout.
- Open Graph image templates are defined under `src/utils/og-templates/` and rendered through the `/og.png.ts` endpoints if you want to adjust typography or branding.
- To enable Google Search Console verification, add a `.env` entry for `PUBLIC_GOOGLE_SITE_VERIFICATION`.

## Deployment Workflow

1. Push or merge changes to the default branch (currently `main`).
2. Trigger a static build using `pnpm run build`; the `dist/` output can be uploaded to any static host.
3. The live site at [dzakiazhari.com](https://dzakiazhari.com/) is deployed via Cloudflare Pages. Update the project there or integrate CI to publish automatically after builds succeed.
4. Monitor lighthouse scores and search indexing periodically to ensure performance and discoverability stay high.

## Contributing

Issues and pull requests are welcome for bug fixes, wording tweaks, or new ideas. Please follow Conventional Commits (`pnpm dlx cz` is available) and run `pnpm run lint` + `pnpm run test` before opening a PR.

## Credits

This site began from the excellent [AstroPaper](https://github.com/satnaing/astro-paper) theme by [Sat Naing](https://satnaing.dev/) and the open-source community. The design and content have been customized to reflect Dzaki Azhari's voice—many thanks to the original creators for their work and inspiration.

## License

Released under the MIT License. See [LICENSE](LICENSE) for details.
