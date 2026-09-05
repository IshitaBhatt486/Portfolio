/**
 * App Router: Client-side SPA navigation
 * 
 * COST AUDIT: ZERO-COST IMPLEMENTATION
 * ====================================
 * 
 * This app uses browser history API for navigation, not a server.
 * No external dependencies, no API calls, no analytics tracking.
 * 
 * All pages are static HTML generated at build time by Vite.
 * The browser renders them with React client-side.
 * 
 * Routes:
 * - / : HomePage (intro + projects + skills + achievements)
 * - /projects : ProjectsPage (all projects with filters)
 * - /projects/:slug : ProjectDetailPage (individual case study)
 * - /achievements : AchievementsPage (gallery)
 * 
 * No database, no API backend, no external service calls required.
 * Works offline (except for external social links and resume).
 */

import { AnimatePresence, motion } from 'framer-motion'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { HomePage } from './pages/HomePage'
import { useReducedMotion } from './hooks/useReducedMotion'
import { recordVisit } from './lib/analytics'
import { getPuzzlePath, getStandaloneEdges } from './lib/puzzleGeometry'

const ProjectsPage = lazy(() => import('./pages/ProjectsPage').then(module => ({ default: module.ProjectsPage })))
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage').then(module => ({ default: module.ProjectDetailPage })))
const AchievementsPage = lazy(() => import('./pages/AchievementsPage').then(module => ({ default: module.AchievementsPage })))

const getPath = () => window.location.pathname.replace(/\/+$/, '') || '/'
const pathOrder = (path: string) => {
  if (path === '/') return 0
  if (path === '/projects') return 1
  if (path === '/achievements') return 2
  if (path.startsWith('/projects/')) return 3
  return 4
}

const transitionPieces = [
  { x: -26, y: -18, rotate: -18, size: 62 },
  { x: 26, y: -16, rotate: 16, size: 58 },
  { x: -20, y: 16, rotate: 10, size: 64 },
  { x: 25, y: 20, rotate: -18, size: 52 },
  { x: 0, y: 2, rotate: 0, size: 48 },
]

function TransitionOverlay({ visible, direction }: { visible: boolean; direction: 'forward' | 'backward' }) {
  const reduced = useReducedMotion()

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="route-transition-layer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.18, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <motion.div
            className="route-transition-puzzle"
            initial={{ scale: 0.9, rotate: direction === 'forward' ? -6 : 6, opacity: 0.4 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 1.04, rotate: direction === 'forward' ? 6 : -6, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            {transitionPieces.map((piece, index) => (
              <motion.svg
                key={`${piece.x}-${piece.y}-${index}`}
                className="route-transition-piece"
                viewBox="-14 -14 128 128"
                aria-hidden="true"
                initial={{
                  x: direction === 'forward' ? piece.x * 1.8 : piece.x * -1.2,
                  y: direction === 'forward' ? piece.y * 2 : piece.y * -1.4,
                  rotate: direction === 'forward' ? piece.rotate + 14 : piece.rotate - 12,
                  opacity: 0.15,
                }}
                animate={{
                  x: piece.x,
                  y: piece.y,
                  rotate: piece.rotate,
                  opacity: 1,
                }}
                exit={{
                  x: direction === 'forward' ? piece.x * -1.2 : piece.x * 1.3,
                  y: direction === 'forward' ? piece.y * -0.9 : piece.y * 1.1,
                  rotate: direction === 'forward' ? piece.rotate + 22 : piece.rotate - 20,
                  opacity: 0,
                }}
                transition={{ duration: reduced ? 0 : 0.44, ease: [0.2, 0.8, 0.2, 1] }}
                style={{ width: piece.size, height: piece.size }}
              ><path d={getPuzzlePath(getStandaloneEdges(index))} /></motion.svg>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function RoutePage({ path }: { path: string }) {
  if (path === '/projects') return <ProjectsPage />
  if (path === '/achievements') return <AchievementsPage />
  if (path.startsWith('/projects/')) return <ProjectDetailPage slug={decodeURIComponent(path.slice('/projects/'.length))} />
  return <HomePage />
}

function RouteFallback() {
  return <div className="route-fallback" aria-label="Loading page" />
}

export default function App() {
  const [path, setPath] = useState(getPath)
  const [transitioning, setTransitioning] = useState(false)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const previousPathRef = useRef(path)

    // Initialize analytics on first app load
    useEffect(() => {
      recordVisit()
    }, [])
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!transitioning) return

    const timeout = window.setTimeout(() => setTransitioning(false), reduced ? 0 : 420)
    return () => window.clearTimeout(timeout)
  }, [transitioning, reduced])

  useEffect(() => {
    const syncRoute = () => {
      const nextPath = getPath()
      const previousPath = previousPathRef.current
      const nextDirection = pathOrder(nextPath) >= pathOrder(previousPath) ? 'forward' : 'backward'

      previousPathRef.current = nextPath
      setDirection(nextDirection)
      setPath(nextPath)
      setTransitioning(true)
    }

    const handleNavigation = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const anchor = target?.closest('a[href]') as HTMLAnchorElement | null
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return
      if (href.startsWith('http://') || href.startsWith('https://')) {
        const url = new URL(href, window.location.href)
        if (url.origin !== window.location.origin) return
      }

      const nextPath = new URL(href, window.location.href).pathname.replace(/\/+$/, '') || '/'
      if (nextPath === getPath()) return

      event.preventDefault()
      window.history.pushState({}, '', href)
      syncRoute()
    }

    window.addEventListener('popstate', syncRoute)
    document.addEventListener('click', handleNavigation)

    return () => {
      window.removeEventListener('popstate', syncRoute)
      document.removeEventListener('click', handleNavigation)
    }
  }, [reduced])

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.main
          key={path}
          className="route-shell"
          initial={reduced ? false : { opacity: 0, scale: 0.99, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduced ? {} : { opacity: 0.2, scale: 0.99, y: -6 }}
          transition={{ duration: reduced ? 0 : 0.52, ease: [0.16, 1, 0.3, 1] }}
        >
          <Suspense fallback={<RouteFallback />}><RoutePage path={path} /></Suspense>
        </motion.main>
      </AnimatePresence>

      <TransitionOverlay visible={transitioning} direction={direction} />
    </>
  )
}
