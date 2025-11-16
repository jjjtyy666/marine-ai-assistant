import type { PlanDay, PlanPOIItem, Mobility } from '@/types'
import { mockPOIs, getPOIsBySpot } from './poi'
import { getMockSeaState } from './seaStateData'
import { getMockWeather } from './weatherData'
import { calculateDistance, estimateTravelTime, minutesToTime, parseTimeToMinutes, getSunsetTime } from '@/lib/planningUtils'

export function generateDayPlan(
  spotId: string,
  date: string,
  startTime: string,
  endTime: string,
  mobility: Mobility,
  budget?: number,
  preferences?: {
    wantSunset?: boolean
    wantSeafood?: boolean
    needRental?: boolean
    needShower?: boolean
    maxPrice?: string
  }
): PlanDay {
  const pois = getPOIsBySpot(spotId)
  const seaState = getMockSeaState(spotId, date)
  const weather = getMockWeather(spotId, date)
  
  const timeline: PlanPOIItem[] = []
  const warnings: string[] = []
  
  let currentTime = parseTimeToMinutes(startTime)
  const endMinutes = parseTimeToMinutes(endTime)
  let totalCost = 0

  // 1. 清晨衝浪時段（06:30-08:30）
  if (currentTime <= 390) { // 06:30
    timeline.push({
      type: 'surf',
      title: '清晨衝浪',
      start: minutesToTime(Math.max(currentTime, 390)),
      end: minutesToTime(510), // 08:30
      notes: `浪高 ${seaState.waveHeight.toFixed(1)}m、週期 ${seaState.wavePeriod.toFixed(1)}s${seaState.waveHeight < 1.5 ? '，適合新手' : ''}`,
    })
    currentTime = 510
  }

  // 2. 淋浴（如需要）
  if (preferences?.needShower) {
    const showerPOI = pois.find(p => p.cat === 'shower')
    if (showerPOI) {
      timeline.push({
        type: 'shower',
        title: showerPOI.name,
        poiId: showerPOI.id,
        start: minutesToTime(currentTime + 5),
        end: minutesToTime(currentTime + 25),
        move: { mode: 'walk', mins: 5, km: 0.3 },
      })
      currentTime += 25
    }
  }

  // 3. 早餐/咖啡
  const cafePOI = pois.find(p => p.cat === 'cafe')
  if (cafePOI && currentTime < 630) { // 10:30 前
    const cost = cafePOI.price === '$' ? 100 : cafePOI.price === '$$' ? 200 : 300
    timeline.push({
      type: 'cafe',
      title: cafePOI.name,
      poiId: cafePOI.id,
      start: minutesToTime(currentTime + 10),
      end: minutesToTime(currentTime + 70),
      budget: cost,
      move: { mode: mobility, mins: 10, km: 1.2 },
    })
    totalCost += cost
    currentTime += 70
  }

  // 4. 午餐
  const foodPOI = pois.find(p => 
    p.cat === 'food' && 
    (preferences?.wantSeafood ? p.tags?.includes('海鮮') : true) &&
    (preferences?.maxPrice ? p.price === preferences.maxPrice : true)
  )
  if (foodPOI && currentTime < 840) { // 14:00 前
    const cost = foodPOI.price === '$' ? 150 : foodPOI.price === '$$' ? 350 : 600
    const travelMins = 15
    timeline.push({
      type: 'food',
      title: foodPOI.name,
      poiId: foodPOI.id,
      start: minutesToTime(currentTime + travelMins),
      end: minutesToTime(currentTime + travelMins + 60),
      budget: cost,
      move: { mode: mobility, mins: travelMins, km: 2.5 },
    })
    totalCost += cost
    currentTime += travelMins + 60

    // 檢查午休時段
    if (currentTime >= 840 && currentTime <= 1020) { // 14:00-17:00
      warnings.push(`${foodPOI.name}可能於 14:00-17:00 午休，請事先確認`)
    }
  }

  // 5. 文化景點
  const culturePOI = pois.find(p => p.cat === 'culture')
  if (culturePOI && currentTime < 960) { // 16:00 前
    timeline.push({
      type: 'culture',
      title: culturePOI.name,
      poiId: culturePOI.id,
      start: minutesToTime(currentTime + 15),
      end: minutesToTime(currentTime + 75),
      move: { mode: mobility, mins: 15, km: 3.0 },
    })
    currentTime += 75
  }

  // 6. 日落觀景（如需要）
  if (preferences?.wantSunset) {
    const viewPOI = pois.find(p => p.cat === 'view')
    if (viewPOI) {
      const sunsetTime = getSunsetTime(new Date(date), viewPOI.lat)
      const sunsetMinutes = parseTimeToMinutes(sunsetTime)
      const arriveTime = sunsetMinutes - 30 // 提前30分鐘到達
      
      if (currentTime < arriveTime) {
        timeline.push({
          type: 'view',
          title: viewPOI.name,
          poiId: viewPOI.id,
          start: minutesToTime(arriveTime),
          end: minutesToTime(sunsetMinutes + 30),
          notes: `日落時間 ${sunsetTime}`,
          move: { mode: mobility, mins: Math.ceil((arriveTime - currentTime) / 2), km: 2.0 },
        })
      }
    }
  }

  // 警告檢查
  if (budget && totalCost > budget) {
    warnings.push(`預估花費 $${totalCost} 超出預算 $${budget}`)
  }

  if (weather.windSpeed > 12) {
    warnings.push(`風速 ${weather.windSpeed.toFixed(1)} m/s 較強，騎乘${mobility === 'scooter' || mobility === 'bike' ? '機車/自行車' : ''}請小心`)
  }

  if (weather.rainfall > 50) {
    warnings.push(`降雨機率 ${Math.round(weather.rainfall)}%，建議攜帶雨具`)
  }

  return {
    spotId,
    date,
    mobility,
    budget,
    timeline,
    estTotalCost: totalCost,
    warnings,
  }
}

// 調整行程的輔助函數
export function adjustPlanItem(
  plan: PlanDay,
  action: 'replace' | 'remove' | 'add',
  index: number,
  newItem?: PlanPOIItem
): PlanDay {
  const timeline = [...plan.timeline]
  
  switch (action) {
    case 'replace':
      if (newItem && index < timeline.length) {
        timeline[index] = newItem
      }
      break
    case 'remove':
      timeline.splice(index, 1)
      break
    case 'add':
      if (newItem) {
        timeline.splice(index, 0, newItem)
      }
      break
  }

  // 重新計算成本
  let estTotalCost = 0
  timeline.forEach(item => {
    if (item.budget) estTotalCost += item.budget
  })

  return {
    ...plan,
    timeline,
    estTotalCost,
  }
}

