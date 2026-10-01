import { ArrowRight, ExternalLink, GitBranch, Images } from 'lucide-react'
import { useState } from 'react'
import type { Project } from '../data/portfolio'
import { useCardTilt } from '../hooks/useCardTilt'

export function ProjectMedia({project,index,interactive=true}:{project:Project;index:number;interactive?:boolean}) {
  const [failed,setFailed]=useState(false)
  const showImage=Boolean(project.image&&!failed)
  return <div className={`project-media project-media--${index%3}`}>{showImage?<img src={project.image} alt="" loading="lazy" decoding="async" width={1600} height={1000} onError={()=>setFailed(true)}/>:<div className="project-media__fallback" aria-hidden="true"><span>{project.category}</span><strong>{project.title.slice(0,2).toUpperCase()}</strong><div><i/><i/><i/></div></div>}{interactive&&<span className="gallery-indicator"><Images size={14} aria-hidden/> Open project <ArrowRight size={14} aria-hidden/></span>}</div>
}

export function ProjectCard({project,index,large=false}:{project:Project;index:number;large?:boolean}) {
  const tiltCardProps = useCardTilt()
  return <article className={`project-card tilt-card ${large?'project-card--large':''}`} {...tiltCardProps}>
    <a className="project-card__primary" href={`/projects/${project.slug}`} aria-label={`Open ${project.title} project details`}><ProjectMedia project={project} index={index}/></a>
    <div className="project-card__body"><div className="project-card__meta"><span>{project.category}</span><span>{project.year}</span></div><a className="project-card__title" href={`/projects/${project.slug}`}><h3>{project.title}</h3><ArrowRight aria-hidden/></a><p>{project.summary}</p><ul className="project-tech" aria-label="Key technologies">{project.disciplines.map(item=><li key={item}>{item}</li>)}</ul><div className="project-links">{project.github&&<a href={project.github} target="_blank" rel="noreferrer"><GitBranch size={14} aria-hidden/>GitHub<span className="sr-only"> for {project.title} (opens in new tab)</span></a>}{project.liveDemo&&<a href={project.liveDemo} target="_blank" rel="noreferrer"><ExternalLink size={14} aria-hidden/>Live demo<span className="sr-only"> for {project.title} (opens in new tab)</span></a>}</div></div>
  </article>
}
