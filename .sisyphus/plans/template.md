# [Feature Name] — Implementation Plan

## Context

- **Branch**: `[feature-branch]`
- **Related Docs**: `wiki/[relevant-files].md`
- **Workspaces affected**: [sdk / api / web / db]

## Goal

Brief description of what this accomplishes and why.

## Steps

### Step 1: [Name]

- **Files**: `path/to/file1.ts`, `path/to/file2.ts`
- **Changes**: What to change in each file
- **Verification**: How to verify this step (test, lsp, run)

### Step 2: [Name]

...

## Verification

- `bun check` — typecheck + lint pass
- `bun test` — all tests pass
- `lsp_diagnostics` — zero errors on changed files
- Run affected tests: `bun --cwd [workspace] test`

## Risks

- Potential issues or dependencies
- What to roll back if something breaks
