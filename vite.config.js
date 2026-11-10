import { defineConfig } from 'vite';

// base './' so each daily build works from its own folder (/builds/day-N/)
export default defineConfig({
  base: './',
  build: { target: 'es2020', chunkSizeWarningLimit: 900 },
});
