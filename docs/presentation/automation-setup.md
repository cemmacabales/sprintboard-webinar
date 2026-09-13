# Setting up the agentic pipeline on a ChatGPT plan

This pipeline runs on **ChatGPT Plus**. It needs no OpenAI API key and no
credits. GitHub Actions is free for public repositories.

```text
you label an issue agent-ready
        │
        ├─▶ GitHub Actions · Agent queue ········ comments "Queued for Codex" within seconds
        │
        ▼
Codex app · Agent: implement ········· claims it (agent-working), branches, fixes,
        │                              tests, pushes, opens a PR labelled agent-pr
        ▼
Codex app · Agent: review ············ claims it (codex-reviewing), reads the diff
        │                              against AGENTS.md, comments, labels
        │                              codex-approved or changes-requested
        ▼
GitHub Actions · PR gate ············· runs test, lint, build; if they pass and the
        │                              PR is codex-approved → ready-to-merge
        ▼
a human merges
```

**The split to explain on stage:** GitHub Actions does the deterministic parts
— reacting instantly, running checks, applying the final label. Codex does the
judgment parts — writing the fix and deciding whether it's any good.

---

## Why it's built this way

Three constraints, all verified on 13 September 2026:

1. **The Codex GitHub Action needs an API key.** API usage is billed separately
   from ChatGPT Plus.
2. **ChatGPT-plan auth in CI is off-limits here.** OpenAI documents it only for
   trusted private automation and says: *"Do not use this workflow for public or
   open-source repositories."*
