# Momentum Feature Specification

## 1. Overview

Momentum is a composite productivity health indicator (0–100) that represents a user's recent execution velocity, consistency, and meaningful progress quality. It goes beyond simple streaks by blending completion, target attainment, trend acceleration, and sustainability. It should be glanceable (single score + trend) yet explainable (drill-down breakdown of contributing factors).

## 2. Product Goals

- Provide an early warning system for erosion of execution habits
- Reinforce sustainable, meaningful progress (not brute-force volume)
- Reward recovery after dips (comeback psychology)
- Encourage balanced engagement across habits, tasks, and focus blocks
- Be resistant to gaming via spammy micro-actions
- Integrate naturally with XP, daily planning, AI coaching, and social surfaces

## 3. Core Principles

1. Single primary number (Momentum Score) + micro trend indicator
2. Transparent composition (user can see factor weights & weakest area)
3. Recovery is always possible (soft penalties, no irreversible cliffs)
4. Quality beats raw quantity (importance, target adherence, depth)
5. Anti-inflation & anti-abuse (diminishing returns, smoothing)
6. Temporal relevance (recent activity weighted heavier than old)

## 4. What Momentum Shows

| Element                | Description                                                           |
| ---------------------- | --------------------------------------------------------------------- |
| Momentum Score         | Composite score 0–100                                                 |
| Trend Arrow & Label    | Up / Flat / Down with textual label (Accelerating / Stable / Slowing) |
| 10-Day Micro Chart     | Sparkline of daily composite pre-normalization values                 |
| Factor Breakdown       | % contribution + color-coded state (Strong / Neutral / Weak)          |
| Risk / Advisory Banner | When thresholds breached (e.g. "Declining consistency")               |
| Recovery Badge         | If climbing from a recent low (+10 rebound)                           |

## 5. Input Domains

- Habits (daily target attainment & overage)
- Tasks (planned vs completed + importance weighting)
- Focus / Deep Work blocks (duration & continuity)
- XP Velocity (rate of XP gain, not absolute XP)
- Consistency (active days vs idle + inactivity penalties)
- Optional: Social accountability signals (future extension)

## 6. Factor Weights (Initial Calibration)

| Factor           | Weight | Rationale                                |
| ---------------- | ------ | ---------------------------------------- |
| ConsistencyScore | 30%    | Predictive of sustainability             |
| HabitTargetScore | 25%    | Encourages hitting designed baselines    |
| TaskQualityScore | 20%    | Reflects meaningful planned progress     |
| TrendDeltaScore  | 15%    | Captures acceleration / deceleration     |
| FocusDepthScore  | 10%    | Reinforces deep, uninterrupted execution |

Weights are adjustable via config & subject to empirical tuning.

## 7. Component Scores (Pre-Normalization)

### 7.1 ConsistencyScore

Measures active day density & gap penalties over a rolling window (default 10 days).

```
activeDay = total meaningful actions >= ActivityThreshold
base = activeDays / window
streakBonus = min(0.1, (currentStreak - 3) * 0.01)
voidPenalty = 1 - min(0.3, consecutiveZeroDays * 0.07)
ConsistencyScoreRaw = clamp(0, (base + streakBonus) * voidPenalty, 1)
```

### 7.2 HabitTargetScore

```
daySuccess = reachedTarget ? 1 : 0
excessBonus = clamp(0, (dailyCount - target) / target, 0.2)  // cap small soft bonus (max +0.2)
HabitTargetScoreRaw = average(daySuccess + excessBonus) over window (0–1)
```

### 7.3 TaskQualityScore

```
importanceWeight: trivial=0.25, normal=1, important=1.25, critical=1.5
plannedWeighted = Σ(importanceWeight for planned)
completedWeighted = Σ(importanceWeight for completed)
coverage = completedWeighted / max(1, plannedWeighted)
spillPenalty = completedWeighted > plannedWeighted * 1.8 ? 0.9 : 1  // over-stuffing penalty
diminishMicro = clamp(0, 1 - (microTaskCount * 0.02), 1) // discourage spam fragmentation
TaskQualityScoreRaw = clamp(0, coverage * spillPenalty * diminishMicro, 1)
```

