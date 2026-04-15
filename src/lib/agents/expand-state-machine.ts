/**
 * Multi-Agent 扩写状态机
 * src/lib/agents/expand-state-machine.ts
 *
 * 状态流转：RESEARCH → WRITE → REVIEW → (WRITE → REVIEW)? → STREAM
 * 对应文档：docs/prompts/eval_criteria.md
 */
import { z } from 'zod'
import { glmClient, MODEL_WRITER, MODEL_RESEARCH } from '@/lib/api/anthropic'
import {
  buildResearchPrompt,
  buildWriterPrompt,
  buildReviewerPrompt,
} from '@/lib/prompts/expand-agents'

// ============================================================
// 类型定义
// ============================================================

export interface ExpandInput {
  sectionTitle: string
  sectionPoints: string[]
  styleCard: string | null
  wordCount?: number
}

export type AgentName = 'research' | 'write' | 'review'
export type AgentStatus = 'idle' | 'running' | 'done' | 'failed'

export type SSEEvent =
  | { type: 'agent_status'; agent: AgentName; status: AgentStatus; detail?: string }
  | { type: 'text_delta'; content: string }
  | { type: 'done'; totalTokens: number }
  | { type: 'error'; code: string; message: string }
  | { type: 'quality_warning'; message: string }

// Zod Schema：Review 输出校验
const ReviewFeedbackSchema = z.object({
  dimension: z.string(),
  issue: z.string(),
  action: z.enum(['writer_rewrite', 'terminate']),
  instruction: z.string(),
})

const ReviewResultSchema = z.discriminatedUnion('approved', [
  z.object({
    approved: z.literal(true),
    scores: z.record(z.string(), z.number()),
    content: z.string().min(1),
  }),
  z.object({
    approved: z.literal(false),
    compliance_error: z.boolean().optional(),
    scores: z.record(z.string(), z.number()),
    feedback: z.array(ReviewFeedbackSchema),
    reassign_research: z.boolean().optional(),
  }),
])

export type ReviewResult = z.infer<typeof ReviewResultSchema>

// Zod Schema：Research 输出校验
const ResearchResultSchema = z.object({
  evidence: z.array(
    z.object({
      fact: z.string(),
      source_type: z.string(),
      supports_point: z.string(),
    })
  ).min(1).max(8),
})

// ============================================================
// 状态机主函数
// ============================================================

