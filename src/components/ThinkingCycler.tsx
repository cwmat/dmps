import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { THINKING_PHRASES } from '../data/thinkingPhrases'

/**
 * The Claude-"whirligigging" moment: rapidly cycles silly gerund status
 * phrases while the oracle deliberates. Under reduced motion it shows a single
 * static phrase (rapidly changing text is itself a motion trigger).
 */
export default function ThinkingCycler({ reducedMotion }: { reducedMotion: boolean }) {
  const [i, setI] = useState(0)

  // Rotate the list to a random start so each session feels fresh.
  const phrases = useMemo(() => {
    const start = Math.floor(Math.random() * THINKING_PHRASES.length)
    return [...THINKING_PHRASES.slice(start), ...THINKING_PHRASES.slice(0, start)]
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const id = setInterval(() => setI((n) => n + 1), 650)
    return () => clearInterval(id)
  }, [reducedMotion])

  const phrase = phrases[i % phrases.length]

  return (
    <div
      className="flex min-h-[2.5em] items-center justify-center"
      aria-live="polite"
      aria-label="The oracle is thinking"
    >
      {reducedMotion ? (
        <p className="font-display text-lg text-charge-400 sm:text-xl">{phrases[0]}…</p>
      ) : (
        <AnimatePresence mode="wait">
          <motion.p
            key={phrase}
            initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.22 }}
            className="font-display text-lg text-charge-400 sm:text-xl"
          >
            {phrase}…
          </motion.p>
        </AnimatePresence>
      )}
    </div>
  )
}
