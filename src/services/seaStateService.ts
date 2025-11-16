/**
 * 海況服務
 * 整合多種海況資料來源
 */

import type { SeaStateData, HourlySeaState } from '@/types'

// 海況資料來源配置
const SEA_STATE_CONFIG = {
  provider: import.meta.env.VITE_SEA_STATE_PROVIDER || 'stormglass', // stormglass, noaa, cwb
  stormglass: {
    apiKey: import.meta.env.VITE_STORMGLASS_API_KEY || '',
    baseURL: 'https://api.stormglass.io/v2',
  },
  noaa: {
    baseURL: 'https://api.tidesandcurrents.noaa.gov/api/prod',
  },
  cwb: {
    apiKey: import.meta.env.VITE_CWB_API_KEY || '',
    baseURL: 'https://opendata.cwb.gov.tw/api/v1/rest/datastore',
  },
}

/**
 * 從經緯度取得海況資料
 */
export async function getSeaStateByCoordinates(
  lat: number,
  lng: number,
  date?: string
): Promise<SeaStateData> {
  const { provider } = SEA_STATE_CONFIG

  try {
    switch (provider) {
      case 'stormglass':
        return await getStormglassSeaState(lat, lng, date)
      case 'noaa':
        return await getNOAASeaState(lat, lng, date)
      case 'cwb':
        return await getCWBSeaState(lat, lng, date)
      default:
        throw new Error(`不支援的海況提供者: ${provider}`)
    }
  } catch (error) {
    console.error('取得海況資料失敗:', error)
    throw error
  }
}

/**
 * Stormglass API (推薦用於海況)
 */
