/**
 * 天氣服務
 * 整合多種天氣資料來源
 */

import type { WeatherData, HourlyWeather } from '@/types'

/**
 * 計算體感溫度（Heat Index / Apparent Temperature）
 * 使用 Steadman 公式，考慮溫度、濕度、風速
 */
function calculateFeelsLike(
  temperature: number,
  humidity: number,
  windSpeed: number
): number {
  // 如果風速很低且溫度適中，使用熱指數公式
  if (temperature >= 27 && humidity > 40) {
    // 熱指數公式（高溫高濕）
    const hi = 
      0.5 * (temperature + 61.0 + ((temperature - 68.0) * 1.2) + (humidity * 0.094))
    
    // 考慮風速的風寒效應（簡化版）
    if (windSpeed > 0) {
      const windChill = 13.12 + 0.6215 * temperature - 11.37 * Math.pow(windSpeed, 0.16) + 0.3965 * temperature * Math.pow(windSpeed, 0.16)
      return (hi + windChill) / 2
    }
    
    return hi
  }
  
  // 低溫時考慮風寒效應
  if (temperature < 10 && windSpeed > 0) {
    // 風寒指數公式
    return 13.12 + 0.6215 * temperature - 11.37 * Math.pow(windSpeed, 0.16) + 0.3965 * temperature * Math.pow(windSpeed, 0.16)
  }
  
  // 一般情況：考慮濕度和風速的簡化計算
  let feelsLike = temperature
  
  // 高濕度會讓體感溫度升高
  if (humidity > 60) {
    feelsLike += (humidity - 60) * 0.05
  }
  
  // 風速會降低體感溫度（風寒效應）
  if (windSpeed > 0) {
    feelsLike -= windSpeed * 0.3
  }
  
  return Math.round(feelsLike * 10) / 10
}

// 天氣資料來源配置
const WEATHER_CONFIG = {
  provider: import.meta.env.VITE_WEATHER_PROVIDER || 'openweather', // openweather, cwb, stormglass
  openweather: {
    apiKey: import.meta.env.VITE_OPENWEATHER_API_KEY || '',
    baseURL: 'https://api.openweathermap.org/data/2.5',
  },
  cwb: {
    apiKey: import.meta.env.VITE_CWB_API_KEY || '',
    baseURL: 'https://opendata.cwb.gov.tw/api/v1/rest/datastore',
  },
  stormglass: {
    apiKey: import.meta.env.VITE_STORMGLASS_API_KEY || '',
    baseURL: 'https://api.stormglass.io/v2',
  },
}

/**
 * 從經緯度取得天氣資料
 */
export async function getWeatherByCoordinates(
  lat: number,
  lng: number,
  date?: string
): Promise<WeatherData> {
  const { provider } = WEATHER_CONFIG

  try {
    switch (provider) {
      case 'openweather':
        return await getOpenWeatherData(lat, lng, date)
      case 'cwb':
        return await getCWBData(lat, lng, date)
      case 'stormglass':
        return await getStormglassData(lat, lng, date)
      default:
        throw new Error(`不支援的天氣提供者: ${provider}`)
    }
  } catch (error) {
    console.error('取得天氣資料失敗:', error)
    throw error
  }
}

/**
 * OpenWeatherMap API
 */
async function getOpenWeatherData(
  lat: number,
  lng: number,
  date?: string
): Promise<WeatherData> {
  const { apiKey, baseURL } = WEATHER_CONFIG.openweather

  if (!apiKey) {
    throw new Error('OpenWeatherMap API Key 未設定')
  }

  // 取得當前天氣
  const currentResponse = await fetch(
    `${baseURL}/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric&lang=zh_tw`
  )

  if (!currentResponse.ok) {
    throw new Error(`OpenWeatherMap API 錯誤: ${currentResponse.statusText}`)
  }

  const current = await currentResponse.json()

  // 取得預報（5天，每3小時）
  const forecastResponse = await fetch(
    `${baseURL}/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric&lang=zh_tw`
  )

  if (!forecastResponse.ok) {
    throw new Error(`OpenWeatherMap Forecast API 錯誤: ${forecastResponse.statusText}`)
  }

  const forecast = await forecastResponse.json()

  // 轉換為我們的格式
  const hourlyData: HourlyWeather[] = forecast.list.slice(0, 24).map((item: any) => ({
    time: new Date(item.dt * 1000).toISOString().substring(11, 16), // HH:MM
    temperature: item.main.temp,
    windSpeed: item.wind.speed,
    windDirection: item.wind.deg || 0,
    rainfall: item.rain?.['3h'] || 0,
  }))

  // 計算體感溫度（如果 API 沒有提供或值不合理，使用計算值）
  const apiFeelsLike = current.main.feels_like
  const calculatedFeelsLike = calculateFeelsLike(
    current.main.temp,
    current.main.humidity,
    current.wind.speed
  )
  
  // 如果 API 提供的體感溫度與計算值差異過大（> 5°C），使用計算值
  const feelsLike = apiFeelsLike && Math.abs(apiFeelsLike - calculatedFeelsLike) < 5
    ? apiFeelsLike
    : calculatedFeelsLike

  return {
    spotId: '', // 將由調用者設定
    date: date || new Date().toISOString().split('T')[0],
    temperature: current.main.temp,
    feelsLike: feelsLike,
    windSpeed: current.wind.speed,
    windDirection: current.wind.deg || 0,
    rainfall: current.rain?.['1h'] || 0,
    humidity: current.main.humidity,
    visibility: (current.visibility || 10000) / 1000, // 轉換為公里
    hourlyData,
  }
}

