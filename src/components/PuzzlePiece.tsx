import type { ReactNode } from 'react'
import { getPuzzlePath, type PuzzleEdges } from '../lib/puzzleGeometry'

type PuzzlePieceProps = {
  edges: PuzzleEdges
  children?: ReactNode
  className?: string
  tone?: 'paper' | 'highlight' | 'dark'
  label?: string
}

export function PuzzlePiece({ edges, children, className = '', tone = 'paper', label }: PuzzlePieceProps) {
  return (
    <article className={`puzzle-piece puzzle-piece--${tone} ${className}`.trim()} aria-label={label}>
      <svg className="puzzle-piece__shape" viewBox="-14 -14 128 128" preserveAspectRatio="none" aria-hidden="true">
        <path d={getPuzzlePath(edges)} />
      </svg>
      <div className="puzzle-piece__content">{children}</div>
    </article>
  )
}