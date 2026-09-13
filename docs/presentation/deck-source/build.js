const pptxgen = require("pptxgenjs");
const OUT = process.argv[2];
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = "Nine Ways to Run an Agent";
pres.author = "Cem Macabales";

const W = 13.333, H = 7.5;
const C = {
  bg: "0B1026", card: "141B3A", card2: "1B2449", line: "2B3668",
  text: "F3F5FB", muted: "A7B0CE", dim: "6F79A3",
  luna: "C8D2E8", terra: "4FD1A5", sol: "FFB547", astra: "A78BFA", danger: "FF6B6B", ink: "0B1026",
};
const F = { head: "Calibri", body: "Calibri", mono: "Courier New" };
const NONE = () => ({ type: "none" });

function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function stars(slide, seed, n, avoid = []) {
  const r = rng(seed);
  const pad = 0.12;
  const blocked = (x, y) => avoid.some(([ax, ay, aw, ah]) => x > ax - pad && x < ax + aw + pad && y > ay - pad && y < ay + ah + pad);
  let placed = 0;
  for (let tries = 0; placed < n && tries < n * 8; tries++) {
    const d = 0.02 + r() * 0.045, x = 0.25 + r() * (W - 0.5), y = 0.2 + r() * (H - 0.4), c = r(), t = r();
    if (blocked(x, y)) continue;
    slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: c < 0.12 ? C.sol : C.luna, transparency: 55 + Math.floor(t * 35) }, line: NONE() });
    placed++;
  }
}
const PILL = [8.45, 6.45, 4.45, 0.65];
function text(slide, t, o) { slide.addText(t, Object.assign({ fontFace: F.body, color: C.text, margin: 0, isTextBox: true, valign: "top" }, o)); }
function card(slide, x, y, w, h, fill = C.card, line) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.14, fill: { color: fill }, line: line ? { color: line, width: 1 } : NONE() });
}
function dot(slide, x, y, d, color, transparency = 0) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color, transparency }, line: NONE() });
}
function header(slide, kicker, title, sub) {
  text(slide, kicker, { x: 0.6, y: 0.45, w: 9, h: 0.32, fontSize: 12, bold: true, color: C.terra, charSpacing: 3 });
  text(slide, title, { x: 0.6, y: 0.8, w: 12.1, h: 0.75, fontFace: F.head, fontSize: 36, bold: true });
  if (sub) text(slide, sub, { x: 0.6, y: 1.55, w: 12.1, h: 0.42, fontSize: 17, color: C.muted });
}
function pill(slide, label) {
  const w = 4.2, h = 0.46, x = W - 0.6 - w, y = H - 0.5 - h;
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.23, fill: { color: C.card2 }, line: { color: C.terra, width: 1 } });
  dot(slide, x + 0.2, y + h / 2 - 0.07, 0.14, C.terra);
  slide.addText([
    { text: "NEXT · LIVE DEMO   ", options: { color: C.terra, bold: true, fontSize: 11, charSpacing: 2 } },
    { text: label, options: { color: C.text, fontSize: 13 } },
  ], { x: x + 0.45, y, w: w - 0.55, h, fontFace: F.body, valign: "middle", margin: 0, isTextBox: true });
}
function chip(slide, x, y, w, label, color, solid = false) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.32, rectRadius: 0.16, fill: { color, transparency: solid ? 0 : 78 }, line: NONE() });
  text(slide, label, { x, y, w, h: 0.32, fontSize: 11, bold: true, color: solid ? C.ink : color, align: "center", valign: "middle" });
}

