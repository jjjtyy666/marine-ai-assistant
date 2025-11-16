import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { mockSpots } from '@/mocks/spots'
import { useSpotStore } from '@/stores/spotStore'
import type { Spot } from '@/types'
import MapView from '@/components/map/MapView'
import SpotList from '@/components/map/SpotList'

export default function SpotsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { favoriteSpots, toggleFavorite, setSelectedSpot } = useSpotStore()
  const [localSelectedSpot, setLocalSelectedSpot] = useState<Spot | null>(null)

  const handleSpotClick = (spot: Spot) => {
    setLocalSelectedSpot(spot)
    setSelectedSpot(spot)
  }

  const handleChatClick = (spot: Spot) => {
    navigate(`/chat?spot=${spot.id}`)
  }

  const handleFavoriteClick = (spot: Spot) => {
    toggleFavorite(spot.id)
  }

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h1 className="text-3xl font-bold text-ocean-900 dark:text-ocean-100">
          {t('spots.title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          探索熱門衝浪點與近岸站點
        </p>
      </motion.div>

      {/* Map and List */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        {/* Spot List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 h-[600px] lg:h-auto"
        >
          <div className="h-full bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-ocean-200 dark:border-ocean-700 overflow-hidden">
            <SpotList
              spots={mockSpots}
              selectedSpot={localSelectedSpot}
              onSpotClick={handleSpotClick}
              onChatClick={handleChatClick}
              onFavoriteClick={handleFavoriteClick}
              favoriteSpots={favoriteSpots}
            />
          </div>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 h-[600px] lg:h-auto"
        >
          <div className="h-full bg-white dark:bg-slate-900 rounded-2xl shadow-lg border-2 border-ocean-200 dark:border-ocean-700 overflow-hidden">
            <MapView
              spots={mockSpots}
              selectedSpot={localSelectedSpot}
              onSpotClick={handleSpotClick}
              onChatClick={handleChatClick}
              onFavoriteClick={handleFavoriteClick}
              favoriteSpots={favoriteSpots}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

