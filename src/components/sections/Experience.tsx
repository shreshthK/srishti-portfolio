import { motion } from 'framer-motion'
import { FiMapPin, FiCheckCircle } from 'react-icons/fi'
import { SectionWrapper, SectionHeader } from '../ui/SectionWrapper'
import { ScrollReveal } from '../animations/ScrollReveal'
import { portfolioData } from '../../data/portfolio-data'

export function Experience() {
  const { experience } = portfolioData

  return (
    <SectionWrapper id="experience">
      <SectionHeader
        title="Professional Journey"
        subtitle="Building expertise through diverse experiences"
      />

      <div style={{ position: 'relative' }}>
        {/* Timeline line - hidden on mobile, shown on desktop */}
        <div
          style={{
            position: 'absolute',
            left: '2rem',
            top: 0,
            bottom: 0,
            width: '2px',
            backgroundColor: 'var(--color-border)',
          }}
          className="timeline-line"
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {experience.map((exp, index) => (
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
                {/* Timeline dot */}
                <div
                  style={{
                    position: 'absolute',
                    left: '2rem',
                    transform: 'translateX(-50%)',
                    width: '1rem',
                    height: '1rem',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-accent)',
                    border: '4px solid var(--color-background)',
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
                      borderRadius: '1rem',
                      border: '1px solid var(--color-border)',
                      padding: '2rem',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {/* Period badge */}
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.375rem 0.875rem',
                        borderRadius: '9999px',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        color: 'var(--color-accent)',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        marginBottom: '1rem',
                      }}
                    >
                      {exp.period}
                    </span>

                    <h3
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: 'var(--color-primary)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {exp.title}
                    </h3>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--color-secondary)',
                        marginBottom: '1rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>{exp.company}</span>
                      <span style={{ color: 'var(--color-border)' }}>|</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <FiMapPin style={{ width: '0.875rem', height: '0.875rem' }} />
                        <span style={{ fontSize: '0.875rem' }}>{exp.location}</span>
                      </div>
                    </div>

                    <p
                      style={{
                        color: 'var(--color-muted-foreground)',
                        marginBottom: '1.25rem',
                        lineHeight: 1.6,
                      }}
                    >
                      {exp.description}
                    </p>

                    {/* Achievements */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      {exp.achievements.map((achievement, achIndex) => (
                        <div
                          key={achIndex}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.625rem',
                            fontSize: '0.875rem',
                          }}
                        >
                          <FiCheckCircle
                            style={{
                              width: '1rem',
                              height: '1rem',
                              color: '#22c55e',
                              marginTop: '0.125rem',
                              flexShrink: 0,
                            }}
                          />
                          <span style={{ color: 'var(--color-foreground)' }}>{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </ScrollReveal>
          ))}
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
