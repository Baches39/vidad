export const DURATION = 30
export const TRANSITION = 0.7

export type SceneId =
  | 'intro'
  | 'computer'
  | 'phone'
  | 'it'
  | 'school'
  | 'printer'
  | 'game'
  | 'flexi'
  | 'finale'

export type EnterType = 'none' | 'fade' | 'push' | 'zoom' | 'crossfade'

export type Scene = {
  id: SceneId
  start: number
  end: number
  enter: EnterType
}

export const SCENES: Scene[] = [
  { id: 'intro', start: 0, end: 3.5, enter: 'none' },
  { id: 'computer', start: 3.5, end: 7, enter: 'fade' },
  { id: 'phone', start: 7, end: 10, enter: 'push' },
  { id: 'it', start: 10, end: 13, enter: 'zoom' },
  { id: 'school', start: 13, end: 16, enter: 'push' },
  { id: 'printer', start: 16, end: 19.5, enter: 'fade' },
  { id: 'game', start: 19.5, end: 22.5, enter: 'zoom' },
  { id: 'flexi', start: 22.5, end: 25.5, enter: 'crossfade' },
  { id: 'finale', start: 25.5, end: DURATION, enter: 'fade' },
]

export type SoundName = 'whoosh' | 'softWhoosh' | 'click' | 'impact' | 'notify' | 'printer' | 'chime'

export const CUES: { time: number; sound: SoundName }[] = [
  { time: 0.35, sound: 'softWhoosh' },
  { time: 0.95, sound: 'impact' },
  { time: 1.9, sound: 'click' },
  { time: 3.5, sound: 'whoosh' },
  { time: 4.45, sound: 'click' },
  { time: 4.7, sound: 'click' },
  { time: 4.95, sound: 'click' },
  { time: 7, sound: 'whoosh' },
  { time: 7.55, sound: 'click' },
  { time: 10, sound: 'whoosh' },
  { time: 10.55, sound: 'click' },
  { time: 13, sound: 'whoosh' },
  { time: 13.55, sound: 'click' },
  { time: 16, sound: 'softWhoosh' },
  { time: 16.9, sound: 'printer' },
  { time: 19.5, sound: 'whoosh' },
  { time: 20.7, sound: 'click' },
  { time: 21.2, sound: 'click' },
  { time: 21.5, sound: 'notify' },
  { time: 22.5, sound: 'softWhoosh' },
  { time: 24.4, sound: 'notify' },
  { time: 25.5, sound: 'whoosh' },
  { time: 26.1, sound: 'impact' },
  { time: 27.1, sound: 'click' },
  { time: 29, sound: 'chime' },
]

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))
export const range = (t: number, start: number, end: number) => clamp((t - start) / (end - start))

export const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3)
export const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
export const easeOutExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x))
export const easeOutBack = (x: number) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

export function formatTime(seconds: number) {
  const s = Math.floor(seconds)
  return `0:${s.toString().padStart(2, '0')}`
}
