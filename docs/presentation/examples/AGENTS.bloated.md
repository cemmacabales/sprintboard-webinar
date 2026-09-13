<!--
  Deliberately bad AGENTS.md, for the webinar's side-by-side comparison.
  Compare it with the root AGENTS.md. What's wrong with this one:
  - It retells the README instead of saying how to work here.
  - It pastes a style guide that ESLint already enforces.
  - "Run npm test" starts watch mode, which never exits for an agent.
  - "Be careful" and "think step by step" give the agent nothing to check.
  - There is no definition of done.
-->

# SprintBoard

Welcome to SprintBoard! SprintBoard is a compact release-operations dashboard
built with React 19, TypeScript 6, and Vite 8. It helps teams see what needs
attention before the next release, grouped by status, with filters for what is
active, what is done, and what is at risk.

## History

The project started as a small internal tool. Over time it grew to include
filtering, URL state, and a details drawer. We are proud of how far it has come
and we welcome contributions from everyone.

## Getting started

First, make sure you have Node.js installed. We recommend the latest LTS
version, which you can download from the Node.js website. Then clone the
repository, open it in your favourite editor, and install the dependencies.
When you are ready, run npm test to run the tests.

## Code style

- Use 2 spaces for indentation.
- Use double quotes for strings.
- Always put semicolons at the end of statements.
- Prefer const over let.
- Use camelCase for variables and functions.
- Use PascalCase for components.
- Keep lines under 100 characters.
- Sort imports alphabetically.
- Add a blank line between import groups.
- Use arrow functions for callbacks.
- Avoid nested ternaries.
- Write meaningful variable names.

## Philosophy

We believe good software is simple, readable, and maintainable. We value
clarity over cleverness, and we try to leave the code better than we found it.

## Please be careful

Be careful with dates. Be careful with accessibility. Think step by step and
double-check your work. Be thorough but concise. Make sure everything works.
