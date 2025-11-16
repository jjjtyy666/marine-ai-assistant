import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Waves, MessageCircle, LayoutDashboard, MapPin, Calendar, Moon, Sun } from 'lucide-react'
import { useThemeStore } from '@/stores/themeStore'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function Navbar() {
  const { t } = useTranslation()
  const location = useLocation()
  const { theme, toggleTheme } = useThemeStore()

  const navItems = [
    { path: '/', label: t('nav.home'), icon: Waves },
    { path: '/chat', label: t('nav.chat'), icon: MessageCircle },
    { path: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { path: '/spots', label: t('nav.spots'), icon: MapPin },
    { path: '/plan', label: '行程規劃', icon: Calendar },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-slate-900/70 border-b border-ocean-200 dark:border-ocean-700 shadow-lg"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Waves className="w-8 h-8 text-ocean-600 dark:text-ocean-400 group-hover:animate-wave" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-ocean-900 dark:text-ocean-100">
                Marine AI
              </span>
              <span className="text-xs text-ocean-600 dark:text-ocean-400 -mt-1">
                海洋智慧助理
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className={cn(
                      'gap-2',
                      isActive && 'shadow-lg'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden border-t border-ocean-200 dark:border-ocean-700">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path} className="flex-1">
                <button
                  className={cn(
                    'w-full flex flex-col items-center gap-1 py-2 transition-colors',
                    isActive
                      ? 'text-ocean-600 dark:text-ocean-400'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </button>
              </Link>
            )
          })}
        </div>
      </div>
    </motion.nav>
  )
}

