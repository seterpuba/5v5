import type { RoundDefinition } from '../types'

export const rounds: RoundDefinition[] = [
  { number: 1, label: 'Prvé kolo', multiplier: 1, introVideo: '/media/1-kolo.mp4' },
  { number: 2, label: 'Druhé kolo', multiplier: 1, introVideo: '/media/2-kolo.mp4' },
  { number: 3, label: 'Dvojité body', multiplier: 2, introVideo: '/media/3-kolo.mp4' },
  { number: 4, label: 'Trojnásobné body', multiplier: 3, introVideo: '/media/4-kolo.mp4' },
  { number: 5, label: 'Rýchla päťka', multiplier: 1, introVideo: '/media/5-kolo.mp4' },
]

export const gameRules = {
  strikeLimit: 3,
  finalTarget: 200,
  firstFinalSeconds: 20,
  secondFinalSeconds: 25,
  rounds,
} as const
