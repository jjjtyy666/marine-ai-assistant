import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Spot } from '@/types'
import { Button } from '@/components/ui/Button'
import { MessageCircle, Star } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface MapViewProps {
  spots: Spot[]
  selectedSpot: Spot | null
  onSpotClick: (spot: Spot) => void
  onChatClick: (spot: Spot) => void
  onFavoriteClick: (spot: Spot) => void
  favoriteSpots: string[]
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, 13)
  }, [center, map])
  return null
}

export default function MapView({
  spots,
  selectedSpot,
  onSpotClick,
  onChatClick,
  onFavoriteClick,
  favoriteSpots,
}: MapViewProps) {
  const center: [number, number] = selectedSpot
    ? selectedSpot.coordinates
    : [23.5, 121.0] // Taiwan center

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden">
      <MapContainer
        center={center}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {selectedSpot && <MapController center={selectedSpot.coordinates} />}
        
        {spots.map((spot) => (
          <Marker
            key={spot.id}
            position={spot.coordinates}
            eventHandlers={{
              click: () => onSpotClick(spot),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{spot.name}</h3>
                    <p className="text-xs text-gray-600">{spot.nameEn}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onFavoriteClick(spot)
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        favoriteSpots.includes(spot.id)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                </div>

                {spot.difficulty && (
                  <div className="mb-2">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                        spot.difficulty === 'beginner'
                          ? 'bg-green-100 text-green-700'
                          : spot.difficulty === 'intermediate'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
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

                <p className="text-sm text-gray-700 mb-3">{spot.description}</p>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onChatClick(spot)
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    <MessageCircle className="w-4 h-4" />
                    查詢
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

