# Unfold - Your Personal Astro Blog

Welcome to "Unfold," a personal blog built with [Astro](https://astro.build/), designed for sharing thoughts, stories, and ideas. This project is tailored for a clean, content-focused experience with modern web features and easy customization.

## Features

* **Astro-Powered:** Fast static site generation for optimal performance.
* **Markdown Content:** Write blog posts in familiar Markdown with powerful frontmatter support.
* **Tailwind CSS:** Utility-first CSS framework for flexible and rapid styling.
* **TypeScript:** Enhanced code quality and developer experience with static typing.
* **Light & Dark Mode:** User-selectable themes for comfortable reading.
* **Dynamic Open Graph (OG) Images:** Automatically generated OG images for posts and the main site, enhancing social sharing.
* **SEO Friendly:**
    * Sitemap generation (`sitemap-index.xml`).
    * `robots.txt` generation.
    * Canonical URL support.
* **RSS Feed:** `rss.xml` feed for content syndication.
* **Content Collections:** Type-safe content management for blog posts.
* **Organized Structure:** Clear separation of content, configuration, styles, and utilities.
* **Customizable Configuration:** Easily tweak site settings, navigation, and appearance.
* **Utility Functions:** Helpers for common tasks like slugification, post sorting, path generation, etc.
* **Code Syntax Highlighting:** Uses Shiki with configurable themes for light and dark modes via Astro's Markdown configuration. (Note: An older blog post mentions Expressive Code, but current `astro.config.ts` uses Shiki.)
* **Table of Contents Support:** `remark-toc` and `remark-collapse` for auto-generated and collapsible ToCs in Markdown.
* **Docker Support:** Includes a `docker-compose.yml` for containerized development.
* **Linting & Formatting:** Prettier and ESLint configured for code consistency.
* **Commitizen Friendly:** `cz.yaml` suggests conventional commits are encouraged.

## Project Structure

Here's a brief overview of the key directories and files:

```
astro-blog/
├── public/                     # Static assets (images, fonts, toggle-theme.js)
│   └── toggle-theme.js         # Handles light/dark mode switching
├── src/
│   ├── assets/                 # Icons and other static assets used in components
│   │   └── icons/
│   ├── components/             # Astro/UI components (if any, not explicitly detailed in provided files beyond icons)
│   ├── config.ts               # Main site configuration (title, author, URLs, etc.)
│   ├── constants.ts            # Site-wide constants like social media links
│   ├── content.config.ts       # Defines content collections (e.g., blog posts)
│   ├── data/
│   │   └── blog/
│   │       └── some-blog-posts.md
│   ├── layouts/
│   └── pages/
│   └── styles/
│   └── utils/
│   └── config.ts
│   └── constants.ts
│   └── content.config.ts
└── astro.config.ts
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

Any static assets, like images, can be placed in the `public/` directory.

All blog posts are stored in `src/data/blog` directory.

## 📖 Documentation

Documentation can be read in two formats\_ _markdown_ & _blog post_.

- Configuration - [markdown](src/data/blog/how-to-configure-astropaper-theme.md) | [blog post](https://astro-paper.pages.dev/posts/how-to-configure-astropaper-theme/)
- Add Posts - [markdown](src/data/blog/adding-new-post.md) | [blog post](https://astro-paper.pages.dev/posts/adding-new-posts-in-astropaper-theme/)
- Customize Color Schemes - [markdown](src/data/blog/customizing-astropaper-theme-color-schemes.md) | [blog post](https://astro-paper.pages.dev/posts/customizing-astropaper-theme-color-schemes/)
- Predefined Color Schemes - [markdown](src/data/blog/predefined-color-schemes.md) | [blog post](https://astro-paper.pages.dev/posts/predefined-color-schemes/)

## 💻 Tech Stack

**Main Framework** - [Astro](https://astro.build/)  
**Type Checking** - [TypeScript](https://www.typescriptlang.org/)  
**Styling** - [TailwindCSS](https://tailwindcss.com/)  
**UI/UX** - [Figma Design File](https://www.figma.com/community/file/1356898632249991861)  
**Static Search** - [FuseJS](https://pagefind.app/)  
**Icons** - [Tablers](https://tabler-icons.io/)  
**Code Formatting** - [Prettier](https://prettier.io/)  
**Deployment** - [Cloudflare Pages](https://pages.cloudflare.com/)  
**Illustration in About Page** - [https://freesvgillustration.com](https://freesvgillustration.com/)  
**Linting** - [ESLint](https://eslint.org)

## 👨🏻‍💻 Running Locally

You can start using this project locally by running the following command in your desired directory:

```bash
# pnpm
pnpm create astro@latest --template satnaing/astro-paper

# npm
npm create astro@latest -- --template satnaing/astro-paper

# yarn
yarn create astro --template satnaing/astro-paper

# bun
bun create astro@latest -- --template satnaing/astro-paper
```

Then start the project by running the following commands:

```bash
# install dependencies if you haven't done so in the previous step.
pnpm install

# start running the project
pnpm run dev
```

### Running Locally

To start the development server:

```bash
pnpm dev
```

This will usually start the server on `http://localhost:4321`. Astro will watch for file changes and update automatically.

### Building for Production

To build your blog for deployment:

```bash
pnpm build
```

The output will be in the `dist/` directory. The build script also includes a step for `pagefind --site dist` which suggests a client-side search functionality is being prepared.

## Content Management

### Adding New Blog Posts

1.  Create a new Markdown file (`.md`) inside the `src/data/blog/` directory. You can organize posts in subdirectories (e.g., by year or category).
2.  Add frontmatter to the top of your Markdown file. Key fields are defined in `src/content.config.ts` and include:
    * `title` (string, required): The title of your post.
    * `author` (string, defaults to `SITE.author` from `src/config.ts`): The author of the post.
    * `pubDatetime` (Date, required): The publication date and time.
    * `modDatetime` (Date, optional): The modification date and time.
    * `featured` (boolean, optional): Whether the post should be featured.
    * `draft` (boolean, optional): Set to `true` to keep the post from being published.
    * `tags` (array of strings, defaults to `["others"]`): Tags for categorizing your post.
    * `ogImage` (string or Astro Image function, optional): Path to a custom OG image or let one be dynamically generated.
    * `description` (string, required): A brief description of the post for SEO and previews.
    * `canonicalURL` (string, optional): If the post is a canonical version of content elsewhere.
    * `hideEditPost` (boolean, optional): Hide the "Suggest Changes" link.
    * `timezone` (string, optional): Override the global timezone for this specific post.

    **Example Frontmatter (from `src/data/blog/2025/New Year 2025 A Look Back.md`):**
    ```yaml
    ---
    title: New Year 2025  A Look Back
    author: Dzaki Azhari
    description: New Year 2025  A Look Back.
    pubDatetime: 2025-01-01T20:53:09Z
    modDatetime: 2025-01-01T22:00:21Z
    slug: new-year-2025-a-look-back # Note: The slug is part of the frontmatter in examples, ensure this aligns with your `content.config.ts` (schema doesn't explicitly list slug, Astro typically derives from filename)
    featured: false
    draft: false
    tags:
      - blog
    ---

    ## Table of Contents
    ```
3.  Write your blog content in Markdown below the frontmatter.

### Managing Content Structure

* Blog posts are located in `src/data/blog/`.
* The `getPath.ts` utility helps in resolving the correct URL paths for posts, including those in subdirectories.

## Configuration

Most of the blog's behavior and appearance can be configured through the following files:

* **`astro.config.ts`:**
    * Astro integrations (sitemap, Tailwind CSS).
    * Markdown processing (remark plugins for Table of Contents, collapsing sections, Shiki syntax highlighting themes).
    * Vite-specific configurations.
    * Experimental Astro features.
* **`src/config.ts`:**
    * `SITE.website`: Your deployed domain.
    * `SITE.author`: Default author name.
    * `SITE.profile`: Link to author's profile.
    * `SITE.desc`: Site description.
    * `SITE.title`: Site title.
    * `SITE.ogImage`: Default OG image for the site.
    * `SITE.lightAndDarkMode`: Enable/disable theme toggling.
    * `SITE.postPerIndex`: Number of posts on the main blog index.
    * `SITE.postPerPage`: Number of posts per paginated page.
    * `SITE.scheduledPostMargin`: Margin for scheduled posts.
    * `SITE.showArchives`: Whether to show the archives page.
    * `SITE.showBackButton`: Show back button in post details.
    * `SITE.editPost`: Configuration for the "Suggest Changes" link (GitHub edit URL).
    * `SITE.dynamicOgImage`: Enable/disable dynamic OG image generation.
    * `SITE.lang`: HTML language code.
    * `SITE.timezone`: Default global timezone.
* **`src/constants.ts`:**
    * `SOCIALS`: Array of social media links with names, URLs, titles, and icons.
    * `SHARE_LINKS`: Array of social sharing links for posts.
* **`src/content.config.ts`:**
    * Defines the schema for blog post frontmatter using Zod for validation and type safety.
    * Specifies `BLOG_PATH` where Markdown content is located.
* **`tsconfig.json`:**
    * TypeScript compiler options, path aliases (`@/*` pointing to `./src/*`).
* **`tailwind.config.cjs` (Inferred, not explicitly provided but typical for Tailwind):**
    * Tailwind CSS theme customizations, plugins (like typography). (Note: `astro.config.ts` imports `@tailwindcss/vite`, implying Tailwind is used).

## Styling and Customization

* **Global Styles:** `src/styles/global.css` defines root CSS variables for theming (light/dark modes), base element styles, and utility classes.
* **Typography:** `src/styles/typography.css` configures the `@tailwindcss/typography` plugin for styling Markdown-generated HTML.
* **Theme Toggling:** `public/toggle-theme.js` handles the logic for switching between light and dark themes and persisting the user's preference in local storage.
* **Tailwind CSS:** Customize styling by modifying Tailwind classes in your Astro components and layouts, or by extending the Tailwind configuration.

## Utilities Overview

The `src/utils/` directory contains several helpful TypeScript modules:

* **`generateOgImages.ts`:** Uses `Resvg` and `satori` to convert SVG templates into PNG buffer for OG images.
    * `postOgImage.js` & `siteOgImage.js`: These are the actual Satori templates defining the look of the OG images.
* **`getPath.ts`:** Constructs the correct URL path for a blog post based on its ID and file path, handling subdirectories.
* **`getPostsByGroupCondition.ts`:** A generic function to group posts based on a provided condition/function.
* **`getPostsByTag.ts`:** Filters and sorts posts that include a specific tag.
* **`getSortedPosts.ts`:** Sorts posts, typically by modification or publication date, after applying filters.
* **`getUniqueTags.ts`:** Extracts a sorted list of unique tags (and their slugified versions) from all posts.
* **`loadGoogleFont.ts`:** Fetches Google Font files as ArrayBuffer, used for embedding fonts in dynamically generated OG images.
* **`postFilter.ts`:** Filters posts based on criteria like `draft` status and `pubDatetime` (for scheduled posts).
* **`slugify.ts`:** Uses `lodash.kebabcase` to convert strings into URL-friendly slugs.

## Deployment

While not explicitly detailed in a deployment-specific file, the setup is typical for Astro sites and can be easily deployed to platforms like:

* Cloudflare Pages (as suggested by the `Update.md` guide which details updating from an `astro-paper` template, often deployed this way)
* Vercel
* Netlify
* GitHub Pages

The build command is `pnpm build`, and the output directory is `dist/`.

## Updating the Blog (from AstroPaper Template)

The `Update.md` file provides a comprehensive guide for merging upstream changes from the `satnaing/astro-paper` template into your project. This involves:

1.  Fetching upstream changes.
2.  Creating/checking out an update branch.
3.  Ensuring a clean working directory (committing or stashing changes).
4.  Merging the template's main branch.
5.  Resolving conflicts.
6.  Re-applying stashed changes (if any).
7.  Installing dependencies and testing.
8.  Merging the update branch into your main branch.
9.  Pushing changes.

It also includes tips for conflict resolution and rolling back changes.

## Linting and Formatting

* **ESLint:** Configured in `eslint.config.js` for JavaScript/TypeScript linting, including Astro-specific rules.
* **Prettier:** Used for code formatting (inferred from `package.json` devDependencies like `prettier-plugin-astro` and `prettier-plugin-tailwindcss`).
* **Scripts:**
    * `pnpm lint`: Runs ESLint.
    * `pnpm format`: Formats code with Prettier.
    * `pnpm format:check`: Checks formatting with Prettier.

## Changelog

All notable changes to this project are documented in `CHANGELOG.md`. This project appears to follow [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## Contributing

While this is a personal blog, if you intend to open it up for contributions, consider adding a `CONTRIBUTING.md` file outlining how others can contribute. For now, follow conventional commit messages as suggested by `cz.yaml`.

---
