import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { api } from '../services/api'

export default function JobMatcher() {
  const { resumeId } = useApp()
  const [jd, setJd] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  if (!resumeId) return <Navigate to="/upload" replace />

  const run = async () => {
    if (!jd.trim()) return
    setLoading(true)
    try {
      const data = await api.jobMatch(resumeId, jd)
      setResult(data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold mb-1">Job Description Matcher</h1>
      <p className="text-slate-400 mb-6">Paste a real job posting to see how well your CV matches it.</p>

      <textarea
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        placeholder="We are looking for a Junior React Developer... Requirements: React, JavaScript, Git, REST APIs, TypeScript"
        rows={8}
        className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-sm mb-4 resize-none"
      />
      <button onClick={run} disabled={loading} className="btn-primary w-full disabled:opacity-40">
        {loading ? 'Matching...' : 'Check my match'}
      </button>

      {result && (
        <div className="card mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Job Match</h3>
            <span className="text-2xl font-bold text-accent2">{result.overall_match}%</span>
          </div>

          {result.matched.length > 0 && (
            <div className="mb-3">
              <p className="text-sm text-emerald-400 font-medium mb-1">Matched</p>
              <p className="text-sm text-slate-300">{result.matched.map((s) => `✓ ${s}`).join('   ')}</p>
            </div>
          )}
          {result.missing.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-rose-400 font-medium mb-1">Missing</p>
              <p className="text-sm text-slate-300">{result.missing.map((s) => `✗ ${s}`).join('   ')}</p>
            </div>
          )}

          {result.next_steps.length > 0 && (
            <div className="bg-white/5 rounded-xl p-4 text-sm">
              <p className="font-medium mb-2">Before applying, you should improve:</p>
              <ol className="list-decimal list-inside text-slate-300 space-y-1">
                {result.next_steps.map((s) => <li key={s}>{s}</li>)}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
