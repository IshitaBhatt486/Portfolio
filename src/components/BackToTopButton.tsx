import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function BackToTopButton() {
  const reducedMotion = useReducedMotion()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY >= window.innerHeight * 0.9)
    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    window.addEventListener('resize', updateVisibility)

    return () => {
      window.removeEventListener('scroll', updateVisibility)
      window.removeEventListener('resize', updateVisibility)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <button
      className={`back-to-top${visible ? ' is-visible' : ''}`}
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      tabIndex={visible ? 0 : -1}
    >
      <span className="back-to-top__orbit" aria-hidden="true" />
      <span className="back-to-top__notch back-to-top__notch--one" aria-hidden="true" />
      <span className="back-to-top__notch back-to-top__notch--two" aria-hidden="true" />
      <ArrowUp size={17} strokeWidth={1.8} aria-hidden="true" />
    </button>
  )
}