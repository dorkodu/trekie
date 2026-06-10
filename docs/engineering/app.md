# Trekie Web Application

> Frontend architecture and development notes.

## Tech Stack

- **React 19** with TypeScript
- **TanStack Router** for routing (file-based, auto-generated `routeTree.gen.ts`)
- **TanStack Query** for server state (tRPC integration)
- **TanStack Form** for form state
- **Zustand** for client-side state
- **Dexie** for IndexedDB (local-first/cache)
- **Tailwind CSS v4** + **Shadcn UI** for styling
- **Vite** for building

## Architecture

The web app is organized into:

| Directory | Purpose |
|---|---|
| `src/components/ui/` | Shadcn UI primitives (~40 components) |
| `src/components/app/` | App shell (sidebar, topbar, layout) |
| `src/components/forms/` | Login, register, forgot password |
| `src/components/feeds/` | GoalsFeed, CommitmentsFeed |
| `src/components/onboarding/` | 5-step onboarding wizard |
| `src/components/momentum/` | Momentum playground & lab |
| `src/routes/` | TanStack Router route definitions |
| `src/lib/` | Core setup (tRPC, TanStack Query, auth) |
| `src/stores/` | Zustand state stores |
| `src/config/` | Frontend configuration |

For full documentation, see `wiki/` in the repo root.
