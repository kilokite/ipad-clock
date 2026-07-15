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
  TapeButton,
} from '@/lib/components/InstrumentControls'
import styles from './page.module.scss'

const inputSources = ['LINE', 'USB', 'BT'] as const
const outputModes = ['A类', 'AB类', '直通'] as const
type TransportMode = 'stop' | 'play' | 'record' | 'rewind' | 'fast-forward'

export default function ComponentsPage() {
  const [power, setPower] = useState(true)
  const [mute, setMute] = useState(false)
  const [protect, setProtect] = useState(false)
  const [source, setSource] = useState<(typeof inputSources)[number]>('LINE')
  const [mode, setMode] = useState<(typeof outputModes)[number]>('A类')
  const [level, setLevel] = useState(68)
  const [bias, setBias] = useState(3.6)
  const [transport, setTransport] = useState<TransportMode>('stop')
  const [paused, setPaused] = useState(false)
  const [autoReverse, setAutoReverse] = useState(true)

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

        <div className={styles.transportModule}>
          <div className={styles.transportHeader}>
            <div>
              <span>CASSETTE TRANSPORT</span>
              <small>DIRECT LOGIC CONTROL</small>
            </div>
            <output>{paused ? 'PAUSE' : transport.replace('-', ' ').toUpperCase()}</output>
          </div>
          <div className={styles.transportControls}>
            <div className={styles.transportGroup}>
              <span className={styles.controlLabel}>MECHANISM</span>
              <div className={styles.tapeButtonBank}>
                <TapeButton label="倒带" icon="rewind" color="blue" pressed={transport === 'rewind'} onClick={() => { setTransport('rewind'); setPaused(false) }} />
                <TapeButton label="停止" icon="stop" color="ivory" pressed={transport === 'stop'} onClick={() => { setTransport('stop'); setPaused(false) }} />
                <TapeButton label="播放" icon="play" color="green" pressed={transport === 'play'} onClick={() => { setTransport('play'); setPaused(false) }} />
                <TapeButton label="录音" icon="record" color="red" pressed={transport === 'record'} onClick={() => { setTransport('record'); setPaused(false) }} />
                <TapeButton label="快进" icon="fast-forward" color="blue" pressed={transport === 'fast-forward'} onClick={() => { setTransport('fast-forward'); setPaused(false) }} />
              </div>
            </div>
            <div className={styles.transportGroup}>
              <span className={styles.controlLabel}>FUNCTION</span>
              <div className={styles.tapeButtonBank}>
                <TapeButton label="PAUSE" shape="wide" color="yellow" pressed={paused} onClick={() => setPaused(!paused)} />
                <TapeButton label="AUTO REVERSE" shape="wide" color="blue" pressed={autoReverse} onClick={() => setAutoReverse(!autoReverse)} />
                <TapeButton label="EJECT" shape="wide" color="orange" onClick={() => { setTransport('stop'); setPaused(false) }} />
              </div>
            </div>
          </div>
        </div>

      </section>
    </main>
  )
}
