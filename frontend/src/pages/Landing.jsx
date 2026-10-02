import { Link } from 'react-router-dom'
import { ArrowRight, FileUp, Target, Map } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-b from-ink to-surface">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent2 grid place-items-center font-bold text-xl mb-6">
        AI
      </div>
      <h1 className="text-4xl md:text-5xl font-bold max-w-2xl leading-tight">
        Turn your CV into your <span className="text-accent">career roadmap</span>
      </h1>
      <p className="text-slate-400 max-w-xl mt-4">
        Upload your resume and get a real skill-gap analysis, career compatibility scores,
        and a personalized week-by-week learning plan - not just another chatbot.
      </p>
      <Link to="/upload" className="btn-primary mt-8 inline-flex items-center gap-2">
        Analyze my CV <ArrowRight size={18} />
      </Link>

      <div className="grid md:grid-cols-3 gap-4 mt-16 max-w-3xl w-full">
        <div className="card text-left">
          <FileUp className="text-accent mb-3" />
          <h3 className="font-semibold mb-1">Upload once</h3>
          <p className="text-sm text-slate-400">We extract your skills, education, and experience automatically.</p>
        </div>
        <div className="card text-left">
          <Target className="text-accent2 mb-3" />
          <h3 className="font-semibold mb-1">See your gaps</h3>
          <p className="text-sm text-slate-400">Compare your skills against real career requirements, visually.</p>
        </div>
        <div className="card text-left">
          <Map className="text-accent mb-3" />
          <h3 className="font-semibold mb-1">Get a roadmap</h3>
          <p className="text-sm text-slate-400">A personalized, week-by-week plan that skips what you already know.</p>
        </div>
      </div>
    </div>
  )
}
