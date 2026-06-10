import React from 'react'
import { useMomentum } from '../useMomentum'

interface RecommendationsPanelProps { windowDays?: number }

interface Recommendation {
  id?: string;
  title?: string;
  message?: string;
  detail?: string;
  action?: string;
}

function RecommendationItem({ rec }: { rec: Recommendation }) {
  if (!rec) return null
  return (
    <li className="flex flex-col gap-0.5 rounded-md border p-2 bg-muted/30">
      <div className="text-xs font-medium leading-tight">{rec.title || rec.message}</div>
      {rec.detail && <div className="text-[10px] text-muted-foreground leading-snug">{rec.detail}</div>}
      {rec.action && <div className="text-[10px] text-emerald-500 font-mono uppercase tracking-wide">{rec.action}</div>}
    </li>
  )
}

export const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({ windowDays = 10 }) => {
  const { data, isLoading, isError, refetch } = useMomentum({ windowDays })

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-background p-4 animate-pulse space-y-3">
        <div className="h-4 w-32 bg-muted rounded" />
        <div className="grid gap-2">
          <div className="h-12 bg-muted rounded" />
          <div className="h-12 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-xl border bg-background p-4 flex flex-col gap-2">
        <div className="text-sm font-medium">Momentum Recommendations</div>
        <div className="text-xs text-rose-500">Error loading recommendations.</div>
        <button onClick={() => refetch()} className="text-xs underline">Retry</button>
      </div>
    )
  }

  const explanation = data?.explanation as { recommendations?: Recommendation[] } | undefined
  const recs: Recommendation[] = explanation?.recommendations || []

  if (!data || recs.length === 0) {
    return (
      <div className="rounded-xl border bg-background p-4 text-xs text-muted-foreground flex flex-col gap-1">
        <div className="text-sm font-medium text-foreground">Momentum Recommendations</div>
        <div>No actionable recommendations right now. Keep consistent activity.</div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-background p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium tracking-wide">Momentum Recommendations</h3>
        <button onClick={() => refetch()} className="text-[10px] text-muted-foreground hover:text-foreground underline-offset-2 hover:underline">Refresh</button>
      </div>
      <ul className="grid gap-2">
        {recs.slice(0, 5).map((r, i) => <RecommendationItem key={r.id || i} rec={r} />)}
      </ul>
      {recs.length > 5 && (
        <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wide">+ {recs.length - 5} more</div>
      )}
    </div>
  )
}

export default RecommendationsPanel
