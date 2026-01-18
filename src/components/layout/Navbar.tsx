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
          backgroundColor: isScrolled ? 'rgba(var(--color-background), 0.8)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none',
          boxShadow: isScrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
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
              height: '4rem',
            }}
          >
            <motion.button
              onClick={() => scrollToSection('hero')}
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-heading)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="gradient-text">SR</span>
            </motion.button>

            {/* Desktop Navigation */}
            <div
              style={{
                display: 'none',
                alignItems: 'center',
                gap: '0.25rem',
              }}
              className="desktop-nav"
            >
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    background: activeSection === link.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                    color: activeSection === link.id ? 'var(--color-accent)' : 'var(--color-secondary)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ThemeToggle />

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '0.5rem',
                  backgroundColor: 'var(--color-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                }}
                className="mobile-menu-btn"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <FiX style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-foreground)' }} />
                ) : (
                  <FiMenu style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-foreground)' }} />
                )}
              </button>
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
              top: '4rem',
              zIndex: 40,
              backgroundColor: 'var(--color-background)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid var(--color-border)',
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      fontWeight: 500,
                      transition: 'all 0.2s ease',
                      background: activeSection === link.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                      color: activeSection === link.id ? 'var(--color-accent)' : 'var(--color-secondary)',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {link.label}
                  </button>
                ))}
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
