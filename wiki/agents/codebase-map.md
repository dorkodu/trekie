# Codebase Map

> For AI agents to navigate the repo efficiently. Every directory and its purpose.

---

## Root

| Path | Purpose |
|---|---|
| `package.json` | Workspace manifest — delegates to `sdk/`, `web/`, `api/`, `db/` |
| `tsconfig.json` | Root TS config with path aliases (`@api/*`, `@web/*`, `@sdk/*`) |
| `AGENTS.md` | Agent instructions — the primary context file for AI |
| `.prettierrc.yaml` | Formatting config |
| `.github/` | CI/CD workflows and copilot instructions |
| `.specify/` | SpecKit workflow (constitution, templates, bash scripts) |
| `.sisyphus/` | Sisyphus workflow configuration |
| `design/` | Brand assets, logos, icons (SVG + PNG) |
| `docs/` | Obsidian-style working notes |
| `wiki/` | This documentation suite |

---

## SDK (`sdk/`)

The brain of Trekie. Domain logic lives here.

```
sdk/src/
├── app/
│   ├── createApp.ts    — App bootstrap with tRPC + providers
│   ├── db.ts           — Dexie (IndexedDB) setup
│   ├── hooks.ts        — Shared React hooks
│   ├── index.ts        — Public API barrel export
│   └── momentum.ts     — Momentum React hooks
├── core/
│   ├── index.ts        — Barrel export for core modules
│   ├── consts.ts       — Shared constants
│   ├── account.ts      — Account/User types
│   ├── abac/           — Attribute-Based Access Control
│   │   ├── abac.ts     — Main evaluator
│   │   ├── conditions.ts — Condition matchers
│   │   ├── index.ts    — Public API
│   │   ├── policy.ts   — Policy definition engine
│   │   └── types.ts    — ABAC type definitions
│   ├── commitments/    — Goal & Commitment domain
│   │   ├── commitment.ts  — Core domain logic
│   │   ├── schema.ts     — Zod schemas
│   │   ├── module.ts     — Module integration
│   │   └── index.ts      — Public API
│   ├── game/           — Gamification engine
│   │   ├── actions.ts  — User actions
│   │   ├── lib.ts      — Core utilities
│   │   ├── store.ts    — Game state store
│   │   ├── mutators.ts — Score mutators
│   │   └── index.ts    — Public API
│   └── momentum/       — Momentum engine (signature feature)
│       ├── engine.ts   — Core algorithm
│       ├── types.ts    — Type definitions
│       ├── constants.ts — Magic numbers and thresholds
│       ├── adapters.ts — External data adapters
│       ├── delta.ts    — Change computation
│       ├── explain.ts  — AI-powered explanations
│       ├── recommend.ts — AI recommendations
│       ├── impact.ts   — Impact analysis
│       ├── utils.ts    — Helpers
│       ├── factors.ts  — Factor registry
│       ├── factors/    — Individual factor implementations
│       │   ├── base.ts      — Base factor class
│       │   ├── consistency.ts — Consistency factor
│       │   ├── focus.ts     — Focus factor
│       │   ├── habits.ts    — Habits factor
│       │   ├── tasks.ts     — Tasks factor
│       │   ├── defaults.ts  — Default factor configs
│       │   ├── examples.ts  — Example factor configs
│       │   └── index.ts     — Barrel export
│       ├── compute/    — Computation pipeline
│       │   └── index.ts
│       ├── data/       — Data layer
│       │   └── index.ts
│       └── dev/        — Development toolkit
│           └── factorToolkit.ts
├── utils/              — Shared utilities
│   ├── format.ts      — Formatting helpers
│   ├── hash.ts        — Hashing utilities
│   ├── log.ts         — Logging
│   ├── trycatch.ts    — Functional try/catch wrapper
│   └── index.ts       — Barrel export
```

### Configs
- `sdk/package.json` — `@trekie/sdk`, v1.0.0, 14 deps
- `sdk/tsconfig.json` — TypeScript config
- `sdk/.eslintrc.cjs` — ESLint config (legacy format)
- `sdk/.prettierrc.yaml` — Prettier config

---

## API (`api/`)

The server. Thin layer that connects SDK domain -> DB -> HTTP.

