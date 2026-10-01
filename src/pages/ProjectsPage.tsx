import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Container } from '../components/Container'
import { PageTransition } from '../components/PageTransition'
import { ProjectCard } from '../components/ProjectCard'
import { GitHubIcon } from '../components/SocialIcons'
import { portfolio } from '../data/portfolio'
import { useReducedMotion } from '../hooks/useReducedMotion'

const DEFAULT_CATEGORY='Software / AI / ML'
const readFilter=()=>new URLSearchParams(window.location.search).get('category')||DEFAULT_CATEGORY

export function ProjectsPage() {
  const reducedMotion=useReducedMotion()
  const categories=useMemo(()=>['Robotics','Software / AI / ML','Other'],[])
  const [filter,setFilter]=useState(()=>categories.includes(readFilter())?readFilter():DEFAULT_CATEGORY)
  useEffect(()=>{const restore=()=>setFilter(categories.includes(readFilter())?readFilter():DEFAULT_CATEGORY);window.addEventListener('popstate',restore);return()=>window.removeEventListener('popstate',restore)},[categories])
  const selectFilter=(category:string)=>{setFilter(category);window.history.pushState({},'',category===DEFAULT_CATEGORY?'/projects':`/projects?category=${encodeURIComponent(category)}`)}
  const projects=portfolio.projects.filter(project=>project.category===filter)
  return <PageTransition><a className="skip-link" href="#projects-gallery">Skip to projects</a><header className="projects-page-nav"><Container><a href="/"><ArrowLeft size={16} aria-hidden/> Back home</a><span>{portfolio.person.name} / Project archive</span></Container></header><main className="projects-page"><Container><header className="projects-page-header"><p className="eyebrow">All Projects</p><h1>Projects</h1><div className="projects-page-header__intro"><p>Building, experimenting, and learning through systems that make ideas testable.</p><a href="https://github.com/IshitaBhatt486" target="_blank" rel="noreferrer"><GitHubIcon size={15} aria-hidden/> View all my projects on GitHub</a></div></header><div className="project-filters" aria-label="Browse projects by section">{categories.map(category=><button key={category} type="button" aria-pressed={filter===category} onClick={()=>selectFilter(category)}>{category}<span>{String(portfolio.projects.filter(project=>project.category===category).length).padStart(2,'0')}</span></button>)}</div><div id="projects-gallery" aria-live="polite"><AnimatePresence mode="wait" initial={false}>{projects.length?<motion.div className="projects-archive-grid" key={filter} initial={reducedMotion?false:{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={reducedMotion?{opacity:1}:{opacity:0,y:-8}} transition={{duration:reducedMotion?0:.3}}>{projects.map((project,index)=><ProjectCard project={project} index={index} key={project.slug}/>)}</motion.div>:<motion.div className="projects-empty" key="empty" initial={reducedMotion?false:{opacity:0}} animate={{opacity:1}}><p className="eyebrow">No matches</p><h2>No projects in this category yet.</h2><button type="button" onClick={()=>selectFilter(DEFAULT_CATEGORY)}>View Software / AI / ML projects</button></motion.div>}</AnimatePresence></div></Container></main></PageTransition>
}
