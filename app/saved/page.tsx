'use client'
import { useState, useEffect } from 'react'
import Shell from '@/components/Shell'
import { companies } from '@/lib/data'
import Link from 'next/link'
import { Bookmark, Play, Trash2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ScoreBadge from '@/components/ScoreBadge'

interface SavedSearch {
  id: string
  name: string
  q: string
  sector: string
  stage: string
  savedAt: string
}

export default function SavedPage() {
  const [searches, setSearches] = useState<SavedSearch[]>([])
  const [savedCompanyIds, setSavedCompanyIds] = useState<string[]>([])
  const [showNewForm, setShowNewForm] = useState(false)
  const [name, setName] = useState('')
  const [q, setQ] = useState('')
  const [sector, setSector] = useState('')
  const [stage, setStage] = useState('')
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('savedSearches')
    if (stored) setSearches(JSON.parse(stored))
    const ids = localStorage.getItem('savedCompanies')
    if (ids) setSavedCompanyIds(JSON.parse(ids))
  }, [])

  const save = (updated: SavedSearch[]) => {
    setSearches(updated)
    localStorage.setItem('savedSearches', JSON.stringify(updated))
  }

  const addSearch = () => {
    if (!name.trim()) return
    const search: SavedSearch = { id: Date.now().toString(), name, q, sector, stage, savedAt: new Date().toISOString() }
    save([...searches, search])
    setName(''); setQ(''); setSector(''); setStage('')
    setShowNewForm(false)
  }

  const runSearch = (s: SavedSearch) => {
    const params = new URLSearchParams()
    if (s.q) params.set('q', s.q)
    if (s.sector) params.set('sector', s.sector)
    if (s.stage) params.set('stage', s.stage)
    router.push(`/companies?${params.toString()}`)
  }

  const deleteSearch = (id: string) => save(searches.filter(s => s.id !== id))

  const savedCompanies = savedCompanyIds.map(id => companies.find(c => c.id === id)).filter(Boolean)

  return (
    <Shell>
      <div className="max-w-4xl mx-auto animate-slide-up space-y-8">
        {/* Saved Companies */}
        <div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">Saved</h1>
          <p className="text-muted text-xs font-mono">Companies you've bookmarked + saved searches</p>
        </div>

        <div>
          <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-3">Bookmarked Companies</h2>
          {savedCompanies.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center text-muted">
              <Bookmark size={24} className="mx-auto mb-2 opacity-30" />
              <p className="text-xs font-mono">No saved companies. Click Save on any profile.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {savedCompanies.map(c => (
                <Link key={c!.id} href={`/companies/${c!.id}`}
                  className="bg-card border border-border rounded-xl p-4 hover:border-accent/30 transition-all group">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-mono font-bold text-white group-hover:text-accent transition-colors">{c!.name}</p>
                      <p className="text-xs text-muted mt-0.5">{c!.sector} · {c!.stage}</p>
                      <p className="text-xs text-white/60 mt-1.5 line-clamp-2">{c!.description}</p>
                    </div>
                    <ScoreBadge score={c!.score} />
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {c!.tags.slice(0, 2).map(t => (
                      <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-border text-muted">{t}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Saved Searches */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Saved Searches</h2>
            <button onClick={() => setShowNewForm(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-accent/30 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors">
              <Plus size={12} /> Save Search
            </button>
          </div>

          {showNewForm && (
            <div className="bg-card border border-accent/20 rounded-xl p-5 mb-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Search name…"
                  className="bg-surface border border-border rounded-lg px-3 py-2 text-xs text-white placeholder:text-muted focus:outline-none focus:border-accent/50 font-mono col-span-2" />
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Keywords…"
                  className="bg-surface border border-border rounded-lg px-3 py-2 text-xs text-white placeholder:text-muted focus:outline-none focus:border-accent/50 font-mono" />
                <input value={sector} onChange={e => setSector(e.target.value)} placeholder="Sector…"
                  className="bg-surface border border-border rounded-lg px-3 py-2 text-xs text-white placeholder:text-muted focus:outline-none focus:border-accent/50 font-mono" />
              </div>
              <div className="flex gap-2">
                <button onClick={addSearch} className="px-4 py-2 text-xs font-mono rounded-lg border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 transition-colors">Save</button>
                <button onClick={() => setShowNewForm(false)} className="px-4 py-2 text-xs font-mono rounded-lg border border-border text-muted hover:text-white transition-colors">Cancel</button>
              </div>
            </div>
          )}

          {searches.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center text-muted">
              <Bookmark size={24} className="mx-auto mb-2 opacity-30" />
              <p className="text-xs font-mono">No saved searches yet. Save a search to re-run it anytime.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {searches.map(s => (
                <div key={s.id} className="flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-4 group hover:border-white/20 transition-all">
                  <Bookmark size={14} className="text-muted flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono text-white">{s.name}</p>
                    <p className="text-[11px] text-muted mt-0.5">
                      {[s.q && `"${s.q}"`, s.sector && `Sector: ${s.sector}`, s.stage && `Stage: ${s.stage}`].filter(Boolean).join(' · ') || 'No filters'}
                    </p>
                  </div>
                  <span className="text-[10px] text-muted font-mono">{new Date(s.savedAt).toLocaleDateString()}</span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => runSearch(s)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg border border-accent/30 bg-accent/10 text-accent hover:bg-accent/20 transition-colors">
                      <Play size={10} /> Run
                    </button>
                    <button onClick={() => deleteSearch(s.id)}
                      className="p-1.5 text-muted hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Shell>
  )
}
