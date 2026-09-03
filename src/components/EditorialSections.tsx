import { motion } from 'framer-motion'
import { Camera, Coffee, Footprints } from 'lucide-react'
import { Container } from './Container'
import { SectionHeading } from './SectionHeading'
import { portfolio } from '../data/portfolio'
import { useReducedMotion } from '../hooks/useReducedMotion'

const hobbyIcons = { run: Footprints, camera: Camera, coffee: Coffee }

export function EditorialSections() {
  const reducedMotion = useReducedMotion()
  const group = { hidden:{}, visible:{ transition:reducedMotion?{}:{staggerChildren:.09} } }
  const item = reducedMotion ? {hidden:{opacity:1,y:0},visible:{opacity:1,y:0}} : {hidden:{opacity:0,y:22},visible:{opacity:1,y:0,transition:{duration:.52,ease:[.16,1,.3,1] as const}}}
  return <>
    <section className="education-home editorial-section" id="education" aria-labelledby="education-title"><Container><SectionHeading eyebrow="03 / Education" title="Foundations, examined." id="education-title" description="Formal study and the context surrounding it."/><motion.div className="education-list" variants={group} initial="hidden" whileInView="visible" viewport={{once:true,amount:.16}}>{portfolio.education.map((entry,index)=><motion.article className="education-card" variants={item} key={`${entry.institution}-${entry.program}`}><div className="editorial-index"><span>{String(index+1).padStart(2,'0')}</span><time>{entry.dates}</time></div><div className="education-primary"><p>Institution</p><h3>{entry.institution}</h3></div><div className="education-detail"><p>Program</p><strong>{entry.program}</strong><p className="editorial-copy">{entry.details}</p>{entry.achievement&&<div className="achievement"><span>Achievement</span>{entry.achievement}</div>}</div></motion.article>)}</motion.div></Container></section>

    <section className="leadership-home editorial-section" id="leadership" aria-labelledby="leadership-title"><Container><SectionHeading eyebrow="04 / Leadership" title="The work extends beyond the task list." id="leadership-title" description="Moments where I have helped others move faster, think better, and ship with more clarity."/><motion.div className="leadership-list" variants={group} initial="hidden" whileInView="visible" viewport={{once:true,amount:.12}}>{portfolio.leadership.map((entry,index)=><motion.article className="leadership-card" variants={item} key={`${entry.title}-${entry.organization}`}><div className="editorial-index"><span>{String(index+1).padStart(2,'0')}</span><time>{entry.period}</time></div><div className="leadership-body"><p>{entry.organization}</p><h3>{entry.title}</h3><p className="editorial-copy">{entry.description}</p>{entry.impact && <div className="achievement"><span>Impact</span>{entry.impact}</div>}</div></motion.article>)}</motion.div></Container></section>

    <section className="experience-home editorial-section" id="experience" aria-labelledby="experience-title"><Container><SectionHeading eyebrow="05 / Work experience" title="Responsibility in practice." id="experience-title" description="Roles, outcomes, and the tools used to get there."/><motion.div className="experience-list" variants={group} initial="hidden" whileInView="visible" viewport={{once:true,amount:.12}}>{portfolio.experience.map((entry,index)=><motion.article className="experience-card" variants={item} key={`${entry.company}-${entry.role}`}><div className="editorial-index"><span>{String(index+1).padStart(2,'0')}</span><time>{entry.dates}</time></div><div className="experience-title"><p>{entry.company}</p><h3>{entry.role}</h3></div><p className="editorial-copy">{entry.description}</p><ul aria-label={`Technologies used at ${entry.company}`}>{entry.technologies.map(technology=><li key={technology}>{technology}</li>)}</ul></motion.article>)}</motion.div></Container></section>

    <section className="hobbies-home editorial-section" id="hobbies" aria-labelledby="hobbies-title"><Container><SectionHeading eyebrow="06 / Outside the terminal" title="Attention has range." id="hobbies-title" description="Interests that shape how I observe, practice, and reset."/><motion.div className="hobbies-grid" variants={group} initial="hidden" whileInView="visible" viewport={{once:true,amount:.2}}>{portfolio.hobbies.map((hobby,index)=>{const Icon=hobby.icon?hobbyIcons[hobby.icon]:null;return <motion.article className="hobby-card" variants={item} key={hobby.title}><div><span>{String(index+1).padStart(2,'0')}</span>{Icon&&<Icon size={20} strokeWidth={1.5} aria-hidden/>}</div><h3>{hobby.title}</h3><p>{hobby.description}</p></motion.article>})}</motion.div></Container></section>
  </>
}
