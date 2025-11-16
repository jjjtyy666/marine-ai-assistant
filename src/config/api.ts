/**
 * API 配置檔案
 * 管理所有 API 端點和配置
 */

export const API_CONFIG = {
  // 基礎 API URL
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  
  // 是否使用 Mock 資料
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true',
  
  // API 端點
  endpoints: {
    // 地點相關
    spots: '/spots',
    
    // 天氣相關
    weather: '/weather',
    
    // 海況相關
    seaState: '/sea-state',
    
    // 潮汐相關
    tide: '/tide',
    
    // POI 相關
    nearbyPOIs: '/nearby-pois',
    openHours: '/open-hours',
    
    // 行程規劃
    planDay: '/plan-day',
    route: '/route',
    
    // 聊天
    chat: '/chat',
  },
  
  // 請求超時時間（毫秒）
  timeout: 30000,
  
  // 重試配置
  retry: {
    maxRetries: 3,
    retryDelay: 1000,
  },
} as const

/**
 * 取得完整的 API URL
 */
export function getApiUrl(endpoint: string): string {
  const base = API_CONFIG.baseURL.replace(/\/$/, '')
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${base}${path}`
}

/**
 * 建立請求標頭
 */
export function getHeaders(includeAuth = false): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  // 如果需要認證，可以在這裡添加 token
  if (includeAuth) {
    const token = localStorage.getItem('auth_token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  
  return headers
}

