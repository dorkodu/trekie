# Momentum Feature

> Trekie's signature feature — a quantified productivity health score.

## Overview

Momentum is a **composite productivity health indicator** (0–100) that represents a user's recent execution velocity, consistency, and progress quality. Think of it as a "fitness score" for productivity.

## Documentation

Three detailed documents live in `docs/engineering/`:

| Document | What it covers |
|---|---|
| `docs/04 - Momentum.md` | Product specification, goals, factors, inputs |
| `docs/engineering/momentum-explainer.md` | Factor-by-factor plain-language explanation with examples |
| `docs/engineering/momentum-custom-factors.md` | Developer guide for building custom factor plugins |
| `docs/engineering/momentum-archive.md` | Historical evolution, key decisions, testing matrix |

## Implementation

The momentum engine lives in **`sdk/src/core/momentum/`**:

| Module | Purpose |
|---|---|
| `engine.ts` | Core scoring algorithm |
| `types.ts` | Type definitions |
| `factors.ts` | Factor registry |
| `factors/` | Individual factor implementations (consistency, focus, habits, tasks) |
| `factors/base.ts` | Base factor class/interface |
| `delta.ts` | Score change between periods |
| `explain.ts` | AI-powered natural language explanations (via LangChain) |
| `recommend.ts` | AI recommendations for improvement |
| `impact.ts` | Impact analysis of actions on momentum |
| `compute/` | Computation pipeline |

## Factors

Factors are pluggable components that influence the momentum score. The engine ships with defaults, but users can create custom factors.

Standard factors:
- **Consistency** — How regularly the user shows up
- **HabitTarget** — Whether daily habit targets are met
- **HabitExcess** — Bonus for going above target (capped)
- **HabitStreak** — Consecutive successful days
- **TaskCompletion** — Planned vs completed tasks
- **TaskImportance** — Weight of completed tasks
- **Focus** — Deep work duration and continuity
- **ActivityPresence** — Whether the user was active at all
- **Energy** — XP gain velocity

## AI Features

Explainer and recommender use **LangChain** in the API (`api/src/lib/langchain.ts`) and are consumed by the frontend Momentum panel (`web/src/namespaces/momentum/`).
