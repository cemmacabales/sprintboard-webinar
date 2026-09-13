#!/usr/bin/env python3
"""Build docs/presentation/live-script.pdf: the word-for-word script, every
command and prompt, and the recovery card for presenting "Nine Ways to Run an
Agent". This is the one document to keep open during rehearsal and the live
session.

Reuses the fonts, palette, and building blocks from build_setup_guide.py.
Rebuild (same scratch environment as the setup guide):

    /tmp/guidebuild/bin/python docs/presentation/guide-source/build_live_script.py
"""

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import build_setup_guide as g  # noqa: E402
from reportlab.lib.pagesizes import LETTER  # noqa: E402
from reportlab.platypus import (  # noqa: E402
    BaseDocTemplate, CondPageBreak, Frame, KeepTogether, NextPageTemplate, PageBreak, PageTemplate,
    Paragraph, Spacer, Table, TableStyle,
)
from reportlab.platypus.tableofcontents import TableOfContents  # noqa: E402

REPO = Path(__file__).resolve().parents[3]
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else REPO / "docs/presentation/live-script.pdf"

W, M, PW, PH = g.W, g.M, g.PW, g.PH
NAVY, INK, MUTED, FAINT, RULE, CARD = g.NAVY, g.INK, g.MUTED, g.FAINT, g.RULE, g.CARD
TERRA, TERRA_D, SOL, SOL_D, ASTRA, ASTRA_D, DANGER, DANGER_D = g.TERRA, g.TERRA_D, g.SOL, g.SOL_D, g.ASTRA, g.ASTRA_D, g.DANGER, g.DANGER_D
md, esc, hexs, style = g.md, g.esc, g.hexs, g.style

SAY_ST = style("say", fontName="Serif", fontSize=11.4, leading=16.2, textColor=NAVY)
CUE_ST = style("cue", fontSize=9.6, leading=13.6)
SEE_ST = style("see", fontName="Body-Italic", fontSize=9.3, leading=13, textColor=MUTED)
IFNOT_ST = style("ifnot", fontSize=8.9, leading=12.4, textColor=DANGER_D)
SMALL = style("smallx", fontSize=8.2, leading=11.5, textColor=MUTED, spaceAfter=6)

LABELS = {
    "say": ("SAY", NAVY),
    "do": ("DO", TERRA_D),
    "type": ("TYPE", TERRA_D),
    "paste": ("PASTE", ASTRA_D),
    "cloud": ("PASTE", ASTRA_D),
    "comment": ("COMMENT", NAVY),
    "click": ("CLICK", SOL_D),
    "see": ("SEE", g.LUNA_D),
    "ifnot": ("IF NOT", DANGER_D),
    "time": ("CLOCK", SOL_D),
}
LW = 56
CW = W - LW - 12


def stage(html):
    return re.sub(r"\[([^\]<>]+)\]", lambda m: f'<font color="{hexs(FAINT)}"><i>[{m.group(1)}]</i></font>', html)


def cue_cell(kind, content):
    if kind == "say":
        return [Paragraph(stage(md(p)), SAY_ST) for p in content.split("\n\n")]
    if kind == "type":
        return g.code(content, "shell", w=CW)
    if kind == "paste":
        return g.code(content, "prompt", w=CW)
    if kind == "cloud":
        return g.code(content, "cloud", w=CW)
    if kind == "comment":
        return g.code(content, "github", w=CW)
    if kind == "see":
        return Paragraph(md(content), SEE_ST)
    if kind == "ifnot":
        return Paragraph(md(content), IFNOT_ST)
    if kind == "time":
        return Paragraph(f'<b>{md(content)}</b>', style("tm", fontSize=9.6, leading=13, textColor=SOL_D))
    return Paragraph(md(content), CUE_ST)


