// ============================================================
// SEO 分析面板（F06）：关键词建议与优化提示
// src/components/editor/SeoPanel.tsx
// ============================================================
'use client'

import { useState } from 'react'
import type { SeoKeyword, SeoResult } from '@/types'

interface SeoPanelProps {
  articleTitle: string
  content: string
}

const IMPORTANCE_LABEL: Record<SeoKeyword['importance'], string> = {
  high: '重要',
  medium: '一般',
  low: '参考',
}

const IMPORTANCE_COLOR: Record<SeoKeyword['importance'], string> = {
  high: 'rgb(22, 163, 74)',
  medium: 'var(--color-gold)',
  low: 'var(--color-ink-faint)',
}

export function SeoPanel({ articleTitle, content }: SeoPanelProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<SeoResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!content.trim() || !articleTitle.trim()) return
    setIsAnalyzing(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/generate/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: articleTitle, content }),
      })
      if (!res.ok) {
        throw new Error(`请求失败（${res.status}），请稍后重试`)
      }
      const json = await res.json()
      if (!json.success) {
        throw new Error(json.error?.message ?? 'SEO 分析失败，请重试')
      }
      setResult(json.data.seoResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误，请稍后重试')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
  }

  return (
    <div className="border border-[var(--color-ivory-border)] bg-[var(--color-surface)] p-6">
      {/* 标题 */}
      <p
        className="mb-1 font-mono text-xs uppercase tracking-[0.14em]"
        style={{ color: 'var(--color-gold)' }}
      >
        SEO Analysis
      </p>
      <h3
        className="mb-4 font-serif text-base font-semibold"
        style={{ color: 'var(--color-ink)' }}
      >
        SEO 关键词分析
      </h3>

      {/* 未分析状态 */}
      {!result && (
        <>
          <p
            className="mb-5 text-sm leading-relaxed"
            style={{ color: 'var(--color-ink-muted)' }}
          >
            分析文章中的关键词分布，获取 SEO 优化建议，提升搜索引擎收录率。
          </p>

          {error && (
            <p className="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </p>
          )}

          <button
            className="btn-primary w-full justify-center"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !content.trim()}
          >
            {isAnalyzing ? (
              <>
                <span className="animate-spin">⟳</span> 分析中...
              </>
            ) : (
              '分析关键词 →'
            )}
          </button>
        </>
      )}

      {/* 分析结果 */}
      {result && (
        <div className="space-y-5">
          {/* 核心关键词表格 */}
          <div>
            <p
              className="mb-2 font-mono text-[10px] uppercase tracking-widest"
              style={{ color: 'var(--color-ink-faint)' }}
            >
              核心关键词
            </p>
            <div className="space-y-1.5">
              {result.coreKeywords.map(kw => (
                <div
                  key={kw.word}
                  className="flex items-center justify-between gap-3 border border-[var(--color-ivory-border)] px-3 py-2 text-xs"
                >
                  <span
                    className="font-semibold"
                    style={{ color: 'var(--color-ink)' }}
                  >
                    {kw.word}
                  </span>
                  <div className="flex items-center gap-3 font-mono">
                    <span style={{ color: 'var(--color-ink-faint)' }}>
                      当前 {kw.currentCount} → 建议 {kw.suggestedCount}
                    </span>
                    <span
                      className="rounded-none px-1.5 py-0.5 text-[10px] uppercase tracking-wide"
                      style={{
                        color: IMPORTANCE_COLOR[kw.importance],
                        border: `1px solid ${IMPORTANCE_COLOR[kw.importance]}`,
                        opacity: 0.9,
                      }}
                    >
                      {IMPORTANCE_LABEL[kw.importance]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 缺失关键词 */}
          {result.missingKeywords.length > 0 && (
            <div>
              <p
                className="mb-2 font-mono text-[10px] uppercase tracking-widest"
                style={{ color: 'var(--color-ink-faint)' }}
              >
                建议补充关键词
              </p>
              <div className="flex flex-wrap gap-1.5">
                {result.missingKeywords.map(word => (
                  <span
                    key={word}
                    className="border px-2 py-1 font-mono text-[11px]"
                    style={{
                      borderColor: 'var(--color-ivory-border)',
                      color: 'var(--color-ink-muted)',
                    }}
                  >
                    + {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 优化建议 */}
          {result.suggestions.length > 0 && (
            <div>
              <p
                className="mb-2 font-mono text-[10px] uppercase tracking-widest"
                style={{ color: 'var(--color-ink-faint)' }}
              >
                优化建议
              </p>
              <ul className="space-y-2">
                {result.suggestions.map((s, i) => (
                  <li
                    key={`suggestion-${i}`}
                    className="flex gap-2 text-xs leading-relaxed"
                    style={{ color: 'var(--color-ink-muted)' }}
                  >
                    <span
                      className="mt-0.5 shrink-0 font-mono"
                      style={{ color: 'var(--color-gold)' }}
                    >
                      {i + 1}.
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 重新分析按钮 */}
          <button
            className="btn-ghost w-full justify-center text-xs"
            onClick={handleReset}
          >
            重新分析
          </button>
        </div>
      )}
    </div>
  )
}
