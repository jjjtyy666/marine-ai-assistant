import { motion } from 'framer-motion'
import { User, Waves, Copy, Check } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { ChatMessage, POI, PlanDay } from '@/types'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import WeatherCard from './WeatherCard'
import SeaStateCard from './SeaStateCard'
import TideCard from './TideCard'
import POIGroupList from '@/components/planning/POIGroupList'
import ItineraryTimeline from '@/components/planning/ItineraryTimeline'

interface MessageBubbleProps {
  message: ChatMessage
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-gradient-to-br from-ocean-500 to-ocean-600' 
          : 'bg-gradient-to-br from-cyan-500 to-teal-500'
      }`}>
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Waves className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`group relative ${isUser ? 'ml-auto' : 'mr-auto'}`}>
          <div className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-ocean-600 text-white rounded-tr-sm'
              : 'bg-white dark:bg-slate-800 border border-ocean-200 dark:border-ocean-700 rounded-tl-sm'
          }`}>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </p>

            {/* Copy Button */}
            {!isUser && (
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCopy}
                className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>

          {/* Timestamp */}
          <p className={`text-xs text-muted-foreground mt-1 px-2 ${isUser ? 'text-right' : 'text-left'}`}>
            {formatDate(message.timestamp)}
          </p>
        </div>

        {/* Tool Calls */}
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="space-y-3 mt-3">
            {message.toolCalls.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {tool.type === 'weather' && <WeatherCard data={tool.data} spotName={tool.spotName} />}
                {tool.type === 'seaState' && <SeaStateCard data={tool.data} spotName={tool.spotName} />}
                {tool.type === 'tide' && <TideCard data={tool.data} spotName={tool.spotName} />}
                {tool.type === 'nearbyPOIs' && (
                  <POIGroupList 
                    pois={tool.data as POI[]} 
                    spotName={tool.spotName}
                  />
                )}
                {tool.type === 'planDay' && (
                  <ItineraryTimeline 
                    plan={tool.data as PlanDay} 
                    spotName={tool.spotName}
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

