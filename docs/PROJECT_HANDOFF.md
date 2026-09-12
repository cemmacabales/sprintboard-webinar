# Codex Desktop webinar and SprintBoard repository handoff

Last updated: 12 September 2026  
Repository owner: `cemmacabales`  
GitHub repository: <https://github.com/cemmacabales/sprintboard-webinar>  
Repository visibility: private  
Primary development branch: `develop`

This is the comprehensive knowledge transfer for the Codex Desktop webinar project and its prepared SprintBoard demonstration repository. It records the user's intent, the decisions made in the planning conversation, the work completed by Codex, the implementation details, the deliberate demo states, the Git and GitHub topology, verification evidence, unresolved work, and the safest continuation path for Claude Code.

## 1. Read this first

If you are Claude Code continuing this work:

1. Read the root `AGENTS.md` and follow it.
2. Confirm the current branch before running npm commands.
3. Use `develop`, not `main`, as the source branch for new work.
4. Preserve the existing `demo/*` branches exactly; they are timed webinar checkpoints.
5. Create a new focused branch from the latest `origin/develop` for every change.
6. Keep the repository small, local-only, deterministic, and easy to explain live.
7. Run `npm run test:run`, `npm run lint`, and `npm run build` after application changes.
8. Use only the Git identity `cemmacabales <carlmacabales31@gmail.com>` and add no co-authors.
9. Open pull requests into `develop`.
10. Ask before changing repository visibility, the GitHub default branch, or the checkpoint history.

Recommended setup from a fresh clone:

```bash
git fetch origin
git switch develop
git pull --ff-only origin develop
git switch -c <focused-branch-name>
npm ci
npm run test:run
npm run dev
```

Completion criterion: the working branch is based on the current remote `develop`, dependencies install from the committed lockfile, and the existing tests pass before new behavior is introduced.

## 2. Original user goal

The user is preparing their first Codex webinar and is also relatively new to Codex. They want both a teachable live demonstration and enough supporting material to understand what they are presenting.

The explicit webinar requirements gathered across the conversation were:

- Topic: Codex Desktop.
- Audience: mixed developers, ranging from new to intermediate.
- Duration: 30–40 minutes.
- Format: mostly a live Codex demonstration.
- Environment: the Codex desktop app.
- Demo asset: a prepared sample repository.
- Starting level: basic enough to begin with model selection, but not a beginner-only product tour.
- Ending level: power-user workflows and the kinds of larger tasks Codex can own.
- Visual style: a small number of visual slides rather than a text-heavy deck.
- Model-selection visual concept: celestial imagery for the model family—Astra as a star or deep-space body, Sol as the sun, Terra as Earth, and Luna as the moon.
- Slide-production target: Claude Design was intended to generate the slides from a detailed prompt.
- Supporting materials requested: a full webinar flow, a complete speaker script, a guide/PDF for learning Codex, and a real prepared repository.

The agreed overall teaching idea was:

> Codex is most useful when you stop treating it as autocomplete and start treating it as a developer who can inspect a repository, use tools, test its work, and show you the evidence.

The desired audience takeaway was not a collection of product buttons. It was a repeatable working loop:

```text
Give context → inspect → plan → edit → test → verify → review → report evidence
```

## 3. Webinar concept and narrative

Working title:

> Codex Desktop: From First Prompt to Power-User Workflows

Planned content length: approximately 35 minutes, leaving up to 5 minutes for questions or live-demo recovery.

The session is built around one continuous story: take an unfamiliar but small task dashboard, understand it, add a real feature, verify the result, reproduce and fix a bug, review the changes, and explain how the same workflow expands into isolated worktrees and other power-user capabilities.

The attendee should leave able to:

1. Choose a sensible model and reasoning level.
2. Give Codex sufficient repository context and acceptance criteria.
3. distinguish Local, Worktree, Cloud, and Remote execution contexts.
4. Use Codex to explore, plan, implement, test, visually verify, debug, and review.
5. Recognize when project instructions, skills, plugins, subagents, and scheduled tasks become useful.

### Model-selection decision rule

The plan intentionally teaches a decision rule rather than model-name memorization:

| Work shape | Suggested starting point |
| --- | --- |
| Clear, repetitive, tightly scoped work | Luna with light reasoning |
| Everyday coding and repository work | Terra with medium reasoning |
| Ambiguous debugging or high-quality review | Sol with medium or high reasoning |
| Difficult end-to-end work involving several tools | Astra with high or max reasoning |
| Several genuinely independent workstreams | Ultra or explicitly requested subagents |

The agreed live-demo choice was **Terra with medium reasoning**, balancing speed and capability for a mixed audience. Model names, availability, and labels can change, so future slide work should verify current product terminology before presenting it as current fact.

The teaching line is:

> Increase reasoning because the problem is harder—not because the prompt is longer.

Do not run an Ultra/subagent demonstration live unless it has been rehearsed and timed. A prepared result or screenshot is more predictable.

### Execution contexts to teach

- **Local:** works directly in the current checkout; best for close, foreground collaboration.
- **Worktree:** creates an isolated checkout; best for parallel/background tasks that should not disturb Local.
- **Cloud:** runs from a hosted checkout/container with its own setup and network configuration.
- **Remote/SSH:** works against a configured project and tools on another machine.

The planned live coverage is Local plus a prepared Worktree task. Cloud and Remote should be explained rather than configured live.

## 4. Planned 35-minute run of show

| Time | Segment | Format | Intended outcome |
| --- | --- | --- | --- |
| 0:00–2:00 | Opening and before/after preview | Slide + app | Establish the story and outcome |
| 2:00–5:00 | Choosing a model | Visual slide + model picker | Give one memorable decision rule |
| 5:00–8:00 | Local, Worktree, Cloud, Remote | Codex app | Choose the right execution context |
| 8:00–12:00 | Explore an unfamiliar repository | Live demo | Show inspection before editing |
| 12:00–20:00 | Implement the At risk feature | Live demo | Demonstrate plan, edit, tests, evidence |
| 20:00–25:00 | Verify in the built-in browser | Live demo | Check behavior and annotate a visual issue |
| 25:00–29:00 | Diagnose and fix the due-date crash | Live demo | Show reproduction, root cause, regression test |
| 29:00–32:00 | Review and refine the diff | Review pane | Reduce duplication and address feedback |
| 32:00–35:00 | Power-user capability map | App + closing slide | Connect the workflow to larger Codex capabilities |
| 35:00–40:00 | Questions or overflow | Audience-led | Preserve recovery time |

The full set of copy-ready live prompts is already in [`docs/webinar-prompts.md`](webinar-prompts.md). Prefer copying those verbatim during the session rather than improvising.

## 5. Slide direction already chosen

The deck should remain intentionally small—approximately three slides—because the desktop app is the main visual surface.

### Slide 1: What Codex can own

Show a simple visual sequence:

```text
Understand → Change → Test → Verify → Review
```

This is the opening promise and the map for the live story.

### Slide 2: Model and execution-context cheat sheet

Use an original celestial system rather than four generic cards:

- **Luna:** moon; compact, fast, tightly scoped work.
- **Terra:** Earth; balanced everyday repository work; visually emphasized because it is used live.
- **Sol:** sun; harder debugging and higher-confidence review.
- **Astra:** star field or luminous deep-space body; complex, tool-heavy, end-to-end work.

Pair that model orbit with a second compact visual for Local, Worktree, Cloud, and Remote. Keep labels large enough to read during screen sharing. Avoid a dense feature matrix.

### Slide 3: Power-user ladder

Suggested visual progression:

```text
Clear prompt
    ↓
Project instructions
    ↓
Tools and browser verification
    ↓
Worktrees
    ↓
Subagents
    ↓
Reusable skills, plugins, and automations
```

The deck should use dark space tones with controlled color, large celestial illustrations, minimal copy, and restrained motion. Terra should be the most approachable/central object. The design must remain legible when streamed at 1080p.

A Claude Design prompt and a complete speaker script were drafted in the earlier conversation but were not committed into this repository. The high-level source text from that work is available locally at:

```text
/Users/cemmacabales/.codex/attachments/b0d0fc7a-5012-40c8-8319-b2ec54314285/pasted-text.txt
```

That attachment is machine-local and will not exist in a fresh GitHub clone. If the next task is slide or script production, use this handoff plus the run of show above as the durable source of truth, and ask the user for the earlier Claude prompt only if exact wording matters.

