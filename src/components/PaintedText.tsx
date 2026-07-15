import { motion, stagger, useReducedMotion, type Variants } from 'motion/react'

interface PaintedTextProps {
  /** The text to paint on, character by character. */
  text: string
  /** Class applied to the wrapping element. */
  className?: string
  /** Seconds before the first character appears. */
  startDelay?: number
  /** Seconds between each character. */
  perChar?: number
  /** Fired once the whole reveal has finished. */
  onDone?: () => void
}

/**
 * Reveals text as if being painted onto the page: each character fades up and
 * un-blurs in a staggered wave. Collapses to a plain fade under reduced motion.
 * The full string is exposed to assistive tech via aria-label; the per-character
 * spans are hidden from it.
 */
export default function PaintedText({
  text,
  className,
  startDelay = 0.15,
  perChar = 0.035,
  onDone,
}: PaintedTextProps) {
  const reduce = useReducedMotion()

  const container: Variants = {
    hidden: {},
    show: {
      transition: { delayChildren: stagger(reduce ? 0 : perChar, { startDelay }) },
    },
  }

  const char: Variants = {
    hidden: reduce
      ? { opacity: 0 }
      : { opacity: 0, y: '0.4em', filter: 'blur(10px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: reduce ? 0.2 : 0.55, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  }

  const chars = Array.from(text)

  return (
    <motion.span
      className={className}
      aria-label={text}
      variants={container}
      initial="hidden"
      animate="show"
      onAnimationComplete={onDone}
      style={{ display: 'inline-block' }}
    >
      {chars.map((c, i) => (
        <motion.span
          key={i}
          aria-hidden
          variants={char}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {c === ' ' ? ' ' : c}
        </motion.span>
      ))}
    </motion.span>
  )
}
