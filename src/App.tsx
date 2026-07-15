import { AnimatePresence, motion } from 'motion/react'
import CssAura from './components/CssAura'
import BrainScene from './components/BrainScene'
import PaintedText from './components/PaintedText'
import AskButton from './components/AskButton'
import ThinkingCycler from './components/ThinkingCycler'
import { useOracle } from './hooks/useOracle'
import { usePrefersReducedMotion } from './lib/usePrefersReducedMotion'

export default function App() {
  const reducedMotion = usePrefersReducedMotion()
  const { phase, answer, ask } = useOracle({ reducedMotion })

  return (
    <>
      <CssAura />
      <BrainScene thinking={phase === 'thinking'} reducedMotion={reducedMotion} />

      <main className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <p className="mb-5 font-display text-xs font-medium uppercase tracking-[0.35em] text-neural-400">
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
                  className="mt-6 max-w-md text-balance text-ink-dim"
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

            {phase === 'verdict' && answer && (
              <>
                <PaintedText
                  key={answer.quip}
                  text={answer.verdict === 'yes' ? 'YES.' : 'NO.'}
                  perChar={0.08}
                  className={`font-display text-7xl font-bold tracking-tight sm:text-8xl ${
                    answer.verdict === 'yes' ? 'text-stink-400' : 'text-fresh-400'
                  }`}
                />
                <p className="mt-6 max-w-md text-balance text-lg text-ink">{answer.quip}</p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  )
}
