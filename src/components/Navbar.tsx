import { Code2, GitBranch, Menu, Network, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { portfolio } from '../data/portfolio'
import { Container } from './Container'
import { ThemeToggle } from './ThemeToggle'

const icons = { github: GitBranch, linkedin: Network, code: Code2 }

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('top')

  useEffect(() => {
    const sections = ['top', ...portfolio.navigation.map((link) => link.href.slice(1))]
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-22% 0px -62%', threshold: [0, 0.2, 0.6] },
    )

    sections.forEach((section) => observer.observe(section))

    const close = () => setOpen(false)
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('resize', close)
    window.addEventListener('keydown', escape)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', close)
      window.removeEventListener('keydown', escape)
    }
  }, [])

  return (
    <header className="site-header">
      <Container className="nav">
        <a className="brand" href="#top" aria-label={`${portfolio.person.name}, home`} title={`${portfolio.person.name} home`}>
          <span>{portfolio.person.initials}</span>
          <em>{portfolio.person.name}</em>
        </a>

        <ThemeToggle />

        <button
          className="menu-button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          title={open ? 'Close navigation' : 'Open navigation'}
          type="button"
        >
          {open ? <X aria-hidden /> : <Menu aria-hidden />}
        </button>

        <nav id="primary-nav" className={open ? 'nav-links is-open' : 'nav-links'} aria-label="Primary navigation">
          {portfolio.navigation.map((link) => (
            <a
              href={link.href}
              key={link.href}
              aria-current={active === link.href.slice(1) ? 'location' : undefined}
              onClick={() => setOpen(false)}
              title={link.label}
            >
              {link.label}
            </a>
          ))}

          <div className="nav-socials">
            {portfolio.socials.map((link) => {
              const Icon = icons[link.icon]
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  title={link.label}
                  className="has-tooltip"
                >
                  <Icon size={16} aria-hidden />
                </a>
              )
            })}
          </div>
        </nav>
      </Container>
    </header>
  )
}
