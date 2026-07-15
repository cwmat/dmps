import type { Answer, Verdict } from '../types'

const KEY = 'dmps:v1'

interface StoredAsk {
  /** Local calendar day the question was last answered, as YYYY-MM-DD. */
  date: string
  verdict: Verdict
  quip: string
}

/** Today's local calendar date (not UTC) so "tomorrow" matches the user's day. */
export function todayLocal(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function read(): StoredAsk | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const p = JSON.parse(raw) as Partial<StoredAsk>
    if (
      typeof p.date === 'string' &&
      (p.verdict === 'yes' || p.verdict === 'no') &&
      typeof p.quip === 'string'
    ) {
      return { date: p.date, verdict: p.verdict, quip: p.quip }
    }
    return null
  } catch {
    return null
  }
}

/** The stored answer if the user already asked *today*, otherwise null. */
export function askedToday(): Answer | null {
  const stored = read()
  if (stored && stored.date === todayLocal()) {
    return { verdict: stored.verdict, quip: stored.quip }
  }
  return null
}

/** Persist today's answer so re-asks are gated until tomorrow. */
export function recordAsk(answer: Answer): void {
  try {
    const payload: StoredAsk = {
      date: todayLocal(),
      verdict: answer.verdict,
      quip: answer.quip,
    }
    localStorage.setItem(KEY, JSON.stringify(payload))
  } catch {
    // localStorage unavailable (private mode / disabled) — gate degrades to
    // "ask as often as you like", which is a fine fallback.
  }
}
