import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode, CSSProperties } from 'react'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children' | 'style'> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  className?: string
  style?: CSSProperties
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  style,
  ...props
}: ButtonProps) {
  const baseStyles: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
    borderRadius: '0.5rem',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    border: 'none',
    textDecoration: 'none',
  }

  const variantStyles: Record<string, CSSProperties> = {
    primary: {
      backgroundColor: 'var(--color-accent)',
      color: 'white',
    },
    secondary: {
      backgroundColor: 'var(--color-muted)',
      color: 'var(--color-foreground)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--color-accent)',
      border: '2px solid var(--color-accent)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-foreground)',
    },
  }

  const sizeStyles: Record<string, CSSProperties> = {
    sm: {
      padding: '0.375rem 0.75rem',
      fontSize: '0.875rem',
      gap: '0.375rem',
    },
    md: {
      padding: '0.625rem 1.25rem',
      fontSize: '1rem',
      gap: '0.5rem',
    },
    lg: {
      padding: '0.875rem 1.75rem',
      fontSize: '1.125rem',
      gap: '0.625rem',
    },
  }

  const combinedStyles: CSSProperties = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  }

  if (href) {
    return (
      <motion.a
        href={href}
        style={combinedStyles}
        className={className}
        whileHover={{ scale: 1.02, opacity: 0.9 }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      style={combinedStyles}
      className={className}
      whileHover={{ scale: 1.02, opacity: 0.9 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}
