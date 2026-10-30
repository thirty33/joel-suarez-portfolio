// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  server: { host: true },
  devToolbar: { enabled: false },
  // A one-page site: its CSS goes inside the HTML, so the first paint waits for no other request.
  build: { inlineStylesheets: 'always' },
  vite: {
    plugins: [tailwindcss()],
  },
});
