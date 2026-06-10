# Trekie API Server

> Backend architecture and development notes.

## Tech Stack

- **ElysiaJS** (Bun-native HTTP framework)
- **tRPC** for type-safe RPC
- **Better Auth** for authentication
- **Drizzle ORM** + PostgreSQL
- **LangChain** + LangGraph for AI features
- **Neverthrow** for error handling

## Architecture

The API follows a namespace pattern. Each domain has its own folder:

| Namespace | Endpoints | Purpose |
|---|---|---|
| `auth` | Better Auth routes | Authentication, sessions, OAuth |
| `user` | CRUD + username generation | User profiles |
| `game` | Score/mutator endpoints | Gamification |
| `goal` | CRUD | Goal management |
| `commitment` | CRUD | Commitment tracking |
| `momentum` | Compute/explain/recommend | Momentum engine API |
| `social` | Social graph | Social features |

Each namespace follows the pattern:
- `endpoints.ts` — tRPC/HTTP handlers
- `service.ts` — Business logic
- `repository.ts` — Database access
- `schema.ts` — Zod validation schemas

## Server

- Entry: `src/index.ts`
- Router assembly: `src/router.ts`
- DB connection: `src/db/index.ts`
- AI configuration: `src/lib/langchain.ts`
- Auth setup: `src/lib/auth.ts`

For full documentation, see `wiki/` in the repo root.
