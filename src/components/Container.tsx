import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
type Props<T extends ElementType> = { as?: T; children: ReactNode; className?: string } & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>
export function Container<T extends ElementType = 'div'>({ as, children, className = '', ...props }: Props<T>) { const Tag = as ?? 'div'; return <Tag className={`container-shell ${className}`} {...props}>{children}</Tag> }
