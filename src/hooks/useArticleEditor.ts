// ============================================================
// 编辑器核心状态管理 Hook
// src/hooks/useArticleEditor.ts
// ============================================================
'use client'

import { useCallback, useState } from 'react'
import type { OutlineSection, TitleItem, WorkflowStep } from '@/types'

// ── 大纲结构 ──────────────────────────────────────────────────
export interface Outline {
  intro: string
  sections: OutlineSection[]
  conclusion: string
}

// ── Agent 三阶段状态 ───────────────────────────────────────────
export type AgentPhase = 'idle' | 'running' | 'done' | 'failed'

export interface SectionAgentStatus {
  research: AgentPhase
  write: AgentPhase
  review: AgentPhase
}

// ── Hook 返回值类型 ────────────────────────────────────────────
export interface UseArticleEditorReturn {
  // ── 状态 ──
  step: WorkflowStep
  topic: string
  audience: string
  titles: TitleItem[]
  selectedTitle: string
  customTitle: string
  outlineLength: 'short' | 'medium' | 'long'
  outline: Outline | null
  expandedContent: Record<string, string>
  agentStatus: Record<string, SectionAgentStatus>
  isGeneratingTitles: boolean
  isGeneratingOutline: boolean
  expandingSections: Set<string>
  error: string | null
  articleId: string | null
  isSaving: boolean
  isLoading: boolean

  // ── Setters ──
  setTopic: (v: string) => void
  setAudience: (v: string) => void
  setSelectedTitle: (v: string) => void
  setCustomTitle: (v: string) => void
  setOutlineLength: (v: 'short' | 'medium' | 'long') => void
  setStep: (step: WorkflowStep) => void
  clearError: () => void

  // ── Actions ──
  generateTitles: () => Promise<void>
  selectTitle: (title: string) => Promise<void>
  generateOutline: () => Promise<void>
  expandSection: (section: OutlineSection) => Promise<void>
  expandAll: () => Promise<void>
  updateSection: (id: string, updates: Partial<OutlineSection>) => void
  updateExpandedContent: (id: string, content: string) => void
  addSection: () => void
  removeSection: (id: string) => void
  reorderSections: (sections: OutlineSection[]) => void
  loadArticle: (id: string) => Promise<void>
}

