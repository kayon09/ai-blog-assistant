/**
 * 内容合规审查核心逻辑
 *
 * Level 1：本地关键词过滤（同步，零成本）
 * Level 2：Claude 安全机制（在 API Route 层捕获，此处提供工具函数）
 *
 * src/lib/moderation/moderator.ts
 */

import { ALL_SENSITIVE_WORDS } from './sensitive-words'

// ─── 类型定义 ────────────────────────────────────────────────────────────────

export interface ModerationResult {
  /** 是否允许通过 */
  allowed: boolean
  /** 触发的审查级别 */
  triggeredLevel?: 'local_filter' | 'claude_rejection'
  /** 触发规则 ID，格式：category:word */
  ruleId?: string
  /** 触发词分类 */
  category?: 'political' | 'sexual' | 'violent'
  /** 面向用户的友好提示 */
  message?: string
}

// ─── 常量 ────────────────────────────────────────────────────────────────────

const BLOCKED_MESSAGE = '您输入的内容可能涉及敏感词汇，请调整后重试'

// ─── Level 1：本地关键词过滤（同步）────────────────────────────────────────

/**
 * 对输入文本执行本地敏感词检测
 *
 * - 大小写不敏感（text.toLowerCase()）
 * - 命中任意词即立即返回拦截结果，不继续遍历
 * - 未命中则返回 { allowed: true }
 *
 * @param text 待检测的原始文本
 * @returns ModerationResult
 */
export function checkLocalFilter(text: string): ModerationResult {
  const lowerText = text.toLowerCase()

  for (const entry of ALL_SENSITIVE_WORDS) {
    if (lowerText.includes(entry.word.toLowerCase())) {
      return {
        allowed: false,
        triggeredLevel: 'local_filter',
        ruleId: `${entry.category}:${entry.word}`,
        category: entry.category,
        message: BLOCKED_MESSAGE,
      }
    }
  }

  return { allowed: true }
}

// ─── 文本哈希（用于日志，不存明文）──────────────────────────────────────────

/**
 * 计算文本的简单字符串哈希（djb2 算法变体）
 *
 * 仅用于 moderation_logs 记录，不做密码学用途。
 * 输出格式：32 位十六进制字符串（8位）
 *
 * @param text 待哈希的原始文本
 * @returns 8位十六进制哈希字符串
 */
export function hashText(text: string): string {
  let hash = 5381
  for (let i = 0; i < text.length; i++) {
    // hash * 33 XOR charCode
    hash = ((hash << 5) + hash) ^ text.charCodeAt(i)
    // 保持在 32 位整数范围内（有符号）
    hash = hash | 0
  }
  // 转为无符号 32 位，再输出十六进制，补零至 8 位
  return (hash >>> 0).toString(16).padStart(8, '0')
}
