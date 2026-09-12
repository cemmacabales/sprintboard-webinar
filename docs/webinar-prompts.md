# Copy-ready webinar prompts

## Repository exploration

```text
Inspect this repository before editing anything. Explain how task data reaches the dashboard, identify the files involved in filtering and testing, and propose a short implementation plan for an At risk filter. Follow the repository instructions. Wait for my approval before editing.
```

## Feature implementation

```text
Approved. Implement the At risk filter. A task is at risk when it is incomplete and its due date is within seven days. Show the matching count, preserve the selected filter in the URL, add focused tests, and avoid new dependencies. Run the relevant checks when finished.
```

## Browser verification

```text
Open SprintBoard in the built-in browser. Verify the default, active, and empty At risk filter states. Check the layout at desktop and narrow widths. Report anything you cannot verify.
```

## Browser annotation follow-up

```text
Address the browser annotation. Keep the change limited to spacing and verify the narrow layout again.
```

## Bug diagnosis

```text
A task without a due date crashes the details panel. Reproduce the failure, explain the root cause, make the smallest safe fix, add a regression test, and rerun the relevant checks.
```

## Review

```text
Review the current uncommitted changes. Prioritize correctness, regressions, accessibility, and unnecessary complexity. Do not edit anything.
```

## Focused prevention pass

```text
Search for the same due-date assumption elsewhere in the repository. Report findings only. Do not edit.
```
