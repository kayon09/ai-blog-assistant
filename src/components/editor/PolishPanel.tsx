// ============================================================
// 润色面板（F05）：三档强度润色
// src/components/editor/PolishPanel.tsx
// ============================================================
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type PolishIntensity = 'light' | 'medium' | 'deep'

interface PolishPanelProps {
  content: string
  onApply?: (polished: string) => void
}

const INTENSITY_OPTIONS: { value: PolishIntensity; label: string; desc: string }[] = [
  { value: 'light', label: '轻度润色', desc: '修正语病，改善流畅度' },
  { value: 'medium', label: '中度润色', desc: '重写句子，提升表达力' },
  { value: 'deep', label: '深度润色', desc: '重构段落，专业级文风' },
]

export function PolishPanel({ content, onApply }: PolishPanelProps) {
  const [intensity, setIntensity] = useState<PolishIntensity>('medium')
  const [isPolishing, setIsPolishing] = useState(false)
  const [polishedText, setPolishedText] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  // Track timers so we can clean up on unmount
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    }
  }, [])

  const handlePolish = async () => {
    if (!content.trim()) return
    setIsPolishing(true)
    setError(null)
    setPolishedText(null)

    try {
      const res = await fetch('/api/generate/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, intensity }),
      })
      if (!res.ok) {
        throw new Error(`请求失败（${res.status}），请稍后重试`)
      }
      const json = await res.json()
      if (!json.success) {
        throw new Error(json.error?.message ?? '润色失败，请重试')
      }
      setPolishedText(json.data.polishedContent)
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误，请稍后重试')
    } finally {
      setIsPolishing(false)
    }
  }

  const handleApply = useCallback(() => {
    if (polishedText && onApply) {
      onApply(polishedText)
      setPolishedText(null)
    }
  }, [polishedText, onApply])

  const handleCopy = useCallback(async () => {
    if (!polishedText) return
    try {
      await navigator.clipboard.writeText(polishedText)
      setCopied(true)
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API may be denied - silently ignore
    }
  }, [polishedText])

  const handleDiscard = () => {
    setPolishedText(null)
    setError(null)
  }

  return (
    <div
      className="border border-[var(--color-ivory-border)] bg-[var(--color-surface)] p-6"
    >
      {/* 标题 */}
      <p
        className="mb-1 font-mono text-xs uppercase tracking-[0.14em]"
        style={{ color: 'var(--color-gold)' }}
      >
        AI Polish
      </p>
      <h3
        className="mb-4 font-serif text-base font-semibold"
        style={{ color: 'var(--color-ink)' }}
      >
        文章润色
      </h3>

      {/* 润色强度选择 */}
      {!polishedText && (
        <>
          <div className="mb-5 space-y-2">
            {INTENSITY_OPTIONS.map(opt => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-start gap-3 border p-3 transition-all"
                style={{
                  borderColor:
                    intensity === opt.value
                      ? 'var(--color-gold)'
                      : 'var(--color-ivory-border)',
                  backgroundColor:
                    intensity === opt.value
                      ? 'rgba(184, 134, 11, 0.04)'
                      : 'transparent',
                }}
              >
                <input
                  type="radio"
                  name="intensity"
                  value={opt.value}
                  checked={intensity === opt.value}
                  onChange={() => setIntensity(opt.value)}
                  className="mt-0.5 accent-[var(--color-gold)]"
                />
                <div>
                  <p
                    className="font-mono text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--color-ink)' }}
                  >
                    {opt.label}
                  </p>
                  <p
                    className="mt-0.5 text-xs"
                    style={{ color: 'var(--color-ink-faint)' }}
                  >
                    {opt.desc}
                  </p>
                </div>
              </label>
            ))}
          </div>

          {error && (
            <p
              className="mb-4 rounded-none border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
            >
              {error}
            </p>
          )}

          <button
            className="btn-primary w-full justify-center"
            onClick={handlePolish}
            disabled={isPolishing || !content.trim()}
          >
            {isPolishing ? (
              <>
                <span className="animate-spin">⟳</span> 润色中...
              </>
            ) : (
              '开始润色 →'
            )}
          </button>
        </>
      )}

      {/* 润色结果预览 */}
      {polishedText && (
        <>
          <div
            className="mb-4 max-h-60 overflow-y-auto border border-[var(--color-ivory-border)] bg-[var(--color-ivory)] p-4 text-sm leading-relaxed"
            style={{ color: 'var(--color-ink-secondary)', fontFamily: 'var(--font-serif)' }}
          >
            <p
              className="mb-2 font-mono text-[10px] uppercase tracking-widest"
              style={{ color: 'var(--color-ink-faint)' }}
            >
              润色结果预览
            </p>
            <div className="whitespace-pre-wrap">{polishedText}</div>
          </div>
          <div className="flex gap-3">
            {onApply && (
              <button className="btn-primary flex-1 justify-center" onClick={handleApply}>
                ✓ 应用润色
              </button>
            )}
            <button className="btn-ghost flex-1 justify-center" onClick={handleCopy}>
              {copied ? '✓ 已复制' : '复制润色结果'}
            </button>
            <button className="btn-ghost flex-1 justify-center" onClick={handleDiscard}>
              放弃
            </button>
          </div>
        </>
      )}
    </div>
  )
}
