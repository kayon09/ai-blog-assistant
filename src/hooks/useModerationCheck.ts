'use client'

/**
 * useModerationCheck
 *
 * 封装内容合规检查的 React Hook
 *
 * - checkText(text)：调用 POST /api/moderation/check
 *   - 返回 true  → 内容允许，可继续发起 AI 调用
 *   - 返回 false → 内容被拦截，blockedMessage 已设置
 * - clearBlocked()：清除拦截状态（供用户修改后重试）
 * - 网络/服务端错误时优雅降级，返回 true 不阻断用户
 *
 * src/hooks/useModerationCheck.ts
 */

import { useCallback, useState } from 'react'

// ─── 类型定义 ────────────────────────────────────────────────────────────────

export interface UseModerationCheckReturn {
  /** 是否正在请求检查 API */
  isChecking: boolean
  /** 被拦截时的用户友好提示；null 表示未被拦截 */
  blockedMessage: string | null
  /**
   * 检查文本合规性
   * @returns true → 允许；false → 被拦截
   */
  checkText: (text: string) => Promise<boolean>
  /** 清除拦截状态，允许用户修改后重试 */
  clearBlocked: () => void
}

// ─── API 响应结构（最小化，无需引入 server-side 类型）────────────────────────

interface ModerationApiResponse {
  success: boolean
  data?: {
    allowed: boolean
    message?: string
  }
  error?: {
    code: string
    message: string
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useModerationCheck(): UseModerationCheckReturn {
  const [isChecking, setIsChecking] = useState(false)
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null)

  const checkText = useCallback(async (text: string): Promise<boolean> => {
    setIsChecking(true)
    setBlockedMessage(null)

    try {
      const res = await fetch('/api/moderation/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      // HTTP 层错误（4xx/5xx）：优雅降级，放行用户
      if (!res.ok) {
        console.warn('[useModerationCheck] API returned non-OK status:', res.status)
        return true
      }

      const json: ModerationApiResponse = await res.json()

      // API 业务错误：优雅降级，放行用户
      if (!json.success || !json.data) {
        console.warn('[useModerationCheck] API business error:', json.error)
        return true
      }

      const { allowed, message } = json.data

      if (!allowed) {
        setBlockedMessage(message ?? '您输入的内容可能涉及敏感词汇，请调整后重试')
        return false
      }

      return true
    } catch (err) {
      // 网络错误（离线、超时等）：优雅降级，放行用户，不因合规检查失败阻断体验
      console.warn('[useModerationCheck] Network error, graceful degradation:', err)
      return true
    } finally {
      setIsChecking(false)
    }
  }, [])

  const clearBlocked = useCallback(() => {
    setBlockedMessage(null)
  }, [])

  return { isChecking, blockedMessage, checkText, clearBlocked }
}
