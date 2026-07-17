'use client'

import classNames from 'classnames'
import css from '../css/InstrumentControls.module.scss'
import type { PanelControlFinish } from './types'

export interface PanelToggleProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  finish?: PanelControlFinish
  disabled?: boolean
}

export function PanelToggle({
  label,
  description,
  checked,
  onChange,
  finish = 'mechanical',
  disabled = false,
}: PanelToggleProps) {
  return (
    <div
      className={classNames(
        css.panelToggle,
        finish === 'subtle' && css.panelControlSubtle,
        disabled && css.panelControlDisabled,
      )}
    >
      <span className={css.panelControlCopy}>
        <strong>{label}</strong>
        {description && <small>{description}</small>}
      </span>
      <button
        type="button"
        className={classNames(css.panelToggleSwitch, checked && css.panelToggleSwitchOn)}
        role="switch"
        aria-label={label}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
      >
        <span><i /><i /><i /></span>
      </button>
    </div>
  )
}
