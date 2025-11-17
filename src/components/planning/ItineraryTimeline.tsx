import { motion } from 'framer-motion'
import { Clock, DollarSign, AlertTriangle, Navigation } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { PlanDay } from '@/types'
import { getMobilityIcon, getMobilityName } from '@/lib/planningUtils'

interface ItineraryTimelineProps {
  plan: PlanDay
  spotName: string
}

export default function ItineraryTimeline({ plan, spotName }: ItineraryTimelineProps) {
  const typeColors: Record<string, string> = {
    surf: 'bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300',
    food: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
    cafe: 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
    rental: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    shower: 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300',
    view: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
    culture: 'bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300',
  }

  const typeIcons: Record<string, string> = {
    surf: '🏄',
    food: '🍽️',
    cafe: '☕',
    rental: '🏄‍♂️',
    shower: '🚿',
    parking: '🅿️',
    view: '🌅',
    culture: '🏛️',
  }

  return (
    <Card className="border-cyan-200 dark:border-cyan-800 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              📅 {spotName} 一日行程
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {plan.date} · {getMobilityIcon(plan.mobility)} {getMobilityName(plan.mobility)}
            </p>
          </div>
          {plan.budget && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">預算</p>
              <p className={`text-lg font-bold ${
                plan.estTotalCost && plan.estTotalCost > plan.budget
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-green-600 dark:text-green-400'
              }`}>
                ${plan.estTotalCost || 0}
              </p>
              <p className="text-xs text-muted-foreground">/ ${plan.budget}</p>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Warnings */}
        {plan.warnings && plan.warnings.length > 0 && (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                {plan.warnings.map((warning, i) => (
                  <p key={i} className="text-sm text-yellow-800 dark:text-yellow-200">
                    {warning}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="relative space-y-4">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-300 to-blue-300 dark:from-cyan-700 dark:to-blue-700" />

          {plan.timeline.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-14"
            >
              {/* Icon Circle */}
              <div className={`absolute left-3 top-2 w-6 h-6 rounded-full flex items-center justify-center ${
                typeColors[item.type] || 'bg-gray-100 dark:bg-gray-800'
              }`}>
                <span className="text-xs">{typeIcons[item.type] || '📍'}</span>
              </div>

              {/* Content Card */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{item.title || item.type}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {item.start} - {item.end}
                      </Badge>
                      {item.budget && (
                        <Badge variant="secondary" className="text-xs">
                          <DollarSign className="w-3 h-3 mr-1" />
                          ${item.budget}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Move Info */}
                {item.move && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded">
                    <Navigation className="w-3 h-3" />
                    <span>
                      {getMobilityIcon(item.move.mode)} {item.move.mins} 分鐘
                      {item.move.km && ` · ${item.move.km.toFixed(1)} km`}
                    </span>
                  </div>
                )}

                {/* Notes */}
                {item.notes && (
                  <p className="text-sm text-muted-foreground mt-2">
                    💡 {item.notes}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 mt-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground">活動數量</p>
              <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                {plan.timeline.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">預估花費</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${plan.estTotalCost || 0}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

