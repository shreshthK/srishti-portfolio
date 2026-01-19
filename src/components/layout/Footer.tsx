import { FiLinkedin, FiMail, FiHeart } from 'react-icons/fi'
import { portfolioData } from '../../data/portfolio-data'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { social } = portfolioData

  const socialLinks = [
    { icon: FiLinkedin, href: social.linkedin, label: 'LinkedIn' },
    { icon: FiMail, href: `mailto:${social.email}`, label: 'Email' },
  ]

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-muted)',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <div
        style={{
          maxWidth: '72rem',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: 'clamp(1.5rem, 5vw, 2.5rem)',
          paddingRight: 'clamp(1.5rem, 5vw, 2.5rem)',
          paddingTop: '2.5rem',
          paddingBottom: '2.5rem',
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
          {/* Social Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '2.75rem',
                  height: '2.75rem',
                  borderRadius: '0.5rem',
                  backgroundColor: 'var(--color-background)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-secondary)',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                }}
                aria-label={link.label}
              >
                <link.icon style={{ width: '1.25rem', height: '1.25rem' }} />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: 'var(--color-secondary)',
              flexWrap: 'wrap',
            }}
          >
            <span>&copy; {currentYear} {portfolioData.name}.</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Made with
              <FiHeart style={{ width: '1rem', height: '1rem', color: 'var(--color-accent)' }} />
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
