# Agent Commands & Workflows

> How to invoke common Trekie workflows from an AI agent.

---

## Quick Reference

| Command | Action |
|---|---|
| `bun test` | Run all tests |
| `bun --cwd api dev` | Start API server |
| `bun --cwd web dev` | Start web dev server |
| `bun --cwd api db:migrate` | Push DB schema changes |
| `bun --cwd api build` | Build API for production |
| `bun --cwd web build` | Build web for production |

## Top-level Scripts (configured in root `package.json`)

```bash
bun check          # Typecheck all workspaces + lint web
bun check:types    # Typecheck all workspaces (api + web + sdk)
bun check:lint     # Lint web app only
bun check:fix      # Format code with Prettier
bun test           # Run all tests (65 pass)
bun dev            # Start API + web concurrently
bun build          # Build API + web for production
bun preview        # Preview web production build
```

## Agentic Workflow: Feature Development

When implementing a new feature, follow this loop:

```
1. UNDERSTAND → Read wiki docs, explore codebase, check AGENTS.md
2. PLAN      → Consult metis/oracle for complex decisions
3. SPEC      → If using SpecKit, run specify → plan → implement flow
4. IMPLEMENT → Follow TDD: test first, then implementation
5. VERIFY    → bun test, lsp_diagnostics, typecheck
6. REVIEW    → Request code review if needed
```

## SpecKit Workflow (`.specify/`)

The repo has a SpecKit setup for structured feature development:

```
/specify → Creates feature spec in a new branch
/plan    → Generates implementation plan from spec
/implement → Executes tasks from the plan
```

Each step corresponds to `.github/prompts/specify.prompt.md`, `plan.prompt.md`, `implement.prompt.md`.

The `.specify/scripts/bash/` scripts handle scaffolding.

## Agent Context Priority

When an AI agent needs context, load in this order:

1. `AGENTS.md` — Primary agent instructions (always)
2. `wiki/agents/patterns.md` — Coding conventions
3. `wiki/agents/codebase-map.md` — File structure
4. `wiki/agents/decision-log.md` — Architecture decisions
5. `wiki/architecture.md` — System design
6. `wiki/domain.md` — Domain model
7. Relevant source files via explore agent

## Quality Gates (Before Shipping)

Run these before marking any work complete:

```bash
bun test          # All tests pass
lsp_diagnostics   # No type errors
# Check changed files for violations of patterns.md
# Verify all acceptance criteria met
```
