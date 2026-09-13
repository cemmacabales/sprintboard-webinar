# Presenter checklist

Full timing and recovery live in
[`docs/presentation/run-of-show.md`](presentation/run-of-show.md).

## Repository and pipeline

- [ ] `OPENAI_API_KEY` exists as an Actions secret.
- [ ] Actions workflow permissions set to **read and write**.
- [ ] **Allow GitHub Actions to create and approve pull requests** is ticked.
- [ ] Labels exist: `agent-ready`, `ready-to-merge`, `changes-requested`, `agent-filed`.
- [ ] The `agent-ready` workflow has completed successfully at least once in rehearsal.
- [ ] One rehearsal pull request kept closed as the CI fallback.
- [ ] Open issues from rehearsal closed, so the board is clean on stage.

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
- [ ] **Nightly repository review** automation exists and has been test-run once.
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
| CI run slow or failing | Open the pre-staged rehearsal pull request |
| Automation doesn't fire | File the issue by hand with `gh issue create` |
| Review returns nonsense | Read it anyway; a bad review is a real teaching moment |
