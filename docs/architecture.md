# 项目架构决策记录 (ADR)
> 文件：docs/architecture.md
> 更新：2026-04-14

## 技术选型依据

| 层 | 技术 | 选择原因 | 替代方案 | 放弃原因 |
|----|------|---------|---------|---------|
| 前端框架 | Next.js 14 (App Router) | SSR/SSG 兼顾，SEO 友好，全栈一体 | Vite + React | 无 SSR，SEO 弱 |
| 样式 | TailwindCSS | 开发速度快，无运行时开销 | styled-components | 运行时性能差 |
| 组件库 | Shadcn/UI | 无依赖绑定，可复制源码，灵活定制 | MUI/Ant Design | 样式覆盖成本高 |
| 富文本编辑 | Tiptap | 轻量可扩展，未来支持协作 | Quill/Draft.js | 维护不活跃 |
| AI 模型 | Claude 3.5 Sonnet | 中文写作最优，长文本能力强 | GPT-4o | 中文稍逊，价格相近 |
| 流式输出 | Server-Sent Events | 简单，无需 WebSocket，单向够用 | WebSocket | 过重，双向不必要 |
| 数据库 | Supabase (Postgres) | 免费额度充足，Row Level Security | PlanetScale | MySQL 生态弱 |
| 认证 | Clerk | 极速接入，社交登录开箱即用 | NextAuth | 自维护成本高 |
| 部署 | Vercel | Next.js 原厂，Edge Runtime，CI/CD 零配置 | Render | 冷启动慢 |

## 核心架构约束

1. **API Route 薄层原则**：Route Handler 只做参数校验 + 调用 lib/ 层，不写业务逻辑。
2. **Prompt 集中管理**：所有 Prompt 在 `src/lib/prompts/` 统一维护，便于迭代优化。
3. **流式响应**：所有文本生成类接口必须使用 SSE 流式返回，禁止等全文生成完再返回。
4. **额度控制前置**：在 AI 调用前检查用量，超额直接返回 `QUOTA_EXCEEDED`，不浪费 API 调用。
