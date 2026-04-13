import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import { SITE } from "./src/config";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeMermaid from "rehype-mermaid";


import react from "@astrojs/react";
import mdx from "@astrojs/mdx";


// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [sitemap({
    filter: page => {
      // Extract pathname from full URL (filter receives full URLs)
      const url = new URL(page);
      const path = url.pathname;

      // Always exclude taxonomy pages
      if (path.startsWith("/tags/")) return false;
      // Always exclude search page
      if (path.startsWith("/search")) return false;
      // Always exclude gallery pages
      if (path.startsWith("/gallery")) return false;
      // Always exclude 404 page
      if (path.includes("/404")) return false;
      // Always exclude character page (not a content page)
      if (path === "/character/" || path === "/character") return false;

      // Exclude posts listing and paginated pages (/posts/, /posts/2/, /posts/3/, ...)
      if (path.startsWith("/posts/")) {
        const slug = path.slice("/posts/".length).replace(/\/$/, "");
        // Only include individual articles: /posts/some-title/
        // Exclude: "" (root listing), "2", "3", etc. (pagination)
        if (slug === "" || /^\d+$/.test(slug)) return false;
      }

      // Include archives conditionally
      if (path.endsWith("/archives")) return SITE.showArchives;

      return true;
    },
  }), react(), mdx()],
  markdown: {
    remarkPlugins: [remarkMath, remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    rehypePlugins: [
      [
        rehypeKatex,
        {
          strict: (errorCode: string) =>
            errorCode === "unicodeTextInMathMode" || errorCode === "unknownSymbol"
              ? "ignore"
              : "warn",
        },
      ],
      [
        rehypeMermaid,
        {
          strategy: "img-svg",
          dark: true,
          mermaidConfig: {
            flowchart: {
              htmlLabels: false,
            },
          },
        },
      ],
    ],
    syntaxHighlight: {
      type: "shiki",
      excludeLangs: ["mermaid", "math"],
    },
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "min-light", dark: "night-owl" },
      langAlias: {
        Bash: "bash",
        Java: "java",
        R: "r",
        jsp: "html",
        conf: "ini",
        test: "plaintext",
        factories: "plaintext",
      },
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    // Used for all Markdown images; not configurable per-image
    // Used for all `<Image />` and `<Picture />` components unless overridden with a prop
    experimentalLayout: "responsive",
  },
  experimental: {
    // svg: true,
    responsiveImages: true,
    // preserveScriptOrder: true,
  },
});
