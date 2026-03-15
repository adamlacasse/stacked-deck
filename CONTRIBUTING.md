# Contributing to Stacked Deck

This is the operational guide for anyone implementing features in this repository, including AI coding agents.

Use this file for workflow. Use the product and data docs for direction.

## Read order

Read these in order before making non-trivial changes:

1. `README.md`
2. `AGENTS.md`
3. `docs/PROJECT_BRIEF.md`
4. `docs/DATA_MODEL.md`
5. `docs/ARCHITECTURE.md`
6. `docs/CONTENT_GUIDE.md` if you are editing deck content
7. `docs/BACKLOG.md` if you are picking the next task

## Working agreement

Contributions should stay inside the current MVP direction:

- single-page app
- static-first architecture
- card-centric data model
- six canonical categories
- spoiler-resistant flow
- local state before global state
- CSS Modules for component styles

Default to one small vertical slice per change.

Examples:

- add deck validation
- expand the local deck
- add tests for `useDeck`
- refine card transitions

Avoid mixing unrelated cleanup with feature work.

## Where code goes

Use the existing file boundaries unless there is a strong reason not to:

- `src/App.tsx`: top-level screen composition
- `src/components/*`: small UI components
- `src/hooks/*`: local stateful gameplay logic
- `src/data/*`: deck content and category metadata
- `src/types.ts`: domain types and constants
- `src/index.css`: global tokens, resets, base element styles

If a new file does not fit one of those buckets, pause and justify it before adding more structure.

## Definition of done

A change is ready when it:

- preserves the category -> question -> answer -> next-card flow
- does not reveal multiple questions or answers at once
- keeps the UI readable on phone-sized screens
- stays consistent with the current product brief
- keeps code local, explicit, and easy to inspect
- updates docs when behavior, structure, or authoring rules change
- passes the available checks

## Available checks

Before running checks, ensure your Node.js version is **20.19+**, **22.13+**, or **24+**. Vite 8 and the test dependencies require this.

After pulling new changes, run:

```bash
npm install
```

Then run checks:

```bash
npm run lint
npm run build
npm test
```

The test suite lives in `src/test/` and uses Vitest with jsdom. Tests cover `useDeck` hook behavior and `validateDeck` utility logic. Add new tests in `src/test/` when adding new hooks or data utilities. All `act()` calls in hook tests must be `await`ed (React 19 requirement).

## Documentation update rules

Update the relevant docs in the same change when you modify:

- product behavior: `README.md` and possibly `docs/PROJECT_BRIEF.md`
- data shape or validation rules: `docs/DATA_MODEL.md`
- code layout or runtime flow: `docs/ARCHITECTURE.md`
- content authoring expectations: `docs/CONTENT_GUIDE.md`
- task sequencing or next priorities: `docs/BACKLOG.md`

Do not create duplicate guidance in new files when an existing canonical doc can be updated instead.

## Dependency rule

Before adding a dependency, answer:

1. Can this be done with React, TypeScript, or the platform?
2. Is it needed for the MVP right now?
3. Does it increase hosting or architectural complexity?

If the answer is not strongly favorable, do not add it.

## Current gaps

Known gaps that are fair game for future work:

- no shuffle moment on game start
- no swipe-to-next gesture
- deck content lives in TypeScript rather than JSON

Keep work aimed at those gaps before expanding scope.
