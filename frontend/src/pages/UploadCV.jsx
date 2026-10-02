import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { UploadCloud, FileText, Loader2 } from 'lucide-react'
import { api } from '../services/api'
import { useApp } from '../context/AppContext'

export default function UploadCV() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle') // idle | uploading | error
  const [error, setError] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const { setResume } = useApp()

  const handleFile = (f) => {
    if (!f) return
    if (!f.name.toLowerCase().endsWith('.pdf')) {
      setError('Please choose a PDF file.')
      return
    }
    setError('')
    setFile(f)
  }

  const onDrop = (e) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files?.[0])
  }

  const submit = async () => {
    if (!file) return
    setStatus('uploading')
    setError('')
    try {
      const data = await api.uploadResume(file)
      setResume(data)
      navigate('/dashboard')
    } catch (err) {
      setStatus('error')
      setError(err?.response?.data?.detail || 'Upload failed. Is the backend running on port 8000?')
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold mb-1">Upload your CV</h1>
      <p className="text-slate-400 mb-8">PDF only, for now. We'll extract your skills, education, and experience.</p>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className="card border-2 border-dashed border-white/10 hover:border-accent/40 cursor-pointer flex flex-col items-center justify-center py-16 text-center transition-colors"
      >
        <input ref={inputRef} type="file" accept="application/pdf" className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])} />
        {file ? (
          <>
            <FileText className="text-accent mb-3" size={36} />
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-slate-500 mt-1">Click to choose a different file</p>
          </>
        ) : (
          <>
            <UploadCloud className="text-slate-500 mb-3" size={36} />
            <p className="font-medium">Drag & drop your resume.pdf</p>
            <p className="text-sm text-slate-500 mt-1">or click to browse</p>
          </>
        )}
      </div>

      {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

      <button
        onClick={submit}
        disabled={!file || status === 'uploading'}
        className="btn-primary mt-6 w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {status === 'uploading' ? <><Loader2 className="animate-spin" size={18} /> Analyzing...</> : 'Analyze my CV'}
      </button>
    </div>
  )
}
