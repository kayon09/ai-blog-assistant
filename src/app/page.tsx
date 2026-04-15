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
    title: '10 个差异化标题',
    desc: '输入一句话主题，AI 同时生成数字型、问题型、对比型标题，选最适合你受众的那一个。',
  },
  {
    label: 'II',
    title: '结构化大纲生成',
    desc: '引言 + 正文章节 + 结论自动成型，支持拖拽调整顺序，下笔前就把逻辑理清楚。',
  },
  {
    label: 'III',
    title: 'Multi-Agent 扩写',
    desc: '研究员搜集背景知识，撰稿人逐段流式输出，主编自动审校——三个 AI 协作完成一篇文章。',
  },
  {
    label: 'IV',
    title: '全文润色三档',
    desc: '轻度（保持原味）、中度（提升表达）、深度（完整重写）三档可选，精确控制改写幅度。',
  },
  {
    label: 'V',
    title: 'SEO 关键词分析',
    desc: '检测核心词密度，标出缺失的高价值词，给出可直接落地的优化建议，提升自然搜索流量。',
  },
  {
    label: 'VI',
    title: '内容合规护栏',
    desc: '本地敏感词即时过滤，命中即提示，不阻断你的创作流程，发布前多一道安全屏障。',
  },
]

const steps = [
  { title: '输入主题', desc: '一句话告诉 AI 你想写什么，越具体生成效果越好' },
  { title: '选标题', desc: '从 10 个差异化标题中挑出最吸引你目标读者的那个' },
  { title: '调整大纲', desc: '拖拽章节、增删要点，把结构改到你满意为止' },
  { title: '生成 & 导出', desc: 'AI 分章节流式输出全文，一键导出 Markdown 或纯文本' },
]

const comparisons = [
  {
    label: '写一篇 2000 字技术博客',
    before: '3–4 小时',
    after: '30–45 分钟',
    saving: '节省 75%',
  },
  {
    label: '从灵感到可发布初稿',
    before: '2–3 天',
    after: '当天完成',
    saving: '提速 5x',
  },
  {
    label: '大纲反复改动次数',
    before: '平均 4–6 次',
    after: '1–2 次',
    saving: '减少 70%',
  },
  {
    label: '写作时的卡顿次数',
    before: '每篇 8–12 次',
    after: '几乎为零',
    saving: '专注度 ↑',
  },
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
    priceOriginal: null,       // 无划线原价
    period: '永久免费',
    tagline: '先体验',
    earlyBird: false,
    desc: '完整体验 4 步写作工作流，感受 AI 的效率',
    features: [
      '每月 30,000 tokens（约 3–5 篇长文）',
      '完整 4 步写作工作流',
      '标题 / 大纲 / 扩写 / 润色',
      'Markdown 导出',
      '内容合规检查',
    ],
    notIncluded: ['历史记录无限保存', 'SEO 分析', '优先生成队列'],
    cta: '免费试用',
    ctaHref: null,
    featured: false,
  },
  {
    tier: 'Pro',
    price: '¥29',
    priceOriginal: '¥39',     // 正式上线价，展示划线
    period: '/ 月',
    tagline: '早鸟价',
    earlyBird: true,
    desc: '现在锁定，正式上线后永久享受早鸟价格',
    features: [
      '每月 500,000 tokens（约 50–80 篇）',
      'Free 全部功能',
      'SEO 关键词分析',
      '无限历史记录',
      '优先生成队列（更快响应）',
      '批量大纲生成',
    ],
    notIncluded: ['团队协作', '共享模板库'],
    cta: '锁定早鸟价格',
    ctaHref: '/upgrade',
    featured: true,
  },
  {
    tier: 'Team',
    price: '¥99',
    priceOriginal: '¥149',    // 正式上线价
    period: '/ 月',
    tagline: '早鸟价',
    earlyBird: true,
    desc: '内容工作室和小团队，统一风格 · 共享资产',
    features: [
      '5 个团队席位',
      '共享 2,000,000 tokens / 月',
      'Pro 全部功能',
      '共享模板库',
      '团队风格统一配置',
      '成员使用统计看板',
      '专属客户经理',
    ],
    notIncluded: [],
    cta: '锁定团队早鸟价',
    ctaHref: '/upgrade?plan=team',
    featured: false,
  },
]

