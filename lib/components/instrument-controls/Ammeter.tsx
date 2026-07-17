'use client'

import classNames from 'classnames'
import css from '../css/InstrumentControls.module.scss'
import { clamp } from './shared'

export interface AmmeterProps {
  value: number
  max?: number
  label?: string
}

function pointOnDial(cx: number, cy: number, radius: number, angle: number) {
  const radians = angle * Math.PI / 180
  return {
    x: Number((cx + Math.sin(radians) * radius).toFixed(4)),
    y: Number((cy - Math.cos(radians) * radius).toFixed(4)),
  }
}

export function Ammeter({
  value,
  max = 10,
  label = 'DC AMPERES',
}: AmmeterProps) {
  const safeValue = clamp(value, 0, max)
  const needleAngle = -58 + (safeValue / max) * 116
  const ticks = Array.from({ length: 41 }, (_, index) => {
    const angle = -58 + index * (116 / 40)
    const major = index % 8 === 0
    const medium = index % 4 === 0
    const outer = pointOnDial(150, 178, 121, angle)
    const inner = pointOnDial(150, 178, major ? 98 : medium ? 104 : 110, angle)
    return { angle, index, inner, major, outer }
  })

  return (
    <div className={css.ammeter}>
      <span className={css.meterScrew} /><span className={css.meterScrew} />
      <span className={css.meterScrew} /><span className={css.meterScrew} />
      <div className={css.meterBezel}>
        <div className={css.meterGlass}>
          <svg viewBox="0 0 300 218" role="meter" aria-label={`${label} ${safeValue.toFixed(1)} A`} aria-valuemin={0} aria-valuemax={max} aria-valuenow={safeValue}>
            <defs>
              <radialGradient id="ammeter-warm-face" cx="50%" cy="37%" r="72%">
                <stop offset="0%" stopColor="#f8f6f0" />
                <stop offset="64%" stopColor="#f1ede3" />
                <stop offset="100%" stopColor="#ded2b5" />
              </radialGradient>
            </defs>
            <rect className={css.meterFace} x="2" y="2" width="296" height="214" rx="5" />
            <path className={css.meterScaleArc} d="M67 127 A98 98 0 0 1 233 127" />
            {ticks.map((tick) => (
              <line
                className={classNames(css.meterTick, tick.major && css.meterTickMajor)}
                key={tick.index}
                x1={tick.outer.x}
                y1={tick.outer.y}
                x2={tick.inner.x}
                y2={tick.inner.y}
              />
            ))}
            {[0, 2, 4, 6, 8, 10].map((number, index) => {
              const position = pointOnDial(150, 178, 84, -58 + index * 23.2)
              return <text className={css.meterNumber} x={position.x} y={position.y + 4} textAnchor="middle" key={number}>{number}</text>
            })}
            <text className={css.meterLabel} x="150" y="140" textAnchor="middle">{label}</text>
            <text className={css.meterUnit} x="150" y="158" textAnchor="middle">A</text>
            <path className={css.meterMark} d="M135 165h30" />
            <g className={css.meterNeedleShadow} style={{ transform: `rotate(${needleAngle}deg)` }}>
              <path d="M150 181 L152 61 L155 181 Z" />
            </g>
            <g className={css.meterNeedle} style={{ transform: `rotate(${needleAngle}deg)` }}>
              <path d="M147.6 178 L149.1 58 L152.4 178 Z" />
            </g>
            <circle className={css.meterHubOuter} cx="150" cy="178" r="13" />
            <circle className={css.meterHubInner} cx="150" cy="178" r="6" />
          </svg>
        </div>
      </div>
    </div>
  )
}
