# Reviewer Agent 评估标准（eval_criteria）

> 版本 v1.0 · 2026年4月
> 本文件是 Multi-Agent 扩写引擎的"宪法"——先定标准，再写代码。
> Reviewer Agent 的所有判定逻辑必须严格对应此文件中的维度定义。

---

## 一、设计原则

**Reviewer 不是"好/坏"的判官，而是"哪里不足、如何改"的主编。**

- 每次评审必须输出**可执行的修改意见**，而非模糊的评价
- 不合格时必须明确指向**责任 Agent**（Research Agent 补数据 or Writer Agent 改写法）
- 最多允许 **2 轮重写**，避免无限循环

---

## 二、评审维度与评分标准

Reviewer Agent 从以下 **5 个维度**逐项评分，每项 **1-5 分**，总分 25 分。

### 维度 1：大纲覆盖度（Outline Coverage）

**定义**：章节内容是否覆盖了大纲中列出的全部要点，无遗漏、无偏题。

| 分值 | 标准 |
|------|------|
| 5 | 全部要点均有实质性展开，无遗漏 |
| 4 | 覆盖 80% 以上要点，1 个要点略显单薄 |
| 3 | 覆盖 60% 要点，有 1-2 个要点完全缺失 |
| 2 | 不足 60%，或严重偏离大纲主题 |
| 1 | 与大纲几乎无关 |

**不合格阈值**：< 4 分
**责任方**：Writer Agent（重新扩写时加强对要点的覆盖）

---

### 维度 2：数据支撑充分性（Evidence Quality）

**定义**：Research Agent 提供的事实/数据是否被有效融入文章，且引用自然不突兀。

| 分值 | 标准 |
|------|------|
| 5 | 数据与论点紧密结合，引用自然，增强说服力 |
| 4 | 数据被引用，但融合略显生硬 |
| 3 | 只引用了部分数据，或数据与论点关联弱 |
| 2 | 数据几乎未被使用，或引用方式像"搬运" |
| 1 | 完全没有数据支撑，或数据错误 |

**不合格阈值**：< 3 分
**责任方**：
- 数据不够用 → **Research Agent** 补充更多事实（指定章节方向）
- 数据有但融合差 → **Writer Agent** 改写融合方式

---

### 维度 3：逻辑流畅度（Logical Flow）

**定义**：段落内部和段落之间的逻辑是否连贯，论点→论据→结论的链条是否清晰。

| 分值 | 标准 |
|------|------|
| 5 | 行文流畅，论点清晰，段落间有自然过渡 |
| 4 | 整体流畅，个别句子转折略显突兀 |
| 3 | 有明显跳跃，2 处以上缺乏过渡 |
| 2 | 多处逻辑断层，读者需要"脑补"才能理解 |
| 1 | 段落堆砌，几乎没有逻辑连接 |

**不合格阈值**：< 4 分
**责任方**：Writer Agent（重写时提供明确的逻辑问题位置）

---

### 维度 4：风格一致性（Style Consistency）

**定义**：生成内容与用户"风格卡片"的匹配程度（无风格卡片时，检查全文语气统一性）。

| 分值 | 标准 |
|------|------|
| 5 | 语气、用词、句式高度符合风格卡片描述 |
| 4 | 整体风格吻合，偶有出入 |
| 3 | 风格部分吻合，有明显偏离段落 |
| 2 | 风格差异明显，与参考文章相比判若两人 |
| 1 | 完全忽略风格要求，输出通用模板化内容 |

**不合格阈值**：< 3 分（有风格卡片时）/ < 4 分（无风格卡片，检查内部一致性）
**责任方**：Writer Agent（重写时在 Prompt 中强调具体偏离的风格特征）

---

### 维度 5：内容合规性（Compliance）

**定义**：内容是否触碰合规红线（政治敏感、违规词、虚假信息、侵权风险）。

| 分值 | 标准 |
|------|------|
| 5 | 完全合规，无任何风险词 |
| 4 | 无明显违规，有 1 处措辞可能引发歧义（建议修改） |
| 3 | 有模糊地带，需要修改才能发布 |
| 2 | 有明确违规内容，必须删改 |
| 1 | 严重违规，直接拒绝输出 |

**不合格阈值**：< 4 分
**责任方**：特殊处理——不打回重写，直接向前端返回合规错误，触发 moderation_log 记录

---

## 三、通过/拒绝判定规则

```
通过条件（全部满足）：
  ✅ 维度 1（大纲覆盖度）≥ 4
  ✅ 维度 2（数据支撑）  ≥ 3
  ✅ 维度 3（逻辑流畅度）≥ 4
  ✅ 维度 4（风格一致性）≥ 3（有卡片）or ≥ 4（无卡片）
  ✅ 维度 5（内容合规性）≥ 4

特殊规则：
  ❌ 维度 5 < 4 → 立即终止，不重写，返回合规错误
  ❌ 连续 2 轮未通过 → 终止循环，返回最优一轮结果 + 警告标注
```

