import CssAura from './components/CssAura'
import BrainScene from './components/BrainScene'
import { usePrefersReducedMotion } from './lib/usePrefersReducedMotion'

export default function App() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <>
      <CssAura />
      <BrainScene thinking={false} reducedMotion={reducedMotion} />

      <main className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink drop-shadow-[0_2px_24px_rgba(123,47,247,0.45)] sm:text-6xl">
          Do My Pants Stink?
        </h1>
        <p className="mt-4 text-ink-dim">A very serious intelligence is standing by.</p>
      </main>
    </>
  )
}