## 6. Supporting artifacts created outside this repository

Codex created the following local artifacts before creating the GitHub repository:

### Codex learning guide PDF

```text
/Users/cemmacabales/.codex/.chatgpt-projects/g-p-6aa5347956608191af2f928aaea48bec/output/pdf/codex-desktop-beginner-to-power-user-guide.pdf
```

This is a 16-page beginner-to-power-user guide produced for the presenter. It is not currently tracked in GitHub.

### Original repository build brief

```text
/Users/cemmacabales/.codex/.chatgpt-projects/g-p-6aa5347956608191af2f928aaea48bec/output/webinar-repo-creation.md
```

This was the source-of-truth implementation brief used to build SprintBoard. Its essential requirements and current status are captured in this handoff and the repository README. It is not currently tracked in GitHub.

### Managed Codex working copy

```text
/Users/cemmacabales/.codex/.chatgpt-projects/g-p-6aa5347956608191af2f928aaea48bec/output/sprintboard-webinar
```

The user also cloned the GitHub repository to:

```text
/Users/cemmacabales/sprintboard-webinar
```

Treat these as separate working copies. Changes in one do not automatically appear in the other; Git push/pull is the synchronization mechanism.

## 7. Why SprintBoard exists

SprintBoard is a teaching repository, not a production application. Every architectural decision prioritizes:

- fast installation;
- a small code surface Codex can explain in minutes;
- deterministic, visible changes;
- short test and build feedback loops;
- no account setup during the webinar;
- no credentials or private APIs;
- predictable checkpoint recovery;
- realistic enough code to demonstrate useful engineering behavior.

It is intentionally a React + TypeScript + Vite application with local mock data, Vitest, React Testing Library, and ESLint. It has no backend, database, authentication, analytics, state-management library, date library, or external API.

## 8. Current GitHub state

Repository:

```text
https://github.com/cemmacabales/sprintboard-webinar
```

Visibility: **private**.

The first implementation pull request was created and has been merged:

```text
PR #1: Build SprintBoard Codex webinar repository
https://github.com/cemmacabales/sprintboard-webinar/pull/1
Base: develop
Head: feature/webinar-sprintboard
State: merged
```

Current important branch state at handoff creation:

| Branch | Commit | Meaning |
| --- | --- | --- |
| `main` | `8ad5d90` | Empty initialization only; no `package.json` |
| `develop` | `ec793e1` | Merge commit containing the complete application from PR #1 |
| `feature/webinar-sprintboard` | `8a662f4` | Original linear completed implementation |
| `demo/start` | `aaa3cc7` | Starting app and deliberate crash; no At risk filter |
| `demo/feature-complete` | `4716ba1` | At risk feature complete; crash and visual spacing issue remain |
| `demo/bug-fixed` | `516e3a5` | Missing-date crash fixed; spacing issue remains |
| `demo/final` | `8a662f4` | Refactored final behavior and spacing fix |

The GitHub default branch is currently **`main`**. Since `main` contains only the empty initialization commit, a normal clone lands in a directory without `package.json`.

This produced the user's observed error:

```text
npm error code ENOENT
npm error path /Users/cemmacabales/sprintboard-webinar/package.json
npm error enoent Could not read package.json
```

This is a branch-state problem, not an npm installation problem. The immediate remedy is:

```bash
git fetch origin
git switch develop
npm ci
```

For webinar rehearsal, switch to the desired checkpoint instead:

```bash
git switch demo/start
# or
git switch demo/final
```

Do not change the GitHub default branch or merge `develop` into `main` without the user's explicit choice. Both are legitimate fixes but affect the repository's public landing behavior and future workflow.

## 9. Git history and checkpoint design

The application history is intentionally linear before the merge commit:

```text
8ad5d90  chore: initialize webinar repository
aaa3cc7  feat: prepare SprintBoard webinar starting state
4716ba1  feat: add at-risk task filtering
516e3a5  fix: handle tasks without due dates
8a662f4  refactor: finalize verified webinar example
ec793e1  Merge pull request #1 from feature/webinar-sprintboard
```

All authored commits use only:

```text
cemmacabales <carlmacabales31@gmail.com>
```