// ---------------------------------------------------------------- Slide 1
{
  const s = pres.addSlide(); s.background = { color: C.bg }; stars(s, 11, 44, [[0.5, 0.6, 7.3, 6.0], [7.7, 1.0, 5.5, 5.5], PILL]);
  s.addShape(pres.shapes.OVAL, { x: 7.85, y: 1.15, w: 5.2, h: 5.2, fill: { color: C.bg, transparency: 100 }, line: { color: C.astra, width: 1.25, transparency: 65 } });
  s.addShape(pres.shapes.OVAL, { x: 8.5, y: 1.8, w: 3.9, h: 3.9, fill: { color: C.bg, transparency: 100 }, line: { color: C.luna, width: 1, transparency: 80 } });
  const cx = 10.45, cy = 3.75, gap = 1.02, d = 0.6;
  const lit = { "0,2": "terra", "1,0": "terraSolid", "1,2": "terra", "2,2": "danger" };
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    const x = cx + (c - 1) * gap - d / 2, y = cy + (r - 1) * gap - d / 2, k = lit[`${r},${c}`];
    if (k === "terraSolid") dot(s, x - 0.06, y - 0.06, d + 0.12, C.terra);
    else if (k === "terra") dot(s, x, y, d, C.terra, 25);
    else if (k === "danger") s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: C.danger, transparency: 80 }, line: { color: C.danger, width: 1.5 } });
    else s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: C.card2 }, line: { color: C.line, width: 1 } });
  }
  text(s, "CODEX · A 40-MINUTE GUIDE", { x: 0.6, y: 0.75, w: 7, h: 0.32, fontSize: 12, bold: true, color: C.terra, charSpacing: 3 });
  text(s, "Nine Ways to\nRun an Agent", { x: 0.6, y: 1.1, w: 7.1, h: 1.95, fontFace: F.head, fontSize: 52, bold: true });
  text(s, "Sandboxes, AGENTS.md, and cloud tasks", { x: 0.6, y: 3.1, w: 7.1, h: 0.45, fontSize: 22, color: C.muted });
  text(s, "You've run Codex. You haven't configured it.", { x: 0.6, y: 3.65, w: 7.1, h: 0.42, fontSize: 18, italic: true, color: C.luna });
  text(s, "YOU'LL LEAVE WITH", { x: 0.6, y: 4.45, w: 6, h: 0.3, fontSize: 12, bold: true, color: C.dim, charSpacing: 3 });
  [
    "A sandbox and approval default you can defend",
    "An AGENTS.md that Codex actually reads",
    "A rule for choosing local or cloud",
    "A review habit for your own pull requests",
  ].forEach((t, i) => {
    const y = 4.85 + i * 0.42;
    dot(s, 0.62, y + 0.12, 0.14, C.terra);
    text(s, t, { x: 0.95, y, w: 6.6, h: 0.38, fontSize: 16 });
  });
  pill(s, "the stakes");
  s.addNotes(
    "0:00–4:00 · Full script: docs/presentation/live-script.pdf\n\n" +
    "Opening frame: most developers use Codex as a chat box that happens to sit in a terminal. This session is the configuration layer underneath it: what the agent is allowed to touch, what it reads first, and where the work runs.\n\n" +
    "Who it's for: you've installed Codex and asked it to fix a bug, you approve every prompt by hand, you've heard of AGENTS.md but never checked it's read, and you're not sure when to use the cloud. Nobody needs to have written a config file.\n\n" +
    "Read the four take-aways out loud.\n\n" +
    "DEMO 0 (3:00–4:00): run npm run test:run, 12 pass. Open 'Backfill release checklist' in the browser, the board white-screens. Line: 'Green tests, broken app. That's the repository we're about to hand to an agent. How much should it be allowed to touch?'"
  );
}

