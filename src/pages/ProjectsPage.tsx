import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Container } from '../components/Container'
import { PageTransition } from '../components/PageTransition'
import { ProjectCard } from '../components/ProjectCard'
import { portfolio } from '../data/portfolio'
import { useReducedMotion } from '../hooks/useReducedMotion'

const ALL='All'
const readFilter=()=>new URLSearchParams(window.location.search).get('category')||ALL

export function ProjectsPage() {
  const reducedMotion=useReducedMotion()
  const categories=useMemo(()=>[ALL,...Array.from(new Set(portfolio.projects.map(project=>project.category)))],[])
  const [filter,setFilter]=useState(()=>categories.includes(readFilter())?readFilter():ALL)
  useEffect(()=>{const restore=()=>setFilter(categories.includes(readFilter())?readFilter():ALL);window.addEventListener('popstate',restore);return()=>window.removeEventListener('popstate',restore)},[categories])
  const selectFilter=(category:string)=>{setFilter(category);window.history.pushState({},'',category===ALL?'/projects':`/projects?category=${encodeURIComponent(category)}`)}
  const projects=filter===ALL?portfolio.projects:portfolio.projects.filter(project=>project.category===filter)
  return <PageTransition><a className="skip-link" href="#projects-gallery">Skip to projects</a><header className="projects-page-nav"><Container><a href="/"><ArrowLeft size={16} aria-hidden/> Back home</a><span>{portfolio.person.name} / Project archive</span></Container></header><main className="projects-page"><Container><header className="projects-page-header"><p className="eyebrow">Complete portfolio / {String(portfolio.projects.length).padStart(2,'0')}</p><h1>Projects</h1><p>Building, experimenting, and learning through systems that make ideas testable.</p></header><div className="project-filters" aria-label="Filter projects by category">{categories.map(category=><button key={category} type="button" aria-pressed={filter===category} onClick={()=>selectFilter(category)}>{category}<span>{String(category===ALL?portfolio.projects.length:portfolio.projects.filter(project=>project.category===category).length).padStart(2,'0')}</span></button>)}</div><div id="projects-gallery" aria-live="polite"><AnimatePresence mode="wait" initial={false}>{projects.length?<motion.div className="projects-archive-grid" key={filter} initial={reducedMotion?false:{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={reducedMotion?{opacity:1}:{opacity:0,y:-8}} transition={{duration:reducedMotion?0:.3}}>{projects.map((project,index)=><ProjectCard project={project} index={index} key={project.slug}/>)}</motion.div>:<motion.div className="projects-empty" key="empty" initial={reducedMotion?false:{opacity:0}} animate={{opacity:1}}><p className="eyebrow">No matches</p><h2>No projects in this category yet.</h2><button type="button" onClick={()=>selectFilter(ALL)}>Clear filter</button></motion.div>}</AnimatePresence></div></Container></main></PageTransition>
}
