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
    fontWeight: 600,
    borderRadius: '0.875rem',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    border: 'none',
    textDecoration: 'none',
    fontFamily: 'var(--font-body)',
  }

  const variantStyles: Record<string, CSSProperties> = {
    primary: {
      background: 'linear-gradient(135deg, var(--color-coral), var(--color-amber))',
      color: 'white',
      boxShadow: '0 4px 15px -3px rgba(255, 107, 107, 0.4)',
    },
    secondary: {
      backgroundColor: 'var(--color-muted)',
      color: 'var(--color-foreground)',
      border: '2px solid var(--color-border)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--color-coral)',
      border: '2px solid var(--color-coral)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-foreground)',
    },
  }

  const sizeStyles: Record<string, CSSProperties> = {
    sm: {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      gap: '0.5rem',
    },
    md: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      gap: '0.5rem',
    },
    lg: {
      padding: '1rem 2rem',
      fontSize: '1.0625rem',
      gap: '0.625rem',
    },
  }

  const combinedStyles: CSSProperties = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  }

  const hoverAnimation = variant === 'primary'
    ? {
        scale: 1.03,
        boxShadow: '0 8px 25px -5px rgba(255, 107, 107, 0.5)',
      }
    : variant === 'outline'
    ? {
        scale: 1.03,
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
      }
    : {
        scale: 1.03,
        opacity: 0.9,
      }

  if (href) {
    return (
      <motion.a
        href={href}
        style={combinedStyles}
        className={className}
        whileHover={hoverAnimation}
        whileTap={{ scale: 0.97 }}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      style={combinedStyles}
      className={className}
      whileHover={hoverAnimation}
      whileTap={{ scale: 0.97 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}