---

## 四、Reviewer Agent 输出格式规范

Reviewer 的输出必须严格符合以下 JSON 结构（代码中用 Zod 校验）：

```typescript
// 通过时
{
  "approved": true,
  "scores": {
    "outline_coverage": 5,
    "evidence_quality": 4,
    "logical_flow": 4,
    "style_consistency": 5,
    "compliance": 5
  },
  "content": "（审核通过的最终正文）"
}

// 拒绝时
{
  "approved": false,
  "scores": {
    "outline_coverage": 3,   // 不合格项
    "evidence_quality": 4,
    "logical_flow": 2,       // 不合格项
    "style_consistency": 4,
    "compliance": 5
  },
  "feedback": [
    {
      "dimension": "outline_coverage",
      "issue": "要点「{具体要点}」完全未展开",
      "action": "writer_rewrite",
      "instruction": "重写时请在第二段专门展开此要点，至少100字"
    },
    {
      "dimension": "logical_flow",
      "issue": "第三段到第四段缺少过渡，读者无法理解为何话题突然转换",
      "action": "writer_rewrite",
      "instruction": "在第三段末尾添加1-2句承上启下的过渡句"
    }
  ],
  "reassign_research": false  // 是否需要 Research Agent 补充数据
}

// 合规错误（特殊，直接终止）
{
  "approved": false,
  "compliance_error": true,
  "scores": { "compliance": 2 },
  "feedback": [
    {
      "dimension": "compliance",
      "issue": "第二段包含可能引发争议的政治类表述",
      "action": "terminate",
      "instruction": "不重写，直接终止并向用户提示修改主题"
    }
  ]
}
```

---

## 五、状态机流转图

```
用户点击"一键扩写"
        │
        ▼
  [初始化状态]
  section: OutlineSection
  styleCard: string | null
  round: 0
        │
        ▼
  [RESEARCH] Research Agent
  输入：section.title + section.points
  输出：evidence[]（3-5条事实数据）
  状态：research_done = true
        │
        ▼
  [WRITE] Writer Agent
  输入：section + evidence + styleCard
  输出：draft（初稿文本）
  状态：draft_v{round}
        │
        ▼
  [REVIEW] Reviewer Agent
  输入：draft + section.points + styleCard
  输出：ReviewResult（见上方 JSON 格式）
        │
    ┌───┴───┐
    │       │
  通过    拒绝
    │       │
    │   round < 2?
    │    ├── 是 → round++ → 回到 [WRITE]
    │    │      （携带 feedback 重写）
    │    └── 否 → 返回最优草稿 + warn 标注
    │
    ▼
  [STREAM] 开始 SSE 流式输出
  同时推送 Agent 状态事件：
  · { type: 'agent_status', agent: 'research', status: 'done' }
  · { type: 'agent_status', agent: 'write', status: 'done', round: 1 }
  · { type: 'agent_status', agent: 'review', status: 'approved' }
  · { type: 'text_delta', content: '...' }  ← 流式正文
```

---

## 六、前端 Agent 状态展示规范

UI 左侧面板实时显示 Agent 工作状态，对应 SSE 事件：

| SSE 事件 | 前端展示文案 |
|----------|------------|
| `research: running` | 🔍 研究员正在收集数据... |
| `research: done` | ✅ 找到 {n} 条数据支撑 |
| `write: running` | ✍️ 撰稿人正在写作（第{round}稿）... |
| `write: done` | ✅ 初稿完成，交主编审核 |
| `review: running` | 🧐 主编正在审核... |
| `review: approved` | ✅ 主编通过，开始输出 |
| `review: rejected` | 🔄 主编打回重写（第{round}轮）|
| `review: max_rounds` | ⚠️ 已达最大轮次，输出最优结果 |
| `compliance_error` | 🚫 内容合规问题，请调整主题 |

---

## 七、已知边界情况处理

| 场景 | 处理方式 |
|------|---------|
| Research Agent 返回空数据 | 跳过数据融合，Writer 使用自身知识扩写，并在 SSE 事件中提示 |
| GLM API 超时（>30s） | 单次调用超时重试 1 次，仍失败则终止并返回 AI_ERROR |
| 第 2 轮仍不通过 | 返回第 1 轮和第 2 轮中总分更高的草稿，附加 `quality_warning: true` |
| 风格卡片为空 | 维度 4 仅检查内部语气一致性，标准降为 ≥ 4 分 |
| 合规维度 < 4 | 立即终止，不计入重写轮次，触发 moderation_log |

---

*维护人：李凯盟 · 最后更新：2026-04-15*
*修改此文件须同步更新 Reviewer Agent 的 Prompt 模板（`src/lib/prompts/expand-review.ts`）*
