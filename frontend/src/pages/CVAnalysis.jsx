import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { CheckCircle2, AlertTriangle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { api } from '../services/api'
import ScoreBar from '../components/ScoreBar'

export default function CVAnalysis() {
  const { resumeId } = useApp()
  const [analysis, setAnalysis] = useState(null)

  useEffect(() => {
    if (resumeId) api.analyzeResume(resumeId).then(setAnalysis)
  }, [resumeId])

  if (!resumeId) return <Navigate to="/upload" replace />
  if (!analysis) return <div className="p-10 text-slate-400">Loading analysis...</div>

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold mb-1">CV Analysis</h1>
      <p className="text-slate-400 mb-8">Overall CV Profile: <span className="text-accent2 font-semibold">{analysis.overall}%</span></p>

      <div className="card mb-6">
        {Object.entries(analysis.scores).map(([label, value]) => (
          <ScoreBar key={label} label={label} value={value} />
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="card">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-emerald-400">
            <CheckCircle2 size={18} /> Strengths
          </h3>
          <ul className="space-y-2 text-sm text-slate-300">
            {analysis.strengths.map((s) => <li key={s}>✓ {s}</li>)}
          </ul>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-amber-400">
            <AlertTriangle size={18} /> Areas to improve
          </h3>
          <ul className="space-y-2 text-sm text-slate-300">
            {analysis.improvements.map((s) => <li key={s}>⚠ {s}</li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}
