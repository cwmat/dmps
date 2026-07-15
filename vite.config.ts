import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

// https://vite.dev/config/
// base: './' keeps every asset URL relative so the same build works on any
// GitHub Pages sub-path (user.github.io/<repo>/) without knowing the repo name.
// Safe here because this is a single page with no client-side routing.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    // react-three-fiber runs its own reconciler. Vite 8's dev dep-optimizer
    // intermittently bundles a *second* copy of React into the fiber chunk on
    // re-optimization, which throws "Invalid hook call / more than one copy of
    // React". Exact-match aliases pin every bare `react`/`react-dom` import to a
    // single resolved module (subpath imports like `react/jsx-runtime` are left
    // untouched by the `^...$` anchors); dedupe backs it up for the prod build.
    dedupe: ['react', 'react-dom'],
    alias: [
      { find: /^react$/, replacement: require.resolve('react') },
      { find: /^react-dom$/, replacement: require.resolve('react-dom') },
    ],
  },
})
