# Momentum Library

Pure functional momentum score computation module based on the product specification in `docs/04 - Momentum.md`.

## Design Goals

- Deterministic pure calculations (no side-effects)\n- Explicit inputs, typed outputs\n- Modular factor calculators\n- Stable defaults + overridable weights/options\n- Defensive against abuse vectors (diminishing returns, caps)

## Quick Start

```ts
import { createMomentumEngine, MomentumInputDay } from '@trekie/sdk'

const engine = createMomentumEngine()

const days: MomentumInputDay[] = [
  {
    day: '2025-09-11',
    habits: { target: 3, count: 3, reached: true },
    tasks: {
      planned: [{ importance: 'normal' }],
      completed: [{ importance: 'normal' }],
      microTaskCount: 0,
    },
    focus: { deepBlocks: [{ minutes: 50 }] },
    xp: { xpGained: 25 },
  },
  // ... more days
]

const result = engine.compute(days)
console.log(result.score, result.trend, result.factors)
```

## Public API

### `createMomentumEngine(init?: MomentumEngineInit)`

### Backend Endpoint (Integration)

The API exposes a snapshot endpoint `momentum.getSnapshot` returning a minimal object that can be expanded via flags:

```jsonc
{
  "score": 72.4,
  "trend": 0.08,              // normalized short-vs-prev window ratio (raw float)
  "bands": { "current": { "label": "building", "score": 72.4 } },
  "states": { "recovery": false, "risk": false },
  "history": [ { "day": "2025-09-11", "raw": 0.61, "score": 61 }, ... ],
  "missingDomains": { "tasks": true, "focus": true }
}
```

Expansion query flags:

| Field           | Type    | Notes                                                        |
| --------------- | ------- | ------------------------------------------------------------ |
| windowDays      | number  | Defaults to 10 (min 5, max 30)                               |
| explain         | boolean | Attach factor explanation + strengths                        |
| delta           | boolean | (Future) Compare against previous snapshot (placeholder now) |
| impact          | boolean | Include point impact estimation                              |
| recommendations | boolean | Include prioritized recommendation list                      |

If there is insufficient data the endpoint returns `{ calibrating: true }` so the UI can show a gentle onboarding message.

Frontend hook `useMomentum` wraps the TRPC call, adds `calibrating`, and optionally persists snapshots to Dexie when `persist: true`. History access via `useMomentumHistory(limit)`.

UI components:

- `MomentumCard` – compact score + band + trend
- `FactorBreakdown` – per-factor value & contribution list
- `RecommendationsPanel` – action suggestions when recommendations flag enabled
- `MomentumPanel` – composite with advanced toggle (uses Zustand store `useMomentumUI`)

Returns an engine with `compute(days)`.

#### Options

| Field                        | Default | Description                               |
| ---------------------------- | ------- | ----------------------------------------- |
| windowDays                   | 10      | Rolling window for most factors           |
| trendShortWindow             | 3       | Short-term slice for trend delta          |
| trendPrevWindow              | 7       | Previous slice window                     |
| emaAlpha                     | 0.35    | Smoothing factor (0..1)                   |
| activityThreshold.minActions | 1       | Minimal domain actions to count as active |

#### Weights

Defaults: consistency 0.30, habits 0.25, tasks 0.20, trend 0.15, focus 0.10.

### Input Shape (`MomentumInputDay`)

| Field  | Notes                                                     |
| ------ | --------------------------------------------------------- |
| day    | ISO date string (YYYY-MM-DD)                              |
| habits | `{ target, count, reached }`                              |
| tasks  | planned/completed arrays with importance & microTaskCount |
| focus  | deepBlocks with minutes                                   |
| xp     | currently only used indirectly in activity detection      |

### Output (`MomentumResult`)

| Field          | Notes                                           |
| -------------- | ----------------------------------------------- |
| score          | 0-100 smoothed composite                        |
| raw            | 0-1 smoothed composite before scaling           |
| factors        | Array of each raw factor value & applied weight |
| trend          | Direction + label + deltaPct                    |
| bands          | Current band (Fragile, Building, Strong, Peak)  |
| states         | Recovery & risk booleans                        |
| history        | Per-day raw & scaled (unsmoothed) values        |
| missingDomains | Map of domains absent (for UI fallback)         |

## Factor Logic Summary

- Consistency: Active day density + streak bonus - void penalty
- Habit Target: Success + capped excess bonus
- Task Quality: Weighted coverage with spill & micro-task penalties
- Focus Depth: Log-scaled block accumulation + continuity bonus
- Trend: Normalized multi-day ratio (short vs previous window)

## Anti-Abuse Controls

- Micro-task diminishing returns (2% each)
- Excess habit cap `MAX_HABIT_EXCESS_BONUS`
- Streak bonus cap `MAX_STREAK_BONUS`
- Void penalty cap `MAX_VOID_PENALTY`
- Trend clamped between DOWN_CAP & UP_CAP before normalization

## Extensibility

Add new factors by extending `MomentumFactorValuesRaw`, weights, and `computeFactors`.

### Detailed Algorithm Reference

See `ALGORITHM.md` in this directory for formal equations, pseudocode, and calibration levers. The product-level narrative remains in `docs/04 - Momentum.md` (section 24 hosts a synchronized summary). Keep all three aligned when modifying factor logic.

## Explanations & Coaching Hooks

