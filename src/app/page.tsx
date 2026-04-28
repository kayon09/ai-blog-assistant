'use client'

import Link from 'next/link'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs'

// ─── Design tokens (local, overrides global) ──────────────
const C = {
  blue: '#3B5BDB',
  blueDark: '#2F4AC5',
  blueLight: '#EEF2FF',
  blueMid: '#4C6EF5',
  text: '#1A1D23',
  textSub: '#4B5563',
  textMuted: '#9CA3AF',
  border: '#E5E8F0',
  surface: '#FFFFFF',
  bg: '#F0F2FA',
}

// ─── Data ─────────────────────────────────────────────────
const navLinks = [
  { label: '首页', href: '/' },
  { label: '功能', href: '#features' },
  { label: '模板', href: '#templates' },
  { label: '定价', href: '#pricing' },
  { label: '博客', href: '/demo' },
]

const heroBadges = [
  { icon: '⚡', title: 'AI 智能生成', sub: '快速生成高质量内容' },
  { icon: '✦', title: '多场景模板', sub: '覆盖 100+ 写作场景' },
  { icon: '🔒', title: '安全可靠', sub: '隐私保护，放心使用' },
]

const templates = [
  { icon: '📝', color: '#3B5BDB', bg: '#EEF2FF', title: '文章写作', sub: '生成各类文章和博客' },
  { icon: '📢', color: '#0CA678', bg: '#E6FCF5', title: '营销文案', sub: '产品推广/广告文案' },
  { icon: '✉️', color: '#7950F2', bg: '#F3F0FF', title: '邮件写作', sub: '专业邮件/服务沟通' },
  { icon: '📓', color: '#F03E3E', bg: '#FFF5F5', title: '学习笔记', sub: '整理知识/学习笔记' },
  { icon: '📊', color: '#1971C2', bg: '#E7F5FF', title: '工作汇报', sub: '高效汇报/总结' },
  { icon: '✨', color: '#E67700', bg: '#FFF9DB', title: '创意故事', sub: '小说/故事创作' },
]

const testimonials = [
  {
    name: '李同学',
    role: '内容创作者',
    avatar: '👩',
    content: 'AI写作助手让我的写作效率提升了 3 倍，内容质量也大大提高！',
  },
  {
    name: '张先生',
    role: '市场营销',
    avatar: '👨',
    content: '模板非常丰富，生成的内容很自然，几乎不需要再修改。',
  },
  {
    name: '王同学',
    role: '大学生',
    avatar: '🧑',
    content: '作为学生，AI写作助手帮我快速整理资料，写论文轻松多了！',
  },
]

const statsRow = [
  { icon: '👥', num: '10,000+', label: '活跃用户' },
  { icon: '📄', num: '100+', label: '写作模板' },
  { icon: '📝', num: '300,000+', label: '生成文章' },
  { icon: '👍', num: '99%', label: '用户满意度' },
]

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
  { label: '写一篇 2000 字技术博客', before: '3–4 小时', after: '30–45 分钟', saving: '节省 75%' },
  { label: '从灵感到可发布初稿', before: '2–3 天', after: '当天完成', saving: '提速 5x' },
  { label: '大纲反复改动次数', before: '平均 4–6 次', after: '1–2 次', saving: '减少 70%' },
  { label: '写作时的卡顿次数', before: '每篇 8–12 次', after: '几乎为零', saving: '专注度 ↑' },
]