async function getStormglassSeaState(
  lat: number,
  lng: number,
  date?: string
): Promise<SeaStateData> {
  const { apiKey, baseURL } = SEA_STATE_CONFIG.stormglass

  if (!apiKey) {
    throw new Error('Stormglass API Key 未設定')
  }

  const start = date
    ? new Date(date).toISOString()
    : new Date().toISOString()
  const end = new Date(new Date(start).getTime() + 24 * 60 * 60 * 1000).toISOString()

  const response = await fetch(
    `${baseURL}/marine/point?lat=${lat}&lng=${lng}&params=waveHeight,wavePeriod,waveDirection,swellHeight,swellPeriod,swellDirection,currentSpeed,currentDirection&start=${start}&end=${end}`,
    {
      headers: {
        Authorization: apiKey,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Stormglass API 錯誤: ${response.statusText}`)
  }

  const data = await response.json()

  // 轉換 Stormglass 格式
  const hourlyData: HourlySeaState[] = data.hours?.slice(0, 24).map((hour: any) => ({
    time: new Date(hour.time).toISOString().substring(11, 16),
    waveHeight: hour.waveHeight?.sg || 0,
    wavePeriod: hour.wavePeriod?.sg || 0,
    waveDirection: hour.waveDirection?.sg || 0,
  })) || []

  const current = data.hours?.[0] || {}

  return {
    spotId: '', // 將由調用者設定
    date: date || new Date().toISOString().split('T')[0],
    waveHeight: current.waveHeight?.sg || 0,
    wavePeriod: current.wavePeriod?.sg || 0,
    waveDirection: current.waveDirection?.sg || 0,
    swellHeight: current.swellHeight?.sg || 0,
    currentSpeed: current.currentSpeed?.sg || 0,
    currentDirection: current.currentDirection?.sg || 0,
    hourlyData,
  }
}

/**
 * NOAA API (美國國家海洋和大氣管理局)
 */
async function getNOAASeaState(
  lat: number,
  lng: number,
  date?: string
): Promise<SeaStateData> {
  // NOAA API 需要特定的測站 ID，這裡簡化處理
  // 實際使用時需要根據座標找到最近的測站
  const { baseURL } = SEA_STATE_CONFIG.noaa

  // 這裡需要根據實際 NOAA API 進行實作
  // 目前提供基本結構
  return {
    spotId: '',
    date: date || new Date().toISOString().split('T')[0],
    waveHeight: 0,
    wavePeriod: 0,
    waveDirection: 0,
    swellHeight: 0,
    currentSpeed: 0,
    currentDirection: 0,
    hourlyData: [],
  }
}

/**
 * 中央氣象署海況 API
 * 使用「臺灣海域波浪預報逐三小時數值模式資料」
 * 資料集: F-A0021-001 (波浪預報)
 */
async function getCWBSeaState(
  lat: number,
  lng: number,
  date?: string
): Promise<SeaStateData> {
  const { apiKey, baseURL } = SEA_STATE_CONFIG.cwb

  if (!apiKey) {
    throw new Error('中央氣象署 API Key 未設定')
  }

  // 根據座標找到最接近的海域區域
  // CWB 波浪預報使用網格點，需要找到最接近的點
  const location = findNearestCWBLocation(lat, lng)

  // 取得波浪預報資料
  // 資料集 ID: F-A0021-001 (臺灣海域波浪預報逐三小時數值模式資料)
  const response = await fetch(
    `${baseURL}/F-A0021-001?Authorization=${apiKey}&locationName=${location}&elementName=hs,t,dir&timeFrom=${date || new Date().toISOString().split('T')[0]}T00:00:00&timeTo=${new Date(new Date(date || new Date().toISOString().split('T')[0]).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}T23:59:59`
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`中央氣象署 API 錯誤: ${response.statusText} - ${errorText}`)
  }

  const data = await response.json()

  // 解析 CWB 資料格式
  if (!data.records || !data.records.location || data.records.location.length === 0) {
    throw new Error('中央氣象署 API 未返回資料')
  }

  const locationData = data.records.location[0]
  const weatherElements = locationData.weatherElement || []

  // 提取浪高 (hs)、週期 (t)、波向 (dir)
  const hsData = weatherElements.find((e: any) => e.elementName === 'hs')
  const tData = weatherElements.find((e: any) => e.elementName === 't')
  const dirData = weatherElements.find((e: any) => e.elementName === 'dir')

  // 轉換為每小時資料（CWB 提供每 3 小時資料）
  const hourlyData: HourlySeaState[] = []
  
  if (hsData && hsData.time && hsData.time.length > 0) {
    for (let i = 0; i < Math.min(24, hsData.time.length); i++) {
      const time = hsData.time[i]
      const hsValue = parseFloat(time.elementValue?.[0]?.value || '0')
      const tValue = tData?.time?.[i]?.elementValue?.[0]?.value 
        ? parseFloat(tData.time[i].elementValue[0].value) 
        : 0
      const dirValue = dirData?.time?.[i]?.elementValue?.[0]?.value 
        ? parseFloat(dirData.time[i].elementValue[0].value) 
        : 0

      hourlyData.push({
        time: new Date(time.startTime).toISOString().substring(11, 16), // HH:MM
        waveHeight: hsValue,
        wavePeriod: tValue,
        waveDirection: dirValue,
      })
    }
  }

  // 當前資料（第一個時間點）
  const current = hourlyData[0] || {
    time: new Date().toISOString().substring(11, 16),
    waveHeight: 0,
    wavePeriod: 0,
    waveDirection: 0,
  }

  return {
    spotId: '', // 將由調用者設定
    date: date || new Date().toISOString().split('T')[0],
    waveHeight: current.waveHeight,
    wavePeriod: current.wavePeriod,
    waveDirection: current.waveDirection,
    swellHeight: 0, // CWB 資料不包含 swell
    currentSpeed: 0, // CWB 資料不包含流速
    currentDirection: 0, // CWB 資料不包含流向
    hourlyData,
  }
}

/**
 * 根據經緯度找到最接近的 CWB 海域區域
 * CWB 波浪預報使用特定的海域區域名稱
 */
function findNearestCWBLocation(lat: number, lng: number): string {
  // 台灣海域區域對照表
  // 根據座標範圍判斷最接近的區域
  const regions = [
    { name: '臺灣海峽北部', minLat: 24.5, maxLat: 26.0, minLng: 119.5, maxLng: 121.0 },
    { name: '臺灣海峽南部', minLat: 22.5, maxLat: 24.5, minLng: 119.0, maxLng: 121.0 },
    { name: '臺灣東北部', minLat: 24.5, maxLat: 26.0, minLng: 121.0, maxLng: 122.5 },
    { name: '臺灣東部', minLat: 22.5, maxLat: 24.5, minLng: 121.0, maxLng: 122.5 },
    { name: '臺灣東南部', minLat: 21.0, maxLat: 22.5, minLng: 120.5, maxLng: 122.0 },
  ]

  // 找到包含該座標的區域
  for (const region of regions) {
    if (
      lat >= region.minLat &&
      lat <= region.maxLat &&
      lng >= region.minLng &&
      lng <= region.maxLng
    ) {
      return region.name
    }
  }

  // 如果找不到，根據距離計算最接近的區域
  let minDistance = Infinity
  let nearestRegion = '臺灣海峽南部' // 預設值

  for (const region of regions) {
    const centerLat = (region.minLat + region.maxLat) / 2
    const centerLng = (region.minLng + region.maxLng) / 2
    const distance = Math.sqrt(
      Math.pow(lat - centerLat, 2) + Math.pow(lng - centerLng, 2)
    )

    if (distance < minDistance) {
      minDistance = distance
      nearestRegion = region.name
    }
  }

  return nearestRegion
}

