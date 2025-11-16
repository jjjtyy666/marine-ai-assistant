import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Wind, Waves, TrendingUp, Eye, Droplets, Thermometer, Navigation, AlertTriangle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { mockSpots } from '@/mocks/spots'
import { api } from '@/services/api'
import type { WeatherData, SeaStateData, TideData } from '@/types'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { getWindDirection } from '@/lib/utils'

export default function DashboardPage() {
  const { t } = useTranslation()
  const [selectedSpot, setSelectedSpot] = useState('cijin')
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [seaData, setSeaData] = useState<SeaStateData | null>(null)
  const [tideData, setTideData] = useState<TideData | null>(null)
  const [loading, setLoading] = useState(true)

  const spots = mockSpots.filter(s => s.type === 'surf')
  const currentSpot = spots.find(s => s.id === selectedSpot)

  useEffect(() => {
    loadData()
  }, [selectedSpot])

  const loadData = async () => {
    setLoading(true)
    try {
      const [weather, sea, tide] = await Promise.all([
        api.getWeather(selectedSpot),
        api.getSeaState(selectedSpot),
        api.getTide(selectedSpot),
      ])
      setWeatherData(weather)
      setSeaData(sea)
      setTideData(tide)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !weatherData || !seaData || !tideData) {
    return (
      <div className="h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-ocean-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">載入中...</p>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const windChartData = weatherData.hourlyData.map(item => ({
    time: new Date(item.time).getHours() + ':00',
    speed: Math.round(item.windSpeed * 10) / 10,
    direction: item.windDirection,
  }))

  const waveChartData = seaData.hourlyData.map(item => ({
    time: new Date(item.time).getHours() + ':00',
    height: Math.round(item.waveHeight * 10) / 10,
    period: Math.round(item.wavePeriod * 10) / 10,
  }))

  const tideChartData = tideData.hourlyData.map(item => ({
    time: new Date(item.time).getHours() + ':00',
    height: Math.round(item.height * 100) / 100,
  }))

  const rainVisData = weatherData.hourlyData.slice(0, 12).map(item => ({
    time: new Date(item.time).getHours() + ':00',
    rain: Math.round(item.rainfall),
    visibility: Math.round(weatherData.visibility * 10) / 10,
  }))

  // Warnings
  const warnings = []
  if (seaData.waveHeight > 2) {
    warnings.push({ type: 'wave', message: '浪高超過 2m，請注意安全' })
  }
  if (weatherData.windSpeed > 12) {
    warnings.push({ type: 'wind', message: '陣風超過 12 m/s，建議謹慎評估' })
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-ocean-900 dark:text-ocean-100">
            {t('dashboard.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            即時監控風浪潮汐等關鍵指標
          </p>
        </div>

        {/* Spot Selector */}
        <div className="flex gap-2 flex-wrap">
          {spots.map((spot) => (
            <Button
              key={spot.id}
              variant={selectedSpot === spot.id ? 'default' : 'outline'}
              onClick={() => setSelectedSpot(spot.id)}
              size="sm"
            >
              {spot.name}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-yellow-800 dark:text-yellow-200">警示訊息</p>
                  {warnings.map((warning, index) => (
                    <p key={index} className="text-sm text-yellow-700 dark:text-yellow-300">
                      • {warning.message}
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Wind, label: '風速', value: `${weatherData.windSpeed.toFixed(1)} m/s`, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-950' },
          { icon: Navigation, label: '風向', value: getWindDirection(weatherData.windDirection), color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950' },
          { icon: Waves, label: '浪高', value: `${seaData.waveHeight.toFixed(1)} m`, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-950' },
          { icon: TrendingUp, label: '週期', value: `${seaData.wavePeriod.toFixed(1)} 秒`, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950' },
          { icon: TrendingUp, label: '潮位', value: `${tideData.currentHeight.toFixed(2)} m`, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950' },
          { icon: Eye, label: '能見度', value: `${weatherData.visibility.toFixed(1)} km`, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950' },
          { icon: Droplets, label: '降雨機率', value: `${Math.round(weatherData.rainfall)}%`, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950' },
          { icon: Thermometer, label: '體感溫度', value: `${Math.round(weatherData.feelsLike)}°C`, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950' },
        ].map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={kpi.bg}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-8 h-8 ${kpi.color}`} />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">{kpi.label}</p>
                      <p className="text-xl font-bold">{kpi.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wind Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-cyan-500" />
                風速/風向 (24小時)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={windChartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="time" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      border: 'none',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="speed"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    name="風速 (m/s)"
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Wave Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waves className="w-5 h-5 text-teal-500" />
                浪高/週期
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={waveChartData}>
                  <defs>
                    <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="time" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      border: 'none',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="height"
                    stroke="#14b8a6"
                    strokeWidth={2}
                    fill="url(#waveGradient)"
                    name="浪高 (m)"
                  />
                  <Line
                    type="monotone"
                    dataKey="period"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="週期 (秒)"
                    dot={{ r: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tide Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                潮汐曲線
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={tideChartData}>
                  <defs>
                    <linearGradient id="tideGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="time" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      border: 'none',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="height"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#tideGradient)"
                    name="潮位 (m)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Rain/Visibility Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                降雨/能見度
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={rainVisData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="time" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      border: 'none',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="rain" fill="#3b82f6" name="降雨機率 (%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

