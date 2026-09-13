# Presenter checklist

Full timing and recovery live in
[`docs/presentation/run-of-show.md`](presentation/run-of-show.md).

## Repository and pipeline

- [ ] `agent-queue.yml` and `pr-gate.yml` are on `main`.
- [ ] `pr-gate.yml` is on `demo/needs-work`.
- [ ] Labels exist: `agent-ready`, `agent-working`, `agent-pr`, `codex-reviewing`, `codex-approved`, `changes-requested`, `ready-to-merge`, `agent-filed`.
- [ ] `DEMO_BASE_BRANCH` is set to `demo/needs-work`.
- [ ] One full cycle has completed in rehearsal: label → PR → review → `ready-to-merge`.
- [ ] One rehearsal pull request kept closed as the fallback.
- [ ] Other rehearsal issues and pull requests closed, so the board is clean on stage.

## Local app

- [ ] `git switch -c live demo/needs-work`
- [ ] `npm ci`
- [ ] `npm run test:run`, `npm run lint`, `npm run build` — all pass on the broken branch.
- [ ] `npm run dev`, and use the **`localhost`** URL Vite prints. `127.0.0.1` is not bound.
- [ ] Confirm the white-screen crash reproduces on **Backfill release checklist**.
- [ ] Confirm it does not reproduce on `main`.

## Codex app

- [ ] Model **Terra**, effort **Medium**, execution **Local**.
- [ ] Confirm the model picker matches the slide, including Astra's availability in your account.
- [ ] gh plugin installed and authenticated.
- [ ] `~/.codex/config.toml` has the `github-agent` permission profile, and the app was restarted after adding it.
- [ ] **Agent: implement**, **Agent: review**, and **Nightly repository review** exist, each on a worktree.
- [ ] The two agents are scheduled every 5 minutes for the session.
- [ ] Usage meter has headroom.
- [ ] `docs/webinar-prompts.md` open for copying.

## Room

- [ ] Notifications off.
- [ ] Unrelated repositories, tabs, and private windows closed.
- [ ] Slides loaded and readable at 1080p share scale.
- [ ] Rehearsed once strictly to time, and once with a deliberate failure.

## Fast recovery

| If this fails | Do this |
| --- | --- |
| Local step stalls | `git reset --hard main` — no reinstall needed |
| Automation hasn't picked up the label | Press **Run now** |
| Implement or review run fails | Open the pre-staged rehearsal pull request |
| Automation doesn't fire | File the issue by hand with `gh issue create` |
| Review returns nonsense | Read it anyway; a bad review is a real teaching moment |
