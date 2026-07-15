'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Ammeter,
  ElectricalButton,
  InsetProgress,
  LCD1602A,
  NumericLCD,
  SteppedSelector,
} from '@/lib/components/InstrumentControls'
import styles from './page.module.scss'

const inputSources = ['LINE', 'USB', 'BT'] as const
const outputModes = ['A类', 'AB类', '直通'] as const

export default function ComponentsPage() {
  const [power, setPower] = useState(true)
  const [mute, setMute] = useState(false)
  const [protect, setProtect] = useState(false)
  const [source, setSource] = useState<(typeof inputSources)[number]>('LINE')
  const [mode, setMode] = useState<(typeof outputModes)[number]>('A类')
  const [level, setLevel] = useState(68)
  const [bias, setBias] = useState(3.6)

  const outputLevel = power && !mute ? level : 0
  const displayCurrent = power ? bias : 0
  const rightLevel = Math.max(0, Math.min(100, outputLevel - 7))

  return (
    <main className={styles.page}>
      <section className={styles.amplifier} aria-label="ZS A-01 综合功放控制面板">
        <header className={styles.header}>
          <div className={styles.brand}>
            <strong>ZS A-01</strong>
            <span>INTEGRATED AMPLIFIER</span>
          </div>
          <div className={styles.headerState}>
            <i className={power ? styles.online : ''} />
            <span>{power ? 'OPERATE' : 'STANDBY'}</span>
          </div>
          <Link href="/" aria-label="返回时钟">←</Link>
        </header>

        <div className={styles.instrumentDeck}>
          <div className={styles.meterModule}>
            <div className={styles.moduleLabel}><span>BIAS CURRENT</span><output>{displayCurrent.toFixed(1)} A</output></div>
            <Ammeter value={displayCurrent} label="BIAS CURRENT" />
            <label className={styles.rangeControl}>
              <span>BIAS</span>
              <input type="range" min="0" max="10" step="0.1" value={bias} onChange={(event) => setBias(Number(event.target.value))} />
            </label>
          </div>

          <div className={styles.systemModule}>
            <div className={styles.displayRow}>
              <NumericLCD value={displayCurrent.toFixed(1).padStart(4, '0')} unit="A" label="CURRENT" />
              <LCD1602A
                backlight={power}
                lines={[`INPUT ${source} 96K`, power ? (mute ? 'OUTPUT MUTED' : `OUTPUT ${outputLevel}`) : 'SYSTEM STANDBY']}
              />
            </div>
            <div className={styles.buttonBank}>
              <ElectricalButton label="电源" active={power} color="green" onClick={() => setPower(!power)} />
              <ElectricalButton label="静音" active={mute} color="amber" onClick={() => setMute(!mute)} />
              <ElectricalButton label="保护" active={protect} color="red" onClick={() => setProtect(!protect)} />
            </div>
          </div>
        </div>

        <div className={styles.controlDeck}>
          <div className={styles.levelModule}>
            <InsetProgress label="LEFT OUTPUT" value={outputLevel} />
            <InsetProgress label="RIGHT OUTPUT" value={rightLevel} color="amber" segmented />
            <label className={styles.rangeControl}>
              <span>MASTER LEVEL <output>{level}</output></span>
              <input type="range" min="0" max="100" value={level} onChange={(event) => setLevel(Number(event.target.value))} />
            </label>
          </div>
          <div className={styles.selectorModule}>
            <SteppedSelector label="INPUT" options={inputSources} value={source} onChange={setSource} />
            <SteppedSelector label="OUTPUT MODE" options={outputModes} value={mode} onChange={setMode} />
          </div>
        </div>

      </section>
    </main>
  )
}
