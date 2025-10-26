---
title: Install Expressive Code on Astro
author: Dzaki Azhari
description: How to install expressive code on Astro.
pubDatetime: 2024-03-10T00:52:16Z
modDatetime: 2024-03-10T01:02:09Z
featured: false
draft: false
tags:
  - dev
---


## Syntax Highlighter

Astro comes with [Shiki](https://shiki.style) preconfigured as the syntax highlighter, which provides great looking code blocks out of the box. However, if you want additional features like line highlighting, line numbers, editor-terminal frame, and more customization options, you may want to look at using expressive-code instead.

Expressive-code is a code rendering library that provides integrations into many different frameworks, including Astro, Starlight, Next.js, and any framework that supports remark plugins. This allows you to have a consistent look and functionality for your code blocks across different platforms.

## Installation

1. Install the expressive-code package:

```bash
npx astro add astro-expressive-code
```

2. Update your `astro.config.ts` file to use the new plugin:

```js title="astro.config.ts"
import expressiveCode from 'astro-expressive-code'
```

## Configuration

Expressive-code offers numerous customization choices to tailor the appearance and functionality of your code blocks. Occasionally, you may encounter a challenge when setting up the theme bundle to operate seamlessly in both light and dark modes. To illustrate, here is an example of my configuration:

```js title="astro.config.ts"
import { defineConfig } from 'astro/config'

const astroExpressiveCodeOptions = {
  //Change the themes
  themes: ['rose-pine', 'rose-pine-dawn'],
  useDarkModeMediaQuery: true,
  themeCssRoot: ':root',
  themeCssSelector: (theme) =>
    `[data-theme='${theme.name === 'dark' ? 'dark' : 'light'}']`,
  defaultProps: {
    // Enable word wrap by default
    wrap: true,
    // Disable wrapped line indentation for terminal languages
    overridesByLang: {
      'bash,ps,sh': { preserveIndent: false },
    },
  },
}
// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    sitemap(),
    expressiveCode(astroExpressiveCodeOptions),
  ],
})
```

Additionally you could configure your Astro layout page to remove tab-index for any code blocks with:

```js title="PostDetails.astro"
function removeTabIndexFromCodeBlocks() {
  let codeBlocks = Array.from(document.querySelectorAll('pre'))
  codeBlocks.forEach((codeBlock) => {
    codeBlock.removeAttribute('tabindex')
  })
} // Call the function to remove tabindex from code blocks
removeTabIndexFromCodeBlocks()
```

With expressive-code integrated into your Astro project, you'll have more control over the styling and functionality of your code blocks.

See [Expressive Code](https://expressive-code.com) documentation for more extensive setup.
