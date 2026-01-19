import { motion } from 'framer-motion'
import { FiAward } from 'react-icons/fi'
import { SectionWrapper, SectionHeader } from '../ui/SectionWrapper'
import { ScrollReveal } from '../animations/ScrollReveal'
import { portfolioData } from '../../data/portfolio-data'
import avatarImage from '../../images/avatar.png'

const statColors = [
  { bg: 'rgba(255, 107, 107, 0.12)', color: 'var(--color-coral)', border: 'rgba(255, 107, 107, 0.3)' },
  { bg: 'rgba(20, 184, 166, 0.12)', color: 'var(--color-teal)', border: 'rgba(20, 184, 166, 0.3)' },
  { bg: 'rgba(245, 158, 11, 0.12)', color: 'var(--color-amber)', border: 'rgba(245, 158, 11, 0.3)' },
  { bg: 'rgba(167, 139, 250, 0.12)', color: 'var(--color-purple)', border: 'rgba(167, 139, 250, 0.3)' },
]

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
        {/* Profile Image */}
        <ScrollReveal direction="left">
          <div style={{ position: 'relative' }}>
            {/* Decorative elements behind the image */}
            <motion.div
              style={{
                position: 'absolute',
                top: '-20px',
                left: '-20px',
                width: '100px',
                height: '100px',
                background: 'radial-gradient(circle, var(--color-coral) 0%, transparent 70%)',
                filter: 'blur(40px)',
                opacity: 0.4,
              }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              style={{
                position: 'absolute',
                bottom: '-20px',
                right: '-20px',
                width: '120px',
                height: '120px',
                background: 'radial-gradient(circle, var(--color-teal) 0%, transparent 70%)',
                filter: 'blur(40px)',
                opacity: 0.4,
              }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />

            <div
              style={{
                aspectRatio: '1',
                maxWidth: '400px',
                margin: '0 auto',
                borderRadius: '1.5rem',
                background: 'linear-gradient(135deg, var(--color-coral), var(--color-amber), var(--color-teal))',
                padding: '4px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 'calc(1.5rem - 4px)',
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
                    borderRadius: 'calc(1.5rem - 4px)',
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
                    lineHeight: 1.8,
                    marginBottom: '1.25rem',
                    fontSize: '1.0625rem',
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
              {stats.map((stat, index) => {
                const colorScheme = statColors[index % statColors.length]
                return (
                  <motion.div
                    key={index}
                    style={{
                      textAlign: 'center',
                      padding: '1.5rem 0.75rem',
                      borderRadius: '1rem',
                      backgroundColor: 'var(--color-card)',
                      border: `2px solid ${colorScheme.border}`,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    whileHover={{
                      y: -4,
                      boxShadow: `0 12px 30px -10px ${colorScheme.border}`,
                    }}
                  >
                    {/* Decorative gradient */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, ${colorScheme.color}, transparent)`,
                      }}
                    />
                    <div
                      style={{
                        fontSize: 'clamp(1.75rem, 5vw, 2.25rem)',
                        fontWeight: 800,
                        color: colorScheme.color,
                        marginBottom: '0.375rem',
                        fontFamily: 'var(--font-heading)',
                      }}
                    >
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-secondary)', fontWeight: 500 }}>
                      {stat.label}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.2}>
            <div
              style={{
                padding: '1.75rem',
                borderRadius: '1.25rem',
                backgroundColor: 'var(--color-card)',
                border: '2px solid var(--color-border)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                <div
                  style={{
                    width: '2.25rem',
                    height: '2.25rem',
                    borderRadius: '0.625rem',
                    backgroundColor: 'rgba(245, 158, 11, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FiAward style={{ color: 'var(--color-amber)', width: '1.125rem', height: '1.125rem' }} />
                </div>
                Education
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {education.map((edu, index) => (
                  <motion.div
                    key={index}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '0.875rem',
                      backgroundColor: 'var(--color-muted)',
                      border: '1px solid var(--color-border)',
                      transition: 'all 0.2s ease',
                    }}
                    whileHover={{
                      borderColor: 'var(--color-teal)',
                      backgroundColor: 'rgba(20, 184, 166, 0.05)',
                    }}
                  >
                    <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.375rem' }}>
                      {edu.degree}
                    </div>
                    <div style={{ fontSize: '0.9375rem', color: 'var(--color-secondary)' }}>
                      {edu.school} • <span style={{ color: 'var(--color-teal)', fontWeight: 600 }}>{edu.year}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </SectionWrapper>
  )
}
