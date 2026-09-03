export const duration = { fast: 0.18, normal: 0.36, slow: 0.6 } as const
export const ease = { standard: [0.2, 0.8, 0.2, 1], enter: [0.16, 1, 0.3, 1], exit: [0.4, 0, 1, 1] } as const
export const transition = { micro: { duration: duration.fast, ease: ease.standard }, ui: { duration: duration.normal, ease: ease.standard }, page: { duration: duration.slow, ease: ease.enter } } as const
