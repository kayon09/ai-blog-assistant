/**
 * 全文润色 Prompt（F05）
 * src/lib/prompts/polish-generation.ts
 */

export type PolishIntensity = 'light' | 'medium' | 'deep'

const INTENSITY_INSTRUCTION: Record<PolishIntensity, string> = {
  light: `【轻度润色】
- 仅修正明显的语病、错别字和标点错误
- 完整保留原文的写作风格、用词习惯和句式结构
- 不改变段落顺序，不增删内容
- 改动范围控制在 10% 以内`,

  medium: `【中度润色】
- 优化句子流畅度，消除读起来拗口或重复的表达
- 改善段落间的衔接和过渡，让行文更连贯
- 统一全文语气（保持口语化或书面化风格一致）
- 不改变文章的核心内容、观点和结构
- 改动范围控制在 30% 以内`,

  deep: `【深度润色】
- 全面优化语言表达，大幅提升可读性和吸引力
- 重写冗长、晦涩或结构混乱的句子
- 强化段落间的逻辑递进和叙述节奏
- 确保标题呼应、开篇吸引、结尾有力
- 保留文章的核心主旨、事实数据和关键观点
- 允许对语言层面进行深度改写，改动范围可达 60%`,
}

/**
 * 构建全文润色 Prompt
 *
 * @param content - 待润色的文章内容
 * @param intensity - 润色强度：light（轻度）| medium（中度）| deep（深度）
 * @returns 完整的 Prompt 字符串
 */
export function buildPolishPrompt(content: string, intensity: PolishIntensity): string {
  const instruction = INTENSITY_INSTRUCTION[intensity]

  return `你是一位专业的中文内容编辑，擅长润色博客文章，让文字更流畅、更有感染力。

请按照以下润色策略对文章进行修改：

${instruction}

润色维度（按优先级排序）：
1. 语言流畅度：消除语病、读起来顺口自然
2. 句子长度多样性：短句（冲击力）和长句（展开论述）交替搭配，避免单调
3. 段落衔接：每段开头与上一段形成自然的过渡，层层递进
4. 语气统一：全文保持一致的情感基调（专业、亲切、激励等，以原文为准）

待润色文章：
---
${content}
---

要求：
- 直接输出润色后的完整文章内容
- 不要添加任何说明、注释或"润色说明："之类的前缀
- 不要使用 markdown 代码块包裹内容
- 保持原文的段落分隔（空行）`
}
