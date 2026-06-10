# Trekie Agentic-First Setup Plan

## Current State
- Monorepo: `sdk/`, `web/`, `api/`, `db/` — ~336 TS files, ~27K lines
- On `momentum-extensions` branch ahead of `main` (momentum feature WIP)
- Existing: `AGENTS.md`, `.specify/` templates, `.github/prompts/` for spec→plan→implement flow
- **Problems**: Docs are sparse or empty, `AGENTS.md` is good but could be richer, `.specify/` scripts may be stale, codebase health unknown, no proper wiki.

## Phase 1 — Assess (Health Check)

**Goal**: Know exactly what state the codebase is in before touching anything.

1.1 — Run `bun check` (typecheck + lint) to get baseline health.
1.2 — Run `bun test` to see test coverage and failures.
1.3 — Map module boundaries: what exists in sdk/, web/, api/, db/ and how they connect.
1.4 — Check dependency freshness (`bun outdated` or similar).
1.5 — Check if `.specify/` scripts still work (run one to see).
1.6 — Report findings in a `wiki/health-report.md`.

## Phase 2 — Document (wiki/)

**Goal**: A `wiki/` folder that serves both human readers and AI agents.

### For Humans:

| File | Purpose |
|---|---|
| `wiki/index.md` | Entry point, table of contents, quick links |
| `wiki/architecture.md` | High-level architecture diagram (ASCII), workspace roles, data flow |
| `wiki/getting-started.md` | Dev environment setup, run instructions, env vars |
| `wiki/stack.md` | Technology choices and rationale |
| `wiki/domain.md` | What Trekie is — domain model, entities, core concepts |
| `wiki/glossary.md` | Key terms and definitions |

### For AI Agents:

| File | Purpose |
|---|---|
| `wiki/agents/codebase-map.md` | Every directory, its purpose, and key files |
| `wiki/agents/patterns.md` | Coding patterns, conventions, anti-patterns |
| `wiki/agents/decision-log.md` | Architecture Decision Records (ADRs) — capture key decisions |
| `wiki/agents/agent-commands.md` | How to invoke agent workflows for this repo |
| `wiki/agents/quality-gates.md` | What checks to run before shipping |

### For Both (shared):

| File | Purpose |
|---|---|
| `wiki/dependencies.md` | External dependencies, their versions, and what they're used for |
| `wiki/testing.md` | Test philosophy, how to run, coverage expectations |
| `wiki/deployment.md` | How it's deployed, environments, CI/CD |

## Phase 3 — Automate (Agentic Workflows)

3.1 — Enhance `AGENTS.md`:
   - Add explicit agent context sections (what each agent type should know)
   - Add task templates for common operations
   - Link to `wiki/agents/` docs

3.2 — Upgrade `.github/prompts/` to reference `wiki/` docs.
3.3 — Create `.sisyphus/` configuration for this repo's agentic workflow:
   - Plan templates
   - Task templates
   - Context files
   - Quality gates

3.4 — Add or improve `bun check` (missing scripts, fix lint/type configs).
3.5 — Optionally set up CI/CD improvements (GitHub Actions for type-check + test on PR).

## Risks & Mitigations

- **Risk**: `.specify/` scripts are stale and broken → **Mitigation**: Test in Phase 1, repair or deprecate.
- **Risk**: Momentum extensions branch has half-finished code → **Mitigation**: Document as WIP in health report.
- **Risk**: Outdated deps cause typecheck failures → **Mitigation**: Flag in health report, leave dep bumps to a separate PR.
- **Scope creep**: Don't fix business logic bugs or implement features — this is infrastructure work only.

## Deliverables

1. `wiki/health-report.md` — Assessment findings
2. `wiki/*.md` — Full documentation suite
3. `wiki/agents/*.md` — Agent-specific docs
4. Updated `AGENTS.md` — Richer agent context
5. Working `bun check` and `bun test` (as verified by the assess phase)
6. `.sisyphus/` — Agent workflow configuration
