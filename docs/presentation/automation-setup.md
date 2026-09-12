# Setting up the agentic pipeline

This is the setup you demonstrate in the webinar. It takes about five minutes to
do from scratch on a repository that doesn't have it yet.

The loop it produces:

```text
issue ──label agent-ready──▶ Codex implements ──▶ verify ──▶ pull request
                                                                  │
                                                            Codex reviews
                                                                  │
                                                        label ready-to-merge
                                                                  │
                                                            human merges
```

---

## 1. Add the API key

**Settings → Secrets and variables → Actions → New repository secret**

| Name | Value |
| --- | --- |
| `OPENAI_API_KEY` | An OpenAI API key with Responses API access |

The action starts a Responses API proxy with this key and runs `codex exec`
behind it. Nothing else in the repository needs it.

> Rotate the key if you ever show it on screen. Never paste it into a prompt,
> an issue, or a workflow file.

## 2. Let Actions open pull requests

This is the step people miss, and the failure it causes is confusing —
`gh pr create` fails with a permissions error even though the workflow declares
`pull-requests: write`.

**Settings → Actions → General → Workflow permissions**

- Select **Read and write permissions**
- Tick **Allow GitHub Actions to create and approve pull requests**

## 3. Create the labels

```bash
gh label create agent-ready       --color 0E8A16 --description "Codex should pick this up and open a PR"
gh label create ready-to-merge    --color 1D76DB --description "Automated review passed; awaiting human merge"
gh label create changes-requested --color D93F0B --description "Automated review found blocking problems"
gh label create agent-filed       --color 5319E7 --description "Filed automatically by a Codex review run"
```

## 4. Add the workflows

Two files, already in this repository:

| File | Trigger | What it does |
| --- | --- | --- |
| [`.github/workflows/agent-ready.yml`](../../.github/workflows/agent-ready.yml) | Issue labeled `agent-ready` | Implements, verifies, opens a PR, reviews it, labels it |
| [`.github/workflows/codex-review.yml`](../../.github/workflows/codex-review.yml) | Pull request opened by a person | Reviews the diff and labels it |

### Why two files

A pull request created with `GITHUB_TOKEN` **does not raise `pull_request`
events.** GitHub blocks that to prevent workflows triggering themselves
forever. So the agent's own pull requests are reviewed by a second job inside
the same workflow run, and `codex-review.yml` exists for pull requests that
people open. `codex-review.yml` skips `agent/issue-*` branches so nothing gets
reviewed twice.

This is worth saying out loud during the webinar. It's the single most common
thing that breaks a homemade version of this pipeline.

### The parts worth pointing at on screen

```yaml
- uses: openai/codex-action@v1
  with:
    openai-api-key: ${{ secrets.OPENAI_API_KEY }}
    model: gpt-5.6-terra          # the same model you picked in the app
    effort: medium                # the same reasoning level
    permission-profile: ":workspace"
    safety-strategy: drop-sudo
```

- `permission-profile: ":workspace"` lets it write inside the checkout, nothing else.
- The review job uses `":read-only"` — a reviewer has no business editing.
- `safety-strategy: drop-sudo` drops elevated privileges irreversibly before Codex starts.
- `output-schema-file` forces the review to return structured JSON, which is
  what makes the labelling decision mechanical instead of a guess about prose.

## 5. Security notes worth saying out loud

- **Only collaborators can start a run.** Applying a label needs write access,
  so a public repository is safe here even though anyone can open an issue.
- **The issue body is untrusted.** The workflow writes it to a file and tells
  Codex to treat everything after the marker as data. It never interpolates the
  body into the prompt string. `AGENTS.md` repeats the rule.
- **The agent can't edit its own guardrails.** `AGENTS.md` forbids touching
  `.github/`.

---

## 6. The scheduled review

This is a **Codex automation in the desktop app**, not a GitHub Actions cron.
That matters for the demo: automations have a **Run now** button, so you can
fire tonight's run during the session.

Create it in the Codex app:

| Field | Value |
| --- | --- |
| Name | `Nightly repository review` |
| Schedule | Daily |
| Repository | `sprintboard-webinar` on `main` |
| Model | Sol, high effort |

Prompt:

```text
Review this repository for correctness, accessibility, and maintainability
problems. Do not change any code.

For each genuine problem you find, check whether an open issue already covers
it. If not, open one with `gh issue create`, labelled `agent-filed`, containing
reproduction steps and acceptance criteria.

If you find nothing worth filing, say so and open nothing.
```

Test it once before the session so the first live run isn't the first run ever.

> **Actions alternative.** If you'd rather run this in CI, the same prompt works
> in a workflow on `schedule: - cron: "0 3 * * *"`. Note that scheduled
> workflows only run on the **default branch**, which is why `main` holds the
> real application in this repository.

---

## Cost and time

Each `agent-ready` run is two Codex invocations — one implementation at Terra
medium, one review at Sol high. On a repository this size that lands around
three to six minutes of wall clock. Budget for the high end when you plan the
live timing, and structure the session so you are never watching it.
