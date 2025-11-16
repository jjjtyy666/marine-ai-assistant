/**
 * AI 聊天服務
 * 整合多種 AI 提供者（OpenAI、Anthropic、DeepSeek、自訂 API）
 */

import { AI_CONFIG, validateAIConfig, type AIProvider } from '@/config/ai'
import type { ChatMessage, ToolCall } from '@/types'

interface AIChatRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system'
    content: string
  }>
  tools?: any[]
  tool_choice?: 'auto' | 'none' | { type: 'function'; function: { name: string } }
}

interface AIChatResponse {
  content: string
  toolCalls?: ToolCall[]
}

/**
 * 轉換聊天訊息格式為 AI API 格式
 */
function formatMessagesForAI(messages: ChatMessage[]): Array<{ role: 'user' | 'assistant' | 'system'; content: string }> {
  return messages.map(msg => ({
    role: msg.role,
    content: msg.content,
  }))
}

/**
 * 使用 OpenAI API
 */
async function callOpenAI(messages: Array<{ role: string; content: string }>): Promise<AIChatResponse> {
  const { apiKey, baseURL, model } = AI_CONFIG.openai
  
  const response = await fetch(`${baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    }),
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }))
    throw new Error(`OpenAI API 錯誤: ${error.error?.message || response.statusText}`)
  }
  
  const data = await response.json()
  const content = data.choices[0]?.message?.content || ''
  
  return { content }
}

/**
 * 使用 Anthropic (Claude) API
 */
async function callAnthropic(messages: Array<{ role: string; content: string }>): Promise<AIChatResponse> {
  const { apiKey, model } = AI_CONFIG.anthropic
  
  // Anthropic API 需要特殊格式
  const systemMessage = messages.find(m => m.role === 'system')
  const conversationMessages = messages.filter(m => m.role !== 'system')
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 2000,
      system: systemMessage?.content || '你是一個專業的海洋活動助理，專門協助使用者規劃海洋活動與行程。',
      messages: conversationMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      })),
    }),
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }))
    throw new Error(`Anthropic API 錯誤: ${error.error?.message || response.statusText}`)
  }
  
  const data = await response.json()
  const content = data.content[0]?.text || ''
  
  return { content }
}

/**
 * 使用 DeepSeek API（支援本地和遠端）
 */
async function callDeepSeek(messages: Array<{ role: string; content: string }>): Promise<AIChatResponse> {
  const { apiKey, baseURL, model, isLocal } = AI_CONFIG.deepseek
  
  // 準備請求標頭
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  // 本地 API 可能不需要 Authorization，或使用不同的認證方式
  if (!isLocal && apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`
  } else if (isLocal && apiKey) {
    // 本地 API 可能使用不同的認證方式，例如簡單的 API Key header
    headers['Authorization'] = `Bearer ${apiKey}`
  }
  
  const response = await fetch(`${baseURL}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    }),
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }))
    throw new Error(`DeepSeek API 錯誤: ${error.error?.message || response.statusText}`)
  }
  
  const data = await response.json()
  const content = data.choices[0]?.message?.content || ''
  
  return { content }
}

/**
 * 使用自訂 AI API
 */
async function callCustomAPI(messages: Array<{ role: string; content: string }>): Promise<AIChatResponse> {
  const { apiURL, apiKey } = AI_CONFIG.custom
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`
  }
  
  const response = await fetch(apiURL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      messages,
    }),
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }))
    throw new Error(`自訂 AI API 錯誤: ${error.error?.message || response.statusText}`)
  }
  
  const data = await response.json()
  
  // 自訂 API 應該返回 { content: string, toolCalls?: ToolCall[] }
  return {
    content: data.content || '',
    toolCalls: data.toolCalls,
  }
}

/**
 * 發送聊天訊息到 AI 服務
 */
export async function sendAIMessage(
  message: string,
  history: ChatMessage[]
): Promise<AIChatResponse> {
  // 驗證配置
  const validation = validateAIConfig()
  if (!validation.valid) {
    throw new Error(validation.error)
  }
  
  // 準備訊息
  const messages = formatMessagesForAI(history)
  messages.push({
    role: 'user',
    content: message,
  })
  
  // 根據提供者調用對應的 API
  const { provider } = AI_CONFIG
  
  try {
    switch (provider) {
      case 'openai':
        return await callOpenAI(messages)
      case 'anthropic':
        return await callAnthropic(messages)
      case 'deepseek':
        return await callDeepSeek(messages)
      case 'custom':
        return await callCustomAPI(messages)
      default:
        throw new Error(`不支援的 AI 提供者: ${provider}`)
    }
  } catch (error) {
    console.error('AI 服務錯誤:', error)
    throw error
  }
}

