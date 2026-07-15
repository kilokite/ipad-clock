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

const inputSources = ['线路', '蓝牙', 'USB'] as const
const responseModes = ['柔和', '标准', '快速'] as const

export default function ComponentsPage() {
  const [current, setCurrent] = useState(3.6)
  const [run, setRun] = useState(true)
  const [protect, setProtect] = useState(false)
  const [source, setSource] = useState<(typeof inputSources)[number]>('线路')
  const [response, setResponse] = useState<(typeof responseModes)[number]>('标准')
  const [progress, setProgress] = useState(68)

  const displayCurrent = run ? current : 0

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <span className={styles.headerIndex}>COMPONENTS / 01</span>
            <strong>ZS 控制组件</strong>
          </div>
          <Link href="/">← 返回时钟</Link>
        </header>

        <div className={styles.intro}>
          <h1>器件与界面</h1>
          <p>先还原真实器件的结构与材质，再把相同的触感用于普通界面组件。</p>
        </div>

        <section className={styles.group} aria-labelledby="reproduction-title">
          <div className={styles.groupTitle}>
            <span>01</span>
            <div>
              <h2 id="reproduction-title">器件还原</h2>
              <p>COMPONENT REPRODUCTION</p>
            </div>
          </div>

          <div className={styles.reproductionGrid}>
            <article className={`${styles.panel} ${styles.meterPanel}`}>
              <div className={styles.panelHeading}>
                <div><h3>直流电流表</h3><span>DC AMMETER · 0—10A</span></div>
                <i className={run ? styles.live : ''} />
              </div>
              <div className={styles.meterStage}>
                <Ammeter value={displayCurrent} />
              </div>
              <label className={styles.testControl}>
                <span>测试输入 <output>{displayCurrent.toFixed(1)} A</output></span>
                <input type="range" min="0" max="10" step="0.1" value={current} onChange={(event) => setCurrent(Number(event.target.value))} />
              </label>
            </article>

            <article className={`${styles.panel} ${styles.displayPanel}`}>
              <div className={styles.panelHeading}>
                <div><h3>液晶显示</h3><span>NUMERIC / CHARACTER LCD</span></div>
              </div>
              <div className={styles.displayStack}>
                <div className={styles.displayItem}>
                  <span className={styles.itemLabel}>数字显示模块</span>
                  <NumericLCD value={displayCurrent.toFixed(1).padStart(4, '0')} unit="A" />
                </div>
                <div className={styles.displayItem}>
                  <span className={styles.itemLabel}>LCD 1602A · 16 × 2</span>
                  <div className={styles.lcdVariants}>
                    <div><small>背光开启</small><LCD1602A lines={[run ? 'SYSTEM  ONLINE' : 'SYSTEM STANDBY', `CURRENT ${displayCurrent.toFixed(1)} A`]} /></div>
                    <div><small>背光关闭</small><LCD1602A backlight={false} lines={['DISPLAY  READY', 'BACKLIGHT OFF']} /></div>
                  </div>
                </div>
              </div>
            </article>

            <article className={`${styles.panel} ${styles.buttonPanel}`}>
              <div className={styles.panelHeading}>
                <div><h3>电气按钮</h3><span>ILLUMINATED PUSH BUTTON</span></div>
              </div>
              <div className={styles.buttonBank}>
                <ElectricalButton label="运行" active={run} color="green" onClick={() => setRun(!run)} />
                <ElectricalButton label="保护" active={protect} color="amber" onClick={() => setProtect(!protect)} />
                <ElectricalButton label="停止" active={!run} color="red" onClick={() => setRun(false)} />
              </div>
              <p className={styles.buttonHint}>垂直俯视结构，使用磨砂材料与实体按压行程。</p>
            </article>
          </div>
        </section>

        <section className={styles.group} aria-labelledby="interface-title">
          <div className={styles.groupTitle}>
            <span>02</span>
            <div>
              <h2 id="interface-title">拟物界面</h2>
              <p>SKEUOMORPHIC UI CONTROLS</p>
            </div>
          </div>

          <div className={`${styles.panel} ${styles.interfacePanel}`}>
            <div className={styles.interfaceColumn}>
              <InsetProgress label="资源载入" value={progress} />
              <InsetProgress label="音频缓冲" value={Math.min(100, progress + 17)} color="amber" segmented />
              <label className={styles.progressInput}>
                <span>调整进度</span>
                <input type="range" min="0" max="100" value={progress} onChange={(event) => setProgress(Number(event.target.value))} />
              </label>
            </div>
            <div className={styles.interfaceColumn}>
              <SteppedSelector label="输入来源" options={inputSources} value={source} onChange={setSource} />
              <SteppedSelector label="响应速度" options={responseModes} value={response} onChange={setResponse} />
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <span>PHYSICAL COMPONENT SET</span>
          <span>LIGHT SKEUOMORPHISM / DARK PANEL</span>
        </footer>
      </div>
    </main>
  )
}