3. **Codex automations can't be triggered by GitHub events yet.** They run on a
   schedule or on demand
   ([openai/codex#24864](https://github.com/openai/codex/issues/24864) requests
   event triggers).

So the label is the trigger, and the automation polls for it. On stage you
press **Run now** so nobody waits for the next tick.

**What you give up:** it isn't instant — pickup happens on the next scheduled
run — and your Mac must be awake with the Codex app open. For a live session,
that's fine.

---

## 1. Merge the workflows to `main`

Workflows triggered by issue events only run from the **default branch**. Merge
the pull request that adds `.github/workflows/agent-queue.yml` and
`.github/workflows/pr-gate.yml`.

`pr-gate.yml` must also exist on every branch pull requests target. It is
already on `demo/needs-work`.

**Check:** both files are visible on `main` on GitHub.

## 2. Labels

Already created. To recreate them on another repository:

```bash
gh label create agent-ready       --color 0E8A16 --description "Codex should pick this up"
gh label create agent-working     --color FBCA04 --description "Codex has claimed this issue"
gh label create agent-pr          --color 1F6FEB --description "Pull request opened by the implement automation"
gh label create codex-reviewing   --color BFD4F2 --description "Codex review automation is reading this pull request"
gh label create codex-approved    --color 2EA043 --description "Codex review found no blocking problems"
gh label create changes-requested --color D93F0B --description "Codex review found blocking problems"
gh label create ready-to-merge    --color 1D76DB --description "Checks passed and Codex approved; awaiting human merge"
gh label create agent-filed       --color 5319E7 --description "Filed by the nightly Codex review"
```

## 3. The base branch variable

Automations read which branch to work against from a repository variable.
During the webinar it points at the broken state:

```bash
gh variable set DEMO_BASE_BRANCH --body demo/needs-work --repo cemmacabales/sprintboard-webinar
```

Delete it afterwards and the agents work against `main`.

## 4. Give Codex's sandbox access to GitHub and npm

**Without this, every automation fails.** Codex runs shell commands in a
sandbox that blocks the network by default, and an unattended automation has no
one to approve a network request.

Add this to `~/.codex/config.toml`, then fully quit and reopen the app:

```toml
default_permissions = "github-agent"

[features]
network_proxy = true

[permissions.github-agent]
extends = ":workspace"

[permissions.github-agent.filesystem]
"/Users/cemmacabales/.npm" = "write"

[permissions.github-agent.network]
enabled = true

[permissions.github-agent.network.domains]
"github.com" = "allow"
"api.github.com" = "allow"
"*.github.com" = "allow"
"*.githubusercontent.com" = "allow"
"registry.npmjs.org" = "allow"
```

What each part does:

| Part | Why |
| --- | --- |
| `extends = ":workspace"` | Keeps the normal protection: writes only inside the repository and temp directories |
| `network.enabled` + `domains` | Network on, but **only** to GitHub and the npm registry |
| `.npm` write rule | `npm ci` writes its cache to `~/.npm`, which is outside the workspace |
| `network_proxy = true` | Enforces the domain list |

This exact configuration was tested against the sandbox binary bundled with the
ChatGPT desktop app (Codex CLI 0.153.4):

| Test | Result |
| --- | --- |
| `gh api user` using your Keychain login | ✅ passes |
| `git push --dry-run` using your Keychain login | ✅ passes |
| `npm view react version` | ✅ passes |
| `curl https://example.com` | ❌ blocked, as intended |
| Writing to your home directory | ❌ blocked, as intended |

**Trade-off:** `default_permissions` applies to every Codex session on this Mac,
not only automations. Interactive chats can also reach GitHub and npm without
asking. Everything else stays blocked. Remove the block after the webinar if you
prefer the stricter default.

Your existing `model` and `model_reasoning_effort` lines stay as they are.

## 5. Create the three automations

In the Codex app, create each automation with the settings and prompt from its
file. Paste the prompts exactly.

| Automation | File |
| --- | --- |
| Agent: implement | [`docs/automations/implement.md`](../automations/implement.md) |
| Agent: review | [`docs/automations/review.md`](../automations/review.md) |
| Nightly repository review | [`docs/automations/nightly-review.md`](../automations/nightly-review.md) |

For all three:

- Choose **SprintBoard** as the project and **a dedicated worktree** so they
  never touch your live checkout.
- Set the model and reasoning from the file.

**Schedules:** set the two agents to the shortest interval the app offers (5
minutes is a good target) for rehearsal and the session, and pause them the
rest of the time. Every scheduled run uses plan allowance even when it finds
nothing to do.

## 6. Rehearse one full cycle

1. File a test issue:
   ```bash
   gh issue create --repo cemmacabales/sprintboard-webinar --title "Opening a task with no due date crashes the app" --body "Open 'Backfill release checklist'. The whole board white-screens with TypeError: Cannot read properties of null (reading 'slice'). Expected: the details panel shows 'No due date'. Add a regression test."
   ```
2. Label it `agent-ready`. Within seconds, **Agent queue** comments on it.
3. In the Codex app, press **Run now** on **Agent: implement**. The label turns
   `agent-working`, and a few minutes later a pull request labelled `agent-pr`
   appears.
4. Press **Run now** on **Agent: review**. The pull request gets
   `codex-reviewing`, then a review comment and `codex-approved` or
   `changes-requested`.
5. **PR gate** runs. If the checks pass and it's `codex-approved`, it adds
   `ready-to-merge`.
6. **Don't merge the rehearsal pull request** — that would fix the crash on the
   demo branch. Close it and keep it as your fallback. Close the test issue.

Time each stage. That's your real number for the run of show.

### Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| No "Queued for Codex" comment | Workflows not on `main`, or label misspelled | Step 1 |
| Automation says `error connecting to api.github.com` | Sandbox has no network | Step 4, then restart the app |
| `npm error code EPERM` on `~/.npm` | Missing `.npm` write rule | Step 4 |
| Automation replies "No agent-ready issues" | Label not applied, or already claimed | Check the issue's labels |
| Issue stuck on `agent-working` | A run failed without releasing the claim | Read its automation chat; remove the label by hand |
| PR gate never adds `ready-to-merge` | Checks failed, or PR isn't `codex-approved` | Read the gate's job summary |
| Gate job fails with `403` | Actions token can't edit labels | **Settings → Actions → General → Workflow permissions → Read and write** |

There is a known desktop bug where automations ignore the app's own sandbox
setting and fall back to `config.toml`
([openai/codex#15310](https://github.com/openai/codex/issues/15310)). That's
why step 4 configures `config.toml` directly rather than an app setting.

## 7. Plan allowance

ChatGPT Plus meters Codex on a rolling 5-hour window with a weekly cap on top.
Published Plus ranges per 5-hour window: **Terra 25–200**, **Sol 10–100**,
**Luna 250–2,000**, **Astra 5–45**. Heavier tasks count for more.

Your live demo, the automations, and any rehearsal all draw from the same
allowance. So:

- Every automation uses **Terra**, not Sol.
- Pause the 5-minute schedules outside rehearsal and the session.
- Don't do a full rehearsal in the 5 hours before you go live.
- Check your usage meter in the app before starting.

## 8. Security, worth saying out loud

- **Only collaborators can start work.** Applying a label needs write access,
  even on a public repository.
- **Issue and pull request text is untrusted.** Every prompt says so, and so does
  `AGENTS.md`.
- **The sandbox is narrow.** Writes only in the workspace, network only to GitHub
  and npm.
- **The reviewer can't merge and the implementer can't approve.** The final merge
  is always a human.
- **Nothing secret lives in the repository or in Actions.** Codex uses your
  ChatGPT login on your own machine; GitHub uses the `gh` login already in your
  Keychain.

## Optional: Codex review on GitHub itself

ChatGPT plans also include Codex code review directly on GitHub: connect the
repository in Codex cloud, turn on **Code review**, and comment `@codex review`
on a pull request. It reads the same Code Review Rules from `AGENTS.md`.

Leave **Automatic reviews** off for this repository, or every agent pull request
gets reviewed twice. A manual `@codex review` makes a good overflow beat. Cloud
reviews run on Sol and draw more allowance than local runs.
