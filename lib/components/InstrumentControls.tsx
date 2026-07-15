'use client'

import classNames from 'classnames'
import type { CSSProperties, ReactNode } from 'react'
import css from './css/InstrumentControls.module.scss'

type SignalColor = 'green' | 'amber' | 'red'
type TapeButtonColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'ivory'
type TapeButtonIcon = 'record' | 'play' | 'stop' | 'pause' | 'rewind' | 'fast-forward' | 'eject'

const signalColors: Record<SignalColor, string> = {
  green: '#b7ff00',
  amber: '#e0a92f',
  red: '#e23527',
}

const tapeButtonColors: Record<TapeButtonColor, string> = {
  red: '#c94d3b',
  orange: '#ce713a',
  yellow: '#c9a643',
  green: '#5c925c',
  blue: '#547aa1',
  ivory: '#c7c1a5',
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

function SegmentDigit({ character, decimal = false }: { character: string; decimal?: boolean }) {
  const active = digitSegments[character] ?? []
  return (
    <span className={css.segmentDigit}>
      {['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((segment) => (
        <i className={classNames(css[`segment${segment.toUpperCase()}`], active.includes(segment) && css.segmentLit)} key={segment} />
      ))}
      {decimal && <i className={classNames(css.decimalPoint, css.segmentLit)} />}
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
  const digits = Array.from(value).reduce<{ character: string; decimal: boolean }[]>((result, character) => {
    if (character === '.') {
      const previousDigit = result.at(-1)
      if (previousDigit) previousDigit.decimal = true
      return result
    }

    result.push({ character, decimal: false })
    return result
  }, [])

  return (
    <div className={css.numericLCD} aria-label={`${label} ${value} ${unit}`} role="img">
      <div className={css.lcdFasteners}><span /><span /></div>
      <div className={css.numericWindow}>
        <div className={css.numericDigits}>{digits.map((digit, index) => <SegmentDigit {...digit} key={`${digit.character}-${index}`} />)}</div>
        <div className={css.numericMeta}>
          <span className={css.numericLabel}>{label}</span>
          <span className={css.numericUnit}>{unit}</span>
        </div>
      </div>
    </div>
  )
}

const lcdGlyphs: Record<string, string[]> = {
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
  '.': ['00000', '00000', '00000', '00000', '00000', '00110', '00110'],
  '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  '2': ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  '3': ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  '5': ['11111', '10000', '10000', '11110', '00001', '00001', '11110'],
  '6': ['01110', '10000', '10000', '11110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00001', '01110'],
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  G: ['01111', '10000', '10000', '10111', '10001', '10001', '01111'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['01110', '00100', '00100', '00100', '00100', '00100', '01110'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
}

function DotMatrixLine({ text }: { text: string }) {
  const characters = Array.from(text.slice(0, 16).padEnd(16, ' '))
  return (
    <div className={css.lcdLine} aria-hidden="true">
      {characters.map((character, characterIndex) => {
        const rows = lcdGlyphs[character] ?? lcdGlyphs[' ']
        return (
          <span className={css.lcdCharacter} key={`${character}-${characterIndex}`}>
            {rows.flatMap((row, rowIndex) => Array.from(row).map((pixel, columnIndex) => (
              <i className={pixel === '1' ? css.lcdPixelOn : undefined} key={`${rowIndex}-${columnIndex}`} />
            )))}
          </span>
        )
      })}
    </div>
  )
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
          <DotMatrixLine text={lines[0]} />
          <DotMatrixLine text={lines[1]} />
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

function TapeButtonGlyph({ icon }: { icon: TapeButtonIcon }) {
  const glyphs: Record<TapeButtonIcon, ReactNode> = {
    record: <circle cx="16" cy="16" r="7.5" />,
    play: <path d="M11 8.5 24 16l-13 7.5Z" />,
    stop: <rect x="9" y="9" width="14" height="14" rx="1" />,
    pause: <><rect x="9" y="8" width="5" height="16" rx="1" /><rect x="18" y="8" width="5" height="16" rx="1" /></>,
    rewind: <><path d="m16 9-9 7 9 7Z" /><path d="m25 9-9 7 9 7Z" /></>,
    'fast-forward': <><path d="m7 9 9 7-9 7Z" /><path d="m16 9 9 7-9 7Z" /></>,
    eject: <><path d="m16 8-8 10h16Z" /><rect x="8" y="21" width="16" height="3" rx="1" /></>,
  }

  return <svg className={css.tapeButtonIcon} viewBox="0 0 32 32" aria-hidden="true">{glyphs[icon]}</svg>
}

export function TapeButton({
  label,
  icon,
  color = 'ivory',
  shape = 'square',
  pressed,
  disabled = false,
  onClick,
}: {
  label: string
  icon?: TapeButtonIcon
  color?: TapeButtonColor
  shape?: 'square' | 'wide'
  pressed?: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={classNames(
        css.tapeButton,
        shape === 'wide' && css.tapeButtonWide,
        pressed && css.tapeButtonPressed,
      )}
      style={{ '--button-color': tapeButtonColors[color] } as CSSProperties}
      aria-label={icon ? label : undefined}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
    >
      <span className={css.tapeButtonCap}>
        {icon ? <TapeButtonGlyph icon={icon} /> : <span className={css.tapeButtonText}>{label}</span>}
      </span>
    </button>
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