def cues(*rows):
    data, cmds = [], [
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (0, -1), 0),
        ("LEFTPADDING", (1, 0), (1, -1), 6),
        ("RIGHTPADDING", (1, 0), (1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 4.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LINEBELOW", (0, 0), (-1, -1), 0.4, RULE),
    ]
    for i, (kind, content) in enumerate(rows):
        lab, color = LABELS[kind]
        data.append([Paragraph(f'<font color="{hexs(color)}">{lab}</font>', style("cl", fontName="Body-Bold", fontSize=7.4, leading=14)),
                     cue_cell(kind, content)])
        if kind == "say":
            cmds.append(("BACKGROUND", (1, i), (1, i), g.HexColor("#F7F8FC")))
            cmds.append(("LINEBEFORE", (1, i), (1, i), 2, NAVY))
        if kind == "ifnot":
            cmds.append(("BACKGROUND", (1, i), (1, i), g.DANGER_L))
        if kind == "time":
            cmds.append(("BACKGROUND", (1, i), (1, i), g.SOL_L))
    t = Table(data, colWidths=[LW, W - LW])
    t.setStyle(TableStyle(cmds))
    return [t, Spacer(1, 8)]


class SegmentHeader(g.Flowable):
    def __init__(self, clock, chip, title, screen, color):
        super().__init__()
        self.clock, self.chip, self.title, self.screen, self.color = clock, chip, title, screen, color
        self.toc_text = f"{clock}  ·  {chip} · {title}"
        self.toc_level = 0

    def wrap(self, aw, ah):
        return (aw, 62)

    def draw(self):
        c = self.canv
        c.setFillColor(NAVY)
        c.roundRect(0, 0, W, 62, 6, stroke=0, fill=1)
        c.setFillColor(self.color)
        c.roundRect(0, 0, 118, 62, 6, stroke=0, fill=1)
        c.rect(100, 0, 18, 62, stroke=0, fill=1)
        c.setFillColor(NAVY)
        c.setFont("Body-Bold", 7.5)
        c.drawString(12, 42, "CLOCK")
        c.setFont("Body-Bold", 15)
        c.drawString(12, 20, self.clock)
        c.setFillColor(self.color)
        c.setFont("Body-Bold", 8)
        c.drawString(132, 42, self.chip.upper())
        c.setFillColor(g.white)
        c.setFont("Serif-Bold", 17)
        c.drawString(132, 21, self.title)
        c.setFillColor(g.LUNA)
        c.setFont("Body", 8)
        c.drawRightString(W - 12, 8, "Screen: " + self.screen)


def segment(clock, chip, title, screen, color=TERRA):
    return [PageBreak(), SegmentHeader(clock, chip, title, screen, color), Spacer(1, 10)]


def sub(text):
    return [CondPageBreak(110), Paragraph(md(text), style("sub", fontName="Body-Bold", fontSize=10.5, leading=14, textColor=NAVY, spaceBefore=6, spaceAfter=4))]


P_ = {
    "d1s1": "Fix the crash that happens when a task has no due date. The bug is in src/lib/date.ts.",
    "d1s2": "Now make that fix, add a regression test for a task with no due date, and run npm run test:run.",
    "d1s2b": "Fix the crash that happens when a task has no due date in src/lib/date.ts, add a regression test for a task with no due date, and run npm run test:run.",
    "d1s3": "Run npm view react version and tell me the result.",
    "d2": "Without opening any files, list every instruction you were given for this repository and say which file each one came from.",
    "taskA": g.PROMPTS["taskA"],
    "taskB": g.PROMPTS["taskB"],
    "fast": g.PROMPTS["fast"],
}
RESET = "git reset --hard origin/demo/needs-work"
LIVE = "git fetch origin && git switch -C live origin/demo/needs-work && npm ci"


# ---------------------------------------------------------------------------
# Content
# ---------------------------------------------------------------------------


def front():
    s = [Spacer(1, 1), NextPageTemplate("body"), PageBreak()]
    s += [g.Anchor("How to use this script", 0),
          Paragraph("How to use this script", style("t", fontName="Serif-Bold", fontSize=24, leading=30, textColor=NAVY, spaceAfter=6))]
    s.append(Paragraph(md("Keep this open on a second screen for rehearsal and for the live session. Go top to bottom. Each segment starts on a new page with its clock time and the screen you should be on."), g.LEAD))
    legend = [
        ("say", "Read it out loud. [Brackets] are stage directions, not words."),
        ("do", "An action on your own screen."),
        ("type", "Type it in the terminal and press Enter."),
        ("paste", "Paste it into the open Codex session and press Enter."),
        ("cloud", "Paste it as a new task at chatgpt.com/codex."),
        ("click", "Something to click in the browser."),
        ("see", "What should appear. If it does, carry on."),
        ("ifnot", "What to do when it doesn't. Don't debug on stage."),
        ("time", "A clock checkpoint."),
    ]
    rows = [[Paragraph(f'<font color="{hexs(LABELS[k][1])}">{LABELS[k][0]}</font>', style("cl2", fontName="Body-Bold", fontSize=7.4, leading=12)), Paragraph(md(v), g.CELL)] for k, v in legend]
    t = Table(rows, colWidths=[LW, W - LW])
    t.setStyle(TableStyle([("LINEBELOW", (0, 0), (-1, -1), 0.4, RULE), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (0, -1), 0)]))
    s += [t, Spacer(1, 12)]
    s.append(Paragraph("The 40 minutes", g.H2))
    s.append(g.table(["Clock", "Slide", "Demo", "Screen"], [
        ["0:00–3:00", "1 · Nine ways to run an agent", "—", "Slides"],
        ["3:00–4:00", "—", "Demo 0 · green tests, broken app", "Terminal, localhost"],
        ["4:00–8:00", "2 · Sandbox × approval", "—", "Slides"],
        ["8:00–15:00", "—", "Demo 1 · sandbox and approvals", "Terminal"],
        ["15:00–18:00", "3 · AGENTS.md", "—", "Slides"],
        ["18:00–22:00", "—", "Demo 2 · discovery", "GitHub, terminal"],
        ["22:00–24:00", "4 · Where it runs", "—", "Slides"],
        ["24:00–31:00", "—", "Demo 3 · build the environment, Tasks A and B", "chatgpt.com/codex"],
        ["31:00–32:30", "5 · Review first, then pick a lane", "—", "Slides"],
        ["32:30–35:00", "—", "Demo 4 · review, fast lane, close", "GitHub, terminal"],
        ["35:00–40:00", "—", "Questions", "Slides"],
    ], [14, 30, 36, 20], size=8.6))
    s.append(Spacer(1, 6))
    s.append(Paragraph(md("**Hard checkpoints:** start Demo 1 by 8:30 · start Demo 3 by 24:30 · Task A decision at 32:30 · closing line by 35:00."), g.BODY))
    s += [PageBreak(), Paragraph("Contents", style("t2", fontName="Serif-Bold", fontSize=24, leading=30, textColor=NAVY, spaceAfter=10))]
    toc = TableOfContents()
    toc.levelStyles = [style("toc0x", fontName="Body-Bold", fontSize=10, leading=17, textColor=NAVY), style("toc1x", fontSize=8.8, leading=12.4, leftIndent=16)]
    toc.dotsMinLevel = 0
    s.append(toc)
    return s


