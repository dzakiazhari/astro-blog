---
title: Migration to Astro
author: Dzaki Azhari
description: How I migrated from Ghost to Astro.
pubDatetime: 2024-03-06T11:10:47Z
modDatetime: 2024-03-06T12:04:51Z
featured: true
draft: false
tags:
  - dev
---

## A quick heads up

**Hello**.

Good morning and happy day to you.

It is already 2024. It is closing to 18% of the current year, day is the sixty-sixth. Although I had my blog running since last year, I have not been able to post that much.

Initially, the blog resided on Ghost, a content management system (CMS) hosted on a digital press platform. While a suitable starting point, Ghost's limitations became apparent over time. The long-term vision demanded greater flexibility than its framework could offer.

Despite Ghost's robust features, I've always adhered to a "file-first" principle. My writing process begins with crafting drafts in Obsidian, allowing for deeper thought organization and control before transitioning to a publishing platform. This dedication to the file-first approach has even extended to content selection. Some planned blog posts, while valuable, wouldn't be a natural fit for a personal blog.

Therefore, I find myself at a crossroads, with a wellspring of ideas and a desire for a platform that aligns seamlessly with both my established workflow and the evolving nature of my content. In summary some of my problems are:

- CMS and hosting technical limitation
- Slower speed or minimal optimization
- Lack of flexibility for long term growth
- Limited content creation and mismatch
- Workflow friction on the current framework

Moving forward, some of my solutions are:

- **New platform:** Moving from Ghost to Astro for more flexibility and control
- **New hosting:** Switching to Cloudflare Pages for easier management, lower costs, and optimization
- **Separate [note website](https://notes.dzakiazhari.com):** Creating a dedicated space for in-depth content and notes
- **Streamlined workflow:** Integrating Obsidian for drafting and VScode for coding, all in one streamlined flow

## Setting up the basic ecosystem

This guide outlines the steps to establish a powerful blogging foundation using Astro, Cloudflare Pages, and Obsidian:

### Obsidian Setup

- Download and install [Obsidian - Sharpen your thinking](https://obsidian.md)
- Familiarize yourself with its note-taking and organization features

### Astro Project Setup

**Install Astro CLI:**

```bash
npm create astro@latest
```

**Alternatively use a starter template:**

```bash
# create a new project with an official examplenpm create

astro@latest -- --template <example-name>

# create a new project based on a GitHub repository’s main branch

npm create astro@latest -- --template <github-username>/<github-repo>
```

See [Install Astro with the Automatic CLI | Docs](https://docs.astro.build/en/install/auto/) for extensive setup.

### Cloudflare Pages Setup

1. **Create a Cloudflare Account:** [https://dash.cloudflare.com/](https://dash.cloudflare.com/)
2. **Set Up a Project and Domain:**
   - Follow Cloudflare's Pages documentation for setting up a project and connecting your custom domain (if desired) [https://developers.cloudflare.com/pages/](https://developers.cloudflare.com/pages/)
3. **Connect your Git Repository:**
   - Link your local Astro project's Git repository to your Cloudflare Pages project for automatic deployments.
4. Build the setup and set your repository on GitHub for dependable bot alerts and security alerts.

```yaml title="Build Preset"
Framework preset: Astro
Build command: npm run build
Output: /dist
```

### Connecting Obsidian and Astro

**Explore Plugins:**

- Install plugins like _markdown blogger_ seamless integration between Obsidian and Astro.
- Other useful plugins:
  - Templater
  - Update time on edit
  - Linter
  - Obsidian Cloudinary

Refer to the plugin's documentation for specific installation and configuration instructions.

An example of Templater plugin's YAML setup for Astro:

```yaml title="Templater Frontmatter"
---
author: Dzaki Azhari
title: <% tp.file.title %>
pubDatetime: <% tp.file.creation_date("YYYY-MM-DDTHH:mm:ssZ") %>
modDatetime: <% tp.file.last_modified_date("YYYY-MM-DDTHH:mm:ssZ") %>
slug: <% tp.file.title.split(" ").join("-").toLowerCase() %>
featured: <% tp.system.prompt("Is this featured? (true/false)", "") %>
draft: <% tp.system.prompt("Is this draft? (true/false)", "") %>
tags:
<%*
    let tags = await tp.system.prompt("Enter tags, comma separated", "")
    tags = tags.toLowerCase().split(",").map(val => `  - ${val}`).join("\n")
%><% tags %>
description: <% tp.system.prompt("Enter description", "") %>
---

```

### Testing and Deployment

1. **Run Astro development server:**

   ```bash
   npm run dev
   ```

   This opens your blog in a browser window for local testing.

2. **Deploy to Cloudflare Pages:**
   - Follow Cloudflare Pages' documentation for building and deploying your Astro project. [https://developers.cloudflare.com/pages/](https://developers.cloudflare.com/pages/)

Remember, this is just the first step! With this foundation, you can now craft and publish content seamlessly, leveraging the strengths of each platform. Happy blogging!

## Some perks of Astro and Cloudflare Pages

1. **Speed & Efficiency:** Astro's static HTML + Cloudflare's global network = lightning-fast blogs.
2. **Flexibility & Performance:** Astro's unique blend: dynamic content & customization without sacrificing speed.
3. **Effortless Scaling:** Cloudflare Pages scales seamlessly as the blog grows, handling increased traffic with ease.
4. **Cost-Effective:** Free tier for personal blogs & start-ups makes it an attractive option. The bandwidth is more lax compared to Vercel or Netlify.
5. **Developer and SEO Friendly:** Familiar & intuitive experience for those comfortable with web development. The template is built with SEO best practices.

Lastly, it also has multiple integrations with other CMS and multiple frameworks.

Well then, see you soon! Have a good day.
