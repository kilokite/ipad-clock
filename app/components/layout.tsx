import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '控制组件 · ZS Instruments',
  description: '延续时钟仪表台设计语言的轻拟物控制组件展示。',
}

export default function ComponentsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