def before():
    s = [PageBreak(), g.PartHeader("Before you go live", "Get the room ready",
         "Do this before every rehearsal and before the live session. Everything below is already set up once; these checks make sure it still is."), Spacer(1, 12)]
    s += sub("60 minutes before")
    s.append(g.checklist([
        ["Signed in, no API key", "`codex login status` → `Logged in using ChatGPT`"],
        ["Fresh demo branch", "`" + LIVE + "`"],
        ["Broken on purpose", "`npm run test:run` → `12 passed`"],
        ["No leftover live environment", "chatgpt.com/codex/settings/environments has **no** `sprintboard-live` (your backup environment stays)"],
        ["Backup PR ready", "github.com/cemmacabales/sprintboard-webinar/pull/8 is **Closed**, not merged, branch not deleted"],
        ["No open demo PRs", "`gh pr list --base demo/needs-work --state open` prints nothing"],
        ["Usage headroom", "chatgpt.com/codex/settings/usage · nothing heavy in the last 5 hours"],
        ["ChatGPT app not mid-update", "If it offers an update, postpone it"],
    ], widths=(4, 34, 62), header=("", "Check", "How")))
    s += sub("15 minutes before")
    s.append(g.checklist([
        ["Terminal tab 1", "`cd ~/sprintboard-webinar && clear` · prompt shows `git:(live)` · no Codex running"],
        ["Terminal tab 2", "`npm run dev` running · leave it"],
        ["Terminal text large", "Cmd and + until about 30 lines fill the window"],
        ["Deck", "PowerPoint, slide 1, presenter view on your second screen"],
        ["Do Not Disturb", "On. Chat apps quit."],
        ["Browser tabs, in this order", "see the table below"],
    ], widths=(4, 30, 66), header=("", "Check", "How")))
    s += sub("Browser tabs, left to right")
    s.append(g.table(["Tab", "Open this", "Used in"], [
        ["1", "http://localhost:5173", "Demo 0, Demo 1"],
        ["2", "https://github.com/cemmacabales/sprintboard-webinar/blob/main/AGENTS.md", "Demo 2"],
        ["3", "https://github.com/cemmacabales/sprintboard-webinar/blob/main/docs/presentation/examples/AGENTS.bloated.md", "Demo 2"],
        ["4", "https://chatgpt.com/codex/settings/environments", "Demo 3"],
        ["5", "https://chatgpt.com/codex", "Demo 3, Demo 4"],
        ["6", "https://github.com/cemmacabales/sprintboard-webinar/pull/8", "Demo 4 backup only"],
    ], [6, 76, 18], size=8.2))
    s.append(Spacer(1, 6))
    s.append(g.callout("warn", ["**Never merge anything into `demo/needs-work`.** Every pull request today is closed, never merged."]))
    return s


def seg_slide1():
    s = segment("0:00–3:00", "Slide 1", "Nine Ways to Run an Agent", "Slides", g.LUNA)
    s += cues(
        ("do", "Share your screen with **slide 1** showing."),
        ("say", "Hi everyone, and thanks for being here. I'm Cem. For the next forty minutes we're going to talk about Codex — but not about how to prompt it. We're going to talk about how to configure it."),
        ("say", "Here's my guess about most of you. You've installed Codex. You've asked it to fix a bug. And every time it wanted to run something, a prompt popped up and you clicked approve — probably without reading it very carefully. You've heard of AGENTS.md, but you've never checked whether Codex actually reads yours. And you're not totally sure when you'd use Codex in the cloud instead of on your laptop."),
        ("say", "If that's you, you're in the right place. Nobody here needs to have written a config file before."),
        ("say", "Most people use Codex as a chat box that happens to live in a terminal. Today is about the layer underneath that chat box: what the agent is allowed to touch, what it reads before it starts, and where the work actually runs."),
        ("say", "[Point at the four lines on the slide.] You'll leave with four things. A sandbox and approval default you can defend. An AGENTS.md that Codex actually reads. A rule for choosing between local and cloud. And a review habit for your own pull requests."),
        ("say", "Everything today is live, on a real repository, and it all runs on a regular ChatGPT plan — no API key anywhere. Let me show you the repository."),
        ("time", "Aim to be here by 3:00."),
    )
    return s


def seg_demo0():
    s = segment("3:00–4:00", "Demo 0", "Green tests, broken app", "Terminal tab 1, then browser tab 1", TERRA)
    s += cues(
        ("do", "Switch to **terminal tab 1**."),
        ("type", "npm run test:run"),
        ("say", "This is SprintBoard, a small React app for tracking release tasks. First, the tests."),
        ("see", "`Tests  12 passed (12)`"),
        ("say", "Twelve tests, all green. Lint passes, the build passes. By every automated measure, this repository is fine."),
        ("click", "Browser **tab 1** (localhost). Click the card **Backfill release checklist** in the Todo column."),
        ("see", "The whole page goes blank."),
        ("say", "And this is what happens when you open one task. The whole board is gone."),
        ("say", "Green tests, broken app. That's the repository we're about to hand to an agent. So the real question is: how much should it be allowed to touch?"),
        ("do", "**Reload the browser tab** so the board is back. Switch to **slide 2**."),
        ("ifnot", "Page doesn't go blank → in terminal tab 1 run `" + RESET + "`, reload, and move on. Tests show 13 → you're not on `live`; say “I'll show you the crash in a moment” and move on."),
    )
    return s


def seg_slide2():
    s = segment("4:00–8:00", "Slide 2", "Sandbox × approval", "Slides", g.LUNA)
    s += cues(
        ("say", "Every time Codex runs, two settings decide how much you have to babysit it. They sound similar, but they answer two completely different questions."),
        ("say", "[Point at the rows.] The rows are the sandbox. The sandbox answers: what can the agent touch? Read-only means it can look but not change anything. Workspace-write means it can edit files inside this project and run commands — but it can't reach the network or touch anything outside the folder. Danger-full-access means there is no boundary at all."),
        ("say", "[Point at the columns.] The columns are approval. Approval answers: when the agent wants to do something the sandbox doesn't allow, who decides? On-request means it asks you. Auto-review is the newest one: a second, reviewer agent decides for you, and only comes back to you for things that look unsafe. And never means nobody is asked — the action just fails, and the agent has to work with that."),
        ("say", "Here's the sentence I want you to remember. **Sandbox is blast radius. Approval is interruptions.** Let me say that again: sandbox is blast radius, approval is interruptions. They're independent."),
        ("say", "A tight sandbox with never is still safe — the agent just can't do much. A loose sandbox with never is the thing that ends up in an incident write-up."),
        ("say", "Three by three is nine combinations. Honestly, most of them aren't worth using. Three are. [Point at each highlighted cell.] Read-only plus never, for exploring a codebase you don't know yet — no prompts, no risk. Workspace-write plus on-request: the sane daily default. And workspace-write plus never, for long unattended runs — but only somewhere isolated, like a container or a cloud task."),
        ("say", "[Point at the red cell.] The one to avoid is down here: full access, and nobody asked. You'll hear it called yolo mode."),
        ("say", "The skill isn't memorising nine cells. It's choosing one on purpose."),
        ("say", "Two quick notes. If you read an older post that mentions an untrusted approval mode — that's deprecated; use on-request. And you don't need to restart Codex to change any of this. There's a slash command, slash permissions, that switches it mid-session. Let's see all of it live."),
        ("time", "Switch to terminal tab 1. Start Demo 1 by 8:30; if you're late, shorten the three-cells paragraph."),
    )
    return s


