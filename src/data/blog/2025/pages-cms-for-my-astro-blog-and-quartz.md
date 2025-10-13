---
year: "2025"
slug: pages-cms-for-my-astro-blog-and-quartz-notes
title: Pages CMS for My Astro Blog and Quartz Notes
description: Step-by-step Pages CMS configuration for syncing Astro blog posts and Quartz notes.
author: Dzaki Azhari
pubDatetime: 2025-10-13T08:25:00Z
modDatetime: 2025-10-13T08:26:00Z
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

Pages CMS needs to know where to drop uploads. In the Astro project I created two media entries: one for post-specific screenshots and one for shared assets. They map back into the `public` directory so Astro can serve the files without extra glue.

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

The `input` value tells Pages CMS which folder in the repo should hold the raw file. The `output` value is the public URL that the Markdown editor will insert. With this mapping, when I upload a screenshot the CMS writes it to `public/images/uploads` and references it as `/images/uploads/example.png`.

## 3. Map the Astro collection

My blog posts live inside `src/data/blog`, grouped by year folders. The CMS collection reflects that layout. The `filename` pattern keeps the year folder plus a slug, which mirrors how `src/utils/getPath.ts` builds URLs at runtime. I also set the tree view to show the title, publish date, and tags so I can scan the archive quickly.

```yaml
content:
  - name: blog
    label: Blog Posts
    path: src/data/blog
    filename: "{{year}}/{{slug}}.md"
    exclude:
      - "**/_*/**"
    subfolders: true

    view:
      layout: tree
      primary: title
      fields: [title, pubDatetime, tags]
      sort: ["pubDatetime desc", "title asc"]
      search: [title, description, tags]
      default:
        sort: pubDatetime
        order: desc
```

The `exclude` rule hides helper folders that start with an underscore, which matches the way the Astro content loader skips drafts. Turning on `subfolders` keeps my yearly archive visible in the sidebar.

## 4. Mirror the Astro front matter schema

Every field in the CMS corresponds to a field in `src/content.config.ts`. I split the inputs into three groups so new posts always come out clean:

1. **Path helpers** for the year and slug.
2. **Required metadata** such as title, description, author, publish time, and tags.
3. **Optional toggles** like `featured`, `draft`, `ogImage`, `canonicalURL`, and `timezone`.

Here’s a shortened version of the field block:

```yaml
fields:
  - name: year
    type: select
    default: "2025"
    options:
      creatable: true
      values:
        - { label: "2024", value: "2024" }
        - { label: "2025", value: "2025" }
  - name: slug
    type: string
    pattern:
      regex: "^[a-z0-9]+(?:-[a-z0-9]+)*$"
  - name: title
    type: string
  - name: description
    type: text
  - name: author
    type: select
    default: "Dzaki Azhari"
  - name: pubDatetime
    type: date
    options: { time: true, format: "yyyy-MM-dd'T'HH:mm:ss'Z'" }
  - name: draft
    type: boolean
    default: false
  - name: tags
    type: select
    options:
      multiple: true
      creatable: true
  - name: ogImage
    type: image
  - name: body
    type: markdown
```

