import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const client = axios.create({ baseURL: BASE_URL })

export const api = {
  uploadResume: async (file) => {
    const form = new FormData()
    form.append('file', file)
    const { data } = await client.post('/resume/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },
  analyzeResume: async (resumeId) => {
    const { data } = await client.get(`/resume/${resumeId}/analyze`)
    return data
  },
  listCareers: async () => {
    const { data } = await client.get('/careers')
    return data
  },
  matchCareers: async (resumeId) => {
    const { data } = await client.get(`/career/match/${resumeId}`)
    return data
  },
  careerDetail: async (resumeId, career) => {
    const { data } = await client.post('/career/detail', { resume_id: resumeId, career })
    return data
  },
  skillGap: async (resumeId, career) => {
    const { data } = await client.post('/skills/gap', { resume_id: resumeId, career })
    return data
  },
  jobMatch: async (resumeId, jobDescription) => {
    const { data } = await client.post('/job/match', { resume_id: resumeId, job_description: jobDescription })
    return data
  },
  generateRoadmap: async (resumeId, career, weeks = 8) => {
    const { data } = await client.post('/roadmap/generate', { resume_id: resumeId, career, weeks })
    return data
  },
}
