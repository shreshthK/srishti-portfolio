import { ReactNode } from 'react'

interface SectionWrapperProps {
  children: ReactNode
  id: string
  className?: string
  dark?: boolean
}

export function SectionWrapper({ children, id, className = '', dark = false }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={className}
      style={{
        paddingTop: 'clamp(5rem, 10vw, 7rem)',
        paddingBottom: 'clamp(5rem, 10vw, 7rem)',
        backgroundColor: dark ? 'var(--color-muted)' : 'var(--color-background)',
      }}
    >
      <div
        style={{
          maxWidth: '72rem',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: 'clamp(1rem, 5vw, 2rem)',
          paddingRight: 'clamp(1rem, 5vw, 2rem)',
        }}
      >
        {children}
      </div>
    </section>
  )
}

interface SectionHeaderProps {
  title: string
  subtitle?: string
  centered?: boolean
}

export function SectionHeader({ title, subtitle, centered = true }: SectionHeaderProps) {
  return (
    <div
      style={{
        marginBottom: 'clamp(3rem, 5vw, 4rem)',
        textAlign: centered ? 'center' : 'left',
      }}
    >
      <h2
        style={{
          fontSize: 'clamp(1.875rem, 5vw, 3rem)',
          fontWeight: 700,
          color: 'var(--color-primary)',
          marginBottom: '1rem',
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
            color: 'var(--color-secondary)',
            maxWidth: '42rem',
            marginLeft: centered ? 'auto' : '0',
            marginRight: centered ? 'auto' : '0',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