/**
 * 中央氣象署 API (CWB)
 * 使用「一般天氣預報-今明36小時天氣預報」
 * 資料集: F-C0032-001
 */
async function getCWBData(
  lat: number,
  lng: number,
  date?: string
): Promise<WeatherData> {
  const { apiKey, baseURL } = WEATHER_CONFIG.cwb

  if (!apiKey) {
    throw new Error('中央氣象署 API Key 未設定')
  }

  // 根據座標找到對應的縣市名稱
  const locationName = findCWBLocationName(lat, lng)

  // 使用一般天氣預報 API (F-C0032-001)
  const response = await fetch(
    `${baseURL}/F-C0032-001?Authorization=${apiKey}&locationName=${encodeURIComponent(locationName)}`
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

  // 提取天氣元素
  // CWB API 通常包含：Wx (天氣現象), PoP (降雨機率), MinT (最低溫), MaxT (最高溫), CI (舒適度), WS (風速), WD (風向)
  const wxData = weatherElements.find((e: any) => e.elementName === 'Wx') // 天氣現象
  const popData = weatherElements.find((e: any) => e.elementName === 'PoP') // 降雨機率
  const minTData = weatherElements.find((e: any) => e.elementName === 'MinT') // 最低溫
  const maxTData = weatherElements.find((e: any) => e.elementName === 'MaxT') // 最高溫
  const wsData = weatherElements.find((e: any) => e.elementName === 'WS') // 風速
  const wdData = weatherElements.find((e: any) => e.elementName === 'WD') // 風向

  // 取得當前時間的資料（第一個時間點）
  const currentPop = popData?.time?.[0]?.elementValue?.[0]?.value || '0'
  const currentMinT = minTData?.time?.[0]?.elementValue?.[0]?.value || '25'
  const currentMaxT = maxTData?.time?.[0]?.elementValue?.[0]?.value || '30'
  const currentWS = wsData?.time?.[0]?.elementValue?.[0]?.value || '0'
  const currentWD = wdData?.time?.[0]?.elementValue?.[0]?.value || '0'

  // 計算平均溫度
  const avgTemp = (parseFloat(currentMinT) + parseFloat(currentMaxT)) / 2

  // 轉換風速單位（CWB 可能使用 m/s 或 km/h，這裡假設是 m/s）
  // 如果風速值很大（> 50），可能是 km/h，需要轉換
  let windSpeed = parseFloat(currentWS) || 0
  if (windSpeed > 50) {
    windSpeed = windSpeed / 3.6 // 轉換 km/h 為 m/s
  }

  // 轉換風向（CWB 可能使用文字或度數）
  let windDirection = 0
  if (currentWD) {
    // 如果是數字，直接使用
    if (!isNaN(parseFloat(currentWD))) {
      windDirection = parseFloat(currentWD)
    } else {
      // 如果是文字（如：東北風），需要轉換
      windDirection = convertWindDirection(currentWD)
    }
  }

  // 取得濕度（CWB 36小時預報可能不包含，使用預設值或從其他來源取得）
  // 這裡先使用預設值，實際使用時可以從其他 API 或資料來源取得
  const humidity = 70 // 預設濕度，可以根據季節和地區調整

  // 計算體感溫度
  const feelsLike = calculateFeelsLike(avgTemp, humidity, windSpeed)

  // 轉換為每小時資料（CWB 提供 36 小時預報，每 12 小時一個時間點）
  const hourlyData: HourlyWeather[] = []
  
  if (wxData && wxData.time && wxData.time.length > 0) {
    for (let i = 0; i < Math.min(24, wxData.time.length * 3); i++) {
      // CWB 每 12 小時一個資料點，我們需要插值為每小時
      const dataIndex = Math.floor(i / 3) // 每 3 小時對應一個 CWB 資料點
      
      const minT = minTData?.time?.[dataIndex]?.elementValue?.[0]?.value || currentMinT
      const maxT = maxTData?.time?.[dataIndex]?.elementValue?.[0]?.value || currentMaxT
      const pop = popData?.time?.[dataIndex]?.elementValue?.[0]?.value || '0'
      const ws = wsData?.time?.[dataIndex]?.elementValue?.[0]?.value || '0'
      const wd = wdData?.time?.[dataIndex]?.elementValue?.[0]?.value || '0'

      // 計算該小時的溫度（在最低溫和最高溫之間插值）
      const hourInDay = i % 24
      const temp = hourInDay < 12 
        ? parseFloat(minT) + (parseFloat(maxT) - parseFloat(minT)) * (hourInDay / 12)
        : parseFloat(maxT) - (parseFloat(maxT) - parseFloat(minT)) * ((hourInDay - 12) / 12)

      hourlyData.push({
        time: `${String(Math.floor(i % 24)).padStart(2, '0')}:00`,
        temperature: temp,
        windSpeed: parseFloat(ws) || 0,
        windDirection: !isNaN(parseFloat(wd)) ? parseFloat(wd) : convertWindDirection(wd),
        rainfall: (parseFloat(pop) / 100) * 5, // 降雨機率轉換為預估降雨量（簡化）
      })
    }
  }

  return {
    spotId: '', // 將由調用者設定
    date: date || new Date().toISOString().split('T')[0],
    temperature: avgTemp,
    feelsLike: feelsLike, // 使用計算的體感溫度
    windSpeed: windSpeed,
    windDirection: windDirection,
    rainfall: (parseFloat(currentPop) / 100) * 5, // 降雨機率轉換為預估降雨量
    humidity: humidity,
    visibility: 10, // CWB 36小時預報可能不包含能見度
    hourlyData: hourlyData.length > 0 ? hourlyData : generateDefaultHourlyData(avgTemp, windSpeed, windDirection),
  }
}

/**
 * 根據經緯度找到對應的 CWB 縣市名稱
 */
function findCWBLocationName(lat: number, lng: number): string {
  // 台灣縣市對照表（根據座標範圍）
  const cities = [
    { name: '基隆市', minLat: 25.0, maxLat: 25.3, minLng: 121.5, maxLng: 121.8 },
    { name: '新北市', minLat: 24.8, maxLat: 25.3, minLng: 121.3, maxLng: 122.0 },
    { name: '臺北市', minLat: 25.0, maxLat: 25.2, minLng: 121.4, maxLng: 121.7 },
    { name: '桃園市', minLat: 24.7, maxLat: 25.1, minLng: 121.0, maxLng: 121.5 },
    { name: '新竹縣', minLat: 24.5, maxLat: 24.9, minLng: 120.8, maxLng: 121.3 },
    { name: '新竹市', minLat: 24.7, maxLat: 24.9, minLng: 120.9, maxLng: 121.1 },
    { name: '苗栗縣', minLat: 24.3, maxLat: 24.7, minLng: 120.6, maxLng: 121.2 },
    { name: '臺中市', minLat: 24.0, maxLat: 24.5, minLng: 120.5, maxLng: 121.2 },
    { name: '彰化縣', minLat: 23.8, maxLat: 24.2, minLng: 120.3, maxLng: 120.7 },
    { name: '南投縣', minLat: 23.5, maxLat: 24.2, minLng: 120.6, maxLng: 121.3 },
    { name: '雲林縣', minLat: 23.5, maxLat: 23.9, minLng: 120.1, maxLng: 120.6 },
    { name: '嘉義縣', minLat: 23.2, maxLat: 23.7, minLng: 120.1, maxLng: 120.7 },
    { name: '嘉義市', minLat: 23.4, maxLat: 23.6, minLng: 120.4, maxLng: 120.5 },
    { name: '臺南市', minLat: 22.9, maxLat: 23.4, minLng: 120.0, maxLng: 120.6 },
    { name: '高雄市', minLat: 22.5, maxLat: 23.1, minLng: 120.1, maxLng: 120.7 },
    { name: '屏東縣', minLat: 22.0, maxLat: 22.8, minLng: 120.3, maxLng: 120.9 },
    { name: '宜蘭縣', minLat: 24.3, maxLat: 24.9, minLng: 121.4, maxLng: 122.0 },
    { name: '花蓮縣', minLat: 23.2, maxLat: 24.4, minLng: 121.2, maxLng: 121.8 },
    { name: '臺東縣', minLat: 22.0, maxLat: 23.5, minLng: 120.8, maxLng: 121.6 },
    { name: '澎湖縣', minLat: 23.2, maxLat: 23.7, minLng: 119.3, maxLng: 119.7 },
  ]

  // 找到包含該座標的縣市
  for (const city of cities) {
    if (
      lat >= city.minLat &&
      lat <= city.maxLat &&
      lng >= city.minLng &&
      lng <= city.maxLng
    ) {
      return city.name
    }
  }

  // 如果找不到，根據距離計算最接近的縣市
  let minDistance = Infinity
  let nearestCity = '高雄市' // 預設值

  for (const city of cities) {
    const centerLat = (city.minLat + city.maxLat) / 2
    const centerLng = (city.minLng + city.maxLng) / 2
    const distance = Math.sqrt(
      Math.pow(lat - centerLat, 2) + Math.pow(lng - centerLng, 2)
    )

    if (distance < minDistance) {
      minDistance = distance
      nearestCity = city.name
    }
  }

  return nearestCity
}

/**
 * 轉換風向文字為度數
 */
function convertWindDirection(wd: string): number {
  const directions: Record<string, number> = {
    '北': 0,
    '東北': 45,
    '東': 90,
    '東南': 135,
    '南': 180,
    '西南': 225,
    '西': 270,
    '西北': 315,
    '北風': 0,
    '東北風': 45,
    '東風': 90,
    '東南風': 135,
    '南風': 180,
    '西南風': 225,
    '西風': 270,
    '西北風': 315,
  }

  return directions[wd] || 0
}

/**
 * 生成預設的每小時資料（當 CWB 資料不足時使用）
 */
function generateDefaultHourlyData(
  baseTemp: number,
  baseWind: number,
  baseDirection: number
): HourlyWeather[] {
  const data: HourlyWeather[] = []
  for (let i = 0; i < 24; i++) {
    data.push({
      time: `${String(i).padStart(2, '0')}:00`,
      temperature: baseTemp + Math.sin((i - 6) * Math.PI / 12) * 3, // 模擬日溫變化
      windSpeed: baseWind + (Math.random() - 0.5) * 2,
      windDirection: baseDirection + (Math.random() - 0.5) * 30,
      rainfall: Math.random() * 2,
    })
  }
  return data
}

/**
 * Stormglass API (海洋天氣和海況)
 */
async function getStormglassData(
  lat: number,
  lng: number,
  date?: string
): Promise<WeatherData> {
  const { apiKey, baseURL } = WEATHER_CONFIG.stormglass

  if (!apiKey) {
    throw new Error('Stormglass API Key 未設定')
  }

  const start = date
    ? new Date(date).toISOString()
    : new Date().toISOString()
  const end = new Date(new Date(start).getTime() + 24 * 60 * 60 * 1000).toISOString()

  const response = await fetch(
    `${baseURL}/weather/point?lat=${lat}&lng=${lng}&params=airTemperature,windSpeed,windDirection,humidity,visibility,precipitation&start=${start}&end=${end}`,
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
  const hourlyData: HourlyWeather[] = data.hours?.slice(0, 24).map((hour: any) => ({
    time: new Date(hour.time).toISOString().substring(11, 16),
    temperature: hour.airTemperature?.sg || 25,
    windSpeed: hour.windSpeed?.sg || 0,
    windDirection: hour.windDirection?.sg || 0,
    rainfall: hour.precipitation?.sg || 0,
  })) || []

  const current = data.hours?.[0] || {}
  const temp = current.airTemperature?.sg || 25
  const humidity = current.humidity?.sg || 70
  const windSpeed = current.windSpeed?.sg || 0

  // 計算體感溫度
  const feelsLike = calculateFeelsLike(temp, humidity, windSpeed)

  return {
    spotId: '',
    date: date || new Date().toISOString().split('T')[0],
    temperature: temp,
    feelsLike: feelsLike,
    windSpeed: windSpeed,
    windDirection: current.windDirection?.sg || 0,
    rainfall: current.precipitation?.sg || 0,
    humidity: humidity,
    visibility: (current.visibility?.sg || 10000) / 1000,
    hourlyData,
  }
}

