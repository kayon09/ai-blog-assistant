/**
 * 标题生成 Prompt
 * src/lib/prompts/title-generation.ts
 */

export function buildTitlePrompt(topic: string, audience: string = '博主/内容创作者'): string {
  return `你是一位专业的内容策略师，擅长为中文博客创作吸引人的标题。
用户想写关于「${topic}」的博客文章，目标读者是${audience}。

请生成10个吸引人的标题，要求：
1. 每个标题都有明确的钩子（数字、问题、对比、悬念之一）
2. 包含核心关键词「${topic}」
3. 长度控制在15-25字
4. 不同标题覆盖不同角度（实用干货、深度思考、对比分析等）
5. 避免标题党，标题要能兑现文章承诺

严格按以下 JSON 格式输出，不要有其他文字：
{
  "titles": [
    { "title": "标题文字", "reason": "一句话说明为什么有吸引力" }
  ]
}`
}
