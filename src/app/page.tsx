import Link from 'next/link'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs'

// ─── Data ────────────────────────────────────────────────────
const features = [
  {
    label: 'I',
    title: '智能选题',
    desc: '输入一个关键词，瞬间生成 10 个差异化标题，覆盖不同写作角度和受众层次。',
  },
  {
    label: 'II',
    title: '结构化大纲',
    desc: '自动生成引言 + 章节 + 结论，支持拖拽调整顺序，逻辑结构一目了然。',
  },
  {
    label: 'III',
    title: '流式全文生成',
    desc: '逐字实时输出，像看着文章从笔下流淌而出，无需漫长等待。',
  },
  {
    label: 'IV',
    title: '风格保留',
    desc: '学习你的写作习惯，生成内容保留你独特的个人腔调和表达方式。',
  },
  {
    label: 'V',
    title: 'SEO 优化建议',
    desc: '自动检测关键词密度、标题层级，给出可执行的 SEO 提升建议。',
  },
  {
    label: 'VI',
    title: '一键改写润色',
    desc: '选中任意段落，AI 即时重写、扩写或压缩，精确控制内容颗粒度。',
  },
]

const steps = [
  { title: '输入主题', desc: '告诉 AI 你想写什么，一句话即可' },
  { title: '选择标题', desc: '从 10 个 AI 生成的标题中选出最适合的' },
  { title: '确认大纲', desc: '调整章节结构，确保内容逻辑清晰' },
  { title: '生成全文', desc: '点击生成，几分钟内得到完整博客初稿' },
]

const testimonials = [
  {
    name: '张小雨',
    role: '独立博主 · 科技领域',
    content: '用了 AI写作助手之后，我的更新频率从每月 2 篇提升到了每周 3 篇，读者涨了 3 倍。这不是玄学，是时间结构的改变。',
  },
  {
    name: '李明远',
    role: '内容营销经理',
    content: '以前写一篇产品文章要半天，现在 30 分钟搞定，而且质量更好。团队效率翻倍，再也不用熬夜赶稿。',
  },
  {
    name: '陈晓芸',
    role: '自媒体运营者',
    content: 'AI 真的学会了我的语气。生成的内容几乎不用大改，直接发出去就行——这才是真正的写作伴侣。',
  },
]

const plans = [
  {
    tier: 'Free',
    price: '¥0',
    period: '永久免费',
    desc: '适合体验与轻度使用',
    features: ['每月 5 篇文章', '30,000 tokens / 月', '基础标题生成', '简单大纲', '社区支持'],
    cta: '免费开始',
    featured: false,
  },
  {
    tier: 'Pro',
    price: '¥39',
    period: '/ 月',
    desc: '适合活跃创作者',
    features: ['无限篇文章', '500,000 tokens / 月', '高级标题优化', '智能大纲 + 拖拽调整', 'SEO 优化建议', '风格学习引擎', '优先客服'],
    cta: '升级 Pro',
    featured: true,
  },
  {
    tier: 'Team',
    price: '¥99',
    period: '/ 月',
    desc: '适合内容团队',
    features: ['Pro 全部功能', '5 个团队成员', '共享 2M tokens / 月', '团队模板库', '内容审核工作流', '专属客户经理'],
    cta: '联系我们',
    featured: false,
  },
]

const stats = [
  { num: '10,000+', label: '活跃博主' },
  { num: '30 min', label: '平均成文时间' },
  { num: '98%', label: '用户满意度' },
]

