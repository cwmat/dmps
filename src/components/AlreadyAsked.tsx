import { useMemo } from 'react'
import { motion } from 'motion/react'
import type { Answer } from '../types'
import { pick } from '../lib/random'

/** Sassy brush-offs for asking twice in one day. */
const SASS: readonly string[] = [
  'Ask again tomorrow. I already told ya!',
  'One sniff per day, pal. Those are the rules.',
  'Nope. The nose is off the clock until tomorrow.',
  "You already asked. I don't do reruns.",
  "Easy, tiger. One verdict a day keeps the funk away.",
  'The oracle has moved on with its life. Try tomorrow.',
  "I heard you the first time. Come back tomorrow.",
  'Refreshing won’t change the ruling. Tomorrow, champ.',
  'My nostrils need a nap. Ask again tomorrow.',
  "That's a wrap for today. Same time tomorrow?",
  "Once a day, that's the deal. Go live your life.",
  'The pants have been judged. Court is adjourned till tomorrow.',
]

export default function AlreadyAsked({ answer }: { answer: Answer }) {
  const sass = useMemo(() => pick(SASS), [])
  const isYes = answer.verdict === 'yes'

  return (
    <div className="flex flex-col items-center">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0.65, 0.3, 0.9] }}
        className="max-w-2xl font-display text-3xl font-bold leading-snug text-ink sm:text-5xl"
      >
        {sass}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="mt-7 text-lg text-ink-dim"
      >
        For the record, today&rsquo;s ruling stands:{' '}
        <span
          className={`font-display font-bold ${isYes ? 'text-stink-400' : 'text-fresh-400'}`}
        >
          {isYes ? 'YES' : 'NO'}
        </span>
        .
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="mt-10 font-display text-[0.7rem] font-medium uppercase tracking-[0.3em] text-ink-dim"
      >
        A new judgment unlocks tomorrow
      </motion.p>
    </div>
  )
}
