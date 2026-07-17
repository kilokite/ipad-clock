'use client'

import classNames from 'classnames'
import type { CSSProperties, ReactNode } from 'react'
import css from '../css/InstrumentControls.module.scss'
import { panelButtonColors } from './shared'
import type { PanelButtonIcon, PanelButtonTone } from './types'

export interface PanelButtonProps {
  children: ReactNode
  icon?: PanelButtonIcon
  tone?: PanelButtonTone
  finish?: 'mechanical' | 'classic' | 'subtle'
  active?: boolean
  compact?: boolean
  disabled?: boolean
  onClick: () => void
}

function PanelButtonGlyph({ icon }: { icon: PanelButtonIcon }) {
  const glyphs: Record<PanelButtonIcon, ReactNode> = {
    check: <path d="m6.5 12.5 3.6 3.6 7.8-8.2" />,
    reset: <><path d="M7.2 9.2A7 7 0 1 1 6 14" /><path d="M7.2 5.8v3.7H3.5" /></>,
    trash: <><path d="M7.4 8.2h9.2l-.6 10H8Z" /><path d="M5.8 8.2h12.4M9 5.5h6" /></>,
    more: <><circle cx="6" cy="12" r="1.25" /><circle cx="12" cy="12" r="1.25" /><circle cx="18" cy="12" r="1.25" /></>,
    lock: <><rect x="6.5" y="10.5" width="11" height="8" rx="1" /><path d="M9 10.5V8a3 3 0 0 1 6 0v2.5" /></>,
  }

  return <svg className={css.panelButtonIcon} viewBox="0 0 24 24" aria-hidden="true">{glyphs[icon]}</svg>
}

export function PanelButton({
  children,
  icon,
  tone = 'neutral',
  finish = 'mechanical',
  active,
  compact = false,
  disabled = false,
  onClick,
}: PanelButtonProps) {
  return (
    <button
      type="button"
      className={classNames(
        css.panelButton,
        finish === 'classic' && css.panelButtonClassic,
        finish === 'subtle' && css.panelButtonSubtle,
        compact && css.panelButtonCompact,
        active && css.panelButtonActive,
      )}
      style={{ '--panel-button-color': panelButtonColors[tone] } as CSSProperties}
      aria-pressed={active === undefined ? undefined : active}
      disabled={disabled}
      onClick={onClick}
    >
      <span className={css.panelButtonCap}>
        {icon && <PanelButtonGlyph icon={icon} />}
        <span>{children}</span>
      </span>
    </button>
  )
}
