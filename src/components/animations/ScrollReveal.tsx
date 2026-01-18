import { motion, useInView } from 'framer-motion'
import { ReactNode, useRef } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
  once?: boolean
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.5,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: '-50px' })

  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
    none: { y: 0, x: 0 },
  }

  const initial = {
    opacity: 0,
    ...directions[direction],
  }

  const animate = {
    opacity: isInView ? 1 : 0,
    y: isInView ? 0 : directions[direction].y,
    x: isInView ? 0 : directions[direction].x,
  }

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerChildrenProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  style?: React.CSSProperties
}

export function StaggerChildren({
  children,
  className = '',
  staggerDelay = 0.1,
  style,
}: StaggerChildrenProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
}
