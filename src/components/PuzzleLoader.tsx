import { motion } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { getGridEdges, getPuzzlePath } from '../lib/puzzleGeometry'

export type PuzzleLoaderTheme = 'light' | 'dark'

export type PuzzleLoaderProps = {
  size?: number | string
  theme?: PuzzleLoaderTheme
  visible?: boolean
  className?: string
  label?: string
}

const piecePaths = [
  { key: 'tl', x: -42, y: -42, rotate: -35, fill: 'var(--paper)' },
  { key: 'tr', x: 42, y: -42, rotate: 35, fill: 'var(--highlight)' },
  { key: 'bl', x: -42, y: 42, rotate: 35, fill: 'var(--paper-deep)' },
  { key: 'br', x: 42, y: 42, rotate: -35, fill: 'var(--accent)' },
] as const

export function PuzzleLoader({
  size = 96,
  theme = 'light',
  visible = true,
  className = '',
  label = 'Loading portfolio',
}: PuzzleLoaderProps) {
  const reducedMotion = useReducedMotion()

  if (!visible) return null

  const shellStyle = {
    width: typeof size === 'number' ? `${size}px` : size,
    height: typeof size === 'number' ? `${size}px` : size,
  }

  return (
    <div
      className={`puzzle-loader puzzle-loader--${theme} ${className}`.trim()}
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      <motion.div
        className="puzzle-loader__shell"
        style={shellStyle}
        animate={reducedMotion ? { rotate: 0, scale: 1 } : { rotate: [0, 90, 180, 270, 360] }}
        transition={reducedMotion ? { duration: 0 } : { duration: 4.4, ease: 'linear', repeat: Infinity }}
      >
        <svg viewBox="0 0 220 220" className="puzzle-loader__svg" role="img" aria-hidden="true">
          <motion.g
            animate={reducedMotion ? { rotate: 0 } : { rotate: [0, 360] }}
            transition={reducedMotion ? { duration: 0 } : { duration: 4.4, ease: 'linear', repeat: Infinity }}
            style={{ originX: '50%', originY: '50%' }}
          >
            {piecePaths.map((piece, index) => (
              <motion.path
                key={piece.key}
                d={getPuzzlePath(getGridEdges(Math.floor(index / 2), index % 2, 2, 2))}
                transform={`translate(${index % 2 * 100} ${Math.floor(index / 2) * 100}) scale(.95)`}
                fill={piece.fill}
                stroke="var(--ink)"
                strokeWidth="1.2"
                vectorEffect="non-scaling-stroke"
                style={{ transformOrigin: 'center', filter: 'drop-shadow(0 8px 8px rgba(24, 24, 22, 0.08))' }}
                initial={false}
                animate={
                  reducedMotion
                    ? { x: 0, y: 0, rotate: 0, scale: 1 }
                    : {
                        x: [piece.x, piece.x * 0.48, 0, 0, piece.x, piece.x],
                        y: [piece.y, piece.y * 0.48, 0, 0, piece.y, piece.y],
                        rotate: [piece.rotate, piece.rotate * 0.45, 0, 140 + index * 25, piece.rotate + 12, piece.rotate],
                        scale: [0.74, 0.96, 1.08, 1.12, 0.78, 0.74],
                      }
                }
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : {
                        duration: 4.4,
                        ease: 'easeInOut',
                        repeat: Infinity,
                        delay: index * 0.08,
                        times: [0, 0.18, 0.38, 0.58, 0.8, 1],
                      }
                }
              />
            ))}
          </motion.g>
        </svg>
      </motion.div>
    </div>
  )
}
