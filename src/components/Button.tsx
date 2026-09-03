import { ArrowUpRight } from 'lucide-react'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
type Props = { children: ReactNode; href?: string; variant?: 'primary' | 'secondary'; icon?: boolean } & AnchorHTMLAttributes<HTMLAnchorElement> & ButtonHTMLAttributes<HTMLButtonElement>
export function Button({ children, href, variant = 'primary', icon = true, className = '', ...props }: Props) { const cn = `button button--${variant} ${className}`; return href ? <a href={href} className={cn} {...props}>{children}{icon && <ArrowUpRight size={16} aria-hidden />}</a> : <button className={cn} {...props}>{children}{icon && <ArrowUpRight size={16} aria-hidden />}</button> }
