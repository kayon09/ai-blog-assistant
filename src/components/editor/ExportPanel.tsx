// ============================================================
// 导出面板：下载 .md 文件 + 复制按钮
// src/components/editor/ExportPanel.tsx
// ============================================================
'use client'

import { useEffect, useRef, useState } from 'react'

interface ExportPanelProps {
  articleTitle: string
  fullMarkdown: string
  wordCount: number
  articleId?: string | null
}

// Simple djb2 hash for AI draft fingerprinting (no external deps)
function djb2Hash(str: string): string {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i)
    hash = hash >>> 0 // keep unsigned 32-bit
  }
  return hash.toString(16).padStart(8, '0')
}

function recordExportAnalytics(
  articleId: string,
  fullMarkdown: string,
): void {
  // Fire-and-forget analytics; never blocks the user
  const aiDraftHash = djb2Hash(fullMarkdown)
  fetch('/api/analytics/similarity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      articleId,
      aiDraftHash,
      userFinalTextLength: fullMarkdown.length,
    }),
  }).catch(() => { /* analytics failure is non-critical */ })
}

export function ExportPanel({ articleTitle, fullMarkdown, wordCount, articleId }: ExportPanelProps) {
  const [copied, setCopied] = useState<'md' | 'plain' | null>(null)
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    }
  }, [])

  const handleDownloadMd = () => {
    const blob = new Blob([fullMarkdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    // 用文章标题作文件名，去除非法字符
    const safeName = articleTitle.replace(/[\\/:*?"<>|]/g, '_').slice(0, 60) || 'article'
    a.download = `${safeName}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    // Delay revoke to give browser time to start the download
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    // Record analytics
    if (articleId) recordExportAnalytics(articleId, fullMarkdown)
  }

  const handleCopyMd = async () => {
    try {
      await navigator.clipboard.writeText(fullMarkdown)
      setCopied('md')
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
      copyTimerRef.current = setTimeout(() => setCopied(null), 2000)
      if (articleId) recordExportAnalytics(articleId, fullMarkdown)
    } catch {
      // Clipboard API may be denied in some contexts
    }
  }

  const handleCopyPlain = async () => {
    const plainText = fullMarkdown
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim()
    try {
      await navigator.clipboard.writeText(plainText)
      setCopied('plain')
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
      copyTimerRef.current = setTimeout(() => setCopied(null), 2000)
      if (articleId) recordExportAnalytics(articleId, fullMarkdown)
    } catch {
      // Clipboard API may be denied in some contexts
    }
  }

  return (
    <div
      className="border border-[var(--color-gold)] bg-[var(--color-surface)] p-6"
    >
      {/* 标题 */}
      <p
        className="mb-1 font-mono text-xs uppercase tracking-[0.14em]"
        style={{ color: 'var(--color-gold)' }}
      >
        Export Article
      </p>
      <h3
        className="mb-4 font-serif text-base font-semibold"
        style={{ color: 'var(--color-ink)' }}
      >
        导出文章
      </h3>

      {/* 字数统计 */}
      <p
        className="mb-5 font-mono text-xs"
        style={{ color: 'var(--color-ink-faint)' }}
      >
        全文约 <span style={{ color: 'var(--color-ink-muted)' }}>{wordCount.toLocaleString()}</span> 字
      </p>

      {/* 按钮组 */}
      <div className="flex flex-wrap gap-3">
        {/* 下载 .md 文件 */}
        <button
          className="btn-primary text-sm"
          onClick={handleDownloadMd}
        >
          ↓ 下载 .md 文件
        </button>

        {/* 复制 Markdown 源码 */}
        <button
          className="btn-ghost text-sm"
          onClick={handleCopyMd}
        >
          {copied === 'md' ? '✓ 已复制' : 'Markdown 复制'}
        </button>

        {/* 复制纯文本（适合粘贴到微信/掘金） */}
        <button
          className="btn-ghost text-sm"
          onClick={handleCopyPlain}
        >
          {copied === 'plain' ? '✓ 已复制' : '纯文本复制'}
        </button>
      </div>

      <p
        className="mt-3 text-xs"
        style={{ color: 'var(--color-ink-faint)' }}
      >
        纯文本复制适合直接粘贴到微信公众号、掘金等平台
      </p>
    </div>
  )
}
