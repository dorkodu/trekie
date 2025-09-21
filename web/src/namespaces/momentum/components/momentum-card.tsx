import React from 'react';
import { useMomentum } from '../useMomentum';

interface MomentumCardProps { windowDays?: number; showExplanation?: boolean }

function TrendIndicator({ trend }: { trend: number | undefined }) {
  if (trend === undefined || Number.isNaN(trend)) return <span className="text-muted-foreground">--</span>
  const sign = trend > 0 ? '+' : ''
  const color = trend > 0 ? 'text-emerald-500' : trend < 0 ? 'text-rose-500' : 'text-muted-foreground'
  return <span className={`font-mono text-sm ${color}`}>{sign}{trend.toFixed(1)}%</span>
}

function BandBadge({ band }: { band?: string }) {
  if (!band) return null
  const map: Record<string, string> = {
    meltdown: 'bg-rose-600/15 text-rose-500 border-rose-600/30',
    recovery: 'bg-amber-600/15 text-amber-500 border-amber-600/30',
    neutral: 'bg-slate-600/15 text-slate-400 border-slate-500/30',
    building: 'bg-cyan-600/15 text-cyan-400 border-cyan-600/30',
    momentum: 'bg-emerald-600/15 text-emerald-500 border-emerald-600/30'
  }
  return <span className={`px-2 py-0.5 rounded-md border text-xs font-medium tracking-wide capitalize ${map[band] || 'bg-slate-600/15 text-slate-400 border-slate-500/30'}`}>{band}</span>
}

function CoolingBadge({ decayCount }: { decayCount: number }) {
  if (!decayCount) return null
  return (
    <span title={`Cooling active: ${decayCount} decay event${decayCount > 1 ? 's' : ''} recently applied due to inactivity gaps.`}
      className="px-2 py-0.5 rounded-md border text-[10px] font-semibold tracking-wide bg-indigo-600/15 text-indigo-400 border-indigo-600/30 uppercase">Cooling</span>
  )
}

export const MomentumCard: React.FC<MomentumCardProps> = ({ windowDays = 10, showExplanation = false }) => {
  const { data, isLoading, isError, calibrating, refetch } = useMomentum({ windowDays, explain: showExplanation })

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-background p-4 flex flex-col gap-2 animate-pulse">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="h-8 w-32 bg-muted rounded" />
        <div className="h-3 w-48 bg-muted rounded" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-lg border bg-background p-4 flex flex-col gap-2">
        <div className="text-sm font-medium">Momentum</div>
        <div className="text-sm text-rose-500">Error loading momentum.</div>
        <button onClick={() => refetch()} className="text-xs underline">Retry</button>
      </div>
    )
  }

  if (calibrating || !data) {
    return (
      <div className="rounded-lg border bg-background p-4 flex flex-col gap-2">
        <div className="text-sm font-medium">Momentum</div>
        <div className="text-xs text-muted-foreground">Gathering enough data... Keep logging habits and tasks.</div>
      </div>
    )
  }

  const band = (data.bands as any)?.current?.label || (data.bands as any)?.current?.label || (data.bands as any)?.label
  const trendPct = typeof data.trend === 'number' ? data.trend * 100 : undefined
  const coverage = data.coverage
  const confidence = data.confidence
  const imputed = data.imputedFactors ?? []
  const decayEvents = data.decayEvents ?? []
  const recentDecayCount = decayEvents.length

  return (
    <div className="rounded-xl border bg-background p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium tracking-wide text-muted-foreground">Momentum</span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-3xl font-semibold tabular-nums">{(data.score ?? 0).toFixed(0)}</span>
            <BandBadge band={band} />
            {recentDecayCount > 0 && <CoolingBadge decayCount={recentDecayCount} />}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <TrendIndicator trend={trendPct} />
          {data.states?.recovery && <span className="text-amber-500 text-[10px] uppercase tracking-wide">Recovery</span>}
          {data.states?.risk && <span className="text-rose-500 text-[10px] uppercase tracking-wide">Risk</span>}
        </div>
      </div>

      {showExplanation && data.explanation && (
        <div className="text-xs leading-relaxed space-y-1">
          {coverage && (
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide font-mono">
              <span className="text-muted-foreground">Coverage</span>
              <span>{Math.round(coverage.ratio * 100)}%</span>
              {confidence !== undefined && <span className="text-muted-foreground">Confidence {Math.round(confidence * 100)}%</span>}
            </div>
          )}
          {imputed.length > 0 && (
            <div className="text-[10px] text-muted-foreground font-mono">Imputed: {imputed.join(', ')}</div>
          )}
          {recentDecayCount > 0 && (
            <div className="text-[10px] text-indigo-400 font-mono">Cooling applied (gap decay smoothing)</div>
          )}
          {(data.explanation as any).topFactors?.length > 0 && (
            <div>
              <div className="font-medium text-muted-foreground mb-0.5">Top Drivers</div>
              <ul className="list-disc list-inside space-y-0.5">
                {(data.explanation as any).topFactors.slice(0, 3).map((f: any) => (
                  <li key={f.key}><span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">{f.key}</span> {f.message}</li>
                ))}
              </ul>
            </div>
          )}
          {(data.explanation as any).weakFactors?.length > 0 && (
            <div>
              <div className="font-medium text-muted-foreground mb-0.5">Weak Spots</div>
              <ul className="list-disc list-inside space-y-0.5">
                {(data.explanation as any).weakFactors.slice(0, 3).map((f: any) => (
                  <li key={f.key}><span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">{f.key}</span> {f.message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <button onClick={() => refetch()} className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline">Refresh</button>
        <span className="text-[10px] text-muted-foreground">Last {windowDays} days</span>
      </div>
    </div>
  )
}

export default MomentumCard
