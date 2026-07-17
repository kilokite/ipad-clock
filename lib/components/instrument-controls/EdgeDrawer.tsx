'use client'

import classNames from 'classnames'
import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import css from '../css/InstrumentControls.module.scss'

export interface EdgeDrawerProps {
  open: boolean
  title: string
  description?: string
  edge?: 'right' | 'bottom'
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

export function EdgeDrawer({
  open,
  title,
  description,
  edge = 'right',
  onClose,
  children,
  footer,
}: EdgeDrawerProps) {
  const titleId = useId()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const animationFrame = requestAnimationFrame(() => closeButtonRef.current?.focus())

    return () => {
      cancelAnimationFrame(animationFrame)
      previousFocusRef.current?.focus()
    }
  }, [open])

  return (
    <div
      className={classNames(css.edgeDrawerLayer, open && css.edgeDrawerLayerOpen)}
      aria-hidden={!open}
      inert={!open}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose()
      }}
    >
      <button className={css.edgeDrawerBackdrop} type="button" tabIndex={-1} aria-hidden="true" onClick={onClose} />
      <section
        className={classNames(css.edgeDrawer, edge === 'bottom' && css.edgeDrawerBottom)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className={css.edgeDrawerHeader}>
          <div>
            <span>{description ?? 'SYSTEM PANEL'}</span>
            <h2 id={titleId}>{title}</h2>
          </div>
          <button ref={closeButtonRef} type="button" aria-label="关闭弹窗" onClick={onClose}><i /><i /></button>
        </header>
        <div className={css.edgeDrawerBody}>{children}</div>
        {footer && <footer className={css.edgeDrawerFooter}>{footer}</footer>}
      </section>
    </div>
  )
}