No AI agent or other co-author is present in commit metadata.

### Checkpoint invariants

Treat the `demo/*` branches as immutable. Their differences are teaching material.

#### `demo/start`

Contains:

- complete runnable starting application;
- All, Active, and Done filters;
- URL query synchronization;
- initial test/lint/build setup;
- deliberate missing-due-date runtime crash;
- no At risk feature or At risk tests.

Expected bug reproduction:

1. Run the app.
2. Find **Backfill release checklist** in Todo.
3. Open the task.
4. The details drawer throws because `formatDate` calls `.slice()` on `null`.
5. Reload to recover.

#### `demo/feature-complete`

Adds:

- the At risk filter;
- the matching count;
- URL synchronization and restoration for `filter=at-risk`;
- fixed-clock feature tests, including the exact seven-day boundary.

Still intentionally contains:

- the missing-due-date crash;
- a harmless narrow-width spacing problem on the active At risk control;
- duplicated date-window calculation that is cleaned up later.

#### `demo/bug-fixed`

Adds:

- a regression test for opening a task with no due date;
- the `No due date` fallback;
- a minimal null guard in the shared formatter.

Still intentionally leaves the narrow-width spacing issue for the browser-annotation step.

#### `demo/final`

Adds:

- reusable date-window logic in `src/lib/date.ts`;
- focused date utility tests;
- simplified At risk logic in `src/lib/filters.ts`;
- corrected narrow-width count spacing;
- final verified automated checks.

## 10. Application behavior

SprintBoard presents eight local development tasks in three columns:

- Todo
- In progress
- Done

Each task card includes:

- title;
- short description;
- owner initial and accessible owner label;
- priority;
- formatted due date or `No date` on the card.

Clicking a task opens a right-side details drawer containing the owner, priority, and due date. The final version renders `No due date` for a null due date.

The filter bar supports:

- `All`
- `Active`
- `Done`
- `At risk`

The selected filter is written to the URL as a `filter` query parameter. Valid filter values are restored on page load. Unknown/missing values fall back to `all`.

Examples:

```text
/?filter=all
/?filter=active
/?filter=done
/?filter=at-risk
```

The result summary announces the number of visible tasks through an `aria-live="polite"` region.

## 11. At risk feature definition

A task is at risk when all of the following are true:

1. Its status is not `done`.
2. It has a valid `YYYY-MM-DD` due date.
3. Its due date is today or later.
4. Its due date is no more than seven calendar days from today.

The date window is inclusive at both ends. A task due today qualifies; a task due exactly seven days from today also qualifies.

The feature safely excludes:

- completed tasks, even when due soon;
- overdue tasks;
- tasks due eight or more days away;
- `null` due dates;
- invalid date strings and impossible calendar dates.

With the supplied fixtures, exactly three tasks are at risk:

| Task | Status | Relative due date | Included? |
| --- | --- | ---: | --- |
| Stabilize billing webhook | In progress | Today | Yes |
| Audit signup flow | Todo | +2 days | Yes |
| Refresh incident handbook | Todo | +7 days | Yes |
| Simplify alert rules | In progress | +10 days | No |
| Polish onboarding copy | In progress | +14 days | No |
| Ship keyboard shortcuts | Done | +2 days | No |
| Close accessibility audit | Done | −1 day | No |
| Backfill release checklist | Todo | No date | No |

The source data uses `dateFromToday`, so the live app remains meaningful on any calendar date. Date boundary tests pin the clock to 12 September 2026.

## 12. Architecture and data flow

The application is deliberately shallow:

```text
src/data/tasks.ts
       │
       ▼
src/App.tsx ── reads/writes ?filter= through the browser URL API
       │
       ├── FilterBar ── shows filter counts and changes the selection
       │
       ├── filterTasks / isAtRisk
       │        └── isWithinNextDays / parseDateOnly
       │
       └── TaskBoard
             ├── TaskCard ── selects a task
             └── TaskDetails ── formats details and closes the drawer
```

### File responsibilities

