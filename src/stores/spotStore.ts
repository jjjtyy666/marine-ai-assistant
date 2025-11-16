import { create } from 'zustand'
import type { Spot } from '@/types'

interface SpotState {
  favoriteSpots: string[]
  selectedSpot: Spot | null
  toggleFavorite: (spotId: string) => void
  setSelectedSpot: (spot: Spot | null) => void
}

const loadFavorites = (): string[] => {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem('favorite-spots')
  return stored ? JSON.parse(stored) : []
}

const saveFavorites = (favorites: string[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('favorite-spots', JSON.stringify(favorites))
  }
}

export const useSpotStore = create<SpotState>((set) => ({
  favoriteSpots: loadFavorites(),
  selectedSpot: null,
  toggleFavorite: (spotId) => set((state) => {
    const newFavorites = state.favoriteSpots.includes(spotId)
      ? state.favoriteSpots.filter(id => id !== spotId)
      : [...state.favoriteSpots, spotId]
    saveFavorites(newFavorites)
    return { favoriteSpots: newFavorites }
  }),
  setSelectedSpot: (spot) => set({ selectedSpot: spot }),
}))

