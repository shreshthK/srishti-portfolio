import { motion } from 'framer-motion'
import { FiMapPin, FiCheckCircle } from 'react-icons/fi'
import { SectionWrapper, SectionHeader } from '../ui/SectionWrapper'
import { ScrollReveal } from '../animations/ScrollReveal'
import { portfolioData } from '../../data/portfolio-data'

const timelineColors = [
  { accent: 'var(--color-coral)', bg: 'rgba(255, 107, 107, 0.12)', border: 'rgba(255, 107, 107, 0.3)' },
  { accent: 'var(--color-teal)', bg: 'rgba(20, 184, 166, 0.12)', border: 'rgba(20, 184, 166, 0.3)' },
  { accent: 'var(--color-purple)', bg: 'rgba(167, 139, 250, 0.12)', border: 'rgba(167, 139, 250, 0.3)' },
]

export function Experience() {
  const { experience } = portfolioData

  return (
    <SectionWrapper id="experience">
      <SectionHeader
        title="Professional Journey"
        subtitle="Building expertise through diverse experiences"
      />

      <div style={{ position: 'relative' }}>
        {/* Timeline line with gradient */}
        <div
          style={{
            position: 'absolute',
            left: '2rem',
            top: 0,
            bottom: 0,
            width: '3px',
            background: 'linear-gradient(to bottom, var(--color-coral), var(--color-teal), var(--color-purple))',
            borderRadius: '2px',
          }}
          className="timeline-line"
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {experience.map((exp, index) => {
            const colorScheme = timelineColors[index % timelineColors.length]
            return (
              <ScrollReveal key={exp.id} delay={index * 0.1}>
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                  }}
                  className={`experience-item ${index % 2 === 0 ? 'even' : 'odd'}`}
                >
                  {/* Timeline dot with ring */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '2rem',
                      transform: 'translateX(-50%)',
                      width: '1.25rem',
                      height: '1.25rem',
                      borderRadius: '50%',
                      backgroundColor: colorScheme.accent,
                      border: '4px solid var(--color-background)',
                      boxShadow: `0 0 0 3px ${colorScheme.border}, 0 4px 12px ${colorScheme.border}`,
                      zIndex: 10,
                    }}
                    className="timeline-dot"
                  />

                  {/* Content card */}
                  <motion.div
                    style={{
                      marginLeft: '5rem',
                    }}
                    className="experience-card"
                    whileHover={{ y: -4 }}
                  >
                    <div
                      style={{
                        backgroundColor: 'var(--color-card)',
                        borderRadius: '1.25rem',
                        border: `2px solid var(--color-border)`,
                        padding: '2rem',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Decorative corner gradient */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: '150px',
                          height: '150px',
                          background: `radial-gradient(circle at top right, ${colorScheme.bg}, transparent 70%)`,
                          pointerEvents: 'none',
                        }}
                      />

                      {/* Period badge */}
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.5rem 1rem',
                          borderRadius: '9999px',
                          backgroundColor: colorScheme.bg,
                          color: colorScheme.accent,
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          marginBottom: '1rem',
                          border: `1px solid ${colorScheme.border}`,
                        }}
                      >
                        {exp.period}
                      </span>

                      <h3
                        style={{
                          fontSize: '1.375rem',
                          fontWeight: 700,
                          color: 'var(--color-primary)',
                          marginBottom: '0.5rem',
                          fontFamily: 'var(--font-heading)',
                        }}
                      >
                        {exp.title}
                      </h3>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          color: 'var(--color-secondary)',
                          marginBottom: '1.25rem',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span style={{ fontWeight: 600, color: colorScheme.accent }}>{exp.company}</span>
                        <span style={{ color: 'var(--color-border)', fontSize: '1.25rem' }}>•</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <FiMapPin style={{ width: '0.875rem', height: '0.875rem' }} />
                          <span style={{ fontSize: '0.875rem' }}>{exp.location}</span>
                        </div>
                      </div>

                      <p
                        style={{
                          color: 'var(--color-muted-foreground)',
                          marginBottom: '1.5rem',
                          lineHeight: 1.7,
                        }}
                      >
                        {exp.description}
                      </p>

                      {/* Achievements */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {exp.achievements.map((achievement, achIndex) => (
                          <div
                            key={achIndex}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '0.75rem',
                              fontSize: '0.9375rem',
                            }}
                          >
                            <FiCheckCircle
                              style={{
                                width: '1.125rem',
                                height: '1.125rem',
                                color: colorScheme.accent,
                                marginTop: '0.125rem',
                                flexShrink: 0,
                              }}
                            />
                            <span style={{ color: 'var(--color-foreground)', lineHeight: 1.5 }}>{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .timeline-line {
            left: 50% !important;
            transform: translateX(-50%);
          }
          .timeline-dot {
            left: 50% !important;
          }
          .experience-item {
            flex-direction: row !important;
          }
          .experience-item.even {
            flex-direction: row-reverse !important;
          }
          .experience-card {
            width: 50%;
            margin-left: 0 !important;
          }
          .experience-item.odd .experience-card {
            padding-left: 4rem;
          }
          .experience-item.even .experience-card {
            padding-right: 4rem;
          }
        }
      `}</style>
    </SectionWrapper>
  )
}
