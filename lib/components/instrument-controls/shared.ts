import type { PanelButtonTone, SignalColor, TapeButtonColor } from './types'

export const signalColors: Record<SignalColor, string> = {
  green: '#b7ff00',
  amber: '#e0a92f',
  red: '#e23527',
}

export const tapeButtonColors: Record<TapeButtonColor, string> = {
  red: '#ef4b3e',
  orange: '#f47a32',
  yellow: '#f2c83f',
  green: '#63c96b',
  blue: '#4e9be8',
  ivory: '#e7dfbd',
}

export const panelButtonColors: Record<PanelButtonTone, string> = {
  neutral: '#969696',
  green: '#8bcf52',
  amber: '#e0a03b',
  red: '#d95b50',
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