// ---------------------------------------------------------------- Slide 2
{
  const s = pres.addSlide(); s.background = { color: C.bg }; stars(s, 23, 30, [[0.5, 0.4, 9.5, 1.65], [0.5, 2.05, 12.3, 4.95], PILL]);
  header(s, "SANDBOX × APPROVAL", "Nine combinations. Three you'll use.", "Sandbox is blast radius. Approval is interruptions. They're independent.");
  const colX = (i) => 3.25 + i * 3.1, colW = 2.95, rowY = (i) => 2.95 + i * 1.2, rowH = 1.05;
  const cols = [
    ["on-request", "you answer"],
    ["auto-review", "a reviewer agent answers"],
    ["never", "nobody is asked"],
  ];
  const rows = [
    ["read-only", "look, don't touch"],
    ["workspace-write", "edit inside the project"],
    ["danger-full-access", "no boundary at all"],
  ];
  text(s, "SANDBOX ↓   APPROVAL →", { x: 0.6, y: 2.3, w: 2.5, h: 0.3, fontSize: 11, bold: true, color: C.dim, charSpacing: 2 });
  cols.forEach(([k, v], i) => {
    text(s, k, { x: colX(i) + 0.05, y: 2.12, w: colW - 0.1, h: 0.36, fontFace: F.mono, fontSize: 16, bold: true });
    text(s, v, { x: colX(i) + 0.05, y: 2.48, w: colW - 0.1, h: 0.3, fontSize: 13, color: C.muted });
  });
  chip(s, colX(1) + 1.85, 2.13, 0.75, "NEW", C.astra);
  rows.forEach(([k, v], i) => {
    text(s, k, { x: 0.6, y: rowY(i) + 0.22, w: 2.55, h: 0.36, fontFace: F.mono, fontSize: 15, bold: true, color: i === 2 ? C.danger : C.text });
    text(s, v, { x: 0.6, y: rowY(i) + 0.58, w: 2.55, h: 0.3, fontSize: 13, color: C.muted });
  });
  const cells = {
    "0,2": { style: "tint", title: "Explore a codebase", sub: "no prompts, no risk" },
    "1,0": { style: "solid", title: "Daily default", sub: "the sane starting point" },
    "1,2": { style: "tint", title: "Unattended runs", sub: "only when isolated" },
    "2,2": { style: "danger", title: "No brakes", sub: "the one to avoid" },
  };
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    const x = colX(c), y = rowY(r), cell = cells[`${r},${c}`];
    if (!cell) { card(s, x, y, colW, rowH, C.card); continue; }
    if (cell.style === "solid") s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: colW, h: rowH, rectRadius: 0.14, fill: { color: C.terra }, line: NONE() });
    if (cell.style === "tint") s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: colW, h: rowH, rectRadius: 0.14, fill: { color: C.terra, transparency: 80 }, line: { color: C.terra, width: 1 } });
    if (cell.style === "danger") s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: colW, h: rowH, rectRadius: 0.14, fill: { color: C.danger, transparency: 82 }, line: { color: C.danger, width: 1.5 } });
    const tc = cell.style === "solid" ? C.ink : cell.style === "danger" ? C.danger : C.terra;
    const sc = cell.style === "solid" ? C.ink : C.text;
    text(s, cell.title, { x: x + 0.22, y: y + 0.2, w: colW - 0.4, h: 0.38, fontSize: 18, bold: true, color: tc });
    text(s, cell.sub, { x: x + 0.22, y: y + 0.58, w: colW - 0.4, h: 0.32, fontSize: 13, color: sc });
  }
  text(s, "untrusted is deprecated: use on-request.   Switch live with /permissions.", { x: 0.6, y: 6.62, w: 7.7, h: 0.34, fontSize: 12, color: C.dim });
  pill(s, "sandbox and approvals");
  s.addNotes(
    "4:00–8:00, then DEMO 1 8:00–15:00\n\n" +
    "Two independent questions. Rows: what can it touch? Columns: when it wants to cross a line, who answers? You (on-request), a reviewer agent (auto-review, --approve-for-me), or nobody (never).\n\n" +
    "Say it twice: sandbox is blast radius, approval is interruptions. A tight sandbox with 'never' is still safe. A loose sandbox with 'never' is not.\n\n" +
    "Be honest that most of the nine aren't worth using. Counting to nine and finding three worth using is the lesson; the skill is choosing, not memorising.\n\n" +
    "If asked: 'untrusted' is deprecated in current Codex; use on-request.\n\n" +
    "DEMO 1: (1) read-only + never, ask for the crash fix, it can't write. (2) /permissions → 1. Ask for approval (workspace-write + on-request), it fixes and tests with no prompts. (3) ask it to run npm view react version, it asks you. (4) /permissions → 2. Approve for me (same as --approve-for-me), same request, a reviewer agent answers. Name danger-full-access + never (--yolo), don't run it. Recovery: Ctrl+C, git reset --hard origin/demo/needs-work."
  );
}

