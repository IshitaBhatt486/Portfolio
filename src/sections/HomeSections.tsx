import { ArrowDown, ArrowRight, Download, Code2, Mail } from 'lucide-react'
import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { ProjectCard } from '../components/ProjectCard'
import { SectionHeading } from '../components/SectionHeading'
import { portfolio } from '../data/portfolio'
import { SkillsPuzzle } from '../components/SkillsPuzzle'
import { EducationSection, ExperienceSection, HobbiesSection, LeadershipSection } from '../components/EditorialSections'
import { BackToTopButton } from '../components/BackToTopButton'
import { useCardTilt } from '../hooks/useCardTilt'
import { GitHubIcon, LinkedInIcon } from '../components/SocialIcons'
import { HeroCursorEffect } from '../components/HeroCursorEffect'

const socialIcons = { GitHub: GitHubIcon, LinkedIn: LinkedInIcon, LeetCode: Code2 }

export function HomeSections() {
  const featuredProjectSlugs = ['camera-only-navigation', 'handwave', 'llm-transformer-from-scratch', 'paperpulse']
  const featuredProjects = featuredProjectSlugs.flatMap(slug => portfolio.projects.filter(project => project.slug === slug))
  const tiltCardProps = useCardTilt()

  return <>
    <section className="home-hero" id="top" aria-labelledby="hero-title"><HeroCursorEffect/><Container>
      <div className="hero-layout"><div className="hero-heading"><p className="eyebrow">{portfolio.person.role}</p><h1 id="hero-title" className="hero-name-puzzle tilt-card" {...tiltCardProps}>{portfolio.person.name}</h1><p className="hero-statement">I build things.</p></div><div className="hero-summary"><p>{portfolio.person.intro}</p><div className="hero-actions"><Button href="#projects" title="Explore project work">View projects</Button><Button href={portfolio.person.resumeUrl} variant="secondary" icon={false} title="Download resume" download> <Download size={15} aria-hidden/> Resume </Button></div></div></div>
      <a className="scroll-cue has-tooltip" href="#about" data-tooltip="About"><ArrowDown size={16} aria-hidden/> Scroll Down</a>
    </Container></section>

    <section className="about-home" id="about" aria-labelledby="about-title"><Container><p className="eyebrow">01 / About</p><div className="about-layout"><div><h2 id="about-title">{portfolio.person.about}</h2><p className="about-note">{portfolio.person.aboutNote}</p><p className="about-brief">{portfolio.person.aboutBrief}</p></div><div className="compact-actions"><a href={portfolio.person.resumeUrl} download className="has-tooltip" data-tooltip="Download resume"><Download size={14} aria-hidden/>Resume</a>{portfolio.socials.map(link=>{const Icon=socialIcons[link.label];return <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="has-tooltip" data-tooltip={link.label}><Icon size={14} aria-hidden/>{link.label}</a>})}</div></div></Container></section>

    <ExperienceSection/>

    <EducationSection/>

    <section className="achievements-home editorial-section" id="achievements" aria-labelledby="achievements-title"><Container><SectionHeading eyebrow="04 / Achievements" title="Achievements" id="achievements-title" description=""/><div className="achievement-grid">{portfolio.achievements.map(item=><article className="achievement-card reveal-card tilt-card" key={`${item.title}-${item.issuer}`} {...tiltCardProps}><span className="reveal-card__stamp">DETAILS</span><h2>{item.title}</h2><p>{item.issuer}</p><div className="reveal-card__details"><p className="achievement-card__category">{item.category}</p><p className="editorial-copy">{item.description}</p></div></article>)}</div></Container></section>

    <section className="projects-home" id="projects" aria-labelledby="projects-home-title"><Container><SectionHeading eyebrow="05 / Projects" title="Featured Projects" id="projects-home-title" description=""/><div className="featured-project-grid">{featuredProjects.map((project,index)=><ProjectCard project={project} index={index} key={project.slug}/>)}</div><a className="view-all-projects" href="/projects" title="View all projects">View all projects <ArrowRight size={17} aria-hidden/></a></Container></section>

    <section className="skills-home" id="skills" aria-labelledby="skills-title"><Container><SectionHeading eyebrow="06 / Skills" title="Skills" id="skills-title" description=""/><SkillsPuzzle/></Container></section>

    <LeadershipSection/>

    <section className="certifications-home editorial-section" id="certifications" aria-labelledby="certifications-title"><Container><SectionHeading eyebrow="08 / Certificate gallery" title="Certificate Gallery" id="certifications-title" description=""/><div className="certification-grid">{portfolio.certifications.map(item=><article className="certification-card reveal-card tilt-card" key={`${item.title}-${item.issuer}`} {...tiltCardProps}><span className="reveal-card__stamp">DETAILS</span><div><p>{item.issuer}</p><h3>{item.title}</h3></div><div className="reveal-card__details"><time>{item.year}</time><p className="editorial-copy">{item.description}</p>{item.link && <a href={item.link} target="_blank" rel="noreferrer" className="has-tooltip" data-tooltip="Open certificate">View credential <ArrowRight size={14} aria-hidden/></a>}</div></article>)}</div></Container></section>

    <HobbiesSection/>

    <section className="contact-home" id="contact" aria-labelledby="contact-title"><Container><p className="eyebrow">10 / Contact</p><div className="contact-layout"><h2 id="contact-title">Open to Opportunities</h2><div><p>I’m interested in working with ambitious engineering teams working on new and emerging technologies.</p><a className="contact-email has-tooltip" href={`mailto:${portfolio.person.email}`} data-tooltip={`Email ${portfolio.person.email}`}><Mail size={18} aria-hidden/>{portfolio.person.email}<ArrowRight size={18} aria-hidden/></a><div className="contact-socials" aria-label="Social profiles">{portfolio.socials.map(link=>{const Icon=socialIcons[link.label];return <a key={link.label} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label} title={link.label}><Icon size={18} aria-hidden/></a>})}</div></div></div><footer className="home-footer"><span>© 2026 {portfolio.person.name}</span><span><a href="/privacy">Legal, Privacy Policy and Credits</a> · {portfolio.person.availability}</span></footer></Container><BackToTopButton /></section>
  </>
}
