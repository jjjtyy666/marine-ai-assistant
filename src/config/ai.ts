/**
 * AI 服務配置
 * 支援多種 AI 提供者：OpenAI、Anthropic、DeepSeek、自訂 API
 */

export type AIProvider = 'openai' | 'anthropic' | 'deepseek' | 'custom'

export const AI_CONFIG = {
  provider: (import.meta.env.VITE_AI_PROVIDER || 'openai') as AIProvider,
  
  // OpenAI 配置
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    baseURL: import.meta.env.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1',
    model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini',
  },
  
  // Anthropic 配置
  anthropic: {
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
    model: import.meta.env.VITE_ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
  },
  
  // DeepSeek 配置
  deepseek: {
    apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
    baseURL: import.meta.env.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
    model: import.meta.env.VITE_DEEPSEEK_MODEL || 'deepseek-reasoner',
    // 是否為本地 API（本地 API 可能不需要 API Key）
    isLocal: import.meta.env.VITE_DEEPSEEK_IS_LOCAL === 'true',
  },
  
  // 自訂 AI API 配置
  custom: {
    apiURL: import.meta.env.VITE_CUSTOM_AI_API_URL || 'http://localhost:8000/api/chat',
    apiKey: import.meta.env.VITE_CUSTOM_AI_API_KEY || '',
  },
} as const

/**
 * 檢查 AI 配置是否完整
 */
export function validateAIConfig(): { valid: boolean; error?: string } {
  const { provider } = AI_CONFIG
  
  if (provider === 'openai') {
    if (!AI_CONFIG.openai.apiKey) {
      return { valid: false, error: 'OpenAI API Key 未設定，請在 .env 檔案中設定 VITE_OPENAI_API_KEY' }
    }
  } else if (provider === 'anthropic') {
    if (!AI_CONFIG.anthropic.apiKey) {
      return { valid: false, error: 'Anthropic API Key 未設定，請在 .env 檔案中設定 VITE_ANTHROPIC_API_KEY' }
    }
  } else if (provider === 'deepseek') {
    // 本地 API 可能不需要 API Key
    if (!AI_CONFIG.deepseek.isLocal && !AI_CONFIG.deepseek.apiKey) {
      return { valid: false, error: 'DeepSeek API Key 未設定，請在 .env 檔案中設定 VITE_DEEPSEEK_API_KEY，或設定 VITE_DEEPSEEK_IS_LOCAL=true 使用本地 API' }
    }
  } else if (provider === 'custom') {
    if (!AI_CONFIG.custom.apiURL) {
      return { valid: false, error: '自訂 AI API URL 未設定，請在 .env 檔案中設定 VITE_CUSTOM_AI_API_URL' }
    }
  }
  
  return { valid: true }
}

