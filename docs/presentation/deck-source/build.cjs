// Generates docs/presentation/nine-ways-to-run-an-agent.pptx: five light,
// minimalist slides for "Nine Ways to Run an Agent", with speaker notes that
// follow docs/presentation/live-script.pdf. Presented from Google Slides.
//
// CommonJS on purpose: the repository's package.json sets "type": "module".
// See README.md in this folder for how to rebuild.

const pptxgen = require("pptxgenjs");
const OUT = process.argv[2] || "nine-ways-to-run-an-agent.pptx";
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = "Nine Ways to Run an Agent";
pres.author = "Cem Macabales";

const W = 13.333;
const X = 0.8;
const R = W - 0.8;
const C = {
  bg: "F7F6F2", ink: "15171F", muted: "6B6F80", faint: "A3A6B3", rule: "DEDCD5",
  accent: "1F8A67", accentSoft: "E3F1EA", danger: "C0453A", dangerSoft: "F7E6E2",
  luna: "B6C0D6", terra: "3FB68C", sol: "F2A93B", astra: "8E74E8",
};
const F = { head: "Inter", body: "Inter", mono: "JetBrains Mono" };
const NONE = { type: "none" };

function t(slide, text, o) {
  slide.addText(text, Object.assign({ fontFace: F.body, color: C.ink, margin: 0, isTextBox: true, valign: "top", fit: "none" }, o));
}
function rule(slide, x, y, w, color = C.rule, width = 0.75) {
  slide.addShape(pres.shapes.LINE, { x, y, w, h: 0, line: { color, width } });
}
function dot(slide, cx, cy, d, fill, line) {
  slide.addShape(pres.shapes.OVAL, { x: cx - d / 2, y: cy - d / 2, w: d, h: d, fill: fill ? { color: fill } : { type: "none" }, line: line ? { color: line, width: 1.25 } : NONE });
}
function base(n, kicker, title, sub, next) {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  if (kicker) t(s, kicker, { x: X, y: 0.62, w: 9, h: 0.3, fontSize: 12, bold: true, color: C.accent, charSpacing: 2 });
  if (title) t(s, title, { x: X, y: 0.98, w: R - X, h: 0.8, fontFace: F.head, fontSize: 38, bold: true });
  if (sub) t(s, sub, { x: X, y: 1.8, w: R - X, h: 0.45, fontSize: 18, color: C.muted });
  t(s, String(n).padStart(2, "0") + " / 05", { x: X, y: 6.98, w: 2, h: 0.3, fontSize: 11, color: C.faint });
  if (next) {
    s.addText([
      { text: "Next  ", options: { color: C.faint } },
      { text: "live demo · " + next, options: { color: C.muted } },
    ], { x: R - 5, y: 6.98, w: 5, h: 0.3, fontFace: F.body, fontSize: 11, align: "right", margin: 0, isTextBox: true });
  }
  return s;
}

