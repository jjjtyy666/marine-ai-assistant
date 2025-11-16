import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-blue-50 to-cyan-50 dark:from-ocean-900 dark:via-slate-900 dark:to-slate-800">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}

