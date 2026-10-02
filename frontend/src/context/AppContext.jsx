import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [resumeId, setResumeId] = useState(() => localStorage.getItem('resumeId') || null)
  const [filename, setFilename] = useState(() => localStorage.getItem('filename') || null)
  const [skills, setSkills] = useState(() => {
    try { return JSON.parse(localStorage.getItem('skills') || '[]') } catch { return [] }
  })
  const [selectedCareer, setSelectedCareer] = useState(() => localStorage.getItem('selectedCareer') || null)

  useEffect(() => {
    if (resumeId) localStorage.setItem('resumeId', resumeId)
  }, [resumeId])
  useEffect(() => {
    if (filename) localStorage.setItem('filename', filename)
  }, [filename])
  useEffect(() => {
    localStorage.setItem('skills', JSON.stringify(skills))
  }, [skills])
  useEffect(() => {
    if (selectedCareer) localStorage.setItem('selectedCareer', selectedCareer)
  }, [selectedCareer])

  const setResume = ({ resume_id, filename, skills }) => {
    setResumeId(resume_id)
    setFilename(filename)
    setSkills(skills)
  }

  return (
    <AppContext.Provider value={{ resumeId, filename, skills, selectedCareer, setSelectedCareer, setResume }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