This list covers the core Astro front matter. Pages CMS writes exactly the fields that the Zod schema expects, so `pnpm run build` continues to succeed even when I add entries entirely through the browser.

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
    path: src/data/blog
    filename: "{{year}}/{{slug}}.md"
    exclude:
      - "**/_*/**"
    subfolders: true

    view:
      layout: tree
      primary: title
      fields: [title, pubDatetime, tags]
      sort: ["pubDatetime desc", "title asc"]
      search: [title, description, tags]
      default:
        sort: pubDatetime
        order: desc

    fields:
      - name: year
        label: Year folder
        type: select
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
        pattern:
          regex: "^[a-z0-9]+(?:-[a-z0-9]+)*$"
          message: "Use lowercase words separated by hyphens without the .md extension."
      - name: title
        label: Title
        type: string
      - name: description
        label: Description
        type: text
      - name: author
        label: Author
        type: select
        default: "Dzaki Azhari"
      - name: pubDatetime
        label: Publish date & time
        type: date
        options: { time: true, format: "yyyy-MM-dd'T'HH:mm:ss'Z'" }
      - name: modDatetime
        label: Last modified
        type: date
        options: { time: true, format: "yyyy-MM-dd'T'HH:mm:ss'Z'" }
        required: false
      - name: featured
        label: Featured
        type: boolean
        default: false
      - name: draft
        label: Draft
        type: boolean
        default: false
      - name: tags
        label: Tags
        type: select
        default: ["others"]
        options:
          multiple: true
          creatable: true
          values:
            - { label: "dev", value: "dev" }
            - { label: "blog", value: "blog" }
            - { label: "garden", value: "garden" }
            - { label: "life", value: "life" }
            - { label: "productivity", value: "productivity" }
            - { label: "notes", value: "notes" }
            - { label: "others", value: "others" }
      - name: ogImage
        label: OG image
        type: image
      - name: canonicalURL
        label: Canonical URL
        type: string
        required: false
      - name: hideEditPost
        label: Hide "Suggest Changes"
        type: boolean
        default: false
      - name: timezone
        label: Timezone
        type: string
        default: "Asia/Tokyo"
      - name: body
        label: Body
        type: markdown
```

### Quartz `.pages.yml`

```yaml
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
        description: "Primary heading shown in Quartz. Begin with the Johnny.Decimal code (e.g. 21.03 Symbol and Punctuation)."
      - name: description
        label: Description
        type: text
        description: "One or two sentences to surface in search previews and link unfurls."
      - name: tags
        label: Tags
        type: string
        list: true
        description: "Topics that power Quartz search, the graph view, and Pages CMS filters. Press Enter after each tag."
      - name: aliases
        label: Aliases
        type: string
        list: true
        description: "Alternate names or translations so Quartz resolves wikilinks correctly."
      - name: draft
        label: Draft
        type: boolean
        description: "Leave enabled while notes are in progress. Quartz hides drafted notes from publish and RSS feeds."
      - name: publish
        label: Publish
        type: boolean
        description: "Set true once the note is ready to ship. Quartz uses this to decide whether to render the page."
      - name: share
        label: Share
        type: boolean
        description: "Toggle to allow Quartz to include the note in shared and embed contexts."
      - name: "dg-home"
        label: "Digital Garden · Home"
        type: boolean
        description: "Pin this note to the Quartz home layout."
      - name: "dg-publish"
        label: "Digital Garden · Publish"
        type: boolean
        description: "Mirror of Quartz's publish toggle for compatibility with upstream tooling."
      - name: "dg-pinned"
        label: "Digital Garden · Pinned"
        type: boolean
        description: "Keeps the note at the top of the explorer sidebar."
      - name: "dg-hide"
        label: "Digital Garden · Hidden Sections"
        type: string
        list: true
        description: "Hide specific explorer sections (by heading slug) from rendering."
      - name: "dg-hide-in-graph"
        label: "Digital Garden · Hide in Graph"
        type: boolean
        description: "Exclude the note from the Quartz graph view."
      - name: "dg-enable-search"
        label: "Digital Garden · Enable Search"
        type: boolean
        description: "Force-enable Quartz search for this note if it is disabled globally."
      - name: "dg-permalink"
        label: "Digital Garden · Permalink"
        type: string
        description: "Optional slug override for Quartz permalinks."
      - name: "dg-show-toc"
        label: "Digital Garden · Show Table of Contents"
        type: boolean
        description: "Toggle the Quartz table of contents per note."
      - name: password
        label: Password
        type: string
        description: "Optional staticryption password. Leave blank unless you intend to protect the note."
      - name: date
        label: Date
        type: datetime
        description: "Last edited date. Quartz uses this for ordering lists and RSS feeds."
      - name: created
        label: Created
        type: datetime
        description: "Original creation timestamp for reference."
      - name: body
        label: Body
        type: markdown
        description: "Markdown content of the note. Match the heading with the Johnny.Decimal title for consistency."
        ui:
          format: github

  # Folder-based collections
  - name: home-notes
    label: Home Notes
    description: "Johnny.Decimal 01–09: Home base, Meta docs, and Inbox processing."
    type: collection
    path: content/Home
    match: "**/*.md"
    filename: "{primary}.md"
    subfolders: true
    view: &collection_view
      layout: tree
      primary: title
      fields: [title, tags, date, draft]
      sort: ["title"]
      search: [title, tags]
    fields: *page_fields

  - name: language-lab
    label: Language Lab
    description: "Johnny.Decimal 21–29: language study notes, practice logs, and references."
    type: collection
    path: content/Language Lab
    match: "**/*.md"
    filename: "{primary}.md"
    subfolders: true
    view: *collection_view
    fields: *page_fields

  - name: finbiz-hub
    label: Finbiz Hub
    description: "Johnny.Decimal 31–39: business intelligence decks, market analysis, and storyboards."
    type: collection
    path: content/Finbiz Hub
    match: "**/*.md"
    filename: "{primary}.md"
    subfolders: true
    view: *collection_view
    fields: *page_fields

  - name: living-chronicles
    label: Living Chronicles
    description: "Johnny.Decimal 41–49: personal chronicle entries and relocation journals."
    type: collection
    path: content/Living Chronicles
    match: "**/*.md"
    filename: "{primary}.md"
    subfolders: true
    view: *collection_view
    fields: *page_fields

  - name: references
    label: References
    description: "Johnny.Decimal 51–59: media logs, songs, and bibliographies."
    type: collection
    path: content/References
    match: "**/*.md"
    filename: "{primary}.md"
    subfolders: true
    view: *collection_view
    fields: *page_fields
