# Setup for "Nine Ways to Run an Agent"

Everything in this session runs on a **ChatGPT Plus** plan. No OpenAI API key
and no API credits are involved.

Do these once, then use [presenter-checklist.md](../presenter-checklist.md) on
the day.

---

## 1. Make `codex` available in your terminal

The ChatGPT desktop app ships the Codex CLI, already signed in with your
ChatGPT account. Point a shell alias at it so the terminal and the app use the
same version and the same login:

```bash
echo 'alias codex="/Applications/ChatGPT.app/Contents/Resources/codex"' >> ~/.zshrc && source ~/.zshrc
```

**Check:**

```bash
codex login status
```

Expected: `Logged in using ChatGPT`.

## 2. Install the model-lane profiles

Profiles are separate files in `~/.codex/`, layered on top of your normal
config and selected with `codex -p <name>`. From a checkout of `main`:

```bash
cp docs/presentation/demo-profiles/fast.config.toml docs/presentation/demo-profiles/deep.config.toml ~/.codex/
```

Open the model picker in the app and confirm the model names in those files
still exist. Availability changes.

## 3. Connect Codex cloud

Demo 3 and Demo 4 use Codex cloud. It is included with ChatGPT Plus.

### 3a. Connect GitHub

1. Go to **chatgpt.com/codex** and sign in.
2. Connect **GitHub** and install the Codex GitHub app.
3. Choose **Only select repositories** and pick **sprintboard-webinar**.

### 3b. Create the environment

Go to **chatgpt.com/codex/settings/environments** and create one:

| Field | Value |
| --- | --- |
| Repository | sprintboard-webinar |
| Default branch | `demo/needs-work` |
| Package versions | Node.js 22 |
| Setup script | `npm ci` |
| Agent internet access | **Off**, the default |

Leaving agent internet off is the point of Demo 3: the setup script can
install packages, the agent afterwards cannot reach the network.

### 3c. Turn on review

In **Codex settings → Code review**, enable **sprintboard-webinar**, then turn
on **Automatic reviews**. Codex reads the `## Code Review Rules` section of
`AGENTS.md`.

### 3d. Make a fallback pull request

Run Demo 3's Task A once in rehearsal, create its pull request against
`demo/needs-work`, and let the automatic review post. Then **close the pull
request without merging** and keep it. If the live task is slow, you reopen
this one.

Never merge into `demo/needs-work`. It has to stay broken.

## 4. Prepare the local demo checkout

```bash
git fetch origin && git switch -C live origin/demo/needs-work && npm ci
```

```bash
npm run dev
```

Use the **`localhost`** address Vite prints. `127.0.0.1` is not bound.

## 5. Things you do not need

- An OpenAI API key or credits.
- The `github-agent` permission profile from the earlier automation design.
  Don't add it: it sets `default_permissions` for every session and would
  muddy Demo 1, where the sandbox and approval settings are the whole lesson.

## Plan allowance

ChatGPT Plus meters Codex on a rolling 5-hour window with a weekly cap on top.
Published Plus ranges per 5-hour window: Terra 25–200, Sol 10–100, Luna
250–2,000, Astra 5–45. Cloud tasks run on Sol and cost more than local turns.

The live session uses roughly a dozen local turns, two cloud tasks, and one
review. Don't do a full rehearsal in the 5 hours before you go live.
