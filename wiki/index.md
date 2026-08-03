# Trekie Wiki

> Gamified life dashboard with AI productivity companion and social features.
> By [Dorkodu](https://dorkodu.com) — created by Doruk Eray.

## Quick Navigation

### For Humans
| Document | What it covers |
|---|---|
| [Architecture](architecture.md) | System design, data flow, workspace roles |
| [Getting Started](getting-started.md) | Dev setup, running locally, env vars |
| [Stack](stack.md) | Technology choices and rationale |
| [Domain](domain.md) | What Trekie is — core concepts and entities |
| [Glossary](glossary.md) | Key terms defined |
| [Health Report](health-report.md) | Codebase assessment findings |
| [Momentum](momentum.md) | The signature momentum feature |
| [Action Plan](action-plan.md) | Prioritized development roadmap |

### For AI Agents
| Document | What it covers |
|---|---|
| [Codebase Map](agents/codebase-map.md) | Every directory, file, and its purpose |
| [Patterns](agents/patterns.md) | Coding conventions, anti-patterns, style guide |
| [Decision Log](agents/decision-log.md) | Architecture Decision Records |
| [Agent Commands](agents/agent-commands.md) | How to invoke workflows |
| [Quality Gates](agents/quality-gates.md) | Checks before shipping |

### Analysis
| Document | What it covers |
|---|---|
| [Potential Overview](potential/overview.md) | Multi-angle project potential summary |
| [Technology Potential](potential/technology.md) | Architecture strengths and technical option value |
| [Product Potential](potential/product.md) | Concept strength, differentiation, and product risks |
| [Market Potential](potential/market.md) | Category context, opportunity, and competitive positioning |
| [Business Potential](potential/business.md) | Commercial model options and growth paths |
| [Risks and Limitations](potential/risks_and_limitations.md) | Strategic, product, market, and technical risks |
| [Next Steps](potential/next_steps.md) | Recommended next actions |
| [Action Plan](action-plan.md) | Prioritized development roadmap |

### Shared
| Document | What it covers |
|---|---|
| [Dependencies](dependencies.md) | External deps, versions, usage |
| [Testing](testing.md) | Test philosophy and practices |
| [Deployment](deployment.md) | Environments and CI/CD |

---

## Repo at a Glance

```
trekie/
├── sdk/          # Core domain library (@trekie/sdk)
├── web/          # React frontend (@trekie/web)
├── api/          # ElysiaJS API server (@trekie/api)
├── db/           # PostgreSQL + Docker compose
├── docs/         # Obsidian-style working notes
├── wiki/         # This documentation (agent-first)
├── design/       # Brand assets, logos, icons
├── .specify/     # SpecKit agentic workflow scripts
└── .github/      # CI/CD and copilot prompts
```

## Project Status

- **Current**: Agentic-first development established
- **Branch**: `momentum-extensions` (ahead of `main`)
- **Tests**: 65 ✅ / 0 ❌ (SDK core only — no web or API tests yet)
- **Lint**: 0 errors (all 212 pre-existing errors eliminated)
- **`bun check`**: ✅ Passes clean (typecheck + lint)
- **CI**: GitHub Actions on push/PR to main
- **Docs**: `wiki/` with 22+ files, `docs/` engineering notes filled in
- **Next**: Web/API tests, deployment config, product validation
