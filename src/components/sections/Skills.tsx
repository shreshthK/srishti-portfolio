import { motion } from 'framer-motion'
import { SectionWrapper, SectionHeader } from '../ui/SectionWrapper'
import { ScrollReveal, StaggerChildren, staggerItemVariants } from '../animations/ScrollReveal'
import { portfolioData } from '../../data/portfolio-data'
import { FiLayers, FiTrello, FiBarChart2, FiUsers } from 'react-icons/fi'

const categoryConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
  process: {
    icon: FiLayers,
    color: 'var(--color-coral)',
    bgColor: 'rgba(255, 107, 107, 0.12)',
  },
  agile: {
    icon: FiTrello,
    color: 'var(--color-teal)',
    bgColor: 'rgba(20, 184, 166, 0.12)',
  },
  analytics: {
    icon: FiBarChart2,
    color: 'var(--color-amber)',
    bgColor: 'rgba(245, 158, 11, 0.12)',
  },
  crm: {
    icon: FiUsers,
    color: 'var(--color-purple)',
    bgColor: 'rgba(167, 139, 250, 0.12)',
  },
}

const softSkillColors = [
  { bg: 'rgba(255, 107, 107, 0.12)', color: 'var(--color-coral)', border: 'rgba(255, 107, 107, 0.3)' },
  { bg: 'rgba(20, 184, 166, 0.12)', color: 'var(--color-teal)', border: 'rgba(20, 184, 166, 0.3)' },
  { bg: 'rgba(245, 158, 11, 0.12)', color: 'var(--color-amber)', border: 'rgba(245, 158, 11, 0.3)' },
  { bg: 'rgba(167, 139, 250, 0.12)', color: 'var(--color-purple)', border: 'rgba(167, 139, 250, 0.3)' },
  { bg: 'rgba(244, 114, 182, 0.12)', color: 'var(--color-pink)', border: 'rgba(244, 114, 182, 0.3)' },
  { bg: 'rgba(59, 130, 246, 0.12)', color: 'var(--color-blue)', border: 'rgba(59, 130, 246, 0.3)' },
]

export function Skills() {
  const { skills } = portfolioData

  return (
    <SectionWrapper id="skills">
      <SectionHeader
        title="Skills & Expertise"
        subtitle="Technical tools and soft skills developed across technology and operations"
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '1.5rem',
          marginBottom: '4rem',
        }}
      >
        {skills.categories.map((category, index) => {
          const config = categoryConfig[category.icon] || categoryConfig.process
          const Icon = config.icon
          return (
            <ScrollReveal key={index} delay={index * 0.1}>
              <motion.div
                style={{
                  backgroundColor: 'var(--color-card)',
                  borderRadius: '1.25rem',
                  padding: '1.75rem',
                  border: '2px solid var(--color-border)',
                  transition: 'all 0.3s ease',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                whileHover={{
                  y: -6,
                  borderColor: config.color,
                  boxShadow: `0 20px 40px -15px ${config.color}25`,
                }}
              >
                {/* Decorative corner gradient */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '120px',
                    height: '120px',
                    background: `radial-gradient(circle at top right, ${config.bgColor}, transparent 70%)`,
                    pointerEvents: 'none',
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.5rem', position: 'relative' }}>
                  <div
                    style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '0.875rem',
                      backgroundColor: config.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `2px solid ${config.color}30`,
                    }}
                  >
                    <Icon style={{ width: '1.375rem', height: '1.375rem', color: config.color }} />
                  </div>
                  <h3
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    {category.name}
                  </h3>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', position: 'relative' }}>
                  {category.tools.map((tool, toolIndex) => (
                    <motion.span
                      key={toolIndex}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        backgroundColor: 'var(--color-muted)',
                        color: 'var(--color-foreground)',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        border: '1px solid var(--color-border)',
                        transition: 'all 0.2s ease',
                      }}
                      whileHover={{
                        backgroundColor: config.bgColor,
                        color: config.color,
                        borderColor: `${config.color}40`,
                      }}
                    >
                      {tool}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </ScrollReveal>
          )
        })}
      </div>

      {/* Soft Skills */}
      <ScrollReveal delay={0.2}>
        <div
          style={{
            textAlign: 'center',
            padding: '3rem',
            borderRadius: '1.5rem',
            backgroundColor: 'var(--color-card)',
            border: '2px solid var(--color-border)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative blobs */}
          <div
            style={{
              position: 'absolute',
              top: '-50px',
              left: '-50px',
              width: '150px',
              height: '150px',
              background: 'radial-gradient(circle, var(--color-coral) 0%, transparent 70%)',
              filter: 'blur(50px)',
              opacity: 0.2,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-50px',
              right: '-50px',
              width: '150px',
              height: '150px',
              background: 'radial-gradient(circle, var(--color-teal) 0%, transparent 70%)',
              filter: 'blur(50px)',
              opacity: 0.2,
              pointerEvents: 'none',
            }}
          />

          <h3
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '2rem',
              fontFamily: 'var(--font-heading)',
              position: 'relative',
            }}
          >
            <span className="gradient-text">Core Competencies</span>
          </h3>

          <StaggerChildren
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.875rem',
              position: 'relative',
            }}
          >
            {skills.softSkills.map((skill, index) => {
              const colorScheme = softSkillColors[index % softSkillColors.length]
              return (
                <motion.span
                  key={index}
                  variants={staggerItemVariants}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '9999px',
                    backgroundColor: colorScheme.bg,
                    color: colorScheme.color,
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    border: `2px solid ${colorScheme.border}`,
                    transition: 'all 0.2s ease',
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: `0 8px 20px -8px ${colorScheme.border}`,
                  }}
                >
                  {skill}
                </motion.span>
              )
            })}
          </StaggerChildren>
        </div>
      </ScrollReveal>
    </SectionWrapper>
  )
}
