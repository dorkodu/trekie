# Momentum Engine Algorithm

Implementation-level reference for developers working on `sdk/src/momentum`.

## 1. Objective

Provide a deterministic composite score (0–100) summarizing multi-domain execution health: habits, tasks, focus, activity trend.

## 2. Data Contract (Internal Shape)

```ts
interface MomentumInputDay {
  day: string // YYYY-MM-DD
  habits?: {
    completionRatio: number // 0..1
    reached: boolean
    excessRatio?: number // >=0
    streak?: number
  }
  tasks?: {
    planned: number
    completed: number
    qualityRatio?: number // optional 0..1
    microTaskRatio?: number // 0..1
  }
  focus?: {
    deepMinutes: number
    sessions?: number
  }
  activity?: {
    xpEarned: number
  }
}
```

Missing objects => domain absence (affects weight reallocation and `missingDomains`).

## 3. Factor List

| Key | Description                                            |
| --- | ------------------------------------------------------ |
| HC  | HabitConsistency (completion ratio)                    |
| HT  | HabitTarget (threshold attainment emphasis)            |
| HE  | HabitExcess (capped over-target gain)                  |
| HS  | HabitStreak (capped streak normalization)              |
| TC  | TaskCompletion (coverage with over-completion damping) |
| TQ  | TaskQuality (externally provided or neutral)           |
| TMP | TaskMicroPenalty (inverse penalty)                     |
| FD  | FocusDepth (saturated deep work)                       |
| AP  | ActivityPresence (void penalty logic)                  |
| TR  | Trend (short vs long EMA differential)                 |

All factors normalized 0..1 before weighting.

## 4. Weights & Reallocation

Base weights define intended distribution. If all factors tied to a domain are absent, their total weight mass is redistributed proportionally over the remaining present-domain factors.

Formula:

```
W'_i = W_i + W_i * (S_miss / sum_present_W)
```

Where S_miss is the sum of base weights for all missing-domain factors.

## 5. Factor Equations

Let clamp01(x)=min(1,max(0,x)).

HC:

```
HC = completionRatio
```

HT:

```
if reached: HT=1
else: HT = clamp01(((r - 0.5)/0.5) * 0.6)
```

HE:

```
if reached and e>0: HE = min(1, e / E_CAP) else 0
```

HS:

```
HS = min(streak, S_CAP) / S_CAP
```

TC:

```
if tasks absent: removed
else if planned<=0: removed (domain absent semantics)
else raw = completed / planned
if completed > planned:
  raw = 1 - min(0.2, log10(1 + (completed - planned)))
TC = clamp01(raw)
```

TQ:

```
TQ = clamp01(qualityRatio ?? 0.5)
```

TMP:

```
if microTaskRatio undefined: TMP = 1
else p = microTaskRatio ** 1.3
TMP = 1 - min(p, P_CAP)
```

FD:

```
base = min(deepMinutes, D_CAP)/D_CAP
FD = base ** 0.85
```

AP:

```
if xp=0 and prev xp=0: AP=0
else if xp=0: AP=0.3
else if xp < XP_THRESH: AP = (xp/XP_THRESH)*0.8
else AP=1
```

TR (after EMA pre-trend):

```
A_s = mean(EMA[d - k], k < shortWindow)
A_l = mean(EMA[d - k], k < longWindow)
Δ = A_s - A_l
TR_raw = clamp(Δ / DELTA_CAP, -1, 1)
TR = (TR_raw + 1)/2
Insufficient history -> TR=0.5
```

## 6. Two-Pass Computation

1. Compute base factors (no TR) per day -> weighted preTrendRaw
2. Compute EMA over preTrendRaw (alpha configurable)
3. Compute TR using EMA differentials
4. Final composite includes TR weight
5. Scale to 0–100

## 7. EMA

```
EMA[0] = preTrendRaw[0]
EMA[d] = alpha*preTrendRaw[d] + (1-alpha)*EMA[d-1]
```

## 8. Trend Windows

Defaults: short=3, long=7 (must satisfy long > short). If history length < long window, TR neutral (0.5).

## 9. Bands & States

Example thresholds (configurable):

```
0-39  Recovery
40-59 Stable
60-79 Growth
80-100 Peak
```

State flags heuristics (simplified):

- risk: two consecutive Score<0.35 or (TR<0.45 and AP low)
- recovery: band=Recovery and TR>0.55
- growth: band=Growth and TR>=0.5 OR (band=Stable and TR>0.65)
- peak: band=Peak and TR>=0.5

## 10. Edge Handling

| Scenario           | Behavior                                                            |
| ------------------ | ------------------------------------------------------------------- |
| Empty input        | Returns empty history, score 0                                      |
| Missing domain     | Reweight others, mark in `missingDomains`                           |
| Zero planned tasks | Treat tasks domain absent for that day                              |
| NaN / negative     | Sanitized to 0 before factor math                                   |
| Sparse days        | Caller must supply dense sequence; gaps = zero activity if included |

## 11. Complexity

Time O(N\*F) with F≈10. Space O(N).

## 12. Extension Guidelines

1. Add new factor key in types
2. Assign base weight (adjust total to 1 or auto-normalize)
3. Insert computation in factors module
4. Include domain mapping for reweight logic
5. Update docs (this file + spec section)
6. Add unit tests for boundaries & missing-domain interaction

## 13. Calibration Levers

| Lever       | Effect                                          |
| ----------- | ----------------------------------------------- |
| E_CAP       | Aggressiveness of excess habit bonus            |
| S_CAP       | Time to max streak credit                       |
| P_CAP       | Strength of micro task penalty                  |
| D_CAP       | Saturation point for focus depth                |
| DELTA_CAP   | Trend sensitivity (smaller -> more volatile TR) |
| alpha (EMA) | Smoothing (higher -> more reactive)             |