### 7.4 TrendDeltaScore

Compare short-term (last 3 days) vs medium horizon (previous 7 days) composite average.

```
shortAvg = avg(compositeDailyRaw[-3..])
prevAvg = avg(compositeDailyRaw[-10..-4])
ratio = (shortAvg - prevAvg) / max(0.01, prevAvg)
TrendDeltaScoreRaw = normalizeRatio(ratio, upCap=+0.3, downCap=-0.3)  // map -0.3..+0.3 -> 0..1
```

Normalization example:

```
normalizeRatio(x) = clamp(0, (x - downCap) / (upCap - downCap), 1)
```

### 7.5 FocusDepthScore

```
blockScore = Σ log2(1 + minutesPerDeepBlock/25)
continuityBonus = sessionsOnConsecutiveDays >= 3 ? 0.05 : 0
FocusDepthScoreRaw = clamp(0, (blockScore / windowNormalizationFactor) + continuityBonus, 1)
```

## 8. Composite Formula

```
MomentumRaw = 0.30*ConsistencyScoreRaw +
              0.25*HabitTargetScoreRaw +
              0.20*TaskQualityScoreRaw +
              0.15*TrendDeltaScoreRaw +
              0.10*FocusDepthScoreRaw
Momentum = round( scaleTo100( smooth(MomentumRaw) ) )
```

Where:

- `smooth` = EMA(alpha=0.35) over MomentumRaw to reduce noise
- `scaleTo100(x)` = floor(x \* 100)

## 9. Trend Label Logic

```
if ratio > 0.05 => label = "Accelerating"
else if ratio < -0.05 => label = "Slowing"
else => label = "Stable"
```

`ratio` as defined in TrendDeltaScore calculation.

## 10. Threshold Bands

| Range  | Color   | Label    | Coaching Nudge Example                  |
| ------ | ------- | -------- | --------------------------------------- |
| 0–39   | red     | Fragile  | "Rebuild consistency with 1 small win." |
| 40–69  | amber   | Building | "Lock daily targets to push upward."    |
| 70–85  | green   | Strong   | "Maintain—focus on depth today."        |
| 86–100 | emerald | Peak     | "Great momentum—protect recovery."      |

## 11. Recovery & Risk States

- Recovery: Momentum rose ≥ 10 points from a 7-day local minimum
- Risk Erosion: Momentum < 45 OR 3 consecutive negative daily deltas
- Collapse Watch: 2 consecutive zero-activity days (trigger proactive coach prompt)

## 12. Anti-Abuse & Normalization

| Abuse Pattern         | Mitigation                                             |
| --------------------- | ------------------------------------------------------ |
| Micro-task spamming   | Diminishing returns (microTaskCount factor)            |
| Habit count inflation | Only first threshold crossing counts; cap excess bonus |
| XP farming            | XP velocity used, not absolute XP                      |
| Single-day overload   | Rolling window & smoothing damp spikes                 |
| Manual toggling       | Require atomic commits & debounce rapid flips          |

## 13. Data Dependencies

| Domain | Fields Needed                                                             |
| ------ | ------------------------------------------------------------------------- |
| Habits | dailyTarget, dailyCount, targetReachedFlag, timestamped counts            |
| Tasks  | planned tasks (importance), completed tasks (importance), micro-task flag |
| Focus  | deep block durations, start/end timestamps                                |
| System | day boundaries (daystamp), streak metadata                                |
| XP     | XP gained per day (for velocity calc)                                     |

## 14. Storage & Caching

- Precompute daily component raws nightly + incremental updates on events
- Cache last 10 days in local storage / client DB for instant UI
- Server authoritative recomputation for reconciliation (hash compare)
- Version tag schema for recalibration migrations

## 15. API Sketch

### 15.1 Read

`GET /api/momentum` →

```json
{
  "score": 72,
  "trend": { "direction": "up", "label": "Accelerating", "deltaPct": 0.12 },
  "factors": [
    { "key": "consistency", "weight": 0.30, "value": 0.74 },
    { "key": "habits", "weight": 0.25, "value": 0.68 },
    { "key": "tasks", "weight": 0.20, "value": 0.71 },
    { "key": "trend", "weight": 0.15, "value": 0.55 },
    { "key": "focus", "weight": 0.10, "value": 0.63 }
  ],
  "bands": { "range": "70-85", "label": "Strong" },
  "states": { "recovery": true, "risk": false },
  "history": [ { "day": "2025-09-11", "raw": 0.52, "score": 52 }, ... ]
}
```

