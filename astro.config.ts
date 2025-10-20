import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import remarkCallouts from "./tools/remark-callouts.mjs";
import remarkDemoteHeadings from "./tools/remark-demote-headings.mjs";
import react from "@astrojs/react";
import expressiveCode, {
  type AstroExpressiveCodeOptions,
  type ExpressiveCodeTheme,
} from "astro-expressive-code";
import { SITE } from "./src/config";

const expressiveCodeOptions: AstroExpressiveCodeOptions = {
  themes: ["github-dark", "github-light"],
  useDarkModeMediaQuery: false,
  themeCssRoot: ":root",
  themeCssSelector: (theme: ExpressiveCodeTheme) =>
    `[data-theme='${theme.type === "dark" ? "dark" : "light"}']`,
  defaultProps: {
    wrap: true,
    overridesByLang: {
      "bash,ps,sh": { preserveIndent: false },
    },
  },
  styleOverrides: {
    borderRadius: "1.05rem",
    borderWidth: "1px",
    borderColor: "color-mix(in oklab, var(--border) 64%, transparent 36%)",
    codeFontSize: "0.96rem",
    codeLineHeight: "1.68",
    codePaddingBlock: "clamp(1.3rem, 1.08rem + 0.8vw, 1.95rem)",
    codePaddingInline: "clamp(1.1rem, 0.92rem + 1.05vw, 1.72rem)",
    uiFontSize: "0.78rem",
    uiLineHeight: "1.45",
    uiPaddingBlock: "clamp(0.42rem, 0.34rem + 0.32vw, 0.7rem)",
    uiPaddingInline: "clamp(0.88rem, 0.7rem + 0.88vw, 1.32rem)",
    gutterBorderColor:
      "color-mix(in oklab, var(--border) 62%, transparent 38%)",
    frames: {
      frameBoxShadowCssValue:
        "0 22px 48px color-mix(in oklab, var(--foreground) 7%, transparent 93%)",
      editorTabBarBackground:
        "color-mix(in oklab, var(--background) 94%, var(--foreground) 6%)",
      editorActiveTabBackground:
        "color-mix(in oklab, var(--background) 88%, var(--accent) 12%)",
      editorActiveTabForeground:
        "color-mix(in oklab, var(--foreground) 94%, var(--background) 6%)",
      editorTabBarBorderBottomColor:
        "color-mix(in oklab, var(--border) 58%, transparent 42%)",
      terminalTitlebarBackground:
        "color-mix(in oklab, var(--background) 90%, var(--foreground) 10%)",
      terminalTitlebarForeground:
        "color-mix(in oklab, var(--foreground) 88%, var(--background) 12%)",
      terminalTitlebarDotsForeground:
        "color-mix(in oklab, var(--accent) 84%, transparent 16%)",
      inlineButtonBackground:
        "color-mix(in oklab, var(--background) 86%, var(--foreground) 14%)",
      inlineButtonBackgroundIdleOpacity: "1",
      inlineButtonBackgroundHoverOrFocusOpacity: "1",
      inlineButtonBackgroundActiveOpacity: "1",
      inlineButtonBorder:
        "color-mix(in oklab, var(--border) 70%, transparent 30%)",
      inlineButtonBorderOpacity: "1",
      inlineButtonForeground:
        "color-mix(in oklab, var(--foreground) 90%, var(--background) 10%)",
      tooltipSuccessBackground:
        "color-mix(in oklab, var(--accent) 30%, transparent 70%)",
      tooltipSuccessForeground:
        "color-mix(in oklab, var(--foreground) 96%, var(--background) 4%)",
    },
  },
};

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    react(),
    expressiveCode(expressiveCodeOptions),
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives"),
    }),
  ],
  markdown: {
    remarkPlugins: [
      remarkToc,
      remarkDemoteHeadings,
      [remarkCollapse, { test: /table of contents/i }],
      remarkCallouts,
    ],
  },
  vite: {
    // eslint-disable-next-line
    // @ts-ignore
    // This will be fixed in Astro 6 with Vite 7 support
    // See: https://github.com/withastro/astro/issues/14030
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  prefetch: true,
  experimental: {
    preserveScriptOrder: true,
  },
});