| File | Responsibility |
| --- | --- |
| `src/main.tsx` | React entry point and global stylesheet import |
| `src/App.tsx` | Page composition, selected filter, selected task, URL state |
| `src/data/tasks.ts` | Eight local mock tasks with relative dates |
| `src/types/task.ts` | Task, status, and priority types |
| `src/lib/date.ts` | Date-only serialization, parsing, formatting, and inclusive date-window logic |
| `src/lib/filters.ts` | Filter type validation, At risk predicate, and task filtering |
| `src/components/FilterBar.tsx` | Filter buttons, counts, pressed state, user selection |
| `src/components/TaskBoard.tsx` | Status columns and empty state |
| `src/components/TaskCard.tsx` | Interactive task summary card |
| `src/components/TaskDetails.tsx` | Modal details drawer |
| `src/styles.css` | Entire visual system and responsive layout |
| `src/App.test.tsx` | Integration-style UI and URL behavior tests |
| `src/lib/filters.test.ts` | Fixed-clock At risk rule tests |
| `src/lib/date.test.ts` | Fixed-clock inclusive date-window tests |
| `src/test/setup.ts` | Testing Library matchers, cleanup, and URL reset |

### State model

`App` owns two local state values:

- `filter: TaskFilter`
- `selectedTask: Task | null`

There is no router and no global state library. `window.history.replaceState` keeps the current filter in the URL without navigation. `useMemo` derives the visible task list from the selected filter.

### Date model

All stored due dates are date-only local-calendar strings in `YYYY-MM-DD` form. The implementation constructs local-midnight `Date` objects instead of parsing with `new Date("YYYY-MM-DD")`, avoiding UTC-offset surprises for the webinar's Asia/Manila environment.

`parseDateOnly` also round-trips year/month/day to reject impossible values such as 30 February.

## 13. Visual design

The UI is a restrained editorial operations dashboard rather than a default component-library layout.

Important visual traits:

- warm off-white background;
- deep ink text;
- mint/green primary accent;
- coral, gold, and mint priority indicators;
- very large, tightly spaced SprintBoard wordmark;
- rounded release marker;
- pill-shaped filter controls;
- three-column desktop board;
- stacked single-column narrow layout;
- right-side details drawer;
- explicit focus-visible outlines;
- reduced-motion media query.

Responsive breakpoints:

- `860px`: hero and controls stack; board becomes one column.
- `520px`: reduced page padding and tighter filter layout.

Prepared visual issue:

- On `demo/feature-complete` and `demo/bug-fixed`, the active At risk count uses `margin-left: -4px` at the narrow breakpoint, making it feel crowded.
- On `demo/final`, this becomes `margin-left: 4px`.

The exact live annotation prompt is already in `docs/webinar-prompts.md`.

## 14. Accessibility choices

The repository intentionally demonstrates small but meaningful accessibility practices:

- filter controls are actual `<button>` elements;
- selected filters expose `aria-pressed`;
- the filter collection has `role="group"` and an accessible name;
- task-card buttons have names such as `Open Audit signup flow`;
- owner avatars have accessible owner labels;
- status columns are associated with headings;
- result count changes use `aria-live="polite"`;
- the details panel uses `role="dialog"`, `aria-modal="true"`, and an accessible name;
- keyboard focus has a visible outline;
- reduced-motion preferences are respected.

This is not a complete production modal implementation. Focus trapping, initial-focus management, Escape handling, and focus restoration were kept out of scope to preserve the small teaching surface. If added later, treat them as a separate accessibility feature with tests rather than silently expanding the webinar checkpoint code.

## 15. Test strategy and evidence

The work was implemented test-first where behavior changed.

### Starting checkpoint

Initial tests were written before the application implementation. The first run failed because `App` did not exist. A minimal stub was added, producing six expected behavior failures. The initial UI was then implemented until the six starting tests passed.

Starting coverage included:

- expected columns and representative tasks;
- Active behavior and URL update;
- Done behavior;
- URL restoration;
- opening a task with a valid due date;
- keyboard-reachable named filter buttons.

The null due-date task was intentionally not covered yet, preserving the prepared bug.

### At risk feature

Feature tests were added before implementation. The red run produced five expected failures:

- missing At risk control;
- missing URL restoration;
- missing fourth accessible button;
- missing `isAtRisk` behavior in two focused tests.

The implementation then made all feature tests pass.

### Bug fix