### 15.2 Recompute (internal)

`POST /internal/momentum/recompute` body: `{ userId }`

## 16. Client Display Components

- Compact Widget: Score + arrow + mini sparkline + label
- Expanded Panel: Factors bar list + risk/advice + recent changes
- Drill Modal: Per-day factor table + explanation tooltips ("Why did it drop?")
- Coach Hook: Supplies reasoning strings for AI assistant prompts

## 17. Coach Messaging Examples

| State    | Message                                                        |
| -------- | -------------------------------------------------------------- |
| Fragile  | "Recover momentum with 1 target + 1 focus block today."        |
| Building | "Consistency improving—lock habits before noon."               |
| Strong   | "Great base. Add a deep session to push higher quality."       |
| Peak     | "Peak state. Schedule recovery buffer tomorrow."               |
| Recovery | "Comeback forming—protect the streak of active days."          |
| Risk     | "Momentum erosion: 2 low-output days—reset with a simple win." |

## 18. Future Roadmap

| Version | Enhancement                                       |
| ------- | ------------------------------------------------- |
| v2      | Weekly Momentum Arc & forecast baseline           |
| v3      | Personalized baseline (30d moving reference band) |
| v4      | Time-of-day segment analysis                      |
| v5      | Social percentile (privacy-preserving)            |
| v6      | Adaptive weighting via ML calibration             |

## 19. Edge Cases

| Scenario                               | Handling                                                        |
| -------------------------------------- | --------------------------------------------------------------- |
| New user (<3 days data)                | Progressive onboarding mode (Momentum = null or "Calibrating")  |
| Long inactivity return                 | Decay floor (min 10) + comeback boost gating                    |
| Missing domain (no tasks feature used) | Reweight remaining factors proportionally                       |
| Timezone change                        | Recompute daystamp boundaries server-side                       |
| Backfill / import                      | Mark imported days as low-confidence (exclude from trend delta) |

## 20. Open Questions

- Should habit excess bonus scale by habit difficulty classification?
- Introduce variance penalty if user over-focuses on a single domain?
- Cap recovery labeling frequency? (avoid over-triggering)
- Provide per-factor coaching hooks directly?

## 21. Success Metrics (for feature rollout)

| KPI                                             | Target                       |
| ----------------------------------------------- | ---------------------------- |
| 7d retention uplift (vs control)                | +3–5%                        |
| Drop-off prediction precision                   | >70% for Momentum <40 cohort |
| Coaching CTA click-through                      | >18%                         |
| Abuse signals (spam tasks)                      | <2% of active users          |
| User comprehension (survey: "understand score") | >75% agree                   |

## 22. Implementation Phases

1. Data collection layer + daily aggregation job
2. Raw component calculators + unit tests
3. Composite engine + smoothing + API endpoint
4. UI compact widget + expanded panel
5. Coach integration & messaging catalog
6. Calibration & A/B test weighting adjustments
7. ML-assisted personalization (later phase)

## 23. Glossary

| Term              | Definition                                     |
| ----------------- | ---------------------------------------------- |
| CompositeDailyRaw | Sum of factor raw contributions before scaling |
| ActivityThreshold | Minimum actions defining an "active day"       |
| Micro Task        | Task under threshold effort/duration flag      |
| Recovery State    | Post-dip improvement of >=10 points            |
| Erosion           | Multi-day decline approaching fragility band   |

---

Prepared: 2025-09-20
Status: Draft v1
Owner: Product / Data Collaboration

---

## 24. Technical Calculation Algorithm (Implementation Layer)

This section documents the precise algorithm currently implemented in the momentum engine (see `sdk/src/momentum`). It reconciles earlier product abstractions with the normalized, factor-based computation actually running in code.

### 24.1 Daily Input Shape (Engine-Level)

Engine consumes a dense ordered array of days, each shaped (conceptually) as:

