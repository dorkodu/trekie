# Trekie Database

> PostgreSQL schema and management notes.

## Setup

The database runs via Docker Compose:

```bash
bun --cwd db up
# or: docker compose -f db/compose.yml up -d
```

Connection: `postgres://oasis:password@localhost:5432/trekie`

## ORM

- **Drizzle ORM** with `drizzle-orm` package
- Schema defined in `api/src/db/schema.ts`
- Migrations managed via `drizzle-kit` (`bun --cwd api db:migrate`)
- Drizzle Studio: `bun --cwd api db:studio`

## Schema Structure

| Table | Namespace | Purpose |
|---|---|---|
| `user` | user | User accounts |
| `session` | auth | Auth sessions (Better Auth) |
| `account` | auth | Auth accounts (Better Auth) |
| `verification` | auth | Email verification |
| `goal` | goal | Goals |
| `commitment` | commitment | Commitments |
| `game_state` | game | Game state/scores |
| `momentum_snapshot` | momentum | Momentum snapshots |
| `social_graph` | social | Social connections |

## Docker

- Image: `postgres:16-alpine`
- Port: 5432
- Volume: named volume for data persistence
- Env file: `db/.env`

For full documentation, see `wiki/` in the repo root.
