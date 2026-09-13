# Copy-ready demo prompts

Paste these verbatim. They follow
[`docs/presentation/run-of-show.md`](presentation/run-of-show.md).

**Before you start:** the terminal is at the repository root on the `live`
branch, `codex` works, and the dev server is running. See
[`docs/presentation/setup.md`](presentation/setup.md).

---

## Demo 0 · The stakes

```bash
npm run test:run
```

Then open **Backfill release checklist** in the browser. The board
white-screens.

---

## Demo 1 · Sandbox and approvals

### Step 1: read-only, nobody asks

```bash
codex --sandbox read-only --ask-for-approval never
```

```text
Fix the crash that happens when a task has no due date. The bug is in src/lib/date.ts.
```

Expected: it reads the file and explains the bug, but it cannot write. With
`never`, it reports that the edit failed instead of asking.

### Step 2: switch in place

Type `/permissions` and choose **workspace-write** with **on-request**. Then:

```text
Now make that fix, add a regression test for a task with no due date, and run npm run test:run.
```

Expected: it edits and runs the tests without asking. Everything stays inside
the workspace.

### Step 3: cross the line

```text
Run npm view react version and tell me the result.
```

Expected: it needs the network, so it stops and asks you. Decline it on
screen.

### Step 4: let an agent answer

Quit with Ctrl+C, then:

```bash
codex --approve-for-me
```

```text
Run npm view react version and tell me the result.
```

Expected: the automatic reviewer decides instead of you. Read its decision out
loud.

### Name it, don't run it

```bash
codex --sandbox danger-full-access --ask-for-approval never
```

### Reset

```bash
git reset --hard origin/demo/needs-work
```

---

## Demo 2 · AGENTS.md discovery

Show the root `AGENTS.md` beside the bloated example. The example lives on
`main`, so open it on GitHub:
`docs/presentation/examples/AGENTS.bloated.md`.

### From the repository root

```bash
codex
```

```text
Without opening any files, list every instruction you were given for this repository and say which file each one came from.
```

Expected: only the root `AGENTS.md`. Nothing about components.

### From the components folder

Quit, then:

```bash
cd src/components && codex
```

```text
Without opening any files, list every instruction you were given for this repository and say which file each one came from.
```

Expected: the root rules **and** `src/components/AGENTS.md`, including the line
"Component rules loaded."

```bash
cd ../..
```

---

## Demo 3 · Cloud task and the two phases

Show **chatgpt.com/codex/settings/environments**: setup script `npm ci`, agent
internet off.

### Task A: start this first, on `demo/needs-work`

```text
Opening the task "Backfill release checklist" crashes the details panel because the task has no due date. Fix it with the smallest safe change, add the missing regression test, and run npm run test:run, npm run lint, and npm run build. Follow AGENTS.md.
```

### Task B: the agent phase has no network

```text
Run `npm view react version` and report exactly what happens. Do not change any files.
```

Expected: a network error. Install dependencies in setup, not in the task.

---

## Demo 4 · Review and the fast lane

1. Open Task A, review the diff, and **create a pull request against
   `demo/needs-work`**.
2. Wait for the automatic review. If nothing posts within a minute, comment:

```text
@codex review
```

3. Read one finding aloud and say whether you agree.
4. Optional follow-up on the pull request:

```text
@codex fix it
```

### The fast lane

```bash
codex -p fast
```

```text
In src/App.tsx, rename visibleTasks to filteredTasks everywhere it appears. Then run npm run lint and npm run test:run.
```
