import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/providers/ThemeProvider'
import Layout from '@/components/layout/Layout'
import HomePage from '@/pages/HomePage'
import ChatPage from '@/pages/ChatPage'
import DashboardPage from '@/pages/DashboardPage'
import SpotsPage from '@/pages/SpotsPage'
import PlanPage from '@/pages/PlanPage'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="spots" element={<SpotsPage />} />
            <Route path="plan" element={<PlanPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App