def seg_demo1():
    s = segment("8:00–15:00", "Demo 1", "Sandbox and approvals", "Terminal tab 1", TERRA)
    s += sub("Start: signed in with ChatGPT")
    s += cues(
        ("type", "codex login status"),
        ("see", "`Logged in using ChatGPT`"),
        ("say", "Quick check first: this is signed in with my ChatGPT account. No API key anywhere today."),
    )
    s += sub("Step 1 · Read-only, nobody asks")
    s += cues(
        ("type", "codex --sandbox read-only --ask-for-approval never"),
        ("say", "I'm starting Codex in the most locked-down useful mode: a read-only sandbox, and approval set to never. It can read everything, change nothing, and it won't ask me for anything."),
        ("see", "A box with **OpenAI Codex** and the model, then `› Ask Codex to do anything` at the bottom. Wait for it. Ignore any “update available” or “starting MCP servers” lines."),
        ("paste", P_["d1s1"]),
        ("say", "I'm asking it to fix the crash. Watch what happens when it tries."),
        ("see", "It reads `src/lib/date.ts`, explains the bug (the `value!` in `formatDate`), and says it can't make the edit because the sandbox is read-only. It does not ask you anything."),
        ("say", "It found the bug — that exclamation mark in formatDate tells TypeScript “trust me, this is never null”, and it is. But it can't write the fix, and because approval is never, it didn't ask me. It just told me. That's exactly what you want when you're exploring something you don't trust yet."),
        ("ifnot", "It asks you for approval → press Esc, say “it's asking because I mistyped the flag”, quit with Ctrl+C and retype the command."),
    )
    s += sub("Step 2 · Switch to “Ask for approval”")
    s += cues(
        ("type", "/permissions"),
        ("see", "A menu titled **Update Model Permissions**: `1. Ask for approval`, `2. Approve for me`, `3. Full Access`."),
        ("say", "Same session, no restart. Slash permissions."),
        ("do", "With **1. Ask for approval** highlighted, press **Enter**."),
        ("say", "Ask for approval is workspace-write with on-request. It can edit this project and run commands, and it asks me before it goes to the internet or outside this folder."),
        ("paste", P_["d1s2"]),
        ("say", "Now it can make the fix, add a test, and run the suite. And notice — it's not asking me for any of that. Everything it's doing stays inside the workspace."),
        ("see", "It edits `src/lib/date.ts`, adds a test, runs `npm run test:run`, and reports **13 passed**. No approval prompts."),
        ("say", "Thirteen tests now, including one that fails without the fix. No prompts. That's the boring eighty percent, handled."),
        ("click", "Optional, if it's quick: browser **tab 1**, click **Backfill release checklist**. It opens now. Say “and the board works.” Come back to the terminal."),
        ("ifnot", "`/permissions` isn't there → Ctrl+C, then type `codex --sandbox workspace-write --ask-for-approval on-request` and paste: “" + P_["d1s2b"] + "”"),
    )
    s += sub("Step 3 · Cross the line")
    s += cues(
        ("paste", P_["d1s3"]),
        ("say", "Now let me ask for something that needs the internet."),
        ("see", "An approval request asking to run `npm view react version` with network access."),
        ("say", "There it is. Checking the npm registry needs the network. The sandbox doesn't allow that, so it stops and asks me. This is the only interruption I've had so far — and it's the one that matters."),
        ("do", "Choose the option that **declines** (No / don't run)."),
        ("say", "I'll say no."),
        ("ifnot", "No prompt appears → say “it decided not to try; if it had, this is where it would ask me” and go to step 4."),
    )
    s += sub("Step 4 · Let an agent answer")
    s += cues(
        ("type", "/permissions"),
        ("say", "Now the newest column. [Point at option 2.] Approve for me hands that question to a reviewer agent. It only comes back to me for actions it thinks are unsafe. [Point at option 3.] And Full Access is the no-brakes row. We're not picking that one."),
        ("do", "Press **Down** once so **2. Approve for me** is highlighted, then **Enter**."),
        ("paste", P_["d1s3"]),
        ("see", "Usually: it runs without asking you and reports a React version number. Sometimes: the reviewer sends it back to you."),
        ("say", "[If it ran:] This time I wasn't asked. The reviewer decided that checking a package version is safe, so it went ahead. Same sandbox — a different someone answering."),
        ("say", "[If it asked you:] The reviewer wasn't sure, so it came back to me. That's the escalation you'd want. [Decline it.]"),
        ("say", "One combination to know by name and never run: danger-full-access with never. Some people call it yolo. No boundary, and nobody asked."),
    )
    s += sub("Reset")
    s += cues(
        ("do", "Quit Codex: **Ctrl+C** (press it again if Codex is still open)."),
        ("type", RESET),
        ("type", "git status --short"),
        ("say", "I'm putting the repository back to broken for the next demo."),
        ("see", "`HEAD is now at 386849b`, and `git status` prints nothing."),
        ("ifnot", "`git status` shows lines starting with `??` → type `git clean -fd`."),
        ("time", "Browser tab 1: reload. Switch to slide 3, by 15:00."),
    )
    return s