```
MomentumInputDay {
  day: YYYY-MM-DD
  habits?: {
    completionRatio: 0..1              // count / target (capped)
    reached: boolean                   // target achieved
    excessRatio?: number >=0           // (count - target)/target
    streak?: number                    // consecutive reached days
  }
  tasks?: {
    planned: number
    completed: number
    qualityRatio?: 0..1                // optional external quality signal
    microTaskRatio?: 0..1              // share of micro tasks
  }
  focus?: {
    deepMinutes: number                // aggregated deep work minutes
    sessions?: number                  // (optional) deep sessions count
  }
  activity?: {
    xpEarned: number                   // XP gained this day
  }
}
```

Missing domain objects mark that domain "absent" for the day (used in weight reallocation & transparency via `missingDomains`).

### 24.2 Factor Set

Raw normalized factors (0..1) before weighting:

1. HabitConsistency (HC)
2. HabitTarget (HT)
3. HabitExcess (HE)
4. HabitStreak (HS)
5. TaskCompletion (TC)
6. TaskQuality (TQ)
7. TaskMicroPenalty (TMP) // inverted penalty treated as positive multiplier factor
8. FocusDepth (FD)
9. ActivityPresence (AP)
10. Trend (TR) // derived after smoothing baseline

### 24.3 Weight Reallocation

Start from base weights W. If an entire domain (e.g. tasks) is absent a day, set its associated factors' weights to 0 and redistribute their total weight proportionally over remaining present-domain factors so the sum of effective weights stays 1.

Formula for present factor i:

$$ W'_i = W_i + W_i \* \frac{S_{miss}}{\sum\_{j \in present} W_j} $$

where $S_{miss}$ is summed base weight of missing-domain factors.

### 24.4 Factor Formulas

Let clamp(x) ⇒ bound to [0,1] unless otherwise noted.

#### HabitConsistency (HC)

Directly the provided completion ratio r:
$$ HC = r $$

#### HabitTarget (HT)

Encourages crossing the threshold; near misses get partial credit.

If reached:
$$ HT = 1 $$
Else with r = completionRatio:
$$ HT = \text{clamp}\left( \left(\frac{r - 0.5}{0.5}\right) \* 0.6 \right) $$

#### HabitExcess (HE)

If reached & excess ratio e > 0:
$$ HE = \min\left(1, \frac{e}{E\_{cap}} \right) $$
Else 0. (`E_cap` = max excess bonus ratio, e.g. 0.5)

#### HabitStreak (HS)

With streak length s and cap S*cap (e.g. 30):
$$ HS = \frac{\min(s, S*{cap})}{S\_{cap}} $$

#### TaskCompletion (TC)

If tasks absent: factor removed. Otherwise with C=completed, P=planned and P>0:
$$ raw = \frac{C}{P} $$
Over-completion diminishing when C>P:
$$ raw = 1 - \min\big(0.2, \log\_{10}(1 + (C-P))\big) $$
Finally:
$$ TC = \text{clamp}(raw) $$

#### TaskQuality (TQ)

If qualityRatio q supplied:
$$ TQ = \text{clamp}(q) $$
Else neutral default 0.5 (treated as informational presence; optionally could mark missing instead).

#### TaskMicroPenalty (TMP)

With micro ratio m (0..1):
$$ p = m^{1.3} $$
Apply cap P_cap (e.g. 0.5) to penalty magnitude:
$$ TMP = 1 - \min(p, P\_{cap}) $$
If micro ratio missing: TMP = 1.

#### FocusDepth (FD)

With deep minutes D and cap D*cap (e.g. 240):
$$ base = \frac{\min(D, D*{cap})}{D\_{cap}} $$
Soft easing:
$$ FD = base^{0.85} $$

#### ActivityPresence (AP)

Void penalty & soft landing logic (xp = xpEarned):

1. If xp = 0 and previous day xp = 0 ⇒ AP = 0 (full void)
2. If xp = 0 and previous day xp > 0 ⇒ AP = 0.3 (soft landing)
3. If 0 < xp < T_xp ⇒ AP = (xp / T_xp) \* 0.8
4. Else AP = 1

