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
    filter: page => SITE.showArchives || !page.endsWith("/archives"),
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
      [rehypeMermaid, { strategy: "img-svg", dark: true }],
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
