'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  AnalogMeter,
  DrumCounter,
  GuardedToggle,
  LinearFader,
  RotaryKnob,
  ScopeDisplay,
  SegmentedSwitch,
} from '@/lib/components/MachineControls'
import styles from './page.module.scss'

const modes = ['手动', '自动', '校准'] as const

function Card({
  code,
  title,
  note,
  className,
  children,
}: {
  code: string
  title: string
  note: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section className={`${styles.card} ${className ?? ''}`}>
      <span className={styles.screwA} aria-hidden="true" />
      <span className={styles.screwB} aria-hidden="true" />
      <header className={styles.cardHeader}>
        <span>{code}</span>
        <div><h2>{title}</h2><p>{note}</p></div>
      </header>
      <div className={styles.cardBody}>{children}</div>
    </section>
  )
}

export default function ComponentGallery() {
  const [feed, setFeed] = useState(64)
  const [trim, setTrim] = useState(28)
  const [coolant, setCoolant] = useState(true)
  const [scopeActive, setScopeActive] = useState(true)
  const [mode, setMode] = useState<(typeof modes)[number]>('自动')

  return (
    <main className={styles.page}>
      <nav className={styles.nav} aria-label="主导航">
        <Link href="/" className={styles.backLink}><span aria-hidden="true">←</span> 时钟台</Link>
        <span className={styles.navMark}>ZSKT · CONTROL LIBRARY</span>
      </nav>

      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>CONTROL SURFACE / REV. 02</p>
          <h1>工作台组件</h1>
          <p className={styles.intro}>从机床的秩序、CRT 的微光与早期移动界面的触感中取样。材质只负责提示层级，不抢走信息本身。</p>
        </div>
        <div className={styles.heroStatus}>
          <span><i /> 系统在线</span>
          <dl><div><dt>组件</dt><dd>07</dd></div><div><dt>基调</dt><dd>轻拟物</dd></div></dl>
        </div>
      </header>

      <div className={styles.gallery}>
        <Card code="01" title="主轴旋钮" note="连续参数 · 可拖动" className={styles.knobCard}>
          <div className={styles.knobPair}>
            <RotaryKnob label="进给率" value={feed} unit="%" onChange={setFeed} />
            <RotaryKnob label="微调" value={trim} min={-50} max={50} unit="" size="compact" onChange={setTrim} />
          </div>
        </Card>

        <Card code="02" title="模拟表头" note="瞬时状态 · 机械指针" className={styles.meterCard}>
          <AnalogMeter label="主轴负载" value={feed} unit="LOAD %" />
        </Card>

        <Card code="03" title="设备拨杆" note="二态控制 · 明确反馈" className={styles.toggleCard}>
          <div className={styles.toggleStack}>
            <GuardedToggle label="冷却循环" checked={coolant} onChange={setCoolant} />
            <GuardedToggle label="波形采样" checked={scopeActive} onChange={setScopeActive} tone="amber" />
          </div>
        </Card>

        <Card code="04" title="精密推子" note="线性输入 · 刻度辅助" className={styles.faderCard}>
          <LinearFader label="输出限制" value={feed} unit="%" onChange={setFeed} />
          <SegmentedSwitch label="运行模式" options={modes} value={mode} onChange={setMode} />
        </Card>

        <Card code="05" title="机械计数器" note="累计读数 · 低频更新" className={styles.counterCard}>
          <DrumCounter label="累计行程" value={12540 + feed * 7} unit="mm" />
        </Card>

        <Card code="06" title="示波监视窗" note="连续信号 · 克制扫描" className={styles.scopeCard}>
          <ScopeDisplay label="同步误差" active={scopeActive} />
        </Card>
      </div>

      <footer className={styles.footer}>
        <span>低饱和金属 · 暖灰面板 · 单色信号</span>
        <span>IPAD CLOCK / 2026</span>
      </footer>
    </main>
  )
}
