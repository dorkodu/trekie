# Technology Stack

## Core

| Technology | Version | Used for |
|---|---|---|
| **TypeScript** | ~5.9 | The entire codebase — strict mode |
| **Bun** | 1.3.9 | Package manager, runtime, test runner |
| **Vite** | ^6 | Web build tool |

## Frontend (`web/`)

| Library | Purpose |
|---|---|
| **React 19** | UI framework |
| **TanStack Router** | Client-side routing (file-based) |
| **TanStack Query** | Server state management |
| **TanStack Form** | Form state management |
| **TanStack Table** | Data tables |
| **Zustand** | Client state management |
| **Dexie** | IndexedDB wrapper (local-first storage) |
| **Tailwind CSS v4** | Utility-first styling |
| **Shadcn UI** | Component library (built on Radix UI) |
| **Radix UI** | Accessible UI primitives |
| **Tabler Icons** | Icon set |
| **Lucide React** | Icon set (secondary) |
| **Embla Carousel** | Carousel component |
| **date-fns** | Date manipulation |
| **Recharts** | Charts (in Momentum) |
| **AI SDK** | AI chat/inference (Vercel AI SDK) |
| **Canvas Confetti** | Confetti effects |
| **framer-motion** | Animations |

## Backend (`api/`)

| Library | Purpose |
|---|---|
| **ElysiaJS** | HTTP framework (Bun-native, fast) |
| **tRPC** | End-to-end typesafe RPC |
| **Better Auth** | Authentication (sessions, passwords, OAuth) |
| **Drizzle ORM** | Database ORM and migrations |
| **Zod** | Schema validation |
| **LangChain** | AI agent framework |
| **LangGraph** | Agent state machines |
| **Neverthrow** | Functional error handling (Result type) |
| **Nodemailer** | Email sending |
| **UlidX** | ULID generation |
| **js-xxhash** | Fast hashing |

## SDK (`sdk/`)

| Library | Purpose |
|---|---|
| **Immer** | Immutable state updates |
| **Zustand** | Store primitives |
| **Dexie** | IndexedDB operations |
| **tRPC client/server** | RPC primitives |
| **Neverthrow** | Result/Option types |
| **Zod** | Validation schemas |
| **Type Fest** | Advanced TypeScript types |
| **UlidX** | ID generation |

## Database (`db/`)

| Technology | Purpose |
|---|---|
| **PostgreSQL** | Primary database |
| **Docker Compose** | Local dev database |
| **Drizzle Kit** | Migration management |

## Developer Tooling

| Tool | Purpose |
|---|---|
| **ESLint** (v9) | Linting (flat config in web, legacy in sdk) |
| **Prettier** | Code formatting |
| **shadcn** (v3.2) | UI component management |

## Noteworthy Absences

- No **Playwright** or **Cypress** for E2E testing
- No **Storybook** for component development
- No **GraphQL** (tRPC handles this)
- No **tRPC React Query** in SDK (only full stack)
