import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Star, MapPin, MessageCircle } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { Spot } from '@/types'

interface SpotListProps {
  spots: Spot[]
  selectedSpot: Spot | null
  onSpotClick: (spot: Spot) => void
  onChatClick: (spot: Spot) => void
  onFavoriteClick: (spot: Spot) => void
  favoriteSpots: string[]
}

export default function SpotList({
  spots,
  selectedSpot,
  onSpotClick,
  onChatClick,
  onFavoriteClick,
  favoriteSpots,
}: SpotListProps) {
  const [search, setSearch] = useState('')

  const filteredSpots = spots.filter((spot) =>
    spot.name.toLowerCase().includes(search.toLowerCase()) ||
    spot.nameEn.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-ocean-200 dark:border-ocean-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="搜尋地點..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Spot List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredSpots.map((spot, index) => {
          const isFavorite = favoriteSpots.includes(spot.id)
          const isSelected = selectedSpot?.id === spot.id

          return (
            <motion.div
              key={spot.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  isSelected
                    ? 'border-2 border-ocean-500 shadow-lg'
                    : 'hover:border-ocean-300'
                }`}
                onClick={() => onSpotClick(spot)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-ocean-400 to-ocean-600 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{spot.name}</h3>
                        <p className="text-xs text-muted-foreground">{spot.nameEn}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onFavoriteClick(spot)
                      }}
                      className="p-1 hover:bg-ocean-100 dark:hover:bg-ocean-800 rounded transition-colors"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          isFavorite
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-400'
                        }`}
                      />
                    </button>
                  </div>

                  {spot.type === 'surf' && spot.difficulty && (
                    <div className="mb-2">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                          spot.difficulty === 'beginner'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : spot.difficulty === 'intermediate'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        }`}
                      >
                        {spot.difficulty === 'beginner'
                          ? '新手'
                          : spot.difficulty === 'intermediate'
                          ? '中級'
                          : '進階'}
                      </span>
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {spot.description}
                  </p>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      onChatClick(spot)
                    }}
                    size="sm"
                    className="w-full"
                  >
                    <MessageCircle className="w-4 h-4" />
                    查詢海況
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

