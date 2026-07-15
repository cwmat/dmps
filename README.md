# Do My Pants Stink?

An over-engineered artificial intelligence that dedicates its entire being to one
question: **do your pants stink today?**

Ask once, watch a 3D "brain" agonize over the answer, and receive a sassy YES/NO
verdict with one of ~300 quips. The oracle only answers **once per calendar day** —
ask again and it gets snippy.

> One question. One answer. Once a day.

## Stack

- **React 19** + **TypeScript** + **Vite** (single page, no router)
- **Tailwind CSS v4** (CSS-first theme in [`src/index.css`](src/index.css))
- **three.js** via **@react-three/fiber** + **drei** + **postprocessing** — the pulsing brain
- **motion** (Framer Motion) — painted text + phase transitions
- Deployed to **GitHub Pages** via GitHub Actions

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build locally
```

## How it works

- **State machine** ([`src/hooks/useOracle.ts`](src/hooks/useOracle.ts)):
  `landing → thinking → verdict`, plus an `alreadyAsked` brush-off.
- **The roll** ([`src/lib/random.ts`](src/lib/random.ts)) leans ~70% toward "yes,
  you stinky pants person"; the quip is picked from
  [`src/data/quips.ts`](src/data/quips.ts).
- **Daily gate** ([`src/lib/dailyGate.ts`](src/lib/dailyGate.ts)) stores
  `{date, verdict, quip}` in `localStorage` under `dmps:v1`, keyed on the **local**
  calendar day. Clear that key (or wait for tomorrow) to ask again.
- **Reduced motion** is respected throughout — the 3D freezes to a static frame,
  text fades instead of flying, and the "thinking" cycle is skipped.

## Adding background videos

The background is a layered stack (video → CSS aura → 3D brain → UI). The video
layer is optional and empty by default. To add looping footage:

1. Drop a file into `public/videos/` (e.g. `public/videos/nebula.mp4`).
2. Add an entry to [`src/data/videos.ts`](src/data/videos.ts):
   ```ts
   export const BACKGROUND_VIDEOS = [
     { src: 'videos/nebula.mp4', poster: 'videos/nebula.webp' },
   ]
   ```

A random configured clip plays behind the brain; with none configured the layer
renders nothing.

## Deploy (GitHub Pages)

[`vite.config.ts`](vite.config.ts) uses `base: './'`, so the build works at any
project sub-path (`user.github.io/<repo>/`) without hardcoding the repo name.

1. Push to `main`.
2. In the repo, set **Settings → Pages → Build and deployment → Source = GitHub
   Actions** (one-time).
3. The [deploy workflow](.github/workflows/deploy.yml) builds and publishes `dist/`
   on every push to `main`.
