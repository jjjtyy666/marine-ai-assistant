import type { Spot, WeatherData, SeaStateData, TideData, ChatMessage, ToolCall, POI, PlanDay, RouteInfo, Mobility, OpenHoursData } from '@/types'
import { mockSpots } from '@/mocks/spots'
import { getMockWeather } from '@/mocks/weatherData'
import { getMockSeaState } from '@/mocks/seaStateData'
import { getMockTide } from '@/mocks/tideData'
import { getPOIsBySpot, getPOIsByCategory } from '@/mocks/poi'
import { getOpenHours } from '@/mocks/openHours'
import { generateDayPlan } from '@/mocks/planningData'
import { calculateRoute } from '@/lib/planningUtils'
import { API_CONFIG, getApiUrl, getHeaders } from '@/config/api'
import { sendAIMessage } from './aiService'
import { getWeatherByCoordinates } from './weatherService'
import { getSeaStateByCoordinates } from './seaStateService'

// 模擬網路延遲（僅用於 Mock 模式）
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 檢查是否使用 Mock 資料
const useMockData = API_CONFIG.useMockData

/**
 * 發送 API 請求（帶錯誤處理和重試）
 */
async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...getHeaders(),
        ...options?.headers,
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('網路請求失敗')
  }
}

export const api = {
  /**
   * 取得所有地點
   */
  async getSpots(): Promise<Spot[]> {
    if (useMockData) {
      await delay(300)
      return mockSpots
    }

    try {
      return await fetchAPI<Spot[]>(getApiUrl(API_CONFIG.endpoints.spots))
    } catch (error) {
      console.warn('取得地點失敗，使用 Mock 資料:', error)
      return mockSpots
    }
  },

  /**
   * 取得天氣資料
   */
  async getWeather(spotId: string, date?: string): Promise<WeatherData> {
    if (useMockData) {
      await delay(400)
      return getMockWeather(spotId, date || new Date().toISOString())
    }

    try {
      // 優先嘗試使用真實天氣服務
      const useRealWeather = import.meta.env.VITE_USE_REAL_WEATHER === 'true'
      
      if (useRealWeather) {
        // 取得地點座標
        const spots = await this.getSpots()
        const spot = spots.find(s => s.id === spotId)
        
        if (spot && spot.coordinates) {
          const [lat, lng] = spot.coordinates
          const weatherData = await getWeatherByCoordinates(lat, lng, date)
          weatherData.spotId = spotId
          return weatherData
        }
      }

      // 如果沒有使用真實天氣服務，或找不到地點，嘗試後端 API
      const params = new URLSearchParams({ spotId })
      if (date) params.append('date', date)
      return await fetchAPI<WeatherData>(`${getApiUrl(API_CONFIG.endpoints.weather)}?${params}`)
    } catch (error) {
      console.warn('取得天氣資料失敗，使用 Mock 資料:', error)
      return getMockWeather(spotId, date || new Date().toISOString())
    }
  },

  /**
   * 取得海況資料
   */
  async getSeaState(spotId: string, date?: string): Promise<SeaStateData> {
    if (useMockData) {
      await delay(400)
      return getMockSeaState(spotId, date || new Date().toISOString())
    }

    try {
      // 優先嘗試使用真實海況服務
      const useRealSeaState = import.meta.env.VITE_USE_REAL_SEA_STATE === 'true'
      
      if (useRealSeaState) {
        // 取得地點座標
        const spots = await this.getSpots()
        const spot = spots.find(s => s.id === spotId)
        
        if (spot && spot.coordinates) {
          const [lat, lng] = spot.coordinates
          const seaStateData = await getSeaStateByCoordinates(lat, lng, date)
          seaStateData.spotId = spotId
          return seaStateData
        }
      }

      // 如果沒有使用真實海況服務，或找不到地點，嘗試後端 API
      const params = new URLSearchParams({ spotId })
      if (date) params.append('date', date)
      return await fetchAPI<SeaStateData>(`${getApiUrl(API_CONFIG.endpoints.seaState)}?${params}`)
    } catch (error) {
      console.warn('取得海況資料失敗，使用 Mock 資料:', error)
      return getMockSeaState(spotId, date || new Date().toISOString())
    }
  },

  /**
   * 取得潮汐資料
   */
  async getTide(spotId: string, date?: string): Promise<TideData> {
    if (useMockData) {
      await delay(400)
      return getMockTide(spotId, date || new Date().toISOString())
    }

    try {
      const params = new URLSearchParams({ spotId })
      if (date) params.append('date', date)
      return await fetchAPI<TideData>(`${getApiUrl(API_CONFIG.endpoints.tide)}?${params}`)
    } catch (error) {
      console.warn('取得潮汐資料失敗，使用 Mock 資料:', error)
      return getMockTide(spotId, date || new Date().toISOString())
    }
  },

  /**
   * 取得附近 POI
   */
  async getNearbyPOIs(spotId: string, radiusKm: number = 5, categories: string[] = []): Promise<POI[]> {
    if (useMockData) {
      await delay(400)
      if (categories.length > 0) {
        return getPOIsByCategory(spotId, categories)
      }
      return getPOIsBySpot(spotId, radiusKm)
    }

    try {
      const params = new URLSearchParams({ spotId, radiusKm: radiusKm.toString() })
      if (categories.length > 0) {
        params.append('categories', categories.join(','))
      }
      return await fetchAPI<POI[]>(`${getApiUrl(API_CONFIG.endpoints.nearbyPOIs)}?${params}`)
    } catch (error) {
      console.warn('取得 POI 失敗，使用 Mock 資料:', error)
      if (categories.length > 0) {
        return getPOIsByCategory(spotId, categories)
      }
      return getPOIsBySpot(spotId, radiusKm)
    }
  },

  /**
   * 規劃一日行程
   */
  async planDay(
    spotId: string,
    date: string,
    startTime: string,
    endTime: string,
    mobility: Mobility,
    budget?: number,
    preferences?: any
  ): Promise<PlanDay> {
    if (useMockData) {
      await delay(600)
      return generateDayPlan(spotId, date, startTime, endTime, mobility, budget, preferences)
    }

    try {
      return await fetchAPI<PlanDay>(getApiUrl(API_CONFIG.endpoints.planDay), {
        method: 'POST',
        body: JSON.stringify({
          spotId,
          date,
          startTime,
          endTime,
          mobility,
          budget,
          preferences,
        }),
      })
    } catch (error) {
      console.warn('規劃行程失敗，使用 Mock 資料:', error)
      return generateDayPlan(spotId, date, startTime, endTime, mobility, budget, preferences)
    }
  },

  /**
   * 計算路線
   */
  async getRoute(pois: POI[], mobility: Mobility, spotCoords: [number, number]): Promise<RouteInfo> {
    if (useMockData) {
      await delay(300)
      const stops = [
        { lat: spotCoords[0], lng: spotCoords[1], name: '起點' },
        ...pois.map(poi => ({ lat: poi.lat, lng: poi.lng, name: poi.name })),
      ]
      return calculateRoute(stops, mobility)
    }

    try {
      return await fetchAPI<RouteInfo>(getApiUrl(API_CONFIG.endpoints.route), {
        method: 'POST',
        body: JSON.stringify({
          pois,
          mobility,
          spotCoords,
        }),
      })
    } catch (error) {
      console.warn('計算路線失敗，使用本地計算:', error)
      const stops = [
        { lat: spotCoords[0], lng: spotCoords[1], name: '起點' },
        ...pois.map(poi => ({ lat: poi.lat, lng: poi.lng, name: poi.name })),
      ]
      return calculateRoute(stops, mobility)
    }
  },

  /**
   * 取得營業時間
   */
  async getOpenHours(poiIds: string[]): Promise<OpenHoursData> {
    if (useMockData) {
      await delay(300)
      const result: OpenHoursData = {}
      poiIds.forEach(id => {
        result[id] = getOpenHours(id)
      })
      return result
    }

    try {
      const params = new URLSearchParams({ poiIds: poiIds.join(',') })
      return await fetchAPI<OpenHoursData>(`${getApiUrl(API_CONFIG.endpoints.openHours)}?${params}`)
    } catch (error) {
      console.warn('取得營業時間失敗，使用 Mock 資料:', error)
      const result: OpenHoursData = {}
      poiIds.forEach(id => {
        result[id] = getOpenHours(id)
      })
      return result
    }
  },

  /**
   * 發送聊天訊息（整合真實 AI 服務）
   */
  async sendChatMessage(message: string, history: ChatMessage[]): Promise<ChatMessage> {
    // 如果使用 Mock 模式，使用舊的關鍵字匹配邏輯
    if (useMockData) {
      return await this.sendChatMessageMock(message, history)
    }

    try {
      // 使用真實 AI 服務
      const aiResponse = await sendAIMessage(message, history)
      
      // 分析用戶意圖並調用相關工具
      const toolCalls = await this.detectAndCallTools(message, history)
      
      // 如果有工具調用，將結果整合到 AI 回應中
      let finalContent = aiResponse.content
      
      if (toolCalls.length > 0) {
        // 將工具調用結果格式化為文字，讓 AI 能夠更好地回應
        const toolResults = toolCalls.map(tc => {
          switch (tc.type) {
            case 'weather':
              const weather = tc.data as WeatherData
              return `天氣資訊：${tc.spotName} 目前氣溫 ${weather.temperature.toFixed(1)}°C，風速 ${weather.windSpeed.toFixed(1)} m/s，風向 ${weather.windDirection}°`
            case 'seaState':
              const sea = tc.data as SeaStateData
              return `海況資訊：${tc.spotName} 浪高 ${sea.waveHeight.toFixed(1)}m，週期 ${sea.wavePeriod.toFixed(1)}秒，浪向 ${sea.waveDirection}°`
            case 'tide':
              const tide = tc.data as TideData
              return `潮汐資訊：${tc.spotName} 目前潮位 ${tide.currentHeight.toFixed(2)}m，下次滿潮 ${tide.nextHigh.time} (${tide.nextHigh.height.toFixed(2)}m)`
            case 'nearbyPOIs':
              const pois = tc.data as POI[]
              return `附近景點：${tc.spotName} 附近有 ${pois.length} 個景點，包含 ${pois.slice(0, 3).map(p => p.name).join('、')} 等`
            case 'planDay':
              const plan = tc.data as PlanDay
              return `行程規劃：已為 ${tc.spotName} 規劃一日行程，包含 ${plan.timeline.length} 個活動，預估花費 ${plan.estTotalCost || 0} 元`
            default:
              return ''
          }
        }).filter(Boolean).join('\n')
        
        // 如果有工具結果，可以選擇重新調用 AI 來整合回應，或直接附加
        if (toolResults) {
          // 簡單方式：直接附加工具結果
          finalContent = `${aiResponse.content}\n\n${toolResults}`
        }
      }
      
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: finalContent,
        timestamp: new Date(),
        toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      }
    } catch (error) {
      console.error('AI 聊天服務錯誤:', error)
      
      // 如果 AI 服務失敗，回退到 Mock 模式
      console.warn('AI 服務失敗，使用 Mock 模式')
      return await this.sendChatMessageMock(message, history)
    }
  },

  /**
   * Mock 模式的聊天訊息處理（保留原有邏輯作為後備）
   */
  async sendChatMessageMock(message: string, _history: ChatMessage[]): Promise<ChatMessage> {
    await delay(800)
    
    const toolCalls: ToolCall[] = []
    const lowerMessage = message.toLowerCase()
    
    // 取得所有地點（用於檢測）
    const spots = await this.getSpots()
    
    // 檢測關鍵字並生成工具調用
    let detectedSpot = 'cijin'
    let detectedSpotName = '旗津'
    
    for (const spot of spots) {
      if (lowerMessage.includes(spot.name.toLowerCase()) || lowerMessage.includes(spot.nameEn.toLowerCase())) {
        detectedSpot = spot.id
        detectedSpotName = spot.name
        break
      }
    }
    
    // 檢測規劃相關關鍵字
    const isPlanningQuery = 
      lowerMessage.includes('安排') || 
      lowerMessage.includes('規劃') || 
      lowerMessage.includes('行程') ||
      lowerMessage.includes('一日') ||
      lowerMessage.includes('半日') ||
      lowerMessage.includes('旅行')

    const wantsNearby = 
      lowerMessage.includes('附近') || 
      lowerMessage.includes('周邊') || 
      lowerMessage.includes('附近有') ||
      lowerMessage.includes('餐廳') ||
      lowerMessage.includes('咖啡')

    // 規劃行程工具
    if (isPlanningQuery) {
      // 解析偏好
      const wantSeafood = lowerMessage.includes('海鮮')
      const wantSunset = lowerMessage.includes('日落') || lowerMessage.includes('夕陽')
      const needShower = lowerMessage.includes('淋浴') || lowerMessage.includes('沖洗')
      
      let mobility: Mobility = 'scooter'
      if (lowerMessage.includes('走路') || lowerMessage.includes('步行')) mobility = 'walk'
      if (lowerMessage.includes('機車') || lowerMessage.includes('摩托車')) mobility = 'scooter'
      if (lowerMessage.includes('開車') || lowerMessage.includes('汽車')) mobility = 'car'
      
      let budget: number | undefined
      const budgetMatch = lowerMessage.match(/預算\s*(\d+)/)
      if (budgetMatch) budget = parseInt(budgetMatch[1])

      const maxPrice = lowerMessage.includes('300') ? '$' : lowerMessage.includes('500') ? '$$' : undefined

      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      const plan = await this.planDay(
        detectedSpot,
        tomorrow.toISOString().split('T')[0],
        '06:30',
        '18:30',
        mobility,
        budget,
        { wantSeafood, wantSunset, needShower, maxPrice }
      )
      
      toolCalls.push({
        type: 'planDay',
        data: plan,
        spotName: detectedSpotName,
      })

      // 同時顯示附近 POI
      const pois = await this.getNearbyPOIs(detectedSpot)
      toolCalls.push({
        type: 'nearbyPOIs',
        data: pois,
        spotName: detectedSpotName,
      })
    }
    
    // 附近 POI 查詢
    if (wantsNearby && !isPlanningQuery) {
      const pois = await this.getNearbyPOIs(detectedSpot)
      toolCalls.push({
        type: 'nearbyPOIs',
        data: pois,
        spotName: detectedSpotName,
      })
    }

    // 天氣、海況、潮汐查詢
    if (lowerMessage.includes('天氣') || lowerMessage.includes('weather') || lowerMessage.includes('溫度') || (lowerMessage.includes('風') && !isPlanningQuery)) {
      const weatherData = await this.getWeather(detectedSpot)
      toolCalls.push({
        type: 'weather',
        data: weatherData,
        spotName: detectedSpotName,
      })
    }
    
    if (lowerMessage.includes('海況') || lowerMessage.includes('浪') || lowerMessage.includes('wave') || (lowerMessage.includes('衝浪') && !isPlanningQuery) || lowerMessage.includes('surf')) {
      const seaData = await this.getSeaState(detectedSpot)
      toolCalls.push({
        type: 'seaState',
        data: seaData,
        spotName: detectedSpotName,
      })
    }
    
    if (lowerMessage.includes('潮汐') || lowerMessage.includes('tide') || (lowerMessage.includes('潮') && !isPlanningQuery)) {
      const tideData = await this.getTide(detectedSpot)
      toolCalls.push({
        type: 'tide',
        data: tideData,
        spotName: detectedSpotName,
      })
    }
    
    // 生成回覆
    let content = ''
    
    if (toolCalls.length > 0) {
      if (isPlanningQuery) {
        content = `好的！我已經為您規劃了${detectedSpotName}的一日行程。\n\n`
        content += `這個行程結合了當地海況與天氣條件，並考慮了您的預算與偏好。時間安排已避開午休時段，並預留充足的移動時間。\n\n`
        content += `如需調整，可以告訴我「把午餐改成 300 元以內」或「把日落點往北移」等具體需求！`
      } else if (wantsNearby) {
        content = `我為您整理了${detectedSpotName}附近的景點與設施！\n\n`
        content += `包含餐飲、咖啡廳、租借店、淋浴設施等。您可以點選收藏喜歡的地點，或直接加入行程規劃。`
      } else {
        content = `我已經為您查詢了${detectedSpotName}的相關資訊。\n\n`
        
        if (toolCalls.some(t => t.type === 'weather')) {
          const weather = toolCalls.find(t => t.type === 'weather')?.data as WeatherData
          content += `目前天氣：氣溫 ${weather.temperature.toFixed(1)}°C，風速 ${weather.windSpeed.toFixed(1)} m/s。\n`
        }
        
        if (toolCalls.some(t => t.type === 'seaState')) {
          const sea = toolCalls.find(t => t.type === 'seaState')?.data as SeaStateData
          content += `海況：浪高 ${sea.waveHeight.toFixed(1)}m，週期 ${sea.wavePeriod.toFixed(1)}秒。\n`
        }
        
        if (lowerMessage.includes('適合') || lowerMessage.includes('建議') || lowerMessage.includes('評估')) {
          const sea = toolCalls.find(t => t.type === 'seaState')?.data as SeaStateData
          if (sea) {
            if (sea.waveHeight < 1.0) {
              content += `\n根據當前海況，浪高適中，很適合新手練習！建議選擇上午時段，風浪較為平穩。記得做好暖身並注意安全。`
            } else if (sea.waveHeight < 2.0) {
              content += `\n當前浪況適合有經驗的衝浪者。新手建議在教練陪同下進行，或選擇較平緩的時段。`
            } else {
              content += `\n目前浪況較大，建議進階玩家前往。新手請選擇其他時間或地點，安全第一！`
            }
          }
        }
      }
    } else {
      // 一般對話回覆
      const responses = [
        '我是 Marine AI Assistant，專門協助您規劃海洋活動與行程。您可以：\n\n• 詢問特定地點的海況、天氣或潮汐\n• 請我安排一日/半日輕旅行\n• 查詢附近的餐廳、咖啡廳等設施\n\n試試看說「幫我安排明天在旗津的一日行程」！',
        '很高興為您服務！我可以幫您：\n\n✓ 查詢即時海況與天氣\n✓ 規劃一日輕旅行\n✓ 推薦附近景點與美食\n✓ 提供安全建議\n\n您想從哪裡開始呢？',
      ]
      content = responses[Math.floor(Math.random() * responses.length)]
    }
    
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content,
      timestamp: new Date(),
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
    }
  },

  /**
   * 檢測用戶意圖並調用相關工具
   */
  async detectAndCallTools(message: string, _history: ChatMessage[]): Promise<ToolCall[]> {
    const toolCalls: ToolCall[] = []
    const lowerMessage = message.toLowerCase()
    
    // 取得所有地點
    const spots = await this.getSpots()
    
    // 檢測地點
    let detectedSpot = 'cijin'
    let detectedSpotName = '旗津'
    
    for (const spot of spots) {
      if (lowerMessage.includes(spot.name.toLowerCase()) || lowerMessage.includes(spot.nameEn.toLowerCase())) {
        detectedSpot = spot.id
        detectedSpotName = spot.name
        break
      }
    }
    
    // 檢測是否需要查詢天氣
    if (lowerMessage.includes('天氣') || lowerMessage.includes('weather') || lowerMessage.includes('溫度') || lowerMessage.includes('風')) {
      try {
        const weatherData = await this.getWeather(detectedSpot)
        toolCalls.push({
          type: 'weather',
          data: weatherData,
          spotName: detectedSpotName,
        })
      } catch (error) {
        console.error('取得天氣資料失敗:', error)
      }
    }
    
    // 檢測是否需要查詢海況
    if (lowerMessage.includes('海況') || lowerMessage.includes('浪') || lowerMessage.includes('wave') || lowerMessage.includes('衝浪') || lowerMessage.includes('surf')) {
      try {
        const seaData = await this.getSeaState(detectedSpot)
        toolCalls.push({
          type: 'seaState',
          data: seaData,
          spotName: detectedSpotName,
        })
      } catch (error) {
        console.error('取得海況資料失敗:', error)
      }
    }
    
    // 檢測是否需要查詢潮汐
    if (lowerMessage.includes('潮汐') || lowerMessage.includes('tide') || lowerMessage.includes('潮')) {
      try {
        const tideData = await this.getTide(detectedSpot)
        toolCalls.push({
          type: 'tide',
          data: tideData,
          spotName: detectedSpotName,
        })
      } catch (error) {
        console.error('取得潮汐資料失敗:', error)
      }
    }
    
    // 檢測是否需要查詢附近 POI
    if (lowerMessage.includes('附近') || lowerMessage.includes('周邊') || lowerMessage.includes('餐廳') || lowerMessage.includes('咖啡') || lowerMessage.includes('景點')) {
      try {
        const pois = await this.getNearbyPOIs(detectedSpot)
        toolCalls.push({
          type: 'nearbyPOIs',
          data: pois,
          spotName: detectedSpotName,
        })
      } catch (error) {
        console.error('取得 POI 失敗:', error)
      }
    }
    
    // 檢測是否需要規劃行程
    if (lowerMessage.includes('安排') || lowerMessage.includes('規劃') || lowerMessage.includes('行程') || lowerMessage.includes('一日') || lowerMessage.includes('半日')) {
      try {
        // 解析偏好
        const wantSeafood = lowerMessage.includes('海鮮')
        const wantSunset = lowerMessage.includes('日落') || lowerMessage.includes('夕陽')
        const needShower = lowerMessage.includes('淋浴') || lowerMessage.includes('沖洗')
        
        let mobility: Mobility = 'scooter'
        if (lowerMessage.includes('走路') || lowerMessage.includes('步行')) mobility = 'walk'
        if (lowerMessage.includes('機車') || lowerMessage.includes('摩托車')) mobility = 'scooter'
        if (lowerMessage.includes('開車') || lowerMessage.includes('汽車')) mobility = 'car'
        
        let budget: number | undefined
        const budgetMatch = lowerMessage.match(/預算\s*(\d+)/)
        if (budgetMatch) budget = parseInt(budgetMatch[1])

        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        
        const plan = await this.planDay(
          detectedSpot,
          tomorrow.toISOString().split('T')[0],
          '06:30',
          '18:30',
          mobility,
          budget,
          { wantSeafood, wantSunset, needShower }
        )
        
        toolCalls.push({
          type: 'planDay',
          data: plan,
          spotName: detectedSpotName,
        })
      } catch (error) {
        console.error('規劃行程失敗:', error)
      }
    }
    
    return toolCalls
  },
}