// ---------------------------------------------------------------- Slide 3
{
  const s = pres.addSlide(); s.background = { color: C.bg }; stars(s, 37, 28, [[0.5, 0.4, 10.5, 1.65], [0.5, 2.1, 6.3, 4.5], [6.9, 2.1, 5.95, 4.25], PILL]);
  header(s, "AGENTS.MD", "AGENTS.md is read before your prompt", "Codex loads it from the git root down to the folder you started in.");
  card(s, 0.6, 2.2, 6.1, 3.3, C.card);
  text(s, "Which files load?", { x: 0.85, y: 2.38, w: 2.6, h: 0.35, fontSize: 15, bold: true });
  text(s, "start at root", { x: 3.95, y: 2.42, w: 1.25, h: 0.3, fontSize: 11, bold: true, color: C.muted, align: "center" });
  text(s, "start in components", { x: 5.2, y: 2.42, w: 1.35, h: 0.3, fontSize: 11, bold: true, color: C.muted, align: "center" });
  const tree = [
    ["sprintboard-webinar/", null],
    ["├─ AGENTS.md", ["loaded", "loaded"]],
    ["└─ src/components/", null],
    ["   └─ AGENTS.md", ["not loaded", "loaded"]],
  ];
  tree.forEach(([label, chips], i) => {
    const y = 2.95 + i * 0.5;
    text(s, label, { x: 0.85, y, w: 3.1, h: 0.36, fontFace: F.mono, fontSize: 15, color: chips ? C.text : C.luna, valign: "middle" });
    if (chips) chips.forEach((c, j) => chip(s, 4.0 + j * 1.3, y + 0.02, 1.15, c, c === "loaded" ? C.terra : C.danger));
  });
  text(s, "Files closer to where you started are added later, so they win.", { x: 0.85, y: 4.98, w: 5.7, h: 0.35, fontSize: 13, color: C.muted });
  card(s, 0.6, 5.7, 6.1, 0.78, C.card2);
  dot(s, 0.85, 5.99, 0.2, C.sol);
  text(s, [
    { text: "“My AGENTS.md is being ignored.”", options: { italic: true, color: C.sol, breakLine: true } },
    { text: "Check discovery before you debug the content.", options: { color: C.text } },
  ], { x: 1.2, y: 5.7, w: 5.4, h: 0.78, fontSize: 14, valign: "middle" });

  card(s, 7.0, 2.2, 5.73, 2.3, C.card);
  text(s, "Belongs", { x: 7.25, y: 2.35, w: 5, h: 0.38, fontSize: 17, bold: true, color: C.terra });
  ["Exact commands: tests, lint, types", "Conventions the code doesn't show", "Folders to leave alone", "What “done” means here"].forEach((t, i) => {
    const y = 2.82 + i * 0.4;
    dot(s, 7.28, y + 0.11, 0.13, C.terra);
    text(s, t, { x: 7.55, y, w: 5.0, h: 0.36, fontSize: 15 });
  });
  card(s, 7.0, 4.65, 5.73, 1.6, C.card);
  text(s, "Doesn't", { x: 7.25, y: 4.8, w: 5, h: 0.38, fontSize: 17, bold: true, color: C.danger });
  ["A copy of your README", "Your whole style guide", "“Be careful”, with nothing to check"].forEach((t, i) => {
    const y = 5.25 + i * 0.32;
    dot(s, 7.28, y + 0.1, 0.13, C.danger);
    text(s, t, { x: 7.55, y, w: 5.0, h: 0.32, fontSize: 14 });
  });
  pill(s, "discovery");
  s.addNotes(
    "15:00–18:00, then DEMO 2 18:00–22:00\n\n" +
    "It's the file the agent reads before your prompt. Codex reads AGENTS.md from the git root down to the folder you started in and joins them in that order. A file in a folder below where you started isn't loaded. That's the 'my AGENTS.md is being ignored' report juniors won't diagnose on their own. Check discovery before you debug the content.\n\n" +
    "What belongs: exact commands, conventions you can't see from the code, folders to leave alone, what done means. Not a README rewrite or a pasted style guide. Treat it as a prompt you refine over weeks, not documentation you write once.\n\n" +
    "DEMO 2: show the root AGENTS.md beside docs/presentation/examples/AGENTS.bloated.md on GitHub (the tight one produces better results, which surprises people). Start codex at the root and ask it to list its instructions without opening files: nothing about components. Quit, cd src/components, same prompt: the component rules appear, including 'Component rules loaded.'"
  );
}

