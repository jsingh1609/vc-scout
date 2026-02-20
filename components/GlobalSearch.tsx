'use client'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function GlobalSearch() {
  const router = useRouter()
  const [q, setQ] = useState('')

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && q.trim()) {
      router.push(`/companies?q=${encodeURIComponent(q.trim())}`)
    }
  }

  return (
    <div className="flex items-center gap-3 max-w-xl">
      <div className="relative flex-1">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Search companies, sectors, tags… (↵ to search)"
          className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors font-mono"
        />
      </div>
      <kbd className="text-[10px] text-muted border border-border rounded px-1.5 py-0.5 font-mono hidden sm:block">⌘K</kbd>
    </div>
  )
}
