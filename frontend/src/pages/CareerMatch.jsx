import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { api } from '../services/api'

export default function CareerMatch() {
  const { resumeId, setSelectedCareer } = useApp()
  const [careers, setCareers] = useState([])
  const [active, setActive] = useState(null)
  const [detail, setDetail] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (resumeId) api.matchCareers(resumeId).then(setCareers)
  }, [resumeId])

  const openDetail = async (career) => {
    setActive(career)
    setDetail(null)
    const d = await api.careerDetail(resumeId, career)
    setDetail(d)
  }

  const useThisCareer = (career) => {
    setSelectedCareer(career)
    navigate('/roadmap')
  }

  if (!resumeId) return <Navigate to="/upload" replace />

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold mb-1">Career Compatibility</h1>
      <p className="text-slate-400 mb-8">Click a role to see what you already have and what's missing.</p>

      <div className="space-y-3 mb-8">
        {careers.map((c) => (
          <button
            key={c.career}
            onClick={() => openDetail(c.career)}
            className={`w-full text-left card flex items-center justify-between hover:border-accent/40 transition-colors ${active === c.career ? 'border-accent/50' : ''}`}
          >
            <div>
              <div className="font-medium">{c.career}</div>
              <div className="text-xs text-slate-500 mt-0.5">{c.description}</div>
            </div>
            <span className="text-accent2 font-semibold text-lg">{c.compatibility}%</span>
          </button>
        ))}
      </div>

      {active && (
        <div className="card">
          <h3 className="font-bold text-lg mb-4 uppercase tracking-wide">{active}</h3>
          {!detail ? (
            <p className="text-slate-400 text-sm">Loading details...</p>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-emerald-400 mb-2">Current Skills</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    {detail.current_skills.length
                      ? detail.current_skills.map((s) => <li key={s}>✓ {s}</li>)
                      : <li className="text-slate-500">None yet</li>}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-amber-400 mb-2">Missing / Weak Skills</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    {detail.missing_skills.length
                      ? detail.missing_skills.map((s) => <li key={s}>• {s}</li>)
                      : <li className="text-slate-500">None - you're fully covered!</li>}
                  </ul>
                </div>
              </div>
              <button onClick={() => useThisCareer(active)} className="btn-primary mt-6">
                Build a roadmap for this role
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
