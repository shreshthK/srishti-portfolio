import { motion } from 'framer-motion'
import { ReactNode, CSSProperties } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  style?: CSSProperties
}

export function Card({ children, className = '', hover = true, style }: CardProps) {
  const cardStyles: CSSProperties = {
    backgroundColor: 'var(--color-card)',
    border: '1px solid var(--color-border)',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    transition: 'all 0.3s ease',
    ...style,
  }

  return (
    <motion.div
      className={className}
      style={cardStyles}
      whileHover={hover ? { y: -4, borderColor: 'rgba(99, 102, 241, 0.5)' } : undefined}
    >
      {children}
    </motion.div>
  )
}
