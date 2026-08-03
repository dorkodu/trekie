# Domain Model

## What is Trekie?

Trekie is a **gamified life dashboard** that helps users manage goals, tasks, and habits while tracking their "momentum" — a quantified measure of personal productivity and consistency. It has social features and an AI companion.

## Core Concepts

### User & Account
- **User** — A person with a profile, settings, and preferences.
- **Account** — Authentication-related data (Better Auth manages this).
- **Onboarding** — New users go through welcome → goals → todos → profile → complete flow.

### Goals & Commitments
- **Goal** — A high-level objective the user sets (e.g., "Get fit", "Read 30 books").
- **Commitment** — A specific, repeatable action tied to a goal (e.g., "Go to the gym 3x/week").
- **Progress tracking** — Completion rates, streaks, consistency metrics.

### Momentum

The signature feature. Momentum is a **quantified productivity score** computed from the user's activity:

- **Engine** — Core algorithm that computes momentum scores over time windows.
- **Factors** — Components that influence momentum:
  - *Consistency* — How regularly the user completes commitments
  - *Focus* — Distribution of effort across goals
  - *Habits* — Streaks and habit formation
  - *Tasks* — Task completion rate
- **Delta** — Momentum change between time periods.
- **Explain** — Natural language explanation of momentum changes (AI-powered via LangChain).
- **Recommend** — AI suggestions to improve momentum.
- **Impact** — How different actions affect momentum scores.
- **Custom Factors** — Users can define their own momentum factors.

### Game System
- **Actions** — User actions that earn points (completing tasks, maintaining streaks).
- **Score/Mutators** — Point calculation with modifiers.
- **Store** — Game state management.

### Social
- Social features: user profiles, feeds, interactions.
- Currently minimal/early stage.

### ABAC (Attribute-Based Access Control)
- **Policy** — Rules that define access permissions.
- **Conditions** — Attribute-based conditions for access decisions.
- Fine-grained permission system in the SDK.

### AI Features
- **Momentum Explainer** — LangChain agent that explains momentum changes in natural language.
- **Momentum Recommender** — AI suggestions for improving productivity.
- **AI Chat** — General AI assistant via Vercel AI SDK (web) + LangChain (api).

## Data Model (API Namespaces)

| Namespace | Entities | Purpose |
|---|---|---|
| `auth` | sessions, accounts, verifications | Authentication |
| `user` | users | User profiles |
| `game` | game state, scores | Gamification |
| `goal` | goals | Goal management |
| `commitment` | commitments + goals | Commitment tracking |
| `momentum` | momentum scores | Momentum engine |
| `social` | social graph | Social features |

## Key TypeScript Types

The SDK defines the core interfaces in `sdk/src/core/`:
- `account.ts` — User account type
- `game/` — Game state, actions, mutators
- `commitments/` — Commitment and goal types
- `momentum/` — Momentum types, factors, engine config
- `abac/` — Policy, conditions, attribute types

## Data Flow Example: Tracking a Commitment

```
1. User creates a goal via web UI
2. Web → tRPC → API goal endpoint → DB
3. User adds commitments to the goal
4. User marks commitments as complete
5. API records completion → triggers Momentum engine
6. SDK momentum engine recalculates user's momentum score
7. Web fetches updated momentum via tRPC
8. AI explainer generates "why did my momentum change?" text
```
