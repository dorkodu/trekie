# Quality Gates

> Mandatory checks before shipping any code changes.

---

## Gate 1: Type Safety

```bash
# Run LSP diagnostics on all changed files
# (use lsp_diagnostics tool)
```

- **Zero** type errors in source code
- **Zero** `as any`, `@ts-ignore`, `@ts-expect-error`
- **Zero** `any` type annotations (unless unavoidable and documented)

## Gate 2: Tests

```bash
bun test    # All tests must pass
```

- **No test deletions** to make CI green
- New features should include tests
- Bug fixes should include a regression test

## Gate 3: Linting & Formatting

```bash
bun check:lint     # Run ESLint on web
bun check:fix      # Format everything with Prettier
```

- ESLint: clean on changed files
- Prettier: formatting match `.prettierrc.yaml`
- **100 char line limit** — no exceptions
- **2-space indentation** — no tabs

## Gate 4: Verification

- Read every changed file — verify correctness (don't trust subagent self-reports)
- Run the app if user-visible behavior changed
- Check edge cases: empty states, error states, loading states

## Gate 5: Anti-Patterns Check

Search for and remove:
- ❌ `as any`
- ❌ `@ts-ignore`, `@ts-expect-error`
- ❌ Empty `catch` blocks
- ❌ Default exports
- ❌ Business logic in API endpoints or React components

## Gate 6: Documentation

- Are types/interfaces documented with JSDoc?
- Are new env vars documented in `.env.example`?
- Are new config options documented?

## Pre-Commit Checklist

```
□ bun check — typecheck + lint clean
□ bun test — all tests pass
□ lsp_diagnostics — zero errors on changed files
□ No anti-patterns in diff (as any, @ts-ignore, etc.)
□ Changed files read and verified for correctness
□ User-visible behavior tested (run the app)
□ New code follows patterns.md conventions
□ No secrets committed
```
