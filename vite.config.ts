import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// base: './' keeps every asset URL relative so the same build works on any
// GitHub Pages sub-path (user.github.io/<repo>/) without knowing the repo name.
// Safe here because this is a single page with no client-side routing.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    // react-three-fiber runs its own reconciler; without deduping, Vite's dep
    // pre-bundling can hand it a second copy of React and trigger
    // "Invalid hook call / more than one copy of React". Force a single identity.
    dedupe: ['react', 'react-dom'],
  },
})
