# SprintBoard webinar demo

SprintBoard is a deliberately small React and TypeScript repository for a live Codex Desktop webinar. It demonstrates repository exploration, planning, test-driven feature work, browser verification, debugging, review, and checkpoint-based recovery without a backend or external services.

## Quick start

Prerequisites: Node.js 20 or newer and npm.

```bash
npm ci
npm run dev
```

Open the local address printed by Vite. The app uses generated relative dates, so the exercise remains useful on any calendar date.

## Verification

```bash
npm run test:run
npm run lint
npm run build
```

## Prepared exercises

The feature exercise adds an **At risk** filter for incomplete tasks due today through seven days from now. Copy-ready instructions live in [docs/webinar-prompts.md](docs/webinar-prompts.md).

To reproduce the prepared runtime bug on `demo/start` or `demo/feature-complete`:

1. Start the app.
2. Find **Backfill release checklist** in Todo.
3. Open its task card.
4. Observe that the details panel fails because the task has no due date.
5. Reload the page to continue the demo.

## Checkpoints

| Branch | Purpose |
| --- | --- |
| `demo/start` | Initial app, three filters, and the prepared crash |
| `demo/feature-complete` | At-risk feature and tests; crash still present |
| `demo/bug-fixed` | Null-safe due dates and regression coverage |
| `demo/final` | Reviewed date utility, spacing polish, and final screenshot |

Return to a known checkpoint with `git switch <branch>`, then run `npm ci`. Switching branches with uncommitted work may overwrite or strand demo changes, so commit or stash anything you want to keep first.

## Screenshots

Browser automation was unable to capture the local app while the desktop security-policy check was unavailable. When capture is available, save the two verified images as:

- `docs/screenshots/start.png` from `demo/start`
- `docs/screenshots/final.png` from `demo/final`

See [the screenshot checklist](docs/screenshots/README.md) for the exact views.

## Troubleshooting

- If the page is stale, stop Vite, run `npm ci`, and restart `npm run dev`.
- If the expected checkpoint behavior is missing, confirm the current branch with `git branch --show-current`.
- If the default port is occupied, use the alternate local address printed by Vite.
- If the prepared crash takes over the page, reload it; this is intentional on the first two checkpoints.
