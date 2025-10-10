---
title: Publish a Digital Garden of Notes
author: Dzaki Azhari
description: Publish a digital garden of notes based on Obsidian and Eleventy.
pubDatetime: 2024-03-09T03:10:50Z
modDatetime: 2024-03-09T03:11:44Z
slug: publish-a-digital-garden-of-notes
featured: true
draft: false
tags:
  - dev
---

## Table of Contents

## Introduction

**Hello.**

Good morning and happy day to you.

Obsidian's core strength lies in its "file-first" philosophy. This means your notes are essentially plain text files stored in your local file system.

The concept of a digital garden thrives on organic growth, exploration, and interconnectedness. These principles perfectly align with Obsidian's file-first approach. Your knowledge base becomes a living entity, constantly evolving as you make new connections and insights. Obsidian already has Obsidian Publish as its main way to share notes seamlessly, however there a several alternatives that mostly are based on static-site generators (SSG.)

The combination of Obsidian's file-first philosophy and the [Obsidian Digital Garden](https://github.com/oleeskild/digitalgarden) plugin offers a powerful and user-friendly solution for cultivating and sharing your digital garden. It's easy to use, integrates seamlessly with Obsidian, and offers the features you need to publish your knowledge base without unnecessary complexity.

## Basic Setup

This guide will walk you through setting up your digital garden on Cloudflare Pages using the Digital Garden plugin for Obsidian.

### Prerequisites

Before you begin, make sure you have the following:

- **[Obsidian app](https://obsidian.md):** Download and install the Obsidian app for your operating system.
- **[GitHub account](https://github.com):** Create a free GitHub account if you don't have one already.
- **[Cloudflare account](https://dash.cloudflare.com):** Create a free Cloudflare account if you don't have one already.

### Setting Up Your Repository

1. **Install the Digital Garden Plugin:** Open Obsidian and install the "Digital Garden" plugin from the Community Plugins section.
2. **Create a GitHub Repository:**
   - Go to the following repository template: [Digital Garden Repo Template](https://github.com/oleeskild/digitalgarden)
   - Click "Use this Template" and select "Create a new repository."
   - **Note:** If you don't see the "Use this Template" button, zoom out or maximize the page.
   - On the next page, configure your repository:
     - **Uncheck** the box for "Include all branches."
     - Enter a name and description for your repository.
     - Choose whether to make the repository public or private. (This doesn't affect website functionality.)
3. **Create a Fine-Grained Access Token:**
   - Go to your GitHub profile icon in the top-right corner.
   - Select "Settings."
   - In the left bar, navigate to "Developer settings" > "Personal access tokens" > "Fine-grained tokens."
   - Click "Generate a new token."
   - Configure the token:
     - Give the token a name.
     - Set an expiration date.
   - Under "Repository access," select "Only select repositories" and choose your newly created repository.
   - Under "Repository permissions," select "Read" and "Write" for both Contents and Pull Requests.
   - Click "Generate token." **Important:** You will only be able to see this token once! Copy and save it securely (password manager recommended).

### Connecting Obsidian to Your Repository

1. **Open Obsidian Settings:** Go to Settings in Obsidian.
2. **Configure Digital Garden Plugin:**
   - In the left column under "Community Plugins," select "Digital Garden."
   - Enter the following information:
     - **Repo name:** The name you gave your repository.
     - **User account name:** Your GitHub username.
     - **Fine-Grained Token:** The access token you just created.

**Congratulations!** You've now connected your Obsidian notes to your Cloudflare repository. Your digital garden content will be automatically published when you make changes in Obsidian. The token may expire after a year. You can reactivate it or create a new one following the same steps.

### Configure Obsidian Plugin and Pages

This section covers configuring the Digital Garden plugin for customization and publishing your notes.

#### Plugin Configuration

While settings are flexible, here are some recommendations:

- **Features:** Enable most features, except Frontmatter (may cause issues).
- **Appearance:** Match the theme to your existing theme for consistency.
- **Site Name & Favicon:**
  - Enter a site name.
  - Assign a square SVG favicon (search online for free converters).
  - Update your browser cache to see favicon changes.
- **Timestamps:**
  - Enable timestamps with caution for large note volumes (multiple builds).
- **Further Configuration:**
  - Refer to the Digital Garden guide or Discord server for additional settings.

#### Adding Properties to Pages

Organize your published notes using specific properties.

- **Required Properties:**
  - **dg-home:** Set to True (checkbox) for exactly one page to define your homepage. (Homepage title requires a heading, not filename).
  - **dg-publish:** Set to True for every page you want to publish.
- **Creating Properties:**
  - Use three dashes (---) on the first line.
  - Click the top-right three-dot menu and choose "Add Property."
  - Keyboard shortcut: Ctrl+;
  - Command Palette options: "Add file property," "Add publish flag," etc.
  - Properties should be set to its type accordingly. Not everything should be specified, use the property according to your needs.

**Template of my current digital garden property:**

```yaml title="Templater Frontmatter"
---
tags:
aliases:
title:
dg-publish:
dg-pinned:
dg-hide:
dg-hide-in-graph:
dg-enable-search:
dg-permalink:
dg-show-toc:
---
```

#### Publishing Your Notes

Publish notes using various options:

- **Command Palette:**
  - "Publish all notes"
  - "Publish single note"
- **Digital Garden Publication Center:**
  - Offers more nuanced publishing options. It is accessible on the sidebar. It is more recommended to use Publication Center.

## Configure Cloudflare

Now that your vault is ready for publishing, let's set it up on Cloudflare.

### Create the Pages Application

1. Log in to Cloudflare.
2. Expand the left menu bar and navigate to Workers and Pages > Overview.
3. Click "Create Application."
4. Connect your Git account and select the repository you created from the Digital Garden template.
   - If you've already connected your account, choose "Add account" to see the new repository.
5. Configure your first deployment:
   - Project name: Use the default (your repository name).
   - Production branch: Set to "Main."
   - Framework preset: Leave as default or set to "Eleventy".
   - Build command: `npm run build`.
   - Build output directory: `dist`.
6. Click "Finish" (or similar) to initiate the first build. This might be where you encounter any initial issues. Refer to the "Troubleshooting" section for help if necessary. You may also need to re-apply any plugin customizations you made earlier.

### Register and Assign a Custom Domain

For advanced security features and custom headers, consider registering a domain name and linking it to your Pages project on Cloudflare.

While not strictly mandatory, Cloudflare's security features are a major advantage over other hosting services. Additionally, domain names are relatively inexpensive (around $10 per year).

### Add Cloudflare Security and Optimization Features

- **Domain Connection and Setup:**
  - Navigate to "Websites" on the Cloudflare dashboard.
  - Ensure your domain shows a green checkmark with **"Active."**
  - Access the **Quick Start Guide** for setup assistance.
- **Essential Security and Performance Features:**
  - Enable:
    - **Automatic HTTPS rewrites**
    - **Always Use HTTPS**
    - **Brotli compression** for faster loading times
- **Domain Protection with DNSSEC:**
  - Enable DNSSEC under the **"DNS"** section to prevent domain hijacking.
- **SSL/TLS Configuration:**
  - Choose **"Full (Strict)"** for maximum security.
  - Enable **HTTP Strict Transport Security (HSTS)** under **"Edge Certificates."**
    - Set parameters for HSTS options.
    - Use **TLS 1.3** (or minimum TLS 1.2) for enhanced security.
- **Security Settings for Handling Suspicious Clients:**
  - Adjust security level to **"Low"** or **"Medium."**
  - Set **"Challenge Passage"** duration based on security level testing.
- **Optional Speed Optimization Features:**
  - Explore and enable speed optimization options under **"Speed."**

### Configure Dependabot for Security Updates

- **Configure Dependabot for Security Updates:**
  - **Warning:** Manual updates outside of Digital Garden updates may break your site. You can revert Dependabot branch merges if necessary.
  - In your GitHub repository settings, navigate to **"Code security and analysis"** and enable **Dependabot Alerts and Security Updates.**
  - When Dependabot identifies dependency updates or security issues, a pull request is created, and Cloudflare tests the build in a preview for successful compilation.
  - Merge the pull request to apply the updates. Refer to the guide on **"How to update packages for Digital Gardens"** for complex vulnerabilities.

**Remember:**

- Digital Garden updates may overwrite Dependabot updates, so applying security patches is crucial, even if re-applying is necessary.

### Custom Security Headers

- **Custom Security Headers:**
  - Cloudflare allows you to install custom security headers on your site to enhance its protection against attackers. These headers reduce the risk of your site being exploited to harm visitors.
- **Why Use Custom Security Headers?**
  - **Improved Security:** Security headers mitigate vulnerabilities and make it harder for attackers to compromise your site.
  - **Reduced Attack Risk:** They discourage attackers from targeting your site for malicious activities.
- **Verify Your Site's Security:**
  - Before implementing custom headers, you can check your site's current security posture using a tool like [securityheaders.com](https://securityheaders.com/). This will reveal any potential vulnerabilities attackers might exploit.

#### Setup Custom Security Headers

1. **Create the `_headers` File:**
   - In your GitHub repository, navigate to the `/src/site` folder.
   - Click "Add file" from the top right corner.
   - Name the new file `_headers`.
2. **Insert Security Header Code:**
   - Paste the desired setting into the `_headers`, example:

```yaml title="_headers"
/app/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  Permissions-Policy: document-domain=()

/static/*
  Access-Control-Allow-Origin: *
  X-Robots-Tag: nosnippet

https://notes.dzakiazhari.com/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: no-referrer
  Permissions-Policy: document-domain=()
  Permissions-Policy: geolocation=()
  Strict-Transport-Security: 'max-age=31536000; includeSubDomains; preload'

/knowledge-base/*
  X-Robots-Tag: nosnippet
  X-Robots-Tag: noindex

/10-knowledge-base/*
  X-Robots-Tag: nosnippet
  X-Robots-Tag: noindex

```

3. **Modify `userSetup.js` for Header Passthrough:**
   - Navigate to the `/src/helpers` folder and click on `userSetup.js`.
   - In the top-right corner, click the dropdown menu next to the pen icon and select "Edit in place."
   - Within the config brackets, add the following line:

```js title="userSetup.js"
eleventyConfig.addPassthroughCopy("src/site/_headers");
```

4. **Verify Header Addition:** In your Cloudflare dashboard, navigate to "Deployment Details" and click on the "Headers" tab. This should display the newly added headers. Additionally check the grade of your site's security headers' grade with the site explained above.

   **Note:**
   - You could utilize the `userSetup.js` to pass through a custom 404 page.
   - Create a custom 404.html page, copy it to folder `site` and add the following line:

```js title="userSetup.js"
eleventyConfig.addPassthroughCopy("src/site/404.html");
```

## Customize Your Digital Garden's Style

Spruce up your digital garden with a touch of personalization! Here's how to adjust the visual style using the Digital Garden plugin and custom SCSS.

### Theme Configuration

1. Navigate to the Obsidian settings menu.
2. Open the "Digital Garden" plugin settings.
3. Under the "Appearance" tab, locate the "Theme" option and select your preferred theme.

#### Preset Styles and Apply

1. Explore the various theme presets offered by your theme. Currently I use the the `Border` theme with preset style `GitHub-dark`.
2. Once you find a preset that aligns with your desired aesthetic, click the "Apply Style Settings".

#### Advanced Customization with Custom SCSS

The Digital Garden plugin leverages SCSS (a pre-processor for CSS) to offer deeper styling control. Here's how to dive in:

1. Locate the file named `custom-style.scss` within the `/site/styles` folder of your Git repository.
2. Open `custom-style.scss` in your preferred code editor.
3. Within this file, you can write SCSS code to modify various aspects of your garden's style, such as:
   - Font colors
   - Background colors
   - Link styles
   - Button styles
   - Layout elements

Here's an example how I customized the CSS for my digital garden:

```scss title="custom-style.scss"
body {
  --font-text-theme: "Atkinson Hyperlegible", arial;
  --font-monospace-override: "JetBrains Mono", monospace;
  --font-monospace-theme: "JetBrains Mono", monospace;
  --table-border-width: 3px;
  --table-header-background: #36454f;
  --table-header-background-hover: #36454f;
  --table-header-weight: var(--font-bold);
  --link-color: #da70d6;
}
/* TXT */
h1,
.markdown-rendered h1,
.HyperMD-header-1,
.HyperMD-list-line .cm-header-1 {
  --h1-size: 1.85em;
  --h1-color: #4eafa9;
  color: var(--h1-color);
  font-size: var(--h1-size);
}
.notelink.active-note a {
  color: #ffa500;
}
/* Applies to all unordered lists */
ul {
  list-style-type: square;
}
/* FILETREE */
.filetree-sidebar h1 {
  font-size: 42px !important;
}
@media (max-width: 800px) {
  .navbar h1 {
    font-size: 25px !important;
  }
}
.align-icon {
  justify-content: space-between;
}
.filetree-sidebar {
  display: flex;
  flex-direction: column;
  min-width: max-content;
  width: 18%;
  padding: 0px;
}
@media only screen and (max-width: 768px) {
  .filetree-sidebar {
    width: 55%;
    min-width: max-content;
    padding: 5px;
  }
}
.filelist {
  flex-grow: 1;
  margin: 0;
  padding-left: 0;
}
.filename {
  margin: 0;
  padding-right: 1rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}
.search-button {
  background-color: var(--background-primary);
  border-radius: 20px;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  max-width: 70%;
  margin: 5px 60px;
  border: 2px solid var(--text-normal);
  cursor: pointer;
  transition:
    background-color 0.3s,
    border-color 0.3s;
}
/* HIGHLIGHT */
.markdown-rendered mark {
  background-color: #800080;
  color: var(--text-normal);
  border-radius: 5px;
  padding: 2px 5px;
}
/* CODE */
.markdown-rendered code {
  background-color: #2e3440;
  padding: 0.15em 0.25em;
  color: #d8dee9;
  border-radius: 5px;
}
.markdown-rendered pre {
  border-radius: 10px !important;
  background-color: #2e3440 !important;
  border: 1px solid #3b4252;
}
code[class*="language-"],
pre[class*="language-"] {
  background-color: #2e3440 !important;
}
/* CALLOUT */
.callout {
  border-radius: 10px;
}
/* OVERLAY */
.fullpage-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000000;
  opacity: 0.7;
}
/* TABLE */
table {
  width: 100%;
  border-collapse: collapse;
  background-color: #1c1e21;
  white-space: nowrap;
}
/* Media query for screens smaller than 600px */
@media (max-width: 600px) {
  table {
    width: 100%;
    font-size: 80%; /* Adjust the font size as needed */
  }
}
.table-view-table > thead > tr > th {
  font-size: 1em;
}
/* TOC */
.toc ol {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.toc li {
  padding-left: 0.5rem;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.toc li ol {
  padding-left: 0.5rem;
  margin-bottom: 0.25rem;
}
.toc li ol a {
  padding-left: 0.25rem;
}
.toc-container li a {
  padding-left: 0.5rem;
  list-style-type: none;
}
.toc-container {
  font-size: 1rem;
  max-height: 100%;
}
/*# sourceMappingURL=custom-style.css.map */
```

#### Important Note

- SCSS offers advanced customization capabilities, but it requires a basic understanding of CSS syntax and SCSS features.
- If you're new to CSS or SCSS, consider starting with online resources or tutorials to learn the fundamentals before diving into extensive code modifications.
- A dumb way to load a remote google font is to edit `layouts/index.njk`, an example for adding the following font:

```js title="index.njk"
<!-- This is a font. -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&display=swap"
  rel="stylesheet"
/>
<!-- This is a font. -->
```

By combining theme presets and custom SCSS, you can create a digital garden that reflects your unique style and preferences!