```
api/src/
├── index.ts                 — Server entry point
├── config.ts                — Server configuration
├── constants.ts             — Shared constants
├── router.ts                — tRPC router assembly
├── db/
│   ├── index.ts             — DB connection (Drizzle)
│   └── schema.ts            — DB schema (Drizzle)
├── lib/
│   ├── auth.ts              — Better Auth setup
│   ├── trpc.ts              — tRPC context & middleware
│   └── langchain.ts         — LangChain AI configuration
├── namespaces/              — API modules (REST + tRPC)
│   ├── auth/                — Authentication endpoints
│   │   ├── endpoints.ts
│   │   ├── service.ts
│   │   ├── repository.ts
│   │   └── schemas/
│   ├── user/                — User management
│   │   ├── endpoints.ts
│   │   ├── service.ts
│   │   ├── repository.ts
│   │   ├── schema.ts
│   │   ├── schemas/
│   │   └── generate-username.ts
│   ├── game/                — Gamification endpoints
│   │   ├── endpoints.ts
│   │   ├── service.ts
│   │   ├── repository.ts
│   │   └── schema.ts
│   ├── goal/                — Goal endpoints
│   │   ├── endpoints.ts
│   │   ├── service.ts
│   │   ├── repository.ts
│   │   └── schema.ts
│   ├── commitment/          — Commitment endpoints
│   │   ├── endpoints.ts
│   │   ├── service.ts
│   │   ├── repository.ts
│   │   └── schema.ts
│   ├── momentum/            — Momentum endpoints (WIP)
│   │   ├── endpoints.ts
│   │   ├── service.ts
│   │   ├── repository.ts
│   │   └── schemas/
│   └── social/              — Social features
│       ├── endpoints.ts
│       ├── service.ts
│       ├── repository.ts
│       └── schema.ts
├── types/                   — Shared API types
│   ├── account.ts
│   └── session.ts
├── commons/                 — Shared utilities
│   ├── schemas.ts
│   └── utils/
└── utils/
    └── loadNamespaces.ts    — Dynamic namespace loader
```

### Configs
- `api/package.json` — `@trekie/api`, 25 deps
- `api/tsconfig.json`
- `api/drizzle.config.ts` — Drizzle config
- `api/.env` / `api/.env.example`

---

## Web (`web/`)

The frontend. React + TanStack Router + Shadcn UI.

```
web/src/
├── main.tsx                 — App entry point
├── App.tsx                  — Root component
├── routeTree.gen.ts         — Auto-generated router tree
├── index.css                — Global styles + Tailwind
├── styles/                  — Additional CSS
├── config/                  — Frontend configuration
├── lib/                     — Shared libraries
│   ├── query.ts             — TanStack Query client
│   ├── trpc.ts              — tRPC client setup
│   ├── utils.ts             — Utility functions
│   └── auth.ts              — Auth helpers
├── components/
│   ├── ui/                  — Shadcn UI components (~40 files)
│   ├── app/                 — App shell (sidebar, topbar, spotlight)
│   ├── forms/               — Login, register, forgot password
│   ├── feeds/               — GoalsFeed, CommitmentsFeed
│   ├── cards/               — WIPCard etc.
│   ├── calendars/           — Calendar component
│   ├── guards/              — Auth/onboarding guards
│   ├── help/                — Help center
│   ├── misc/                — Emoji, text parser
│   ├── onboarding/          — 5-step onboarding flow
│   └── momentum/            — Momentum playground/lab
├── routes/                  — TanStack Router routes
└── stores/                  — Zustand stores
```

### Configs
- `web/package.json` — `@trekie/web`, 77 deps
- `web/vite.config.js`
- `web/tsconfig.json`
- `web/tsconfig.node.json`
- `web/components.json` — Shadcn config
- `web/eslint.config.mjs` — Flat ESLint config
- `.cursorrules` — Cursor editor rules

---

## Database (`db/`)

```
db/
├── compose.yml     — Docker Compose for PostgreSQL
├── .env / .env.example   — DB credentials
└── package.json    — Script wrappers
```

---

## `.specify/` — SpecKit Agentic Workflow

```
.specify/
├── memory/
│   └── constitution.md     — Project constitution
├── templates/
│   ├── agent-file-template.md
│   ├── plan-template.md
│   ├── spec-template.md
│   └── tasks-template.md
└── scripts/bash/
    ├── check-implementation-prerequisites.sh
    ├── check-task-prerequisites.sh
    ├── common.sh
    ├── create-new-feature.sh
    ├── get-feature-paths.sh
    ├── setup-plan.sh
    └── update-agent-context.sh
```

---

## `.github/`

```
.github/
├── copilot-instructions.md   — GitHub Copilot context
└── prompts/
    ├── constitution.prompt.md
    ├── specify.prompt.md
    ├── plan.prompt.md
    ├── implement.prompt.md
    └── tasks.prompt.md
```
