'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Ammeter,
  EdgeDrawer,
  ElectricalButton,
  InsetProgress,
  LCD1602A,
  NumericLCD,
  PanelButton,
  PanelCheckbox,
  PanelDropdown,
  PanelToggle,
  SegmentedButtons,
  SteppedSelector,
  TapeButton,
} from '@/lib/components/InstrumentControls'
import styles from './page.module.scss'

const inputSources = ['LINE', 'USB', 'BT'] as const
const outputModes = ['A类', 'AB类', '直通'] as const
const tapeTypes = ['NORMAL TYPE I', 'CHROME TYPE II', 'METAL TYPE IV'] as const
const noiseReductionModes = ['OFF', 'DOLBY B', 'DOLBY C'] as const
const monitorSources = ['SOURCE', 'TAPE', 'AUTO'] as const
const listeningZones = ['A', 'A + B', 'B'] as const
type TransportMode = 'stop' | 'play' | 'record' | 'rewind' | 'fast-forward'
type ButtonFinish = 'mechanical' | 'classic' | 'subtle'

function ButtonStyleShowcase({
  finish,
  title,
  description,
  onCommand,
}: {
  finish: ButtonFinish
  title: string
  description: string
  onCommand: (command: string) => void
}) {
  const command = (name: string) => () => onCommand(`${title} / ${name}`)

  return (
    <section className={styles.buttonStyleGroup} aria-label={`${title} 按钮样式`}>
      <header>
        <span>{title}</span>
        <small>{description}</small>
      </header>
      <div className={styles.buttonVariants}>
        <PanelButton finish={finish} onClick={command('DEFAULT')}>默认</PanelButton>
        <PanelButton finish={finish} tone="green" icon="check" onClick={command('CONFIRM')}>确认</PanelButton>
        <PanelButton finish={finish} tone="amber" icon="more" onClick={command('WARNING')}>注意</PanelButton>
        <PanelButton finish={finish} tone="red" icon="trash" onClick={command('DANGER')}>危险</PanelButton>
        <PanelButton finish={finish} active icon="check" onClick={command('ACTIVE')}>已选中</PanelButton>
        <PanelButton finish={finish} compact icon="reset" onClick={command('COMPACT')}>紧凑</PanelButton>
        <PanelButton finish={finish} icon="lock" disabled onClick={() => undefined}>已禁用</PanelButton>
      </div>
    </section>
  )
}

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
  const [tapeType, setTapeType] = useState<(typeof tapeTypes)[number]>('CHROME TYPE II')
  const [noiseReduction, setNoiseReduction] = useState<(typeof noiseReductionModes)[number]>('DOLBY B')
  const [monitorSource, setMonitorSource] = useState<(typeof monitorSources)[number]>('SOURCE')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerEdge, setDrawerEdge] = useState<'right' | 'bottom'>('right')
  const [autoStandby, setAutoStandby] = useState(true)
  const [loudness, setLoudness] = useState(false)
  const [speakerProtect, setSpeakerProtect] = useState(true)
  const [listeningZone, setListeningZone] = useState<(typeof listeningZones)[number]>('A')
  const [commandStatus, setCommandStatus] = useState('CONTROL READY')

  const outputLevel = power && !mute ? level : 0
  const displayCurrent = power ? bias : 0
  const rightLevel = Math.max(0, Math.min(100, outputLevel - 7))

  function openDrawer(edge: 'right' | 'bottom') {
    setDrawerEdge(edge)
    setDrawerOpen(true)
  }

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
                <TapeButton label="倒带" icon="rewind" color="blue" diagonalLight pressed={transport === 'rewind'} onClick={() => { setTransport('rewind'); setPaused(false) }} />
                <TapeButton label="停止" icon="stop" color="ivory" diagonalLight pressed={transport === 'stop'} onClick={() => { setTransport('stop'); setPaused(false) }} />
                <TapeButton label="播放" icon="play" color="green" diagonalLight pressed={transport === 'play'} onClick={() => { setTransport('play'); setPaused(false) }} />
                <TapeButton label="录音" icon="record" color="red" diagonalLight pressed={transport === 'record'} onClick={() => { setTransport('record'); setPaused(false) }} />
                <TapeButton label="快进" icon="fast-forward" color="blue" diagonalLight pressed={transport === 'fast-forward'} onClick={() => { setTransport('fast-forward'); setPaused(false) }} />
              </div>
            </div>
            <div className={styles.transportGroup}>
              <span className={styles.controlLabel}>FUNCTION</span>
              <div className={styles.tapeButtonBank}>
                <TapeButton label="PAUSE" shape="wide" color="yellow" diagonalLight pressed={paused} onClick={() => setPaused(!paused)} />
                <TapeButton label="AUTO REVERSE" shape="wide" color="blue" diagonalLight pressed={autoReverse} onClick={() => setAutoReverse(!autoReverse)} />
                <TapeButton label="EJECT" shape="wide" color="orange" diagonalLight onClick={() => { setTransport('stop'); setPaused(false) }} />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.interfaceDeck}>
          <div className={styles.uiModule}>
            <div className={styles.uiModuleHeader}>
              <div><span>MECHANICAL SELECT</span><small>DETENT MENU SYSTEM</small></div>
              <i aria-hidden="true" />
            </div>
            <div className={styles.dropdownShowcase}>
              <PanelDropdown label="TAPE TYPE" options={tapeTypes} value={tapeType} onChange={setTapeType} />
              <PanelDropdown label="NOISE REDUCTION" options={noiseReductionModes} value={noiseReduction} onChange={setNoiseReduction} />
            </div>
          </div>

          <div className={styles.uiModule}>
            <div className={styles.uiModuleHeader}>
              <div><span>EDGE DIALOG</span><small>SLIDE-OUT SERVICE PANEL</small></div>
              <i aria-hidden="true" />
            </div>
            <div className={styles.edgeLaunchers}>
              <TapeButton label="RIGHT PANEL" shape="wide" color="blue" diagonalLight onClick={() => openDrawer('right')} />
              <TapeButton label="BOTTOM SHEET" shape="wide" color="orange" diagonalLight onClick={() => openDrawer('bottom')} />
              <div className={styles.edgeHint}>
                <span>ACTIVE PROFILE</span>
                <strong>{tapeType}</strong>
                <small>{noiseReduction}</small>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.utilityDeck}>
          <div className={styles.uiModule}>
            <div className={styles.uiModuleHeader}>
              <div><span>GENERAL BUTTONS</span><small>DAILY COMMAND KEYS</small></div>
              <i aria-hidden="true" />
            </div>
            <div className={styles.commandReadout} aria-live="polite">
              <span>LAST COMMAND</span>
              <output>{commandStatus}</output>
            </div>
            <div className={styles.buttonShowcaseGrid}>
              <ButtonStyleShowcase finish="mechanical" title="MECHANICAL" description="RAISED INSTRUMENT KEY" onCommand={setCommandStatus} />
              <ButtonStyleShowcase finish="classic" title="CLASSIC 2013" description="GLOSSY DESKTOP CONTROL" onCommand={setCommandStatus} />
              <ButtonStyleShowcase finish="subtle" title="SUBTLE 2013" description="LOW-GLOSS COMPACT CONTROL" onCommand={setCommandStatus} />
            </div>
          </div>

          <div className={styles.uiModule}>
            <div className={styles.uiModuleHeader}>
              <div><span>COMMON CONTROLS</span><small>SWITCH · CHECK · SEGMENT</small></div>
              <i aria-hidden="true" />
            </div>
            <div className={styles.commonControls}>
              <PanelToggle label="自动待机" description="20 MIN NO SIGNAL" checked={autoStandby} onChange={setAutoStandby} />
              <PanelToggle label="响度补偿" description="LOW LEVEL CONTOUR" checked={loudness} onChange={setLoudness} />
              <PanelCheckbox label="扬声器保护" description="OUTPUT RELAY GUARD" checked={speakerProtect} onChange={setSpeakerProtect} />
              <SegmentedButtons label="SPEAKER ZONE" options={listeningZones} value={listeningZone} onChange={setListeningZone} />
            </div>
          </div>
        </div>

        <EdgeDrawer
          open={drawerOpen}
          edge={drawerEdge}
          title="TAPE CALIBRATION"
          description={`${drawerEdge.toUpperCase()} EDGE PANEL`}
          onClose={() => setDrawerOpen(false)}
          footer={(
            <div className={styles.drawerActions}>
              <TapeButton label="CANCEL" shape="wide" color="ivory" onClick={() => setDrawerOpen(false)} />
              <TapeButton label="APPLY" shape="wide" color="green" diagonalLight onClick={() => setDrawerOpen(false)} />
            </div>
          )}
        >
          <div className={styles.drawerReadout}>
            <span>ACTIVE PROFILE</span>
            <strong>{tapeType}</strong>
            <small>{noiseReduction} · {monitorSource}</small>
          </div>
          <div className={styles.drawerControls}>
            <PanelDropdown label="MONITOR SOURCE" options={monitorSources} value={monitorSource} onChange={setMonitorSource} />
            <InsetProgress label="CALIBRATION LEVEL" value={76} color="amber" segmented />
          </div>
          <p className={styles.drawerNote}>Settings are held in local deck memory until the APPLY key is pressed.</p>
        </EdgeDrawer>

      </section>
    </main>
  )
}
