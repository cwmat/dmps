import type { CSSProperties } from 'react'

/**
 * Layer 0 — the pulsing dark-mode base.
 * A few large, blurred radial-gradient blobs that slowly "breathe" behind
 * everything else. Pure CSS so it costs nothing and always renders, even
 * before the 3D canvas is ready.
 */
interface Blob {
  position: CSSProperties
  bg: string
  delay?: string
}

const BLOBS: Blob[] = [
  {
    position: { left: '50%', top: '38%', width: '82vmin', height: '82vmin' },
    bg: 'radial-gradient(circle, rgba(123,47,247,0.38), transparent 70%)',
  },
  {
    position: { left: '28%', top: '64%', width: '58vmin', height: '58vmin' },
    bg: 'radial-gradient(circle, rgba(0,229,255,0.20), transparent 70%)',
    delay: '-4s',
  },
  {
    position: { left: '72%', top: '28%', width: '50vmin', height: '50vmin' },
    bg: 'radial-gradient(circle, rgba(167,139,250,0.18), transparent 70%)',
    delay: '-2s',
  },
]

export default function CssAura() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
    >
      {/* faint overall wash toward the top-center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 30%, rgba(123,47,247,0.10), transparent 60%)',
        }}
      />
      {BLOBS.map((blob, i) => (
        // outer wrapper handles centering; inner handles the breathe animation
        // so the keyframe's transform never fights the translate.
        <div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={blob.position}
        >
          <div
            className="animate-breathe h-full w-full rounded-full"
            style={{
              background: blob.bg,
              filter: 'blur(48px)',
              animationDelay: blob.delay,
            }}
          />
        </div>
      ))}
    </div>
  )
}
