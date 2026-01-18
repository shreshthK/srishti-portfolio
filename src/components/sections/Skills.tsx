import { motion } from 'framer-motion'
import { SectionWrapper, SectionHeader } from '../ui/SectionWrapper'
import { ScrollReveal, StaggerChildren, staggerItemVariants } from '../animations/ScrollReveal'
import { Card } from '../ui/Card'
import { portfolioData } from '../../data/portfolio-data'
import { FiLayers, FiTrello, FiBarChart2, FiUsers } from 'react-icons/fi'

const categoryIcons: Record<string, React.ElementType> = {
  process: FiLayers,
  agile: FiTrello,
  analytics: FiBarChart2,
  crm: FiUsers,
}

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
          marginBottom: '3rem',
        }}
      >
        {skills.categories.map((category, index) => {
          const Icon = categoryIcons[category.icon] || FiLayers
          return (
            <ScrollReveal key={index} delay={index * 0.1}>
              <Card className="h-full">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '0.5rem',
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-accent)' }} />
                  </div>
                  <h3
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: 'var(--color-primary)',
                    }}
                  >
                    {category.name}
                  </h3>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {category.tools.map((tool, toolIndex) => (
                    <span
                      key={toolIndex}
                      style={{
                        padding: '0.375rem 0.75rem',
                        borderRadius: '0.375rem',
                        backgroundColor: 'var(--color-muted)',
                        color: 'var(--color-foreground)',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </Card>
            </ScrollReveal>
          )
        })}
      </div>

      {/* Soft Skills */}
      <ScrollReveal delay={0.2}>
        <div style={{ textAlign: 'center' }}>
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'var(--color-primary)',
              marginBottom: '1.5rem',
            }}
          >
            Core Competencies
          </h3>
          <StaggerChildren
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.75rem',
            }}
          >
            {skills.softSkills.map((skill, index) => (
              <motion.span
                key={index}
                variants={staggerItemVariants}
                style={{
                  padding: '0.625rem 1.25rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  color: 'var(--color-accent)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                {skill}
              </motion.span>
            ))}
          </StaggerChildren>
        </div>
      </ScrollReveal>
    </SectionWrapper>
  )
}
