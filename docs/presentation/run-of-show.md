# Run of show — Codex Desktop: from first prompt to a self-sustaining loop

**Length:** 34 minutes of content, 6 minutes of questions and recovery.
**Shape:** three acts of escalating autonomy — *you drive → it drives → it watches.*
**Live model:** Terra, medium reasoning, Local execution.
**Demo branch:** `demo/needs-work`.

The one sentence the whole session is built on:

> `AGENTS.md` is why the agent in your app and the agent in your CI behave the
> same way.

---

## Opening — slides (0:00–6:00)

| Time | Slide | Beat |
| --- | --- | --- |
| 0:00–1:30 | **1 — The loop** | Show the healthy app, then the broken one. "In half an hour this repo reviews itself, files its own issues, fixes them, and reviews the fix. I merge." |
| 1:30–4:00 | **2 — The sky** | Open the real model picker beside the slide. Choose **Terra / Medium**. Line: *"Raise reasoning because the problem got harder, not because the prompt got longer."* |
| 4:00–6:00 | **3 — Where it runs** | Local / Worktree / Cloud, then approvals and sandbox. Say why you are Local: the audience sees the same files you do. |

---

## Act 1 — You drive (6:00–13:30)

### 6:00–10:00 · Review and triage

Paste **Prompt 1 (Review)**. Codex reads `AGENTS.md`, then the code, and reports
four problems. It must not fix anything.

Expected findings:

| # | Category | Where |
| --- | --- | --- |
| 1 | Crash | `src/lib/date.ts` — `value!.slice(0, 10)` on a null due date |
| 2 | Coverage | `src/App.test.tsx` — nothing opens the task with no due date |
| 3 | Maintainability | `src/lib/filters.ts` — reimplements the window already in `date.ts` |
| 4 | Visual | `src/styles.css` — negative margin on the at-risk count under 520px |

**The line to land:** the suite is green, lint is clean, the build passes — and
the app white-screens on a real click. Green checks are not correctness.

*While it reads:* what `AGENTS.md` is, and why repository instructions beat a
longer prompt.

### 10:00–12:30 · File the issues

Paste **Prompt 2 (File issues)**. Codex uses the gh plugin to open four issues,
one per finding, each with reproduction steps and acceptance criteria.

Switch to the browser and show the four real issues on GitHub.

### 12:30–13:30 · Hand one to the pipeline

Apply the **`agent-ready`** label to the crash issue. Within seconds the
**Agent queue** workflow comments *"Queued for Codex."* Switch to the Codex app
and press **Run now** on **Agent: implement**. Then **leave it.** Do not watch
it.

> "That is going to take a few minutes. While it works, let me show you the
> same job done the way you'd do it on a Tuesday."

---

## Act 2 — It drives (13:30–26:00)

### 13:30–21:00 · The local loop (this is your CI cover)

Work the **coverage + crash** issue locally in the desktop app.

1. Open the built-in browser on the running app.
2. Click **Backfill release checklist**. The board white-screens.
3. Paste **Prompt 3 (Debug)**.
4. Codex reproduces, names the root cause — a non-null assertion that lied to
   the compiler — makes the smallest fix, adds the missing regression test, and
   reruns the checks.

**The line to land:** `!` doesn't make a value non-null. It makes TypeScript
stop asking.

*While it works:* sandbox modes and approvals — this is exactly when people want
to know what it's allowed to touch.

> **Recovery:** if this stalls, `git reset --hard main` restores the fixed state
> instantly. Dependencies are identical across every demo branch, so no
> `npm ci` is needed and Vite hot-reloads in about two seconds.

### 21:00–26:00 · Back to the pipeline

Return to GitHub. The issue has moved from `agent-ready` to `agent-working`, and
a pull request labelled `agent-pr` links back to it.

1. In the Codex app, press **Run now** on **Agent: review**.
2. The pull request gets `codex-reviewing`, then a review comment and
   `codex-approved`.
3. The **PR gate** workflow runs test, lint, and build, and adds
   **`ready-to-merge`**.

Read the review comment aloud. Then **you** press merge.

**The line to land:** Codex wrote it and Codex reviewed it, in separate runs
that share nothing but `AGENTS.md`. Actions checked it. A human merged it. Every
step was automated except the one that should never be.

*If someone asks:* this runs on a ChatGPT Plus plan. GitHub Actions does the
deterministic work for free; Codex runs as scheduled automations on this Mac.

---

## Act 3 — It watches (26:00–31:00)

Open the Codex automation **Nightly repository review**, scheduled daily, and
press **Run now** to simulate tonight's run.

It reviews the codebase, finds the remaining problem, and files an issue tagged
`agent-filed`. Apply `agent-ready` to it.

**The line to land:** the loop no longer needs you to start it. It needs you to
approve it.

---

## Close (31:00–34:00)

Return to **Slide 1**. Trace the loop you just ran twice — once by hand, once by
label, once on a schedule.

The ladder, one line each: clear prompt → `AGENTS.md` → tools and the browser →
worktrees and handoff → subagents → the pipeline you just watched.

---

## Questions and overflow (34:00–40:00)

If you finish early, the overflow beats in priority order:

1. Open a pull request from your local fix and comment `@codex review` on it, to
   show Codex reviewing directly on GitHub. The PR gate runs on it too.
2. The worktree handoff — a second thread running in parallel.
3. The narrow-width visual issue in the built-in browser.

---

## Recovery table

Everything is one command. No reinstall, no branch switch.

| If this fails | Run | Then say |
| --- | --- | --- |
| Review finds nothing useful | *(nothing)* | Read the four findings from this document and move on |
| Local debug stalls | `git reset --hard main` | "Here's the fix it was working toward" |
| Automation hasn't picked up the label | Press **Run now** again | "It checks on a schedule; I'm asking it to check now" |
| Implement or review run fails | *(nothing)* | Open the pre-staged pull request from rehearsal |
| Automation doesn't fire | *(nothing)* | File the issue by hand with `gh issue create` |

Work on a disposable branch so resets are free:

```bash
git switch -c live demo/needs-work
```

---

## Pre-flight

- [ ] `git switch -C live origin/demo/needs-work && npm ci && npm run dev`
- [ ] Use the **`localhost`** URL Vite prints — `127.0.0.1` is not bound.
- [ ] Model **Terra**, effort **Medium**, execution **Local**.
- [ ] `~/.codex/config.toml` has the `github-agent` permission profile (see [automation-setup.md](automation-setup.md)).
- [ ] **Agent: implement**, **Agent: review**, and **Nightly repository review** exist, each on a worktree.
- [ ] The two agents are scheduled every 5 minutes for the session.
- [ ] One full cycle rehearsed, and one pre-staged pull request kept closed as the fallback.
- [ ] `DEMO_BASE_BRANCH` is `demo/needs-work`.
- [ ] Usage meter has headroom — no full rehearsal in the last 5 hours.
- [ ] Mac plugged in, sleep disabled, Codex app open.
- [ ] `docs/webinar-prompts.md` open in a tab for copying.
- [ ] Notifications off; unrelated repositories and tabs closed.