## 14. Pseudocode

```ts
function compute(days) {
  const pre = []
  const ctx = { prevXp: 0 }
  for d in days:
    identify domains present
    W' = reweight(baseWeights, presentDomains)
    factors = computeBaseFactors(d, ctx)
    pre[d] = dot(W' without TR, factorsWithoutTR)
    ctx.prevXp = d.activity?.xpEarned || 0
  EMA = runEMA(pre, alpha)
  for d in days:
    TR = trendFor(d, EMA) // or 0.5 neutral
    final[d] = dot(W' with TR, { ...factors, TR })
  scale scores -> 0..100 & classify bands/states
  return result
}
```

## 15. Divergences from Product Spec

See section 24.12 in main spec. This file reflects authoritative implementation details; product spec may be higher-level.

## 16. Testing Matrix

| Case                | Focus                            |
| ------------------- | -------------------------------- |
| Single-day input    | TR neutral correctness           |
| Missing tasks       | Reweight sums to 1               |
| Over-complete tasks | Diminishing penalty applied      |
| High micro ratio    | TMP floor respected              |
| Streak overflow     | HS capped                        |
| Excess overflow     | HE capped                        |
| Void two days       | AP=0 second day                  |
| Trend positive      | TR > 0.5 and increases composite |

## 17. Future Enhancements

- Per-factor confidence weights
- Alternative smoothing (HW, Kalman)
- Personalized baseline centering for TR
- Domain volatility dampening

## 18. Missing Data, Coverage & Gap Decay (Added 2025-09, Updated Active Decay)

### 18.1 Missing Domain Strategy

Current default: `neutral-impute`.

If an entire domain (habits, tasks, focus) is absent across the window:

- Reweight strategy (legacy): redistribute its weight mass to remaining domains.
- Neutral-impute (active): preserve original weights but assign a neutral raw value taken from `MOMENTUM_NEUTRAL_VALUES` (e.g. tasks=0.55, focus=0.5) so the composite remains structurally comparable day to day.
- Hybrid (reserved): mix of critical factor imputation + reweight for secondary domains.

`imputedFactors` lists factor keys filled neutrally. `missingDomains` still marks structural absence for diagnostics.

### 18.2 Coverage & Confidence

`coverage` object on `MomentumResult`:

| Field          | Meaning                                                                   |
| -------------- | ------------------------------------------------------------------------- |
| expected       | Count of total conceptual factors (including virtual consistency & trend) |
| observed       | Count backed by actual domain data                                        |
| imputed        | Count filled with neutral values                                          |
| ratio          | observed / expected                                                       |
| effectiveRatio | (observed + imputed) / expected (≈1 once all imputed)                     |

`confidence = sqrt(ratio)` — concave mapping reduces optimism under sparse coverage while not overly punishing moderate gaps.

### 18.3 UI Implications

Low coverage (<0.8) injects recommendation `LOW_COVERAGE_DATA` advising user to log more domains. Imputed factors are annotated in explanations with `(imputed)`.

### 18.4 Gap Detection & Active Decay

We now actively cool the smoothed composite (EMA) across missing calendar gaps using exponential half‑life decay before ingesting the next real data point.

For two consecutive recorded days with calendar difference `Δ` days, the number of missing days is:

```
gapDays = Δ - 1
```

If `gapDays >= MOMENTUM_GAP_DECAY.minGapDays` and decay is enabled:

```
decayFactor = exp(-ln(2) * gapDays / halfLifeDays)
prev = neutral + (prev - neutral) * decayFactor
```

Then the normal EMA update runs:

```
EMA_new = alpha * currentValue + (1 - alpha) * prev
```

Neutral selection:

- `neutralStrategy: 'fixed'` uses `fixedNeutralValue` (default 0.5)
- `neutralStrategy: 'weighted'` uses a weighted average of `MOMENTUM_NEUTRAL_VALUES` by base factor weights

All applied decays are recorded in `decayEvents[]` with shape `{ index, gapDays, before, after }` for diagnostics & recommendations.

### 18.5 Reason Codes

Added / updated:

- `LOW_COVERAGE_DATA` – coverage.ratio < 0.8
- `GAP_DECAY_ACTIVE` – emitted only when at least one actual decay event exists in `decayEvents`

### 18.6 Calibration Notes

- halfLifeDays=7 chosen for intuitive weekly momentum memory; large gaps (> ~5 \* halfLife) converge near neutral.
- Adjust `minGapDays` to ignore single-day omissions if needed (currently 1 to treat any gap).
- Confidence still derived from coverage; independent from decay.
- Future: adaptive half-life based on historical discipline, domain-specific decay rates, explicit vacation freeze mode.

### 18.7 DecayEvent Reference

`decayEvents` (array) is attached to `MomentumResult` when one or more inactivity gaps triggered cooling before ingesting the next data point.

| Field   | Type   | Meaning                                                                                          |
| ------- | ------ | ------------------------------------------------------------------------------------------------ |
| index   | number | Zero-based index in the sorted window days where decay was applied prior to processing that day. |
| gapDays | number | Count of missing calendar days immediately preceding this day (Δ - 1).                           |
| before  | number | EMA value immediately before applying decay (pre-cooling).                                       |
| after   | number | EMA value after decay, before adding the current day via the EMA update.                         |

Multiplier implicit: `after / before` (or 1 if `before`≈neutral). Always `0 < after <= before` unless `before` already at or below neutral where cooling may have minimal effect.

Consumers can surface:

- Cooling badge if `decayEvents.length > 0`
- Recent gap tooltip using last event's `gapDays`
- Diagnostic list (last 3 events) with `gapDays` and multiplier `(after/before).toFixed(2)`
