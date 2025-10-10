import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import react from "@astrojs/react";
import expressiveCode, {
  type AstroExpressiveCodeOptions,
  type ExpressiveCodeTheme,
} from "astro-expressive-code";
import { SITE } from "./src/config";

const expressiveCodeOptions: AstroExpressiveCodeOptions = {
  themes: ["rose-pine", "rose-pine-dawn"],
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
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
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
  experimental: {
    preserveScriptOrder: true,
  },
});
