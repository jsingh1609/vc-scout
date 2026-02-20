'use client'
import { useState, useEffect } from 'react'
import Shell from '@/components/Shell'
import { companies } from '@/lib/data'
import Link from 'next/link'
import { Plus, Download, Trash2, X, List } from 'lucide-react'
import ScoreBadge from '@/components/ScoreBadge'

interface VCList {
  name: string
  description: string
  companies: string[]
  createdAt: string
}

export default function ListsPage() {
  const [lists, setLists] = useState<VCList[]>([])
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('lists')
    if (stored) setLists(JSON.parse(stored))
  }, [])

  const save = (updated: VCList[]) => {
    setLists(updated)
    localStorage.setItem('lists', JSON.stringify(updated))
  }

  const createList = () => {
    if (!newName.trim()) return
    const newList: VCList = { name: newName.trim(), description: newDesc.trim(), companies: [], createdAt: new Date().toISOString() }
    save([...lists, newList])
    setNewName('')
    setNewDesc('')
    setCreating(false)
    setActive(newList.name)
  }

  const deleteList = (name: string) => {
    save(lists.filter(l => l.name !== name))
    if (active === name) setActive(null)
  }

  const removeCompany = (listName: string, companyId: string) => {
    save(lists.map(l => l.name === listName ? { ...l, companies: l.companies.filter(c => c !== companyId) } : l))
  }

  const exportList = (list: VCList, format: 'csv' | 'json') => {
    const comps = list.companies.map(id => companies.find(c => c.id === id)).filter(Boolean)
    let content: string
    let mime: string
    let ext: string
    if (format === 'csv') {
      const headers = 'Name,Website,Sector,Stage,Founded,Score,Funding'
      const rows = comps.map(c => `"${c!.name}","${c!.website}","${c!.sector}","${c!.stage}",${c!.founded},${c!.score},"${c!.fundingTotal}"`)
      content = [headers, ...rows].join('\n')
      mime = 'text/csv'
      ext = 'csv'
    } else {
      content = JSON.stringify(comps, null, 2)
      mime = 'application/json'
      ext = 'json'
    }
    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${list.name.replace(/\s+/g, '-')}.${ext}`
    a.click()
  }

  const activeList = lists.find(l => l.name === active)
  const activeCompanies = activeList ? activeList.companies.map(id => companies.find(c => c.id === id)).filter(Boolean) : []

  return (
    <Shell>
      <div className="max-w-5xl mx-auto animate-slide-up">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Lists</h1>
            <p className="text-muted text-xs font-mono mt-0.5">Curate and export company collections</p>
          </div>
          <button onClick={() => setCreating(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 transition-all">
            <Plus size={13} /> New List
          </button>
        </div>

        {creating && (
          <div className="bg-card border border-accent/20 rounded-xl p-5 mb-5 animate-fade-in">
            <h3 className="text-sm font-mono font-bold text-white mb-4">Create new list</h3>
            <div className="space-y-3">
              <input value={newName} onChange={e => setNewName(e.target.value)}
                placeholder="List name…"
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted focus:outline-none focus:border-accent/50 font-mono" />
              <input value={newDesc} onChange={e => setNewDesc(e.target.value)}
                placeholder="Description (optional)…"
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted focus:outline-none focus:border-accent/50 font-mono" />
              <div className="flex gap-2">
                <button onClick={createList}
                  className="px-4 py-2 text-xs font-mono rounded-lg border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 transition-colors">
                  Create
                </button>
                <button onClick={() => setCreating(false)}
                  className="px-4 py-2 text-xs font-mono rounded-lg border border-border text-muted hover:text-white transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-5">
          {/* List sidebar */}
          <div className="space-y-2">
            {lists.length === 0 && (
              <div className="text-center py-12 text-muted">
                <List size={28} className="mx-auto mb-2 opacity-30" />
                <p className="text-xs font-mono">No lists yet</p>
              </div>
            )}
            {lists.map(l => (
              <button key={l.name} onClick={() => setActive(l.name)}
                className={`w-full text-left p-4 rounded-xl border transition-all group ${active === l.name ? 'bg-accent/10 border-accent/30' : 'bg-card border-border hover:border-white/20'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-sm font-mono font-semibold ${active === l.name ? 'text-accent' : 'text-white'}`}>{l.name}</p>
                    {l.description && <p className="text-xs text-muted mt-0.5 line-clamp-1">{l.description}</p>}
                    <p className="text-[10px] text-muted mt-1">{l.companies.length} companies</p>
                  </div>
                  <button onClick={e => { e.stopPropagation(); deleteList(l.name) }}
                    className="text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={12} />
                  </button>
                </div>
              </button>
            ))}
          </div>

          {/* List detail */}
          <div className="col-span-2">
            {!activeList ? (
              <div className="bg-card border border-border rounded-xl flex items-center justify-center h-64 text-muted">
                <div className="text-center">
                  <List size={28} className="mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-mono">Select a list to view companies</p>
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <div>
                    <h3 className="text-sm font-mono font-bold text-white">{activeList.name}</h3>
                    <p className="text-[10px] text-muted">{activeCompanies.length} companies · Created {new Date(activeList.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => exportList(activeList, 'csv')}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg border border-border text-muted hover:text-white hover:border-white/20 transition-colors">
                      <Download size={11} /> CSV
                    </button>
                    <button onClick={() => exportList(activeList, 'json')}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg border border-border text-muted hover:text-white hover:border-white/20 transition-colors">
                      <Download size={11} /> JSON
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {activeCompanies.length === 0 ? (
                    <div className="px-5 py-12 text-center text-muted">
                      <p className="text-xs font-mono">No companies yet. Add from a company profile.</p>
                      <Link href="/companies" className="text-accent text-xs hover:underline mt-1 block">Browse companies →</Link>
                    </div>
                  ) : activeCompanies.map(c => (
                    <div key={c!.id} className="flex items-center gap-4 px-5 py-3.5 group hover:bg-white/3 transition-colors">
                      <div className="flex-1 min-w-0">
                        <Link href={`/companies/${c!.id}`}
                          className="text-sm font-mono text-white group-hover:text-accent transition-colors">{c!.name}</Link>
                        <p className="text-xs text-muted">{c!.sector} · {c!.stage}</p>
                      </div>
                      <ScoreBadge score={c!.score} />
                      <button onClick={() => removeCompany(activeList.name, c!.id)}
                        className="text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  )
}
