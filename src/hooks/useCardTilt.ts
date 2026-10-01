import { useCallback } from 'react'
import type { PointerEvent } from 'react'
import { useReducedMotion } from './useReducedMotion'

const resetTilt = (element: HTMLElement) => {
  element.style.removeProperty('--tilt-x')
  element.style.removeProperty('--tilt-y')
}

/** Pointer handlers for the shared portfolio card tilt interaction. */
export function useCardTilt() {
  const reducedMotion = useReducedMotion()

  const onPointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    if (reducedMotion || event.pointerType !== 'mouse') return

    const card = event.currentTarget
    const bounds = card.getBoundingClientRect()
    const tiltX = ((bounds.top + bounds.height / 2 - event.clientY) / bounds.height) * 6
    const tiltY = ((event.clientX - bounds.left - bounds.width / 2) / bounds.width) * 6

    card.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`)
    card.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`)
  }, [reducedMotion])

  const onPointerLeave = useCallback((event: PointerEvent<HTMLElement>) => {
    resetTilt(event.currentTarget)
  }, [])

  return { onPointerMove, onPointerLeave }
}