const stats = [
  { num: '30 min', label: '平均成文时间' },
  { num: '75%', label: '时间节省' },
  { num: '4 步', label: '完整写作流程' },
]

const faqs = [
  {
    q: 'Free 版有什么限制？',
    a: '每月 30,000 tokens，约可生成 3–5 篇高质量长文。标题、大纲、扩写、润色、导出全部可用，SEO 分析和无限历史记录需要升级 Pro。',
  },
  {
    q: 'Token 是什么？怎么算的？',
    a: '可以理解为"字数消耗"。生成一篇 2000 字文章约消耗 3000–5000 tokens（包含 AI 内部思考过程）。Token 每月 1 日自动重置。',
  },
  {
    q: '早鸟价是什么意思？',
    a: '现在锁定早鸟价格（Pro ¥29/月、Team ¥99/月），正式支付上线后永久有效，不会随正式定价上涨。锁定名额有限，感兴趣直接填写意向即可，我们人工确认后联系你。',
  },
  {
    q: 'Pro 版现在怎么开通？',
    a: '目前通过人工方式处理，点击"锁定早鸟价格"填写邮箱和微信，24 小时内我们主动联系你确认付款方式。无需预付，确认后再付款。',
  },
  {
    q: '生成的内容版权归谁？',
    a: '版权归你。你输入的主题和最终导出的内容完全属于你，我们不会存储或训练你的原创文章。',
  },
  {
    q: '支持哪些导出格式？',
    a: '目前支持 Markdown 文件下载、Markdown 源码复制、纯文本复制（适合直接粘贴到微信公众号、掘金等平台）。',
  },
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
              <Link href="/demo" className="nav-link">演示</Link>
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
            <span className="section-label-inline">专为中文技术博主 · 内容创作者</span>
          </div>

          {/* Display headline — 帮谁、解决什么、比手动强在哪 */}
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
            把博客草稿变成
            <br />
            <span style={{ fontStyle: 'italic', color: 'var(--color-gold)' }}>
              可发布内容
            </span>
            {' '}只需 30 分钟
          </h1>

          {/* Sub-copy：解决什么 + 比手动强在哪 */}
          <p
            className="max-w-2xl mx-auto mb-4"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1.125rem',
              lineHeight: 1.8,
              color: 'var(--color-ink-secondary)',
              fontWeight: 300,
            }}
          >
            标题选题 → 结构化大纲 → Multi-Agent 全文生成 → SEO 优化，
            <br />
            一套 AI 工作流替代手动写作 75% 的时间消耗。
          </p>
          <p
            className="max-w-xl mx-auto mb-10 text-sm"
            style={{
              color: 'var(--color-ink-faint)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.02em',
            }}
          >
            减少 70% 的大纲返工 · 告别空白页焦虑 · 保留你的写作风格
          </p>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="btn-primary">
                  免费试用 — 无需信用卡
                </button>
              </SignUpButton>
              <Link
                href="/demo"
                className="btn-ghost"
                style={{ display: 'inline-block' }}
              >
                查看 30 秒演示 →
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="btn-primary">
                进入工作台
              </Link>
              <Link
                href="/demo"
                className="btn-ghost"
                style={{ display: 'inline-block' }}
              >
                查看演示 →
              </Link>
            </SignedIn>
          </div>

          {/* Micro-copy */}
          <p
            className="mt-5 text-xs"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-ink-faint)', letterSpacing: '0.06em' }}
          >
            Free 版每月赠送 30,000 tokens · 完整体验全部功能 · 不满意随时停用
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
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
              一套工作流，覆盖创作全程
            </h2>
            <p
              className="mt-4 max-w-lg mx-auto"
              style={{ color: 'var(--color-ink-muted)', lineHeight: 1.8, fontWeight: 300 }}
            >
              从标题选题到 SEO 优化，每个卡点都有 AI 接管，
              你只需要把控方向和最终表达。
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
              不需要学习成本，打开就能用
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

          {/* Demo CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/demo"
              className="btn-ghost"
              style={{ display: 'inline-block' }}
            >
              立即体验 30 秒交互演示 →
            </Link>
          </div>

        </div>
      </section>

      {/* ══ BEFORE / AFTER ════════════════════════════════════ */}
      <section
        style={{ backgroundColor: 'var(--color-surface)' }}
        className="py-24 md:py-32"
      >
        <div className="max-w-5xl mx-auto px-6 md:px-10">

          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <span className="section-label">效率对比</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
              手动写作 vs AI 辅助写作
            </h2>
            <p
              className="mt-4"
              style={{ color: 'var(--color-ink-muted)', fontWeight: 300 }}
            >
              数据来自内测用户反馈，实际效果因写作习惯和主题复杂度有所不同
            </p>
          </div>

          {/* Comparison table */}
          <div style={{ border: '1px solid var(--color-ivory-border)' }}>
            {/* Header */}
            <div
              className="grid grid-cols-4 text-center text-xs uppercase tracking-widest py-3"
              style={{
                fontFamily: 'var(--font-mono)',
                backgroundColor: 'var(--color-ivory)',
                borderBottom: '1px solid var(--color-ivory-border)',
                color: 'var(--color-ink-faint)',
              }}
            >
              <div className="px-4 text-left">场景</div>
              <div className="px-4" style={{ color: 'var(--color-ink-muted)' }}>手动写作</div>
              <div className="px-4" style={{ color: 'var(--color-gold)' }}>AI 辅助</div>
              <div className="px-4">节省</div>
            </div>

            {comparisons.map((row, i) => (
              <div
                key={row.label}
                className="grid grid-cols-4 items-center text-center py-5"
                style={{
                  borderTop: i > 0 ? '1px solid var(--color-ivory-border)' : 'none',
                  backgroundColor: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-ivory)',
                }}
              >
                <div
                  className="px-4 text-left text-sm"
                  style={{ color: 'var(--color-ink-secondary)', fontWeight: 300 }}
                >
                  {row.label}
                </div>
                <div
                  className="px-4 text-sm line-through"
                  style={{ color: 'var(--color-ink-faint)', fontFamily: 'var(--font-mono)' }}
                >
                  {row.before}
                </div>
                <div
                  className="px-4 text-sm font-medium"
                  style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-mono)' }}
                >
                  {row.after}
                </div>
                <div
                  className="px-4 text-xs font-medium"
                  style={{
                    color: 'var(--color-gold)',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.04em',
                  }}
                >
                  {row.saving}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══ TESTIMONIALS ═════════════════════════════════════ */}
      <section
        style={{ backgroundColor: 'var(--color-ivory)' }}
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
        style={{ backgroundColor: 'var(--color-surface)' }}
        className="py-24 md:py-32"
      >
        <div className="max-w-5xl mx-auto px-6 md:px-10">

          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <span className="section-label">价格方案</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
              先体验，满意再升级
            </h2>
            <p
              className="mt-4"
              style={{ color: 'var(--color-ink-muted)', fontWeight: 300 }}
            >
              免费版功能完整，无试用期限制。
            </p>
            {/* 早鸟提示条 */}
            <div
              className="mt-6 inline-flex items-center gap-2 px-5 py-2 text-xs"
              style={{
                fontFamily: 'var(--font-mono)',
                border: '1px solid var(--color-gold)',
                color: 'var(--color-gold)',
                letterSpacing: '0.04em',
                backgroundColor: 'rgba(184,134,11,0.04)',
              }}
            >
              <span>✦</span>
              <span>早鸟计划开放中 · 现在锁定价格，正式上线后永久有效</span>
              <span>✦</span>
            </div>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-0"
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
                    早鸟价 · 最受欢迎
                  </div>
                )}
                {!plan.featured && plan.earlyBird && (
                  <div
                    className="absolute -top-3 left-6 px-3 py-0.5 text-[10px] tracking-widest uppercase"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      border: '1px solid var(--color-gold)',
                      color: 'var(--color-gold)',
                      backgroundColor: 'var(--color-surface)',
                    }}
                  >
                    早鸟价
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

                {/* Price：当前价 + 划线原价 */}
                <div className="flex items-baseline gap-2 mb-1">
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
                  {plan.priceOriginal && (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8125rem',
                        color: plan.featured ? 'rgba(250,250,248,0.25)' : 'var(--color-ink-faint)',
                        textDecoration: 'line-through',
                      }}
                    >
                      {plan.priceOriginal}
                    </span>
                  )}
                </div>

                <p
                  className="mb-6 text-sm"
                  style={{ color: plan.featured ? 'rgba(250,250,248,0.6)' : 'var(--color-ink-muted)', fontWeight: 300 }}
                >
                  {plan.desc}
                </p>

                {/* Included features */}
                <ul className="space-y-2.5 mb-4">
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

                {/* Not included */}
                {plan.notIncluded.length > 0 && (
                  <ul className="space-y-2 mb-8">
                    {plan.notIncluded.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-sm">
                        <span
                          style={{
                            color: plan.featured ? 'rgba(250,250,248,0.2)' : 'var(--color-ink-faint)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                            marginTop: '0.1em',
                            flexShrink: 0,
                          }}
                        >
                          —
                        </span>
                        <span style={{ color: plan.featured ? 'rgba(250,250,248,0.3)' : 'var(--color-ink-faint)', fontWeight: 300, textDecoration: 'line-through' }}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {plan.notIncluded.length === 0 && <div className="mb-8" />}

                {/* CTA */}
                {plan.ctaHref ? (
                  <a
                    href={plan.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 text-center text-[11px] tracking-widest uppercase transition-all"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      backgroundColor: plan.featured ? 'var(--color-gold)' : 'transparent',
                      color: plan.featured ? 'white' : 'var(--color-ink)',
                      border: plan.featured ? '1px solid var(--color-gold)' : '1px solid var(--color-ivory-border)',
                      textDecoration: 'none',
                    }}
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <>
                    <SignedOut>
                      <SignUpButton mode="modal">
                        <button
                          className="w-full py-2.5 text-[11px] tracking-widest uppercase transition-all"
                          style={{
                            fontFamily: 'var(--font-mono)',
                            backgroundColor: 'transparent',
                            color: 'var(--color-ink)',
                            border: '1px solid var(--color-ivory-border)',
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
                          backgroundColor: 'transparent',
                          color: 'var(--color-ink)',
                          border: '1px solid var(--color-ivory-border)',
                          textDecoration: 'none',
                        }}
                      >
                        {plan.cta}
                      </Link>
                    </SignedIn>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Reassurance copy */}
          <p
            className="mt-6 text-center text-xs"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-ink-faint)', letterSpacing: '0.06em' }}
          >
            无需信用卡 · 随时停用 · 数据完整导出 · 不训练你的原创内容
          </p>

        </div>
      </section>

      {/* ══ FAQ ═══════════════════════════════════════════════ */}
      <section
        style={{ backgroundColor: 'var(--color-ivory)' }}
        className="py-24 md:py-32"
      >
        <div className="max-w-3xl mx-auto px-6 md:px-10">

          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <span className="section-label">常见问题</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
              你可能想知道的
            </h2>
          </div>

          <div style={{ border: '1px solid var(--color-ivory-border)' }}>
            {faqs.map((faq, i) => (
              <div
                key={faq.q}
                className="px-8 py-7"
                style={{
                  borderTop: i > 0 ? '1px solid var(--color-ivory-border)' : 'none',
                }}
              >
                <p
                  className="mb-3 font-medium"
                  style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-sans)', fontSize: '0.9375rem' }}
                >
                  {faq.q}
                </p>
                <p
                  style={{
                    color: 'var(--color-ink-muted)',
                    fontSize: '0.875rem',
                    lineHeight: 1.75,
                    fontWeight: 300,
                  }}
                >
                  {faq.a}
                </p>
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
            下一篇博客，
            <span style={{ fontStyle: 'italic', color: 'var(--color-gold)' }}>今天就写完</span>
          </h2>

          <p
            className="mb-4"
            style={{ color: 'rgba(250,250,248,0.55)', fontSize: '1.125rem', fontWeight: 300 }}
          >
            免费开始，30 分钟从草稿到可发布内容。
          </p>
          <p
            className="mb-10 text-sm"
            style={{ color: 'rgba(250,250,248,0.3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}
          >
            已有博主用这套工作流每周稳定输出 3 篇——你也可以
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
              <Link
                href="/demo"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(250,250,248,0.45)',
                  textDecoration: 'none',
                }}
              >
                先看演示 →
              </Link>
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
          </div>

          <p
            className="mt-6 text-xs"
            style={{ fontFamily: 'var(--font-mono)', color: 'rgba(250,250,248,0.3)', letterSpacing: '0.06em' }}
          >
            无需信用卡 · Free 版 30,000 tokens / 月 · 随时取消
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
                { label: '演示', href: '/demo' },
                { label: '隐私政策', href: '#' },
                { label: '服务条款', href: '#' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-ink-faint)', textDecoration: 'none' }}
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