// ---------------------------------------------------------------- Slide 1
{
  const s = base(1, "CODEX · A 40-MINUTE GUIDE", null, null, "the stakes");
  t(s, "Nine Ways to\nRun an Agent", { x: X, y: 1.15, w: 7.2, h: 2.0, fontFace: F.head, fontSize: 56, bold: true, lineSpacingMultiple: 0.95 });
  t(s, "You've run Codex. You haven't configured it.", { x: X, y: 3.3, w: 7.2, h: 0.5, fontSize: 22, color: C.muted });
  rule(s, X, 4.15, 6.4);
  t(s, "YOU'LL LEAVE WITH", { x: X, y: 4.38, w: 6, h: 0.3, fontSize: 11, bold: true, color: C.faint, charSpacing: 2 });
  [
    "A sandbox and approval default you can defend",
    "An AGENTS.md that Codex actually reads",
    "A rule for choosing local or cloud",
    "A review habit for your own pull requests",
  ].forEach((line, i) => {
    const y = 4.78 + i * 0.47;
    dot(s, X + 0.07, y + 0.17, 0.1, C.accent);
    t(s, line, { x: X + 0.32, y, w: 6.5, h: 0.4, fontSize: 18 });
  });
  const cx = 10.25, cy = 3.55, gap = 0.95, d = 0.46;
  const lit = { "0,2": "soft", "1,0": "solid", "1,2": "soft", "2,2": "danger" };
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    const k = lit[`${r},${c}`], x = cx + (c - 1) * gap, y = cy + (r - 1) * gap;
    if (k === "solid") dot(s, x, y, d, C.accent);
    else if (k === "soft") dot(s, x, y, d, C.accentSoft, C.accent);
    else if (k === "danger") dot(s, x, y, d, C.dangerSoft, C.danger);
    else dot(s, x, y, d, null, C.rule);
  }
  t(s, "sandbox × approval", { x: cx - 1.5, y: cy + 1.6, w: 3, h: 0.3, fontSize: 12, color: C.faint, align: "center" });
  s.addNotes(
    "0:00–3:00 · Full script: docs/presentation/live-script.pdf\n\n" +
    "Open: you've run Codex, you haven't configured it. Today is the layer underneath the chat box: what the agent may touch, what it reads first, where the work runs.\n\n" +
    "Point at the four lines and read them. Everything is live, on a ChatGPT plan, no API key.\n\n" +
    "DEMO 0 (3:00–4:00): terminal tab 1, npm run test:run → 12 passed. Browser tab 1, click Backfill release checklist → blank page. 'Green tests, broken app. How much should it be allowed to touch?' Reload."
  );
}

// ---------------------------------------------------------------- Slide 2
{
  const s = base(2, "SANDBOX × APPROVAL", "Nine combinations. Three you'll use.", "Sandbox is blast radius. Approval is interruptions.", "sandbox and approvals");
  const colX = [3.55, 6.55, 9.55], colW = 2.95, rowY = [3.55, 4.5, 5.45], rowH = 0.85;
  t(s, "SANDBOX ↓   APPROVAL →", { x: X, y: 2.95, w: 2.6, h: 0.3, fontSize: 10, bold: true, color: C.faint, charSpacing: 1 });
  [["on-request", "you answer"], ["auto-review", "a reviewer agent answers · new"], ["never", "nobody is asked"]].forEach(([k, v], i) => {
    t(s, k, { x: colX[i] + 0.15, y: 2.72, w: colW - 0.3, h: 0.35, fontFace: F.mono, fontSize: 16, bold: true });
    t(s, v, { x: colX[i] + 0.15, y: 3.08, w: colW - 0.3, h: 0.3, fontSize: 12, color: C.muted });
  });
  [["read-only", "look, don't touch"], ["workspace-write", "edit inside the project"], ["danger-full-access", "no boundary at all"]].forEach(([k, v], i) => {
    rule(s, X, rowY[i] - 0.05, R - X);
    t(s, k, { x: X, y: rowY[i] + 0.16, w: 2.7, h: 0.35, fontFace: F.mono, fontSize: 15, bold: true, color: i === 2 ? C.danger : C.ink });
    t(s, v, { x: X, y: rowY[i] + 0.5, w: 2.7, h: 0.3, fontSize: 12, color: C.muted });
  });
  rule(s, X, rowY[2] + rowH + 0.05, R - X);
  const cells = [
    [0, 2, "soft", "Explore a codebase", "no prompts, no risk"],
    [1, 0, "solid", "Daily default", "the sane starting point"],
    [1, 2, "soft", "Unattended runs", "only when isolated"],
    [2, 2, "danger", "No brakes", "the one to avoid"],
  ];
  cells.forEach(([r, c, style, title, sub]) => {
    const x = colX[c] + 0.05, y = rowY[r] + 0.04, w = colW - 0.1, h = rowH - 0.08;
    const fill = style === "solid" ? C.accent : style === "soft" ? C.accentSoft : C.dangerSoft;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: fill }, line: NONE });
    const tc = style === "solid" ? "FFFFFF" : style === "soft" ? C.accent : C.danger;
    t(s, title, { x: x + 0.18, y: y + 0.12, w: w - 0.3, h: 0.35, fontSize: 17, bold: true, color: tc });
    t(s, sub, { x: x + 0.18, y: y + 0.44, w: w - 0.3, h: 0.3, fontSize: 12, color: style === "solid" ? "FFFFFF" : C.muted });
  });
  t(s, "untrusted is deprecated: use on-request   ·   switch live with /permissions", { x: X, y: 6.52, w: 8, h: 0.3, fontSize: 12, color: C.faint });
  s.addNotes(
    "4:00–8:00, then DEMO 1 8:00–15:00\n\n" +
    "Rows: what can it touch. Columns: when it wants to cross a line, who answers. Say twice: sandbox is blast radius, approval is interruptions.\n\n" +
    "Point at the three highlighted cells: explore (read-only + never), daily default (workspace-write + on-request), unattended runs (workspace-write + never, only isolated). Point at the red cell: no brakes, 'yolo'. untrusted is deprecated; /permissions switches mid-session.\n\n" +
    "DEMO 1: codex login status. (1) codex --sandbox read-only --ask-for-approval never, ask for the fix, it can't write. (2) /permissions → 1. Ask for approval, fix + test, no prompts. (3) npm view react version → it asks, decline. (4) /permissions → 2. Approve for me, same request. Reset: git reset --hard origin/demo/needs-work."
  );
}

