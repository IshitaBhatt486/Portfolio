import type { ReactNode } from 'react'
export function PuzzleTile({ index, label, children, tone = 'paper' }: { index: string; label: string; children: ReactNode; tone?: 'paper' | 'highlight' | 'dark' }) { return <article className={`puzzle-tile puzzle-tile--${tone}`}><div className="tile-meta"><span>{index}</span><span>{label}</span></div><div className="tile-body">{children}</div></article> }
