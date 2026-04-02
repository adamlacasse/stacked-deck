# Stacked Deck

Stacked Deck is a responsive web app that replaces the physical trivia card deck while preserving the social feel of playing with a real board game.

The app is a deck replacement, not a full trivia platform. The board, wedges, and around-the-table flow stay physical. This project only handles drawing cards, selecting a category, opening the selected question in a focused modal, revealing an answer, and moving to the next card.

## Current status

This repository now has a solid playable MVP:

- Vite + React + TypeScript app scaffold is in place
- product and data model direction are documented
- the starter screen has been replaced with a deck-style game shell
- two local decks now ship with the app: `General Knowledge` and a generated `CSC-6314 Study Guide`
- the start screen now lets you switch decks before beginning a run
- deck validation runs in development mode and throws loudly for malformed content (`src/data/validateDeck.ts`)
- session state is handled locally with React state + deck-specific `localStorage`
- cards are drawn without repeats within a session
- category selection opens a focused modal question state, then reveal swaps that same modal to an answer-only state
- the app currently supports next card and session reset actions from the active gameplay view
- card entrance and question panel transitions add a subtle deck feel
- a brief "Shuffling…" state plays on `startGame` and `restartGame`
- swipe-to-next (left or right) advances the card once an answer is revealed
- difficulty filter lets you limit draws to easy, medium, or hard cards before starting
- optional post-answer context panel shows explanation/source metadata on selected entries
- optional answer-state handoff can open ChatGPT in a new tab with a prefilled follow-up prompt for extra color
- if the unofficial ChatGPT URL prefill stops working, a future fallback would be to copy the generated prompt to the clipboard and then open `chatgpt.com`
- deck-specific category labels and prompts let study decks use course-native lanes without changing the underlying six-slot data model
- the CSC-6314 deck can be regenerated on demand from curated module files in the separate course repository
- automated tests in `src/test/` cover hook behavior, validation logic, and question-view rendering

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
5. Open a focused modal with the selected category question only
6. Reveal the answer in that same modal
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

type TriviaDeck = {
  id: string
  name: string
  categoryMeta?: Partial<Record<Category, {
    label: string
    prompt: string
    accent?: string
  }>>
  cards: TriviaCard[]
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
npm run generate:csc6314 -- --course-repo /Users/adamlacasse/Documents/Merrimack/Merrimack_CSC6314
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
7. Treat `src/data/csc-6314-deck.json` as generated output and edit the course repo source files instead.

### Current implementation snapshot

The main app flow currently lives in:

- `src/App.tsx`
- `src/hooks/useDeck.ts`
- `src/data/general-knowledge-deck.json` (general knowledge deck)
- `src/data/csc-6314-deck.json` (generated CSC-6314 study deck)
- `src/data/deck.ts` (deck registry + validation boundary)
- `src/data/validateDeck.ts` (deck validation, wired in at load time)
- `scripts/generate-csc6314-deck.mjs` (syncs curated module study cards from the course repo)
- `src/components/CardView.tsx`
- `src/components/CategoryList.tsx`
- `src/components/QuestionView.tsx`
- `src/test/useDeck.test.ts`
- `src/test/QuestionView.test.tsx`
- `src/test/validateDeck.test.ts`

This is enough to play through a full local deck on a single screen while preserving the spoiler-resistant category flow.

### Good next implementation slices

Build in this order:

1. Add broader component interaction tests for `CardView` and `CategoryList`.
2. Continue expanding source metadata for entries where the answer is disputed or has useful context.

### Near-term file shape

These names align with the current project direction:

- `src/types.ts`
- `src/data/general-knowledge-deck.json`
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

- "Add component tests for `CardView` and `CategoryList`, including category selection and next-card interactions."
- "Add keyboard interaction tests for the question modal (`Escape` dismiss in question state, focus move to Next card in answer state)."
- "Add richer source metadata for individual entries where the answer is disputed or has useful context."

## Scripts

- `npm run dev`: start the Vite dev server
- `npm run build`: type-check and build for production
- `npm run lint`: run ESLint
- `npm run generate:csc6314 -- --course-repo /absolute/path/to/Merrimack_CSC6314`: regenerate the CSC-6314 study deck from curated course materials
- `npm test`: run all tests with Vitest
- `npm run test:watch`: run tests in watch mode
- `npm run preview`: preview the production build locally

## Immediate next step

Add broader component interaction tests for `CardView` and `CategoryList`, then continue expanding deck metadata for disputed answers.
