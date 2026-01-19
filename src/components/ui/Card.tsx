import { motion } from 'framer-motion'
import { ReactNode, CSSProperties } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  style?: CSSProperties
  accentColor?: string
}

export function Card({ children, className = '', hover = true, style, accentColor }: CardProps) {
  const cardStyles: CSSProperties = {
    backgroundColor: 'var(--color-card)',
    border: '2px solid var(--color-border)',
    borderRadius: '1.25rem',
    padding: '1.75rem',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    ...style,
  }

  const hoverAnimation = hover
    ? {
        y: -6,
        borderColor: accentColor || 'var(--color-coral)',
        boxShadow: accentColor
          ? `0 20px 40px -15px ${accentColor}25`
          : '0 20px 40px -15px rgba(255, 107, 107, 0.2)',
      }
    : undefined

  return (
    <motion.div
      className={className}
      style={cardStyles}
      whileHover={hoverAnimation}
    >
      {children}
    </motion.div>
  )
}
