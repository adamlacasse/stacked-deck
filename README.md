# Stacked Deck

Stacked Deck is a responsive web app that replaces the physical trivia card deck while preserving the social feel of playing with a real board game.

The app is a deck replacement, not a full trivia platform. The board, wedges, and around-the-table flow stay physical. This project only handles drawing cards, selecting a category, revealing a question, revealing an answer, and moving to the next card.

## Current status

This repository is at day-zero:

- Vite + React + TypeScript scaffold is installed
- core product direction is documented
- data model direction is documented
- app UI is still the starter scaffold and has not been adapted yet

The next useful work is replacing the demo UI with a minimal game shell and building the first playable card flow.

## Canonical docs

Read these before making code changes:

- [`AGENTS.md`](./AGENTS.md): implementation defaults and project guardrails
- [`docs/PROJECT_BRIEF.md`](./docs/PROJECT_BRIEF.md): product intent, MVP scope, and UX direction
- [`docs/DATA_MODEL.md`](./docs/DATA_MODEL.md): card-centric data model and category rules

When in doubt, those documents win over ad hoc implementation ideas.

## MVP shape

Current target flow:

1. Start or enter the game
2. Draw a card
3. Show six categories for that card
4. Select a category
5. Show one question
6. Reveal one answer
7. Move to next card

Important constraints:

- single-page app
- mobile-friendly and responsive
- one person reads from the device during group play
- static-first architecture
- cards are the primary content unit
- every card contains exactly six category-based entries
- questions and answers stay spoiler-resistant

## Product guardrails

Build toward these defaults unless explicitly asked otherwise:

- React + TypeScript + Vite
- CSS Modules for component styling
- local component state with React hooks
- local JSON or TypeScript data for MVP content
- `localStorage` only for lightweight session persistence
- simple, explicit code over abstractions

Do not introduce these for MVP without a clear request:

- authentication
- backend services or databases
- multiplayer sync
- routing
- Tailwind
- Sass/SCSS
- Redux or other heavy state libraries
- live LLM calls during gameplay

## Data model snapshot

The canonical categories for MVP are:

1. `geography`
2. `entertainment`
3. `history`
4. `arts`
5. `science`
6. `sports`

Each card should:

- have a stable `id`
- contain exactly six `entries`
- contain each canonical category exactly once
- store a `question` and `answer` for each entry

Recommended direction from the docs:

```ts
type Category =
  | 'geography'
  | 'entertainment'
  | 'history'
  | 'arts'
  | 'science'
  | 'sports'

type CardEntry = {
  category: Category
  question: string
  answer: string
  explanation?: string
}

type TriviaCard = {
  id: string
  entries: [
    CardEntry,
    CardEntry,
    CardEntry,
    CardEntry,
    CardEntry,
    CardEntry
  ]
}
```

Model around cards, not loose standalone questions.

## Getting started

### Requirements

- Node.js 20+ recommended
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Check the project

```bash
npm run lint
npm run build
```

## Agent-first workflow

This repository is intended to work well with coding agents. The fastest way to keep progress clean is to treat the docs as the spec and build in thin, reviewable slices.

### Working rules for agents

1. Read `AGENTS.md` and the docs before editing code.
2. Keep changes local and avoid touching unrelated files.
3. Preserve the six-category card model.
4. Prefer static data, local state, and small components.
5. Validate changes with `npm run lint` and `npm run build` when relevant.
6. If a code change shifts product direction, update the docs in the same pass.

### Good first implementation slices

Build in this order:

1. Remove the Vite starter content and replace it with a basic app shell.
2. Add `types.ts` for the card model and a small local starter deck.
3. Build a minimal deck/session hook that can draw cards without repeats.
4. Render the six categories first and keep all questions hidden initially.
5. Add question reveal and answer reveal for only the selected category.
6. Add next-card and reset-session actions.
7. Persist used card ids locally if it improves the MVP flow.

### Likely near-term file shape

These names align with the current project direction:

- `src/types.ts`
- `src/data/deck.ts` or `src/data/coreDeck.json`
- `src/hooks/useDeck.ts`
- `src/components/CardView.tsx`
- `src/components/CategoryList.tsx`
- `src/components/QuestionView.tsx`
- `src/components/RevealAnswerButton.tsx`

Use CSS Modules for new component styling.

### Definition of done for early features

An early feature is on track if it:

- feels like a deck, not a dashboard
- keeps text readable at arm's length
- has large tap targets
- shows categories before questions
- reveals only one answer at a time
- keeps interaction friction low during group play

## Suggested prompt starters

These are good agent tasks for the current state of the repo:

- "Replace the Vite starter screen with a minimal Stacked Deck app shell that matches the project brief."
- "Add the MVP card types and a small local starter deck based on `docs/DATA_MODEL.md`."
- "Implement a local `useDeck` hook that draws unused cards, supports reset, and keeps the UI spoiler-resistant."
- "Build the first playable category -> question -> reveal answer -> next card flow using CSS Modules."

## Scripts

- `npm run dev`: start the Vite dev server
- `npm run build`: type-check and build for production
- `npm run lint`: run ESLint
- `npm run preview`: preview the production build locally

## Immediate next step

Replace the starter scaffold in [`src/App.tsx`](./src/App.tsx) with the first playable game shell, keeping the implementation static-first and card-centric.
