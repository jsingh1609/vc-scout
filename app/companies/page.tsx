'use client'
import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Shell from '@/components/Shell'
import { companies, sectors, stages } from '@/lib/data'
import ScoreBadge from '@/components/ScoreBadge'
import Link from 'next/link'
import { ChevronUp, ChevronDown, ExternalLink, X } from 'lucide-react'
import clsx from 'clsx'

type SortKey = 'name' | 'score' | 'founded' | 'stage'
type SortDir = 'asc' | 'desc'

const PER_PAGE = 8

function CompaniesContent() {
  const params = useSearchParams()
  const [q, setQ] = useState(params.get('q') || '')
  const [sector, setSector] = useState('')
  const [stage, setStage] = useState('')
  const [sort, setSort] = useState<SortKey>('score')
  const [dir, setDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(1)

  useEffect(() => { setPage(1) }, [q, sector, stage])

  const filtered = useMemo(() => {
    let res = companies.filter(c => {
      const search = q.toLowerCase()
      const matchQ = !q || c.name.toLowerCase().includes(search) ||
        c.sector.toLowerCase().includes(search) ||
        c.tags.some(t => t.toLowerCase().includes(search)) ||
        c.description.toLowerCase().includes(search)
      const matchSector = !sector || c.sector === sector
      const matchStage = !stage || c.stage === stage
      return matchQ && matchSector && matchStage
    })
    res.sort((a, b) => {
      let av: number | string = a[sort] ?? 0
      let bv: number | string = b[sort] ?? 0
      if (typeof av === 'string') av = av.toLowerCase()
      if (typeof bv === 'string') bv = bv.toLowerCase()
      return dir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
    })
    return res
  }, [q, sector, stage, sort, dir])

  const pages = Math.ceil(filtered.length / PER_PAGE)
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handleSort = (key: SortKey) => {
    if (sort === key) setDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSort(key); setDir('desc') }
  }

  const SortIcon = ({ k }: { k: SortKey }) => sort === k
    ? (dir === 'desc' ? <ChevronDown size={12} className="text-accent" /> : <ChevronUp size={12} className="text-accent" />)
    : <ChevronDown size={12} className="text-muted/40" />

  return (
    <Shell>
      <div className="max-w-6xl mx-auto space-y-5 animate-slide-up">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Companies</h1>
            <p className="text-muted text-xs font-mono mt-0.5">{filtered.length} companies in database</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48 max-w-xs">
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Filter companies…"
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted focus:outline-none focus:border-accent/50 font-mono"
            />
            {q && <button onClick={() => setQ('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-white"><X size={13} /></button>}
          </div>

          <select value={sector} onChange={e => setSector(e.target.value)}
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent/50 font-mono">
            <option value="">All Sectors</option>
            {sectors.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select value={stage} onChange={e => setStage(e.target.value)}
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent/50 font-mono">
            <option value="">All Stages</option>
            {stages.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {(q || sector || stage) && (
            <button onClick={() => { setQ(''); setSector(''); setStage('') }}
              className="flex items-center gap-1.5 text-xs text-muted hover:text-white font-mono border border-border rounded-lg px-3 py-2 hover:border-white/20 transition-colors">
              <X size={11} /> Clear filters
            </button>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/50">
                {[
                  { label: 'Company', key: 'name' as SortKey },
                  { label: 'Sector' },
                  { label: 'Stage', key: 'stage' as SortKey },
                  { label: 'Founded', key: 'founded' as SortKey },
                  { label: 'Last Round' },
                  { label: 'Score', key: 'score' as SortKey },
                  { label: '' },
                ].map(col => (
                  <th key={col.label}
                    onClick={() => col.key && handleSort(col.key)}
                    className={clsx(
                      'text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-muted select-none',
                      col.key && 'cursor-pointer hover:text-white transition-colors'
                    )}>
                    <span className="flex items-center gap-1">
                      {col.label}
                      {col.key && <SortIcon k={col.key} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paged.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted font-mono text-sm">No companies match your filters.</td></tr>
              ) : paged.map(c => (
                <tr key={c.id} className="hover:bg-white/3 transition-colors group">
                  <td className="px-4 py-3.5">
                    <Link href={`/companies/${c.id}`} className="font-mono font-semibold text-white group-hover:text-accent transition-colors">
                      {c.name}
                    </Link>
                    <p className="text-[11px] text-muted mt-0.5 line-clamp-1">{c.description.slice(0, 60)}…</p>
                  </td>
                  <td className="px-4 py-3.5"><span className="text-xs font-mono text-muted">{c.sector}</span></td>
                  <td className="px-4 py-3.5"><span className="text-xs font-mono text-white/70 border border-border rounded px-2 py-0.5">{c.stage}</span></td>
                  <td className="px-4 py-3.5"><span className="text-xs font-mono text-muted">{c.founded}</span></td>
                  <td className="px-4 py-3.5">
                    <p className="text-xs font-mono text-white/80">{c.lastRound}</p>
                    <p className="text-[10px] text-muted">{c.lastRoundDate}</p>
                  </td>
                  <td className="px-4 py-3.5"><ScoreBadge score={c.score} /></td>
                  <td className="px-4 py-3.5">
                    <Link href={`/companies/${c.id}`} className="text-muted hover:text-accent transition-colors opacity-0 group-hover:opacity-100">
                      <ExternalLink size={13} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted font-mono">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-1.5">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 text-xs font-mono rounded border border-border text-muted hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                Previous
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={clsx('w-8 h-8 text-xs font-mono rounded border transition-colors',
                    p === page ? 'border-accent/40 bg-accent/10 text-accent' : 'border-border text-muted hover:text-white hover:border-white/20')}>
                  {p}
                </button>
              ))}
              <button disabled={page === pages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 text-xs font-mono rounded border border-border text-muted hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </Shell>
  )
}

export default function CompaniesPage() {
  return (
    <Suspense fallback={<div className="p-6 text-muted font-mono">Loading...</div>}>
      <CompaniesContent />
    </Suspense>
  )
}