The regression test opened **Backfill release checklist** and failed with:

```text
TypeError: Cannot read properties of null (reading 'slice')
at formatDate src/lib/date.ts
at TaskDetails src/components/TaskDetails.tsx
```

The smallest safe fix added an early null return in `formatDate`. The regression test then passed and normal date formatting remained unchanged.

### Final refactor

Tests for `isWithinNextDays` were added before that helper existed. They failed as expected. The date-window calculation was then moved from `filters.ts` into `date.ts`, and `isAtRisk` was reduced to composition:

```ts
return task.status !== "done" && isWithinNextDays(task.dueDate, 7, now);
```

### Current final results

After a fresh dependency install:

```text
npm ci             passed; 0 vulnerabilities
npm run test:run   passed; 3 files, 13 tests
npm run lint       passed
npm run build      passed
```

The production build transformed 23 modules and emitted the Vite bundle successfully.

Run the same checks after future application changes:

```bash
npm ci
npm run test:run
npm run lint
npm run build
```

## 16. Package and toolchain state

The lockfile is committed and should remain authoritative. Current direct packages at creation time include:

- React 19.3
- React DOM 19.3
- Vite 8.3
- TypeScript 6.0
- Vitest 4.1
- React Testing Library 16.3
- ESLint 10.10
- jsdom 29.1

Use npm. Do not replace the package manager or regenerate the application with a template command. Avoid adding dependencies unless the user explicitly approves a need that the current platform cannot meet.

Available scripts:

```bash
npm run dev       # start Vite in watch mode
npm run test      # Vitest watch mode
npm run test:run  # one deterministic test run
npm run lint      # ESLint
npm run build     # TypeScript check plus Vite production build
```

## 17. Live-demo operating procedure

### Before the webinar

1. Clone or update the repository.
2. Switch to `demo/start`.
3. Run `npm ci`.
4. Run tests, lint, and build.
5. Start the development server.
6. Verify the valid task-details path.
7. Verify the deliberate crash once, then reload.
8. Open the prompt file for quick copying.
9. Open the desired Codex Local task.
10. Prepare a separate Worktree task in advance.
11. Disable notifications and hide unrelated repositories/tabs.
12. Keep `demo/feature-complete`, `demo/bug-fixed`, and `demo/final` ready as recovery points.

### Live feature request

The feature acceptance criteria are:

1. Label the new control `At risk`.
2. Include incomplete tasks due today through seven days from today.
3. Exclude completed tasks.
4. Exclude tasks due after the window.
5. Exclude missing/invalid dates safely.
6. Show the matching count.
7. Write `filter=at-risk` to the URL.
8. Restore the filter from the URL.
9. Preserve existing filters.
10. Keep keyboard and screen-reader behavior usable.
11. Test the exact seven-day boundary.
12. Use a fixed test clock.

### Live bug request

The intended debugging loop is:

```text
Reproduce → explain root cause → make the smallest fix → add regression test → rerun checks
```

The bug should be demonstrated only on `demo/start` or `demo/feature-complete`. It should not reproduce on `demo/bug-fixed` or `demo/final`.

### Recovery procedure

If a live step stalls, narrate the intended result and switch to the corresponding checkpoint:

```bash
git status
git switch demo/feature-complete
npm ci
```

Switching branches with uncommitted work can strand or overwrite the live attempt. Commit or stash only if the presenter wants to preserve it; otherwise use a disposable clone or prepared worktree for rehearsal.

## 18. Browser verification and screenshots

During repository creation, Vite successfully served the application at:

```text
http://127.0.0.1:5173/
```

The Codex in-app browser opened a tab whose title was `SprintBoard`. However, automated inspection and screenshot capture were blocked because the desktop browser's admin-enforced security policy could not be verified at that time. The security control was not bypassed.

Consequences:

- no fake screenshots were created;
- `docs/screenshots/start.png` is absent;
- `docs/screenshots/final.png` is absent;
- `docs/screenshots/README.md` contains exact manual capture instructions;
- the automated tests and production build are verified, but a human visual pass remains outstanding.

Required capture views:

1. `start.png`: `demo/start`, 1440 × 1000 content viewport, `/?filter=all`, no drawer open.
2. `final.png`: `demo/final`, 1440 × 1000 content viewport, `/?filter=at-risk`, no drawer open.

