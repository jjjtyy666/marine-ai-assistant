import type { Mobility, PlanDay, RouteInfo, SeaStateData } from '@/types'

// Haversine 距離計算（km）
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // 地球半徑（km）
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180
}

// 根據交通方式估算時間（分鐘）
export function estimateTravelTime(distanceKm: number, mobility: Mobility): number {
  const speeds: Record<Mobility, number> = {
    walk: 4, // km/h
    bike: 15,
    scooter: 28,
    car: 30, // 市區
    transit: 20,
  }
  
  const speed = speeds[mobility]
  const hours = distanceKm / speed
  return Math.ceil(hours * 60)
}

// 格式化時間為 HH:MM
export function formatTime(hours: number, minutes: number): string {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

// 解析時間字串 "HH:MM" 為分鐘數
export function parseTimeToMinutes(timeStr: string): number {
  const [hours, mins] = timeStr.split(':').map(Number)
  return hours * 60 + mins
}

// 分鐘數轉時間字串
export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60
  return formatTime(hours, mins)
}

// 判斷是否為衝浪最佳時段（基於潮汐）
export function isGoodSurfTime(
  _time: string,
  seaState: SeaStateData
): boolean {
  // 簡化邏輯：浪高 0.5-2.5m 較適合，週期 > 6s
  return seaState.waveHeight >= 0.5 && seaState.waveHeight <= 2.5 && seaState.wavePeriod >= 6
}

// 取得日落時間（簡化版，實際應用可用 sunrise-sunset API）
export function getSunsetTime(date: Date, _lat: number): string {
  // 簡化：台灣夏季約 18:30，冬季約 17:30
  const month = date.getMonth() + 1
  const isSummer = month >= 5 && month <= 9
  return isSummer ? '18:30' : '17:32'
}

// 計算路線資訊
export function calculateRoute(
  stops: Array<{ lat: number; lng: number; name: string }>,
  mobility: Mobility
): RouteInfo {
  let totalKm = 0
  let totalMins = 0

  for (let i = 0; i < stops.length - 1; i++) {
    const km = calculateDistance(
      stops[i].lat,
      stops[i].lng,
      stops[i + 1].lat,
      stops[i + 1].lng
    )
    const mins = estimateTravelTime(km, mobility)
    totalKm += km
    totalMins += mins
  }

  return {
    stops,
    totalKm: Math.round(totalKm * 10) / 10,
    totalMins: Math.ceil(totalMins),
    mobility,
  }
}

// 檢查預算警告
export function checkBudgetWarnings(plan: PlanDay): string[] {
  const warnings: string[] = []
  
  if (plan.budget && plan.estTotalCost && plan.estTotalCost > plan.budget) {
    warnings.push(`預估花費 $${plan.estTotalCost} 超出預算 $${plan.budget}`)
  }

  return warnings
}

// 檢查時間衝突
export function checkTimeConflicts(plan: PlanDay): string[] {
  const warnings: string[] = []
  const timeline = plan.timeline

  for (let i = 0; i < timeline.length - 1; i++) {
    const current = timeline[i]
    const next = timeline[i + 1]
    
    if (current.end > next.start) {
      warnings.push(`${current.title || current.type} 與 ${next.title || next.type} 時間重疊`)
    }
  }

  return warnings
}

// 取得 POI 類別的中文名稱
export function getPOICategoryName(cat: string): string {
  const names: Record<string, string> = {
    food: '餐飲',
    cafe: '咖啡廳',
    rental: '租借店',
    shower: '淋浴間',
    parking: '停車場',
    view: '景觀點',
    culture: '文化景點',
  }
  return names[cat] || cat
}

// 取得價格範圍描述
export function getPriceRangeText(price?: string): string {
  const ranges: Record<string, string> = {
    '$': '100 元以下',
    '$$': '100-500 元',
    '$$$': '500 元以上',
  }
  return price ? ranges[price] : '價格未知'
}

// 取得交通方式圖標 emoji
export function getMobilityIcon(mobility: Mobility): string {
  const icons: Record<Mobility, string> = {
    walk: '🚶',
    bike: '🚲',
    scooter: '🛵',
    car: '🚗',
    transit: '🚌',
  }
  return icons[mobility]
}

// 取得交通方式中文名稱
export function getMobilityName(mobility: Mobility): string {
  const names: Record<Mobility, string> = {
    walk: '步行',
    bike: '自行車',
    scooter: '機車',
    car: '汽車',
    transit: '大眾運輸',
  }
  return names[mobility]
}

