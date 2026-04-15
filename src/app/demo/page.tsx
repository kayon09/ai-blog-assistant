// ============================================================
// 演示页：嵌入 public/demo.html 的 iframe 包装页
// src/app/demo/page.tsx
// ============================================================
import Link from 'next/link'
import { SignedIn, SignedOut, SignUpButton, UserButton } from '@clerk/nextjs'

export const metadata = {
  title: 'AI写作助手 · 交互演示',
  description: '30 秒体验完整的 AI 写作工作流：标题选题 → 大纲生成 → Multi-Agent 扩写 → SEO 分析',
}

export default function DemoPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-ivory)', display: 'flex', flexDirection: 'column' }}>

      {/* ── 顶部栏 ── */}
      <header className="site-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-16">

            <Link href="/" className="flex items-center gap-3 group">
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.125rem', color: 'var(--color-ink)', letterSpacing: '-0.01em' }}>
                AI写作助手
              </span>
              <span
                className="text-xs uppercase tracking-widest ml-1"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-gold)', opacity: 0.7 }}
              >
                · 演示
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/#pricing"
                className="text-xs uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-ink-muted)', textDecoration: 'none' }}
              >
                查看定价
              </Link>
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.6875rem' }}>
                    免费开始
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="btn-primary"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.6875rem' }}
                >
                  进入工作台
                </Link>
                <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
              </SignedIn>
            </div>

          </div>
        </div>
      </header>

      {/* ── 演示说明条 ── */}
      <div
        className="text-center py-3 text-xs uppercase tracking-widest"
        style={{
          fontFamily: 'var(--font-mono)',
          backgroundColor: 'var(--color-ivory-dark)',
          borderBottom: '1px solid var(--color-ivory-border)',
          color: 'var(--color-ink-muted)',
        }}
      >
        以下为可交互演示 · 所有数据均为示例内容 · 点击体验完整 4 步写作流程
      </div>

      {/* ── iframe 演示 ── */}
      <div style={{ flex: 1, position: 'relative' }}>
        <iframe
          src="/demo.html"
          title="AI写作助手交互演示"
          style={{
            width: '100%',
            height: 'calc(100vh - 3.75rem - 2.5rem)',
            border: 'none',
            display: 'block',
          }}
          allow="clipboard-write"
        />
      </div>

      {/* ── 底部 CTA ── */}
      <div
        className="py-6 text-center"
        style={{
          backgroundColor: 'var(--color-ink)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <p
          className="mb-4 text-sm"
          style={{ color: 'rgba(250,250,248,0.55)', fontWeight: 300 }}
        >
          喜欢这个工作流？免费注册即可开始真实创作
        </p>
        <div className="flex items-center justify-center gap-4">
          <SignedOut>
            <SignUpButton mode="modal">
              <button
                className="px-8 py-2.5 text-[11px] tracking-widest uppercase"
                style={{
                  fontFamily: 'var(--font-mono)',
                  backgroundColor: 'var(--color-gold)',
                  color: 'white',
                  border: '1px solid var(--color-gold)',
                  cursor: 'pointer',
                }}
              >
                免费开始创作
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="inline-block px-8 py-2.5 text-[11px] tracking-widest uppercase"
              style={{
                fontFamily: 'var(--font-mono)',
                backgroundColor: 'var(--color-gold)',
                color: 'white',
                border: '1px solid var(--color-gold)',
              }}
            >
              进入工作台
            </Link>
          </SignedIn>
          <Link
            href="/#pricing"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(250,250,248,0.35)',
              textDecoration: 'none',
            }}
          >
            查看定价 →
          </Link>
        </div>
      </div>

    </div>
  )
}
