/**
 * 智谱 GLM API 客户端
 * 兼容 Anthropic SDK，通过自定义 baseURL 接入
 *
 * 修复 M-3：使用工厂函数延迟校验，避免模块顶层 throw 影响 HMR 和构建
 */
import Anthropic from '@anthropic-ai/sdk'

let _client: Anthropic | null = null

/**
 * 获取 GLM 客户端单例（首次调用时初始化，校验环境变量）
 */
function getGlmClient(): Anthropic {
  if (_client) return _client

  const apiKey = process.env.GLM_API_KEY
  if (!apiKey) {
    throw new Error(
      'Missing GLM_API_KEY environment variable. ' +
        'Please add it to your .env.local file. ' +
        'Get your API key at https://open.bigmodel.cn'
    )
  }

  _client = new Anthropic({
    apiKey,
    baseURL: 'https://open.bigmodel.cn/api/anthropic',
  })

  return _client
}

// 主力写作模型（Writer Agent / Reviewer Agent）
export const MODEL_WRITER = 'glm-4.5-air'

// 轻量研究模型（Research Agent，快速低成本）
export const MODEL_RESEARCH = 'glm-4.5-air'

// 导出代理对象：访问任何属性时才触发真正的客户端初始化
export const glmClient = new Proxy({} as Anthropic, {
  get(_target, prop) {
    return (getGlmClient() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

// Token 用量类型
export interface TokenUsage {
  inputTokens: number
  outputTokens: number
}
