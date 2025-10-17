# Momentum Custom Factor Guide

This document walks through extending the momentum engine with bespoke factor plugins.

## 1. Understand the factor contract

All factors follow the `MomentumFactorDefinition` interface exported from `@trekie/sdk/src/core/momentum/factors`:

- `id`: globally unique string (used in weights, coverage, explanations)
- `label`: human-readable name shown in UI contexts
- `defaultWeight`: fallback weight applied when the registry is merged
- `neutralValue`: optional 0..1 neutral score used when data is missing
- `requiredDomains`: optional array of `MomentumInputDay` keys that must be present for the factor to be considered observed
- `compute(context)`: pure function receiving `{ days, windowDays, weights, options, meta }` and returning `{ value, observed, extras? }`

See `sdk/src/core/momentum/factors/base.ts` for the full type definition.

## 2. Start from working examples

We ship two reference plugins in `sdk/src/core/momentum/factors/examples.ts`:

- `momentumEnergy()` – turns XP gain into an energy score
- `momentumCreativeFlow()` – evaluates deep work continuity

Use `createMomentumFactorsWithExamples()` to quickly bootstrap experiments:

```ts
import { createMomentumEngine } from '@trekie/sdk/src/core/momentum'
import { createMomentumFactorsWithExamples } from '@trekie/sdk/src/core/momentum/factors'

const engine = createMomentumEngine({
  factors: createMomentumFactorsWithExamples(),
})
```

These implementations demonstrate:

- Slicing the current window (`days.slice(-windowDays)`) to respect engine options
- Normalizing custom metrics to 0..1
- Emitting diagnostics via `extras`

## 3. Iterate with the dev toolkit

The `dev.factorToolkit` namespace exposes helpers for rapid iteration:

```ts
import {
  dev,
  createDefaultMomentumFactors,
} from '@trekie/sdk/src/core/momentum'
import { momentumEnergy } from '@trekie/sdk/src/core/momentum/factors'

const days = [
  dev.buildSyntheticDay('2025-10-01', { xp: { xpGained: 40 } }),
  dev.buildSyntheticDay('2025-10-02', { xp: { xpGained: 55 } }),
]

const preview = dev.previewFactor(momentumEnergy(), days)
console.log(preview.factor)
```

Use `previewRegistry` to run a whole factor set and inspect weights/values before wiring UI components.

## 4. Wire into the engine

1. Construct your custom registry (`const registry = [...createDefaultMomentumFactors(), myFactor()]`).
2. Pass it to `createMomentumEngine({ factors: registry })`.
3. Optionally override weights in the same call. Custom ids inherit their `defaultWeight` automatically.
4. Persist the registry id list if you need to audit active factors (`engine.config.factors`).

## 5. Test coverage

- Add regression cases in `sdk/src/core/momentum/engine.test.ts` similar to the `honors custom factor registry entries` test.
- Use the dev toolkit in unit tests to avoid boilerplate when focusing on a single factor.
- Remember to assert `observed` and `extras` so coverage metrics stay accurate.

## 6. UI and API considerations

- The web client now consumes `MomentumFactorSummary` (`{ id, label, weight, value, observed, extras? }`). Provide meaningful labels for new factors.
- Document newly required domains (e.g., `xp`) in API payloads and ensure back-end adapters populate them.
- Update recommendations/explanations if you want tailored messaging for custom factors—`explainMomentum` falls back to generic copy for unknown ids.

## 7. Deployment checklist

- [ ] Registry updated with the new factor
- [ ] Neutral value calibrated and recorded in product docs
- [ ] Engine tests updated (positive and missing-data scenarios)
- [ ] Docs refreshed (`sdk/src/core/momentum/README.md` and relevant product specs)
- [ ] UI components reviewed for label/coverage displays

Following this flow keeps custom factors modular, testable, and ready for fast iteration as Trekie’s feature set expands.
