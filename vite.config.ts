import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/** Preloads the fonts used above the fold so text paints once, in its final typeface. */
const preloadCriticalFonts = (): Plugin => ({
  name: "preload-critical-fonts",
  apply: "build",
  transformIndexHtml: {
    order: "post",
    handler(_html, context) {
      const files = Object.keys(context.bundle ?? {});
      const wanted = [
        /instrument-serif-latin-400-normal-.*\.woff2$/,
        /instrument-serif-latin-400-italic-.*\.woff2$/,
        /inter-tight-latin-400-normal-.*\.woff2$/,
        /jetbrains-mono-latin-400-normal-.*\.woff2$/,
      ];
      return wanted.flatMap((pattern) => {
        const file = files.find((name) => pattern.test(name));
        return file
          ? [
              {
                tag: "link",
                injectTo: "head" as const,
                attrs: { rel: "preload", as: "font", type: "font/woff2", href: `/${file}`, crossorigin: "" },
              },
            ]
          : [];
      });
    },
  },
});

export default defineConfig({
  plugins: [react(), preloadCriticalFonts()],
  build: {
    chunkSizeWarningLimit: 1000,
  },
});
