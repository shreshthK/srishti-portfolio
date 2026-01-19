import { motion } from 'framer-motion'
import { FiArrowDown, FiLinkedin, FiMail } from 'react-icons/fi'
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
    { icon: FiLinkedin, href: social.linkedin, label: 'LinkedIn', color: 'var(--color-blue)' },
    { icon: FiMail, href: `mailto:${social.email}`, label: 'Email', color: 'var(--color-coral)' },
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
      {/* Colorful floating shapes */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {/* Coral blob - top left */}
        <motion.div
          className="animate-float"
          style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: 'clamp(200px, 30vw, 400px)',
            height: 'clamp(200px, 30vw, 400px)',
            background: 'radial-gradient(circle, var(--color-coral) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            opacity: 0.4,
          }}
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Amber blob - top right */}
        <motion.div
          className="animate-float-reverse"
          style={{
            position: 'absolute',
            top: '5%',
            right: '10%',
            width: 'clamp(150px, 25vw, 350px)',
            height: 'clamp(150px, 25vw, 350px)',
            background: 'radial-gradient(circle, var(--color-amber) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(70px)',
            opacity: 0.35,
          }}
          animate={{
            scale: [1, 1.15, 1],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Teal blob - bottom left */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '15%',
            width: 'clamp(180px, 28vw, 380px)',
            height: 'clamp(180px, 28vw, 380px)',
            background: 'radial-gradient(circle, var(--color-teal) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(75px)',
            opacity: 0.35,
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />

        {/* Purple blob - bottom right */}
        <motion.div
          className="animate-pulse-soft"
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '5%',
            width: 'clamp(120px, 20vw, 280px)',
            height: 'clamp(120px, 20vw, 280px)',
            background: 'radial-gradient(circle, var(--color-purple) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            opacity: 0.4,
          }}
        />

        {/* Decorative geometric shapes */}
        <motion.div
          style={{
            position: 'absolute',
            top: '25%',
            right: '20%',
            width: '60px',
            height: '60px',
            border: '3px solid var(--color-amber)',
            borderRadius: '12px',
            opacity: 0.3,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        <motion.div
          style={{
            position: 'absolute',
            bottom: '30%',
            left: '25%',
            width: '40px',
            height: '40px',
            backgroundColor: 'var(--color-teal)',
            borderRadius: '50%',
            opacity: 0.2,
          }}
          animate={{ y: [0, -15, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          style={{
            position: 'absolute',
            top: '60%',
            right: '30%',
            width: '30px',
            height: '30px',
            backgroundColor: 'var(--color-pink)',
            opacity: 0.25,
            transform: 'rotate(45deg)',
          }}
          animate={{ rotate: [45, 90, 45], scale: [1, 1.3, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Subtle dot pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: 'radial-gradient(var(--color-primary) 1.5px, transparent 1.5px)',
          backgroundSize: '30px 30px',
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
            style={{ marginBottom: '1.5rem' }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.15), rgba(245, 158, 11, 0.15))',
                border: '1px solid rgba(255, 107, 107, 0.2)',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--color-coral)',
              }}
            >
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-teal)',
                animation: 'pulse-soft 2s ease-in-out infinite',
              }} />
              Available for opportunities
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.75rem, 10vw, 5.5rem)',
              fontWeight: 800,
              color: 'var(--color-primary)',
              marginBottom: '1rem',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
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
              fontSize: 'clamp(1.25rem, 4vw, 2rem)',
              color: 'var(--color-secondary)',
              marginBottom: '1.5rem',
              fontWeight: 500,
              fontFamily: 'var(--font-heading)',
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
              maxWidth: '38rem',
              marginBottom: '2.5rem',
              lineHeight: 1.7,
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
                  width: '3.25rem',
                  height: '3.25rem',
                  borderRadius: '1rem',
                  backgroundColor: 'var(--color-card)',
                  border: '2px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: link.color,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                }}
                whileHover={{
                  scale: 1.1,
                  borderColor: link.color,
                  boxShadow: `0 8px 25px -5px ${link.color}33`,
                }}
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
          whileHover={{ color: 'var(--color-coral)' }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Scroll Down</span>
          <FiArrowDown style={{ width: '1.25rem', height: '1.25rem' }} />
        </motion.button>
      </motion.div>
    </section>
  )
}
