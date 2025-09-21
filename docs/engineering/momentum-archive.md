# Momentum Feature Development Archive

> Comprehensive historical and technical log of the Momentum system evolution. Generated: 2025-09-21.

## 0. Table of Contents

1. Chronology
2. Architecture & Domain Model
3. Algorithm Evolution
4. Key Decisions & Rationale
5. Data Structures & Types
6. Recommendation System
7. UI Integration Timeline
8. Testing Matrix & Evolution
9. Configuration Parameters
10. Future Roadmap (Proposed)
11. Usage & Extension Examples
12. Appendix: Glossary & Reference

---

## 1. Chronology

| Phase | Theme                             | Core Outputs                                                                        | Notable Changes                                           |
| ----- | --------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------- |
| 1     | Habit XP Neutrality Fix           | Ensured COUNT_UP / COUNT_DOWN habit daily checks produce neutral XP impact          | Bug triage & resolution                                   |
| 2     | Standalone Engine Scaffold        | Initial TypeScript momentum engine library created                                  | Factor model defined; basic composite & trend placeholder |
| 3     | Explanation Layer                 | Human-readable explanation API                                                      | Top/weak factor extraction                                |
| 4     | Analytics Expansion               | Delta comparison, point impact estimation, recommendation system with reason codes  | Introduced semantic reason codes                          |
| 5     | Repo Restructure                  | Moved core under `sdk/src/core/momentum`                                            | Centralized exports & docs scaffold                       |
| 6     | Initial UI Integration            | Momentum card component                                                             | Basic score, band, trend display                          |
| 7     | Persistence Layer                 | Snapshot storage (Postgres + Dexie)                                                 | Backend namespace & client cache                          |
| 8     | Previous Snapshot Delta           | Accurate change vs prior persisted snapshot                                         | Delta semantics clarified                                 |
| 9     | Missing Data Foundations          | Neutral-impute concept & coverage metrics planning                                  | Strategy selection groundwork                             |
| 10    | Coverage & Confidence             | Implemented neutral-impute, coverage ratios, confidence metric (sqrt mapping)       | Imputed factor labeling                                   |
| 11    | Gap Detection Scaffolding         | Identified inactivity gaps (informational)                                          | Largest/recent gap metrics                                |
| 12    | Active Gap Decay                  | Exponential decay smoothing across gaps (half-life, minGapDays, neutral strategies) | `decayEvents` telemetry introduced                        |
| 13    | Typed Decay Events & Refined Recs | Added `DecayEvent` interface; rec triggers only on actual cooling                   | `GAP_DECAY_ACTIVE` conditioned on events                  |
| 14    | UI Cooling Indicators             | Cooling badge, recent decay list, data quality enhancements                         | Tooltip & multiplier rendering                            |
| 15    | Documentation Consolidation       | Updated `ALGORITHM.md` + archive                                                    | Added DecayEvent reference table                          |

---

## 2. Architecture & Domain Model

### Layering

- SDK Core (`sdk/src/core/momentum`): Pure computation & analytics helpers.
- API Layer (`api/src/...`): Persistence of momentum snapshots (JSONB) + service endpoints.
- Web Client (`web/src/components/momentum`): Visualization (score, bands, explanations, recommendations, cooling state, data quality).
- Local Cache (Dexie): Client-side historical reads without server roundtrip.

### Data Flow (High-Level)

1. Domain events → Daily aggregates (`MomentumInputDay`) via upstream collectors (habits, tasks, focus, xp).
2. Engine compute → `MomentumResult` (score, factors, states, coverage, gaps, decayEvents, recommendations optionally).
3. Result persisted (server) & cached (client) for delta & trend continuity.
4. UI renders primary card + advanced panels (explanation, factor breakdown, recommendations, quality, cooling summary).

### Domains & Factors Mapping

- Habits → Habit adherence & excess (simplified to a single normalized factor in current implementation).
- Tasks → Weighted completion, over-completion dampening, micro-task penalty bundling.
- Focus → Deep work block transformed via logarithmic saturation + continuity bonus.
- Consistency → Activity breadth + streak bonus − void penalty.
- Trend → Short vs previous window differential on smoothed composite.

---

## 3. Algorithm Evolution

| Stage               | Focus                     | Description                                                                  |
| ------------------- | ------------------------- | ---------------------------------------------------------------------------- |
| Early               | Baseline Composite        | Weighted sum of normalized factors (no gap decay, naive missing handling).   |
| Additive            | Explanation & Delta       | Introduced narrative explanation + factor delta analytics.                   |
| Reliability         | Neutral-Impute Strategy   | Preserved weight vector while filling absent domains with neutral constants. |
| Data Quality        | Coverage & Confidence     | Added `coverage` (expected/observed/imputed) and concave confidence metric.  |
| Temporal Robustness | Gap Detection → Gap Decay | Transition from passive gap reporting to active exponential cooling.         |
| Telemetry           | `decayEvents`             | Structured event list to drive recommendations & UI transparency.            |
| Refinement          | Typed Events + UI Badges  | Eliminated `any`, added cooling badge & recent event summary.                |

Gap Decay Formula:

```
prev' = neutral + (prev - neutral) * exp(-ln(2) * gapDays / halfLifeDays)
EMA_new = alpha * current + (1 - alpha) * prev'
```

Neutral strategies: `fixed` (0.5) or `weighted` (weighted average of per-factor neutrals).

---

## 4. Key Decisions & Rationale

