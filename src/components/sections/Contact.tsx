import { motion } from 'framer-motion'
import { FiMail, FiLinkedin, FiDownload, FiSend } from 'react-icons/fi'
import { ScrollReveal } from '../animations/ScrollReveal'
import { Button } from '../ui/Button'
import { portfolioData } from '../../data/portfolio-data'

export function Contact() {
  const { social } = portfolioData

  return (
    <section
      id="contact"
      style={{
        paddingTop: 'clamp(4rem, 8vw, 6rem)',
        paddingBottom: 'clamp(4rem, 8vw, 6rem)',
        backgroundColor: 'var(--color-muted)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background elements */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <motion.div
          style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, var(--color-coral) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            opacity: 0.25,
          }}
          animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            width: '180px',
            height: '180px',
            background: 'radial-gradient(circle, var(--color-teal) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            opacity: 0.25,
          }}
          animate={{ scale: [1, 1.15, 1], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            right: '30%',
            width: '120px',
            height: '120px',
            background: 'radial-gradient(circle, var(--color-purple) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(50px)',
            opacity: 0.2,
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      <ScrollReveal>
        <div
          style={{
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingLeft: 'clamp(1rem, 5vw, 2rem)',
            paddingRight: 'clamp(1rem, 5vw, 2rem)',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <motion.div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '4rem',
              height: '4rem',
              borderRadius: '1rem',
              background: 'linear-gradient(135deg, var(--color-coral), var(--color-amber))',
              marginBottom: '1.5rem',
              boxShadow: '0 8px 30px -10px rgba(255, 107, 107, 0.4)',
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <FiSend style={{ width: '1.75rem', height: '1.75rem', color: 'white' }} />
          </motion.div>

          <h2
            style={{
              fontSize: 'clamp(2rem, 6vw, 3rem)',
              fontWeight: 800,
              marginBottom: '1rem',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.02em',
            }}
          >
            <span className="gradient-text">Let's Connect</span>
          </h2>
          <p
            style={{
              color: 'var(--color-secondary)',
              marginBottom: '2.5rem',
              lineHeight: 1.7,
              fontSize: '1.125rem',
              maxWidth: '500px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Interested in discussing opportunities or collaborations? Feel free to reach out!
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <motion.a
              href={`mailto:${social.email}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 1.5rem',
                borderRadius: '1rem',
                backgroundColor: 'var(--color-card)',
                border: '2px solid var(--color-border)',
                textDecoration: 'none',
                color: 'var(--color-primary)',
                fontWeight: 600,
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px -4px rgba(0, 0, 0, 0.05)',
              }}
              whileHover={{
                y: -4,
                borderColor: 'var(--color-coral)',
                boxShadow: '0 12px 30px -10px rgba(255, 107, 107, 0.3)',
              }}
            >
              <div
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '0.625rem',
                  backgroundColor: 'rgba(255, 107, 107, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FiMail style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-coral)' }} />
              </div>
              {social.email}
            </motion.a>

            <motion.a
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 1.5rem',
                borderRadius: '1rem',
                backgroundColor: 'var(--color-card)',
                border: '2px solid var(--color-border)',
                textDecoration: 'none',
                color: 'var(--color-primary)',
                fontWeight: 600,
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px -4px rgba(0, 0, 0, 0.05)',
              }}
              whileHover={{
                y: -4,
                borderColor: 'var(--color-blue)',
                boxShadow: '0 12px 30px -10px rgba(59, 130, 246, 0.3)',
              }}
            >
              <div
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '0.625rem',
                  backgroundColor: 'rgba(59, 130, 246, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FiLinkedin style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-blue)' }} />
              </div>
              LinkedIn
            </motion.a>

            <Button href="/Srishti Rawat resume.pdf" variant="outline" size="lg">
              <FiDownload style={{ width: '1.125rem', height: '1.125rem' }} />
              Resume
            </Button>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
