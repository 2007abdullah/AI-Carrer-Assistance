import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { api } from '../services/api'
import ScoreRing from '../components/ScoreRing'
import ScoreBar from '../components/ScoreBar'

export default function Dashboard() {
  const { resumeId, filename, skills } = useApp()
  const [analysis, setAnalysis] = useState(null)
  const [careers, setCareers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!resumeId) return
    Promise.all([api.analyzeResume(resumeId), api.matchCareers(resumeId)])
      .then(([a, c]) => { setAnalysis(a); setCareers(c) })
      .finally(() => setLoading(false))
  }, [resumeId])

  if (!resumeId) return <Navigate to="/upload" replace />
  if (loading) return <div className="p-10 text-slate-400">Loading your dashboard...</div>

  const topCareer = careers[0]

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Career Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">{filename}</p>
        </div>
        <Link to="/upload" className="btn-secondary text-sm">Re-upload CV</Link>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-6">
        <div className="card flex flex-col items-center justify-center">
          <ScoreRing value={analysis.overall} label="Career Readiness" />
        </div>

        <div className="card md:col-span-2">
          <h3 className="font-semibold mb-4">Top Skills</h3>
          {Object.entries(analysis.scores).map(([label, value]) => (
            <ScoreBar key={label} label={label} value={value} />
          ))}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recommended Careers</h3>
          <Link to="/careers" className="text-sm text-accent hover:underline">See all</Link>
        </div>
        <div className="space-y-3">
          {careers.slice(0, 3).map((c) => (
            <div key={c.career} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
              <span className="font-medium">{c.career}</span>
              <span className="text-accent2 font-semibold">{c.compatibility}%</span>
            </div>
          ))}
        </div>
        {topCareer && (
          <p className="text-sm text-slate-400 mt-4">
            Your top match is <span className="text-slate-200 font-medium">{topCareer.career}</span> at {topCareer.compatibility}%.{' '}
            <Link to="/roadmap" className="text-accent hover:underline">Generate a roadmap</Link> for it.
          </p>
        )}
      </div>

      <div className="mt-6 text-sm text-slate-500">
        Detected {skills.length} skills: {skills.join(', ') || 'none yet'}
      </div>
    </div>
  )
}
