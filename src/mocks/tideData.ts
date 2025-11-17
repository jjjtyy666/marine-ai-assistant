import type { TideData, HourlyTide } from '@/types'

function generateHourlyTide(): HourlyTide[] {
  const data: HourlyTide[] = []
  const now = new Date()
  
  for (let i = 0; i < 24; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000)
    // 模擬潮汐週期 (約12小時週期)
    const height = 1.5 + Math.sin((i / 12) * 2 * Math.PI) * 1.2
    data.push({
      time: time.toISOString(),
      height: Math.max(0.1, height),
    })
  }
  
  return data
}

export function getMockTide(spotId: string, date: string): TideData {
  const hourlyData = generateHourlyTide()
  
  // 找出下次高潮和低潮
  let maxHeight = 0
  let minHeight = 999
  let maxIndex = 0
  let minIndex = 0
  
  hourlyData.forEach((item, index) => {
    if (item.height > maxHeight) {
      maxHeight = item.height
      maxIndex = index
    }
    if (item.height < minHeight) {
      minHeight = item.height
      minIndex = index
    }
  })
  
  return {
    spotId,
    date,
    currentHeight: hourlyData[0].height,
    nextHigh: {
      time: hourlyData[maxIndex].time,
      height: maxHeight,
    },
    nextLow: {
      time: hourlyData[minIndex].time,
      height: minHeight,
    },
    hourlyData,
  }
}

