import { useMutation } from '@tanstack/react-query'
import { trpc } from '@web/lib/trpc'
import { useMomentumUI } from '@web/namespaces/momentum/store'
import { useMomentum } from '../useMomentum'
import FactorBreakdown from './factor-breakdown'
import MomentumCard from './momentum-card'
import RecommendationsPanel from './recommendations-panel'

import type { DecayEvent } from '@sdk/core/momentum'

function CoolingMeta({ decayEvents }: { decayEvents?: DecayEvent[] }) {
  if (!decayEvents?.length) return null
  const latest = decayEvents[decayEvents.length - 1]
  return (
    <span className='text-[10px] font-mono text-indigo-400' title={`Cooling active. Last gap ${latest?.gapDays ?? "?"}d before day index ${latest?.index ?? "?"}.`}>Cooling x{decayEvents.length}</span>
  )
}

export function MomentumPanel() {
  const { showAdvanced, toggleAdvanced } = useMomentumUI()
  const { data, refetch } = useMomentum({ windowDays: 10, persist: true })

  const logEventMutation = useMutation(trpc.momentum.logEvent.mutationOptions())

  async function logEvent() {
    try {
      await logEventMutation.mutateAsync({ amount: 1, instanceId: 'habit-1' })
      await refetch()
    } catch (e) { console.error('logEvent failed', e) }
  }

  const roundedCoverageRatio = data?.coverage ? Math.round(data.coverage.ratio * 100) : 0
  const roundedConfidence = data?.confidence !== undefined ? Math.round(data.confidence * 100) : undefined
  const decayEvents = data?.decayEvents

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-center justify-between'>
        <h2 className='text-sm font-semibold tracking-wide text-muted-foreground'>Momentum</h2>
        <button onClick={toggleAdvanced} className='text-xs underline underline-offset-2'>
          {showAdvanced ? 'Basic View' : 'Advanced'}
        </button>
      </div>
      <div className='flex items-start gap-3'>
        <MomentumCard windowDays={10} showExplanation={showAdvanced} />
        <div className='flex flex-col gap-2'>
          <button
            onClick={() => logEvent()}
            className='px-3 py-2 text-xs rounded-md border bg-background hover:bg-muted'>Log +1</button>
          <button
            onClick={() => { refetch() }}
            className='px-3 py-2 text-xs rounded-md border bg-background hover:bg-muted'>Refresh</button>
        </div>
      </div>
      {showAdvanced && (
        <div className='grid md:grid-cols-2 gap-3'>
          {data?.coverage && (
            <div className='rounded-lg border bg-background p-3 flex flex-col gap-2 text-xs'>
              <div className='flex items-center justify-between'>
                <span className='font-medium text-muted-foreground'>Data Quality</span>
                <span className='font-mono'>{roundedCoverageRatio}% cov</span>
              </div>
              <div className='flex flex-wrap gap-2 items-center'>
                <span className='text-[10px] font-mono'>Observed {data.coverage.observed}/{data.coverage.expected}</span>
                {data.imputedFactors?.length ? <span className='text-[10px] font-mono'>Imputed {data.imputedFactors.length}</span> : null}
                {roundedConfidence !== undefined && <span className='text-[10px] font-mono'>Conf {roundedConfidence}%</span>}
                {data.gaps?.largestGapDays && data.gaps.largestGapDays > 0 && <span className='text-[10px] font-mono'>Largest Gap {data.gaps.largestGapDays}d</span>}
                <CoolingMeta decayEvents={decayEvents} />
              </div>
              {decayEvents?.length ? (
                <div className='mt-1 space-y-0.5'>
                  <div className='text-[10px] uppercase tracking-wide text-muted-foreground font-mono'>Recent Cooling</div>
                  <ul className='space-y-0.5'>
                    {decayEvents.slice(-3).map((e: DecayEvent, i: number) => (
                      <li key={i} className='text-[10px] font-mono text-indigo-400'>gap {e.gapDays}d → decay {(e.after / (e.before || 1)).toFixed(2)}x</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}

          <FactorBreakdown />
          <RecommendationsPanel />
        </div>
      )}
    </div>
  )
}

export default MomentumPanel
