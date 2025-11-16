import { motion } from 'framer-motion'
import { Star, MapPin, Phone, DollarSign, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { POI } from '@/types'
import { getPOICategoryName, getPriceRangeText } from '@/lib/planningUtils'

interface POICardProps {
  poi: POI
  isFavorite?: boolean
  onToggleFavorite?: (poi: POI) => void
  onAddToPlan?: (poi: POI) => void
}

export default function POICard({
  poi,
  isFavorite,
  onToggleFavorite,
  onAddToPlan,
}: POICardProps) {
  const categoryIcons: Record<string, string> = {
    food: '🍽️',
    cafe: '☕',
    rental: '🏄',
    shower: '🚿',
    parking: '🅿️',
    view: '🌅',
    culture: '🏛️',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-start gap-2 flex-1">
              <span className="text-2xl">{categoryIcons[poi.cat] || '📍'}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-base">{poi.name}</h3>
                <p className="text-xs text-muted-foreground">{getPOICategoryName(poi.cat)}</p>
              </div>
            </div>
            <button
              onClick={() => onToggleFavorite?.(poi)}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              <Star
                className={`w-5 h-5 ${
                  isFavorite
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground'
                }`}
              />
            </button>
          </div>

          {poi.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {poi.description}
            </p>
          )}

          {/* Info Row */}
          <div className="flex flex-wrap gap-2 mb-3">
            {poi.rating && (
              <Badge variant="secondary" className="text-xs">
                ⭐ {poi.rating.toFixed(1)}
              </Badge>
            )}
            {poi.price && (
              <Badge variant="outline" className="text-xs">
                <DollarSign className="w-3 h-3 mr-1" />
                {poi.price}
              </Badge>
            )}
            {poi.tags?.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Address */}
          {poi.address && (
            <div className="flex items-start gap-1 text-xs text-muted-foreground mb-2">
              <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1">{poi.address}</span>
            </div>
          )}

          {/* Phone */}
          {poi.phone && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="w-3 h-3" />
              <span>{poi.phone}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

