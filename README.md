# Stacked Deck

Stacked Deck is a responsive web app that replaces the physical trivia card deck while preserving the social feel of playing with a real board game.

The app is a deck replacement, not a full trivia platform. The board, wedges, and around-the-table flow stay physical. This project only handles drawing cards, selecting a category, revealing a question, revealing an answer, and moving to the next card.

## Current status

This repository now has a solid playable MVP:

- Vite + React + TypeScript app scaffold is in place
- product and data model direction are documented
- the starter screen has been replaced with a deck-style game shell
- a local starter deck of 15 cards exists in `src/data/deck.ts`
- deck validation runs in development mode and throws loudly for malformed content (`src/data/validateDeck.ts`)
- session state is handled locally with React state + `localStorage`
- cards are drawn without repeats within a session
- the app currently supports category selection, question reveal, answer reveal, next card, and session reset
- card entrance and question panel transitions add a subtle deck feel
- 24 automated tests in `src/test/` cover hook behavior and validation logic

Still intentionally missing:

- shuffle moment on game start
- swipe-to-next gesture
- deck content as JSON instead of TypeScript
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

- Node.js **20.19+**, **22.13+**, or **24+** (required by Vite 8, Vitest 4, and jsdom 29)
- npm

### Install

After cloning or pulling new changes, always run:

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
npm test
```

## Agent-first workflow

This repository is intended to work well with coding agents. The fastest way to keep progress clean is to treat the docs as the spec and build in thin, reviewable slices.

### Working rules for agents

1. Read `AGENTS.md` and the docs before editing code.
2. Keep changes local and avoid touching unrelated files.
3. Preserve the six-category card model.
4. Prefer static data, local state, and small components.
5. Validate changes with `npm run lint`, `npm run build`, and `npm test` when relevant.
6. If a code change shifts product direction, update the docs in the same pass.

### Current implementation snapshot

The main app flow currently lives in:

- `src/App.tsx`
- `src/hooks/useDeck.ts`
- `src/data/deck.ts` (15-card starter deck)
- `src/data/validateDeck.ts` (deck validation, wired in at load time)
- `src/components/CardView.tsx`
- `src/components/CategoryList.tsx`
- `src/components/QuestionView.tsx`
- `src/test/useDeck.test.ts` and `src/test/validateDeck.test.ts`

This is enough to play through a full local deck on a single screen while preserving the spoiler-resistant category flow.

### Good next implementation slices

Build in this order:

1. Add a shuffle moment or brief animation on `startGame` / `restartGame`.
2. Add swipe-to-next as a progressive enhancement using pointer events.
3. Move deck content from TypeScript to local JSON to separate authoring from compilation.

### Near-term file shape

These names align with the current project direction:

- `src/types.ts`
- `src/data/deck.ts`
- `src/data/validateDeck.ts`
- `src/hooks/useDeck.ts`
- `src/components/CardView.tsx`
- `src/components/CategoryList.tsx`
- `src/components/QuestionView.tsx`
- `src/test/*.test.ts`

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

- "Add a brief shuffle moment when `startGame` is called so the deck-dealing feel is stronger."
- "Add swipe-to-next as a progressive enhancement using pointer events."
- "Move the starter deck content from `src/data/deck.ts` to `src/data/deck.json` and import it through validation."

## Scripts

- `npm run dev`: start the Vite dev server
- `npm run build`: type-check and build for production
- `npm run lint`: run ESLint
- `npm test`: run all tests with Vitest
- `npm run test:watch`: run tests in watch mode
- `npm run preview`: preview the production build locally

## Immediate next step

Add deck validation and expand the local card set while keeping the implementation static-first and card-centric.
