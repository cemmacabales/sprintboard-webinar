# Run of show: Nine Ways to Run an Agent

**Length:** 40 minutes: 34 of content, 6 for questions and recovery.
**Shape:** five slides, each followed by a live demo on SprintBoard.
**Audience:** junior to mid-level developers who have run Codex but never
configured it.
**Deck:** `docs/presentation/nine-ways-to-run-an-agent.pptx`
**Demo branch:** `demo/needs-work`, checked out locally as `live`. Its tests
pass and the app still crashes.
**Plan:** ChatGPT Plus. No API key anywhere.

The sentence the whole session is built on:

> Sandbox is blast radius. Approval is interruptions. Configure the leash once,
> and the agent stops needing supervision for the boring 80%.

Prompts for every demo are in [`docs/webinar-prompts.md`](../webinar-prompts.md).

---

## At a glance

| Time | Slide | Demo |
| --- | --- | --- |
| 0:00–4:00 | 1 · Nine ways to run an agent | Demo 0 · the stakes (1 min) |
| 4:00–15:00 | 2 · The matrix | Demo 1 · sandbox and approvals (7 min) |
| 15:00–22:00 | 3 · AGENTS.md | Demo 2 · discovery (4 min) |
| 22:00–30:00 | 4 · Where it runs | Demo 3 · cloud task and the two phases (5 min) |
| 30:00–34:00 | 5 · Review first, then pick a lane | Demo 4 · `@codex review` and the fast lane (2.5 min) |
| 34:00–40:00 | — | Questions and recovery |

---

## 0:00–4:00 · Slide 1: Nine ways to run an agent

**Say:** "You've run Codex. You haven't configured it." Most people use it as a
chat box that happens to sit in a terminal. This session is the layer
underneath: what the agent may touch, what it reads first, and where the work
runs.

Name who it's for: you've asked it to fix a bug, you approve every prompt by
hand, you've heard of `AGENTS.md` but never checked it's read, and you're not
sure when to use the cloud. Nobody needs a config file to follow along.

Read the four take-aways on the slide out loud.

### Demo 0 · The stakes (3:00–4:00)

1. In the terminal, run the tests. Twelve pass.
2. In the browser, open **Backfill release checklist**. The whole board
   white-screens.

**Line to land:** "Green tests, broken app. That's the repository we're about
to hand to an agent. How much should it be allowed to touch?"

---

## 4:00–15:00 · Slide 2: The matrix

**Say:** two independent questions.

- **Sandbox, the rows:** what can it touch? `read-only`, `workspace-write`,
  `danger-full-access`.
- **Approval, the columns:** when it wants to cross a line, who answers?
  You (`on-request`), a reviewer agent (auto-review), or no one (`never`).

Say it twice: **sandbox is blast radius, approval is interruptions.** A tight
sandbox with `never` is still safe. A loose sandbox with `never` is not.

Three cells you'll use: explore with `read-only` + `never`; daily work with
`workspace-write` + `on-request`; long unattended runs with `workspace-write` +
`never`, isolated. The one to avoid: `danger-full-access` + `never`.

Be honest that most of the nine aren't worth using. Choosing is the skill, not
memorising.

If anyone has read an older post: `untrusted` is deprecated. Use `on-request`.

### Demo 1 · Sandbox and approvals (8:00–15:00)

Four steps, one terminal:

1. **Read-only, nobody asks.** Ask it to fix the crash. It can read and explain
   but can't write, and with `never` it just reports the failure.
2. **`/permissions` → workspace-write + on-request.** Same session. Now it
   fixes the bug and runs the tests with no prompts, because everything stays
   inside the workspace.
3. **Cross the line.** Ask it to run `npm view react version`. That needs the
   network, so it stops and asks you.
4. **Let an agent answer.** Restart with `--approve-for-me` and ask again. An
   automatic reviewer decides instead of you. Same sandbox, different person
   answering.

**Lines to land:** the refusal in step 1 is more memorable than any
description. Step 4 is the newest column in the matrix.

**Name, don't run:** `danger-full-access` + `never`, also spelled `--yolo`. The
combination with no brakes.

> **Recovery:** Ctrl+C, then `git reset --hard origin/demo/needs-work`, then
> go to the next step. Nothing later depends on Demo 1's edits.

