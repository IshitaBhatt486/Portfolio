import { motion } from 'framer-motion'
import { Camera, Coffee, Footprints } from 'lucide-react'
import { Container } from './Container'
import { SectionHeading } from './SectionHeading'
import { portfolio } from '../data/portfolio'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useCardTilt } from '../hooks/useCardTilt'

const hobbyIcons = { run: Footprints, camera: Camera, coffee: Coffee }

function useEditorialMotion() {
  const reducedMotion = useReducedMotion()
  const group = { hidden:{}, visible:{ transition:reducedMotion?{}:{staggerChildren:.09} } }
  const item = reducedMotion ? {hidden:{opacity:1,y:0},visible:{opacity:1,y:0}} : {hidden:{opacity:0,y:22},visible:{opacity:1,y:0,transition:{duration:.52,ease:[.16,1,.3,1] as const}}}
  return { group, item }
}

export function ExperienceSection() {
  const { group, item } = useEditorialMotion()
  const tiltCardProps = useCardTilt()
  return <section className="experience-home editorial-section" id="experience" aria-labelledby="experience-title"><Container><SectionHeading eyebrow="02 / Experience" title="Experience" id="experience-title" description=""/><motion.div className="experience-list" variants={group} initial="hidden" whileInView="visible" viewport={{once:true,amount:.12}}>{portfolio.experience.map(entry=><motion.div variants={item} key={`${entry.company}-${entry.role}`}><article className="experience-card reveal-card tilt-card" {...tiltCardProps}><span className="reveal-card__stamp">DETAILS</span><div className="experience-title"><p className="experience-company">{entry.company}</p><h3 className="experience-role">{entry.role}</h3></div><div className="reveal-card__details"><p className="editorial-copy">{entry.description}</p><ul aria-label={`Technologies used at ${entry.company}`}>{entry.technologies.map(technology=><li key={technology}>{technology}</li>)}</ul></div></article></motion.div>)}</motion.div></Container></section>
}

export function EducationSection() {
  const { group, item } = useEditorialMotion()
  return <section className="education-home editorial-section" id="education" aria-labelledby="education-title"><Container><SectionHeading eyebrow="03 / Education" title="Education" id="education-title" description=""/><motion.div className="education-list" variants={group} initial="hidden" whileInView="visible" viewport={{once:true,amount:.16}}>{portfolio.education.map((entry,index)=><motion.article className="education-card" variants={item} key={`${entry.institution}-${entry.program}`}><div className="editorial-index"><span>{String(index+1).padStart(2,'0')}</span><time>{entry.dates}</time></div><div className="education-primary"><p>Institution</p><h3>{entry.institution}</h3></div><div className="education-detail"><p>Program</p><strong>{entry.program}</strong><p className="editorial-copy">{entry.details}</p></div></motion.article>)}</motion.div></Container></section>
}

export function LeadershipSection() {
  const { group, item } = useEditorialMotion()
  const tiltCardProps = useCardTilt()
  return <section className="leadership-home editorial-section" id="leadership" aria-labelledby="leadership-title"><Container><SectionHeading eyebrow="07 / Leadership and activities" title="Leadership and Activities" id="leadership-title" description=""/><motion.div className="leadership-list" variants={group} initial="hidden" whileInView="visible" viewport={{once:true,amount:.12}}>{portfolio.leadership.map((entry,index)=><motion.div variants={item} key={`${entry.title}-${entry.organization}`}><article className="leadership-card leadership-card--reveal tilt-card" {...tiltCardProps}><span className="leadership-stamp">LEAD / {String(index+1).padStart(2,'0')}</span><div className="leadership-body"><p>{entry.organization}</p><h3>{entry.title}</h3><p className="editorial-copy">{entry.description}</p></div></article></motion.div>)}</motion.div></Container></section>
}

export function HobbiesSection() {
  const { group, item } = useEditorialMotion()
  const tiltCardProps = useCardTilt()
  return <section className="hobbies-home editorial-section" id="hobbies" aria-labelledby="hobbies-title"><Container><SectionHeading eyebrow="09 / Other" title="Interests and Hobbies" id="hobbies-title" description=""/><motion.div className="hobbies-grid" variants={group} initial="hidden" whileInView="visible" viewport={{once:true,amount:.2}}>{portfolio.hobbies.map((hobby,index)=>{const Icon=hobby.icon?hobbyIcons[hobby.icon]:null;return <motion.div variants={item} key={hobby.title}><article className="hobby-card tilt-card" {...tiltCardProps}><div><span>{String(index+1).padStart(2,'0')}</span>{Icon&&<Icon size={20} strokeWidth={1.5} aria-hidden/>}</div><h3>{hobby.title}</h3><p>{hobby.description}</p></article></motion.div>})}</motion.div></Container></section>
}
