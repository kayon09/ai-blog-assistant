/**
 * Multi-Agent 扩写引擎 — 三个 Agent 的 Prompt 模板
 * src/lib/prompts/expand-agents.ts
 *
 * 对应评估标准：docs/prompts/eval_criteria.md
 */

// ============================================================
// Research Agent Prompt
// ============================================================
export function buildResearchPrompt(sectionTitle: string, sectionPoints: string[]): string {
  const points = sectionPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')
  return `你是一位专业研究员，擅长为博客文章提供精准的数据支撑。

当前需要扩写的章节：
标题：${sectionTitle}
要点：
${points}

请提供 3-5 条与本章节高度相关的客观事实、数据或典型案例，要求：
1. 每条数据来源类型清晰（行业报告/学术研究/权威媒体/真实案例）
2. 优先选择近 3 年内的信息
3. 避免宽泛的常识，要具体可引用（包含数字、比例、机构名等）
4. 每条数据能直接支撑上述要点中的某一条

严格按以下 JSON 格式输出，不要有任何额外文字：
{
  "evidence": [
    {
      "fact": "具体数据或事实描述",
      "source_type": "行业报告|学术研究|权威媒体|真实案例",
      "supports_point": "支撑的要点编号（如 1 或 2）"
    }
  ]
}`
}

// ============================================================
// Writer Agent Prompt
// ============================================================
export function buildWriterPrompt(
  sectionTitle: string,
  sectionPoints: string[],
  evidence: string,
  styleCard: string | null,
  feedback: string | null,
  wordCount: number = 400
): string {
  const points = sectionPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')
  const styleSection = styleCard
    ? `\n## 作者风格要求\n以下是该作者的写作风格特征，请严格遵循：\n${styleCard}\n`
    : '\n## 写作风格\n请使用专业、清晰、易读的中文博客风格，避免过于学术或过于口语化。\n'
  const feedbackSection = feedback
    ? `\n## 上一稿主编反馈（必须针对性改进）\n${feedback}\n`
    : ''

  return `你是一位专业博客撰稿人。请将以下大纲章节扩写为完整、高质量的博客段落。
${styleSection}${feedbackSection}
## 本章节信息
标题：${sectionTitle}
要点：
${points}

## Research Agent 提供的数据支撑
${evidence}

## 写作要求
1. 字数：${wordCount} 字左右（允许 ±20%）
2. 覆盖全部要点，无遗漏
3. 自然融入上述数据，不要生硬堆砌
4. 开篇吸引人，结尾有总结或引导
5. 段落间有清晰的逻辑过渡
6. 直接输出正文内容，不要加章节标题或序号`
}

// ============================================================
// Reviewer Agent Prompt（对应 eval_criteria.md 的 5 个维度）
// ============================================================
export function buildReviewerPrompt(
  sectionPoints: string[],
  draft: string,
  styleCard: string | null
): string {
  const points = sectionPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')
  const styleNote = styleCard
    ? `用户提供了风格卡片（见下），请严格对照评审维度 4。\n风格卡片：${styleCard}`
    : '用户未提供风格卡片，维度 4 仅检查全文语气内部一致性（标准：≥ 4 分）。'

  return `你是一位资深博客主编，负责审核 AI 生成内容的质量。

## 原始大纲要点
${points}

## 待审核初稿
${draft}

## 风格说明
${styleNote}

## 评审任务
请从以下 5 个维度逐项评分（1-5分），并给出具体反馈：

1. 大纲覆盖度（outline_coverage）：是否覆盖了全部要点？
   - 5=全部覆盖 4=覆盖80%+ 3=覆盖60% 2=<60% 1=严重偏题
   - 不合格阈值：< 4

2. 数据支撑充分性（evidence_quality）：数据是否被有效融入？
   - 5=融合自然有力 4=引用但略生硬 3=部分引用 2=几乎未用 1=无数据或错误
   - 不合格阈值：< 3

3. 逻辑流畅度（logical_flow）：段落内外逻辑是否连贯？
   - 5=流畅自然 4=整体流畅偶有瑕疵 3=有明显跳跃 2=多处断层 1=堆砌无逻辑
   - 不合格阈值：< 4

4. 风格一致性（style_consistency）：语气、用词、句式是否符合要求？
   - 5=高度吻合 4=整体吻合 3=部分吻合 2=差异明显 1=完全忽略
   - 不合格阈值：< 3（有风格卡片）or < 4（无风格卡片）

5. 内容合规性（compliance）：是否有政治敏感、违规词、虚假信息？
   - 5=完全合规 4=无违规但有歧义措辞 3=有模糊地带 2=有明确违规 1=严重违规
   - 不合格阈值：< 4（合规问题直接终止，不重写）

## 判定规则
- 全部维度达标 → approved: true
- 任一维度不合格 → approved: false，并输出具体可执行的修改意见
- 合规维度(5) < 4 → compliance_error: true（特殊终止）

严格按以下 JSON 格式输出，不要有任何额外文字：

通过时：
{"approved":true,"scores":{"outline_coverage":5,"evidence_quality":4,"logical_flow":4,"style_consistency":5,"compliance":5},"content":"完整的审核通过正文"}

拒绝时：
{"approved":false,"scores":{"outline_coverage":3,"evidence_quality":4,"logical_flow":2,"style_consistency":4,"compliance":5},"feedback":[{"dimension":"outline_coverage","issue":"具体问题描述","action":"writer_rewrite","instruction":"给Writer Agent的具体改写指令"},{"dimension":"logical_flow","issue":"具体问题描述","action":"writer_rewrite","instruction":"给Writer Agent的具体改写指令"}],"reassign_research":false}

合规终止时：
{"approved":false,"compliance_error":true,"scores":{"outline_coverage":4,"evidence_quality":4,"logical_flow":4,"style_consistency":4,"compliance":2},"feedback":[{"dimension":"compliance","issue":"具体违规描述","action":"terminate","instruction":"向用户提示修改建议"}]}`
}