---

## 15:00–22:00 · Slide 3: AGENTS.md

**Say:** it's the file the agent reads before your prompt. Codex reads
`AGENTS.md` from the git root down to the folder you started in, and joins them
in that order. A file in a folder *below* where you started isn't loaded.

That's why people report "my AGENTS.md is being ignored." **Check discovery
before you debug the content.**

What belongs: exact commands for tests, lint, and types; conventions you can't
see from the code; folders to leave alone; what "done" means. What doesn't: a
copy of the README, or the whole style guide.

Treat it as a prompt you refine over weeks, not documentation you write once.

### Demo 2 · Discovery (18:00–22:00)

1. Show this repository's `AGENTS.md` beside the bloated example. The tight one
   produces better results, and that surprises people.
2. Start Codex at the repository root and ask it to list its instructions
   without opening files. Nothing about components.
3. Quit, `cd src/components`, start Codex again, and ask the same thing. Now the
   component rules appear, including the line *"Component rules loaded."*

**Line to land:** same repository, same question, different starting folder.

---

## 22:00–30:00 · Slide 4: Where it runs

**Say:** one agent, three surfaces. The CLI and app run locally and you watch.
Cloud tasks run without blocking your machine, several at once. The IDE
extension puts the same agent in your editor.

The judgment call: offload work that is well specified and slow. Keep work that
needs your eyes, your local state, or fast iteration.

Ask the room what they'd offload. Good answers: dependency bumps, test
backfill, mechanical refactors across many files.

Then the two phases, the highest-value part for anyone who's hit a confusing
cloud failure:

1. **Setup:** your script runs *with* internet. Secrets exist here only.
2. Secrets are removed.
3. **Agent:** network is *off* by default. Environment variables remain.

So install dependencies in setup, not in the task. Budget an extra minute for
questions here.

### Demo 3 · Cloud task and the two phases (25:00–30:00)

1. Show the environment settings: setup script `npm ci`, agent internet off.
2. **Start Task A first:** fix the crash and add the missing regression test.
   Leave it running.
3. **Start Task B:** run `npm view react version` and report what happens. It
   fails, because the agent phase has no network.

**Line to land:** "Task B didn't break. It's working exactly as configured."

**Failure mode to name:** offloading work that needed your local database.

---

## 30:00–34:00 · Slide 5: Review first, then pick a lane

**Say:** Codex can review pull requests and follows the Code Review Rules in
`AGENTS.md`, automatically or when you comment `@codex review`. Run it before a
human sees the branch.

Read the feedback critically. Some findings are wrong, and saying so is the
skill. Accepting every suggestion is how you get worse code with more
confidence.

Model lanes: match the model to the task. Luna for mechanical work, Terra for
everyday repository work, Sol for debugging and ambiguity, Astra for long
multi-tool work. Profiles switch model and settings as one named unit. Check
your picker; availability changes.

### Demo 4 · Review and the fast lane (31:30–34:00)

1. Open Task A, review the diff, and create its pull request against
   `demo/needs-work`.
2. The automatic review posts. If it hasn't within a minute, comment
   `@codex review`.
3. Read one finding aloud and say whether you agree, and why.
4. If there's time: `codex -p fast` for a mechanical rename.

**Failure modes to name:** trusting an agent's own claim that the tests pass,
so point at the CI check; and one long thread doing four unrelated things,
which is why every demo today started a fresh session.

**Close:** read the recap line. "Questions."

---

## 34:00–40:00 · Questions and recovery

If you finish early:

1. `@codex fix it` on the review finding.
2. The bloated `AGENTS.md` versus the tight one, line by line.
3. `codex -p deep` on the crash for a root-cause explanation.

---

## Recovery table

| If this fails | Do this | Then say |
| --- | --- | --- |
| A local demo step stalls | Ctrl+C, `git reset --hard origin/demo/needs-work` | "Here's what it was about to do" |
| The approval prompt doesn't appear | Move on | Describe what `on-request` would have asked |
| The nested rules show up from the root | Re-run with "without opening any files" | "Reading a file isn't the same as loading it" |
| Task A isn't done by 31:00 | Reopen the rehearsal pull request | "Here's one I made earlier" |
| The automatic review doesn't post | Comment `@codex review`, or show the rehearsal PR's review | — |
