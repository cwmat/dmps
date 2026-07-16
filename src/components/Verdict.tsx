import { motion } from 'motion/react'
import type { Answer } from '../types'
import PaintedText from './PaintedText'

/** The reveal: a big painted YES/NO, the quip, and a daily-reset flourish. */
export default function Verdict({ answer }: { answer: Answer }) {
  const isYes = answer.verdict === 'yes'

  return (
    <div className="flex flex-col items-center">
      <PaintedText
        // key by quip so the paint animation replays for each fresh verdict
        key={`${answer.verdict}-${answer.quip}`}
        text={isYes ? 'YES.' : 'NO.'}
        perChar={0.08}
        className={`font-display text-7xl font-black tracking-tight sm:text-8xl ${
          isYes
            ? 'text-stink-400 drop-shadow-[0_2px_36px_rgba(124,255,107,0.5)]'
            : 'text-fresh-400 drop-shadow-[0_2px_36px_rgba(89,211,255,0.5)]'
        }`}
      />

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] }}
        className="legible mt-7 max-w-lg text-balance text-xl leading-relaxed text-ink"
      >
        {answer.quip}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.9 }}
        className="legible mt-11 font-display text-[0.7rem] font-medium uppercase tracking-[0.3em] text-ink/75"
      >
        The oracle has spoken · come back tomorrow
      </motion.p>
    </div>
  )
}