// ---------------------------------------------------------------- Slide 3
{
  const s = base(3, "AGENTS.MD", "AGENTS.md is read before your prompt", "Codex loads it from the git root down to the folder you started in.", "discovery");
  t(s, "start at root", { x: 4.45, y: 2.72, w: 1.3, h: 0.3, fontSize: 12, color: C.muted, align: "center" });
  t(s, "start in components", { x: 5.75, y: 2.72, w: 1.5, h: 0.3, fontSize: 12, color: C.muted, align: "center" });
  const tree = [
    ["sprintboard-webinar/", null],
    ["├─ AGENTS.md", ["loaded", "loaded"]],
    ["└─ src/components/", null],
    ["   └─ AGENTS.md", ["not loaded", "loaded"]],
  ];
  tree.forEach(([label, marks], i) => {
    const y = 3.15 + i * 0.52;
    t(s, label, { x: X, y, w: 3.6, h: 0.4, fontFace: F.mono, fontSize: 16, color: marks ? C.ink : C.muted, valign: "middle" });
    if (marks) marks.forEach((m, j) => {
      t(s, m, { x: 4.45 + j * 1.35, y, w: j ? 1.5 : 1.3, h: 0.4, fontSize: 13, bold: true, color: m === "loaded" ? C.accent : C.danger, align: "center", valign: "middle" });
    });
    if (i < tree.length - 1) rule(s, X, y + 0.46, 6.45);
  });
  t(s, "“My AGENTS.md is being ignored.”", { x: X, y: 5.55, w: 6.4, h: 0.4, fontSize: 18, italic: true });
  t(s, "Check discovery before you debug the content.", { x: X, y: 5.97, w: 6.4, h: 0.35, fontSize: 15, color: C.muted });

  s.addShape(pres.shapes.LINE, { x: 7.75, y: 2.75, w: 0, h: 3.9, line: { color: C.rule, width: 0.75 } });
  t(s, "Belongs", { x: 8.2, y: 2.68, w: 4.3, h: 0.4, fontSize: 20, bold: true, color: C.accent });
  ["Exact commands: tests, lint, types", "Conventions the code doesn't show", "Folders to leave alone", "What “done” means here"].forEach((line, i) => {
    t(s, line, { x: 8.2, y: 3.15 + i * 0.42, w: 4.3, h: 0.38, fontSize: 16 });
  });
  t(s, "Doesn't", { x: 8.2, y: 5.0, w: 4.3, h: 0.4, fontSize: 20, bold: true, color: C.danger });
  ["A copy of your README", "Your whole style guide", "“Be careful”, with nothing to check"].forEach((line, i) => {
    t(s, line, { x: 8.2, y: 5.45 + i * 0.4, w: 4.3, h: 0.36, fontSize: 16 });
  });
  s.addNotes(
    "15:00–18:00, then DEMO 2 18:00–22:00\n\n" +
    "Read before your prompt. Git root down to the folder you started in, joined root first; closer files win. Point at 'not loaded': a file below where you started isn't loaded. 'My AGENTS.md is being ignored' → check discovery first.\n\n" +
    "Point at Belongs, then Doesn't. Treat it as a prompt you refine over weeks.\n\n" +
    "DEMO 2: browser tab 2 (root AGENTS.md), tab 3 (bloated). Terminal: codex at root, paste the 'without opening any files' prompt → nothing about components. Ctrl+C, cd src/components && codex, same prompt → component rules appear. Ctrl+C, cd ../.."
  );
}

