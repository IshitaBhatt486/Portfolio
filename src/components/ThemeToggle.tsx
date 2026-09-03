import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const nextTheme = theme === 'light' ? 'dark' : 'light'

  return (
    <button
      className={`theme-toggle theme-toggle--${theme}`}
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
      aria-pressed={theme === 'dark'}
    >
      <span className="theme-toggle__orbit" aria-hidden="true" />
      <span className="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true"><Sun size={14} strokeWidth={1.8} /></span>
      <span className="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true"><Moon size={14} strokeWidth={1.8} /></span>
    </button>
  )
}