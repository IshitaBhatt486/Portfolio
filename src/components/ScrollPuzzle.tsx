import { motion, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { HomeSections } from '../sections/HomeSections'
import { getStandaloneEdges, getPuzzlePath } from '../lib/puzzleGeometry'

export function ScrollPuzzle() {
  const trackRef=useRef<HTMLDivElement>(null)
  const railRef=useRef<HTMLDivElement>(null)
  const repellerRef=useRef<HTMLDivElement>(null)
  const pieceRef=useRef<SVGSVGElement>(null)
  const [travel,setTravel]=useState(0)
  const reducedMotion=useReducedMotion()
  const {scrollY,scrollYProgress}=useScroll({target:trackRef,offset:['start start','end end']})
  const repelTargetX=useMotionValue(0)
  const repelTargetY=useMotionValue(0)
  const repelX=useSpring(repelTargetX,{stiffness:210,damping:28,mass:.45})
  const repelY=useSpring(repelTargetY,{stiffness:210,damping:28,mass:.45})
  const scrollVelocity=useVelocity(scrollY)
  const velocity=useSpring(scrollVelocity,{stiffness:90,damping:36,mass:.35})
  const smoothProgress=useSpring(scrollYProgress,{stiffness:110,damping:28,mass:.4})
  const y=useTransform(smoothProgress,[0,1],[0,travel])
  const x=useTransform(smoothProgress,[0,.2,.4,.62,.8,1],[0,-8,5,-6,7,0])
  const orientation=useTransform(smoothProgress,[0,.18,.38,.58,.78,.94,1],[-10,8,88,72,158,184,180])
  const velocityTilt=useTransform(velocity,[-2400,0,2400],[-5,0,5],{clamp:true})
  const rotate=useTransform([orientation,velocityTilt],values=>Number(values[0])+Number(values[1]))
  const scale=useTransform(velocity,[-2600,0,2600],[1.055,1,1.055],{clamp:true})

  useEffect(()=>{
    const measure=()=>{const railHeight=railRef.current?.clientHeight??0;const pieceHeight=pieceRef.current?.getBoundingClientRect().height??0;setTravel(Math.max(0,railHeight-pieceHeight))}
    measure()
    const observer=new ResizeObserver(measure)
    if(trackRef.current)observer.observe(trackRef.current)
    if(railRef.current)observer.observe(railRef.current)
    window.addEventListener('resize',measure)
    return()=>{observer.disconnect();window.removeEventListener('resize',measure)}
  },[])

  useEffect(()=>{
    let frame=0
    let pointer:PointerEvent|undefined
    const repel=(event:PointerEvent)=>{
      if(reducedMotion || event.pointerType==='touch') return
      pointer=event
      if(frame) return
      frame=requestAnimationFrame(()=>{
        frame=0
        const piece=pieceRef.current
        if(!piece || !pointer) return
        // Measure the visible SVG, not its stationary wrapper. Remove the
        // current repel offset so the cursor does not chase a moving target.
        const bounds=piece.getBoundingClientRect()
        const centerX=bounds.left+bounds.width/2-repelX.get()
        const centerY=bounds.top+bounds.height/2-repelY.get()
        const deltaX=centerX-pointer.clientX
        const deltaY=centerY-pointer.clientY
      const distance=Math.hypot(deltaX,deltaY)
        const reach=Math.max(bounds.width,bounds.height)/2+150
      if(distance>=reach){repelTargetX.set(0);repelTargetY.set(0);return}
        const strength=(1-distance/reach)**2*72
      const direction=distance>.1?{x:deltaX/distance,y:deltaY/distance}:{x:1,y:0}
      repelTargetX.set(direction.x*strength)
      repelTargetY.set(direction.y*strength)
      })
    }
    window.addEventListener('pointermove',repel,{passive:true})
    return()=>{window.removeEventListener('pointermove',repel);if(frame)cancelAnimationFrame(frame)}
  },[reducedMotion,repelTargetX,repelTargetY,repelX,repelY])

  return <div className="homepage-track" ref={trackRef}>
    <div className="scroll-puzzle-rail" ref={railRef} aria-hidden="true">
      <motion.div className="scroll-puzzle-repeller" ref={repellerRef} style={reducedMotion?undefined:{x:repelX,y:repelY}}>
        <motion.svg ref={pieceRef} className="scroll-puzzle" viewBox="0 0 100 100" style={reducedMotion?undefined:{x,y,rotate,scale}}>
          <path d={getPuzzlePath(getStandaloneEdges(0))}/>
          <path className="scroll-puzzle__mark" d="M18 18H34M18 26H45"/>
        </motion.svg>
      </motion.div>
    </div>
    <div className="homepage-track__content"><HomeSections/></div>
  </div>
}