// ---------------------------------------------------------------- Slide 4
{
  const s = base(4, "WHERE IT RUNS", "Offload what's slow and well-specified", "One agent, three surfaces. The cloud works in two phases.", "build an environment");
  [
    ["CLI and app", "Local. You watch it work.", "Keep work that needs your eyes or local state."],
    ["Cloud tasks", "Off your machine, several at once.", "Offload dependency bumps, test backfill, refactors."],
    ["IDE extension", "The same agent, in your editor.", "Keep edits you're steering line by line."],
  ].forEach(([name, a, b], i) => {
    const x = X + i * 3.95, w = 3.6;
    rule(s, x, 2.72, w, i === 1 ? C.accent : C.ink, i === 1 ? 2 : 1);
    t(s, name, { x, y: 2.88, w, h: 0.42, fontSize: 21, bold: true });
    t(s, a, { x, y: 3.34, w, h: 0.36, fontSize: 16 });
    t(s, b, { x, y: 3.72, w, h: 0.62, fontSize: 14, color: C.muted });
  });
  t(s, "THE TWO-PHASE CLOUD ENVIRONMENT", { x: X, y: 4.72, w: 6, h: 0.3, fontSize: 11, bold: true, color: C.faint, charSpacing: 2 });
  const phase = (x, n, name, line, color) => {
    t(s, n, { x, y: 5.08, w: 0.5, h: 0.62, fontSize: 36, bold: true, color, valign: "middle" });
    t(s, name, { x: x + 0.62, y: 5.08, w: 4.3, h: 0.36, fontSize: 20, bold: true });
    t(s, line, { x: x + 0.62, y: 5.45, w: 4.6, h: 0.36, fontSize: 15, color: C.muted });
  };
  phase(X, "1", "Setup", "Your script runs · internet on · secrets available", C.ink);
  s.addShape(pres.shapes.LINE, { x: 6.05, y: 5.4, w: 1.0, h: 0, line: { color: C.faint, width: 1.25, endArrowType: "triangle" } });
  t(s, "secrets removed", { x: 5.8, y: 5.55, w: 1.5, h: 0.3, fontSize: 11, color: C.faint, align: "center" });
  phase(7.35, "2", "Agent", "Your task runs · network off · env vars remain", C.accent);
  t(s, "Install dependencies in setup, not in the task.", { x: X, y: 6.3, w: 9, h: 0.45, fontSize: 20, bold: true, color: C.accent });
  s.addNotes(
    "22:00–24:00, then DEMO 3 24:00–31:00\n\n" +
    "Point at each surface. Offload work that's well specified and slow; keep work that needs your eyes, local state, or fast iteration. Chat question: what would you offload?\n\n" +
    "Point at the two phases: setup runs your script with internet and secrets; secrets removed; the agent runs with no network by default, env vars remain. Install dependencies in setup, not in the task.\n\n" +
    "DEMO 3: tab 4 → Create environment sprintboard-live (repository sprintboard-webinar, branch demo/needs-work, Node 22, setup npm ci, no secrets or variables, agent internet Off). Tab 5: Task A, then Task B. Task B fails with a network error: 'working exactly as configured.' Backup: the environment made during setup."
  );
}

