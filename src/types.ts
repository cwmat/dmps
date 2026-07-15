/** The oracle's binary judgement. */
export type Verdict = 'yes' | 'no'

/** Where the single-page experience currently is. */
export type Phase = 'landing' | 'thinking' | 'verdict' | 'alreadyAsked'

/** A resolved answer: the verdict plus the quip chosen to deliver it. */
export interface Answer {
  verdict: Verdict
  quip: string
}
