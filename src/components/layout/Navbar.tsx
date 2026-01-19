import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import { ThemeToggle } from '../ui/ThemeToggle'
import { useScrollSpy } from '../../hooks/useScrollSpy'

const navLinks = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

const navColors = ['var(--color-coral)', 'var(--color-teal)', 'var(--color-amber)', 'var(--color-purple)', 'var(--color-pink)']

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const activeSection = useScrollSpy(navLinks.map(link => link.id))

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: 'all 0.3s ease',
          backgroundColor: isScrolled ? 'var(--color-card)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(16px)' : 'none',
          boxShadow: isScrolled ? '0 4px 20px -5px rgba(0, 0, 0, 0.1)' : 'none',
          borderBottom: isScrolled ? '1px solid var(--color-border)' : 'none',
        }}
      >
        <div
          style={{
            maxWidth: '72rem',
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingLeft: 'clamp(1rem, 5vw, 2rem)',
            paddingRight: 'clamp(1rem, 5vw, 2rem)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '4.5rem',
            }}
          >
            <motion.button
              onClick={() => scrollToSection('hero')}
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-heading)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="gradient-text">SR</span>
            </motion.button>

            {/* Desktop Navigation */}
            <div
              style={{
                display: 'none',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.375rem',
                borderRadius: '1rem',
                backgroundColor: isScrolled ? 'var(--color-muted)' : 'rgba(255, 255, 255, 0.1)',
                backdropFilter: !isScrolled ? 'blur(10px)' : 'none',
              }}
              className="desktop-nav"
            >
              {navLinks.map((link, index) => {
                const isActive = activeSection === link.id
                return (
                  <motion.button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    style={{
                      padding: '0.625rem 1.125rem',
                      borderRadius: '0.75rem',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      transition: 'all 0.2s ease',
                      background: isActive
                        ? `linear-gradient(135deg, ${navColors[index]}20, ${navColors[(index + 1) % navColors.length]}20)`
                        : 'transparent',
                      color: isActive ? navColors[index] : 'var(--color-secondary)',
                      border: 'none',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                    whileHover={{
                      backgroundColor: isActive ? undefined : 'rgba(255, 107, 107, 0.1)',
                      color: isActive ? navColors[index] : 'var(--color-coral)',
                    }}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        style={{
                          position: 'absolute',
                          bottom: '0.375rem',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          backgroundColor: navColors[index],
                        }}
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ThemeToggle />

              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{
                  width: '2.75rem',
                  height: '2.75rem',
                  borderRadius: '0.75rem',
                  backgroundColor: 'var(--color-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--color-border)',
                  cursor: 'pointer',
                }}
                className="mobile-menu-btn"
                aria-label="Toggle menu"
                whileHover={{ borderColor: 'var(--color-coral)' }}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? (
                  <FiX style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-coral)' }} />
                ) : (
                  <FiMenu style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-foreground)' }} />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              left: 0,
              right: 0,
              top: '4.5rem',
              zIndex: 40,
              backgroundColor: 'var(--color-card)',
              backdropFilter: 'blur(16px)',
              borderBottom: '2px solid var(--color-border)',
              boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
            }}
            className="mobile-menu"
          >
            <div
              style={{
                maxWidth: '72rem',
                marginLeft: 'auto',
                marginRight: 'auto',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {navLinks.map((link, index) => {
                  const isActive = activeSection === link.id
                  return (
                    <motion.button
                      key={link.id}
                      onClick={() => scrollToSection(link.id)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '1rem 1.25rem',
                        borderRadius: '0.875rem',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                        background: isActive
                          ? `linear-gradient(135deg, ${navColors[index]}15, ${navColors[(index + 1) % navColors.length]}15)`
                          : 'transparent',
                        color: isActive ? navColors[index] : 'var(--color-secondary)',
                        border: isActive ? `2px solid ${navColors[index]}30` : '2px solid transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                      }}
                      whileHover={{
                        backgroundColor: !isActive ? 'var(--color-muted)' : undefined,
                      }}
                    >
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: navColors[index],
                          opacity: isActive ? 1 : 0.3,
                        }}
                      />
                      {link.label}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}