// ---------------------------------------------------------------- Slide 4
{
  const s = pres.addSlide(); s.background = { color: C.bg }; stars(s, 51, 28, [[0.5, 0.4, 10.5, 1.65], [0.5, 2.1, 12.3, 2.2], [0.5, 4.3, 12.3, 2.4], PILL]);
  header(s, "WHERE IT RUNS", "Offload what's slow and well-specified", "One agent, three surfaces, and a cloud that works in two phases.");
  const cw = 3.84, surfaces = [
    { g: ">_", c: C.terra, t: "CLI and app", a: "Local. You watch it work.", b: "Keep work that needs your eyes, local state, or fast iteration." },
    { g: "≈", c: C.astra, t: "Cloud tasks", a: "Off your machine, several at once.", b: "Offload dependency bumps, test backfill, mechanical refactors." },
    { g: "{ }", c: C.luna, t: "IDE extension", a: "The same agent, in your editor.", b: "Keep edits you're steering line by line." },
  ];
  surfaces.forEach((v, i) => {
    const x = 0.6 + i * (cw + 0.3), y = 2.2;
    card(s, x, y, cw, 1.95, C.card);
    dot(s, x + 0.25, y + 0.25, 0.58, v.c, 78);
    text(s, v.g, { x: x + 0.25, y: y + 0.25, w: 0.58, h: 0.58, fontFace: F.mono, fontSize: 16, bold: true, color: v.c, align: "center", valign: "middle" });
    text(s, v.t, { x: x + 0.98, y: y + 0.33, w: cw - 1.15, h: 0.42, fontSize: 19, bold: true });
    text(s, v.a, { x: x + 0.25, y: y + 0.98, w: cw - 0.45, h: 0.34, fontSize: 14 });
    text(s, v.b, { x: x + 0.25, y: y + 1.32, w: cw - 0.45, h: 0.55, fontSize: 13, color: C.muted });
  });
  text(s, "THE TWO-PHASE CLOUD ENVIRONMENT", { x: 0.6, y: 4.42, w: 7, h: 0.3, fontSize: 12, bold: true, color: C.dim, charSpacing: 3 });
  const phase = (x, w, label, color, l1, l2) => {
    card(s, x, 4.8, w, 1.22, C.card);
    chip(s, x + 0.25, 4.98, 1.3, label, color, true);
    text(s, l1, { x: x + 1.75, y: 4.94, w: w - 1.95, h: 0.4, fontSize: 16, bold: true, valign: "middle" });
    text(s, l2, { x: x + 0.25, y: 5.45, w: w - 0.45, h: 0.4, fontSize: 14, color: C.muted });
  };
  phase(0.6, 5.2, "1 · SETUP", C.sol, "Your setup script runs", "Internet on  ·  Secrets available");
  s.addShape(pres.shapes.RIGHT_ARROW, { x: 6.0, y: 5.13, w: 1.35, h: 0.42, fill: { color: C.line }, line: NONE() });
  text(s, "secrets removed", { x: 5.85, y: 5.62, w: 1.65, h: 0.3, fontSize: 11, color: C.dim, align: "center" });
  phase(7.53, 5.2, "2 · AGENT", C.astra, "Your task runs", "Network off by default  ·  Env vars remain");
  text(s, "Install dependencies in setup, not in the task.", { x: 0.6, y: 6.2, w: 7.7, h: 0.4, fontSize: 17, bold: true, color: C.terra });
  pill(s, "cloud task");
  s.addNotes(
    "22:00–24:00, then DEMO 3 24:00–31:00\n\n" +
    "One agent, three surfaces. The judgment call: offload work that is well specified and slow; keep work that needs your eyes, local state, or fast iteration. Ask the room what they'd offload. Good answers: dependency bumps, test backfill, mechanical refactors.\n\n" +
    "Two phases: setup runs your script with internet and secrets; secrets are removed; the agent phase has no network by default, but environment variables remain. So install dependencies in setup, not in the task. This is the highest-value slide for anyone who's hit a confusing cloud failure; budget an extra minute for questions.\n\n" +
    "Failure mode to name: offloading work that needed your local database.\n\n" +
    "DEMO 3: create a new environment live (sprintboard-live: repository sprintboard-webinar, branch demo/needs-work, Node 22, setup script npm ci, agent internet off). Start Task A first (fix the crash + missing regression test) and leave it running. Start Task B (run npm view react version): it fails with a network error. Line: 'Task B didn't break. It's working exactly as configured.'"
  );
}