def seg_slide3():
    s = segment("15:00–18:00", "Slide 3", "AGENTS.md", "Slides", g.LUNA)
    s += cues(
        ("say", "Let's talk about the file the agent reads before it reads your prompt: AGENTS.md."),
        ("say", "It's plain Markdown, it lives in your repository, and Codex loads it automatically at the start of every session. Here's the part most people miss. Codex doesn't read just one AGENTS.md. It starts at the root of your git repository and walks down, folder by folder, to the folder you started Codex in. It picks up every AGENTS.md on that path and joins them, root first. So the files closer to where you started come later, and they win."),
        ("say", "[Point at “not loaded”.] The flip side: an AGENTS.md in a folder below where you started isn't loaded at all. Start Codex at the root, and the rules in src/components don't exist as far as it's concerned."),
        ("say", "That's the most common reason for “my AGENTS.md is being ignored.” So before you spend an hour rewording your instructions, check discovery. Is the file on the path from the root to where you started?"),
        ("say", "[Point at “Belongs”.] What goes in it. Exact commands — how to run the tests, the linter, the type check. The real commands, not “run the tests”. Conventions the code doesn't show you, like “we never use non-null assertions”. Folders to leave alone. And what done means here: tests pass, there's a regression test, the change stays small."),
        ("say", "[Point at “Doesn't”.] What doesn't belong: a copy of your README. Your whole style guide — your linter already enforces that. And instructions like “be careful”, which give the agent nothing it can actually check."),
        ("say", "Treat it like a prompt you refine over weeks, not documentation you write once and forget. Let me show you a good one, a bad one, and discovery in action."),
        ("do", "Switch to browser **tab 2**."),
    )
    return s


def seg_demo2():
    s = segment("18:00–22:00", "Demo 2", "AGENTS.md discovery", "Browser tabs 2–3, then terminal tab 1", TERRA)
    s += sub("A good one and a bad one")
    s += cues(
        ("click", "Browser **tab 2**: the root `AGENTS.md`. Scroll slowly."),
        ("say", "This is the AGENTS.md for SprintBoard. Commands. Conventions. What to leave alone. What done means. Even review rules, which we'll use later. It's short, and every line is something you could check."),
        ("click", "Browser **tab 3**: `AGENTS.bloated.md`. Scroll slowly."),
        ("say", "And this is the bad version. It retells the README. It pastes a style guide that ESLint already enforces. It tells the agent to run npm test — which starts watch mode and never exits. And it says “be careful”. No definition of done. It's longer, and it gets worse results. That surprises people."),
    )
    s += sub("From the repository root")
    s += cues(
        ("do", "Switch to **terminal tab 1**."),
        ("type", "codex"),
        ("say", "Now discovery. I'm starting Codex at the root of the repository."),
        ("see", "`› Ask Codex to do anything`"),
        ("paste", P_["d2"]),
        ("say", "I'm asking it to list its instructions without opening any files — because reading a file isn't the same as having it loaded."),
        ("see", "Rules from the root `AGENTS.md`: commands, conventions, leave alone, done means, git, review rules. **Nothing about components.** It may also mention general tool or plugin instructions; ignore those."),
        ("say", "Commands, conventions, what done means — all from the root AGENTS.md. Nothing about components."),
        ("ifnot", "It lists the component rules → say “it opened the file while exploring; reading a file isn't the same as loading it”, and carry on to the next step."),
    )
    s += sub("From src/components")
    s += cues(
        ("do", "Quit Codex: **Ctrl+C**."),
        ("type", "cd src/components && codex"),
        ("say", "Same repository. Same question. I'm just starting one folder deeper."),
        ("ifnot", "It asks “Do you trust the contents of this directory?” → choose **1. Yes, continue**."),
        ("paste", P_["d2"]),
        ("see", "The root rules **and** rules from `src/components/AGENTS.md`: named exports only, props type above the component, and the “Component rules loaded.” line."),
        ("say", "And now the component rules show up. Named exports only. Props type right above the component. Same repository, same question, different starting folder. When someone tells you their AGENTS.md is being ignored, this is the first thing to check."),
    )
    s += sub("Reset")
    s += cues(
        ("do", "Quit Codex: **Ctrl+C**."),
        ("type", "cd ../.."),
        ("do", "Switch to **slide 4**."),
        ("time", "Aim to be on slide 4 by 22:00."),
    )
    return s


def seg_slide4():
    s = segment("22:00–24:00", "Slide 4", "Where it runs", "Slides", g.LUNA)
    s += cues(
        ("say", "So far everything has run on my laptop. Codex actually runs in three places. [Point at each card.] The CLI and the desktop app run locally: you watch it work, on your machine. Cloud tasks run off your machine: they don't block your laptop, and you can run several at once. And the IDE extension puts the same agent in your editor."),
        ("say", "The judgment call is simple. Offload work that's well specified and slow. Keep work that needs your eyes, your local state, or fast back-and-forth. Drop it in the chat: what would you offload? [Pause three seconds. Read one answer if there is one.] Good answers are dependency bumps, backfilling tests, mechanical refactors across lots of files."),
        ("say", "[Point at the two phases.] The cloud has one idea that trips everyone up at least once. It works in two phases. First, the setup phase: your setup script runs, with internet access, and any secrets you've configured are available. Then the secrets are removed. Then the agent phase: your actual task runs — and by default it has no network at all. Environment variables are still there. Secrets aren't."),
        ("say", "So: install dependencies in setup, not in the task. If a cloud task ever fails with a strange network error, this is almost always why."),
        ("say", "Instead of just telling you, let me build an environment from scratch."),
        ("do", "Switch to browser **tab 4** (environments)."),
        ("time", "Start Demo 3 by 24:30. If you're late, skip the chat question."),
    )
    return s