- Neutral-Impute over Reweight (default): Stabilizes longitudinal comparability; avoids artificial inflation from shrinking denominator.
- Confidence = sqrt(coverage.ratio): Diminishing penalty; moderate gaps not over-punished.
- Exponential Gap Decay (half-life): Intuitive mental model ("momentum halves every 7 inactive days").
- Recommendation gating by actual events: Prevents false positives when no decay applied.
- Typed `DecayEvent`: Enables deterministic UI & downstream analytics (e.g., cooling severity).
- Minimal overspecification: Factors intentionally coarse until empirical calibration data accrues.

---

## 5. Data Structures & Types (Essentials)

`MomentumInputDay` → daily aggregate (habits, tasks, focus, xp optional).
`MomentumResult` fields: score, raw, factors[], trend, bands, states, history[], missingDomains, coverage, imputedFactors, confidence, gaps, decayEvents.
`MomentumCoverage`: expected, observed, imputed, ratio, effectiveRatio.
`MomentumGapInfo`: largestGapDays, recentGapDays, gapEvents.
`DecayEvent`: { index, gapDays, before, after }.

---

## 6. Recommendation System

Reason Codes Implemented (subset):

- LOW_COVERAGE_DATA: coverage.ratio < 0.8.
- GAP_DECAY_ACTIVE: presence of at least one decayEvent.
- (Earlier codes for factor-specific nudges—top drivers vs weak spots—in explanation layer).
  Evolution: Initially heuristic triggers; later constrained to verifiable telemetry (decayEvents) to avoid noise.

---

## 7. UI Integration Timeline

- Card: Score, band badge, trend indicator, states (Recovery/Risk), now Cooling badge.
- Advanced Panel: Data Quality block (coverage, imputed count, confidence, largest gap, cooling summary list), Factor Breakdown, Recommendations Panel.
- Cooling Implementation: Badge (indigo theme), tooltip showing event count; recent decay list (last 3 events with gap + multiplier).

---

## 8. Testing Matrix & Evolution

Core Tests Added:

1. Empty input → score 0, structural defaults.
2. Higher activity produces higher score.
3. Trend detection (Accelerating / Stable tolerance).
4. Coverage & confidence presence.
5. Neutral-impute preserves weights (tasks/focus absent scenario).
6. Gap detection (largest gap >= threshold).
7. Gap decay effect vs consecutive scenario (smoothed raw comparison).
8. Decay events structural validation (bounds, non-zero gapDays, multiplier sanity).
9. Analytics: delta, impact, recommendations prioritization.
10. Explanation: Top/weak factors messages shape.

---

## 9. Configuration Parameters

- Weights (DEFAULT_WEIGHTS): consistency 0.30, habits 0.25, tasks 0.20, trend 0.15, focus 0.10.
- EMA alpha: 0.35 (responsiveness vs noise trade-off).
- Trend windows: short=3, prev=7.
- Gap Decay: enabled=true, halfLifeDays=7, minGapDays=1, neutralStrategy='fixed', fixedNeutralValue=0.5.
- Neutral Values: consistency 0.6, habits 0.5, tasks 0.55, trend 0.5, focus 0.5.
- Coverage thresholds (warn=0.8, low=0.5) used for recommendations & potential UI semantics.

---

## 10. Future Roadmap (Proposed)

1. Config Surfacing: Runtime override for gap decay & neutral strategies.
2. Visualization: Historical chart with cooling overlays (faded segments pre-decay events).
3. Adaptive Half-Life: Personalize via user stability metrics.
4. Domain-Specific Decay: Separate half-life for focus vs habits vs tasks.
5. Vacation Mode: Freeze decay with explicit user intent token.
6. Factor Granularity: Split tasks into completion vs quality vs overage penalty as distinct weighted factors.
7. Predictive Module: Near-future momentum projection given planned tasks/habits.
8. Alerting: Trigger notifications when entering risk or emerging from recovery.
9. Confidence Weighting: Attenuate factor contributions by per-factor coverage ratios.
10. API Bulk Endpoint: Batch compute for social/feed contexts.

---

## 11. Usage & Extension Examples

### Basic Compute

```ts
import { createMomentumEngine } from '@trekie/sdk/momentum'
const engine = createMomentumEngine()
const result = engine.compute(days) // days: MomentumInputDay[]
console.log(result.score, result.decayEvents)
```

### Cooling Badge Condition

```ts
const coolingActive = (result.decayEvents?.length ?? 0) > 0
```

### Add New Factor (Outline)

1. Add key to `MomentumFactorValuesRaw` + weight constant.
2. Implement computation in `factors.ts`.
3. Integrate into composite sums (engine).
4. Update neutral values & docs.
5. Add unit tests (boundary, absence, interaction with missing strategy).

### Interpreting DecayEvent

```
multiplier = after / before // approximate cooling applied (<=1 typical)
```

Multiple events within a window reflect layered inactivity segments.

---

## 12. Appendix: Glossary & Reference

- Coverage: Structural availability of domain data.
- Confidence: Derived trust heuristic = sqrt(coverage ratio).
- Gap Decay: Exponential cooling bridging inactivity periods.
- Neutral-Impute: Preserve weight distribution; fill absent domains with neutral constants.
- DecayEvent: Telemetry node marking application of cooling prior to EMA update.
- Cooling: UI-facing term representing active gap decay influence.

---

Generated archive intended as a stable snapshot; subsequent changes should append a new dated section rather than rewrite historical phases.