// ---------------------------------------------------------------- Slide 5
{
  const s = base(5, "REVIEW AND MODEL LANES", "Review first. Then pick a lane.", "Read every finding critically. Match the model to the task.", "review and the fast lane");
  t(s, "BEFORE A HUMAN SEES YOUR PR", { x: X, y: 2.72, w: 6, h: 0.3, fontSize: 11, bold: true, color: C.faint, charSpacing: 2 });
  [
    ["Open the pull request", "from your branch, or from a cloud task", false],
    ["@codex review", "automatically, or by commenting it", true],
    ["Read it critically", "some findings are wrong; saying so is the skill", false],
    ["@codex fix it", "only for the findings you agree with", true],
  ].forEach(([title, sub, mono], i) => {
    const y = 3.1 + i * 0.72;
    t(s, String(i + 1), { x: X, y, w: 0.4, h: 0.4, fontSize: 20, bold: true, color: C.accent });
    t(s, title, { x: X + 0.5, y, w: 5.6, h: 0.38, fontSize: 18, bold: true, fontFace: mono ? F.mono : F.body });
    t(s, sub, { x: X + 0.5, y: y + 0.37, w: 5.6, h: 0.3, fontSize: 13, color: C.muted });
  });
  s.addShape(pres.shapes.LINE, { x: 7.1, y: 2.75, w: 0, h: 3.2, line: { color: C.rule, width: 0.75 } });
  t(s, "MODEL LANES", { x: 7.55, y: 2.72, w: 4, h: 0.3, fontSize: 11, bold: true, color: C.faint, charSpacing: 2 });
  [
    ["Luna", C.luna, 0.42, "Renames and\nsmall edits"],
    ["Terra", C.terra, 0.6, "Everyday\nrepository work"],
    ["Sol", C.sol, 0.78, "Debugging and\nreal ambiguity"],
    ["Astra", C.astra, 0.52, "Long,\nmulti-tool work"],
  ].forEach(([name, color, d, desc], i) => {
    const cx = 8.15 + i * 1.3;
    dot(s, cx, 3.65, d, color);
    t(s, name, { x: cx - 0.65, y: 4.2, w: 1.3, h: 0.36, fontSize: 16, bold: true, align: "center" });
    t(s, desc, { x: cx - 0.65, y: 4.56, w: 1.3, h: 0.6, fontSize: 12, color: C.muted, align: "center" });
  });
  s.addText([
    { text: "Profiles switch model and settings together: ", options: { color: C.muted } },
    { text: "codex -p fast", options: { color: C.ink, fontFace: F.mono } },
  ], { x: 7.55, y: 5.45, w: 5, h: 0.35, fontFace: F.body, fontSize: 13, margin: 0, isTextBox: true });
  rule(s, X, 6.22, R - X);
  t(s, "Sandbox is blast radius. Approval is interruptions. Configure the leash once.", { x: X, y: 6.36, w: R - X, h: 0.45, fontSize: 18, italic: true });
  s.addNotes(
    "31:00–32:30, then DEMO 4 32:30–35:00 (Task A decision at 32:30), then questions 35:00–40:00\n\n" +
    "Point at the left column: review before a human sees the PR; Codex follows the review rules in AGENTS.md. Read findings critically; accepting every suggestion is how you get worse code with more confidence.\n\n" +
    "Point at the planets: Luna mechanical, Terra everyday, Sol debugging, Astra long multi-tool work. Profiles switch model and settings together. Check your picker.\n\n" +
    "DEMO 4: Task A done → create PR into demo/needs-work; not done → reopen PR #8. Review posts or comment @codex review. Findings: agree or disagree using the rules. Thumbs-up only: explain the blocking rules it passes; point at the CI check. If time: cat ~/.codex/fast.config.toml, codex -p fast, the rename. Close with the leash line. Questions."
  );
}

pres.writeFile({ fileName: OUT }).then((f) => console.log("wrote", f));
