import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@vercel/remix";
import { defineConfig } from "vite";
import { vercelPreset } from "@vercel/remix/vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export default defineConfig({
  plugins: [
    remix({
      presets: [vercelPreset()],
      ignoredRouteFiles: ["postcss.config.js", "**/*.css"],
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
