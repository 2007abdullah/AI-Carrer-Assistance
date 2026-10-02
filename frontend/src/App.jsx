import { Routes, Route, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Landing from './pages/Landing'
import UploadCV from './pages/UploadCV'
import Dashboard from './pages/Dashboard'
import CVAnalysis from './pages/CVAnalysis'
import SkillGap from './pages/SkillGap'
import CareerMatch from './pages/CareerMatch'
import JobMatcher from './pages/JobMatcher'
import Roadmap from './pages/Roadmap'

function Layout({ children }) {
  const location = useLocation()
  const bare = location.pathname === '/'
  if (bare) return children

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/upload" element={<UploadCV />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analysis" element={<CVAnalysis />} />
          <Route path="/skill-gap" element={<SkillGap />} />
          <Route path="/careers" element={<CareerMatch />} />
          <Route path="/job-matcher" element={<JobMatcher />} />
          <Route path="/roadmap" element={<Roadmap />} />
        </Routes>
      </Layout>
    </AppProvider>
  )
}
