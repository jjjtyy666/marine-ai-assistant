import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useChatStore } from '@/stores/chatStore'
import { api } from '@/services/api'
import { Card } from '@/components/ui/Card'
import MessageBubble from '@/components/chat/MessageBubble'
import ChatInput from '@/components/chat/ChatInput'
import QuickPrompts from '@/components/chat/QuickPrompts'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ChatPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const spotId = searchParams.get('spot')
  
  const { messages, isLoading, addMessage, setLoading } = useChatStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // 如果有 spotId，自動發送初始訊息
    if (spotId && messages.length === 0) {
      handleSendMessage(`幫我查詢 ${spotId} 的海況資訊`)
    }
  }, [spotId])

  const handleSendMessage = async (content: string) => {
    // 添加用戶訊息
    const userMessage = {
      id: `msg-${Date.now()}`,
      role: 'user' as const,
      content,
      timestamp: new Date(),
    }
    addMessage(userMessage)

    // 發送到 API
    setLoading(true)
    try {
      const response = await api.sendChatMessage(content, messages)
      addMessage(response)
    } catch (error) {
      console.error('Failed to send message:', error)
      addMessage({
        id: `msg-error-${Date.now()}`,
        role: 'assistant',
        content: '抱歉，發生錯誤，請稍後再試。',
        timestamp: new Date(),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h1 className="text-3xl font-bold text-ocean-900 dark:text-ocean-100">
          {t('chat.title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          詢問海況、天氣、潮汐或獲取專業建議
        </p>
      </motion.div>

      <Card className="flex-1 flex flex-col overflow-hidden border-2 border-ocean-200 dark:border-ocean-700">
        {/* Quick Prompts */}
        {messages.length === 0 && <QuickPrompts onSelect={handleSendMessage} />}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex items-center justify-center"
            >
              <div className="text-center max-w-md space-y-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-ocean-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
                  <img 
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E"
                    alt="AI"
                    className="w-12 h-12"
                  />
                </div>
                <h2 className="text-2xl font-bold text-ocean-900 dark:text-ocean-100">
                  您好！我是 Marine AI Assistant
                </h2>
                <p className="text-muted-foreground">
                  我可以幫您查詢海況、天氣、潮汐資訊，並提供專業的海洋活動建議。
                  請告訴我您想了解什麼！
                </p>
              </div>
            </motion.div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  </div>
                  <div className="bg-white dark:bg-slate-800 border border-ocean-200 dark:border-ocean-700 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-ocean-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-ocean-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-ocean-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </Card>
    </div>
  )
}

