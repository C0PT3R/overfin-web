import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Old enough for TV browsers (webOS 6 is Chromium 79).
    target: ['es2020', 'chrome79', 'safari14', 'firefox78'],
    // Assets stay files, never inlined: everything comes from the site.
    assetsInlineLimit: 0,
    modulePreload: { polyfill: false },
    // hls.js alone is about 580 kB; it loads only when something plays.
    chunkSizeWarningLimit: 700,
    sourcemap: false,
  },
});
