import { useMemo } from 'react'
import { BACKGROUND_VIDEOS } from '../data/videos'

/** Prefix a public asset path with the app base so it resolves on GH Pages. */
function withBase(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

/**
 * Layer 0 (behind the aura + brain) — an optional looping background video.
 * Renders nothing until a video is configured in src/data/videos.ts, so the app
 * looks complete today and "just works" once the user drops files into
 * public/videos/.
 */
export default function VideoBackground() {
  const video = useMemo(() => {
    if (BACKGROUND_VIDEOS.length === 0) return null
    return BACKGROUND_VIDEOS[Math.floor(Math.random() * BACKGROUND_VIDEOS.length)]
  }, [])

  if (!video) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <video
        className="h-full w-full object-cover opacity-40"
        autoPlay
        muted
        loop
        playsInline
        poster={video.poster ? withBase(video.poster) : undefined}
      >
        <source src={withBase(video.src)} type={video.type ?? 'video/mp4'} />
      </video>
      {/* Darkening wash so the brain + text stay legible over any footage. */}
      <div className="absolute inset-0 bg-void/60" />
    </div>
  )
}
