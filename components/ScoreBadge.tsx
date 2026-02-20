import clsx from 'clsx'

export default function ScoreBadge({ score }: { score: number }) {
  const color = score >= 90 ? 'text-accent border-accent/40 bg-accent/10'
    : score >= 75 ? 'text-signal border-signal/40 bg-signal/10'
    : 'text-muted border-border bg-card'

  return (
    <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-mono font-bold', color)}>
      {score}
      <span className="text-[9px] opacity-60">/ 100</span>
    </span>
  )
}
