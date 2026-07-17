'use client'

import classNames from 'classnames'
import { useId, useState } from 'react'
import css from '../css/InstrumentControls.module.scss'

export interface PanelDropdownProps<T extends string> {
  label: string
  options: readonly T[]
  value: T
  onChange: (value: T) => void
  disabled?: boolean
}

export function PanelDropdown<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled = false,
}: PanelDropdownProps<T>) {
  const [open, setOpen] = useState(false)
  const listboxId = useId()

  return (
    <div
      className={classNames(css.panelDropdown, open && css.panelDropdownOpen)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setOpen(false)
      }}
    >
      <span className={css.panelDropdownLabel}>{label}</span>
      <div className={css.panelDropdownControl}>
        <button
          type="button"
          className={css.panelDropdownTrigger}
          aria-label={`${label}：${value}`}
          aria-controls={listboxId}
          aria-expanded={open}
          aria-haspopup="listbox"
          disabled={disabled}
          onClick={() => setOpen(!open)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              setOpen(true)
            }
          }}
        >
          <span className={css.panelDropdownValue}>{value}</span>
          <span className={css.panelDropdownHandle} aria-hidden="true"><i /><i /><i /></span>
        </button>
        <div
          className={css.panelDropdownMenu}
          id={listboxId}
          role="listbox"
          aria-label={label}
          aria-hidden={!open}
        >
          {options.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={option === value}
              tabIndex={open ? 0 : -1}
              onClick={() => {
                onChange(option)
                setOpen(false)
              }}
              key={option}
            >
              <i aria-hidden="true" />
              <span>{option}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