After capture:

1. Verify both images match the corresponding checkpoint.
2. Add the images on a new branch from `develop`.
3. Restore working screenshot links in the root README.
4. Run at least lint/build if no application code changed; run all checks if any code changed.
5. Open a pull request into `develop`.

Do not rewrite or force-update the existing `demo/*` branch hashes merely to add screenshots. Their behavior checkpoints are more important than embedding new documentation after the fact.

## 19. Existing documentation

Use these sources rather than duplicating their exact contents elsewhere:

- `README.md`: presenter-facing repository use, commands, checkpoint summary, known screenshot limitation.
- `AGENTS.md`: repository development, verification, and Git rules.
- `CLAUDE.md`: short Claude Code entry point and pointer to this document.
- `docs/webinar-prompts.md`: copy-ready live prompts.
- `docs/presenter-checklist.md`: operational rehearsal checklist.
- `docs/screenshots/README.md`: exact screenshot capture views.

If facts change, update the narrowest authoritative source and then update this handoff only when the changed fact affects continuation decisions.

## 20. Work completed by Codex

Codex performed the following work in this project:

1. Gathered the webinar audience, duration, format, platform, and demo-repository requirements.
2. Recommended a continuous live-demo story using a small React application.
3. Planned the 35-minute webinar flow and learning outcomes.
4. Defined the celestial visual metaphor for Astra, Sol, Terra, and Luna.
5. Recommended Terra with medium reasoning for the live demonstration.
6. Produced a Claude Design-oriented slide prompt and full speaker-flow material in the conversation.
7. Created a 16-page Codex Desktop learning guide PDF locally.
8. Wrote the detailed SprintBoard repository build brief.
9. Initialized a Git repository with `main`, `develop`, and a feature branch.
10. Built the React/TypeScript/Vite application from scratch.
11. Added local task fixtures, filters, URL state, a task board, and details drawer.
12. Added Vitest, React Testing Library, jsdom, ESLint, TypeScript checking, and Vite build configuration.
13. Used red-green-refactor cycles for the initial UI, At risk feature, due-date bug, and date utility extraction.
14. Created and verified four linear webinar checkpoint branches.
15. Added presenter instructions, copy-ready prompts, and a recovery checklist.
16. Attempted built-in-browser inspection and screenshot capture without bypassing the failed security check.
17. Created the private GitHub repository in the user's authenticated account.
18. Pushed `main`, `develop`, the feature branch, and all checkpoint branches.
19. Opened pull request #1 into `develop`; the user subsequently merged it.
20. Diagnosed the user's npm `ENOENT` as the result of cloning the empty default `main` branch.
21. Started this handoff on a fresh documentation branch from the merged `develop` branch.

## 21. Known limitations and deliberate non-goals

### Known limitations

- GitHub defaults to the empty `main` branch, which is confusing for a fresh clone.
- Start and final browser screenshots have not been captured.
- The full slide deck has not been produced in this repository.
- The earlier complete speaker script and Claude slide-generation prompt are not committed here.
- Visual browser QA was partially blocked by the desktop policy service.
- The modal drawer does not implement full production-grade focus management.

### Deliberate non-goals

- backend or persistence;
- authentication;
- external APIs;
- analytics;
- drag-and-drop board behavior;
- task editing or creation;
- production routing;
- a UI component framework;
- a date library;
- exhaustive end-to-end browser tests;
- production deployment.

Maintain these boundaries unless the user explicitly changes the webinar scope. New features can easily make the repository too large to explain inside the planned live segment.

## 22. Recommended next actions

Proceed in this order unless the user chooses otherwise.

### Priority 0: Resolve the default-branch experience

Ask the user to choose one of these policies:

1. Change the GitHub default branch to `develop`.
2. Merge `develop` into `main` and keep `main` as the default.
3. Keep the intentional empty `main` and prominently instruct presenters to switch branches.

Recommended for a normal reusable repository: merge the finished app into `main` and retain `develop` for ongoing work. Recommended for a tightly controlled webinar-only repository: make `demo/start` the presenter entry point but keep it out of the normal development flow. This decision should be explicit because it changes what every clone sees.

