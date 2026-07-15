import { motion } from 'motion/react'
import CssAura from './components/CssAura'
import BrainScene from './components/BrainScene'
import PaintedText from './components/PaintedText'
import AskButton from './components/AskButton'
import { usePrefersReducedMotion } from './lib/usePrefersReducedMotion'

export default function App() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <>
      <CssAura />
      <BrainScene thinking={false} reducedMotion={reducedMotion} />

      <main className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <p className="mb-5 font-display text-xs font-medium uppercase tracking-[0.35em] text-neural-400">
          The Olfactory Oracle
        </p>

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
          One question. One answer. Once a day. The machine has been thinking about
          your pants for a very long time.
        </motion.p>

        <div className="mt-10">
          <AskButton onClick={() => {}}>Ask the oracle</AskButton>
        </div>
      </main>
    </>
  )
}
