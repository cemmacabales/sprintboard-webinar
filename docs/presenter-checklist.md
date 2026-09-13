# Presenter checklist

Timing and recovery: [run-of-show.md](presentation/run-of-show.md).
One-time setup: [setup.md](presentation/setup.md).

## The day before

- [ ] One full rehearsal, strictly to time.
- [ ] Fallback pull request created from Task A, reviewed by Codex, and **closed without merging**.
- [ ] Codex cloud: GitHub connected, environment on `demo/needs-work` with `npm ci`, **Code review** and **Automatic reviews** on.
- [ ] `~/.codex/fast.config.toml` and `~/.codex/deep.config.toml` exist, and their model names match your picker.
- [ ] Astra appears in your picker, or you'll say it's rolling out.

## One hour before

- [ ] `codex login status` says `Logged in using ChatGPT`.
- [ ] `git fetch origin && git switch -C live origin/demo/needs-work && npm ci`
- [ ] `npm run test:run` shows 12 passed.
- [ ] `src/components/AGENTS.md` exists on the `live` branch.
- [ ] `npm run dev`, open the **localhost** URL, confirm the crash on **Backfill release checklist**, then reload.
- [ ] Deck open on slide 1.
- [ ] Browser tabs: chatgpt.com/codex, the environment settings, the GitHub repository, and the bloated `AGENTS.md` example on `main`.
- [ ] Usage meter has headroom. No full rehearsal in the last 5 hours.
- [ ] Notifications off, unrelated tabs closed, terminal font enlarged.

## Fast recovery

| If this fails | Do this |
| --- | --- |
| A local step stalls | Ctrl+C, `git reset --hard origin/demo/needs-work`, next step |
| Nested rules appear from the root | Re-run with "without opening any files" |
| Task A isn't done by 31:00 | Reopen the fallback pull request |
| Automatic review doesn't post | Comment `@codex review` |
