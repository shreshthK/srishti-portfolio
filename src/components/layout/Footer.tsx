import { motion } from 'framer-motion'
import { FiLinkedin, FiMail, FiHeart } from 'react-icons/fi'
import { portfolioData } from '../../data/portfolio-data'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { social } = portfolioData

  const socialLinks = [
    { icon: FiLinkedin, href: social.linkedin, label: 'LinkedIn', color: 'var(--color-blue)' },
    { icon: FiMail, href: `mailto:${social.email}`, label: 'Email', color: 'var(--color-coral)' },
  ]

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-background)',
        borderTop: '2px solid var(--color-border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle gradient accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, var(--color-coral), var(--color-amber), var(--color-teal), var(--color-purple))',
        }}
      />

      <div
        style={{
          maxWidth: '72rem',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: 'clamp(1.5rem, 5vw, 2.5rem)',
          paddingRight: 'clamp(1.5rem, 5vw, 2.5rem)',
          paddingTop: '3rem',
          paddingBottom: '3rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            textAlign: 'center',
          }}
        >
          {/* Logo */}
          <motion.span
            className="gradient-text"
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
            }}
            whileHover={{ scale: 1.05 }}
          >
            SR
          </motion.span>

          {/* Social Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '0.875rem',
                  backgroundColor: 'var(--color-muted)',
                  border: '2px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: link.color,
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                }}
                whileHover={{
                  scale: 1.1,
                  borderColor: link.color,
                  boxShadow: `0 8px 20px -8px ${link.color}40`,
                }}
                whileTap={{ scale: 0.95 }}
                aria-label={link.label}
              >
                <link.icon style={{ width: '1.25rem', height: '1.25rem' }} />
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.9375rem',
              color: 'var(--color-secondary)',
              flexWrap: 'wrap',
            }}
          >
            <span>&copy; {currentYear} {portfolioData.name}.</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              Made with
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              >
                <FiHeart style={{ width: '1rem', height: '1rem', color: 'var(--color-coral)', fill: 'var(--color-coral)' }} />
              </motion.span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
