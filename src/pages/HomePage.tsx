import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MessageCircle, LayoutDashboard, MapPin, Waves, Wind, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { motion } from 'framer-motion'
import { mockSpots } from '@/mocks/spots'

export default function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const popularSpots = mockSpots.filter(s => s.type === 'surf').slice(0, 3)

  const features = [
    {
      icon: MessageCircle,
      title: t('home.features.chat.title'),
      description: t('home.features.chat.description'),
      path: '/chat',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: LayoutDashboard,
      title: t('home.features.dashboard.title'),
      description: t('home.features.dashboard.description'),
      path: '/dashboard',
      gradient: 'from-cyan-500 to-teal-500',
    },
    {
      icon: MapPin,
      title: t('home.features.spots.title'),
      description: t('home.features.spots.description'),
      path: '/spots',
      gradient: 'from-teal-500 to-green-500',
    },
  ]

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ocean-600 via-ocean-700 to-ocean-900 p-12 md:p-20 text-white"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-4"
          >
            <Waves className="w-12 h-12 text-white animate-wave" />
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            {t('home.hero.title')}
          </h1>
          
          <p className="text-xl md:text-2xl text-ocean-100 max-w-2xl mx-auto">
            {t('home.hero.description')}
          </p>

          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => navigate('/chat')}
              className="bg-white text-ocean-900 hover:bg-ocean-50 shadow-2xl text-lg px-8"
            >
              <MessageCircle className="w-5 h-5" />
              {t('home.hero.cta')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 text-lg px-8"
            >
              <LayoutDashboard className="w-5 h-5" />
              {t('nav.dashboard')}
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-blue-400/20 rounded-full blur-3xl"></div>
      </motion.section>

      {/* Features Section */}
      <section className="space-y-8">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-ocean-900 dark:text-ocean-100"
        >
          核心功能
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.path}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="cursor-pointer hover:scale-105 transition-transform duration-300 border-0 overflow-hidden group"
                  onClick={() => navigate(feature.path)}
                >
                  <div className={`h-2 bg-gradient-to-r ${feature.gradient}`}></div>
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-full h-full text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Popular Spots Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl md:text-4xl font-bold text-ocean-900 dark:text-ocean-100">
            {t('home.popularSpots')}
          </h2>
          <Button variant="ghost" onClick={() => navigate('/spots')}>
            查看全部 →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularSpots.map((spot, index) => (
            <motion.div
              key={spot.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="cursor-pointer hover:shadow-2xl transition-all group overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-ocean-400 to-ocean-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0id2F2ZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMCAyMCBRMTAgMTAgMjAgMjAgVDQwIDIwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCN3YXZlKSIvPjwvc3ZnPg==')] opacity-50"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Waves className="w-16 h-16 text-white opacity-50 group-hover:scale-125 transition-transform" />
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{spot.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{spot.nameEn}</p>
                    </div>
                    {spot.difficulty && (
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        spot.difficulty === 'beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                        spot.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                        'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {spot.difficulty === 'beginner' ? '新手' : spot.difficulty === 'intermediate' ? '中級' : '進階'}
                      </div>
                    )}
                  </div>
                  <CardDescription className="mt-2 line-clamp-2">
                    {spot.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    onClick={() => navigate(`/chat?spot=${spot.id}`)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    查詢海況
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Waves, label: '衝浪點', value: '50+', gradient: 'from-blue-500 to-cyan-500' },
          { icon: Wind, label: '即時監測站', value: '20+', gradient: 'from-cyan-500 to-teal-500' },
          { icon: TrendingUp, label: '預報準確度', value: '95%', gradient: 'from-teal-500 to-green-500' },
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center border-0 shadow-xl">
                <CardContent className="pt-6">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${stat.gradient} p-3 mb-4`}>
                    <Icon className="w-full h-full text-white" />
                  </div>
                  <div className="text-4xl font-bold text-ocean-900 dark:text-ocean-100 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </section>
    </div>
  )
}

