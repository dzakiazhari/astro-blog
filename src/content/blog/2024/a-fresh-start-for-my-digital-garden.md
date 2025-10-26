---
title: A Fresh Start for My Digital Garden
author: Dzaki Azhari
description: Migrating my notes to Quartz.
pubDatetime: 2024-03-19T14:51:46Z
modDatetime: 2024-03-19T08:57:10Z
draft: false
tags:
  - dev
---

## Introduction

**Hello.**

Good morning and happy day to you.

I've been an avid user of [Obsidian Digital Garden](https://dg-docs.ole.dev), hosted on Cloudflare. It provided an easy-to-publish platform, serving as a fantastic alternative to Obsidian Publish. One of the things I appreciated most was its ability to accommodate Obsidian theme customization, making it effortless for non-developers. Plus, it offered native support for Obsidian plugins, which made it even more appealing.

Obsidian Publish is a popular platform for creating and sharing knowledge gardens. However, several alternatives are worth considering for those looking for different features or customization options. Some notable alternatives include:

1. **Obsidian Digital Garden**: Based on Eleventy, Obsidian Digital Garden offers a user-friendly interface and native support for themes and plugins.
2. **Flowershow**: A variation of Obsidian Digital Garden, Flowershow provides a visually appealing default interface with fewer customization options, making it a great choice for users who prefer simplicity.
3. **Perlite**: Perlite is a web-based platform with an interface that closely resembles Obsidian, often more so than Obsidian Publish itself. This platform may be appealing to users who seek a familiar environment for content management and organization.
4. **Quartz**: Quartz offers a visually pleasing default theme and extensive customization options, friendly for local development.

There are many other alternatives based on markdown-publishing platforms such as MkDocs, Retype, and Docusaurus, or other static-site generator.

## Quartz

For me, the most significant limitation of Obsidian Digital Garden was the lack of local development options and customization capabilities. While technically possible, Quartz provides a more streamlined experience for both aspects. If you prefer not to spend time customizing your site, Obsidian Digital Garden remains a solid choice.

Quartz has allowed me to manage and organize my content more effectively. One of its most appealing features is its user-friendly interface, making navigation seamless and enjoyable.

## Installation

For starting please see the documentation of [Quartz](https://quartz.jzhao.xyz).

1. Clone the repository

```bash
git clone https://github.com/jackyzha0/quartz.git
cd quartz
npm i
npx quartz create
```

Alternatively you could go to the repository and select the option to "Use this template", then name it to your preferable choice.

2. Build and customize locally

```bash
npx quartz build --serve
```

## Writing Content

Once your Quartz project is set up, the next step is to populate it with your content. To do this, create Markdown files within the `content` directory. Each file should include a front matter section at the beginning, containing metadata such as the title, author, date, and other relevant details.

A homepage is created based on your `index.md` inside the `content` directory. Here's an example of a markdown file with a front matter section:

```yaml title="index.md"
tags:
aliases:
title: Home
draft: false
publish: true
share: true
created:
date:
```

Quartz natively supports several common frontmatter fields, including:

- **title**: The page title. If not provided, Quartz defaults to the file name.
- **description**: A brief description of the page used for link previews.
- **aliases**: Alternative names for the note.
- **tags**: Tags associated with the note.
- **draft**: Specifies whether the page should be published or not, useful for making pages private.
- **date**: A string representing the date the note was published, typically in YYYY-MM-DD format.

Since I'm moving from Digital Garden to Quartz, I need to include three basic front matter fields:

- **draft**: Determines whether the note should be published (false for public, true for draft/private).
- **share**: Required for sharing options, particularly when using plugins like [Github Publisher](https://obsidian-publisher.netlify.app/).
- **publish**: Similar to share, but specifically for the [Quartz Syncer](https://github.com/saberzero1/quartz-syncer) plugin.

In a way it is a bit of hassle, you should not directly write markdown contents to your `content` folder. Instead, use either Github Publisher or Quartz Syncer to manage and publish your Markdown files to the directory. Since Quartz doesn't natively support Dataview, both plugins are useful for linting and publishing your content. In short you will need it for: publishing, content management, fix mdlinks-wikilinks, fix dataview render, and so on.

Here's an example of my Publisher option:

```json title="Github Publisher Options"
{
  "github": {
    "branch": "v4",
    "automaticallyMergePR": true,
    "dryRun": {
      "enable": false,
      "folderName": "github-publisher"
    },
    "tokenPath": "%configDir%/plugins/%pluginID%/env",
    "api": {
      "tiersForApi": "Github Free/Pro/Team (default)",
      "hostname": ""
    },
    "workflow": {
      "commitMessage": "[PUBLISHER] Merge",
      "name": ""
    },
    "verifiedRepo": true
  },
  "upload": {
    "behavior": "obsidian",
    "defaultName": "content",
    "rootFolder": "",
    "yamlFolderKey": "",
    "frontmatterTitle": {
      "enable": false,
      "key": "title"
    },
    "replaceTitle": [],
    "replacePath": [],
    "autoclean": {
      "enable": true,
      "excluded": ["content/image"]
    },
    "folderNote": {
      "enable": false,
      "rename": "index.md",
      "addTitle": {
        "enable": false,
        "key": "title"
      }
    },
    "metadataExtractorPath": ""
  },
  "conversion": {
    "hardbreak": false,
    "dataview": true,
    "censorText": [],
    "tags": {
      "inline": false,
      "exclude": [],
      "fields": []
    },
    "links": {
      "internal": true,
      "unshared": true,
      "wiki": true,
      "slugify": "lower"
    }
  },
  "embed": {
    "attachments": true,
    "overrideAttachments": [],
    "keySendFile": [],
    "notes": false,
    "folder": "content/image",
    "convertEmbedToLinks": "keep",
    "charConvert": "->"
  },
  "plugin": {
    "shareKey": "share",
    "excludedFolder": [],
    "copyLink": {
      "enable": false,
      "links": "",
      "removePart": [],
      "transform": {
        "toUri": true,
        "slugify": "lower",
        "applyRegex": []
      }
    },
    "setFrontmatterKey": "Set"
  }
}
```

## Customization and Hosting

Basic customization of Quartz involves:

- **Configuration**: Modify `quartz.config.ts` for [site configuration](https://quartz.jzhao.xyz/configuration) and `quartz.layout.ts` for [layout customization](https://quartz.jzhao.xyz/layout). Preview the development locally before deployment.
- **Styles**: Customize styles through `custom.scss`.
- **Component development**: Develop individual components or plugins for the site.
- **Content customization**: Since it supports i18n, you could actually customize the site for different locale.

Refer to the guide at my [previous post](https://dzakiazhari.com/posts/publish-a-digital-garden-of-notes/.) for extensive setup of hosting and such. The basic build preset for the deployment is:

```yaml title="Build Preset"
Framework preset: none
Build command: npx quartz build
Output directory: public
```

Thank you for reading my post. See you again soon.
