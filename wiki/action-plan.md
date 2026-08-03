# Trekie — Action Plan

> Prioritized roadmap for continuing development. Based on codebase assessment, potential analysis, and current repo status.

---

## Current State Summary

| Area | Status |
|---|---|
| Core domain logic (SDK) | ✅ Working — momentum engine, ABAC, analytics |
| API server | ✅ Working — tRPC, mock mode without DB |
| Web frontend | ✅ Working — React 19, TanStack Router, Shadcn UI |
| Tests | ⚠️ SDK only (65 passing) — no web or API tests |
| Lint / Typecheck | ✅ Clean — `bun check` passes |
| CI | ✅ GitHub Actions on push/PR to main |
| Documentation | ✅ Wiki (22+ files), docs/ filled in |
| Deployment | ❌ No production deployment configured |
| Product validation | ❌ No user testing or metrics yet |

---

## Phase 1: Testing Foundation (1-2 weeks)

> Goal: Achieve test coverage across all workspaces so changes can be made safely.

### 1.1 API Tests
- Add Bun test runner to `api/package.json`
- Write integration tests for key tRPC routers:
  - Auth flows (register, login, session)
  - Goal CRUD operations
  - Habit tracking endpoints
  - Momentum data retrieval
- Mock database interactions with test fixtures
- Target: ~30-50 tests covering critical paths

### 1.2 Web Component Tests
- Set up Vitest for component testing (already configured)
- Write tests for key components:
  - Momentum display card
  - Goal/Habit forms
  - Commitment feed
- Target: ~20-30 tests for core UI flows

### 1.3 SDK Extension Tests
- Add tests for untested SDK modules:
  - Goal and commitment domain logic
  - Habit tracking logic
  - Social features (if domain logic exists)
- Target: expand from 65 to ~100+ tests

### Deliverables
- [ ] `api/package.json` has `test` script
- [ ] API integration tests passing
- [ ] Web component tests passing
- [ ] SDK test coverage expanded
- [ ] CI runs all tests automatically

---

## Phase 2: Deployment Infrastructure (1-2 weeks)

> Goal: Get Trekie deployed to a staging environment for real testing.

### 2.1 Database Setup
- Choose managed PostgreSQL (Neon, Supabase, or Railway)
- Create staging database
- Run Drizzle migrations against staging
- Document connection setup

### 2.2 API Deployment
- Choose platform: Fly.io, Railway, or Render
- Configure environment variables
- Set up health check endpoint
- Deploy API server to staging

### 2.3 Web Deployment
- Choose platform: Vercel, Cloudflare Pages, or Railway static
- Configure `VITE_API_URL` for staging API
- Deploy web app to staging
- Set up custom domain (optional)

### 2.4 Production Readiness
- Set up production database (separate from staging)
- Configure production environment variables
- Set up monitoring/error tracking (Sentry, Logtail, or similar)
- Document deployment runbook

### Deliverables
- [ ] Staging environment live (API + Web + DB)
- [ ] Production environment configured
- [ ] Deployment documented in `wiki/deployment.md`
- [ ] Environment variable checklist complete

---

## Phase 3: Product Validation (2-3 weeks)

> Goal: Validate that the core product loop works with real users.

### 3.1 Define the MVP Scope
The MVP should prove the core value proposition:
- **Momentum score** — users see their productivity health
- **One input layer** — habits OR commitments (not both yet)
- **AI explanation** — why the score changed
- **One accountability mechanic** — streaks or social feed

Cut features for MVP:
- ~~Market/coin shop~~ (later)
- ~~Complex social features~~ (later)
- ~~Public profiles~~ (later)

### 3.2 Onboarding Flow
- Simplify signup to < 2 minutes
- First-time user experience:
  1. Set 1-3 goals
  2. Define 2-3 commitments
  3. See first Momentum score
  4. Get first AI recommendation
- Track: signup completion rate, time-to-value

