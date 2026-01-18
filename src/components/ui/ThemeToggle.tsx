import { motion } from 'framer-motion'
import { FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '../../context/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      style={{
        position: 'relative',
        width: '2.5rem',
        height: '2.5rem',
        borderRadius: '0.5rem',
        backgroundColor: 'var(--color-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.2s ease',
        border: 'none',
        cursor: 'pointer',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'dark' ? 180 : 0,
          scale: 1,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {theme === 'light' ? (
          <FiSun style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-foreground)' }} />
        ) : (
          <FiMoon style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-foreground)' }} />
        )}
      </motion.div>
    </motion.button>
  )
}