def seg_demo3():
    s = segment("24:00–31:00", "Demo 3", "Build the environment, then two tasks", "Browser tabs 4 and 5", SOL)
    s += sub("Build the environment from scratch (24:00–26:30)")
    s += cues(
        ("click", "Tab 4, **chatgpt.com/codex/settings/environments** → **Create environment**."),
        ("say", "This is where cloud environments live. I'm creating a new one from nothing."),
        ("do", "If it asks for a name: `sprintboard-live`."),
        ("do", "**Repository:** choose `sprintboard-webinar`."),
        ("say", "Codex can see this repository because I connected GitHub and gave the Codex app access to just this one repository."),
        ("do", "**Default branch:** `demo/needs-work`."),
        ("say", "This is the branch it prepares and caches. Tasks can still pick other branches."),
        ("do", "**Package versions:** Node.js `22`."),
        ("say", "Same Node version our CI uses."),
        ("do", "**Setup script:** type `npm ci`."),
        ("say", "This is phase one. It runs with internet access, so this is where dependencies get installed."),
        ("do", "**Environment variables** and **Secrets:** leave empty."),
        ("say", "I don't need either. And secrets only exist during setup anyway."),
        ("do", "**Agent internet access:** leave it **Off**."),
        ("say", "Phase two. Off is the default, and I'm leaving it off. Remember that for Task B."),
        ("click", "**Create** / **Save**."),
        ("see", "The environment is saved and listed."),
        ("ifnot", "Creation fails or hangs for more than 30 seconds → say “I made one earlier with exactly these settings” and use your **backup environment** for both tasks."),
    )
    s += sub("Start Task A (about 26:30)")
    s += cues(
        ("click", "Browser **tab 5**, **chatgpt.com/codex**. Start a new task. Environment **sprintboard-live**, branch **demo/needs-work**."),
        ("cloud", P_["taskA"]),
        ("click", "Start the task. Leave it running."),
        ("say", "Task A is the same crash, as a cloud task: fix it, add the regression test, run the tests, lint, and build, and follow AGENTS.md. It takes a few minutes, and my laptop is free the whole time."),
    )
    s += sub("Start Task B (about 27:30)")
    s += cues(
        ("click", "Start another new task. Same environment, same branch."),
        ("cloud", P_["taskB"]),
        ("click", "Start the task."),
        ("say", "Task B is a trap, on purpose. It asks the agent to reach the npm registry."),
    )
    s += sub("While they run (27:30–29:30)")
    s += cues(
        ("say", "While those run, here's the part that matters on real projects. Your setup script installed everything with the internet on. Then the secrets went away. Then the agent started with no network. That's a feature: the agent can't leak anything or download something surprising while it works."),
        ("say", "The mistake to avoid is offloading work that secretly depends on something only your laptop has — like your local database. The cloud task can't see it, and you get a confident, wrong answer."),
        ("do", "If there's a question in the chat, take one now."),
    )
    s += sub("Task B result (about 29:30)")
    s += cues(
        ("click", "Open **Task B**."),
        ("see", "A network error: it couldn't reach the npm registry. No files changed."),
        ("say", "Network error. Task B didn't break. It's working exactly as configured: setup had internet, the agent doesn't."),
        ("ifnot", "It printed a version number → say “npm answered from the cache it filled during setup — the agent still has no network” and move on."),
        ("click", "Glance at **Task A**. Don't wait for it."),
        ("say", "Task A is still going. We'll come back to it right after the next slide."),
        ("do", "Switch to **slide 5**."),
        ("time", "On slide 5 by 31:00."),
    )
    return s


def seg_slide5():
    s = segment("31:00–32:30", "Slide 5", "Review first, then pick a lane", "Slides", g.LUNA)
    s += cues(
        ("say", "Last slide. Two habits."),
        ("say", "[Point at the left card.] First: review before a human sees your pull request. Codex can review pull requests on GitHub, and it follows the review rules in your AGENTS.md — the same file we just looked at. It can run automatically on every pull request, or when you comment at-codex review."),
        ("say", "But read what it says critically. Some findings will be wrong, and saying so is the skill. The failure mode is accepting every suggestion — that's how you get worse code with more confidence."),
        ("say", "[Point at the planets.] Second: pick a lane. Match the model to the task. Luna for mechanical stuff: renames, small edits. Terra for everyday repository work. Sol for debugging and real ambiguity. Astra for long, multi-tool work. A profile switches the model and its settings together, so you don't have to remember them. And check your model picker — what's available changes."),
        ("say", "Let's close the loop on Task A."),
        ("do", "Switch to browser **tab 5**."),
    )
    return s


