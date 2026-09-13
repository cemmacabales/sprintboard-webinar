# Codex automations

The judgment half of the pipeline runs as scheduled automations in the Codex
app, on a ChatGPT plan. No API key is involved.

| Automation | Model | Reads | Writes |
| --- | --- | --- | --- |
| [Agent: implement](implement.md) | Terra, medium | issues labelled `agent-ready` | a branch, a pull request, labels |
| [Agent: review](review.md) | Terra, high | pull requests labelled `agent-pr` | a review comment, labels |
| [Nightly repository review](nightly-review.md) | Terra, medium | the whole repository | issues labelled `agent-filed` |

Paste each prompt into the automation exactly as written. Setup, sandbox
configuration, and troubleshooting are in
[`docs/presentation/automation-setup.md`](../presentation/automation-setup.md).

## The label state machine

```text
issue:  agent-ready ──claim──▶ agent-working ──PR opened──▶ (label removed)

PR:     agent-pr ──claim──▶ codex-reviewing ──┬──▶ codex-approved ──checks pass──▶ ready-to-merge ──▶ human merges
                                             └──▶ changes-requested
```

Every claim label exists so that two runs never pick up the same item. Every
automation releases its claim when it finishes, including when it fails.
