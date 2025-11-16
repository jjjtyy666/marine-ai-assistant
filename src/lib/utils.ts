import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function getWindDirection(degree: number): string {
  const directions = ['北', '東北', '東', '東南', '南', '西南', '西', '西北']
  const index = Math.round(((degree % 360) / 45)) % 8
  return directions[index]
}

export function getWindDirectionArrow(degree: number): string {
  return `rotate(${degree}deg)`
}

export function getWaveCondition(height: number): { level: string; color: string } {
  if (height < 0.5) return { level: '平靜', color: 'text-green-500' }
  if (height < 1.0) return { level: '微浪', color: 'text-blue-500' }
  if (height < 2.0) return { level: '中浪', color: 'text-yellow-500' }
  if (height < 3.0) return { level: '大浪', color: 'text-orange-500' }
  return { level: '巨浪', color: 'text-red-500' }
}

export function getTideStatus(current: number, next: number): 'rising' | 'falling' {
  return current < next ? 'rising' : 'falling'
}

