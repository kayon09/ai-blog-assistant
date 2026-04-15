/**
 * 大纲生成 Prompt
 * src/lib/prompts/outline-generation.ts
 */

export type OutlineLength = 'short' | 'medium' | 'long'

const LENGTH_LABELS: Record<OutlineLength, string> = {
  short: '短文（约1000字）',
  medium: '中等（约2000字）',
  long: '长文（约3000字）',
}

const SECTION_COUNT: Record<OutlineLength, string> = {
  short: '3个',
  medium: '4-5个',
  long: '5-6个',
}

export function buildOutlinePrompt(title: string, length: OutlineLength = 'medium'): string {
  return `你是一位专业的内容架构师，擅长为中文博客设计清晰的文章结构。

请基于以下标题，生成一篇${LENGTH_LABELS[length]}的专业博客大纲：
标题：${title}

要求：
1. 包含引言、${SECTION_COUNT[length]}主章节、结论
2. 每个主章节包含 2-3 个具体子要点
3. 章节之间逻辑递进，有清晰的叙述线索
4. 子要点应具体可扩写，避免空洞的短语

严格按以下 JSON 格式输出，不要有任何额外文字：
{
  "intro": "引言的核心主旨（一句话）",
  "sections": [
    {
      "id": "section-1",
      "title": "章节标题",
      "points": ["具体子要点1", "具体子要点2", "具体子要点3"]
    }
  ],
  "conclusion": "结论的核心主旨（一句话）"
}`
}
