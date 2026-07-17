'use client'

import classNames from 'classnames'
import type { CSSProperties } from 'react'
import css from '../css/InstrumentControls.module.scss'
import { signalColors } from './shared'
import type { SignalColor } from './types'

export interface ElectricalButtonProps {
  label: string
  active: boolean
  onClick: () => void
  color?: SignalColor
}

export function ElectricalButton({
  label,
  active,
  onClick,
  color = 'red',
}: ElectricalButtonProps) {
  return (
    <div className={classNames(css.electricalControl, active && css.electricalControlActive)} style={{ '--signal-color': signalColors[color] } as CSSProperties}>
      <button
        type="button"
        className={classNames(css.electricalButton, active && css.electricalButtonActive)}
        aria-label={label}
        aria-pressed={active}
        onClick={onClick}
      >
        <span className={css.buttonCollar}>
          <span className={css.buttonCap} />
        </span>
      </button>
      <span className={css.electricalLabel}>
        <i aria-hidden="true" />
        <span>{label}</span>
      </span>
    </div>
  )
}
