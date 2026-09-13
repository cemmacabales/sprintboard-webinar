# Copy-ready webinar prompts

Paste these verbatim. They are ordered to match
[`docs/presentation/run-of-show.md`](presentation/run-of-show.md).

Start on `demo/needs-work`, model **Terra**, effort **medium**, execution
**Local**.

---

## 1. Review and triage (Act 1, 6:00)

```text
Review this repository for real problems. Follow AGENTS.md.

Read the code before you judge it. The test suite currently passes, so do not
rely on the tests to tell you what is wrong.

Report what you find grouped by category: correctness, test coverage,
maintainability, and visual or accessibility issues. For each one give the file,
what is wrong, and how a user would notice.

Do not change any code yet.
```

Expected: the null-due-date crash in `src/lib/date.ts`, the missing regression
test in `src/App.test.tsx`, the duplicated date window in `src/lib/filters.ts`,
and the negative margin in `src/styles.css`.

---

## 2. File the issues (Act 1, 10:00)

```text
Open a GitHub issue for each problem you just found, using the gh CLI.

One issue per problem. Give each a clear title, reproduction steps, the file
involved, and acceptance criteria a reviewer could check. Apply the label `bug`
or `enhancement` as appropriate.

Do not apply the agent-ready label. I will do that.
```

---

## 3. Debug the crash locally (Act 2, 13:30)

Reproduce it in the built-in browser first, then paste:

```text
Opening the task "Backfill release checklist" white-screens the whole app.

Reproduce the failure, explain the root cause precisely, make the smallest safe
fix, and add the regression test that is currently missing. Then run
npm run test:run, npm run lint, and npm run build, and report the results.
```

Expected root cause: `formatDate` uses a non-null assertion (`value!`) on a
value that really is `null`.

---

## 4. Optional — verify in the browser (overflow)

```text
Open SprintBoard in the built-in browser. Verify the All, Active, Done, and
At risk filter states, and check the layout at desktop and narrow widths.
Report anything you cannot verify.
```

---

## 5. Optional — prevention pass (overflow)

```text
Search for the same due-date assumption anywhere else in the repository.
Report findings only. Do not edit.
```

---

## 6. Scheduled review automation (Act 3)

This is configured once in the Codex app, not pasted live. See
[`automation-setup.md`](presentation/automation-setup.md).

```text
Review this repository for correctness, accessibility, and maintainability
problems. Do not change any code.

For each genuine problem you find, check whether an open issue already covers
it. If not, open one with `gh issue create`, labelled `agent-filed`, containing
reproduction steps and acceptance criteria.

If you find nothing worth filing, say so and open nothing.
```

---

## Prompts that run without you

These live in the workflow files and are worth showing on screen rather than
pasting:

- **Implementation** — [`.github/workflows/agent-ready.yml`](../.github/workflows/agent-ready.yml), the `Run Codex` step
- **Review** — the `Review the diff` step in the same file, and in
  [`.github/workflows/codex-review.yml`](../.github/workflows/codex-review.yml)

Both begin by telling Codex to read `AGENTS.md`. That is the point: the rules
you rely on in the app are the rules that apply when nobody is watching.
