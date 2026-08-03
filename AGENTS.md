# Trekie

Trekie is a gamified life dashboard with AI productivity companion and social features.
It is a full-stack web app with TypeScript frontend and backend.
The core functionality with domain related things lives in the SDK library inside the `sdk/` folder, with separate web client app (`web/`), API server (`api/`) and database (`db/`) workspaces in their own folders.

## Build & Commands

- Typecheck and lint everything: `bun check`
- Fix linting/formatting: `bun check:fix`
- Run tests: `bun test`
- Start development server: `bun dev`
- Build for production: `bun build`
- Preview production build: `bun preview`

### Development Environment

- Frontend dev server: http://localhost:5173
- Backend dev server: http://localhost:8000
- Database runs on port 5432 (via Docker Compose, `bun db:start`)
- PostgreSQL 17 Alpine, named volume `pgdata` for persistence

## Code Style

- TypeScript: Strict mode with exactOptionalPropertyTypes, noUncheckedIndexedAccess
- Spaces for indentation (2 spaces per level of nesting)
- Double quotes, semicolons, no trailing commas
- Use JSDoc docstrings for documenting TypeScript definitions, not `//` comments
- 100 character line limit
- Imports: Use consistent-type-imports
- Use descriptive variable/function names
- In CamelCase names, use "URL" (not "Url"), "API" (not "Api"), "ID" (not "Id")
- Prefer functional programming patterns
- Use TypeScript interfaces for public APIs
- NEVER use `@ts-expect-error` or `@ts-ignore` to suppress type errors

## Testing

- Bun test runner for unit testing
- When writing tests, do it one test case at a time
- Use `expect(VALUE).toXyz(...)` instead of storing in variables
- Omit "should" from test names (e.g., `it("validates input")` not `it("should validate input")`)
- Test files: `*.test.ts` or `*.spec.ts`
- Mock external dependencies appropriately

## Architecture

- Frontend: React, TypeScript, Tanstack Router
- Backend: ElysiaJS, TypeScript, tRPC, BetterAuth
- Database: PostgreSQL with Drizzle ORM
- State management: Zustand, Dexie, Tanstack Query, Tanstack Form for forms.
- Styling: Tailwind CSS, Shadcn UI
- Build tool: Vite
- Package manager: bun

## Security

- Use appropriate data types that limit exposure of sensitive information
- Never commit secrets or API keys to repository
- Use environment variables for sensitive data
- Validate all user inputs on both client and server
- Use HTTPS in production
- Regular dependency updates
- Follow principle of least privilege

## Git Workflow

- NEVER use `git push --force` on the main branch
- Use `git push --force-with-lease` for feature branches if needed
- Always verify current branch before force operations

## Configuration

When adding new configuration options, update all relevant places:

1. Environment variables in `.env.example`
2. Configuration schemas in `web/src/config/` or `api/src/config/`
3. Documentation in README.md

All configuration keys use consistent naming and MUST be documented.

## Wiki & Documentation

Comprehensive documentation lives in `wiki/`. Every AI agent should load relevant sections before starting work:

- **`wiki/deployment.md`** — Local dev setup, Docker Compose, Fly.io/Vercel deployment

- **`wiki/architecture.md`** — System design, data flow, workspace roles
- **`wiki/domain.md`** — What Trekie is, core concepts, entities
- **`wiki/getting-started.md`** — Dev setup, running locally, env vars
- **`wiki/stack.md`** — Technology choices and rationale
- **`wiki/health-report.md`** — Current codebase health assessment
- **`wiki/glossary.md`** — Key terms defined
- **`wiki/testing.md`** — Test philosophy and practices
- **`wiki/dependencies.md`** — External libs, versions, usage
- **`wiki/agents/codebase-map.md`** — Every directory, file, and purpose
- **`wiki/agents/patterns.md`** — Coding conventions and anti-patterns
- **`wiki/agents/decision-log.md`** — Architecture Decision Records
- **`wiki/agents/agent-commands.md`** — Common agent workflows
- **`wiki/agents/quality-gates.md`** — Pre-ship verification checklist

## Agentic Development Workflow

This codebase is designed for agentic-first development. Follow this process:

### Feature Workflow
1. **Explore** — Fire 2-5 explore agents in parallel to understand the affected modules
2. **Plan** — Consult metis/oracle for complex architecture decisions, write a plan
3. **Implement** — Delegate to the appropriate agent category (visual-engineering for UI, ultrabrain for logic, etc.)
4. **Verify** — Run `bun check`, `bun test`, and LSP diagnostics
5. **Review** — Use review or oracle for post-implementation review

### Parallel Execution
- Fire explore/librarian agents in parallel for any multi-module search
- Use `run_in_background=true` for independent exploration tasks
- Never duplicate work that delegated agents are already doing

### Quality Gates (Before Shipping)
- `lsp_diagnostics` on all changed files — zero errors
- `bun test` — all tests pass
- `bun check` — typecheck and lint clean
- Read every changed file to verify correctness
- Run the app if user-visible behavior changed