Completion criterion: a fresh clone has an intentional, documented landing branch and `npm ci` behavior is no longer surprising.

### Priority 0: Capture and verify screenshots

Follow `docs/screenshots/README.md`, commit the real images, and update README links.

Completion criterion: both PNG files exist, visually match their checkpoint branches, and render from the GitHub README.

### Priority 1: Consolidate the presentation package

Create tracked source files for:

- final Claude Design slide prompt;
- full speaker script;
- minute-by-minute run of show;
- fallback narration for checkpoint switching;
- presenter cue cards.

Recommended paths:

```text
docs/presentation/claude-design-prompt.md
docs/presentation/speaker-script.md
docs/presentation/run-of-show.md
docs/presentation/recovery-cues.md
```

Completion criterion: the presenter can run the webinar from the repository without relying on chat history.

### Priority 1: Produce the three-slide deck

Use the celestial design direction in section 5. Export both editable source and PDF. Verify at 16:9, 1080p screen-share scale.

Completion criterion: every slide is readable at normal webinar scale and each visual maps directly to a spoken segment.

### Priority 1: Rehearse the exact live path

Run one strict 30-minute rehearsal and one failure rehearsal using checkpoint recovery. Record a 60–90 second backup clip of the feature implementation.

Completion criterion: the core session finishes inside 35 minutes without Q&A, and a failed live generation can be recovered in under 30 seconds.

### Priority 2: Optional polish

Only after the presentation package is stable:

- rename the final test suite from “starting experience” to a neutral title on `develop`;
- consider Escape-to-close and focus restoration as a separate accessibility exercise;
- add a lightweight deployment only if the webinar needs a public preview URL;
- copy the learning PDF into a separate materials repository or release asset if the user wants attendees to download it.

Avoid polishing the app at the expense of rehearsing the teaching flow.

## 23. How Claude should handle future requests

### If asked to modify the app

1. Start from current `origin/develop`.
2. Create a new feature branch.
3. Preserve all `demo/*` branch pointers.
4. Add or update tests before behavior changes when practical.
5. Run all verification commands.
6. Visually verify when browser access is available.
7. Commit only under the user's Git identity.
8. Push and open a PR into `develop`.

### If asked to prepare the live demo

1. Do not change code automatically.
2. Verify branch hashes and behavior.
3. Verify the deliberate bug only where intended.
4. Confirm the final branch is clean.
5. Capture missing screenshots.
6. Make sure all prompts are open and copyable.
7. Report any divergence from this handoff before the webinar.

### If asked to create slides or script

1. Treat sections 2–5 as the creative brief.
2. Keep the deck to approximately three slides.
3. Preserve the mostly-live format.
4. Use the repository checkpoints as the actual visual story.
5. Verify current model/product terminology against official sources before finalizing.
6. Store final source material under `docs/presentation/`.

### If asked to fix the npm ENOENT

Explain the branch state first. Do not add a dummy `package.json` to `main`. Ask which default-branch policy the user wants, then implement that policy through the repository's PR workflow.

## 24. Final handoff checklist

Before claiming a continuation task is complete, confirm every applicable item:

- [ ] Read `AGENTS.md` and this handoff.
- [ ] Fetched the latest remote state.
- [ ] Started from `origin/develop`.
- [ ] Created a focused branch.
- [ ] Preserved checkpoint branches.
- [ ] Kept the app local-only unless scope changed.
- [ ] Added regression coverage for bug fixes.
- [ ] Ran tests, lint, and build.
- [ ] Performed browser verification when policy access allowed it.
- [ ] Used only the user's Git identity.
- [ ] Added no co-author trailers.
- [ ] Pushed the branch.
- [ ] Opened a pull request into `develop`.
- [ ] Reported exact results, URLs, and remaining limitations.

## 25. Concise state summary

The repository is a complete, tested, private SprintBoard demo application on `develop`, with four immutable webinar checkpoints and a merged implementation PR. The user encountered npm `ENOENT` because GitHub still defaults to an empty `main`. Real screenshots, the final slide deck, and tracked presentation scripts remain the principal unfinished artifacts. Continue from `develop`, preserve the checkpoints, follow the user's Git identity rules, and make the default-branch decision explicit before changing repository topology.
