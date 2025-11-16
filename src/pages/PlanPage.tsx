import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Calendar, MapPin, DollarSign, Users, Bike, Send } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { mockSpots } from '@/mocks/spots'
import { api } from '@/services/api'
import type { PlanDay, Mobility } from '@/types'
import ItineraryTimeline from '@/components/planning/ItineraryTimeline'
import POIGroupList from '@/components/planning/POIGroupList'
import { getMobilityIcon, getMobilityName } from '@/lib/planningUtils'

export default function PlanPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  
  const [selectedSpot, setSelectedSpot] = useState('cijin')
  const [date, setDate] = useState(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  })
  const [mobility, setMobility] = useState<Mobility>('scooter')
  const [budget, setBudget] = useState(1500)
  const [partySize, setPartySize] = useState(2)
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<PlanDay | null>(null)
  const [pois, setPois] = useState<any[]>([])

  const spots = mockSpots.filter(s => s.type === 'surf')
  const currentSpot = spots.find(s => s.id === selectedSpot)

  const mobilities: Mobility[] = ['walk', 'bike', 'scooter', 'car']

  const generatePlan = async () => {
    setLoading(true)
    try {
      const [planData, poisData] = await Promise.all([
        api.planDay(selectedSpot, date, '06:30', '18:30', mobility, budget, {
          wantSunset: true,
          wantSeafood: true,
          needShower: true,
        }),
        api.getNearbyPOIs(selectedSpot),
      ])
      setPlan(planData)
      setPois(poisData)
    } catch (error) {
      console.error('Failed to generate plan:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-ocean-900 dark:text-ocean-100">
          🗓️ 行程規劃
        </h1>
        <p className="text-muted-foreground mt-1">
          規劃您的海邊一日輕旅行，AI 會依據海況、天氣與預算為您安排
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Preferences */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Spot Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                選擇地點
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {spots.map((spot) => (
                <button
                  key={spot.id}
                  onClick={() => setSelectedSpot(spot.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all ${
                    selectedSpot === spot.id
                      ? 'bg-ocean-100 dark:bg-ocean-900 border-2 border-ocean-500'
                      : 'bg-muted hover:bg-muted/80 border-2 border-transparent'
                  }`}
                >
                  <p className="font-semibold">{spot.name}</p>
                  <p className="text-xs text-muted-foreground">{spot.nameEn}</p>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Date & Budget */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                基本設定
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">日期</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  預算 (NT$)
                </label>
                <Input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  min={500}
                  step={100}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  <Users className="w-4 h-4 inline mr-1" />
                  人數
                </label>
                <Input
                  type="number"
                  value={partySize}
                  onChange={(e) => setPartySize(Number(e.target.value))}
                  min={1}
                  max={10}
                />
              </div>
            </CardContent>
          </Card>

          {/* Mobility */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bike className="w-5 h-5" />
                交通方式
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {mobilities.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMobility(m)}
                    className={`p-3 rounded-xl text-center transition-all ${
                      mobility === m
                        ? 'bg-ocean-100 dark:bg-ocean-900 border-2 border-ocean-500'
                        : 'bg-muted hover:bg-muted/80 border-2 border-transparent'
                    }`}
                  >
                    <div className="text-2xl mb-1">{getMobilityIcon(m)}</div>
                    <div className="text-xs font-medium">{getMobilityName(m)}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button
            onClick={generatePlan}
            disabled={loading}
            size="lg"
            className="w-full"
          >
            <Send className="w-5 h-5 mr-2" />
            {loading ? '規劃中...' : '生成行程'}
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/chat')}
            className="w-full"
          >
            或使用 AI 對話規劃 →
          </Button>
        </motion.div>

        {/* Right: Plan Result */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {plan && currentSpot ? (
            <>
              <ItineraryTimeline plan={plan} spotName={currentSpot.name} />
              {pois.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <POIGroupList pois={pois} spotName={currentSpot.name} />
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="h-[600px] flex items-center justify-center">
              <CardContent className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-ocean-100 dark:bg-ocean-900 rounded-full flex items-center justify-center">
                  <Calendar className="w-10 h-10 text-ocean-600 dark:text-ocean-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">開始規劃您的行程</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  選擇地點、日期與交通方式，點擊「生成行程」按鈕，AI 會為您規劃完整的一日行程
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}

