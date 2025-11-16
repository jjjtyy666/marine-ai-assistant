export interface Spot {
  id: string
  name: string
  nameEn: string
  coordinates: [number, number] // [lat, lng]
  type: 'surf' | 'station'
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  description: string
  isFavorite?: boolean
}

export interface WeatherData {
  spotId: string
  date: string
  temperature: number
  feelsLike: number
  windSpeed: number
  windDirection: number
  rainfall: number
  humidity: number
  visibility: number
  hourlyData: HourlyWeather[]
}

export interface HourlyWeather {
  time: string
  temperature: number
  windSpeed: number
  windDirection: number
  rainfall: number
}

export interface SeaStateData {
  spotId: string
  date: string
  waveHeight: number
  wavePeriod: number
  waveDirection: number
  swellHeight: number
  currentSpeed: number
  currentDirection: number
  hourlyData: HourlySeaState[]
}

export interface HourlySeaState {
  time: string
  waveHeight: number
  wavePeriod: number
  waveDirection: number
}

export interface TideData {
  spotId: string
  date: string
  currentHeight: number
  nextHigh: { time: string; height: number }
  nextLow: { time: string; height: number }
  hourlyData: HourlyTide[]
}

export interface HourlyTide {
  time: string
  height: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  toolCalls?: ToolCall[]
}

export interface ToolCall {
  type: 'weather' | 'seaState' | 'tide' | 'nearbyPOIs' | 'planDay' | 'route' | 'openHours'
  data: WeatherData | SeaStateData | TideData | POI[] | PlanDay | RouteInfo | OpenHoursData
  spotName: string
}

export type Theme = 'light' | 'dark'

// Planning & POI Types
export type Mobility = 'walk' | 'bike' | 'scooter' | 'car' | 'transit'
export type POICat = 'food' | 'cafe' | 'rental' | 'shower' | 'parking' | 'view' | 'culture'

export interface POI {
  id: string
  name: string
  cat: POICat
  lat: number
  lng: number
  price?: '$' | '$$' | '$$$'
  rating?: number
  tags?: string[]
  description?: string
  phone?: string
  address?: string
}

export interface OpenHours {
  [dow: string]: { open: string; close: string }[]
}

export interface OpenHoursData {
  [poiId: string]: OpenHours
}

export type PlanItemType = 'surf' | 'food' | 'cafe' | 'rental' | 'shower' | 'parking' | 'view' | 'culture' | 'move'

export interface MoveInfo {
  from?: string
  to?: string
  mode: Mobility
  mins: number
  km?: number
}

export interface PlanItemBase {
  type: PlanItemType
  start: string
  end: string
  notes?: string
}

export interface PlanPOIItem extends PlanItemBase {
  poiId?: string
  title?: string
  budget?: number
  move?: MoveInfo
}

export interface PlanDay {
  spotId: string
  date: string
  mobility: Mobility
  budget?: number
  timeline: PlanPOIItem[]
  estTotalCost?: number
  warnings?: string[]
}

export interface RouteInfo {
  stops: Array<{ lat: number; lng: number; name: string }>
  totalKm: number
  totalMins: number
  mobility: Mobility
}

export interface PlanPreferences {
  budget?: number
  radiusKm?: number
  mobility?: Mobility
  mustHave?: POICat[]
  dietaryPrefs?: string[]
  wantSunset?: boolean
  partySize?: number
}

