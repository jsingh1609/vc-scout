'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, List, Bookmark, LayoutDashboard, Zap } from 'lucide-react'
import clsx from 'clsx'

const nav = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/companies', label: 'Companies', icon: Building2 },
  { href: '/lists', label: 'Lists', icon: List },
  { href: '/saved', label: 'Saved Searches', icon: Bookmark },
]

export default function Sidebar() {
  const path = usePathname()
  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-surface border-r border-border flex flex-col z-50">
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
            <Zap size={14} className="text-ink" fill="currentColor" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-white">VCScout</span>
        </div>
        <p className="text-[10px] text-muted mt-1 font-mono uppercase tracking-widest">Intelligence Layer</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? path === '/' : path.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group',
                active
                  ? 'bg-accent/10 text-accent border border-accent/20'
                  : 'text-muted hover:text-white hover:bg-white/5'
              )}
            >
              <Icon size={15} className={active ? 'text-accent' : 'text-muted group-hover:text-white'} />
              <span className="font-mono tracking-wide">{label}</span>
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent/40 to-accent/10 flex items-center justify-center text-[11px] font-bold text-accent">
            VC
          </div>
          <div>
            <p className="text-xs text-white font-mono">Xartup Fund</p>
            <p className="text-[10px] text-muted">Analyst View</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
