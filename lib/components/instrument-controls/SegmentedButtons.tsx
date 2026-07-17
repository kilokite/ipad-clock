'use client'

import classNames from 'classnames'
import css from '../css/InstrumentControls.module.scss'

export interface SegmentedButtonsProps<T extends string> {
  label: string
  options: readonly T[]
  value: T
  onChange: (value: T) => void
}

export function SegmentedButtons<T extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentedButtonsProps<T>) {
  return (
    <div className={css.segmentedControl}>
      <span className={css.segmentedLabel}>{label}</span>
      <div className={css.segmentedButtons} role="radiogroup" aria-label={label}>
        {options.map((option) => (
          <button
            type="button"
            role="radio"
            aria-checked={option === value}
            className={classNames(option === value && css.segmentedButtonActive)}
            onClick={() => onChange(option)}
            key={option}
          >
            <i aria-hidden="true" />
            <span>{option}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
