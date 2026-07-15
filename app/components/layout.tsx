import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '工作台组件 · iPad Clock',
  description: '一组受机床、CRT 与早期移动界面启发的轻拟物控件。',
}

export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
  return children
}
