import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI 写作助手 · 交互演示',
  description: 'AI 驱动的中文博客写作助手交互演示',
}

export default function DemoPage() {
  return (
    <iframe
      src="/demo.html"
      style={{
        width: '100%',
        height: '100vh',
        border: 'none',
      }}
    />
  )
}
