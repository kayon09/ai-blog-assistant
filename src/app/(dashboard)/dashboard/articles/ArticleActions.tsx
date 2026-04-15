// ============================================================
// 文章操作（删除）客户端组件
// src/app/(dashboard)/dashboard/articles/ArticleActions.tsx
// ============================================================
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ArticleActionsProps {
  articleId: string
}

type DeleteState = 'idle' | 'confirming' | 'deleting'

export function ArticleActions({ articleId }: ArticleActionsProps) {
  const router = useRouter()
  const [deleteState, setDeleteState] = useState<DeleteState>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleDeleteClick = () => {
    setErrorMsg(null)
    setDeleteState('confirming')
  }

  const handleCancel = () => {
    setDeleteState('idle')
    setErrorMsg(null)
  }

  const handleConfirmDelete = async () => {
    setDeleteState('deleting')
    setErrorMsg(null)
    try {
      const res = await fetch(`/api/articles/${articleId}`, { method: 'DELETE' })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        const msg = body?.error?.message ?? '删除失败，请稍后重试'
        setErrorMsg(msg)
        setDeleteState('confirming')
        return
      }
      router.refresh()
    } catch {
      setErrorMsg('网络异常，请稍后重试')
      setDeleteState('confirming')
    }
  }

  // ── 删除中状态 ──
  if (deleteState === 'deleting') {
    return (
      <span
        className="text-xs"
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-ink-faint)', opacity: 0.6 }}
      >
        删除中...
      </span>
    )
  }

  // ── 等待二次确认状态 ──
  if (deleteState === 'confirming') {
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2">
          <button
            onClick={handleConfirmDelete}
            className="text-xs transition-colors"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'rgb(220, 38, 38)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem 0.5rem',
            }}
          >
            确认删除
          </button>
          <span style={{ color: 'var(--color-ivory-border)' }}>|</span>
          <button
            onClick={handleCancel}
            className="text-xs transition-colors"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-ink-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem 0.5rem',
            }}
          >
            取消
          </button>
        </div>
        {errorMsg !== null && (
          <p
            className="text-[11px]"
            style={{ color: 'rgb(220, 38, 38)', fontFamily: 'var(--font-mono)' }}
          >
            {errorMsg}
          </p>
        )}
      </div>
    )
  }

  // ── 初始状态 ──
  return (
    <button
      onClick={handleDeleteClick}
      className="btn-ghost text-xs"
      style={{
        color: 'var(--color-ink-muted)',
        padding: '0.375rem 0.875rem',
      }}
      aria-label="删除文章"
    >
      删除
    </button>
  )
}
