import { ArrowDown, ArrowRight, Download, GitBranch, Network, Code2, Mail } from 'lucide-react'
import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { ProjectCard } from '../components/ProjectCard'
import { SectionHeading } from '../components/SectionHeading'
import { portfolio } from '../data/portfolio'
import { SkillsPuzzle } from '../components/SkillsPuzzle'
import { VisitorStats } from '../components/VisitorStats'
import { EditorialSections } from '../components/EditorialSections'
import { BackToTopButton } from '../components/BackToTopButton'

const socialIcons = { GitHub: GitBranch, LinkedIn: Network, LeetCode: Code2 }

export function HomeSections() {
  const featuredProjects = portfolio.projects.filter(project => project.featured).slice(0, 3)

  return <>
    <section className="home-hero" id="top" aria-labelledby="hero-title"><Container>
      <div className="hero-utility"><span>Portfolio / 2026</span><span>{portfolio.person.location}</span></div>
      <div className="hero-layout"><div className="hero-heading"><p className="eyebrow">{portfolio.person.role}</p><h1 id="hero-title">{portfolio.person.name}</h1><p className="hero-statement">I build things.</p></div><div className="hero-summary"><p>{portfolio.person.intro}</p><div className="hero-actions"><Button href="#projects" title="Explore project work">View projects</Button><Button href={portfolio.person.resumeUrl} variant="secondary" icon={false} title="View resume" target="_blank" rel="noreferrer"> <Download size={15} aria-hidden/> Resume </Button></div></div></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}><VisitorStats /></div>
      <a className="scroll-cue has-tooltip" href="#about" data-tooltip="About"><ArrowDown size={16} aria-hidden/> Read the system</a>
    </Container></section>

    <section className="about-home" id="about" aria-labelledby="about-title"><Container><p className="eyebrow">01 / About</p><div className="about-layout"><h2 id="about-title">{portfolio.person.about}</h2><div className="compact-actions"><a href={portfolio.person.resumeUrl} className="has-tooltip" data-tooltip="Resume"><Download size={14} aria-hidden/>Resume</a>{portfolio.socials.map(link=>{const Icon=socialIcons[link.label];return <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="has-tooltip" data-tooltip={link.label}><Icon size={14} aria-hidden/>{link.label}</a>})}</div></div></Container></section>

    <section className="skills-home" id="skills" aria-labelledby="skills-title"><Container><SectionHeading eyebrow="02 / Capabilities" title="Tools in context." id="skills-title" description="A structured map of the systems, workflows, and technical foundations I use to build."/><SkillsPuzzle/></Container></section>

    <EditorialSections/>

    <section className="certifications-home editorial-section" id="certifications" aria-labelledby="certifications-title"><Container><SectionHeading eyebrow="07 / Certifications" title="Signals of craft." id="certifications-title" description="A few credentials that reflect how I approach foundational, applied, and systems-level thinking."/><div className="certification-grid">{portfolio.certifications.map((item,index)=><article className="certification-card" key={`${item.title}-${item.issuer}`}><span className="certification-index">{String(index+1).padStart(2,'0')}</span><div><p>{item.issuer}</p><h3>{item.title}</h3><time>{item.year}</time></div><p className="editorial-copy">{item.description}</p>{item.link && <a href={item.link} target="_blank" rel="noreferrer" className="has-tooltip" data-tooltip="Open certificate">View credential <ArrowRight size={14} aria-hidden/></a>}</article>)}</div></Container></section>

    <section className="projects-home" id="projects" aria-labelledby="projects-home-title"><Container><SectionHeading eyebrow="08 / Selected projects" title="Proof, not promises." id="projects-home-title" description="A curated set of systems built around traceability, useful constraints, and measurable outcomes."/><div className="featured-project-grid">{featuredProjects.map((project,index)=><ProjectCard project={project} index={index} large={index===0} key={project.slug}/>)}</div><a className="view-all-projects" href="/projects" title="View all projects">View all projects <ArrowRight size={17} aria-hidden/></a></Container></section>

    <section className="contact-home" id="contact" aria-labelledby="contact-title"><Container><p className="eyebrow">09 / Contact</p><div className="contact-layout"><h2 id="contact-title">Let’s build the piece that’s missing.</h2><div><p>I’m interested in ambitious engineering teams, useful AI, and software with consequences.</p><a className="contact-email has-tooltip" href={`mailto:${portfolio.person.email}`} data-tooltip={`Email ${portfolio.person.email}`}><Mail size={18} aria-hidden/>{portfolio.person.email}<ArrowRight size={18} aria-hidden/></a></div></div><footer className="home-footer"><span>© 2026 {portfolio.person.name}</span><span>{portfolio.person.availability}</span></footer></Container><BackToTopButton /></section>
  </>
}
