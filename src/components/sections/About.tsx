import { motion } from 'framer-motion'
import { FiAward } from 'react-icons/fi'
import { SectionWrapper, SectionHeader } from '../ui/SectionWrapper'
import { ScrollReveal } from '../animations/ScrollReveal'
import { portfolioData } from '../../data/portfolio-data'
import avatarImage from '../../images/avatar.png'

export function About() {
  const { name, bio, stats, education } = portfolioData

  return (
    <SectionWrapper id="about" dark>
      <SectionHeader
        title="About Me"
        subtitle="Passionate about driving results through effective coordination and process improvement"
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
          gap: '3rem',
          alignItems: 'center',
        }}
      >
        {/* Profile Image Placeholder */}
        <ScrollReveal direction="left">
          <div style={{ position: 'relative' }}>
            <div
              style={{
                aspectRatio: '1',
                maxWidth: '400px',
                margin: '0 auto',
                borderRadius: '1rem',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(129, 140, 248, 0.2))',
                padding: '4px',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '0.875rem',
                  backgroundColor: 'var(--color-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={avatarImage}
                  alt={`${name} profile`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '0.875rem',
                  }}
                />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Bio and Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <ScrollReveal direction="right">
            <div>
              {bio.split('\n\n').map((paragraph, index) => (
                <p
                  key={index}
                  style={{
                    color: 'var(--color-foreground)',
                    lineHeight: 1.7,
                    marginBottom: '1rem',
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.1}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem',
              }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  style={{
                    textAlign: 'center',
                    padding: '1.25rem 0.75rem',
                    borderRadius: '0.75rem',
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                  }}
                  whileHover={{ y: -4, borderColor: 'rgba(99, 102, 241, 0.5)' }}
                >
                  <div
                    className="gradient-text"
                    style={{
                      fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                      fontWeight: 700,
                      marginBottom: '0.25rem',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary)' }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.2}>
            <div>
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: 'var(--color-primary)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <FiAward style={{ color: 'var(--color-accent)' }} />
                Education
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {education.map((edu, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                      {edu.degree}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-secondary)' }}>
                      {edu.school} • {edu.year}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </SectionWrapper>
  )
}
