export default function ScoreBar({ label, value, colorClass = 'bg-accent' }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-400 font-medium">{value}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className={`h-full rounded-full ${colorClass} transition-all duration-500`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  )
}
