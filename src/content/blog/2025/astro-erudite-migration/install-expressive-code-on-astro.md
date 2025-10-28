---
title: Install Expressive Code on Astro
description: How to install expressive code on Astro.
pubDatetime: 2024-03-10T00:52:16Z
modDatetime: 2024-03-10T01:02:09Z
order: 2
tags:
  - dev
---

> **Update (2025):** This guide now lives inside the Astro Erudite series. The layout snippet that referenced `PostDetails.astro` belonged to the Astro Paper starter—Erudite ships its own enhancements through `public/scripts/post-enhancements.js`, so you no longer need to manually strip `tabindex` attributes.

## Syntax Highlighter

Astro comes with [Shiki](https://shiki.style) preconfigured as the syntax highlighter, which provides great looking code blocks out of the box. However, if you want additional features like line highlighting, line numbers, editor-terminal frame, and more customization options, you may want to look at using expressive-code instead.

Expressive-code is a code rendering library that provides integrations into many different frameworks, including Astro, Starlight, Next.js, and any framework that supports remark plugins. This allows you to have a consistent look and functionality for your code blocks across different platforms.

## Installation

1. Install the expressive-code package:

```bash
npx astro add astro-expressive-code
```

2. Update `astro.config.ts` to register Expressive Code alongside the other integrations:

```ts title="astro.config.ts"
import { defineConfig } from 'astro/config'
import expressiveCode from 'astro-expressive-code'
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'

import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'
import tailwindcss from '@tailwindcss/vite'

import { SITE } from '@/consts'

export default defineConfig({
  site: SITE.href,
  integrations: [
    expressiveCode({
      themes: ['github-light', 'github-dark'],
      plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
      useDarkModeMediaQuery: false,
      themeCssSelector: (theme) => `[data-theme="${theme.name.split('-')[1]}"]`,
      defaultProps: {
        wrap: true,
        collapseStyle: 'collapsible-auto',
        overridesByLang: {
          'ansi,bat,bash,batch,cmd,console,powershell,ps,ps1,psd1,psm1,sh,shell,shellscript,shellsession,text,zsh':
            {
              showLineNumbers: false,
            },
        },
      },
    }),
    mdx(),
    react(),
    sitemap(),
    icon(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
```

## Configuration

Expressive Code exposes plenty of styling hooks. The Erudite setup above keeps the light/dark pairing aligned with the site theme tokens, disables noisy line numbers for shell output, and leans on collapsible sections for long snippets. Adjust `styleOverrides` or `defaultProps` as needed, then rerun `pnpm run lint` to make sure the config still satisfies the schema.

With expressive-code integrated into your Astro project, you'll have more control over the styling and functionality of your code blocks.

## 2025 refresh

Erudite now loads the copy-button behaviour and tab-index cleanup through `public/scripts/post-enhancements.js`. Extend that file if you need extra interactivity instead of editing layouts directly, and keep the visual adjustments in `src/styles/typography.css` so the blog and notes remain in sync.
See [Expressive Code](https://expressive-code.com) documentation for more extensive setup.
