---
title: Pages CMS for My Astro Blog and Quartz Notes
description: Step-by-step Pages CMS configuration for syncing Astro blog posts
  and Quartz notes.
author: Dzaki Azhari
pubDatetime: 2025-10-13T17:25:00Z
modDatetime: 2025-10-14T05:00:00Z
featured: true
draft: false
tags:
  - dev
canonicalURL: https://dzakiazhari.com/posts/2025/pages-cms-for-my-astro-blog-and-quartz-notes/
timezone: Asia/Tokyo
---

## Table of Contents

## 1. Get the repos ready

I keep two git projects side by side: `astro-blog` for the main site and `private-quartz` for the evergreen notes. Pages CMS reads files straight from the repository, so all I need locally is the repo on disk and a `.pages.yml` file in the root. I commit the config once and let [Pages CMS](https://pagescms.org/docs/) generate commits when I publish content.

## 2. Configure media buckets for the Astro blog

Pages CMS needs to know where to drop uploads. In the Astro project I keep two buckets: `uploads` for post screenshots and `site-assets` for icons, downloads, and anything that might be reused. Both point back into `public/` so Astro can serve files without extra glue, and the config now mirrors the language that Pages CMS uses in its docs.

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

The `input` value tells Pages CMS which folder in the repo should hold the raw file. The `output` value is the public URL that the Markdown editor will insert. With this mapping, uploads land in `public/images/uploads` and resolve as `/images/uploads/example.png`, which lines up with how the docs recommend handling media.

## 3. Map the Astro collection with field templating

My blog posts live inside `src/data/blog`, grouped by year folders. The CMS collection reflects that layout and now uses the `{{fields.*}}` templating so Pages CMS builds paths straight from whatever I type into the form. I also expanded the `exclude` list to hide `_drafts` folders whether they’re files or directories.

```yaml
content:
  - name: blog
    label: Blog Posts
    description: 'Long-form stories that surface on dzakiazhari.com. Paths and metadata map directly to src/content.config.ts.'
    type: collection
    path: src/data/blog
    filename: '{{fields.year}}/{{fields.slug}}.md'
    exclude:
      - '**/_*/**'
      - '**/_*'
    subfolders: true

    view:
      layout: tree
      primary: title
      fields: [title, pubDatetime, tags, draft]
      sort: ['pubDatetime desc', 'title asc']
      search: [title, description, tags]
      default:
        sort: pubDatetime
        order: desc
```

The tree view highlights the draft state so I can spot unpublished work instantly. Using `{{fields.year}}` and `{{fields.slug}}` keeps the saved path aligned with `src/utils/getPath.ts` without relying on implicit collection values.

## 4. Mirror the Astro front matter schema (docs-aligned)

Every field in the CMS corresponds to a field in `src/content.config.ts`. After re-reading the Pages CMS guides I grouped inputs by intent, added helper descriptions, and tightened validation so the editor blocks malformed front matter before it hits git.

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

The updated schema keeps Pages CMS aligned with the Astro Zod rules while leaning on the nicer UI touches from the documentation. Placeholders, regex messages, and media bucket defaults all kick in at the right moments, and so far I haven’t hit a validation error after the refresh.

---

## Full Config Examples

Below are the **complete `.pages.yml` configurations** for both Astro and Quartz projects for reference.

### Astro

```yaml title=".pages.yml"
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

### Quartz

```yaml title=".pages.yml"
# Pages CMS configuration for this Quartz site

# Where media files are stored and how they resolve in the built site
# Using the content folder keeps images co-located with notes.
media:
  - name: content
    label: Content Media
    input: content
    output: /

# Shared field definitions for garden notes. Update descriptions when adding new metadata.
content:
  # Home page (single file)
  - name: home
    label: Home Page
    type: file
    path: content/index.md
    fields: &page_fields
      - name: title
        label: Title
        type: string
        description: 'Primary heading shown in Quartz. Begin with the Johnny.Decimal code (e.g. 21.03 Symbol and Punctuation).'
      - name: description
        label: Description
        type: text
        description: 'One or two sentences to surface in search previews and link unfurls.'
      - name: tags
        label: Tags
        type: string
        list: true
        description: 'Topics that power Quartz search, the graph view, and Pages CMS filters. Press Enter after each tag.'
      - name: cssclasses
        label: CSS classes
        type: string
        list: true
        description: 'Optional Quartz class names (e.g. cards) for bespoke styling hooks.'
      - name: aliases
        label: Aliases
        type: string
        list: true
        description: 'Alternate names or translations so Quartz resolves wikilinks correctly.'
      - name: draft
        label: Draft
        type: boolean
        default: false
        description: 'Leave enabled while notes are in progress. Quartz hides drafted notes from publish and RSS feeds.'
      - name: permalink
        label: Permalink
        type: string
        description: 'Optional slug override for Quartz permalinks (e.g. index, meta, disclaimer).'
      - name: enableToc
        label: Show table of contents
        type: boolean
        description: 'Disable when a page should hide the Quartz table of contents.'
      - name: password
        label: Password
        type: string
        description: 'Optional staticryption password. Leave blank unless you intend to protect the note.'
      - name: created
        label: Created
        type: date
        description: 'Original creation timestamp in Japan Standard Time (UTC+09:00).'
        options: &timestamp_options
          time: true
          step: 1
          format: "yyyy-MM-dd'T'HH:mm:ss'+09:00'"
      - name: updated
        label: Updated
        type: date
        description: 'Last updated timestamp in Japan Standard Time (UTC+09:00).'
        options: *timestamp_options
      - name: body
        label: Body
        type: markdown
        description: 'Markdown content of the note. Match the heading with the Johnny.Decimal title for consistency.'
        ui:
          format: github

  # Folder-based collections
  - name: home-notes
    label: Home Notes
    description: 'Johnny.Decimal 01–09: Home base, Meta docs, and Inbox processing.'
    type: collection
    path: content/Home
    match: '**/*.md'
    filename: '{primary}.md'
    subfolders: true
    view: &collection_view
      layout: tree
      primary: title
      fields: [title, tags, updated, draft]
      sort: ['title']
      search: [title, tags]
    fields: *page_fields

  - name: language-lab
    label: Language Lab
    description: 'Johnny.Decimal 21–29: language study notes, practice logs, and references.'
    type: collection
    path: content/Language Lab
    match: '**/*.md'
    filename: '{primary}.md'
    subfolders: true
    view: *collection_view
    fields: *page_fields

  - name: finbiz-hub
    label: Finbiz Hub
    description: 'Johnny.Decimal 31–39: business intelligence decks, market analysis, and storyboards.'
    type: collection
    path: content/Finbiz Hub
    match: '**/*.md'
    filename: '{primary}.md'
    subfolders: true
    view: *collection_view
    fields: *page_fields

  - name: living-chronicles
    label: Living Chronicles
    description: 'Johnny.Decimal 41–49: personal chronicle entries and relocation journals.'
    type: collection
    path: content/Living Chronicles
    match: '**/*.md'
    filename: '{primary}.md'
    subfolders: true
    view: *collection_view
    fields: *page_fields

  - name: references
    label: References
    description: 'Johnny.Decimal 51–59: media logs, songs, and bibliographies.'
    type: collection
    path: content/References
    match: '**/*.md'
    filename: '{primary}.md'
    subfolders: true
    view: *collection_view
    fields: *page_fields

# Settings (optional): hide the Settings page in the CMS for simplicity
settings:
  hide: false
```

---

## 5. Configure Quartz media and layout

My Quartz project keeps note assets inside `static/uploads`, so the Pages CMS config defines a single media bucket tied to that folder. Because Quartz publishes the `static` directory, the CMS output path is `/uploads`. The collection now relies on a single tree view anchored by the reusable `&page_fields` block, so every Johnny.Decimal folder inherits the same metadata requirements without duplication.

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
