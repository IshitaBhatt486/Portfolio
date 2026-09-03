import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { transition } from '../lib/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
export function PageTransition({ children }: { children: ReactNode }) { const reduced = useReducedMotion(); return <motion.div initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={reduced ? { duration: 0 } : transition.page}>{children}</motion.div> }
