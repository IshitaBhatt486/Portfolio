import { useEffect, useRef } from 'react'

const columns = 17
const rows = 10
const trailLifetime = 1500
const trailSlices = 6
const dots = Array.from({ length: columns * rows }, (_, index) => ({ x: (index % columns) / (columns - 1), y: Math.floor(index / columns) / (rows - 1) }))
type TrailPoint = { x: number; y: number; time: number }

export function HeroCursorEffect() {
  const rootRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const trailBoxRefs = useRef<(HTMLSpanElement | null)[]>([])
  const trailPathRefs = useRef<(SVGPathElement | null)[]>([])
  const dotRefs = useRef<(SVGCircleElement | null)[]>([])

  useEffect(() => {
    const root = rootRef.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(pointer: coarse)').matches) return

    const initialBounds = root.getBoundingClientRect()
    let target = { x: initialBounds.left + initialBounds.width / 2, y: initialBounds.top + initialBounds.height / 2 }
    const follower = { ...target }
    const boxTrail = Array.from({ length: 3 }, () => ({ ...target }))
    const points: TrailPoint[] = []
    let lastPoint = 0
    let isInside = false
    let frame = 0
    const move = (event: PointerEvent) => {
      const bounds = root.getBoundingClientRect()
      isInside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom
      if (isInside) target = { x: event.clientX, y: event.clientY }
    }
    const animate = (time: number) => {
      const bounds = root.getBoundingClientRect()
      follower.x += (target.x - follower.x) * 0.16
      follower.y += (target.y - follower.y) * 0.16
      const tracked = { x: follower.x - bounds.left, y: follower.y - bounds.top }

      if (isInside && (time - lastPoint > 26 || !points.length || Math.hypot(points.at(-1)!.x - tracked.x, points.at(-1)!.y - tracked.y) > 7)) {
        points.push({ ...tracked, time })
        lastPoint = time
      }
      while (points.length && time - points[0].time > trailLifetime) points.shift()
      for (let slice = 0; slice < trailSlices; slice += 1) {
        const newest = time - slice * (trailLifetime / trailSlices)
        const oldest = newest - trailLifetime / trailSlices
        const slicePoints = points.filter(point => point.time >= oldest && point.time <= newest)
        const path = trailPathRefs.current[slice]
        if (!path) continue
        path.setAttribute('d', slicePoints.length > 1 ? `M ${slicePoints.map(point => `${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' L ')}` : '')
        path.style.opacity = String(Math.max(0, 0.78 - slice * 0.12))
      }

      boxTrail.forEach((trail, index) => {
        const leader = index === 0 ? follower : boxTrail[index - 1]
        trail.x += (leader.x - trail.x) * 0.18
        trail.y += (leader.y - trail.y) * 0.18
        trailBoxRefs.current[index]?.style.setProperty('transform', `translate3d(${trail.x - bounds.left - 17}px, ${trail.y - bounds.top - 17}px, 0) scale(${1 - index * 0.14})`)
        trailBoxRefs.current[index]?.style.setProperty('opacity', isInside ? String(.28 - index * .1) : '0')
      })
      boxRef.current?.style.setProperty('transform', `translate3d(${tracked.x - 17}px, ${tracked.y - 17}px, 0)`)
      boxRef.current?.style.setProperty('opacity', isInside ? '.9' : '0')

      dotRefs.current.forEach((dot, index) => {
        if (!dot) return
        const node = dots[index]
        const distance = Math.hypot(node.x * bounds.width - tracked.x, node.y * bounds.height - tracked.y)
        const strength = isInside ? Math.max(0, 1 - distance / 150) : 0
        dot.setAttribute('r', String(0.8 + strength * 1.7))
        dot.setAttribute('opacity', String(0.25 + strength * 0.65))
      })
      frame = requestAnimationFrame(animate)
    }
    window.addEventListener('pointermove', move, { passive: true })
    frame = requestAnimationFrame(animate)
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(frame) }
  }, [])

  return <div className="hero-cursor-effect" ref={rootRef} aria-hidden="true">
    <svg className="hero-cursor-effect__grid">{dots.map((dot, index) => <circle cx={`${dot.x * 100}%`} cy={`${dot.y * 100}%`} r=".8" key={index} ref={element => { dotRefs.current[index] = element }} />)}</svg>
    <svg className="hero-cursor-effect__trail">{Array.from({ length: trailSlices }, (_, index) => <path key={index} ref={element => { trailPathRefs.current[index] = element }} />)}</svg>
    {[0, 1, 2].map(index => <span className={`hero-cursor-effect__trail-box hero-cursor-effect__trail-box--${index + 1}`} key={index} ref={element => { trailBoxRefs.current[index] = element }} />)}
    <div className="hero-cursor-effect__box" ref={boxRef}><span>OBJECT / 01</span><i /></div>
  </div>
}
