'use client'
import Sidebar from './Sidebar'
import GlobalSearch from './GlobalSearch'

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-56 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 bg-ink/80 backdrop-blur border-b border-border px-6 py-3">
          <GlobalSearch />
        </header>
        <main className="flex-1 p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}
