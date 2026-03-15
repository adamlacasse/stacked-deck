# Stacked Deck

Stacked Deck is a responsive web app that replaces the physical trivia card deck while preserving the social feel of playing with a real board game.

The app is a deck replacement, not a full trivia platform. The board, wedges, and around-the-table flow stay physical. This project only handles drawing cards, selecting a category, revealing a question, revealing an answer, and moving to the next card.

## Current status

This repository now has a first playable MVP slice:

- Vite + React + TypeScript app scaffold is in place
- product and data model direction are documented
- the starter screen has been replaced with a deck-style game shell
- a local starter deck exists in `src/data/deck.ts`
- session state is handled locally with React state + `localStorage`
- cards are drawn without repeats within a session
- the app currently supports category selection, question reveal, answer reveal, next card, and session reset

Still intentionally missing:

- deck content validation
- larger card content sets
- card draw/reveal transitions
- swipe interaction
- tests

## Canonical docs

Read these before making code changes:

- [`README.md`](./README.md): current project status and commands
- [`AGENTS.md`](./AGENTS.md): implementation defaults and project guardrails
- [`CONTRIBUTING.md`](./CONTRIBUTING.md): working agreement, file boundaries, and definition of done
- [`docs/PROJECT_BRIEF.md`](./docs/PROJECT_BRIEF.md): product intent, MVP scope, and UX direction
- [`docs/DATA_MODEL.md`](./docs/DATA_MODEL.md): card-centric data model and category rules
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md): current code map and runtime flow
- [`docs/CONTENT_GUIDE.md`](./docs/CONTENT_GUIDE.md): card authoring rules
- [`docs/BACKLOG.md`](./docs/BACKLOG.md): near-term implementation priorities

Suggested read order for new agents:

1. `README.md`
2. `AGENTS.md`
3. `CONTRIBUTING.md`
4. `docs/PROJECT_BRIEF.md`
5. `docs/DATA_MODEL.md`
6. `docs/ARCHITECTURE.md`
7. `docs/CONTENT_GUIDE.md` when touching content
8. `docs/BACKLOG.md` when picking the next task

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

### Current implementation snapshot

The main app flow currently lives in:

- `src/App.tsx`
- `src/hooks/useDeck.ts`
- `src/data/deck.ts`
- `src/components/CardView.tsx`
- `src/components/CategoryList.tsx`
- `src/components/QuestionView.tsx`

This is enough to play through a small local deck on a single screen while preserving the spoiler-resistant category flow.

### Good next implementation slices

Build in this order:

1. Add deck validation so malformed card data fails loudly in development.
2. Expand the local deck and separate content authoring from UI work.
3. Add subtle card transitions for draw/reveal states without increasing UI noise.
4. Introduce lightweight tests for the deck hook and content rules.
5. Add import-friendly deck loading so the content source can later move from local TS to local JSON cleanly.

### Near-term file shape

These names align with the current project direction:

- `src/types.ts`
- `src/data/deck.ts`
- `src/hooks/useDeck.ts`
- `src/components/CardView.tsx`
- `src/components/CategoryList.tsx`
- `src/components/QuestionView.tsx`

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

- "Add deck validation utilities based on `docs/DATA_MODEL.md` and wire them into local deck loading."
- "Expand the starter deck with more cards while preserving canonical category order."
- "Add lightweight tests for `useDeck` session behavior and non-repeating draws."
- "Refine the card transitions so moving to the next card feels more like drawing from a deck."

## Scripts

- `npm run dev`: start the Vite dev server
- `npm run build`: type-check and build for production
- `npm run lint`: run ESLint
- `npm run preview`: preview the production build locally

## Immediate next step

Add deck validation and expand the local card set while keeping the implementation static-first and card-centric.
