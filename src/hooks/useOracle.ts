import { useCallback, useEffect, useRef, useState } from 'react'
import type { Answer, Phase } from '../types'
import { pick, rollVerdict } from '../lib/random'
import { QUIPS } from '../data/quips'
import { askedToday, recordAsk } from '../lib/dailyGate'

interface UseOracleOptions {
  /** Shorten the artificial "thinking" delay when motion is reduced. */
  reducedMotion?: boolean
}

interface Oracle {
  phase: Phase
  answer: Answer | null
  ask: () => void
  reset: () => void
}

const THINK_MS = 3400
const THINK_MS_REDUCED = 600

/**
 * Drives the single-page flow: landing -> thinking -> verdict.
 * The verdict is rolled the instant the user asks, then revealed after an
 * artificial delay so the brain has time to "think".
 */
export function useOracle({ reducedMotion = false }: UseOracleOptions = {}): Oracle {
  const [phase, setPhase] = useState<Phase>('landing')
  const [answer, setAnswer] = useState<Answer | null>(null)
  const timer = useRef<number | null>(null)

  const clearTimer = useCallback(() => {
    if (timer.current !== null) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }, [])

  // Clear any pending reveal if the component unmounts.
  useEffect(() => clearTimer, [clearTimer])

  const ask = useCallback(() => {
    if (phase !== 'landing') return

    // Already asked today? Snap straight to the sassy brush-off with the
    // verdict they already got, no re-roll.
    const prior = askedToday()
    if (prior) {
      setAnswer(prior)
      setPhase('alreadyAsked')
      return
    }

    const verdict = rollVerdict()
    const quip = pick(QUIPS[verdict])
    setPhase('thinking')
    clearTimer()
    timer.current = window.setTimeout(
      () => {
        const answer = { verdict, quip }
        recordAsk(answer)
        setAnswer(answer)
        setPhase('verdict')
      },
      reducedMotion ? THINK_MS_REDUCED : THINK_MS,
    )
  }, [phase, reducedMotion, clearTimer])

  const reset = useCallback(() => {
    clearTimer()
    setAnswer(null)
    setPhase('landing')
  }, [clearTimer])

  return { phase, answer, ask, reset }
}
