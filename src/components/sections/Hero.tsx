import { motion } from 'framer-motion'
import { FiArrowDown, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { Button } from '../ui/Button'
import { portfolioData } from '../../data/portfolio-data'

export function Hero() {
  const { name, title, tagline, social } = portfolioData

  const scrollToContact = () => {
    const element = document.getElementById('contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToExperience = () => {
    const element = document.getElementById('experience')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const socialLinks = [
    { icon: FiLinkedin, href: social.linkedin, label: 'LinkedIn' },
    { icon: FiMail, href: `mailto:${social.email}`, label: 'Email' },
  ]

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--color-background)',
      }}
    >
      {/* Animated background gradient */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-50%',
            right: '-50%',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(129, 140, 248, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.02,
          backgroundImage: 'radial-gradient(var(--color-primary) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div
        style={{
          maxWidth: '72rem',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: 'clamp(1rem, 5vw, 2rem)',
          paddingRight: 'clamp(1rem, 5vw, 2rem)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: '1rem' }}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                color: 'var(--color-accent)',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              Available for opportunities
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '1rem',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Hi, I'm{' '}
            <span className="gradient-text">{name.split(' ')[0]}</span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: 'clamp(1.25rem, 4vw, 1.875rem)',
              color: 'var(--color-secondary)',
              marginBottom: '1.5rem',
              fontWeight: 500,
            }}
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
              color: 'var(--color-muted-foreground)',
              maxWidth: '42rem',
              marginBottom: '2rem',
            }}
          >
            {tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '3rem',
            }}
          >
            <Button size="lg" onClick={scrollToContact}>
              Get in Touch
            </Button>
            <Button variant="outline" size="lg" onClick={scrollToExperience}>
              View Experience
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
          >
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '0.75rem',
                  backgroundColor: 'var(--color-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-secondary)',
                  transition: 'all 0.2s ease',
                }}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                whileTap={{ scale: 0.95 }}
                aria-label={link.label}
              >
                <link.icon style={{ width: '1.25rem', height: '1.25rem' }} />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <motion.button
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--color-muted-foreground)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.2s ease',
          }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span style={{ fontSize: '0.875rem' }}>Scroll Down</span>
          <FiArrowDown style={{ width: '1.25rem', height: '1.25rem' }} />
        </motion.button>
      </motion.div>
    </section>
  )
}
