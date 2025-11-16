import type { SeaStateData, HourlySeaState } from '@/types'

function generateHourlySeaState(baseHeight: number, basePeriod: number): HourlySeaState[] {
  const data: HourlySeaState[] = []
  const now = new Date()
  
  for (let i = 0; i < 24; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000)
    data.push({
      time: time.toISOString(),
      waveHeight: Math.max(0.2, baseHeight + Math.sin(i / 6) * 0.5 + (Math.random() - 0.5) * 0.3),
      wavePeriod: basePeriod + Math.sin(i / 5) * 1 + (Math.random() - 0.5) * 0.5,
      waveDirection: 120 + Math.sin(i / 4) * 20,
    })
  }
  
  return data
}

export function getMockSeaState(spotId: string, date: string): SeaStateData {
  const baseHeight = 0.8 + Math.random() * 1.5
  const basePeriod = 6 + Math.random() * 4
  
  return {
    spotId,
    date,
    waveHeight: baseHeight,
    wavePeriod: basePeriod,
    waveDirection: 120 + (Math.random() - 0.5) * 40,
    swellHeight: baseHeight * 0.7,
    currentSpeed: 0.3 + Math.random() * 0.5,
    currentDirection: 90 + (Math.random() - 0.5) * 60,
    hourlyData: generateHourlySeaState(baseHeight, basePeriod),
  }
}

