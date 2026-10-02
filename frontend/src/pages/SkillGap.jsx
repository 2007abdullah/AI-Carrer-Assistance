import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { api } from '../services/api'
import ScoreBar from '../components/ScoreBar'

export default function SkillGap() {
  const { resumeId, selectedCareer, setSelectedCareer } = useApp()
  const [careers, setCareers] = useState([])
  const [career, setCareer] = useState(selectedCareer || '')
  const [gaps, setGaps] = useState(null)

  useEffect(() => {
    if (resumeId) api.listCareers().then(setCareers)
  }, [resumeId])

  useEffect(() => {
    if (!career && careers.length) setCareer(careers[0].career)
  }, [careers])

  useEffect(() => {
    if (resumeId && career) {
      setGaps(null)
      api.skillGap(resumeId, career).then(setGaps)
      setSelectedCareer(career)
    }
  }, [career, resumeId])

  if (!resumeId) return <Navigate to="/upload" replace />

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold mb-1">Skill Gap</h1>
      <p className="text-slate-400 mb-6">Pick a target career to see exactly what's missing.</p>

      <select
        value={career}
        onChange={(e) => setCareer(e.target.value)}
        className="bg-surface border border-white/10 rounded-xl px-4 py-2.5 mb-8 w-full text-sm"
      >
        {careers.map((c) => <option key={c.career} value={c.career}>{c.career}</option>)}
      </select>

      <div className="card">
        {!gaps ? (
          <p className="text-slate-400 text-sm">Loading...</p>
        ) : gaps.length === 0 ? (
          <p className="text-emerald-400 text-sm">You already have every core skill for {career}. 🎉</p>
        ) : (
          gaps.map((g) => (
            <ScoreBar
              key={g.skill}
              label={g.skill}
              value={g.gap}
              colorClass={g.gap === 100 ? 'bg-rose-500' : 'bg-amber-400'}
            />
          ))
        )}
      </div>
      <p className="text-xs text-slate-500 mt-4">Bar shows how much of each required skill is still missing.</p>
    </div>
  )
}
