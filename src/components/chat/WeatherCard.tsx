import { Cloud, Wind, Droplets, Eye, ThermometerSun } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { WeatherData } from '@/types'
import { getWindDirection } from '@/lib/utils'

interface WeatherCardProps {
  data: WeatherData
  spotName: string
}

export default function WeatherCard({ data, spotName }: WeatherCardProps) {
  const chartData = data.hourlyData.slice(0, 12).map(item => ({
    time: new Date(item.time).getHours() + ':00',
    temp: Math.round(item.temperature),
    wind: Math.round(item.windSpeed * 10) / 10,
  }))

  return (
    <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <Cloud className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">天氣資訊</CardTitle>
            <p className="text-sm text-muted-foreground">{spotName}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl">
            <ThermometerSun className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-xs text-muted-foreground">溫度</p>
              <p className="text-lg font-bold">{Math.round(data.temperature)}°C</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl">
            <Wind className="w-5 h-5 text-cyan-500" />
            <div>
              <p className="text-xs text-muted-foreground">風速</p>
              <p className="text-lg font-bold">{data.windSpeed.toFixed(1)} m/s</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl">
            <Droplets className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">降雨機率</p>
              <p className="text-lg font-bold">{Math.round(data.rainfall)}%</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl">
            <Eye className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-xs text-muted-foreground">能見度</p>
              <p className="text-lg font-bold">{data.visibility.toFixed(1)} km</p>
            </div>
          </div>
        </div>

        {/* Mini Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-2">未來12小時趨勢</p>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={chartData}>
              <XAxis 
                dataKey="time" 
                stroke="#888" 
                fontSize={10}
                tickLine={false}
              />
              <YAxis 
                stroke="#888" 
                fontSize={10}
                tickLine={false}
                width={30}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255,255,255,0.95)', 
                  border: 'none', 
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="temp" 
                stroke="#f97316" 
                strokeWidth={2}
                dot={false}
                name="溫度 (°C)"
              />
              <Line 
                type="monotone" 
                dataKey="wind" 
                stroke="#06b6d4" 
                strokeWidth={2}
                dot={false}
                name="風速 (m/s)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

