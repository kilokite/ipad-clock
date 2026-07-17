'use client'

import classNames from 'classnames'
import css from '../css/InstrumentControls.module.scss'

export interface NumericLCDProps {
  value: string
  unit?: string
  label?: string
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
}: NumericLCDProps) {
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
