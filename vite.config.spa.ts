import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

/** Static SPA build for GitHub Pages (no SSR / Nitro). */
export default defineConfig({
  base: "/turf-pad-builder/",
  plugins: [tailwindcss(), viteReact()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist-spa",
    emptyOutDir: true,
  },
});