// ---------------------------------------------------------------- Slide 5
{
  const s = pres.addSlide(); s.background = { color: C.bg }; stars(s, 67, 32, [[0.5, 0.4, 8.5, 1.65], [0.5, 2.1, 12.3, 3.7], [0.5, 5.85, 8.0, 0.7], PILL]);
  header(s, "REVIEW AND MODEL LANES", "Review first. Then pick a lane.", "Read every finding critically. Match the model to the task.");
  card(s, 0.6, 2.2, 5.9, 3.5, C.card);
  text(s, "BEFORE A HUMAN SEES YOUR PR", { x: 0.85, y: 2.37, w: 5.4, h: 0.3, fontSize: 12, bold: true, color: C.dim, charSpacing: 2 });
  [
    ["Open the pull request", "from your branch, or from a cloud task"],
    ["@codex review", "automatically, or by commenting it"],
    ["Read it critically", "some findings are wrong; saying so is the skill"],
    ["@codex fix it", "only for the findings you agree with"],
  ].forEach(([t, d], i) => {
    const y = 2.8 + i * 0.7;
    dot(s, 0.85, y + 0.02, 0.44, C.terra);
    text(s, String(i + 1), { x: 0.85, y: y + 0.02, w: 0.44, h: 0.44, fontSize: 16, bold: true, color: C.ink, align: "center", valign: "middle" });
    text(s, t, { x: 1.5, y: y - 0.02, w: 4.8, h: 0.34, fontSize: 17, bold: true, fontFace: t.startsWith("@") ? F.mono : F.body });
    text(s, d, { x: 1.5, y: y + 0.31, w: 4.8, h: 0.3, fontSize: 13, color: C.muted });
  });

  card(s, 6.8, 2.2, 5.93, 3.5, C.card);
  text(s, "MODEL LANES", { x: 7.05, y: 2.37, w: 5, h: 0.3, fontSize: 12, bold: true, color: C.dim, charSpacing: 2 });
  const lanes = [
    { n: "Luna", c: C.luna, d: 0.5, t: "Renames and small edits" },
    { n: "Terra", c: C.terra, d: 0.72, t: "Everyday repository work" },
    { n: "Sol", c: C.sol, d: 0.9, t: "Debugging and real ambiguity" },
    { n: "Astra", c: C.astra, d: 0.62, t: "Long, multi-tool work" },
  ];
  lanes.forEach((v, i) => {
    const cx = 7.55 + i * 1.44, cy = 3.35;
    if (v.n === "Sol") s.addShape(pres.shapes.OVAL, { x: cx - 0.62, y: cy - 0.62, w: 1.24, h: 1.24, fill: { color: C.bg, transparency: 100 }, line: { color: C.sol, width: 1.25, transparency: 55 } });
    if (v.n === "Astra") s.addShape(pres.shapes.OVAL, { x: cx - 0.6, y: cy - 0.18, w: 1.2, h: 0.36, rotate: -18, fill: { color: C.bg, transparency: 100 }, line: { color: C.astra, width: 1.25 } });
    dot(s, cx - v.d / 2, cy - v.d / 2, v.d, v.c);
    text(s, v.n, { x: cx - 0.7, y: 4.02, w: 1.4, h: 0.36, fontSize: 16, bold: true, color: v.c, align: "center" });
    text(s, v.t, { x: cx - 0.7, y: 4.38, w: 1.4, h: 0.72, fontSize: 12, color: C.muted, align: "center" });
  });
  text(s, [
    { text: "Profiles switch model and settings together: ", options: { color: C.dim } },
    { text: "codex -p fast", options: { color: C.luna, fontFace: F.mono } },
    { text: ". Check your picker; availability changes.", options: { color: C.dim } },
  ], { x: 7.05, y: 5.12, w: 5.5, h: 0.5, fontSize: 12 });

  text(s, "Sandbox is blast radius. Approval is interruptions. Configure the leash once.", { x: 0.6, y: 5.95, w: 7.8, h: 0.55, fontSize: 16, italic: true, color: C.luna, valign: "middle" });
  pill(s, "review and the fast lane");
  s.addNotes(
    "31:00–32:30, then DEMO 4 32:30–35:00 (Task A decision at 32:30), then questions 35:00–40:00\n\n" +
    "Codex reviews pull requests and follows the Code Review Rules in AGENTS.md, automatically or when you comment @codex review. Run it before a human sees the branch. Emphasise critical reading: the failure mode for juniors is accepting every suggestion, which is how you get worse code with more confidence.\n\n" +
    "Model lanes: Luna for mechanical work, Terra for everyday repository work, Sol for debugging and ambiguity, Astra for long multi-tool work. Don't read version numbers aloud; they date the recording. Profiles are files in ~/.codex, selected with codex -p.\n\n" +
    "Failure modes: trusting an agent's own claim that the tests pass (point at the CI check), and one long thread doing four unrelated tasks (every demo today started fresh).\n\n" +
    "DEMO 4: create the pull request from Task A against demo/needs-work; the automatic review posts (or comment @codex review); read one finding aloud and say whether you agree. If it only leaves a thumbs-up, explain why the diff passes the blocking rules and point at the CI check. If time: codex -p fast for a mechanical rename.\n\n" +
    "Close: 'Configure the leash once, and the agent stops needing supervision for the boring 80%.' Questions."
  );
}

pres.writeFile({ fileName: OUT }).then((f) => console.log("wrote", f));
