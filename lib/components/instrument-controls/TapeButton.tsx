'use client'

import classNames from 'classnames'
import type { CSSProperties, ReactNode } from 'react'
import css from '../css/InstrumentControls.module.scss'
import { tapeButtonColors } from './shared'
import type { TapeButtonColor, TapeButtonIcon } from './types'

export interface TapeButtonProps {
  label: string
  icon?: TapeButtonIcon
  color?: TapeButtonColor
  shape?: 'square' | 'wide'
  diagonalLight?: boolean
  pressed?: boolean
  disabled?: boolean
  onClick: () => void
}

function TapeButtonGlyph({ icon }: { icon: TapeButtonIcon }) {
  const glyphs: Record<TapeButtonIcon, ReactNode> = {
    record: <circle cx="16" cy="16" r="7.5" />,
    play: <path d="M11 8.5 24 16l-13 7.5Z" />,
    stop: <rect x="9" y="9" width="14" height="14" rx="1" />,
    pause: <><rect x="9" y="8" width="5" height="16" rx="1" /><rect x="18" y="8" width="5" height="16" rx="1" /></>,
    rewind: <><path d="m16 9-9 7 9 7Z" /><path d="m25 9-9 7 9 7Z" /></>,
    'fast-forward': <><path d="m7 9 9 7-9 7Z" /><path d="m16 9 9 7-9 7Z" /></>,
    eject: <><path d="m16 8-8 10h16Z" /><rect x="8" y="21" width="16" height="3" rx="1" /></>,
  }

  return <svg className={css.tapeButtonIcon} viewBox="0 0 32 32" aria-hidden="true">{glyphs[icon]}</svg>
}

export function TapeButton({
  label,
  icon,
  color = 'ivory',
  shape = 'square',
  diagonalLight = false,
  pressed,
  disabled = false,
  onClick,
}: TapeButtonProps) {
  return (
    <button
      type="button"
      className={classNames(
        css.tapeButton,
        shape === 'wide' && css.tapeButtonWide,
        diagonalLight && css.tapeButtonDiagonalLight,
        pressed && css.tapeButtonPressed,
      )}
      style={{ '--button-color': tapeButtonColors[color] } as CSSProperties}
      aria-label={icon ? label : undefined}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
    >
      <span className={css.tapeButtonCap}>
        {icon ? <TapeButtonGlyph icon={icon} /> : <span className={css.tapeButtonText}>{label}</span>}
      </span>
    </button>
  )
}
