import { motion, useAnimationControls } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { portfolio } from '../data/portfolio'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { getGridEdges, getPuzzlePath } from '../lib/puzzleGeometry'

const SESSION_KEY = 'portfolio:intro-complete'
const pieces = [
  ['01', 'var(--intro-piece-1)'], ['02', 'var(--intro-piece-2)'], ['03', 'var(--intro-piece-3)'],
  ['04', 'var(--intro-piece-4)'], ['05', 'var(--intro-piece-5)'], ['06', 'var(--intro-piece-6)'],
] as const
const scatter = [{ x:-.34,y:-.25,rotate:-24,scale:.9 },{ x:.04,y:-.34,rotate:17,scale:1.06 },{ x:.31,y:-.18,rotate:-13,scale:.94 },{ x:-.31,y:.24,rotate:19,scale:1.03 },{ x:-.02,y:.34,rotate:-19,scale:.91 },{ x:.33,y:.24,rotate:23,scale:1.04 }] as const
const pause = (ms: number) => new Promise(resolve => window.setTimeout(resolve, ms))

export function PuzzleIntro() {
  const reducedMotion = useReducedMotion()
  const pieceControls = useAnimationControls()
  const boardControls = useAnimationControls()
  const overlayControls = useAnimationControls()
  const [visible, setVisible] = useState(() => { try { return sessionStorage.getItem(SESSION_KEY) !== 'true' } catch { return true } })
  const [phase, setPhase] = useState<'scattered'|'assembling'|'solved'|'flipping'>('scattered')
  const offsets = useMemo(() => { const width = typeof window === 'undefined' ? 1200 : window.innerWidth; const height = typeof window === 'undefined' ? 800 : window.innerHeight; const mobileFactor=width<700?.62:1; return scatter.map(item => ({ ...item, x:item.x*Math.min(width,1120)*mobileFactor, y:item.y*Math.min(height,820)*mobileFactor })) }, [])

  useEffect(() => {
    if (!visible) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    let cancelled = false
    const finish = () => { try { sessionStorage.setItem(SESSION_KEY, 'true') } catch { /* storage may be unavailable */ } document.body.style.overflow = previousOverflow; if (!cancelled) setVisible(false) }
    const run = async () => {
      if (reducedMotion) { setPhase('assembling'); await pieceControls.start('assembled'); if (cancelled) return; setPhase('solved'); await pause(80); if (cancelled) return; await overlayControls.start({ opacity:0 }, { duration:.12 }); finish(); return }
      await pause(80); if (cancelled) return; setPhase('assembling'); await pieceControls.start('assembled'); if (cancelled) return; setPhase('solved'); await pause(140); if (cancelled) return; setPhase('flipping'); await boardControls.start({ rotateY:12, rotateX:-2, scale:1.01 }, { duration:.45, ease:[.16,1,.3,1] }); if (cancelled) return; await pause(40); finish()
    }
    void run()
    return () => { cancelled=true; document.body.style.overflow=previousOverflow }
  }, [boardControls,overlayControls,pieceControls,reducedMotion,visible])

  if (!visible) return null
  return <motion.div className="puzzle-intro" data-intro-phase={phase} aria-hidden="true" animate={overlayControls} initial={{ opacity:1 }}>
    <div className="puzzle-intro__grain"/><p className="puzzle-intro__label">Assembling / {portfolio.person.initials}</p>
    <div className="puzzle-intro__stage"><motion.div className="puzzle-intro__card" animate={boardControls} initial={{ rotateY:0, rotateX:0, scale:1 }}>
      <div className="puzzle-intro__face puzzle-intro__front"><svg className="puzzle-intro__svg" viewBox="0 0 300 200" role="presentation">{pieces.map((piece,index) => { const row=Math.floor(index/3); const column=index%3; return <motion.path key={piece[0]} d={getPuzzlePath(getGridEdges(row,column,3,2))} fill={piece[1]} transform={`translate(${column*100} ${row*100})`} stroke="#181816" strokeWidth="1.2" vectorEffect="non-scaling-stroke" custom={index} initial={reducedMotion?'muted':'scattered'} animate={pieceControls} variants={{ scattered:{ ...offsets[index] }, muted:{ x:0,y:12,rotate:0,scale:.985,opacity:0 }, assembled:(i:number)=>({ x:0,y:0,rotate:0,scale:1,opacity:1,transition:reducedMotion?{duration:.18}:{type:'spring',stiffness:125,damping:15,mass:.8,delay:i*.045} }) }}/> })}</svg><span className="puzzle-intro__counter">06 / 06</span></div>
      <div className="puzzle-intro__face puzzle-intro__back"><div><span>Software / AI / Product</span><strong>I build<br/>systems that<br/>hold together.</strong></div></div>
    </motion.div></div>
    <p className="puzzle-intro__status">{phase==='solved'?'Portfolio ready':phase==='flipping'?'Entering portfolio':'Finding the right pieces'}</p>
  </motion.div>
}
