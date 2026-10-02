import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, FileUp, Brain, Target, Briefcase, Map, Sparkles,
} from 'lucide-react'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/upload', label: 'Upload CV', icon: FileUp },
  { to: '/analysis', label: 'CV Analysis', icon: Brain },
  { to: '/skill-gap', label: 'Skill Gap', icon: Target },
  { to: '/careers', label: 'Career Match', icon: Sparkles },
  { to: '/job-matcher', label: 'Job Matcher', icon: Briefcase },
  { to: '/roadmap', label: 'Roadmap', icon: Map },
]

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 bg-surface border-r border-white/5 p-5 hidden md:flex md:flex-col">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent2 grid place-items-center font-bold text-sm">AI</div>
        <span className="font-semibold text-slate-100">Career Advisor</span>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                isActive ? 'bg-accent/15 text-accent font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto text-xs text-slate-500 px-2">MVP demo build</div>
    </aside>
  )
}
