import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import type { TideData } from '@/types'

interface TideCardProps {
  data: TideData
  spotName: string
}

export default function TideCard({ data, spotName }: TideCardProps) {
  const chartData = data.hourlyData.map(item => ({
    time: new Date(item.time).getHours() + ':00',
    height: Math.round(item.height * 100) / 100,
  }))

  const isRising = data.currentHeight < data.nextHigh.height

  return (
    <Card className="border-teal-200 dark:border-teal-800 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950 dark:to-emerald-950">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
            {isRising ? (
              <TrendingUp className="w-5 h-5 text-white" />
            ) : (
              <TrendingDown className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <CardTitle className="text-lg">潮汐資訊</CardTitle>
            <p className="text-sm text-muted-foreground">{spotName}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Tide */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">當前潮位</p>
            <div className={`flex items-center gap-1 text-sm font-semibold ${
              isRising ? 'text-green-600' : 'text-red-600'
            }`}>
              {isRising ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {isRising ? '漲潮中' : '退潮中'}
            </div>
          </div>
          <p className="text-3xl font-bold">{data.currentHeight.toFixed(2)} m</p>
        </div>

        {/* Next High/Low */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <p className="text-xs text-muted-foreground">下次高潮</p>
            </div>
            <p className="text-sm font-semibold">{data.nextHigh.height.toFixed(2)} m</p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(data.nextHigh.time).toLocaleTimeString('zh-TW', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>

          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl">
            <div className="flex items-center gap-1 mb-1">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <p className="text-xs text-muted-foreground">下次低潮</p>
            </div>
            <p className="text-sm font-semibold">{data.nextLow.height.toFixed(2)} m</p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(data.nextLow.time).toLocaleTimeString('zh-TW', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>

        {/* Tide Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-2">24小時潮汐曲線</p>
          <ResponsiveContainer width="100%" height={140}>
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
                width={35}
                domain={[0, 'auto']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255,255,255,0.95)', 
                  border: 'none', 
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <ReferenceLine 
                y={data.currentHeight} 
                stroke="#14b8a6" 
                strokeDasharray="3 3"
                label={{ value: '當前', fontSize: 10 }}
              />
              <Line 
                type="monotone" 
                dataKey="height" 
                stroke="#14b8a6" 
                strokeWidth={2}
                dot={false}
                name="潮位 (m)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

