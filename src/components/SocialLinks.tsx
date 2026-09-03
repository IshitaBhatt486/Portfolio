import { portfolio } from '../data/portfolio'
export function SocialLinks() { return <ul className="social-links">{portfolio.socials.map(link => <li key={link.label}><a href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{link.label}</a></li>)}</ul> }