export async function* runExpandStateMachine(
  input: ExpandInput,
  onTokens: (input: number, output: number) => void
): AsyncGenerator<SSEEvent> {
  const { sectionTitle, sectionPoints, styleCard, wordCount = 400 } = input
  const MAX_ROUNDS = 2

  // --- Phase 1: Research Agent ---
  yield { type: 'agent_status', agent: 'research', status: 'running' }

  let evidenceText = '（研究员未能提供数据，Writer 将使用自身知识扩写）'
  try {
    const researchMsg = await glmClient.messages.create({
      model: MODEL_RESEARCH,
      max_tokens: 800,
      messages: [{ role: 'user', content: buildResearchPrompt(sectionTitle, sectionPoints) }],
    })
    onTokens(researchMsg.usage.input_tokens, researchMsg.usage.output_tokens)

    const rawText = researchMsg.content[0]?.type === 'text' ? researchMsg.content[0].text : ''
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = ResearchResultSchema.safeParse(JSON.parse(jsonMatch[0]))
      if (parsed.success) {
        evidenceText = parsed.data.evidence
          .map((e, i) => `${i + 1}. [${e.source_type}] ${e.fact}（支撑要点 ${e.supports_point}）`)
          .join('\n')
        yield {
          type: 'agent_status',
          agent: 'research',
          status: 'done',
          detail: `找到 ${parsed.data.evidence.length} 条数据支撑`,
        }
      } else {
        yield { type: 'agent_status', agent: 'research', status: 'done', detail: '数据提取异常，使用自身知识' }
      }
    } else {
      yield { type: 'agent_status', agent: 'research', status: 'done', detail: '无结构化数据，使用自身知识' }
    }
  } catch {
    yield { type: 'agent_status', agent: 'research', status: 'failed', detail: '研究阶段超时，跳过' }
  }

  // --- Phase 2 & 3: Write → Review 循环（最多 MAX_ROUNDS 轮）---
  let bestDraft = ''
  let bestScore = -1
  let feedbackForNextRound: string | null = null
  let reassignResearch = false

  for (let round = 1; round <= MAX_ROUNDS; round++) {
    // 若 Reviewer 要求补充数据，Research Agent 再跑一次
    if (reassignResearch && round > 1) {
      yield { type: 'agent_status', agent: 'research', status: 'running', detail: '主编要求补充数据...' }
      try {
        const reMsg = await glmClient.messages.create({
          model: MODEL_RESEARCH,
          max_tokens: 600,
          messages: [{ role: 'user', content: buildResearchPrompt(sectionTitle, sectionPoints) }],
        })
        onTokens(reMsg.usage.input_tokens, reMsg.usage.output_tokens)
        const rt = reMsg.content[0]?.type === 'text' ? reMsg.content[0].text : ''
        const jm = rt.match(/\{[\s\S]*\}/)
        if (jm) {
          const p = ResearchResultSchema.safeParse(JSON.parse(jm[0]))
          if (p.success) {
            const extra = p.data.evidence
              .map((e, i) => `${i + 1}. [${e.source_type}] ${e.fact}`)
              .join('\n')
            evidenceText = evidenceText + '\n（补充数据）\n' + extra
          }
        }
        yield { type: 'agent_status', agent: 'research', status: 'done', detail: '数据已补充' }
      } catch {
        yield { type: 'agent_status', agent: 'research', status: 'failed', detail: '补充数据失败，继续写作' }
      }
      reassignResearch = false
    }

    // Write Agent
    yield {
      type: 'agent_status',
      agent: 'write',
      status: 'running',
      detail: round > 1 ? `第 ${round} 稿（根据主编反馈重写）` : '正在生成初稿',
    }

    let draft = ''
    try {
      const writeMsg = await glmClient.messages.create({
        model: MODEL_WRITER,
        max_tokens: 1200,
        messages: [{
          role: 'user',
          content: buildWriterPrompt(sectionTitle, sectionPoints, evidenceText, styleCard, feedbackForNextRound, wordCount),
        }],
      })
      onTokens(writeMsg.usage.input_tokens, writeMsg.usage.output_tokens)
      draft = writeMsg.content[0]?.type === 'text' ? writeMsg.content[0].text : ''
    } catch {
      yield { type: 'error', code: 'AI_ERROR', message: `第 ${round} 稿写作失败，请重试` }
      return
    }

    yield { type: 'agent_status', agent: 'write', status: 'done', detail: `初稿完成（第 ${round} 稿）` }

    // Reviewer Agent
    yield { type: 'agent_status', agent: 'review', status: 'running' }

    let reviewResult: ReviewResult
    try {
      const reviewMsg = await glmClient.messages.create({
        model: MODEL_WRITER,
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: buildReviewerPrompt(sectionPoints, draft, styleCard),
        }],
      })
      onTokens(reviewMsg.usage.input_tokens, reviewMsg.usage.output_tokens)

      const rawReview = reviewMsg.content[0]?.type === 'text' ? reviewMsg.content[0].text : ''
      const jsonMatch = rawReview.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON in review output')

      const parsed = ReviewResultSchema.safeParse(JSON.parse(jsonMatch[0]))
      if (!parsed.success) throw new Error('Review output schema mismatch')
      reviewResult = parsed.data
    } catch {
      // Reviewer 解析失败，直接接受当前草稿
      yield { type: 'agent_status', agent: 'review', status: 'done', detail: '审核解析异常，接受当前草稿' }
      bestDraft = draft
      break
    }

    // 计算总分（用于选最优草稿）
    const totalScore = Object.values(reviewResult.scores).reduce((a: number, b: number) => a + b, 0)
    if (totalScore > bestScore) {
      bestScore = totalScore
      bestDraft = reviewResult.approved ? reviewResult.content : draft
    }

    if (reviewResult.approved) {
      // ✅ 通过
      yield { type: 'agent_status', agent: 'review', status: 'done', detail: '主编审核通过' }
      bestDraft = reviewResult.content
      break
    }

    // ❌ 不通过：检查合规错误
    if ('compliance_error' in reviewResult && reviewResult.compliance_error) {
      const issue = reviewResult.feedback[0]?.issue ?? '内容存在合规问题'
      yield { type: 'error', code: 'COMPLIANCE_ERROR', message: `内容合规问题：${issue}，请修改主题后重试` }
      return
    }

    // 未到最大轮次：准备重写
    if (round < MAX_ROUNDS) {
      // 提取 feedback 给 Writer
      const feedbackLines = reviewResult.feedback.map(
        (f) => `【${f.dimension}】${f.issue}\n改进建议：${f.instruction}`
      )
      feedbackForNextRound = feedbackLines.join('\n\n')
      reassignResearch = reviewResult.reassign_research ?? false

      yield {
        type: 'agent_status',
        agent: 'review',
        status: 'running',
        detail: `第 ${round} 稿不达标，打回重写`,
      }
    } else {
      // 达到最大轮次，输出最优草稿并标注警告
      yield {
        type: 'agent_status',
        agent: 'review',
        status: 'done',
        detail: '已达最大重写轮次，输出最优结果',
      }
      yield {
        type: 'quality_warning',
        message: '内容经过多轮生成，建议人工检查以下方面：' +
          reviewResult.feedback.map((f) => f.issue).join('；'),
      }
    }
  }

  // --- Phase 4: 流式输出最终内容 ---
  for (const char of bestDraft) {
    yield { type: 'text_delta', content: char }
  }

  yield { type: 'done', totalTokens: 0 } // totalTokens 由调用方通过 onTokens 累计
}
