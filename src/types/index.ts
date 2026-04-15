// ============================================================
// 全局 TypeScript 类型定义
// src/types/index.ts
// ============================================================

// 文章创作流程状态机
export type WorkflowStep = 'topic' | 'titles' | 'outline' | 'writing' | 'done'

// 用户订阅级别
export type PlanTier = 'free' | 'pro' | 'team'

// 文章状态
export type ArticleStatus = 'draft' | 'completed'

// 大纲章节
export interface OutlineSection {
  id: string
  title: string
  points: string[]
  content?: string // 扩写后填充
}

// 文章实体（title/content 对齐 SQL 定义，草稿阶段可为 null）
export interface Article {
  id: string
  userId: string
  title: string | null        // 修复 M-5：草稿阶段 title 可为 null
  outline: OutlineSection[]
  content: string | null      // 修复 M-5：草稿阶段 content 可为 null
  status: ArticleStatus
  wordCount?: number
  createdAt: Date
  updatedAt: Date
}

// 标题候选
export interface TitleItem {
  title: string
  reason: string
}

// Token 用量
export interface TokenUsage {
  inputTokens: number
  outputTokens: number
}

// 用户配额信息（单位：tokens，即 LLM 计费 token 数）
export interface UserQuota {
  planTier: PlanTier
  /** 本月已消耗 tokens 数 */
  tokenUsed: number
  /** 本月配额上限（Free: 30000，Pro/Team: Infinity） */
  tokenQuota: number
  /** 下次配额重置时间（每月 1 日） */
  quotaResetAt: Date
}

// 统一 API 响应格式
export type ApiResponse<T> =
  | { success: true; data: T; usage?: TokenUsage }
  | { success: false; error: { code: string; message: string } }

// ── SEO 分析类型（F06）────────────────────────────────────────
export interface SeoKeyword {
  word: string
  currentCount: number
  suggestedCount: number
  importance: 'high' | 'medium' | 'low'
}

export interface SeoResult {
  coreKeywords: SeoKeyword[]
  missingKeywords: string[]
  suggestions: string[]
}