def seg_demo4():
    s = segment("32:30–35:00", "Demo 4", "Review, the fast lane, and the close", "Browser tab 5 → GitHub → terminal", TERRA)
    s += sub("Decision at 32:30")
    s += cues(
        ("time", "Is Task A finished? **Yes** → path A. **No** → path B."),
        ("click", "**Path A:** open Task A. Scroll the diff."),
        ("say", "[Path A.] Here's the diff: a null check instead of the exclamation mark, and a new test that opens the task with no due date."),
        ("click", "**Path A:** create the pull request from the task (the same buttons you used in setup). On GitHub, check it says **into `demo/needs-work`**."),
        ("ifnot", "It says into `main` → click **Edit** next to the title, change the base to `demo/needs-work`."),
        ("click", "**Path B:** browser **tab 6** (pull request #8) → **Reopen pull request**."),
        ("say", "[Path B.] Task A is still finishing, so here's the exact same task from my rehearsal."),
    )
    s += sub("The review")
    s += cues(
        ("see", "The **CI** check running or green, and a Codex reaction on the pull request (eyes while it reviews, then a thumbs-up or comments)."),
        ("ifnot", "Nothing from Codex after about a minute → comment below."),
        ("comment", "@codex review"),
        ("say", "[If it left findings — read one out loud, then pick one:] I agree with this: it matches a blocking rule in our AGENTS.md. / I disagree: our review rules say to judge only the diff, and this isn't in the diff."),
        ("say", "[If it only left a thumbs-up:] No findings, just a thumbs-up. That's not Codex being lazy. The fix handles the null case, and it adds a test that fails without it — two of the blocking rules in our AGENTS.md."),
        ("say", "[Point at the green check.] And I'm not taking the agent's word that the tests pass. This check is CI running them."),
    )
    s += sub("The fast lane (only if the clock says 34:00 or earlier)")
    s += cues(
        ("do", "Switch to **terminal tab 1**."),
        ("type", "cat ~/.codex/fast.config.toml"),
        ("say", "A profile is just a small file: a model and a reasoning level."),
        ("type", "codex -p fast"),
        ("see", "The header shows the Luna model at low reasoning."),
        ("paste", P_["fast"]),
        ("say", "A mechanical rename, on the fast lane."),
        ("do", "When it finishes: **Ctrl+C**, then type `" + RESET + "`."),
    )
    s += sub("Close (by 35:00)")
    s += cues(
        ("do", "Switch to **slide 5**."),
        ("say", "Two failure modes to take home. Trusting an agent's own claim that the tests pass — point at CI instead. And one long thread doing four unrelated things. Every demo today started a fresh session, on purpose."),
        ("say", "So. Sandbox is blast radius. Approval is interruptions. Put your AGENTS.md where Codex will actually find it. Offload the slow, well-specified work, and install dependencies in setup. Review before anyone else sees your pull request."),
        ("say", "Configure the leash once, and the agent stops needing supervision for the boring eighty percent. Thank you. Let's take questions."),
    )
    return s


def seg_qa():
    s = segment("35:00–40:00", "Questions", "Answers you can give", "Slides (or whatever the question needs)", g.LUNA)
    s.append(g.table(["If they ask", "Say"], [
        ["Does this need an API key or credits?", "No. Everything today ran on a ChatGPT plan. The CLI is signed in with ChatGPT, and cloud tasks and pull request reviews are part of the plan."],
        ["What happened to “untrusted” mode?", "It's deprecated. Use on-request."],
        ["Can the agent have internet in the cloud?", "Yes — environments have limited and unrestricted options. It's off by default, and I'd keep it off unless a task truly needs it."],
        ["Where do profiles live?", "In `~/.codex/`, one file each, like `fast.config.toml`. You start one with `codex -p fast`."],
        ["Can I override AGENTS.md in one folder?", "Yes. In each folder Codex checks `AGENTS.override.md` first, then `AGENTS.md`."],
        ["Does @codex work on GitHub issues?", "Not on subscription plans right now. On pull requests, yes — that's what we used."],
        ["How much can I use it?", "Plans meter usage over a rolling five-hour window, and the CLI and cloud share it. Lighter models like Luna go much further."],
        ["Is the IDE extension different?", "It's the same agent, in your editor. The same sandbox, approval, and AGENTS.md rules apply."],
        ["Can Codex review my PRs automatically?", "Yes. Turn on Code review for the repository in Codex settings, then Automatic reviews."],
    ], [34, 66], first_bold=True, size=8.8))
    s += sub("If there are no questions")
    s += cues(
        ("do", "Pick one:"),
        ("comment", "@codex fix it"),
        ("say", "[On the pull request, only for a finding you agreed with.] Let's have it fix the one finding I agreed with."),
        ("do", "Or: walk through tab 3, the bloated AGENTS.md, line by line."),
        ("do", "Or: `codex -p deep` and ask it to explain the root cause of the crash. Reset afterwards with `" + RESET + "`."),
    )
    return s


def recovery():
    s = [PageBreak(), g.PartHeader("Recovery card", "When something goes wrong",
         "Don't debug on stage. Say the line, do the fix, move to the next step. Every recovery here takes under 30 seconds."), Spacer(1, 12)]
    s.append(g.table(["If this happens", "Do this", "Say"], [
        ["Codex stalls in a local demo", "Ctrl+C, then `" + RESET + "`, next step", "“Here's what it was about to do.”"],
        ["`zsh: command not found: codex`", "`source ~/.zshrc`", "—"],
        ["Page doesn't go blank in Demo 0", "`" + RESET + "`, reload the browser", "“Let me put the bug back.”"],
        ["Dev server died", "Terminal tab 2: `npm run dev`, use the printed localhost address", "—"],
        ["`/permissions` missing", "Ctrl+C, `codex --sandbox workspace-write --ask-for-approval on-request`, fallback prompt", "—"],
        ["No approval prompt in step 3", "Move on", "“If it had tried, this is where it would ask me.”"],
        ["Component rules show from the root", "Carry on to the src/components step", "“Reading a file isn't the same as loading it.”"],
        ["Trust prompt appears", "Choose **1. Yes, continue**", "—"],
        ["Environment creation fails", "Use your backup environment for both tasks", "“I made one earlier with exactly these settings.”"],
        ["Task B prints a version", "Move on", "“npm answered from its cache. The agent still has no network.”"],
        ["Task A not done at 32:30", "Tab 6 → **Reopen pull request** on #8", "“Here's the same task from my rehearsal.”"],
        ["PR targets `main`", "**Edit** → base `demo/needs-work`", "—"],
        ["No Codex review after a minute", "Comment `@codex review`; if still nothing, show #8", "—"],
        ["Usage limit reached", "Narrate the remaining steps; use #8", "“This is what it does next.”"],
        ["Running late", "Skip the fast lane; skip the chat question on slide 4", "—"],
    ], [30, 40, 30], size=8.4))
    return s


