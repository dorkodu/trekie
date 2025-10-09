import React from 'react';
import { useMomentum } from '../useMomentum';

interface FactorBreakdownProps { windowDays?: number; limit?: number }

function FactorRow({ factor }: { factor: any }) {
  if (!factor) return null
  const pct = typeof factor.weight === 'number' ? Math.round(factor.weight * 100) : undefined
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="w-24 font-mono uppercase tracking-wide text-[10px] text-muted-foreground">{factor.key}</div>
      <div className="flex-1 h-2 rounded bg-muted overflow-hidden">
        <div className="h-full bg-emerald-500/70" style={{ width: pct !== undefined ? pct + '%' : '0%' }} />
      </div>
      {pct !== undefined && <div className="w-8 text-right tabular-nums text-[10px] text-muted-foreground">{pct}%</div>}
    </div>
  )
}

export const FactorBreakdown: React.FC<FactorBreakdownProps> = ({ windowDays = 10, limit = 6 }) => {
  const { data, isLoading, isError, refetch } = useMomentum({ windowDays })

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-background p-4 space-y-3 animate-pulse">
        <div className="h-4 w-40 bg-muted rounded" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-4 bg-muted rounded" />)}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-xl border bg-background p-4 flex flex-col gap-2">
        <div className="text-sm font-medium">Momentum Factors</div>
        <div className="text-xs text-rose-500">Error loading factor breakdown.</div>
        <button onClick={() => refetch()} className="text-xs underline">Retry</button>
      </div>
    )
  }

  const explanation: any = data?.explanation
  const allFactors: any[] = explanation?.factors || explanation?.topFactors || []
  const factors = allFactors.slice(0, limit)

  if (!data || factors.length === 0) {
    return (
      <div className="rounded-xl border bg-background p-4 text-xs text-muted-foreground flex flex-col gap-1">
        <div className="text-sm font-medium">Momentum Factors</div>
        <div>Not enough data to calculate breakdown yet.</div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-background p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium tracking-wide">Momentum Factors</h3>
        <button onClick={() => refetch()} className="text-[10px] text-muted-foreground hover:text-foreground underline-offset-2 hover:underline">Refresh</button>
      </div>
      <div className="space-y-2">
        {factors.map((f, i) => <FactorRow key={f.key || i} factor={f} />)}
      </div>
      {allFactors.length > limit && (
        <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wide">+ {allFactors.length - limit} more factors</div>
      )}
    </div>
  )
}

export default FactorBreakdown