const plans = [
  {
    tier: 'Free',
    price: '¥0',
    priceOriginal: null,
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
    priceOriginal: '¥39',
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
    priceOriginal: '¥149',
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

// ─── Page ────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.bg, fontFamily: 'system-ui, -apple-system, sans-serif', color: C.text }}>

      {/* ══ NAV ══════════════════════════════════════════════ */}
      <header style={{ backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>
              W
            </div>
            <span style={{ fontWeight: 700, fontSize: 16, color: C.text }}>AI 写作助手</span>
          </Link>

          {/* Nav links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} style={{ fontSize: 14, color: C.textSub, textDecoration: 'none', fontWeight: 500 }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = C.blue }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = C.textSub }}>
                {l.label}
              </a>
            ))}
          </nav>

          {/* Auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <SignedOut>
              <SignInButton mode="modal">
                <button style={{ fontSize: 14, color: C.textSub, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                  登录
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button style={{ fontSize: 14, backgroundColor: C.blue, color: 'white', border: 'none', borderRadius: 8, padding: '8px 20px', cursor: 'pointer', fontWeight: 600 }}>
                  登录 / 注册
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" style={{ fontSize: 14, backgroundColor: C.blue, color: 'white', borderRadius: 8, padding: '8px 20px', fontWeight: 600, textDecoration: 'none' }}>
                工作台
              </Link>
              <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
            </SignedIn>
          </div>

        </div>
      </header>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section style={{
        background: 'linear-gradient(135deg, #EEF2FF 0%, #F0F2FA 40%, #E8EDFF 100%)',
        padding: '80px 24px 100px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,91,219,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(76,110,245,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>

          {/* Left copy */}
          <div>
            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: C.blueLight, border: `1px solid rgba(59,91,219,0.2)`, borderRadius: 20, padding: '6px 14px', marginBottom: 28 }}>
              <span style={{ fontSize: 12 }}>✦</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.blue }}>AI 驱动的智能写作助手</span>
            </div>

            {/* Headline */}
            <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 24, color: C.text }}>
              让写作更轻松，<br />
              让表达<span style={{ color: C.blue }}>更出色</span>
            </h1>

            {/* Sub */}
            <p style={{ fontSize: 16, lineHeight: 1.8, color: C.textSub, marginBottom: 36, maxWidth: 440 }}>
              AI写作助手帮助你快速生成高质量文章、优雅润色内容、激发创意灵感，让每一次写作都更高效、更自信。
            </p>

            {/* CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48 }}>
              <SignedOut>
                <SignUpButton mode="modal">
                  <button style={{ fontSize: 15, fontWeight: 700, backgroundColor: C.blue, color: 'white', border: 'none', borderRadius: 10, padding: '14px 28px', cursor: 'pointer' }}>
                    开始免费使用 →
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" style={{ fontSize: 15, fontWeight: 700, backgroundColor: C.blue, color: 'white', borderRadius: 10, padding: '14px 28px', textDecoration: 'none' }}>
                  进入工作台 →
                </Link>
              </SignedIn>
              <Link href="/demo" style={{ fontSize: 15, fontWeight: 600, color: C.textSub, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13 }}>▷</span> 观看演示
              </Link>
            </div>

            {/* Mini badges */}
            <div style={{ display: 'flex', gap: 28 }}>
              {heroBadges.map((b) => (
                <div key={b.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ fontSize: 16, lineHeight: 1 }}>{b.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{b.title}</div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{b.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — App mockup */}
          <div style={{ position: 'relative' }}>
            <div style={{ backgroundColor: 'white', borderRadius: 16, boxShadow: '0 24px 64px rgba(59,91,219,0.12), 0 4px 16px rgba(0,0,0,0.06)', overflow: 'hidden', border: `1px solid ${C.border}` }}>
              {/* Window chrome */}
              <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#FF5F57', display: 'inline-block' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#FEBC2E', display: 'inline-block' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#28C840', display: 'inline-block' }} />
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 600 }}>AI 写作助手</span>
                </div>
              </div>

              <div style={{ display: 'flex', height: 340 }}>
                {/* Sidebar */}
                <div style={{ width: 140, borderRight: `1px solid ${C.border}`, padding: '16px 0', flexShrink: 0 }}>
                  <div style={{ padding: '0 12px', marginBottom: 8 }}>
                    <div style={{ backgroundColor: C.blue, color: 'white', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>✏️</span> 新建写作
                    </div>
                  </div>
                  <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13 }}>🖥️</span>
                    <span style={{ fontSize: 12, color: C.textSub, fontWeight: 500 }}>工作台</span>
                  </div>
                  <div style={{ padding: '4px 12px 8px', fontSize: 11, color: C.textMuted, fontWeight: 600, marginTop: 8 }}>文档</div>
                  {['全部文档', '最近使用', '收藏夹', '回收站'].map((item) => (
                    <div key={item} style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 11 }}>📁</span>
                      <span style={{ fontSize: 12, color: C.textSub }}>{item}</span>
                    </div>
                  ))}
                  <div style={{ padding: '4px 12px 4px', fontSize: 11, color: C.textMuted, fontWeight: 600, marginTop: 8 }}>工具</div>
                  <div style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11 }}>🎨</span>
                    <span style={{ fontSize: 12, color: C.textSub }}>模板中心</span>
                  </div>
                  <div style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11 }}>🤖</span>
                    <span style={{ fontSize: 12, color: C.textSub }}>AI 工具箱</span>
                  </div>
                </div>

                {/* Main content */}
                <div style={{ flex: 1, padding: '20px 20px 16px', overflow: 'hidden' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14, color: C.text }}>你想写什么？</h3>
                  {/* Input */}
                  <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 14px', marginBottom: 10, backgroundColor: '#FAFBFF' }}>
                    <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 24 }}>告诉 AI 你的想法，或选择一个模板开始…</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {['文章', '邮件', '文案', '大纲', '… 更多'].map((t) => (
                          <span key={t} style={{ fontSize: 11, color: C.textSub, backgroundColor: C.bg, borderRadius: 6, padding: '3px 8px', border: `1px solid ${C.border}` }}>{t}</span>
                        ))}
                      </div>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13 }}>→</div>
                    </div>
                  </div>

                  {/* Templates */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>推荐模板</span>
                    <span style={{ fontSize: 12, color: C.blue, cursor: 'pointer' }}>查看更多 &gt;</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    {templates.map((t) => (
                      <div key={t.title} style={{ backgroundColor: C.bg, borderRadius: 8, padding: '10px 10px', border: `1px solid ${C.border}` }}>
                        <span style={{ fontSize: 16, display: 'block', marginBottom: 4 }}>{t.icon}</span>
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.text }}>{t.title}</div>
                        <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>{t.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══ TESTIMONIALS ══════════════════════════════════════ */}
      <section style={{ backgroundColor: 'white', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: C.text }}>
              被超过 <span style={{ color: C.blue }}>10,000+</span> 用户信赖的 AI 写作助手
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {testimonials.map((t) => (
              <div key={t.name} style={{ backgroundColor: C.bg, borderRadius: 16, padding: '28px 28px 24px', border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 32, color: C.blue, opacity: 0.25, lineHeight: 1, marginBottom: 16, fontFamily: 'Georgia, serif' }}>&ldquo;</div>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: C.textSub, marginBottom: 24 }}>{t.content}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: C.blueLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STATS ═════════════════════════════════════════════ */}
      <section style={{ backgroundColor: C.bg, padding: '60px 24px', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {statsRow.map((s, i) => (
            <div key={s.label} style={{ textAlign: 'center', padding: '0 24px', borderLeft: i > 0 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ fontSize: 28, marginBottom: 8, color: C.blue }}>{s.icon}</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: C.blue, letterSpacing: '-0.02em' }}>{s.num}</div>
              <div style={{ fontSize: 14, color: C.textMuted, marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FEATURES ══════════════════════════════════════════ */}
      <section id="features" style={{ backgroundColor: 'white', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: C.blueLight, borderRadius: 20, padding: '5px 14px', marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.blue }}>核心功能</span>
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: C.text, marginBottom: 12 }}>一套工作流，覆盖创作全程</h2>
            <p style={{ fontSize: 15, color: C.textSub, maxWidth: 480, margin: '0 auto' }}>从标题选题到 SEO 优化，每个卡点都有 AI 接管，你只需要把控方向和最终表达。</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {features.map((f) => (
              <div key={f.title} style={{ backgroundColor: C.bg, borderRadius: 14, padding: '28px 24px', border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.blue, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>{f.label}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══════════════════════════════════════ */}
      <section id="how-it-works" style={{ backgroundColor: C.bg, padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: C.blueLight, borderRadius: 20, padding: '5px 14px', marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.blue }}>使用流程</span>
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: C.text, marginBottom: 12 }}>四步，写完一篇博客</h2>
            <p style={{ fontSize: 15, color: C.textSub }}>不需要学习成本，打开就能用</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
            {steps.map((s, i) => (
              <div key={s.title} style={{ textAlign: 'center', padding: '24px 20px', borderLeft: i > 0 ? `1px solid ${C.border}` : 'none' }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: C.blue, opacity: 0.15, lineHeight: 1, marginBottom: 12 }}>{String(i + 1).padStart(2, '0')}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link href="/demo" style={{ fontSize: 14, color: C.blue, fontWeight: 600, textDecoration: 'none' }}>
              立即体验 30 秒交互演示 →
            </Link>
          </div>
        </div>
      </section>

      {/* ══ BEFORE / AFTER ════════════════════════════════════ */}
      <section style={{ backgroundColor: 'white', padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: C.blueLight, borderRadius: 20, padding: '5px 14px', marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.blue }}>效率对比</span>
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: C.text, marginBottom: 12 }}>手动写作 vs AI 辅助写作</h2>
            <p style={{ fontSize: 14, color: C.textMuted }}>数据来自内测用户反馈，实际效果因写作习惯和主题复杂度有所不同</p>
          </div>
          <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', backgroundColor: C.bg, borderBottom: `1px solid ${C.border}`, padding: '12px 20px' }}>
              {['场景', '手动写作', 'AI 辅助', '节省'].map((h, i) => (
                <div key={h} style={{ fontSize: 12, fontWeight: 700, color: i === 2 ? C.blue : C.textMuted, textAlign: i > 0 ? 'center' : 'left' }}>{h}</div>
              ))}
            </div>
            {comparisons.map((row, i) => (
              <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '16px 20px', borderTop: i > 0 ? `1px solid ${C.border}` : 'none', backgroundColor: i % 2 === 0 ? 'white' : C.bg }}>
                <div style={{ fontSize: 14, color: C.textSub }}>{row.label}</div>
                <div style={{ fontSize: 14, color: C.textMuted, textAlign: 'center', textDecoration: 'line-through' }}>{row.before}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text, textAlign: 'center' }}>{row.after}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.blue, textAlign: 'center' }}>{row.saving}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRICING ═══════════════════════════════════════════ */}
      <section id="pricing" style={{ backgroundColor: C.bg, padding: '80px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: C.blueLight, borderRadius: 20, padding: '5px 14px', marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.blue }}>价格方案</span>
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: C.text, marginBottom: 12 }}>先体验，满意再升级</h2>
            <p style={{ fontSize: 15, color: C.textSub }}>免费版功能完整，无试用期限制。</p>
            <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: '#FFF9DB', border: '1px solid #E67700', borderRadius: 20, padding: '6px 16px' }}>
              <span style={{ fontSize: 12, color: '#E67700', fontWeight: 600 }}>✦ 早鸟计划开放中 · 现在锁定价格，正式上线后永久有效 ✦</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {plans.map((plan) => (
              <div key={plan.tier} style={{
                backgroundColor: plan.featured ? C.blue : 'white',
                borderRadius: 20,
                padding: '32px 28px',
                border: plan.featured ? 'none' : `1px solid ${C.border}`,
                color: plan.featured ? 'white' : C.text,
                position: 'relative',
                boxShadow: plan.featured ? '0 16px 48px rgba(59,91,219,0.3)' : 'none',
              }}>
                {plan.featured && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#E67700', color: 'white', fontSize: 11, fontWeight: 700, borderRadius: 12, padding: '4px 14px', whiteSpace: 'nowrap' }}>
                    早鸟价 · 最受欢迎
                  </div>
                )}
                {!plan.featured && plan.earlyBird && (
                  <div style={{ display: 'inline-block', backgroundColor: '#FFF9DB', border: '1px solid #E67700', color: '#E67700', fontSize: 11, fontWeight: 700, borderRadius: 10, padding: '3px 10px', marginBottom: 12 }}>
                    早鸟价
                  </div>
                )}
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: plan.featured ? 'rgba(255,255,255,0.6)' : C.textMuted, marginBottom: 8 }}>{plan.tier}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.02em' }}>{plan.price}</span>
                  <span style={{ fontSize: 14, opacity: 0.6 }}>{plan.period}</span>
                  {plan.priceOriginal && <span style={{ fontSize: 14, opacity: 0.4, textDecoration: 'line-through' }}>{plan.priceOriginal}</span>}
                </div>
                <p style={{ fontSize: 13, opacity: plan.featured ? 0.7 : undefined, color: plan.featured ? undefined : C.textSub, marginBottom: 24 }}>{plan.desc}</p>
                <ul style={{ marginBottom: 16, listStyle: 'none', padding: 0 }}>
                  {plan.features.map((feat) => (
                    <li key={feat} style={{ fontSize: 13, display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 10 }}>
                      <span style={{ color: plan.featured ? '#90BFFF' : C.blue, flexShrink: 0, marginTop: 1 }}>✓</span>
                      <span style={{ opacity: plan.featured ? 0.85 : undefined, color: plan.featured ? undefined : C.textSub }}>{feat}</span>
                    </li>
                  ))}
                </ul>
                {plan.notIncluded.length > 0 && (
                  <ul style={{ marginBottom: 28, listStyle: 'none', padding: 0 }}>
                    {plan.notIncluded.map((feat) => (
                      <li key={feat} style={{ fontSize: 13, display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 10 }}>
                        <span style={{ opacity: 0.3, flexShrink: 0 }}>—</span>
                        <span style={{ opacity: 0.3, textDecoration: 'line-through' }}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {plan.notIncluded.length === 0 && <div style={{ marginBottom: 28 }} />}

                {plan.ctaHref ? (
                  <a href={plan.ctaHref} style={{
                    display: 'block', textAlign: 'center', padding: '12px', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none',
                    backgroundColor: plan.featured ? 'white' : C.blue,
                    color: plan.featured ? C.blue : 'white',
                  }}>{plan.cta}</a>
                ) : (
                  <>
                    <SignedOut>
                      <SignUpButton mode="modal">
                        <button style={{ display: 'block', width: '100%', textAlign: 'center', padding: '12px', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', border: `1px solid ${C.border}`, backgroundColor: C.bg, color: C.text }}>{plan.cta}</button>
                      </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                      <Link href="/dashboard" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none', border: `1px solid ${C.border}`, backgroundColor: C.bg, color: C.text }}>{plan.cta}</Link>
                    </SignedIn>
                  </>
                )}
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 13, color: C.textMuted, marginTop: 24 }}>无需信用卡 · 随时停用 · 数据完整导出 · 不训练你的原创内容</p>
        </div>
      </section>

      {/* ══ FAQ ═══════════════════════════════════════════════ */}
      <section style={{ backgroundColor: 'white', padding: '80px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: C.blueLight, borderRadius: 20, padding: '5px 14px', marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.blue }}>常见问题</span>
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: C.text }}>你可能想知道的</h2>
          </div>
          <div style={{ borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
            {faqs.map((faq, i) => (
              <div key={faq.q} style={{ padding: '24px 28px', borderTop: i > 0 ? `1px solid ${C.border}` : 'none' }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 8 }}>{faq.q}</p>
                <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.75 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ═════════════════════════════════════════ */}
      <section style={{ background: `linear-gradient(135deg, ${C.blue} 0%, ${C.blueMid} 100%)`, padding: '80px 24px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 16 }}>
            下一篇博客，<em style={{ fontStyle: 'normal', opacity: 0.85 }}>今天就写完</em>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 32 }}>免费开始，30 分钟从草稿到可发布内容。</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            <SignedOut>
              <SignUpButton mode="modal">
                <button style={{ fontSize: 15, fontWeight: 700, backgroundColor: 'white', color: C.blue, border: 'none', borderRadius: 10, padding: '14px 32px', cursor: 'pointer' }}>
                  免费开始创作
                </button>
              </SignUpButton>
              <Link href="/demo" style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                先看演示 →
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" style={{ fontSize: 15, fontWeight: 700, backgroundColor: 'white', color: C.blue, borderRadius: 10, padding: '14px 32px', textDecoration: 'none' }}>
                进入工作台
              </Link>
            </SignedIn>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 20 }}>无需信用卡 · Free 版 30,000 tokens / 月 · 随时取消</p>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════ */}
      <footer style={{ backgroundColor: '#111827', color: 'rgba(255,255,255,0.5)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, backgroundColor: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13 }}>W</div>
              <span style={{ fontWeight: 700, fontSize: 15, color: 'white' }}>AI 写作助手</span>
            </div>
            <p style={{ fontSize: 13 }}>专注中文内容创作</p>
          </div>
          <nav style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
            {[{ label: '功能', href: '#features' }, { label: '定价', href: '#pricing' }, { label: '演示', href: '/demo' }, { label: '隐私政策', href: '#' }, { label: '服务条款', href: '#' }].map(({ label, href }) => (
              <a key={label} href={href} style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>{label}</a>
            ))}
          </nav>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '16px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 12 }}>© 2026 AI写作助手. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}
