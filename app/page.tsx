import Shell from '@/components/Shell'
import { companies } from '@/lib/data'
import Link from 'next/link'
import { TrendingUp, Building2, Zap, ArrowRight } from 'lucide-react'
import ScoreBadge from '@/components/ScoreBadge'

export default function Home() {
  const topCompanies = [...companies].sort((a, b) => b.score - a.score).slice(0, 5)
  const recentSignals = companies.flatMap(c => c.signals.map(s => ({ ...s, company: c.name, companyId: c.id })))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)

  const signalTypeColor: Record<string, string> = {
    hiring: 'text-accent bg-accent/10',
    funding: 'text-signal bg-signal/10',
    product: 'text-blue-400 bg-blue-400/10',
    press: 'text-purple-400 bg-purple-400/10',
    founder: 'text-pink-400 bg-pink-400/10',
  }

  return (
    <Shell>
      <div className="max-w-5xl mx-auto space-y-8 animate-slide-up">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">Good morning, Analyst.</h1>
          <p className="text-muted text-sm font-mono">Your intelligence dashboard · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Companies Tracked', value: companies.length, icon: Building2, color: 'accent' },
            { label: 'Active Signals', value: companies.flatMap(c => c.signals).length, icon: Zap, color: 'signal' },
            { label: 'Avg Thesis Score', value: Math.round(companies.reduce((s, c) => s + c.score, 0) / companies.length), icon: TrendingUp, color: 'blue-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-card border border-border rounded-xl p-5 relative overflow-hidden noise">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted font-mono uppercase tracking-wider">{label}</p>
                  <p className={`text-4xl font-display font-bold mt-2 text-${color}`}>{value}</p>
                </div>
                <div className={`p-2.5 rounded-lg bg-${color}/10`}>
                  <Icon size={18} className={`text-${color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Top Companies by Score */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Top Thesis Matches</h2>
              <Link href="/companies" className="text-xs text-accent hover:underline font-mono flex items-center gap-1">
                View all <ArrowRight size={11} />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {topCompanies.map((c, i) => (
                <Link key={c.id} href={`/companies/${c.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/3 transition-colors group">
                  <span className="text-xs text-muted font-mono w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-mono group-hover:text-accent transition-colors">{c.name}</p>
                    <p className="text-xs text-muted truncate">{c.sector} · {c.stage}</p>
                  </div>
                  <ScoreBadge score={c.score} />
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Signals */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Recent Signals</h2>
              <span className="text-[10px] text-muted font-mono border border-border rounded px-2 py-0.5">Live</span>
            </div>
            <div className="divide-y divide-border">
              {recentSignals.map(s => (
                <Link key={s.id} href={`/companies/${s.companyId}`}
                  className="flex items-start gap-3 px-5 py-3.5 hover:bg-white/3 transition-colors group">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded mt-0.5 capitalize ${signalTypeColor[s.type] || 'text-muted bg-surface'}`}>
                    {s.type}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white line-clamp-1 group-hover:text-accent transition-colors">{s.title}</p>
                    <p className="text-[10px] text-muted mt-0.5">{s.company} · {s.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}