def after():
    s = [PageBreak(), g.PartHeader("After every run", "Reset for next time",
         "Do this after each rehearsal and after the live session, so the next run starts from the same place."), Spacer(1, 12)]
    s.append(g.checklist([
        ["Stop screen sharing", "—"],
        ["Close the live pull request **without merging**", "`gh pr list --base demo/needs-work --state open`, then close each one on GitHub. Never delete #8's branch."],
        ["If you reopened #8, close it again", "github.com/cemmacabales/sprintboard-webinar/pull/8 → **Close pull request**"],
        ["Delete the `sprintboard-live` environment", "chatgpt.com/codex/settings/environments. Keep your backup environment."],
        ["Archive Tasks A and B", "chatgpt.com/codex"],
        ["Stop the dev server", "Terminal tab 2: Ctrl+C"],
        ["Reset the demo branch", "`" + LIVE + "`"],
        ["Check it's broken again", "`npm run test:run` → 12 passed"],
    ], widths=(4, 42, 54), header=("", "Do", "How")))
    s.append(Spacer(1, 8))
    s.append(Paragraph(md("Rehearsals use your Plus allowance (never API credits). Leave at least 5 hours between a full rehearsal and the live session."), SMALL))
    return s


# ---------------------------------------------------------------------------
# Document
# ---------------------------------------------------------------------------


def draw_cover(c, doc):
    c.saveState()
    c.setFillColor(NAVY)
    c.rect(0, 0, PW, PH, stroke=0, fill=1)
    import random
    rnd = random.Random(4)
    for _ in range(170):
        c.setFillColor(g.white)
        c.setFillAlpha(rnd.uniform(0.1, 0.65))
        c.circle(rnd.uniform(0, PW), rnd.uniform(0, PH), rnd.uniform(0.3, 1.2), stroke=0, fill=1)
    c.setFillAlpha(1)
    c.setFillColor(TERRA)
    c.setFont("Body-Bold", 10)
    c.drawString(M, PH - 110, "THE LIVE SCRIPT")
    c.setFillColor(g.white)
    c.setFont("Serif-Bold", 42)
    c.drawString(M, PH - 164, "Nine Ways to")
    c.drawString(M, PH - 212, "Run an Agent")
    c.setFillColor(g.LUNA)
    c.setFont("Serif-Italic", 14)
    c.drawString(M, PH - 250, "Every word, command, and click, in order.")
    c.drawString(M, PH - 270, "Keep this open while you present.")
    y = 250
    for label, text, color in [
        ("SAY", "read it out loud", NAVY),
        ("TYPE · PASTE", "commands and prompts, exactly", TERRA),
        ("SEE · IF NOT", "what should appear, and the fix when it doesn't", SOL),
    ]:
        c.setFillColor(color if color != NAVY else g.LUNA)
        c.roundRect(M, y, 4, 26, 1, stroke=0, fill=1)
        c.setFillColor(g.white)
        c.setFont("Body-Bold", 11)
        c.drawString(M + 14, y + 14, label)
        c.setFillColor(g.LUNA)
        c.setFont("Body", 9.5)
        c.drawString(M + 14, y + 1, text)
        y -= 42
    c.setFillColor(FAINT)
    c.setFont("Body", 8)
    c.drawString(M, 60, "Presenter: Cem Macabales · Repository: cemmacabales/sprintboard-webinar · Runs on ChatGPT Plus, no API key")
    c.drawString(M, 47, "Checked against Codex CLI 0.154.0-alpha.6.2 on 13 September 2026 (the /permissions menu and profile header were seen live).")
    c.restoreState()


def draw_body(c, doc):
    c.saveState()
    c.setFillColor(TERRA)
    c.rect(M, PH - 37, 5, 5, stroke=0, fill=1)
    c.setFillColor(NAVY)
    c.setFont("Body-Bold", 7.3)
    c.drawString(M + 10, PH - 37, "NINE WAYS TO RUN AN AGENT")
    c.setFillColor(MUTED)
    c.setFont("Body", 7.3)
    c.drawString(M + 10 + g.pdfmetrics.stringWidth("NINE WAYS TO RUN AN AGENT", "Body-Bold", 7.3) + 6, PH - 37, "Live script")
    c.drawRightString(PW - M, PH - 37, doc.section)
    c.setStrokeColor(RULE)
    c.setLineWidth(0.6)
    c.line(M, PH - 44, PW - M, PH - 44)
    c.line(M, 42, PW - M, 42)
    c.drawString(M, 30, "Stuck? Recovery card at the back.")
    c.setFillColor(NAVY)
    c.setFont("Body-Bold", 8)
    c.drawRightString(PW - M, 30, str(doc.page))
    c.restoreState()


class ScriptDoc(g.GuideDoc):
    def __init__(self, path):
        BaseDocTemplate.__init__(
            self, path, pagesize=LETTER, leftMargin=M, rightMargin=M, topMargin=62, bottomMargin=58,
            title="Nine Ways to Run an Agent — Live script", author="Cem Macabales",
            subject="Word-for-word script, commands, and recovery card",
        )
        frame = Frame(M, 58, W, PH - 62 - 58, id="f", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
        self.addPageTemplates([PageTemplate("cover", [frame], onPage=draw_cover), PageTemplate("body", [frame], onPageEnd=draw_body)])
        self.section, self.seq = "", 0


def build():
    story = (front() + before() + seg_slide1() + seg_demo0() + seg_slide2() + seg_demo1() + seg_slide3() + seg_demo2()
             + seg_slide4() + seg_demo3() + seg_slide5() + seg_demo4() + seg_qa() + recovery() + after())
    doc = ScriptDoc(str(OUT))
    doc.multiBuild(story)
    if g.MISSING:
        print("WARNING: glyphs missing:", sorted(g.MISSING))
    print(f"wrote {OUT}")


if __name__ == "__main__":
    build()
