# Dependencies

> External packages used by Trekie, grouped by workspace.

---

## SDK (`@trekie/sdk`)

| Package | Version | Purpose |
|---|---|---|
| `@tanstack/react-query` | ^5.90.20 | Server state management |
| `@trpc/client` | ^11.8.1 | tRPC client |
| `@trpc/server` | ^11.8.1 | tRPC server types |
| `@trpc/tanstack-react-query` | ^11.8.1 | tRPC + React Query integration |
| `dexie` | ^4.2.1 | IndexedDB wrapper |
| `dexie-react-hooks` | ^1.1.7 | React hooks for Dexie |
| `immer` | ^10.2.0 | Immutable state updates |
| `js-xxhash` | ^4.0.0 | Fast hashing |
| `neverthrow` | ^8.2.0 | Result/Option types |
| `type-fest` | ^5.4.1 | Advanced TS types |
| `ulidx` | ^2.4.1 | ULID generation |
| `url-regex` | ^5.0.0 | URL pattern matching |
| `zod` | ^3.25.76 | Schema validation |
| `zustand` | ^5.0.10 | State management |

### Peer dependencies
- `react` ^19.2.3
- `react-dom` ^19.2.3

### Dev dependencies
- `eslint` ^9, `@typescript-eslint/*` ^8, `typescript` ^5.9
- `@tanstack/eslint-plugin-query`

---

## API (`@trekie/api`)

| Package | Version | Purpose |
|---|---|---|
| `elysia` | ^1.4.22 | HTTP framework |
| `@elysiajs/cors` | ^1.4.1 | CORS middleware |
| `@elysiajs/trpc` | ^1.1.0 | tRPC integration |
| `@elysiajs/websocket` | ^0.2.8 | WebSocket support |
| `@trpc/client` | ^11.8.1 | tRPC client |
| `@trpc/server` | ^11.8.1 | tRPC server |
| `better-auth` | ^1.4.17 | Authentication |
| `@better-auth/cli` | ^1.4.17 | Auth CLI |
| `drizzle-orm` | ^0.42.0 | ORM |
| `drizzle-zod` | ^0.8.3 | Zod integration |
| `pg` | ^8.17.2 | PostgreSQL client |
| `zod` | ^3.25.76 | Validation |
| `langchain` | ^0.3.37 | AI framework |
| `@langchain/core` | ^0.3.80 | AI core |
| `@langchain/langgraph` | ^0.2.74 | AI state machines |
| `neverthrow` | ^8.2.0 | Error handling |
| `nanoid` | ^5.1.6 | ID generation |
| `ulidx` | ^2.4.1 | ULID |
| `js-xxhash` | ^4.0.0 | Hashing |
| `type-fest` | ^5.4.1 | TS types |
| `nodemailer` | ^6.10.1 | Email |
| `dotenv` | ^16.6.1 | Env vars |

### Dev dependencies
- `drizzle-kit` ^0.31.8
- `tsx` ^4.21.0 (⚠️ duplicate of Bun's TS runner)
- `@types/*`

---

## Web (`@trekie/web`)

77 runtime deps — see `web/package.json` for the full list.
Key categories:
- **React ecosystem**: React 19, React DOM, hooks
- **TanStack**: Router, Query, Form, Table, React DB
- **UI**: Shadcn UI (Radix primitives), Tailwind CSS v4, Tabler Icons, Lucide
- **AI**: Vercel AI SDK (`ai`, `@ai-sdk/*`)
- **Local storage**: Dexie, TanStack Query DB Collection
- **Utilities**: date-fns, immer, clsx, class-variance-authority

---

## Root

| Package | Version | Purpose |
|---|---|---|
| `shadcn` | ^3.2.1 | UI component manager |

---

## Database

No npm deps — uses Docker for PostgreSQL.

---

## Potential Issues

- **`tsx`** in API devDeps v4.21.0 — duplicates Bun's built-in TypeScript runner; consider removing
- **ESLint config format split** — web uses flat config (v9), SDK uses legacy `.eslintrc.cjs`
- **`bun.lock`** is large (968 lines changed in recent commit) — many deps reinstalled
