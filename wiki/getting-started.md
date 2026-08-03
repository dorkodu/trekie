# Getting Started

## Prerequisites

- **Bun** v1.3+ (package manager and runtime)
- **Docker** (for PostgreSQL — required for DB features)
- **Node.js** 22+ (some tooling may need it)

## Quick Start

```bash
# 1. Install dependencies (from repo root)
bun install

# 2. Start PostgreSQL and apply migrations
bun db:start
bun db:migrate

# 3. Start development servers (API + web)
bun dev
# → API: http://localhost:8000
# → Web: http://localhost:5173
```

> **Note**: The API's `api/.env` already contains development credentials for local PostgreSQL. See `api/.env.example` for the schema.

## Environment Variables

A root `.env.example` is provided as the canonical reference. Workspace `.env.example` files are kept in sync:

| File | Purpose | Status |
|---|---|---|
| `.env.example` (root) | Canonical reference | ✅ Created |
| `api/.env` | API runtime config (gitignored) | ✅ Has dev defaults |
| `api/.env.example` | API env template | ✅ Synced |
| `web/.env.example` | Web env template | ✅ Synced |

Key variables:
- **API**: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, OAuth client IDs/secrets
- **DB**: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` (defined in `docker-compose.yml`)
- **Web**: `VITE_API_URL` (defaults to `http://localhost:8000`)

## Development Workflow

### Running tests
```bash
bun test                          # All tests (192 passing)
bun --cwd sdk test                # SDK tests only
bun --cwd api test                # API tests only
bun --cwd web test                # Web tests (vitest)
```

### Typecheck and lint
```bash
bun check                         # Typecheck + lint (full quality gate)
bun check:types                   # Typecheck only
bun check:lint                    # Lint only
bun check:fix                     # Auto-fix formatting
```

### Database changes
```bash
# Start / stop / reset PostgreSQL
bun db:start
bun db:stop
bun db:reset      # Removes all data (drops volume)

# Generate migration from schema changes
bun db:generate

# Apply migrations to DB
bun db:migrate

# Push schema directly (no migration file — early dev only)
bun --cwd api run db:push

# Open Drizzle Studio to browse data
bun --cwd api run db:studio
```

### Building for production
```bash
# Build API
bun --cwd api build

# Build web (vite build + tsc)
bun --cwd web build
```

## Commands Reference

| Command | Location | Description |
|---|---|---|
| `bun install` | Root | Install all workspace deps |
| `bun dev` | Root | Start both web + api dev servers |
| `bun build` | Root | Build api + web for production |
| `bun test` | Root | Run all tests (192 passing) |
| `bun check` | Root | Typecheck + lint (full quality gate) |
| `bun check:fix` | Root | Auto-fix formatting with Prettier |
| `bun check:types` | Root | Typecheck across api, web, sdk |
| `bun check:lint` | Root | ESLint in web/ |
| `bun db:start` | Root | Start PostgreSQL via Docker Compose |
| `bun db:stop` | Root | Stop PostgreSQL (preserves data) |
| `bun db:reset` | Root | Stop PostgreSQL and delete volume |
| `bun db:generate` | Root | Generate Drizzle migration from schema |
| `bun db:migrate` | Root | Apply migrations to database |

## Editor Setup

- **VS Code**: Recommended. Workspace `.vscode/` settings exist.
- **Cursor**: `.cursorrules` exists in `web/`.
- Any markdown editor for `docs/` (Obsidian, Logseq, Typora, Joplin).
