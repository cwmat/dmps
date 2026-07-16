import { Suspense, lazy } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import VideoBackground from './components/VideoBackground'
import CssAura from './components/CssAura'
import PaintedText from './components/PaintedText'
import AskButton from './components/AskButton'
import ThinkingCycler from './components/ThinkingCycler'
import Verdict from './components/Verdict'
import AlreadyAsked from './components/AlreadyAsked'
import { useOracle } from './hooks/useOracle'
import { usePrefersReducedMotion } from './lib/usePrefersReducedMotion'

// Code-split the ~1MB three.js scene so the UI paints immediately; the brain
// fades in over the CSS aura a beat later.
const BrainScene = lazy(() => import('./components/BrainScene'))

export default function App() {
  const reducedMotion = usePrefersReducedMotion()
  const { phase, answer, ask } = useOracle({ reducedMotion })

  return (
    <>
      <VideoBackground />
      <CssAura />
      <Suspense fallback={null}>
        <BrainScene thinking={phase === 'thinking'} reducedMotion={reducedMotion} />
      </Suspense>

      <main className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <p className="legible mb-5 font-display text-xs font-medium uppercase tracking-[0.35em] text-[#cbbdff]">
          The Olfactory Oracle
        </p>

        {/* Single child keyed by phase — AnimatePresence exits the old phase,
            then mounts the next (mode="wait"). */}
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.2, 0.65, 0.3, 0.9] }}
            className="flex flex-col items-center"
          >
            {phase === 'landing' && (
              <>
                <PaintedText
                  text="do my pants stink today?"
                  className="max-w-4xl font-display text-4xl font-bold leading-tight tracking-tight text-ink drop-shadow-[0_2px_28px_rgba(123,47,247,0.45)] sm:text-6xl"
                />
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.8 }}
                  className="legible mt-6 max-w-md text-balance text-ink-dim"
                >
                  One question. One answer. Once a day. The machine has been thinking
                  about your pants for a very long time.
                </motion.p>
                <div className="mt-10">
                  <AskButton onClick={ask}>Ask the oracle</AskButton>
                </div>
              </>
            )}

            {phase === 'thinking' && <ThinkingCycler reducedMotion={reducedMotion} />}

            {phase === 'verdict' && answer && <Verdict answer={answer} />}

            {phase === 'alreadyAsked' && answer && <AlreadyAsked answer={answer} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  )
}