// ─── Page ────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-ivory)' }}>

      {/* ══ SITE HEADER ══════════════════════════════════════ */}
      <header className="site-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-16">

            {/* Logotype */}
            <Link href="/" className="flex items-center gap-3 group">
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.125rem', color: 'var(--color-ink)', letterSpacing: '-0.01em' }}>
                AI写作助手
              </span>
              <span className="rule-divider-gold opacity-60 group-hover:opacity-100 transition-opacity" />
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="nav-link">功能</a>
              <a href="#how-it-works" className="nav-link">流程</a>
              <a href="#pricing" className="nav-link">定价</a>
            </nav>

            {/* Auth */}
            <div className="flex items-center gap-3">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="btn-ghost" style={{ padding: '0.5rem 1.25rem', fontSize: '0.6875rem' }}>
                    登录
                  </button>
                </SignInButton>
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
                  工作台
                </Link>
                <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
              </SignedIn>
            </div>

          </div>
        </div>
      </header>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section
        style={{ backgroundColor: 'var(--color-ivory)' }}
        className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28"
      >
        {/* Subtle texture lines */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, var(--color-ink) 0px, var(--color-ink) 1px, transparent 1px, transparent 48px)',
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 md:px-10 text-center">

          {/* Section label */}
          <div className="flex justify-center mb-8">
            <span className="section-label-inline">专为中文博主打造</span>
          </div>

          {/* Display headline */}
          <h1
            className="mb-6"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--text-display)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              color: 'var(--color-ink)',
            }}
          >
            从灵感到发布，
            <br />
            <span
              style={{
                fontStyle: 'italic',
                color: 'var(--color-gold)',
              }}
            >
              30 分钟
            </span>
            {' '}完成一篇博客
          </h1>

          {/* Sub-copy */}
          <p
            className="max-w-2xl mx-auto mb-10"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1.125rem',
              lineHeight: 1.8,
              color: 'var(--color-ink-secondary)',
              fontWeight: 300,
            }}
          >
            AI 帮你生成标题、大纲、全文，保留你的个人风格。
            <br />
            告别空白页焦虑，专注创作本身。
          </p>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="btn-primary">
                  免费试用 — 无需信用卡
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="btn-ghost">
                  已有账号，登录
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="btn-primary">
                进入工作台
              </Link>
            </SignedIn>
          </div>

          {/* Micro-copy */}
          <p
            className="mt-5 text-xs"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-ink-faint)', letterSpacing: '0.06em' }}
          >
            Free 版每月赠送 30,000 tokens · 约可生成 3–5 篇高质量长文
          </p>

          {/* Stats row */}
          <div className="mt-16 pt-10 border-t flex flex-col sm:flex-row items-center justify-center gap-0">
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-center">
                {i > 0 && (
                  <div
                    className="hidden sm:block w-px h-10 mx-10"
                    style={{ backgroundColor: 'var(--color-ivory-border)' }}
                  />
                )}
                <div className="text-center">
                  <div className="stat-number">{s.num}</div>
                  <div
                    className="mt-1 text-xs uppercase tracking-widest"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-ink-muted)' }}
                  >
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══ FEATURES ══════════════════════════════════════════ */}
      <section
        id="features"
        style={{ backgroundColor: 'var(--color-surface)' }}
        className="py-24 md:py-32"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10">

          {/* Section header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <span className="section-label">核心功能</span>
            </div>
            <h2
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}
            >
              一个工具，覆盖创作全流程
            </h2>
            <p
              className="mt-4 max-w-lg mx-auto"
              style={{ color: 'var(--color-ink-muted)', lineHeight: 1.8, fontWeight: 300 }}
            >
              从选题到发布，每个环节都有 AI 加持，让创作变得轻松愉快。
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px"
            style={{ backgroundColor: 'var(--color-ivory-border)' }}
          >
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div
                  className="mb-4 text-xs uppercase tracking-widest"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-gold)' }}
                >
                  {f.label}
                </div>
                <h3
                  className="mb-3"
                  style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-ink)' }}
                >
                  {f.title}
                </h3>
                <p style={{ color: 'var(--color-ink-secondary)', lineHeight: 1.75, fontSize: '0.9375rem', fontWeight: 300 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══ HOW IT WORKS ══════════════════════════════════════ */}
      <section
        id="how-it-works"
        style={{ backgroundColor: 'var(--color-ivory)' }}
        className="py-24 md:py-32"
      >
        <div className="max-w-5xl mx-auto px-6 md:px-10">

          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <span className="section-label">使用流程</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
              四步，写完一篇博客
            </h2>
            <p
              className="mt-4"
              style={{ color: 'var(--color-ink-muted)', fontWeight: 300 }}
            >
              简单到不需要任何学习成本
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="relative px-6 py-8 text-center"
                style={{
                  borderLeft: i > 0 ? '1px solid var(--color-ivory-border)' : 'none',
                }}
              >
                {/* Large italic ordinal */}
                <div className="step-number mb-2">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3
                  className="mb-2"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.125rem',
                    color: 'var(--color-ink)',
                    fontWeight: 600,
                  }}
                >
                  {s.title}
                </h3>
                <p style={{ color: 'var(--color-ink-muted)', fontSize: '0.875rem', lineHeight: 1.7, fontWeight: 300 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══ TESTIMONIALS ═════════════════════════════════════ */}
      <section
        style={{ backgroundColor: 'var(--color-surface)' }}
        className="py-24 md:py-32"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10">

          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <span className="section-label">用户评价</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
              博主们都在说什么
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="testimonial-card">
                {/* Opening quote mark */}
                <div
                  className="mb-4 leading-none"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '3rem',
                    color: 'var(--color-gold)',
                    opacity: 0.3,
                    lineHeight: 0.8,
                  }}
                >
                  &ldquo;
                </div>
                <p
                  className="mb-6"
                  style={{
                    color: 'var(--color-ink-secondary)',
                    lineHeight: 1.8,
                    fontSize: '0.9375rem',
                    fontStyle: 'italic',
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 400,
                  }}
                >
                  {t.content}
                </p>
                <div className="rule-divider mb-4" />
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 600,
                      color: 'var(--color-ink)',
                      fontSize: '0.9375rem',
                    }}
                  >
                    {t.name}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--color-ink-faint)',
                      marginTop: '0.25rem',
                    }}
                  >
                    {t.role}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══ PRICING ══════════════════════════════════════════ */}
      <section
        id="pricing"
        style={{ backgroundColor: 'var(--color-ivory)' }}
        className="py-24 md:py-32"
      >
        <div className="max-w-5xl mx-auto px-6 md:px-10">

          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <span className="section-label">价格方案</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
              简单透明的定价
            </h2>
            <p
              className="mt-4"
              style={{ color: 'var(--color-ink-muted)', fontWeight: 300 }}
            >
              免费体验，满意再升级。无隐藏费用。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0"
            style={{ border: '1px solid var(--color-ivory-border)' }}
          >
            {plans.map((plan, i) => (
              <div
                key={plan.tier}
                className="pricing-card relative"
                style={{
                  borderLeft: i > 0 ? '1px solid var(--color-ivory-border)' : 'none',
                  backgroundColor: plan.featured ? 'var(--color-ink)' : 'var(--color-surface)',
                  border: plan.featured ? '1px solid var(--color-ink)' : undefined,
                  color: plan.featured ? 'var(--color-ivory)' : 'var(--color-ink)',
                  marginTop: plan.featured ? '-1px' : undefined,
                  marginBottom: plan.featured ? '-1px' : undefined,
                }}
              >
                {plan.featured && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 text-[10px] tracking-widest uppercase"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      backgroundColor: 'var(--color-gold)',
                      color: 'white',
                    }}
                  >
                    最受欢迎
                  </div>
                )}

                {/* Tier label */}
                <div
                  className="mb-1 text-[11px] uppercase tracking-widest"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: plan.featured ? 'rgba(250,250,248,0.5)' : 'var(--color-ink-faint)',
                  }}
                >
                  {plan.tier}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-1">
                  <span
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '2.25rem',
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      color: plan.featured ? 'var(--color-ivory)' : 'var(--color-ink)',
                    }}
                  >
                    {plan.price}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: plan.featured ? 'rgba(250,250,248,0.45)' : 'var(--color-ink-faint)',
                    }}
                  >
                    {plan.period}
                  </span>
                </div>

                <p
                  className="mb-6 text-sm"
                  style={{ color: plan.featured ? 'rgba(250,250,248,0.6)' : 'var(--color-ink-muted)', fontWeight: 300 }}
                >
                  {plan.desc}
                </p>

                {/* Feature list */}
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm">
                      <span
                        style={{
                          color: plan.featured ? 'var(--color-gold-muted)' : 'var(--color-gold)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          marginTop: '0.1em',
                          flexShrink: 0,
                        }}
                      >
                        ✦
                      </span>
                      <span style={{ color: plan.featured ? 'rgba(250,250,248,0.8)' : 'var(--color-ink-secondary)', fontWeight: 300 }}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <SignedOut>
                  <SignUpButton mode="modal">
                    <button
                      className="w-full py-2.5 text-[11px] tracking-widest uppercase transition-all"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        backgroundColor: plan.featured ? 'var(--color-gold)' : 'transparent',
                        color: plan.featured ? 'white' : 'var(--color-ink)',
                        border: plan.featured ? '1px solid var(--color-gold)' : '1px solid var(--color-ivory-border)',
                        cursor: 'pointer',
                      }}
                    >
                      {plan.cta}
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <Link
                    href="/dashboard"
                    className="block w-full py-2.5 text-center text-[11px] tracking-widest uppercase transition-all"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      backgroundColor: plan.featured ? 'var(--color-gold)' : 'transparent',
                      color: plan.featured ? 'white' : 'var(--color-ink)',
                      border: plan.featured ? '1px solid var(--color-gold)' : '1px solid var(--color-ivory-border)',
                    }}
                  >
                    {plan.cta}
                  </Link>
                </SignedIn>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══ FINAL CTA ════════════════════════════════════════ */}
      <section
        style={{ backgroundColor: 'var(--color-ink)' }}
        className="py-24 md:py-32"
      >
        <div className="max-w-3xl mx-auto px-6 md:px-10 text-center">

          <div className="flex justify-center mb-8">
            <span
              className="text-[11px] uppercase tracking-widest"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-gold-muted)' }}
            >
              开始创作
            </span>
          </div>

          <h2
            className="mb-6"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              fontWeight: 700,
              color: 'var(--color-ivory)',
              lineHeight: 1.2,
            }}
          >
            准备好写出<span style={{ fontStyle: 'italic', color: 'var(--color-gold)' }}>更好的内容</span>了吗？
          </h2>

          <p
            className="mb-10"
            style={{ color: 'rgba(250,250,248,0.55)', fontSize: '1.125rem', fontWeight: 300 }}
          >
            加入 10,000+ 博主，今天就开始你的创作之旅。
          </p>

          <SignedOut>
            <SignUpButton mode="modal">
              <button
                className="px-10 py-3 text-[11px] tracking-widest uppercase transition-all hover:opacity-90"
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
              className="inline-block px-10 py-3 text-[11px] tracking-widest uppercase transition-all hover:opacity-90"
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

          <p
            className="mt-6 text-xs"
            style={{ fontFamily: 'var(--font-mono)', color: 'rgba(250,250,248,0.3)', letterSpacing: '0.06em' }}
          >
            无需信用卡 · 5 分钟完成注册 · 随时取消
          </p>
        </div>
      </section>

      {/* ══ SITE FOOTER ══════════════════════════════════════ */}
      <footer style={{ backgroundColor: 'var(--color-ink)', color: 'var(--color-ivory-dark)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-14">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.125rem', color: 'var(--color-ivory)', marginBottom: '0.25rem' }}>
                AI写作助手
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--color-gold-muted)' }}>
                专注中文内容创作
              </p>
            </div>
            <nav className="flex flex-wrap gap-6">
              {[
                { label: '功能', href: '#features' },
                { label: '定价', href: '#pricing' },
                { label: '隐私政策', href: '#' },
                { label: '服务条款', href: '#' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-ink-faint)' }}
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10">
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-ink-faint)' }}>
              © 2026 AI写作助手. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
