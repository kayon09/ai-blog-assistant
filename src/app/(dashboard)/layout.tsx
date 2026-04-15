import type { ReactNode } from 'react'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

// 导航链接字体样式（color 由 .nav-link-dashboard CSS 类控制，以支持 hover）
const navLinkStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.6875rem',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-ivory)' }}>

      {/* ── Dashboard Header ── */}
      <header
        className="sticky top-0 z-40"
        style={{
          backgroundColor: 'rgba(250, 250, 248, 0.92)',
          borderBottom: '1px solid var(--color-ivory-border)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div
          className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between"
          style={{ height: '3.75rem' }}
        >
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 700,
                fontSize: '1.125rem',
                color: 'var(--color-ink)',
                letterSpacing: '-0.01em',
              }}
            >
              AI写作助手
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: 'var(--color-gold)',
                opacity: 0.7,
              }}
            >
              工作台
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-5">
              <Link
                href="/dashboard/articles"
                className="nav-link-dashboard"
                style={navLinkStyle}
              >
                我的文章
              </Link>
              <Link
                href="/dashboard/editor"
                className="nav-link-dashboard"
                style={navLinkStyle}
              >
                新建文章
              </Link>
              <Link
                href="/"
                className="nav-link-dashboard"
                style={navLinkStyle}
              >
                返回首页
              </Link>
            </nav>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8',
                },
              }}
            />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 md:px-10 py-10 md:py-14">
        {children}
      </main>

    </div>
  )
}
