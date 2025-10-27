---
title: Rebuilding Unfold on Astro Erudite
description: How the site moved from Astro Paper to Astro Erudite, why the frontmatter changed, and how Pages CMS now tracks the schema.
pubDatetime: 2025-01-20T09:00:00Z
modDatetime: 2025-01-21T04:30:00Z
tags:
  - dev
timezone: Asia/Tokyo
---

## 1) Why the switch

I moved this site from Astro Paper to Astro Erudite. Paper was fine, but the layouts and type didn’t match how I write or how my notes read. Erudite gives me tighter pages and built‑in subposts. I also aligned tokens so the blog and Quartz feel consistent.

## 2) Front matter

I kept only what I use.

- Required: `title`, `description`, `pubDatetime`, `tags`.
- Defaults: author falls back to `SITE.author`; add `authors` only when needed.
- For series: `order` keeps subposts in sequence; `parentSlug` lets me nest posts under a parent.

## 3) Pages CMS

The editor matches the schema and handles uploads and scheduling. When a post belongs to a series, adding a parent nests it automatically.

## 4) Related posts

- [Moving from Ghost to Astro](./migration-to-astro/)
- [Installing Expressive Code](./install-expressive-code-on-astro/)
- [Publishing a digital garden beside the blog](./publish-a-digital-garden-of-notes/)
- [Pages CMS for Astro and Quartz](./pages-cms-for-my-astro-blog-and-quartz/)

Related posts are collected under this entry.
