import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served from the GitHub profile repo at https://andrpre.github.io/andrpre/
// so the base path must match the repo name.
export default defineConfig({
  base: '/andrpre/',
  plugins: [react()],
});
