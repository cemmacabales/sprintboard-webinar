# SprintBoard webinar demo

SprintBoard is a deliberately small React and TypeScript repository for a live Codex Desktop webinar. It is the demo repository for "Nine Ways to Run an Agent", a 40-minute session on Codex sandboxes, approval policies, `AGENTS.md`, cloud tasks, and review. Everything runs on a ChatGPT Plus plan.

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

## Repository states

| Branch | State | Use |
| --- | --- | --- |
| `main` | **Healthy.** All checks pass and the app behaves correctly. | The reference state, and where the workflows live |
| `demo/needs-work` | **Needs work.** Checks still pass, but the app contains four real problems. | Where the webinar starts |

`demo/needs-work` is the interesting one. Its test suite is green, lint is
clean, and the production build succeeds — and the application still
white-screens when you open a task with no due date. Green checks are not the
same as correct software, which is the point of the exercise.

The four seeded problems span four categories: a crash, a missing regression
test, duplicated logic, and a narrow-width visual defect.

## Presenting

- [Deck](docs/presentation/nine-ways-to-run-an-agent.pptx): five slides
- [Run of show](docs/presentation/run-of-show.md): minute by minute, with recovery
- [Demo prompts](docs/webinar-prompts.md): paste these verbatim
- [Setup](docs/presentation/setup.md): one-time preparation
- [Presenter checklist](docs/presenter-checklist.md): the day before and the hour before

## Legacy checkpoints

The original linear demo checkpoints remain for reference and recovery:
`demo/start`, `demo/feature-complete`, `demo/bug-fixed`, `demo/final`.
Dependencies are identical across every branch, so `git reset --hard <branch>`
recovers a state instantly without reinstalling.

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
