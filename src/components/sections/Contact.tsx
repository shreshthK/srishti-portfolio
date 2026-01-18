import { motion } from 'framer-motion'
import { FiMail, FiLinkedin, FiDownload } from 'react-icons/fi'
import { ScrollReveal } from '../animations/ScrollReveal'
import { Button } from '../ui/Button'
import { portfolioData } from '../../data/portfolio-data'

export function Contact() {
  const { social } = portfolioData

  return (
    <section
      id="contact"
      style={{
        paddingTop: 'clamp(3rem, 6vw, 4rem)',
        paddingBottom: 'clamp(3rem, 6vw, 4rem)',
        backgroundColor: 'var(--color-muted)',
      }}
    >
      <ScrollReveal>
        <div
          style={{
            maxWidth: '700px',
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '1rem',
            }}
          >
            Let's Connect
          </h2>
          <p
            style={{
              color: 'var(--color-secondary)',
              marginBottom: '2rem',
              lineHeight: 1.6,
            }}
          >
            Interested in discussing opportunities or collaborations? Feel free to reach out.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <motion.a
              href={`mailto:${social.email}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                borderRadius: '0.5rem',
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                textDecoration: 'none',
                color: 'var(--color-primary)',
                fontWeight: 500,
                fontSize: '0.9375rem',
                transition: 'all 0.2s ease',
              }}
              whileHover={{ y: -2, borderColor: 'rgba(99, 102, 241, 0.5)' }}
            >
              <FiMail style={{ width: '1.125rem', height: '1.125rem', color: 'var(--color-accent)' }} />
              {social.email}
            </motion.a>

            <motion.a
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                borderRadius: '0.5rem',
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                textDecoration: 'none',
                color: 'var(--color-primary)',
                fontWeight: 500,
                fontSize: '0.9375rem',
                transition: 'all 0.2s ease',
              }}
              whileHover={{ y: -2, borderColor: 'rgba(99, 102, 241, 0.5)' }}
            >
              <FiLinkedin style={{ width: '1.125rem', height: '1.125rem', color: 'var(--color-accent)' }} />
              LinkedIn
            </motion.a>

            <Button href="/Srishti Rawat resume.pdf" variant="outline" size="md">
              <FiDownload style={{ width: '1rem', height: '1rem' }} />
              Resume
            </Button>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
