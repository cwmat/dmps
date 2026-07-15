import type { Verdict } from '../types'

/** Pick a uniformly random element from a non-empty array. */
export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * The oracle leans hard toward "yes, you stinky pants person" — ~70% of asks
 * come back positive so a clean day feels like a genuine reprieve.
 */
const YES_PROBABILITY = 0.7

export function rollVerdict(): Verdict {
  return Math.random() < YES_PROBABILITY ? 'yes' : 'no'
}
