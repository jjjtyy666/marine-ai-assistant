import { motion } from 'framer-motion'
import type { POI } from '@/types'
import POICard from './POICard'
import { getPOICategoryName } from '@/lib/planningUtils'

interface POIGroupListProps {
  pois: POI[]
  spotName: string
  favorites?: string[]
  onToggleFavorite?: (poi: POI) => void
}

export default function POIGroupList({
  pois,
  spotName,
  favorites = [],
  onToggleFavorite,
}: POIGroupListProps) {
  // 依類別分組
  const grouped = pois.reduce((acc, poi) => {
    if (!acc[poi.cat]) acc[poi.cat] = []
    acc[poi.cat].push(poi)
    return acc
  }, {} as Record<string, POI[]>)

  const categories = Object.keys(grouped).sort()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="border-l-4 border-cyan-500 pl-3">
        <h3 className="font-semibold text-lg">📍 {spotName} 附近景點</h3>
        <p className="text-sm text-muted-foreground mt-1">
          找到 {pois.length} 個地點 · {categories.length} 個類別
        </p>
      </div>

      {/* POI Groups */}
      {categories.map((cat) => (
        <div key={cat} className="space-y-3">
          <h4 className="font-semibold text-base flex items-center gap-2">
            {getPOICategoryName(cat)}
            <span className="text-xs text-muted-foreground font-normal">
              ({grouped[cat].length})
            </span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {grouped[cat].map((poi) => (
              <POICard
                key={poi.id}
                poi={poi}
                isFavorite={favorites.includes(poi.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  )
}

