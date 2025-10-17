---
year: "2025"
slug: pages-cms-for-my-astro-blog-and-quartz-notes
title: Pages CMS for My Astro Blog and Quartz Notes
description: Step-by-step Pages CMS configuration for syncing Astro blog posts and Quartz notes.
author: Dzaki Azhari
pubDatetime: 2025-10-13T17:25:00Z
modDatetime: 2025-10-14T02:00:00Z
featured: true
draft: false
tags:
  - dev
hideEditPost: false
timezone: Asia/Tokyo
---

## 1. Get the repos ready

I keep two git projects side by side: `astro-blog` for the main site and `private-quartz` for the evergreen notes. Pages CMS reads files straight from the repository, so all I need locally is the repo on disk and a `.pages.yml` file in the root. I commit the config once and let [Pages CMS](https://pagescms.org/docs/) generate commits when I publish content.

## 2. Configure media buckets for the Astro blog

Pages CMS needs to know where to drop uploads. In the Astro project I keep two buckets—`uploads` for post-specific screenshots and `site-assets` for shared icons and downloads. Both point back into `public/` so Astro can serve files without extra glue, and the config now includes categories and inline descriptions that mirror the Pages CMS docs.

```yaml
media:
  - name: uploads
    label: Post assets
    input: public/images/uploads
    output: /images/uploads
    categories: [image, document]
  - name: site-assets
    label: Site assets
    input: public/assets
    output: /assets
    categories: [image, code, document]
```

The `input` value tells Pages CMS which folder in the repo should hold the raw file. The `output` value is the public URL that the Markdown editor will insert. With this mapping, uploads land in `public/images/uploads` and resolve as `/images/uploads/example.png`, matching the recommended media flow from the documentation.

## 3. Map the Astro collection with field templating

My blog posts live inside `src/data/blog`, grouped by year folders. The CMS collection reflects that layout and now uses the recommended `{{fields.*}}` templating so Pages CMS understands how to build paths directly from user input. I also expand the `exclude` list to hide `_drafts` folders whether they’re files or directories.

```yaml
content:
  - name: blog
    label: Blog Posts
    description: "Long-form stories that surface on dzakiazhari.com. Paths and metadata map directly to src/content.config.ts."
    type: collection
    path: src/data/blog
    filename: "{{fields.year}}/{{fields.slug}}.md"
    exclude:
      - "**/_*/**"
      - "**/_*"
    subfolders: true

    view:
      layout: tree
      primary: title
      fields: [title, pubDatetime, tags, draft]
      sort: ["pubDatetime desc", "title asc"]
      search: [title, description, tags]
      default:
        sort: pubDatetime
        order: desc
```

The tree view now highlights the draft state so I can spot unpublished work instantly. Using `{{fields.year}}` and `{{fields.slug}}` keeps the saved path aligned with `src/utils/getPath.ts` without relying on implicit collection values.

## 4. Mirror the Astro front matter schema (docs-aligned)

Every field in the CMS corresponds to a field in `src/content.config.ts`. Following the Pages CMS guides, I grouped inputs by intent, added helper descriptions, and tightened validation so the editor prevents malformed front matter.

1. **Path controls** for the year and slug (select + regex pattern).
2. **Required metadata** with labels, length hints, and `required: true` flags.
3. **Optional toggles** that map to booleans, URLs, or uploads.

Here’s a representative slice of the field block:

```yaml
fields:
  - name: year
    label: Year folder
    type: select
    description: "Creates the folder segment under src/data/blog/{year}."
    default: "2025"
    options:
      placeholder: "Choose a year"
      creatable: true
      values:
        - { label: "2023", value: "2023" }
        - { label: "2024", value: "2024" }
        - { label: "2025", value: "2025" }
  - name: slug
    label: Slug (filename)
    type: string
    description: "Lowercase with hyphens only. The CMS writes {slug}.md under the chosen year."
    required: true
    pattern:
      regex: "^[a-z0-9]+(?:-[a-z0-9]+)*$"
      message: "Use lowercase words separated by hyphens without the .md extension."
  - name: description
    label: Description
    type: text
    description: "Short summary for cards, RSS, and SEO meta tags."
    required: true
    options:
      maxlength: 180
  - name: tags
    label: Tags
    type: select
    default: ["others"]
    options:
      multiple: true
      creatable: true
      placeholder: "Add topics like dev, blog, garden"
  - name: ogImage
    label: OG image
    type: image
    options:
      media: uploads
  - name: canonicalURL
    label: Canonical URL
    type: string
    pattern:
      regex: "^(https?:\\/\\/)([^\s]+)$"
```

This higher-fidelity schema keeps Pages CMS aligned with the Astro Zod schema while leveraging the UI affordances—placeholders, regex messaging, and media bucket defaults—highlighted in the documentation. I’ve yet to hit a validation error after the refresh.

---

## Full Config Examples

Below are the **complete `.pages.yml` configurations** for both Astro and Quartz projects for reference.

### Astro `.pages.yml`

```yaml
# .pages.yml

media:
  - name: uploads
    label: Post assets
    input: public/images/uploads
    output: /images/uploads
    categories: [image, document]
  - name: site-assets
    label: Site assets
    input: public/assets
    output: /assets
    categories: [image, code, document]

content:
  - name: blog
    label: Blog Posts
    description: "Long-form stories that surface on dzakiazhari.com. Paths and metadata map directly to src/content.config.ts."
    type: collection
    # Keep this path aligned with BLOG_PATH in src/utils/blogPath.ts and getPath() expectations
    path: src/data/blog
    # Nested directories are slugified by src/utils/getPath.ts, so the CMS only needs the final segment here
    # Pages CMS uses moustache-style templating for field values.
    filename: "{{fields.year}}/{{fields.slug}}.md"
    exclude:
      - "**/_*/**"
      - "**/_*"
    subfolders: true

    view:
      layout: tree
      primary: title
      # Show the post title in the list, with date and tags alongside
      fields: [ title, pubDatetime, tags, draft ]
      sort: [ "pubDatetime desc", "title asc" ]
      search: [ title, description, tags ]
      default:
        sort: pubDatetime
        order: desc

    fields:
      # --- path controls ---
      - name: year
        label: Year folder
        type: select
        description: "Creates the folder segment under src/data/blog/{year}."
        default: "2025"
        options:
          placeholder: "Choose a year"
          creatable: true
          values:
            - { label: "2023", value: "2023" }
            - { label: "2024", value: "2024" }
            - { label: "2025", value: "2025" }
            - { label: "2026", value: "2026" }
            - { label: "2027", value: "2027" }
            - { label: "2028", value: "2028" }
            - { label: "2029", value: "2029" }
            - { label: "2030", value: "2030" }

      - name: slug
        label: Slug (filename)
        type: string
        description: "Lowercase with hyphens only. The CMS writes {slug}.md under the chosen year."
        required: true
        pattern:
          regex: "^[a-z0-9]+(?:-[a-z0-9]+)*$"
          message: "Use lowercase words separated by hyphens without the .md extension."

      # --- frontmatter (matches Astro schema) ---
      - name: title
        label: Title
        type: string
        description: "Displayed as the page <h1> and the document title tag."
        required: true

      - name: description
        label: Description
        type: text
        description: "Short summary for cards, RSS, and SEO meta tags."
        required: true
        options:
          maxlength: 180

      - name: author
        label: Author
        type: select
        default: "Dzaki Azhari"
        options:
          creatable: true
          placeholder: "Select or type an author"
          values:
            - { label: "Dzaki Azhari", value: "Dzaki Azhari" }

      - name: pubDatetime
        label: Publish date & time
        type: date
        options: { time: true, format: "yyyy-MM-dd'T'HH:mm:ss'Z'" }
        description: "Posts remain hidden until this timestamp (with a 15-minute grace window)."
        required: true

      - name: modDatetime
        label: Last modified
        type: date
        options: { time: true, format: "yyyy-MM-dd'T'HH:mm:ss'Z'" }
        required: false
        description: "Optional edit timestamp for changelog banners and structured data."

      - name: featured
        label: Featured
        type: boolean
        default: false
        description: "Mark true to pin on the homepage hero strip."

      - name: draft
        label: Draft
        type: boolean
        default: false
        description: "Drafts stay local and are excluded from builds and the RSS feed."

      - name: tags
        label: Tags
        type: select
        default: [ "others" ]
        options:
          multiple: true
          creatable: true
          placeholder: "Add topics like dev, blog, garden"
          values:
            - { label: "dev", value: "dev" }
            - { label: "blog", value: "blog" }
            - { label: "garden", value: "garden" }
            - { label: "life", value: "life" }
            - { label: "productivity", value: "productivity" }
            - { label: "notes", value: "notes" }
            - { label: "others", value: "others" }
        description: "Multi-select tags surface related content chips and search facets."

      # optionals
      - name: ogImage
        label: OG image
        type: image
        required: false
        description: "Uploads to /public/images/uploads. Leave blank to auto-generate dynamic OG art."
        options:
          media: uploads

      - name: canonicalURL
        label: Canonical URL
        type: string
        required: false
        description: "Use for cross-posts hosted elsewhere."
        pattern:
          regex: "^(https?:\\/\\/)([^\s]+)$"
          message: "Use an absolute URL starting with http:// or https://"

      - name: hideEditPost
        label: Hide "Suggest Changes"
        type: boolean
        default: false
        description: "Toggle if a post should hide the GitHub edit link."

      - name: timezone
        label: Timezone
        type: string
        default: "Asia/Tokyo"
        description: "Overrides the global SITE.timezone for posts written elsewhere."

      # body
      - name: body
        label: Body
        type: markdown
        description: 'Write in Markdown. Supports callouts, code fences with file="" metadata, and remark-collapse toggles.'
```

### Quartz `.pages.yml`

```yaml
# Pages CMS configuration for this Quartz site

media:
  - name: note-assets
    label: Note assets
    input: static/uploads
    output: /uploads

content:
  - name: home
    label: Home Page
    type: file
    path: content/index.md
    fields: &page_fields
      - name: title
        label: Title
        type: string
        description: "Primary heading shown in Quartz. Begin with the Johnny.Decimal code (e.g. 21.03 Symbol and Punctuation)."
        required: true
      - name: description
        label: Description
        type: text
        description: "One or two sentences to surface in search previews and link unfurls."
      - name: tags
        label: Tags
        type: list
        of: string
        description: "Topics that power Quartz search, the graph view, and Pages CMS filters. Press Enter after each tag."
      - name: aliases
        label: Aliases
        type: list
        of: string
        description: "Alternate names or translations so Quartz resolves wikilinks correctly."
      - name: publish
        label: Publish
        type: boolean
        default: false
        description: "Enable once the note is ready to ship. Quartz uses this to decide whether to render the page."
      - name: share
        label: Share
        type: boolean
        default: false
        description: "Allow Quartz to include the note in shared and embed contexts."
      - name: draft
        label: Draft
        type: boolean
        default: false
        description: "Keep enabled while notes are in progress so they stay local."
      - name: "dg-home"
        label: "Digital Garden · Home"
        type: boolean
      - name: "dg-publish"
        label: "Digital Garden · Publish"
        type: boolean
      - name: "dg-pinned"
        label: "Digital Garden · Pinned"
        type: boolean
      - name: "dg-hide"
        label: "Digital Garden · Hidden Sections"
        type: list
        of: string
      - name: "dg-hide-in-graph"
        label: "Digital Garden · Hide in Graph"
        type: boolean
      - name: "dg-enable-search"
        label: "Digital Garden · Enable Search"
        type: boolean
      - name: "dg-permalink"
        label: "Digital Garden · Permalink"
        type: string
      - name: "dg-show-toc"
        label: "Digital Garden · Show Table of Contents"
        type: boolean
      - name: password
        label: Password
        type: string
      - name: date
        label: Date
        type: datetime
      - name: created
        label: Created
        type: datetime
      - name: body
        label: Body
        type: markdown
        ui:
          format: github

  - name: garden
    label: Garden Notes
    description: "Johnny.Decimal collections mirrored from Obsidian."
    type: collection
    path: content
    match: "**/*.md"
    filename: "{primary}.md"
    subfolders: true
    view:
      layout: tree
      primary: title
      fields: [title, tags, date, draft]
      sort: ["title"]
      search: [title, tags]
    fields: *page_fields
```

---

## 5. Configure Quartz media and layout

My Quartz project keeps note assets inside `static/uploads`, so the Pages CMS config defines a single media bucket tied to that folder. Because Quartz publishes the `static` directory, the CMS output path is `/uploads`. The collection now relies on a single tree view, anchored by the reusable `&page_fields` block, so every Johnny.Decimal folder inherits the same metadata requirements without duplication.

The updated field definitions also switch to the `type: list` syntax that Pages CMS recommends and mark the most important fields (`title`, `publish`, `draft`) as required or defaulted, which makes the editor guard against accidental public pushes.

## 6. Mirror Quartz front matter

Quartz relies on a handful of boolean switches that control publishing, sharing, and note status. I expose them as checkboxes so the CMS writes valid YAML every time. I also keep tags and aliases as list inputs because Quartz uses them for backlinks and display names.

When I flip `publish` to true, the Quartz deployment workflow picks up the note during the next sync. Leaving `draft` true keeps the note local even if `publish` was ticked accidentally.

## 7. Connect the repos to Pages CMS

Once both `.pages.yml` files are committed, I open the Pages CMS dashboard and add each repository. The flow is the same for both projects:

1. Authorize GitHub and select the repository.
2. Choose the branch (I stick with `main`).
3. Confirm the [Pages CMS](https://app.pagescms.org) sees the collection. The Astro repo shows the yearly archive tree, while the Quartz repo shows the note folders.
4. Test a dry run by creating a draft entry, filling the required fields, and saving. Pages CMS opens a pull request containing the new Markdown file.

After that, I can write from anywhere. The CMS fills the front matter for me, keeps uploads in the right folders, and never breaks the schema that the projects rely on.
