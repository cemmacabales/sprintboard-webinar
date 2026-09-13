# SprintBoard webinar demo

SprintBoard is a deliberately small React and TypeScript repository for a live Codex Desktop webinar. It demonstrates the full agentic loop: reviewing a codebase, filing issues, having Codex implement and review them in CI, and keeping a human at the merge gate.

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

## The automated loop

Label an issue `agent-ready`. A Codex automation implements it and opens a pull
request, a second Codex automation reviews it, GitHub Actions runs the checks
and applies `ready-to-merge`, and a human merges.

It runs on a **ChatGPT Plus** plan with no API key: Codex works as scheduled
automations in the Codex app, and GitHub Actions only does the deterministic
parts. Setup, including the sandbox configuration that lets automations reach
GitHub, is in
[docs/presentation/automation-setup.md](docs/presentation/automation-setup.md).
The automation prompts are in [docs/automations/](docs/automations/README.md).

## Presenting

- [Run of show](docs/presentation/run-of-show.md) — minute by minute, with recovery
- [Copy-ready prompts](docs/webinar-prompts.md) — paste these verbatim
- [Automation setup](docs/presentation/automation-setup.md) — the pipeline, explained
- [Presenter checklist](docs/presenter-checklist.md) — pre-flight

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