Then floor via void penalty cap if configured.

#### Trend (TR)

Computed after initial raw composite & EMA. Short vs previous window mean difference normalized.

Let EMA_d be smoothed composite (pre-trend) for day d, short window w_s, longer window w_l.

For day d with sufficient history:
$$ A*s = \frac{1}{w_s}\sum*{k=0}^{w*s-1} EMA*{d-k} $$
$$ A*l = \frac{1}{w_l}\sum*{k=0}^{w*l-1} EMA*{d-k} $$
$$ \Delta = A*s - A_l $$
Normalize with delta cap D_cap (e.g. 0.3):
$$ TR*{raw} = \text{clamp}\left(\frac{\Delta}{D*{cap}}, -1, 1\right) $$
Shift to 0..1:
$$ TR = \frac{TR*{raw}+1}{2} $$
Insufficient history ⇒ TR = 0.5 (neutral).

### 24.5 Composite (Two Pass)

1. Compute raw factors except trend; weight-sum ⇒ preTrendRaw(d)
2. EMA smoothing: \( EMA*d = \alpha * preTrendRaw_d + (1-\alpha)*EMA*{d-1} \)
3. Compute TR factors
4. Final weighted sum including TR:

$$ Score_d = \sum_i W'\_i \* f_i(d) $$

### 24.6 Scaling & Output

Display score:
$$ Momentum_d = 100 \* Score_d $$

### 24.7 Bands

Example thresholds (configurable):

| Range  | Band     |
| ------ | -------- |
| 0–39   | Recovery |
| 40–59  | Stable   |
| 60–79  | Growth   |
| 80–100 | Peak     |

### 24.8 State Flags

Heuristics (simplified):

- risk: two consecutive scores < 0.35 OR TR < 0.45 with AP low
- recovery: band=Recovery AND TR > 0.55
- growth: band=Growth AND TR >= 0.5 OR (band=Stable AND TR > 0.65)
- peak: band=Peak AND TR >= 0.5

### 24.9 Pseudocode

```
for each day d in days (chronological):
  detect missing domains
  reweight weights -> W'
  compute raw base factors (excluding TR)
  preTrendRaw[d] = dot(W' without TR, factorsWithoutTR)

EMA[0] = preTrendRaw[0]
for d>=1:
  EMA[d] = alpha*preTrendRaw[d] + (1-alpha)*EMA[d-1]

for each d:
  if sufficient history:
    compute TR(d) using EMA
  else TR(d)=0.5
  Score[d] = dot(W' including TR, factorsIncludingTR)
  scaled = 100*Score[d]
  classify band + states
```

### 24.10 Edge Cases

| Case                           | Handling                                     |
| ------------------------------ | -------------------------------------------- |
| Empty input                    | Returns score 0 (no factors)                 |
| All domains absent a day       | Score 0 that day; flagged via missingDomains |
| Insufficient history for trend | TR = 0.5 neutral                             |
| Division by zero (planned=0)   | Treat tasks domain as absent                 |
| Negative / NaN inputs          | Sanitized to 0 before factor math            |

### 24.11 Complexity

Time: O(N \* F) with F≈10 constants. Space: O(N) for arrays (raw, EMA, trend).

### 24.12 Divergences vs Product Spec

| Product Spec Concept             | Engine Implementation                                                         |
| -------------------------------- | ----------------------------------------------------------------------------- |
| ConsistencyScore monolithic      | Split into HC, HT, HE, HS, AP factors                                         |
| Quality weighting by importance  | Currently summarized as coverage + optional external qualityRatio             |
| Excess bonus +0.2 cap            | Implemented via HE with configurable cap (default 0.5 ratio limit normalized) |
| Micro-task linear penalty        | Implemented as power curve m^1.3 capped                                       |
| Trend ratio window (3 vs prev 7) | Equivalent using short & long EMA slices                                      |
| Recovery delta >=10 points       | Currently heuristic via band + trend flags                                    |

### 24.13 Future Hooks

- Per-factor confidence weighting when data partial
- Domain variance dampening (reduce overweight of volatile domain)
- Personalized baseline (center TR around user mean)
- Factor provenance audit object for Explainability UI

---