Use the explanation helper to convert a `MomentumResult` into human-readable factor insights.

```ts
import {
  createMomentumEngine,
  explainMomentum,
  summarizeMomentum,
} from '@trekie/sdk'

const engine = createMomentumEngine()
const result = engine.compute(days)

const detailed = explainMomentum(result)
// detailed.factors -> array with strength, message, contribution
// detailed.summary -> high-level sentence

console.log(summarizeMomentum(result))
// e.g. "Momentum 72 (accelerating). Consistency strong; biggest lift opportunity: Focus Depth."
```

Options:

| Option               | Default    | Description                                              |
| -------------------- | ---------- | -------------------------------------------------------- |
| minContribution      | 0          | Hide very tiny factors by contribution (weight \* value) |
| includeContributions | true       | If false, zero out numeric contribution field            |
| round                | toFixed(2) | Custom rounding function                                 |

Each factor explanation includes:

| Field        | Meaning                                              |
| ------------ | ---------------------------------------------------- |
| key          | Factor id (consistency, habits, tasks, trend, focus) |
| value        | Normalized 0..1 factor value (rounded)               |
| weight       | Effective weight used                                |
| contribution | weight \* value (0..1 share)                         |
| strength     | qualitative bucket (weak/neutral/strong)             |
| message      | Coaching-friendly sentence                           |

## Delta & Impact Utilities

### Factor Delta Comparison

Use `diffMomentum(prev, curr)` to inspect how each factor changed:

```ts
import { diffMomentum } from '@trekie/sdk'
const diff = diffMomentum(previousResult, currentResult)
console.log(diff.scoreDelta, diff.biggestPositive, diff.biggestNegative)
```

Returned fields:

| Field           | Meaning                                       |
| --------------- | --------------------------------------------- |
| scoreDelta      | Current score - previous score                |
| factors[]       | Per-factor prev/curr/delta/weightedDelta info |
| biggestPositive | Highest positive weightedDelta factor         |
| biggestNegative | Most negative weightedDelta factor            |

### Point Impact Estimation

Estimate potential upside if weaker factors reach a target (default 0.8):

```ts
import { computePointImpact } from '@trekie/sdk'
const impact = computePointImpact(result, { strongTarget: 0.85 })
console.log(impact.estimatedPointUpside, impact.factors)
```

Each entry:

| Field            | Meaning                                        |
| ---------------- | ---------------------------------------------- |
| potentialRawGain | Added raw composite (before \*100) if improved |
| potentialPoints  | potentialRawGain \* 100                        |
| target           | Target factor value used                       |

## Recommendations & Reason Codes

Generate prioritized coaching actions:

```ts
import { recommendMomentumActions } from '@trekie/sdk'
const recs = recommendMomentumActions(result)
recs.forEach(r => console.log(r.code, r.title))
```

Reason codes (stable identifiers):

```
CONSISTENCY_STRONG, CONSISTENCY_WEAK,
HABITS_STRONG, HABITS_WEAK,
TASKS_STRONG, TASKS_WEAK,
TREND_UP, TREND_DOWN,
FOCUS_STRONG, FOCUS_WEAK,
RECOVERY_ACTIVE, RISK_STATE
```

Recommendation object:

| Field    | Description                        |
| -------- | ---------------------------------- |
| code     | Machine reason code for UI mapping |
| title    | Short headline                     |
| detail   | Human explanation                  |
| actions  | Optional quick action verb phrases |
| factor   | Related factor key (if any)        |
| priority | high / medium / low ordering       |

Use `code` and `priority` for iconography & escalation logic.

## Using with Existing Trekie Data

The app already stores: habit entities (with `history` & `dailyTarget`) and commit records. Tasks and focus may be missing initially—Momentum will automatically reweight remaining factors when domains are absent.

### Adapter

Use `buildMomentumDays` from `adapters.ts` to transform existing data:

```ts
import { buildMomentumDays, createMomentumEngine } from '@trekie/sdk'

async function computeMomentum(db: any, trekie: any, userId: string) {
  const habits = await db.habits.where('userId').equals(userId).toArray()
  const commits = await trekie.db.commitRecords
    .where('userId')
    .equals(userId)
    .toArray()

  const days = buildMomentumDays({
    habits,
    commitRecords: commits,
    windowDays: 10,
  })
  const engine = createMomentumEngine()
  return engine.compute(days)
}
```

Adapter behavior:

- Aggregates multiple habits into a single virtual per-day habit metric
- Uses `habit.history` for authoritative counts
- Marks `reached` if DAILYCHECK or counts >= target
- Omits tasks & xp until data wired
- Accepts optional focus blocks array: `{ day, minutes }[]`

### Minimal Usage (Habits Only)

```ts
const engine = createMomentumEngine()
const days = buildMomentumDays({ habits, commitRecords })
const result = engine.compute(days)
console.log(result.score, result.missingDomains)
```

### Interpreting `missingDomains`

If `tasks` missing => weight redistributed among present domains. UI can hide task factor rows.

## Testing Suggestions

- Edge: empty days array -> score 0
- Partial domain absence -> reweight? (Currently factor = 0; future: proportional reweighting)
- Trend with flat series -> Stable
- Recovery detection after 10 point rebound

## Roadmap TODOs

- Reweighting when domains missing
- Configurable importance weights per workspace
- XP velocity factor integration
- Confidence flag for imported/backfilled days

---

MIT (internal usage).