### 3.3 Core Loop Validation
Key metrics to track:
- **Activation**: % of signups who complete onboarding
- **Day-1 retention**: % who return next day
- **Day-7 retention**: % who return after a week
- **Engagement**: avg. sessions per week
- **Upgrade intent**: % who click premium, start trial

### 3.4 User Interviews
- Recruit 10-20 beta users from target segments
- Conduct weekly feedback sessions
- Focus on:
  - Does Momentum feel meaningful?
  - Is AI coaching helpful or annoying?
  - What's missing for daily use?
  - Would they pay for this?

### Deliverables
- [ ] MVP scope defined and documented
- [ ] Onboarding flow optimized
- [ ] Analytics/tracking implemented
- [ ] Beta user group recruited
- [ ] First round of user interviews complete

---

## Phase 4: Core Product Iteration (3-4 weeks)

> Goal: Refine the product based on validation data.

### 4.1 Momentum Engine Tuning
- Adjust scoring weights based on user feedback
- Add/remove factors based on what drives retention
- Improve AI explanations (more specific, more actionable)

### 4.2 Habit Loop Design
- Design daily check-in flow
- Implement streak tracking with visual feedback
- Add reminders/notifications (web push or email)

### 4.3 Social Accountability
- Design "buddy system" or small group feature
- Add accountability partners feature
- Implement lightweight social feed (activity only, not chat)

### 4.4 Premium Tier Design
- Define what's free vs. premium
- Implement upgrade flow
- Set up Stripe integration
- Target: $8-12/month for premium

### Deliverables
- [ ] Momentum scoring tuned
- [ ] Habit loop implemented
- [ ] Social accountability feature live
- [ ] Premium tier designed and priced

---

## Phase 5: Growth Foundation (ongoing)

> Goal: Establish channels for acquiring and retaining users.

### 5.1 Content Strategy
- Write 5-10 blog posts about:
  - "What is productivity health?"
  - "How AI coaching helps build habits"
  - "The science of accountability"
- Publish on personal blog, dev.to, Hashnode, or Medium
- SEO target: "AI productivity coach", "gamified habit tracker"

### 5.2 Community Building
- Create Discord or community space for beta users
- Share progress publicly (build in public)
- Engage with productivity/habit communities on Reddit, Twitter

### 5.3 Developer Ecosystem (later)
- Document SDK API for third-party developers
- Create example integrations
- Consider "community edition" for teams/schools

### Deliverables
- [ ] Content calendar created
- [ ] 5+ blog posts published
- [ ] Community space established
- [ ] Early traction metrics tracked

---

## Technical Debt to Address

These items should be tackled opportunistically during the phases above:

1. **SDK package.json scripts** — Add `test`, `build` scripts
2. **Root tsconfig** — Suppress node_modules type noise
3. **`.specify/` scripts** — Archive or update stale bash scripts
4. **Prettier config** — Ensure consistent formatting across workspaces
5. **Web test setup** — Expand beyond vitest basics

---

## Success Criteria

After completing Phases 1-3, Trekie should have:

- ✅ Test coverage across all workspaces
- ✅ Staging environment live
- ✅ MVP product with core loop working
- ✅ First 10-20 beta users
- ✅ Key metrics tracked (activation, retention, engagement)

After Phase 4-5:

- ✅ Refined product based on user feedback
- ✅ Premium tier generating revenue
- ✅ Content/community driving organic growth
- ✅ Clear path to scaling

---

## Priority Order

If time is limited, focus on:

1. **Phase 1 (Testing)** — enables safe iteration
2. **Phase 2 (Deployment)** — enables real testing
3. **Phase 3 (Validation)** — proves the product works

Phases 4-5 are important but should follow validation.

---

## Related Files

- [Health Report](health-report.md) — Current codebase status
- [Potential Overview](potential/overview.md) — Strategic analysis
- [Technology Potential](potential/technology.md) — Technical strengths
- [Next Steps](potential/next_steps.md) — Recommended actions
