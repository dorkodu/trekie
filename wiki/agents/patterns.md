# Coding Patterns & Conventions

> Rules for writing Trekie code. Follow these for consistent, AI-friendly code.

---

## TypeScript Style

From `AGENTS.md` and `copilot-instructions.md`:

- **Strict mode** — `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`
- **2-space indentation**, no tabs
- **Double quotes**, semicolons required, no trailing commas
- **100 character line limit**
- **JSDoc** for documenting TypeScript definitions (`/** ... */`), not `//` comments
- **`consistent-type-imports`** — use `import type { ... }` syntax
- **Absolute imports** from workspace aliases (`@api/`, `@web/`, `@sdk/`) — not relative paths, except same-directory (`./thing`)
- **Descriptive names** — no abbreviations
- **URL** not `Url`, **API** not `Api`, **ID** not `Id` in camelCase names
- **Functional programming** — prefer pure functions, avoid classes where possible
- **TypeScript interfaces** for public APIs (not types)
- **No** `@ts-expect-error`, `@ts-ignore`, or `as any` — **zero tolerance**

## Error Handling

- Use **neverthrow** `Result` type for functional error handling
- For simple cases, use the SDK's own `tryCatch` util (`sdk/src/utils/trycatch.ts`)
- Async operations: `try/catch` blocks with context-rich error messages
- React: proper Error Boundaries
- Always log errors with contextual information

## Naming Conventions

- **Files**: `kebab-case.ts` for files, `PascalCase.tsx` for React components
- **Exports**: Named exports only (no default exports)
- **Variables/Functions**: `camelCase`
- **Types/Interfaces**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE` for magic constants
- **Enums**: `PascalCase` enum, `UPPER_SNAKE_CASE` members

## Testing Conventions

From `AGENTS.md`:

- **Bun test runner** for unit tests
- **One test case at a time** — don't batch write tests
- `expect(VALUE).toXyz(...)` — don't store expectations in intermediate variables
- **Omit "should"** from test names:
  - ✅ `it("validates input")`
  - ❌ `it("should validate input")`
- Test files: `*.test.ts` or `*.spec.ts`
- Mock external dependencies appropriately

## Project Structure

- **SDK-first**: Domain logic belongs in `sdk/`, not in `api/` or `web/`
- **API is thin**: Endpoints wire SDK to DB, no business logic
- **Namespace pattern**: Each API domain (auth, user, game, goal, commitment, momentum, social) has:
  - `endpoints.ts` — tRPC/HTTP handlers
  - `service.ts` — Business logic
  - `repository.ts` — DB access
  - `schema.ts` — Zod schemas
  - `schemas/` — Sub-schemas (e.g., DB-generated schemas)
- **Barrel exports**: Each module has `index.ts` for public API

## Anti-Patterns

> Things that should NEVER appear in Trekie code

- ❌ `as any` type assertions
- ❌ `@ts-ignore` / `@ts-expect-error`
- ❌ Empty `catch(e) {}` blocks
- ❌ Default exports
- ❌ Relative imports across packages (use workspace aliases)
- ❌ Business logic in API endpoints or React components
- ❌ Deleting failing tests to make CI pass
- ❌ Mutating function parameters

## Git Workflow

- No force-push on `main` — use `force-with-lease` on feature branches
- Check current branch before destructive operations
- Commit messages: concise, matching repo style
- No committing secrets or API keys

## Configuration Standards

When adding new config:

1. Add env var to `.env.example` in the relevant workspace
2. Add to config schema (`api/src/config.ts` or `web/src/config/`)
3. Document in README or wiki
4. Use consistent naming across all locations
