'use client'
import { useState, useEffect } from 'react'
import { notFound, useRouter } from 'next/navigation'
import Shell from '@/components/Shell'
import { companies } from '@/lib/data'
import ScoreBadge from '@/components/ScoreBadge'
import { Zap, ExternalLink, BookmarkPlus, Plus, ChevronLeft, Globe, Users, Calendar, DollarSign, Loader2, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'

interface EnrichData {
  summary: string;
  whatTheyDo: string[];
  keywords: string[];
  signals: string[];
  sources: { url: string; fetchedAt: string }[];
}

const signalTypeColor: Record<string, string> = {
  hiring: 'text-accent bg-accent/10 border-accent/20',
  funding: 'text-signal bg-signal/10 border-signal/20',
  product: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  press: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  founder: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
}

export default function CompanyProfile({ params }: { params: { id: string } }) {
  const company = companies.find(c => c.id === params.id)
  if (!company) notFound()

  const [note, setNote] = useState('')
  const [notes, setNotes] = useState<{ text: string; date: string }[]>([])
  const [saved, setSaved] = useState(false)
  const [enriching, setEnriching] = useState(false)
  const [enrichData, setEnrichData] = useState<EnrichData | null>(null)
  const [enrichError, setEnrichError] = useState('')
  const [lists, setLists] = useState<string[]>([])
  const [showListModal, setShowListModal] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(`notes-${company.id}`)
    if (stored) setNotes(JSON.parse(stored))
    const savedIds = JSON.parse(localStorage.getItem('savedCompanies') || '[]')
    setSaved(savedIds.includes(company.id))
    const cached = localStorage.getItem(`enrich-${company.id}`)
    if (cached) setEnrichData(JSON.parse(cached))
    const storedLists = JSON.parse(localStorage.getItem('lists') || '[]')
    setLists(storedLists.map((l: { name: string }) => l.name))
  }, [company.id])

  const addNote = () => {
    if (!note.trim()) return
    const newNotes = [{ text: note.trim(), date: new Date().toISOString() }, ...notes]
    setNotes(newNotes)
    localStorage.setItem(`notes-${company.id}`, JSON.stringify(newNotes))
    setNote('')
  }

  const removeNote = (i: number) => {
    const newNotes = notes.filter((_, idx) => idx !== i)
    setNotes(newNotes)
    localStorage.setItem(`notes-${company.id}`, JSON.stringify(newNotes))
  }

  const toggleSave = () => {
    const savedIds: string[] = JSON.parse(localStorage.getItem('savedCompanies') || '[]')
    const next = saved ? savedIds.filter(id => id !== company.id) : [...savedIds, company.id]
    localStorage.setItem('savedCompanies', JSON.stringify(next))
    setSaved(!saved)
  }

  const addToList = (listName: string) => {
    const storedLists = JSON.parse(localStorage.getItem('lists') || '[]')
    const updated = storedLists.map((l: { name: string; companies: string[] }) =>
      l.name === listName
        ? { ...l, companies: l.companies.includes(company.id) ? l.companies : [...l.companies, company.id] }
        : l
    )
    localStorage.setItem('lists', JSON.stringify(updated))
    setShowListModal(false)
  }

  const enrich = async () => {
    setEnriching(true)
    setEnrichError('')
    try {
      const res = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: company.website, companyName: company.name }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setEnrichData(data)
      localStorage.setItem(`enrich-${company.id}`, JSON.stringify(data))
    } catch (e: any) {
      setEnrichError(e.message || 'Enrichment failed')
    } finally {
      setEnriching(false)
    }
  }

  return (
    <Shell>
      <div className="max-w-5xl mx-auto space-y-6 animate-slide-up">
        {/* Back */}
        <Link href="/companies" className="flex items-center gap-1.5 text-xs text-muted hover:text-white font-mono transition-colors">
          <ChevronLeft size={13} /> Back to Companies
        </Link>

        {/* Header */}
        <div className="bg-card border border-border rounded-xl p-6 relative overflow-hidden noise">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="flex items-start justify-between relative">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center">
                  <span className="font-display font-bold text-accent text-lg">{company.name[0]}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-display text-2xl font-bold text-white">{company.name}</h1>
                    <ScoreBadge score={company.score} />
                  </div>
                  <a href={company.website} target="_blank" rel="noreferrer"
                    className="text-xs text-muted hover:text-accent font-mono flex items-center gap-1 transition-colors">
                    {company.website.replace('https://', '')} <ExternalLink size={10} />
                  </a>
                </div>
              </div>
              <p className="text-sm text-white/70 font-mono max-w-xl">{company.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {company.tags.map(t => (
                  <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-border text-muted">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 ml-4 flex-shrink-0">
              <button onClick={toggleSave}
                className={clsx('flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono border transition-all',
                  saved ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-card border-border text-muted hover:text-white hover:border-white/20')}>
                <BookmarkPlus size={13} />
                {saved ? 'Saved' : 'Save'}
              </button>
              <div className="relative">
                <button onClick={() => setShowListModal(v => !v)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono border border-border text-muted hover:text-white hover:border-white/20 transition-all">
                  <Plus size={13} /> Add to List
                </button>
                {showListModal && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden">
                    {lists.length === 0 ? (
                      <div className="px-4 py-3 text-xs text-muted font-mono">
                        No lists yet. <Link href="/lists" className="text-accent">Create one →</Link>
                      </div>
                    ) : lists.map(l => (
                      <button key={l} onClick={() => addToList(l)}
                        className="w-full text-left px-4 py-2.5 text-xs font-mono text-white hover:bg-white/5 transition-colors">
                        {l}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-4 gap-4 mt-5 pt-5 border-t border-border">
            {[
              { icon: Globe, label: 'HQ', value: company.hq },
              { icon: Calendar, label: 'Founded', value: company.founded },
              { icon: Users, label: 'Team Size', value: company.employees },
              { icon: DollarSign, label: 'Total Raised', value: company.fundingTotal },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={11} className="text-muted" />
                  <p className="text-[10px] text-muted font-mono uppercase tracking-wider">{label}</p>
                </div>
                <p className="text-sm font-mono text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          {/* Left: Signals + Notes */}
          <div className="col-span-2 space-y-5">
            {/* Signals Timeline */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Signals Timeline</h2>
              </div>
              <div className="divide-y divide-border">
                {company.signals.map(s => (
                  <div key={s.id} className="flex items-start gap-4 px-5 py-4">
                    <div className={clsx('text-[10px] font-mono px-2 py-0.5 rounded border mt-0.5 capitalize whitespace-nowrap', signalTypeColor[s.type])}>
                      {s.type}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white font-mono">{s.title}</p>
                      <p className="text-[11px] text-muted mt-0.5">{new Date(s.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enrichment */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div>
                  <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Live Enrichment</h2>
                  <p className="text-[10px] text-muted mt-0.5">Fetches public website data via AI</p>
                </div>
                <button onClick={enrich} disabled={enriching}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono border transition-all',
                    enriching
                      ? 'border-accent/20 bg-accent/5 text-accent/50 cursor-not-allowed'
                      : 'border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 signal-glow'
                  )}>
                  {enriching ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
                  {enriching ? 'Enriching…' : enrichData ? 'Re-Enrich' : 'Enrich'}
                </button>
              </div>
              <div className="p-5">
                {enriching && (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-4 rounded shimmer" style={{ width: `${60 + i * 15}%` }} />
                    ))}
                  </div>
                )}
                {enrichError && !enriching && (
                  <div className="flex items-center gap-2 text-red-400 text-sm font-mono bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                    <AlertCircle size={14} />
                    {enrichError}
                  </div>
                )}
                {enrichData && !enriching && (
                  <div className="space-y-5 animate-fade-in">
                    <div>
                      <p className="text-[10px] text-muted font-mono uppercase tracking-wider mb-2">Summary</p>
                      <p className="text-sm text-white/80 font-mono leading-relaxed">{enrichData.summary}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted font-mono uppercase tracking-wider mb-2">What They Do</p>
                      <ul className="space-y-1.5">
                        {enrichData.whatTheyDo.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-white/70 font-mono">
                            <span className="text-accent mt-0.5">›</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted font-mono uppercase tracking-wider mb-2">Keywords</p>
                      <div className="flex flex-wrap gap-1.5">
                        {enrichData.keywords.map(k => (
                          <span key={k} className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">{k}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted font-mono uppercase tracking-wider mb-2">Derived Signals</p>
                      <div className="space-y-1.5">
                        {enrichData.signals.map((s, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs font-mono text-white/70">
                            <CheckCircle2 size={12} className="text-accent flex-shrink-0" /> {s}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-border pt-4">
                      <p className="text-[10px] text-muted font-mono uppercase tracking-wider mb-2">Sources</p>
                      <div className="space-y-1.5">
                        {enrichData.sources.map((s, i) => (
                          <div key={i} className="flex items-center justify-between text-[10px] font-mono">
                            <a href={s.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline truncate max-w-xs">{s.url}</a>
                            <span className="text-muted ml-3 flex-shrink-0">{new Date(s.fetchedAt).toLocaleTimeString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {!enrichData && !enriching && !enrichError && (
                  <div className="text-center py-8 text-muted">
                    <Zap size={24} className="mx-auto mb-2 opacity-30" />
                    <p className="text-xs font-mono">Click Enrich to fetch live data from {company.website.replace('https://', '')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Notes + Last Round */}
          <div className="space-y-5">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-4 border-b border-border">
                <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Last Round</h2>
              </div>
              <div className="p-4 space-y-2">
                <p className="text-base font-mono font-bold text-signal">{company.lastRound}</p>
                <p className="text-xs text-muted font-mono">{company.lastRoundDate}</p>
                <p className="text-xs text-muted font-mono">Total: {company.fundingTotal}</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-4 border-b border-border">
                <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Notes</h2>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Add a note…"
                    rows={3}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs text-white placeholder:text-muted focus:outline-none focus:border-accent/50 resize-none font-mono"
                  />
                  <button onClick={addNote}
                    className="w-full mt-2 py-2 text-xs font-mono rounded-lg border border-accent/30 bg-accent/10 text-accent hover:bg-accent/20 transition-colors">
                    Add Note
                  </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notes.map((n, i) => (
                    <div key={i} className="group bg-surface border border-border rounded-lg p-3">
                      <p className="text-xs text-white/80 font-mono leading-relaxed">{n.text}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-[10px] text-muted">{new Date(n.date).toLocaleDateString()}</p>
                        <button onClick={() => removeNote(i)} className="text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}
