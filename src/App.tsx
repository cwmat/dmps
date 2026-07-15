import CssAura from './components/CssAura'

export default function App() {
  return (
    <>
      <CssAura />

      <main className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-6xl">
          Do My Pants Stink?
        </h1>
        <p className="mt-4 text-ink-dim">A very serious intelligence is standing by.</p>
      </main>
    </>
  )
}
