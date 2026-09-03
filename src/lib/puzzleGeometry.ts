export type PuzzleEdge = 'flat' | 'tab' | 'indentation'

export type PuzzleEdges = {
  top: PuzzleEdge
  right: PuzzleEdge
  bottom: PuzzleEdge
  left: PuzzleEdge
}

export const oppositeEdge = (edge: PuzzleEdge): PuzzleEdge => {
  if (edge === 'tab') return 'indentation'
  if (edge === 'indentation') return 'tab'
  return 'flat'
}

/**
 * Generates one shared 100x100 jigsaw silhouette. Tabs extend 12 units past
 * an edge; an adjacent indentation uses the exact complementary curve.
 */
export function getPuzzlePath(edges: PuzzleEdges, tabSize = 12): string {
  const top = edges.top === 'flat'
    ? 'L100 0'
    : `L38 0 C38 ${edges.top === 'tab' ? -tabSize : tabSize} 62 ${edges.top === 'tab' ? -tabSize : tabSize} 62 0 L100 0`
  const right = edges.right === 'flat'
    ? 'L100 100'
    : `L100 38 C${edges.right === 'tab' ? 100 + tabSize : 100 - tabSize} 38 ${edges.right === 'tab' ? 100 + tabSize : 100 - tabSize} 62 100 62 L100 100`
  const bottom = edges.bottom === 'flat'
    ? 'L0 100'
    : `L62 100 C62 ${edges.bottom === 'tab' ? 100 + tabSize : 100 - tabSize} 38 ${edges.bottom === 'tab' ? 100 + tabSize : 100 - tabSize} 38 100 L0 100`
  const left = edges.left === 'flat'
    ? 'L0 0'
    : `L0 62 C${edges.left === 'tab' ? -tabSize : tabSize} 62 ${edges.left === 'tab' ? -tabSize : tabSize} 38 0 38 L0 0`

  return `M0 0 ${top} ${right} ${bottom} ${left} Z`
}

const pattern: PuzzleEdge[] = ['tab', 'indentation', 'tab', 'indentation']

export function getGridEdges(row: number, column: number, columns: number, rows: number): PuzzleEdges {
  const top = row === 0 ? 'flat' : oppositeEdge(pattern[(column + row - 1) % pattern.length])
  const left = column === 0 ? 'flat' : oppositeEdge(pattern[(row + column - 1) % pattern.length])
  const right = column === columns - 1 ? 'flat' : pattern[(row + column) % pattern.length]
  const bottom = row === rows - 1 ? 'flat' : pattern[(column + row) % pattern.length]

  return { top, right, bottom, left }
}

export function getGridDimensions(count: number, preferredColumns = 3) {
  const columns = Math.min(preferredColumns, Math.max(1, count))
  return { columns, rows: Math.ceil(count / columns) }
}

export function getStandaloneEdges(seed = 0): PuzzleEdges {
  const edge = pattern[seed % pattern.length]
  return { top: edge, right: oppositeEdge(edge), bottom: edge, left: oppositeEdge(edge) }
}
