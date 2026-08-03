# Architecture Decision Log

> Key decisions about Trekie's architecture. New decisions go at the top.

---

## ADR-009: Agentic-First Development Transition

**Date**: 2026-05-29
**Status**: Accepted

**Context**: The codebase was fully manually developed with sparse documentation. As the project resumes development, it needs to be set up for AI-agent-driven development to increase velocity and maintain consistency.

**Decision**: Transition to an agentic-first development workflow:
- Document the entire codebase in `wiki/` for both humans and AI agents
- Create `wiki/agents/` with codebase maps, patterns, decision logs, and quality gates
- Add `bun check`, `bun check:types`, `bun check:lint`, `bun check:fix` toolchain scripts
- Enhance `AGENTS.md` with comprehensive agent context
- Fix ESLint formatting compatibility (chalk v5 → v4 for stylish formatter)
- Deduplicate `@tanstack/query-core` to fix type errors

**Consequences**:
- ✅ AI agents can navigate the codebase without hallucination
- ✅ Typecheck + lint pipeline works end-to-end
- ✅ Test suite is verified clean (65/65 passing)
- ❌ Pre-existing lint issues in web (unused variables, JSX) remain as tech debt
- ⏳ `.specify/` scripts need verification but remain functional

---

## ADR-001: SDK-First Architecture

**Date**: 2024 (original project inception)
**Status**: Accepted

**Context**: The codebase needed to serve both a web app and an API without duplicating domain logic.

**Decision**: All domain logic lives in `sdk/`. The API (`api/`) is a thin transport layer. The web app (`web/`) is a presentation layer. Both import from SDK.

**Consequences**:
- ✅ No domain logic duplication
- ✅ SDK can be tested independently
- ✅ Consistent types across the stack
- ❌ SDK must avoid browser/server-specific imports

---

## ADR-002: tRPC for API Layer

**Date**: 2024
**Status**: Accepted

**Context**: Needed end-to-end type safety between frontend and backend without the complexity of GraphQL.

**Decision**: Use tRPC over ElysiaJS for the API layer. ElysiaJS handles HTTP, tRPC handles RPC with full type inference.

**Consequences**:
- ✅ Full type safety from DB queries to React components
- ✅ No code generation step
- ❌ Coupling to tRPC ecosystem

---

## ADR-003: ElysiaJS over Express/Fastify

**Date**: 2024
**Status**: Accepted

**Context**: Bun-native runtime, wanted a fast HTTP framework with first-class Bun support.

**Decision**: Use ElysiaJS, a Bun-native HTTP framework with tRPC and WebSocket plugins.

**Consequences**:
- ✅ Excellent Bun integration and performance
- ✅ Minimal boilerplate
- ❌ Smaller ecosystem than Express/Fastify

---

## ADR-004: Momentum Engine in SDK, not API

**Date**: 2025 (momentum feature inception)
**Status**: Accepted

**Context**: Momentum is a complex domain algorithm that could live in the API or SDK.

**Decision**: Momentum engine (scoring, factors, delta computation) lives entirely in `sdk/`. API only exposes endpoints and persistence. AI features (explain, recommend) use LangChain in the API but call SDK for data.

**Consequences**:
- ✅ Momentum can be tested without a server
- ✅ Could be used by other clients (CLI, mobile) in the future
- ✅ Clean separation of concerns
- ❌ API still needs LangChain code for AI features

---

## ADR-005: ESLint v9 Flat Config in Web, Legacy in SDK

**Date**: 2025
**Status**: Accepted (transitional)

**Context**: ESLint v9 deprecated the legacy config format. The web app migrated to flat config (`eslint.config.mjs`), but SDK still uses legacy (`eslintrc.cjs`).

**Decision**: Keep both for now. Migrate SDK when convenient.

**Consequences**:
- ✅ No urgent migration needed
- ❌ Inconsistent lint tooling
- ⏳ Should migrate SDK to flat config eventually

---

## ADR-006: Dexie for Local-First Storage

**Date**: 2024
**Status**: Accepted

**Context**: The app needs to work offline and sync data when online.

**Decision**: Use Dexie (IndexedDB wrapper) for local-first data. The SDK manages Dexie tables and sync logic.

**Consequences**:
- ✅ Offline-capable
- ✅ Fast local reads
- ❌ Increases bundle size
- ❌ Adds sync complexity

---

## ADR-007: Better Auth for Authentication

**Date**: 2024
**Status**: Accepted

**Context**: Needed a TypeScript-native auth solution with sessions, OAuth, and email/password.

**Decision**: Use Better Auth with its own DB schema and endpoints. Runs as a middleware plugin on ElysiaJS.

**Consequences**:
- ✅ Self-contained auth module
- ✅ Supports multiple auth strategies
- ✅ TypeScript-native
- ❌ Additional DB schema to maintain

---

## ADR-008: Bun as Package Manager and Runtime

**Date**: 2024
**Status**: Accepted

**Context**: Needed a fast package manager and a runtime that supports TypeScript natively.

**Decision**: Use Bun for everything — package management, dev server, test runner, production runtime.

**Consequences**:
- ✅ Fast installs and dev startup
- ✅ Single tool for multiple concerns
- ✅ Good Node.js compatibility
- ❌ Smaller ecosystem than Node.js
