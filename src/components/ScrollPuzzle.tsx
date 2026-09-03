import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { HomeSections } from '../sections/HomeSections'
import { getStandaloneEdges, getPuzzlePath } from '../lib/puzzleGeometry'

export function ScrollPuzzle() {
  const trackRef=useRef<HTMLDivElement>(null)
  const railRef=useRef<HTMLDivElement>(null)
  const pieceRef=useRef<SVGSVGElement>(null)
  const [travel,setTravel]=useState(0)
  const reducedMotion=useReducedMotion()
  const {scrollY,scrollYProgress}=useScroll({target:trackRef,offset:['start start','end end']})
  const progress=useSpring(scrollYProgress,{stiffness:95,damping:25,mass:.32})
  const scrollVelocity=useVelocity(scrollY)
  const velocity=useSpring(scrollVelocity,{stiffness:120,damping:30,mass:.25})
  const y=useTransform(progress,[0,.08,.2,.4,.62,.8,.94,1],[0,travel*.05,travel*.17,travel*.39,travel*.61,travel*.79,travel*.94,travel])
  const x=useTransform(progress,[0,.2,.4,.62,.8,1],[0,-8,5,-6,7,0])
  const orientation=useTransform(progress,[0,.18,.38,.58,.78,.94,1],[-10,8,88,72,158,184,180])
  const velocityTilt=useTransform(velocity,[-2400,0,2400],[-9,0,9],{clamp:true})
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

  return <div className="homepage-track" ref={trackRef}>
    <div className="scroll-puzzle-rail" ref={railRef} aria-hidden="true">
      <motion.svg ref={pieceRef} className="scroll-puzzle" viewBox="0 0 100 100" style={reducedMotion?undefined:{x,y,rotate,scale}}>
        <path d={getPuzzlePath(getStandaloneEdges(0))}/>
        <path className="scroll-puzzle__mark" d="M18 18H34M18 26H45"/>
      </motion.svg>
    </div>
    <div className="homepage-track__content"><HomeSections/></div>
  </div>
}
