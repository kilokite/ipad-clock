'use client'

import classNames from 'classnames'
import css from './css/MachineControls.module.scss'

type ControlSize = 'compact' | 'regular'

export function RotaryKnob({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit,
  size = 'regular',
  onChange,
}: {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  unit?: string
  size?: ControlSize
  onChange: (value: number) => void
}) {
  const safeValue = Math.min(max, Math.max(min, value))
  const progress = (safeValue - min) / (max - min || 1)
  const rotation = -132 + progress * 264

  return (
    <div className={classNames(css.rotaryControl, css[size])}>
      <div className={css.knobStage}>
        <div className={css.tickRing} aria-hidden="true" />
        <div className={css.knob} style={{ transform: `rotate(${rotation}deg)` }} aria-hidden="true">
          <span className={css.knobMark} />
        </div>
        <input
          className={css.knobInput}
          type="range"
          min={min}
          max={max}
          step={step}
          value={safeValue}
          aria-label={label}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </div>
      <div className={css.controlReadout}>
        <span>{label}</span>
        <output>{safeValue}{unit}</output>
      </div>
    </div>
  )
}

export function GuardedToggle({
  label,
  checked,
  onChange,
  tone = 'green',
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  tone?: 'green' | 'amber'
}) {
  return (
    <button
      type="button"
      className={classNames(css.toggleControl, checked && css.toggleOn, css[tone])}
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
    >
      <span className={css.toggleHardware} aria-hidden="true">
        <span className={css.toggleSlot} />
        <span className={css.toggleLever} />
      </span>
      <span className={css.toggleCopy}>
        <strong>{label}</strong>
        <small>{checked ? '运行' : '待机'}</small>
      </span>
      <span className={css.toggleLamp} aria-hidden="true" />
    </button>
  )
}

export function AnalogMeter({
  label,
  value,
  min = 0,
  max = 100,
  unit,
  cautionAt = 78,
}: {
  label: string
  value: number
  min?: number
  max?: number
  unit?: string
  cautionAt?: number
}) {
  const safeValue = Math.min(max, Math.max(min, value))
  const progress = (safeValue - min) / (max - min || 1)
  const rotation = -54 + progress * 108

  return (
    <div className={css.meter}>
      <div className={css.meterFace}>
        <div className={css.meterTicks} aria-hidden="true" />
        <span className={css.meterMin}>{min}</span>
        <span className={css.meterMax}>{max}</span>
        <span className={css.meterLabel}>{label}</span>
        <span className={css.meterUnit}>{unit}</span>
        <div className={css.needle} style={{ transform: `rotate(${rotation}deg)` }} aria-hidden="true" />
        <span className={css.needlePin} aria-hidden="true" />
      </div>
      <div className={css.meterReadout}>
        <span className={safeValue >= cautionAt ? css.caution : undefined} />
        {safeValue.toString().padStart(2, '0')}
      </div>
    </div>
  )
}

export function LinearFader({
  label,
  value,
  min = 0,
  max = 100,
  unit,
  onChange,
}: {
  label: string
  value: number
  min?: number
  max?: number
  unit?: string
  onChange: (value: number) => void
}) {
  const progress = ((value - min) / (max - min || 1)) * 100

  return (
    <label className={css.fader}>
      <span className={css.faderHeading}>
        <span>{label}</span>
        <output>{value}{unit}</output>
      </span>
      <span className={css.faderScale} aria-hidden="true">
        <i>0</i><i>25</i><i>50</i><i>75</i><i>100</i>
      </span>
      <span className={css.faderTrack} style={{ '--fader-progress': `${progress}%` } as React.CSSProperties}>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          aria-label={label}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </span>
    </label>
  )
}

export function SegmentedSwitch<T extends string>({
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
    <fieldset className={css.segmentedField}>
      <legend>{label}</legend>
      <div className={css.segmentedSwitch}>
        {options.map((option) => (
          <button
            type="button"
            key={option}
            className={option === value ? css.segmentActive : undefined}
            aria-pressed={option === value}
            onClick={() => onChange(option)}
          >
            <span>{option}</span>
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export function DrumCounter({
  label,
  value,
  digits = 5,
  unit,
}: {
  label: string
  value: number
  digits?: number
  unit?: string
}) {
  const characters = Math.max(0, Math.round(value)).toString().padStart(digits, '0').slice(-digits).split('')

  return (
    <div className={css.counter}>
      <div className={css.counterTopline}>
        <span>{label}</span>
        <small>{unit}</small>
      </div>
      <div
        className={css.counterWindow}
        style={{ gridTemplateColumns: `repeat(${digits}, 1fr)` }}
        aria-label={`${label} ${characters.join('')} ${unit ?? ''}`}
      >
        {characters.map((character, index) => (
          <span className={css.counterDrum} key={`${index}-${character}`}>
            <i>{character}</i>
          </span>
        ))}
      </div>
      <div className={css.counterSeal}>CAL · 07</div>
    </div>
  )
}

export function ScopeDisplay({
  label,
  active = true,
}: {
  label: string
  active?: boolean
}) {
  return (
    <div className={classNames(css.scope, !active && css.scopeIdle)}>
      <div className={css.scopeHeader}>
        <span>{label}</span>
        <small><i /> CH · A</small>
      </div>
      <div className={css.scopeGlass}>
        <svg viewBox="0 0 320 128" role="img" aria-label={`${label} 波形`} preserveAspectRatio="none">
          <path className={css.scopeGrid} d="M0 32H320M0 64H320M0 96H320M40 0V128M80 0V128M120 0V128M160 0V128M200 0V128M240 0V128M280 0V128" />
          <path className={css.scopeTraceGlow} d="M0 72 C18 72 20 46 37 46 S58 82 76 82 S99 57 116 57 S139 68 157 68 S177 38 197 38 S220 91 242 91 S265 60 281 60 S302 73 320 73" />
          <path className={css.scopeTrace} d="M0 72 C18 72 20 46 37 46 S58 82 76 82 S99 57 116 57 S139 68 157 68 S177 38 197 38 S220 91 242 91 S265 60 281 60 S302 73 320 73" />
        </svg>
        <span className={css.scopeSweep} aria-hidden="true" />
      </div>
      <div className={css.scopeFooter}>
        <span>20 ms</span><span>0.5 V</span><span>SYNC</span>
      </div>
    </div>
  )
}
