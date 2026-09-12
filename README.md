# SprintBoard

A compact release-operations dashboard. SprintBoard shows the work that needs
attention before the next release, grouped by status, with filters for what is
active, what is done, and what is at risk.

## Quick start

Prerequisites: Node.js 20 or newer and npm.

```bash
npm ci
npm run dev
```

Open the local address printed by Vite.

## Verification

```bash
npm run test:run   # Vitest
npm run lint       # ESLint
npm run build      # TypeScript check and production build
```

## How it works

The app is a small React and TypeScript single page with no backend.

| Path | Responsibility |
| --- | --- |
| `src/App.tsx` | Page composition, selected filter, selected task, URL state |
| `src/data/tasks.ts` | Local task fixtures with relative due dates |
| `src/lib/date.ts` | Date-only parsing, formatting, and window logic |
| `src/lib/filters.ts` | Filter validation and task filtering |
| `src/components/` | Filter bar, board, cards, and the details drawer |

The selected filter is written to the URL as `?filter=` and restored on load.
Valid values are `all`, `active`, `done`, and `at-risk`.

A task is **at risk** when it is not done and its due date falls between today
and seven days from today, inclusive.

## Contributing

Read [`AGENTS.md`](AGENTS.md) before making changes. Branch from the current
branch, keep changes focused, add tests for behavior changes, and run all three
verification commands before opening a pull request.
