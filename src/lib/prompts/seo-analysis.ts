/**
 * SEO 关键词分析 Prompt（F06）
 * src/lib/prompts/seo-analysis.ts
 */

/**
 * 构建 SEO 关键词分析 Prompt
 *
 * @param title - 文章标题
 * @param content - 文章正文内容
 * @returns 完整的 Prompt 字符串
 */
export function buildSeoPrompt(title: string, content: string): string {
  return `你是一位专业的中文 SEO 顾问，擅长分析博客文章的关键词分布并提供优化建议。

请分析以下文章的 SEO 表现，给出关键词报告和优化建议。

文章标题：${title}

文章内容：
---
${content}
---

分析要求：
1. **coreKeywords**：找出文章中已有的 3-8 个核心关键词（包括标题中的词）
   - word：关键词本身
   - currentCount：该词在全文（标题+正文）中出现的实际次数
   - suggestedCount：建议出现次数（基于文章长度和SEO最佳实践，密度 1%-3% 为宜）
   - importance：重要性，"high"（与主题高度相关）、"medium"（辅助关键词）、"low"（长尾词）

2. **missingKeywords**：根据文章主题和标题，列出 3-6 个目前缺失但对 SEO 有价值的词，
   这些词应该是读者搜索此类内容时可能使用的词语。

3. **suggestions**：提供 3-5 条具体、可操作的 SEO 优化建议，例如：
   - 关键词在哪些位置需要补充（开头段落、小标题、结尾等）
   - 哪些关键词出现频次过高或过低需要调整
   - 内部链接、元描述、alt 标签等结构性建议
   - 标题和子标题的优化方向

严格按以下 JSON 格式输出，不要有任何额外文字、注释或 markdown 代码块：
{
  "coreKeywords": [
    { "word": "关键词", "currentCount": 3, "suggestedCount": 5, "importance": "high" }
  ],
  "missingKeywords": ["建议加入的词1", "建议加入的词2"],
  "suggestions": ["优化建议1", "优化建议2", "优化建议3"]
}`
}