# Settings (optional): hide the Settings page in the CMS for simplicity
#settings:
#  hide: true
```

---

## 5. Configure Quartz media and layout

My Quartz project keeps note assets inside `static/uploads`, so the Pages CMS config there defines a single media bucket that points to that folder. Because Quartz publishes the `static` directory, the CMS output path is `/uploads`. The collection uses `content` as the path, matching the folder Obsidian syncs into.

```yaml
media:
  - name: note-assets
    label: Note assets
    input: static/uploads
    output: /uploads

content:
  - name: notes
    label: Notes
    path: content
    filename: "{{slug}}.md"
    subfolders: true
```

The Quartz tree view is simpler than the Astro one because I manage thousands of notes. I keep the sidebar in list mode and rely on the folder structure to keep context.

## 6. Mirror Quartz front matter

Quartz relies on a handful of boolean switches that control publishing, sharing, and note status. I expose them as checkboxes so the CMS writes valid YAML every time. I also keep tags and aliases as multi-select lists because Quartz uses them for backlinks and display names.

```yaml
fields:
  - name: slug
    type: string
    pattern:
      regex: "^[a-z0-9]+(?:-[a-z0-9]+)*$"
  - name: title
    type: string
    required: false
  - name: publish
    type: boolean
    default: false
  - name: share
    type: boolean
    default: false
  - name: draft
    type: boolean
    default: false
  - name: tags
    type: list
    of: string
  - name: aliases
    type: list
    of: string
  - name: body
    type: markdown
```

When I flip `publish` to true, the Quartz deployment workflow picks up the note during the next sync. Leaving `draft` true keeps the note local even if `publish` was ticked accidentally.

## 7. Connect the repos to Pages CMS

Once both `.pages.yml` files are committed, I open the Pages CMS dashboard and add each repository. The flow is the same for both projects:

1. Authorize GitHub and select the repository.
2. Choose the branch (I stick with `main`).
3. Confirm the [Pages CMS](https://app.pagescms.org) sees the collection. The Astro repo shows the yearly archive tree, while the Quartz repo shows the note folders.
4. Test a dry run by creating a draft entry, filling the required fields, and saving. Pages CMS opens a pull request containing the new Markdown file.

After that, I can write from anywhere. The CMS fills the front matter for me, keeps uploads in the right folders, and never breaks the schema that the projects rely on.