// ── 辅助：生成唯一 ID ──────────────────────────────────────────
function genId(): string {
  return `sec_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

// ── 辅助：解析错误消息 ─────────────────────────────────────────
function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return '未知错误，请稍后重试'
}

// ── 默认 Agent 状态 ────────────────────────────────────────────
function defaultAgentStatus(): SectionAgentStatus {
  return { research: 'idle', write: 'idle', review: 'idle' }
}

// ── 辅助：拼接全文内容 ─────────────────────────────────────────
function buildFullContent(
  sections: OutlineSection[],
  expandedContent: Record<string, string>
): string {
  return sections
    .map(s => expandedContent[s.id] ?? '')
    .filter(c => c.length > 0)
    .join('\n\n')
}

// ── 辅助：计算字数（全文长度 / 2，粗略估算中文字数）────────────
function calcWordCount(content: string): number {
  return Math.floor(content.length / 2)
}

// ═══════════════════════════════════════════════════════════════
// Hook 主体
// ═══════════════════════════════════════════════════════════════
export function useArticleEditor(): UseArticleEditorReturn {
  // ── 流程步骤 ──
  const [step, setStep] = useState<WorkflowStep>('topic')

  // ── 用户输入 ──
  const [topic, setTopic] = useState('')
  const [audience, setAudience] = useState('')

  // ── 标题阶段 ──
  const [titles, setTitles] = useState<TitleItem[]>([])
  const [selectedTitle, setSelectedTitle] = useState('')
  const [customTitle, setCustomTitle] = useState('')

  // ── 大纲阶段 ──
  const [outlineLength, setOutlineLength] = useState<'short' | 'medium' | 'long'>('medium')
  const [outline, setOutline] = useState<Outline | null>(null)

  // ── 写作阶段 ──
  const [expandedContent, setExpandedContent] = useState<Record<string, string>>({})
  const [agentStatus, setAgentStatus] = useState<Record<string, SectionAgentStatus>>({})
  const [expandingSections, setExpandingSections] = useState<Set<string>>(new Set())

  // ── 加载态 ──
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false)
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false)

  // ── 错误 ──
  const [error, setError] = useState<string | null>(null)

  // ── 持久化状态 ──
  const [articleId, setArticleId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const clearError = useCallback(() => setError(null), [])

  // ── 更新单个 section 的 agent 状态（不可变） ────────────────
  const updateAgentStatus = useCallback(
    (sectionId: string, updates: Partial<SectionAgentStatus>) => {
      setAgentStatus(prev => ({
        ...prev,
        [sectionId]: {
          ...(prev[sectionId] ?? defaultAgentStatus()),
          ...updates,
        },
      }))
    },
    []
  )

  // ─────────────────────────────────────────────────────────────
  // saveArticle — 内部保存方法，失败不打断用户操作
  // ─────────────────────────────────────────────────────────────
  const saveArticle = useCallback(
    async (
      currentArticleId: string | null,
      currentTitle: string,
      currentOutline: Outline,
      currentExpandedContent: Record<string, string>
    ): Promise<string | null> => {
      setIsSaving(true)
      try {
        const fullContent = buildFullContent(currentOutline.sections, currentExpandedContent)
        const wordCount = calcWordCount(fullContent)

        // 将各章节的扩写内容写入 outline sections 的 content 字段
        const outlineWithContent: Outline = {
          ...currentOutline,
          sections: currentOutline.sections.map(s => ({
            ...s,
            content: currentExpandedContent[s.id] ?? s.content,
          })),
        }

        if (currentArticleId === null) {
          // 创建草稿
          const res = await fetch('/api/articles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: currentTitle,
              outline: outlineWithContent,
              status: 'draft',
            }),
          })
          const json = await res.json()
          if (!json.success) {
            console.warn('[useArticleEditor] 创建文章失败:', json.error?.message)
            return null
          }
          const newId: string = json.data.id
          setArticleId(newId)
          return newId
        } else {
          // 更新已有文章
          const res = await fetch(`/api/articles/${currentArticleId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: currentTitle,
              outline: outlineWithContent,
              content: fullContent,
              status: fullContent.length > 0 ? 'completed' : 'draft',
              wordCount,
            }),
          })
          const json = await res.json()
          if (!json.success) {
            console.warn('[useArticleEditor] 更新文章失败:', json.error?.message)
          }
          return currentArticleId
        }
      } catch (err) {
        console.warn('[useArticleEditor] 保存文章时发生网络错误:', err)
        return currentArticleId
      } finally {
        setIsSaving(false)
      }
    },
    []
  )

  // ─────────────────────────────────────────────────────────────
  // loadArticle — 从数据库加载已有文章，恢复所有状态
  // ─────────────────────────────────────────────────────────────
  const loadArticle = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/articles/${id}`)
      const json = await res.json()
      if (!json.success) {
        throw new Error(json.error?.message ?? '加载文章失败')
      }
      const article = json.data

      setArticleId(article.id)

      if (article.title) {
        setSelectedTitle(article.title)
      }

      if (article.outline) {
        const loadedOutline: Outline = article.outline
        setOutline(loadedOutline)

        // 从 outline 中各 section 的 content 字段恢复 expandedContent
        const restored: Record<string, string> = {}
        for (const section of loadedOutline.sections) {
          if (section.content) {
            restored[section.id] = section.content
          }
        }
        setExpandedContent(restored)

        // 根据是否有内容决定步骤
        const hasContent = Object.keys(restored).length > 0
        setStep(hasContent ? 'writing' : 'outline')
      }
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ─────────────────────────────────────────────────────────────
  // generateTitles — 调用 /api/generate/titles
  // ─────────────────────────────────────────────────────────────
  const generateTitles = useCallback(async () => {
    if (!topic.trim()) {
      setError('请先输入文章主题')
      return
    }
    setIsGeneratingTitles(true)
    setError(null)
    try {
      const res = await fetch('/api/generate/titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), audience: audience.trim() || undefined }),
      })
      const json = await res.json()
      if (!json.success) {
        throw new Error(json.error?.message ?? '标题生成失败')
      }
      setTitles(json.data.titles)
      setStep('titles')
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setIsGeneratingTitles(false)
    }
  }, [topic, audience])

  // ─────────────────────────────────────────────────────────────
  // selectTitle — 选择标题后自动进入大纲步骤
  // ─────────────────────────────────────────────────────────────
  const selectTitle = useCallback(
    async (title: string) => {
      setSelectedTitle(title)
      setCustomTitle('')
      setStep('outline')
      // 选中后立即生成大纲（使用选中标题）
      setIsGeneratingOutline(true)
      setError(null)
      try {
        const res = await fetch('/api/generate/outline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, length: outlineLength }),
        })
        const json = await res.json()
        if (!json.success) {
          throw new Error(json.error?.message ?? '大纲生成失败')
        }
        setOutline(json.data.outline)
      } catch (err) {
        setError(extractErrorMessage(err))
      } finally {
        setIsGeneratingOutline(false)
      }
    },
    [outlineLength]
  )

  // ─────────────────────────────────────────────────────────────
  // generateOutline — 重新生成大纲，生成成功后自动保存
  // ─────────────────────────────────────────────────────────────
  const generateOutline = useCallback(async () => {
    const effectiveTitle = (customTitle.trim() || selectedTitle).trim()
    if (!effectiveTitle) {
      setError('请先选择或输入标题')
      return
    }
    setIsGeneratingOutline(true)
    setError(null)
    try {
      const res = await fetch('/api/generate/outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: effectiveTitle, length: outlineLength }),
      })
      const json = await res.json()
      if (!json.success) {
        throw new Error(json.error?.message ?? '大纲生成失败')
      }
      const newOutline: Outline = json.data.outline
      setOutline(newOutline)

      // 大纲生成成功后自动保存（使用当前 articleId）
      setArticleId(prev => {
        // 异步保存，不等待结果，不影响主流程
        saveArticle(prev, effectiveTitle, newOutline, {}).then(savedId => {
          if (savedId !== null && prev === null) {
            setArticleId(savedId)
          }
        })
        return prev
      })
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setIsGeneratingOutline(false)
    }
  }, [customTitle, selectedTitle, outlineLength, saveArticle])

  // ─────────────────────────────────────────────────────────────
  // expandSection — 调用 /api/generate/expand，处理 SSE 流
  //                 完成后自动保存到数据库
  // ─────────────────────────────────────────────────────────────
  const expandSection = useCallback(
    async (section: OutlineSection) => {
      const { id, title, points } = section
      if (expandingSections.has(id)) return

      // 初始化该 section 的 agent 状态
      setAgentStatus(prev => ({
        ...prev,
        [id]: defaultAgentStatus(),
      }))
      setExpandedContent(prev => ({ ...prev, [id]: '' }))
      setExpandingSections(prev => new Set(prev).add(id))

      try {
        const res = await fetch('/api/generate/expand', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sectionTitle: title, sectionPoints: points }),
        })

        if (!res.ok || !res.body) {
          throw new Error('扩写请求失败，请重试')
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          // 最后一行可能不完整，保留在 buffer 中
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith('data:')) continue
            const raw = trimmed.slice(5).trim()
            if (!raw || raw === '[DONE]') continue

            let event: Record<string, unknown>
            try {
              event = JSON.parse(raw)
            } catch {
              continue
            }

            switch (event.type) {
              case 'agent_status': {
                const agent = event.agent as keyof SectionAgentStatus
                const status = event.status as AgentPhase
                updateAgentStatus(id, { [agent]: status })
                break
              }
              case 'text_delta': {
                const content = event.content as string
                setExpandedContent(prev => ({
                  ...prev,
                  [id]: (prev[id] ?? '') + content,
                }))
                break
              }
              case 'done': {
                // 全部 agent 标记 done
                updateAgentStatus(id, { research: 'done', write: 'done', review: 'done' })
                break
              }
              case 'error': {
                throw new Error((event.message as string) ?? '扩写出错')
              }
              case 'quality_warning': {
                // 非阻塞警告，暂不处理
                break
              }
            }
          }
        }

        // 扩写完成后自动保存（读取最新的 expandedContent 和 outline 快照）
        setExpandedContent(latestContent => {
          setOutline(latestOutline => {
            setArticleId(latestArticleId => {
              if (latestOutline !== null) {
                const effectiveTitle = (customTitle.trim() || selectedTitle).trim()
                saveArticle(latestArticleId, effectiveTitle, latestOutline, latestContent).then(
                  savedId => {
                    if (savedId !== null && latestArticleId === null) {
                      setArticleId(savedId)
                    }
                  }
                )
              }
              return latestArticleId
            })
            return latestOutline
          })
          return latestContent
        })
      } catch (err) {
        updateAgentStatus(id, { research: 'failed', write: 'failed', review: 'failed' })
        setError(extractErrorMessage(err))
      } finally {
        setExpandingSections(prev => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      }
    },
    [expandingSections, updateAgentStatus, customTitle, selectedTitle, saveArticle]
  )

  // ─────────────────────────────────────────────────────────────
  // expandAll — 并行扩写所有章节（Promise.all）
  // ─────────────────────────────────────────────────────────────
  const expandAll = useCallback(async () => {
    if (!outline) return
    setStep('writing')
    await Promise.all(outline.sections.map(section => expandSection(section)))
  }, [outline, expandSection])

  // ─────────────────────────────────────────────────────────────
  // 大纲编辑操作（全部不可变）
  // ─────────────────────────────────────────────────────────────
  const updateSection = useCallback((id: string, updates: Partial<OutlineSection>) => {
    setOutline(prev => {
      if (!prev) return prev
      return {
        ...prev,
        sections: prev.sections.map(s => (s.id === id ? { ...s, ...updates } : s)),
      }
    })
  }, [])

  const updateExpandedContent = useCallback((id: string, content: string) => {
    setExpandedContent(prev => ({ ...prev, [id]: content }))
  }, [])

  const addSection = useCallback(() => {
    const newSection: OutlineSection = {
      id: genId(),
      title: '新章节',
      points: ['在此添加要点'],
    }
    setOutline(prev => {
      if (!prev) return prev
      return { ...prev, sections: [...prev.sections, newSection] }
    })
  }, [])

  const removeSection = useCallback((id: string) => {
    setOutline(prev => {
      if (!prev) return prev
      return { ...prev, sections: prev.sections.filter(s => s.id !== id) }
    })
  }, [])

  const reorderSections = useCallback((sections: OutlineSection[]) => {
    setOutline(prev => {
      if (!prev) return prev
      return { ...prev, sections }
    })
  }, [])

  return {
    // 状态
    step,
    topic,
    audience,
    titles,
    selectedTitle,
    customTitle,
    outlineLength,
    outline,
    expandedContent,
    agentStatus,
    isGeneratingTitles,
    isGeneratingOutline,
    expandingSections,
    error,
    articleId,
    isSaving,
    isLoading,

    // Setters
    setTopic,
    setAudience,
    setSelectedTitle,
    setCustomTitle,
    setOutlineLength,
    setStep,
    clearError,

    // Actions
    generateTitles,
    selectTitle,
    generateOutline,
    expandSection,
    expandAll,
    updateSection,
    updateExpandedContent,
    addSection,
    removeSection,
    reorderSections,
    loadArticle,
  }
}
