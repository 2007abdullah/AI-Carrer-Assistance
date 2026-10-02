import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { api } from '../services/api'

export default function Roadmap() {
  const { resumeId, selectedCareer, setSelectedCareer } = useApp()
  const [careers, setCareers] = useState([])
  const [career, setCareer] = useState(selectedCareer || '')
  const [roadmap, setRoadmap] = useState(null)

  useEffect(() => {
    if (resumeId) api.listCareers().then(setCareers)
  }, [resumeId])

  useEffect(() => {
    if (!career && careers.length) setCareer(careers[0].career)
  }, [careers])

  useEffect(() => {
    if (resumeId && career) {
      setRoadmap(null)
      api.generateRoadmap(resumeId, career).then(setRoadmap)
      setSelectedCareer(career)
    }
  }, [career, resumeId])

  if (!resumeId) return <Navigate to="/upload" replace />

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold mb-1">Learning Roadmap</h1>
      <p className="text-slate-400 mb-6">A personalized plan - skills you already know are skipped.</p>

      <select
        value={career}
        onChange={(e) => setCareer(e.target.value)}
        className="bg-surface border border-white/10 rounded-xl px-4 py-2.5 mb-8 w-full text-sm"
      >
        {careers.map((c) => <option key={c.career} value={c.career}>{c.career}</option>)}
      </select>

      {!roadmap ? (
        <p className="text-slate-400 text-sm">Loading...</p>
      ) : roadmap.weeks.length === 0 ? (
        <div className="card text-emerald-400 text-sm">{roadmap.message}</div>
      ) : (
        <>
          {roadmap.skipped_note && (
            <p className="text-xs text-slate-500 mb-4">{roadmap.skipped_note}</p>
          )}
          <div className="space-y-3">
            {roadmap.weeks.map((w) => (
              <div key={w.week} className="card flex gap-4">
                <div className="w-16 shrink-0 text-center">
                  <div className="text-xs text-slate-500">Week</div>
                  <div className="text-xl font-bold text-accent">{w.week}</div>
                </div>
                <div>
                  {w.focus.map((f, i) => (
                    <p key={i} className="text-sm text-slate-200">{f}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
