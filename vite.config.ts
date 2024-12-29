import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import { vercelPreset } from "@vercel/remix/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix({
      presets: [vercelPreset()],
      ignoredRouteFiles: [
        "tailwind.config.mjs",
        "postcss.config.js",
        "**/*.css"
      ],
      future: {
        unstable_optimizeDeps: true,
      },
    }),
    tsconfigPaths()
  ],
  resolve: {
    alias: {
      '~/': "/app",
    },
  },
  build: {
    target: 'es2019',
    rollupOptions: {
      external: ['sharp'],
    }
  },
  optimizeDeps: { exclude: ['sharp'] }
});
