# Architecture

## System Overview

Trekie is a **full-stack TypeScript monorepo** with four workspaces. The SDK is the center of gravity — domain logic lives there, not in the API or web app.

```
┌─────────────────────────────────────────────────────────┐
│                        WEB APP                          │
│  React 19 · TanStack Router · TanStack Query            │
│  Tailwind CSS v4 · Shadcn UI · Zustand                  │
│  Dexie (IndexedDB) · Vite                                │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              API SERVER (ElysiaJS)                │   │
│  │  tRPC router · Better Auth · LangChain agents     │   │
│  │  Namespaces: auth, user, game, goal, commitment,  │   │
│  │              social, momentum                       │   │
│  │  PostgreSQL via Drizzle ORM                        │   │
│  └──────────────────────────────────────────────────┘   │
│                          │                                │
│                          ▼                                │
│  ┌──────────────────────────────────────────────────┐   │
│  │           SDK (@trekie/sdk)                        │   │
│  │  Core domain: momentum, game, commitments, ABAC   │   │
│  │  Utils: format, hash, trycatch, logging            │   │
│  │  Provider: tRPC client setup, app bootstrap        │   │
│  └──────────────────────────────────────────────────┘   │
│                          │                                │
│                          ▼                                │
│  ┌──────────────────────────────────────────────────┐   │
│  │           DATABASE (PostgreSQL)                    │   │
│  │  Drizzle ORM · Docker Compose                      │   │
│  │  Port 5432 · Managed via drizzle-kit                │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

1. **Web App** → tRPC client (from SDK) → **API Server** → Drizzle → **PostgreSQL**
2. **Web App** → Dexie (IndexedDB) — local-first cache, syncs with server
3. **API Server** → LangChain agents — AI features (Momentum recommendations, coaching)
4. **SDK** is consumed by both Web App and API Server as a workspace dependency

## Key Design Decisions

- **SDK-first**: Domain logic lives in `sdk/`, not duplicated in `api/` or `web/`. The API is thin — it wires SDK modules to HTTP/tRPC endpoints.
- **tRPC for type safety**: End-to-end typesafe RPC between web and API.
- **Better Auth**: Authentication is handled by Better Auth with its own DB schema and endpoints.
- **Momentum Engine**: A gamification engine in the SDK that computes user "momentum" scores based on task completion, consistency, habits, and focus. Includes an AI-powered explainer and recommendation system via LangChain.
- **ABAC (Attribute-Based Access Control)**: Fine-grained permissions system in the SDK.

## Workspace Boundaries

| Workspace | Responsibility | Can import from |
|---|---|---|
| `sdk/` | Domain logic, types, algorithms | Nothing (standalone) |
| `api/` | HTTP server, DB access, auth, AI agents | `sdk/` |
| `web/` | UI rendering, routing, local state | `sdk/` |
| `db/` | Docker Compose, migrations | Nothing |

## Current State (May 2026)

- Fully manually developed until now
- Transitioning to agentic-first development
- WIP momentum features on `momentum-extensions` branch
- Server runs in mock mode without PostgreSQL (graceful degradation)
