import { Waves, Activity, Navigation } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { SeaStateData } from '@/types'
import { getWaveCondition } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

interface SeaStateCardProps {
  data: SeaStateData
  spotName: string
}

export default function SeaStateCard({ data, spotName }: SeaStateCardProps) {
  const waveCondition = getWaveCondition(data.waveHeight)
  
  const chartData = data.hourlyData.slice(0, 12).map(item => ({
    time: new Date(item.time).getHours() + ':00',
    height: Math.round(item.waveHeight * 10) / 10,
    period: Math.round(item.wavePeriod * 10) / 10,
  }))

  return (
    <Card className="border-cyan-200 dark:border-cyan-800 bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950 dark:to-teal-950">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
              <Waves className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">海況資訊</CardTitle>
              <p className="text-sm text-muted-foreground">{spotName}</p>
            </div>
          </div>
          <Badge variant={data.waveHeight > 2 ? 'warning' : 'success'}>
            {waveCondition.level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl">
            <Waves className="w-5 h-5 text-cyan-500" />
            <div>
              <p className="text-xs text-muted-foreground">浪高</p>
              <p className="text-lg font-bold">{data.waveHeight.toFixed(1)} m</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl">
            <Activity className="w-5 h-5 text-teal-500" />
            <div>
              <p className="text-xs text-muted-foreground">週期</p>
              <p className="text-lg font-bold">{data.wavePeriod.toFixed(1)} 秒</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl">
            <Navigation className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">浪向</p>
              <p className="text-lg font-bold">{Math.round(data.waveDirection)}°</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl">
            <Waves className="w-5 h-5 text-indigo-500" />
            <div>
              <p className="text-xs text-muted-foreground">湧浪高</p>
              <p className="text-lg font-bold">{data.swellHeight.toFixed(1)} m</p>
            </div>
          </div>
        </div>

        {/* Mini Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-2">未來12小時浪高趨勢</p>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
              <Area 
                type="monotone" 
                dataKey="height" 
                stroke="#06b6d4" 
                strokeWidth={2}
                fill="url(#waveGradient)"
                name="浪高 (m)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Warning */}
        {data.waveHeight > 2 && (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-xl p-3">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ 浪況較大，建議有經驗者前往，新手請謹慎評估
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

