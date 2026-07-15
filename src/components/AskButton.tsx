import { motion } from 'motion/react'
import type { ReactNode } from 'react'

interface AskButtonProps {
  onClick: () => void
  children: ReactNode
  disabled?: boolean
}

/** The glowing call-to-action that sends the question to the oracle. */
export default function AskButton({ onClick, children, disabled }: AskButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="animate-glow cursor-pointer rounded-full border border-neural-400/40 bg-gradient-to-b from-neural-500 to-[#4a1e9e] px-8 py-3.5 font-display text-lg font-semibold tracking-tight text-white shadow-lg transition-colors hover:from-neural-400 hover:to-neural-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neural-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </motion.button>
  )
}
