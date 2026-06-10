# Testing

## Philosophy

- **API + SDK testing** — Core domain logic and API surface are the priority
- **Unit tests** for domain algorithms (momentum engine, ABAC)
- **Unit tests** for utility functions (format, hash, date, encoder)
- **Integration tests** for API endpoints (Elysia routes + tRPC procedures)
- **Schema validation tests** for all Zod schemas (common, user, goal, momentum)
- **Repository tests** with in-memory operations (no DB dependency)
- **Component tests** for web UI (planned — jsdom/testing-library not yet configured)
- **No E2E tests yet** (Playwright/Cypress not configured)

## Running Tests

```bash
# All tests across workspaces (192 passing)
bun test

# SDK only
bun --cwd sdk test

# API only
bun --cwd api test

# Web only
bun --cwd web test    # Uses Vitest
```

## Test Structure

Tests live alongside their implementation, organized by workspace:

```
api/src/
├── index.test.ts                       # Integration tests (Elysia + tRPC)
├── commons/
│   ├── utils/index.test.ts             # Encoder, format, date utilities
│   └── schemas.test.ts                 # Zod schema validation
├── namespaces/momentum/
│   └── repository.test.ts              # Repository operations (in-memory)

sdk/src/
├── core/momentum/
│   ├── engine.test.ts
│   ├── analytics.test.ts
│   ├── explain.test.ts
│   ├── simple.test.ts
│   └── adapters.enrichment.test.ts
├── core/abac/abac.test.ts
├── core/game/lib.test.ts               # calculateStreak
├── core/commitments/commitment.test.ts  # Commitment factory + schemas
└── utils/
    ├── utils.test.ts                    # format, hash, tryCatch
    └── core-utils.test.ts               # getDayDiff, isSameDay, daystamp
```

## Current Coverage

| Area | Test Files | Tests | Status |
|---|---|---|---|
| API — integration | 1 | 14 | ✅ Passing |
| API — utilities | 1 | 19 | ✅ Passing |
| API — schema validation | 1 | 41 | ✅ Passing |
| API — momentum repository | 1 | 11 | ✅ Passing |
| SDK — momentum (legacy) | 5 | — | ✅ Passing |
| SDK — ABAC | 1 | — | ✅ Passing |
| SDK — core-utils | 1 | 12 | ✅ Passing |
| SDK — utils | 1 | 16 | ✅ Passing |
| SDK — game lib (streak) | 1 | 4 | ✅ Passing |
| SDK — commitments | 1 | 10 | ✅ Passing |
| **Total** | **15** | **192** | ✅ **192 pass, 0 fail** |
| Web components | 0 | 0 | ❌ Not yet |

### API Integration Testing Pattern

API tests use Elysia's `handle()` method to make requests without starting a server:

```typescript
import { describe, it, expect } from "bun:test";
import { app } from "./index";

it("GET / returns health check", async () => {
  const res = await app.handle(new Request("http://localhost/"));
  expect(res.status).toBe(200);
  const body = await res.json();
  expect(body).toHaveProperty("status", "ok");
});
```

### Repository Testing Pattern

Repository tests use in-memory maps instead of a real database:

```typescript
const habits = new Map<string, Habits>();
// Populate test data, operate on repository, assert results
```

### Known Quirks

- **Dexie IndexedDB warning**: `"IndexedDB API missing"` appears in API tests. This is a Bun runtime limitation — Dexie is designed for browsers and the warning is harmless. All tests pass normally.
- **No web tests**: The web workspace lacks jsdom/testing-library config. Adding `@testing-library/react` and `happy-dom` or `jsdom` is a prerequisite for component testing.

## Writing Tests

Conventions from `AGENTS.md`:

```typescript
// filenames: *.test.ts or *.spec.ts

import { expect, it, describe } from "bun:test";
import { myFunction } from "./myModule";

// Omit "should" from test names
it("validates input", () => {
  expect(myFunction("valid")).toBe(true);
});

// Don't store expectations in variables
// ✅ DO:
expect(result).toBe(42);

// ❌ DON'T:
const expected = 42;
expect(result).toBe(expected);
```

## Test Dependencies

- **Bun test** — primary test runner
- **Vitest** — used by web app (via Vite)
- No Jest, no Mocha
