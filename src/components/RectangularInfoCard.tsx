import type { ReactNode } from 'react'
export function RectangularInfoCard({ label, value, children }: { label: string; value?: string; children?: ReactNode }) { return <article className="info-card"><p>{label}</p>{value && <h3>{value}</h3>}{children}</article> }
