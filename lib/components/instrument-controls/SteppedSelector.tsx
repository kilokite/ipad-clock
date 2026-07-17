'use client'

import classNames from 'classnames'
import type { CSSProperties } from 'react'
import css from '../css/InstrumentControls.module.scss'

export interface SteppedSelectorProps<T extends string> {
  label: string
  options: readonly T[]
  value: T
  onChange: (value: T) => void
}

export function SteppedSelector<T extends string>({
  label,
  options,
  value,
  onChange,
}: SteppedSelectorProps<T>) {
  return (
    <div className={css.selectorControl}>
      <span className={css.selectorLabel}>{label}</span>
      <div
        className={css.steppedSelector}
        role="radiogroup"
        aria-label={label}
        style={{ '--selector-count': options.length, '--selector-index': Math.max(0, options.indexOf(value)) } as CSSProperties}
      >
        <div className={css.selectorRail} aria-hidden="true">
          <span className={css.selectorThumb}><i /><i /><i /></span>
        </div>
        <div className={css.selectorOptions}>
          {options.map((option) => (
            <button
              type="button"
              role="radio"
              aria-checked={value === option}
              className={classNames(value === option && css.selectorOptionActive)}
              onClick={() => onChange(option)}
              key={option}
            >
              <i />
              <span>{option}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
