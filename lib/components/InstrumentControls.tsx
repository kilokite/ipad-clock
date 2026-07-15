'use client'

import classNames from 'classnames'
import type { CSSProperties } from 'react'
import css from './css/InstrumentControls.module.scss'

type SignalColor = 'green' | 'amber' | 'red'

const signalColors: Record<SignalColor, string> = {
  green: '#b7ff00',
  amber: '#e0a92f',
  red: '#e23527',
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
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
}: {
  value: number
  max?: number
  label?: string
}) {
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
                <stop offset="0%" stopColor="#705831" />
                <stop offset="52%" stopColor="#40331f" />
                <stop offset="100%" stopColor="#171611" />
              </radialGradient>
            </defs>
            <rect className={css.meterFace} x="2" y="2" width="296" height="214" rx="5" />
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
            <text className={css.meterLabel} x="150" y="139" textAnchor="middle">{label}</text>
            <text className={css.meterUnit} x="150" y="158" textAnchor="middle">A</text>
            <path className={css.meterMark} d="M135 165h30" />
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

const digitSegments: Record<string, string[]> = {
  '0': ['a', 'b', 'c', 'd', 'e', 'f'],
  '1': ['b', 'c'],
  '2': ['a', 'b', 'd', 'e', 'g'],
  '3': ['a', 'b', 'c', 'd', 'g'],
  '4': ['b', 'c', 'f', 'g'],
  '5': ['a', 'c', 'd', 'f', 'g'],
  '6': ['a', 'c', 'd', 'e', 'f', 'g'],
  '7': ['a', 'b', 'c'],
  '8': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  '9': ['a', 'b', 'c', 'd', 'f', 'g'],
  '-': ['g'],
  ' ': [],
}

function SegmentDigit({ character }: { character: string }) {
  if (character === '.') return <span className={css.decimalPoint} />
  const active = digitSegments[character] ?? []
  return (
    <span className={css.segmentDigit}>
      {['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((segment) => (
        <i className={classNames(css[`segment${segment.toUpperCase()}`], active.includes(segment) && css.segmentLit)} key={segment} />
      ))}
    </span>
  )
}

export function NumericLCD({
  value,
  unit = 'A',
  label = 'CURRENT',
}: {
  value: string
  unit?: string
  label?: string
}) {
  return (
    <div className={css.numericLCD} aria-label={`${label} ${value} ${unit}`} role="img">
      <div className={css.lcdFasteners}><span /><span /></div>
      <div className={css.numericWindow}>
        <div className={css.numericDigits}>{Array.from(value).map((character, index) => <SegmentDigit character={character} key={`${character}-${index}`} />)}</div>
        <span className={css.numericUnit}>{unit}</span>
        <span className={css.numericLabel}>{label}</span>
      </div>
    </div>
  )
}

function formatLCDLine(line: string) {
  return line.slice(0, 16).padEnd(16, ' ')
}

export function LCD1602A({
  lines,
  backlight = true,
}: {
  lines: [string, string]
  backlight?: boolean
}) {
  return (
    <div className={classNames(css.lcdModule, !backlight && css.lcdBacklightOff)} role="img" aria-label={`LCD1602A ${backlight ? '背光开启' : '背光关闭'}：${lines.join('，')}`}>
      <span className={css.lcdScrew} /><span className={css.lcdScrew} />
      <span className={css.lcdScrew} /><span className={css.lcdScrew} />
      <div className={css.lcdBezel}>
        <div className={css.lcdScreen}>
          <p>{formatLCDLine(lines[0])}</p>
          <p>{formatLCDLine(lines[1])}</p>
        </div>
      </div>
      <span className={css.moduleMark}>LCD 1602A</span>
    </div>
  )
}

export function ElectricalButton({
  label,
  active,
  onClick,
  color = 'red',
}: {
  label: string
  active: boolean
  onClick: () => void
  color?: SignalColor
}) {
  return (
    <div className={css.electricalControl} style={{ '--signal-color': signalColors[color] } as CSSProperties}>
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
      <span className={css.electricalLabel}>{label}</span>
    </div>
  )
}

export function InsetProgress({
  label,
  value,
  color = 'green',
  segmented = false,
}: {
  label: string
  value: number
  color?: SignalColor
  segmented?: boolean
}) {
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

export function SteppedSelector<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: readonly T[]
  value: T
  onChange: (value: T) => void
}) {
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
