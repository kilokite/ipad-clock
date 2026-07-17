'use client'

import classNames from 'classnames'
import type { CSSProperties } from 'react'
import css from '../css/InstrumentControls.module.scss'
import { clamp, signalColors } from './shared'
import type { SignalColor } from './types'

export interface InsetProgressProps {
  label: string
  value: number
  color?: SignalColor
  segmented?: boolean
}

export function InsetProgress({
  label,
  value,
  color = 'green',
  segmented = false,
}: InsetProgressProps) {
  const safeValue = clamp(value, 0, 100)
  return (
    <div className={css.progressControl} style={{ '--progress': `${safeValue}%`, '--signal-color': signalColors[color] } as CSSProperties}>
      <div className={css.progressHeader}>
        <span>{label}</span>
        <output>{Math.round(safeValue)}%</output>
      </div>
      <div className={classNames(css.progressHousing, segmented && css.progressSegmented)} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={safeValue}>
        <div className={css.progressFill} />
        <div className={css.progressGlass} />
      </div>
    </div>
  )
}
