import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface QuickPromptsProps {
  onSelect: (prompt: string) => void
}

export default function QuickPrompts({ onSelect }: QuickPromptsProps) {
  const { t } = useTranslation()

  const prompts = [
    t('chat.quickPrompts.prompt1'),
    t('chat.quickPrompts.prompt2'),
    t('chat.quickPrompts.prompt3'),
    '明天想在旗津安排一日輕旅行，機車移動、預算1500、想吃海鮮、一定要看日落',
    '幫我查詢金山附近有哪些餐廳和咖啡廳',
    '都歷周邊有租板店嗎？順便推薦淋浴的地方',
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-wrap gap-2 p-4 border-b border-ocean-200 dark:border-ocean-700"
    >
      <span className="text-sm text-muted-foreground mr-2">快速提示：</span>
      {prompts.map((prompt, index) => (
        <motion.button
          key={index}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(prompt)}
          className="px-3 py-1.5 text-xs bg-ocean-100 dark:bg-ocean-900 text-ocean-700 dark:text-ocean-300 rounded-full hover:bg-ocean-200 dark:hover:bg-ocean-800 transition-colors"
        >
          {prompt}
        </motion.button>
      ))}
    </motion.div>
  )
}

