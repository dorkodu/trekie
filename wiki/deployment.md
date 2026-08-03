# Deployment

> Current deployment status and CI/CD information.

## Current State

Trekie does not have a production deployment configured yet. It runs locally in development mode.
A staging database (PostgreSQL) is available locally via Docker Compose.

## Local Development Setup

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) for PostgreSQL
- [Bun](https://bun.sh) v1.3+
- Node.js 22+

### Quick Start

```bash
# 1. Start PostgreSQL
docker compose up -d

# 2. Install dependencies (from repo root)
bun install

# 3. Copy environment files
cp .env.example .env          # optional — api/.env already has dev values

# 4. Generate and apply database migrations
bun --cwd api run db:generate   # create migration SQL from Drizzle schema
bun --cwd api run db:migrate    # apply migrations to running database

# 5. Start development servers
bun dev
```

### Database

PostgreSQL runs in Docker on port 5432:

```bash
# Start
docker compose up -d

# Stop (preserves data in named volume)
docker compose down

# Reset (removes all data)
docker compose down -v

# Check connection
docker compose exec postgres psql -U trekie -d trekie -c "SELECT 1"

# Inspect tables
docker compose exec postgres psql -U trekie -d trekie -c "\dt"
```

### Database Migrations

Drizzle ORM handles schema migrations. The schema source files are in `api/src/namespaces/*/schemas/db.ts`:

```bash
# Generate a new migration from schema changes
bun --cwd api run db:generate

# Apply migration to the database
bun --cwd api run db:migrate

# Push schema directly (no migration file — useful in early dev)
bun --cwd api run db:push

# Open Drizzle Studio to browse data
bun --cwd api run db:studio
```

### Environment Files

| File | Purpose |
|---|---|
| `.env.example` (root) | Canonical reference of all env vars |
| `api/.env` | API runtime configuration (gitignored) |
| `api/.env.example` | API env template |
| `web/.env.example` | Web env template |

The root `.env.example` is the canonical source. All workspace `.env.example` files should be kept in sync.

### Default Database Credentials

In `api/.env` (development):
- User: `oasis`
- Password: `definitelymaybe`
- Database: `trekie`
- Host: `localhost:5432`

## Building for Production

```bash
# Build API — outputs to api/dist/
bun --cwd api build

# Build Web — outputs to web/dist/
bun --cwd web build
```

## Deployment Targets

### API — Fly.io

Deployment config: `fly.toml` + `api/Dockerfile`

```bash
# Prerequisites: Install flyctl
curl -fsSL https://fly.io/install.sh | sh

# One-time setup: create the app and set secrets
fly launch --dockerfile api/Dockerfile --name trekie-api --region ams --no-deploy
fly secrets set DATABASE_URL="postgres://user:pass@host:5432/trekie"
fly secrets set BETTER_AUTH_SECRET="<random-secret>"
fly secrets set BETTER_AUTH_URL="https://trekie-api.fly.dev"
fly secrets set ORIGIN="https://trekie-web.vercel.app"

# Deploy
fly deploy

# Scale to zero (optional)
fly scale count 0   # stop
fly scale count 1   # start
```

The Dockerfile uses multi-stage builds:
1. **install** — dev + production dependency layers
2. **build** — `bun run build` to compile the API
3. **release** — minimal image with compiled output only

### Web — Vercel

Deployment config: `web/vercel.json`

```bash
# Prerequisites: Install Vercel CLI
npm i -g vercel

# One-time setup
vercel --cwd web

# Deploy
vercel --cwd web --prod

# Set environment variables
vercel --cwd web env add VITE_API_URL
```

The web app is a Vite + React SPA with client-side routing. Vercel is configured to rewrite all routes to `index.html` for SPA support.

### Database — Managed PostgreSQL

Options:
- **Neon** (serverless, free tier) — best for low-traffic staging
- **Supabase** (PostgreSQL + auth, generous free tier)
- **Fly.io Postgres** (attached to the API app, $15/mo)
- **Railway** (simple, usage-based)

For local dev, `docker compose up -d` provides a PostgreSQL 17 instance.

## CI/CD

A GitHub Actions workflow is configured at `.github/workflows/ci.yml`. It runs on push/PR to `main`:

1. **Typecheck** — `bun check:types` (tsc --noEmit across api, web, sdk)
2. **Lint** — `bun check:lint` (ESLint in web/)
3. **Test** — `bun test` (192 tests across api, sdk, web)

Setup: uses `oven-sh/setup-bun@v2` with `bun install --frozen-lockfile`.

### Staging Deploy via GitHub Actions (Future)

A deploy job can be added to CI for automatic staging deploys on push to `main`:

```yaml
deploy-api:
  runs-on: ubuntu-latest
  needs: [typecheck, lint, test]
  steps:
    - uses: actions/checkout@v4
    - uses: superfly/flyctl-actions/setup-flyctl@master
    - run: flyctl deploy --remote-only
      env:
        FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

deploy-web:
  runs-on: ubuntu-latest
  needs: [typecheck, lint, test]
  steps:
    - uses: actions/checkout@v4
    - uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-args: --prod
        working-directory: web
```

## Environment Variables

Required for production deployment:

### API
```env
DATABASE_URL=postgres://user:password@host:5432/trekie
POSTGRES_HOST=...
POSTGRES_PORT=5432
POSTGRES_DB=trekie
POSTGRES_USER=...
POSTGRES_PASSWORD=...
BETTER_AUTH_SECRET=your-secret
BETTER_AUTH_URL=https://api.yourdomain.com
ORIGIN=https://yourdomain.com
```

### Web
```env
VITE_API_URL=https://api.yourdomain.com
```
