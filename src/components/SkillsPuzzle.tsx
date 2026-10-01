import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState, type KeyboardEvent } from 'react'
import { portfolio } from '../data/portfolio'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { getGridDimensions, getGridEdges } from '../lib/puzzleGeometry'
import { PuzzlePiece } from './PuzzlePiece'
import fallbackLogo from '../assets/skill-fallback.svg'

function SkillName({ name }: { name: string }) {
  return <>{name.split(' ').map((word, index) => <span key={`${word}-${index}`}>{word}{index < name.split(' ').length - 1 && <br />}</span>)}</>
}

export function SkillsPuzzle() {
  const [activeIndex, setActiveIndex] = useState(0)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const reducedMotion = useReducedMotion()
  const category = portfolio.skillCategories[activeIndex]
  const grid = getGridDimensions(category.skills.length)

  const selectTab = (index: number) => {
    const next = (index + portfolio.skillCategories.length) % portfolio.skillCategories.length
    setActiveIndex(next)
    tabRefs.current[next]?.focus()
  }

  const handleKeys = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); selectTab(activeIndex + 1) }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); selectTab(activeIndex - 1) }
    if (event.key === 'Home') { event.preventDefault(); selectTab(0) }
    if (event.key === 'End') { event.preventDefault(); selectTab(portfolio.skillCategories.length - 1) }
  }

  return <div className="skills-puzzle">
    <div className="skills-tabs" role="tablist" aria-label="Skill categories">{portfolio.skillCategories.map((item,index)=><button key={item.id} ref={node=>{tabRefs.current[index]=node}} id={`skills-tab-${item.id}`} role="tab" aria-selected={activeIndex===index} aria-controls={`skills-panel-${item.id}`} tabIndex={activeIndex===index?0:-1} onClick={()=>setActiveIndex(index)} onKeyDown={handleKeys}>{item.label}</button>)}</div>
    <div className="skills-board-frame">
      <div className="skills-board-meta"><span>{category.description}</span></div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={category.id} id={`skills-panel-${category.id}`} role="tabpanel" aria-labelledby={`skills-tab-${category.id}`} className="skills-board" initial={reducedMotion?{opacity:0}:{opacity:0,scale:.965}} animate={{opacity:1,scale:1}} exit={reducedMotion?{opacity:0}:{opacity:0,scale:.965}} transition={{duration:reducedMotion?.1:.48,ease:[.2,.8,.2,1]}}>
          {category.skills.map((skill,index)=>{const row=Math.floor(index/grid.columns);const column=index%grid.columns;return <motion.div className="skills-board__cell" key={`${skill.name}-${index}`} initial={reducedMotion?false:{opacity:0,y:index<grid.columns?-12:12}} animate={{opacity:1,y:0}} transition={{duration:reducedMotion?0:.5,delay:reducedMotion?0:index*.035,ease:[.16,1,.3,1]}}><PuzzlePiece edges={getGridEdges(row,column,grid.columns,grid.rows)} label={skill.name}><div className="skill-piece__body"><img className="skill-logo" src={skill.logo} alt={`${skill.name} logo`} loading="lazy" onError={(event)=>{event.currentTarget.onerror=null;event.currentTarget.src=fallbackLogo}}/><div className="skill-piece__copy"><h3><SkillName name={skill.name}/></h3></div></div></PuzzlePiece></motion.div>})}
        </motion.div>
      </AnimatePresence>
    </div>
  </div>
}
