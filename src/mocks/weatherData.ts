import type { WeatherData, HourlyWeather } from '@/types'

function generateHourlyWeather(baseTemp: number, baseWind: number): HourlyWeather[] {
  const data: HourlyWeather[] = []
  const now = new Date()
  
  for (let i = 0; i < 24; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000)
    data.push({
      time: time.toISOString(),
      temperature: baseTemp + Math.sin(i / 3) * 3 + (Math.random() - 0.5) * 2,
      windSpeed: baseWind + Math.sin(i / 4) * 2 + (Math.random() - 0.5) * 1,
      windDirection: 180 + Math.sin(i / 5) * 30,
      rainfall: Math.max(0, Math.random() * 5),
    })
  }
  
  return data
}

/**
 * 計算體感溫度
 */
function calculateFeelsLike(
  temperature: number,
  humidity: number,
  windSpeed: number
): number {
  // 如果風速很低且溫度適中，使用熱指數公式
  if (temperature >= 27 && humidity > 40) {
    const hi = 
      0.5 * (temperature + 61.0 + ((temperature - 68.0) * 1.2) + (humidity * 0.094))
    
    if (windSpeed > 0) {
      const windChill = 13.12 + 0.6215 * temperature - 11.37 * Math.pow(windSpeed, 0.16) + 0.3965 * temperature * Math.pow(windSpeed, 0.16)
      return (hi + windChill) / 2
    }
    
    return hi
  }
  
  if (temperature < 10 && windSpeed > 0) {
    return 13.12 + 0.6215 * temperature - 11.37 * Math.pow(windSpeed, 0.16) + 0.3965 * temperature * Math.pow(windSpeed, 0.16)
  }
  
  let feelsLike = temperature
  
  if (humidity > 60) {
    feelsLike += (humidity - 60) * 0.05
  }
  
  if (windSpeed > 0) {
    feelsLike -= windSpeed * 0.3
  }
  
  return Math.round(feelsLike * 10) / 10
}

export function getMockWeather(spotId: string, date: string): WeatherData {
  const baseTemp = 24 + Math.random() * 6
  const baseWind = 5 + Math.random() * 8
  const humidity = 60 + Math.random() * 30
  
  // 計算正確的體感溫度
  const feelsLike = calculateFeelsLike(baseTemp, humidity, baseWind)
  
  return {
    spotId,
    date,
    temperature: baseTemp,
    feelsLike: feelsLike,
    windSpeed: baseWind,
    windDirection: 180 + (Math.random() - 0.5) * 60,
    rainfall: Math.random() * 30,
    humidity: humidity,
    visibility: 8 + Math.random() * 7,
    hourlyData: generateHourlyWeather(baseTemp, baseWind),
  }
}

